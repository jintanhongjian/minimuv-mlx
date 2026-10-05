from __future__ import annotations

import base64
import hashlib
import json
import os
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np
from safetensors.numpy import save_file

from webapp import local_models


class MlxWeightsReadinessTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.first = self.root / "model-00001-of-00002.safetensors"
        self.second = self.root / "model-00002-of-00002.safetensors"
        save_file({"layer.weight": np.zeros((2, 2), dtype=np.float32)}, self.first)
        save_file({"layer.scales": np.ones((2,), dtype=np.float32)}, self.second)
        self.index = self.root / "model.safetensors.index.json"
        self.index.write_text(json.dumps({"weight_map": {
            "layer.weight": "model-00001-of-00005.safetensors"
        }}))

    def test_stale_shard_names_accept_complete_actual_weights(self):
        self.assertTrue(local_models._mlx_weights_ready(self.root))
        with patch.object(local_models, "_mlx_weights_ready", return_value=True) as check:
            model = self.root / "ltx"
            model.mkdir()
            for name in local_models.LTX_FILES:
                (model / name).write_bytes(b"weights")
            for name in ("config.json", "tokenizer.json", "tokenizer_config.json"):
                (self.root / name).write_text("{}")
            with patch.object(local_models, "model_download_progress", return_value={}):
                self.assertTrue(local_models.status(
                    "ltx-2.3-distilled-q4", model, self.root
                )["model_ready"])
            check.assert_called_once_with(self.root)

    def test_missing_shard_is_rejected_even_when_index_coverage_is_complete(self):
        self.second.unlink()
        with self.assertLogs(local_models.logger, level="WARNING"):
            self.assertFalse(local_models._mlx_weights_ready(self.root))

    def test_missing_indexed_tensor_is_rejected(self):
        self.index.write_text(json.dumps({"weight_map": {"missing": "old.safetensors"}}))
        with self.assertLogs(local_models.logger, level="WARNING"):
            self.assertFalse(local_models._mlx_weights_ready(self.root))

    def test_truncated_corrupt_and_duplicate_weights_are_rejected(self):
        original = self.second.read_bytes()
        for data in (original[:-1], b"not-safetensors"):
            with self.subTest(data=data):
                self.second.write_bytes(data)
                with self.assertLogs(local_models.logger, level="WARNING"):
                    self.assertFalse(local_models._mlx_weights_ready(self.root))
        save_file({"layer.weight": np.zeros((2, 2), dtype=np.float32)}, self.second)
        with self.assertLogs(local_models.logger, level="WARNING"):
            self.assertFalse(local_models._mlx_weights_ready(self.root))

    def test_single_file_and_unindexed_shards_match_loader_discovery(self):
        self.index.unlink()
        self.assertTrue(local_models._mlx_weights_ready(self.root))
        self.first.unlink()
        self.second.unlink()
        save_file({"weight": np.zeros((2,), dtype=np.float32)}, self.root / "model.safetensors")
        self.assertTrue(local_models._mlx_weights_ready(self.root))

    def test_invalid_index_is_rejected(self):
        self.index.write_text("{")
        with self.assertLogs(local_models.logger, level="WARNING"):
            self.assertFalse(local_models._mlx_weights_ready(self.root))


class DownloadProgressTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.models = self.root / "models"
        self.code = self.root / "third_party"
        self.code.mkdir()
        spec = {"revision": "pinned", "files": {"weights.safetensors": 100}}
        catalog = {name: spec for name in (
            "flux2-klein-4b", "ltx-2.3-distilled-q4", "gemma-3-12b-it-4bit")}
        (self.code / "local_model_downloads.json").write_text(json.dumps(catalog))
        (self.code / "local_models.json").write_text(json.dumps({
            "models": {name: {"revision": "pinned"} for name in catalog}
        }))
        for key, value in [("PROJECT_ROOT", self.root), ("MODEL_ROOT", self.models),
                           ("GEMMA_PATH", self.models / "gemma-3-12b-it-4bit")]:
            patcher = patch.object(local_models, key, value)
            patcher.start()
            self.addCleanup(patcher.stop)

    def partial(self, directory, size, suffix, age=0):
        cache = directory / ".cache/huggingface/download"
        cache.mkdir(parents=True, exist_ok=True)
        digest = base64.urlsafe_b64encode(hashlib.sha1(b"weights.safetensors.metadata").digest()).decode()
        path = cache / f"{digest}.etag.{suffix}.incomplete"
        path.write_bytes(b"x" * size)
        os.utime(path, (time.time() - age, time.time() - age))
        return path

    def test_latest_attempt_only_and_no_unrelated_cache(self):
        path = local_models.model_path("flux2-klein-4b")
        self.partial(path, 90, "old", age=600)
        self.partial(path, 20, "new")
        (path / "unrelated.bin").write_bytes(b"x" * 300)
        progress = local_models.model_download_progress("flux2-klein-4b")
        self.assertEqual(progress["downloaded_bytes"], 20)
        self.assertEqual(progress["download_percent"], 20)
        self.assertEqual(progress["download_state"], "downloading")

    def test_empty_paused_and_complete_states(self):
        path = local_models.model_path("flux2-klein-4b")
        self.assertEqual(local_models.model_download_progress("flux2-klein-4b")["download_state"],
                         "not_started")
        self.partial(path, 70, "old", age=600)
        self.assertEqual(local_models.model_download_progress("flux2-klein-4b")["download_state"],
                         "paused")
        (path / "weights.safetensors").write_bytes(b"x" * 100)
        progress = local_models.model_download_progress("flux2-klein-4b")
        self.assertEqual(progress["download_percent"], 100)
        self.assertEqual(progress["downloaded_bytes"], 100)
        self.assertFalse(progress["download_in_progress"])

    def test_ltx_includes_shared_encoder(self):
        self.partial(local_models.model_path("ltx-2.3-distilled-q4"), 80, "ltx")
        self.partial(local_models.GEMMA_PATH, 20, "gemma")
        progress = local_models.model_download_progress("ltx-2.3-distilled-q4")
        self.assertEqual(progress["total_bytes"], 200)
        self.assertEqual(progress["download_percent"], 50)
        self.assertEqual(len(progress["download_components"]), 2)

    def test_oversized_partial_is_not_reported_complete(self):
        self.partial(local_models.model_path("flux2-klein-4b"), 150, "oversized")
        progress = local_models.model_download_progress("flux2-klein-4b")
        self.assertEqual(progress["downloaded_bytes"], 100)
        self.assertEqual(progress["download_percent"], 99.9)
        self.assertNotEqual(progress["download_state"], "completed")

    def test_catalog_failure_is_explicit(self):
        (self.code / "local_model_downloads.json").write_text("{")
        with self.assertLogs(local_models.logger, level="WARNING"):
            progress = local_models.model_download_progress("flux2-klein-4b")
        self.assertEqual(progress["download_state"], "error")
        self.assertIsNone(progress["download_percent"])
        self.assertTrue(progress["download_error"])

    def test_hub_metadata_basename_and_nested_partial_layout(self):
        catalog = json.loads((self.code / "local_model_downloads.json").read_text())
        catalog["flux2-klein-4b"]["files"] = {"text_encoder/connector.safetensors": 100}
        (self.code / "local_model_downloads.json").write_text(json.dumps(catalog))
        cache = local_models.model_path("flux2-klein-4b") / ".cache/huggingface/download/text_encoder"
        cache.mkdir(parents=True)
        # Actual Hub hash for connector.safetensors.metadata, not the weight basename.
        (cache / "Qygu2UlLd68IVplp1ztxKiffX0Y=.etag.attempt.incomplete").write_bytes(b"x" * 25)
        progress = local_models.model_download_progress("flux2-klein-4b")
        self.assertEqual(progress["download_percent"], 25)
        self.assertEqual(progress["download_state"], "downloading")


if __name__ == "__main__":
    unittest.main()
