import io
import json
import tempfile
import unittest
import runpy
import sys
from collections import deque
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from webapp import server


class GenerationTokenTests(unittest.TestCase):
    def test_music3_missing_usage_is_not_zero(self):
        for count, expected in ((None, "Token usage unavailable"), (0, "TOKENS: 0"), (42, "TOKENS: 42")):
            with self.subTest(count=count), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                lyrics = root / "lyrics.txt"
                lyrics.write_text("")
                utils = MagicMock()
                utils.load_model.return_value.generate.return_value = [
                    SimpleNamespace(audio="audio", sample_rate=48000, token_count=count)
                ]
                stdout = io.StringIO()
                with patch.dict(sys.modules, {
                    "mlx": MagicMock(), "mlx.core": MagicMock(),
                    "mlx_audio": MagicMock(), "mlx_audio.audio_io": MagicMock(),
                    "mlx_audio.music": MagicMock(), "mlx_audio.music.utils": utils,
                }), patch.object(sys, "argv", ["music3_generate.py", "--model", "model",
                                             "--caption", "Song", "--lyrics-file", str(lyrics),
                                             "--output", str(root / "song.wav")]), \
                        patch("sys.stdout", stdout):
                    runpy.run_path(str(server.MUSIC_GENERATE_SCRIPT), run_name="__main__")
                self.assertIn(expected, stdout.getvalue())
                if count is None:
                    self.assertNotIn("TOKENS: 0", stdout.getvalue())

    def test_geometry_for_every_visual_model(self):
        self.assertEqual(server._visual_token_stages("video", {
            "width": 1344, "height": 768, "num_frames": 39,
        }), {"output": 12 * 42 * 24})
        for model in server.local_models.VIDEO_MODELS:
            self.assertEqual(server._visual_token_stages("video", {
                "model": model, "width": 768, "height": 448, "num_frames": 121,
            }), {"stage1": 16 * 12 * 7, "stage2": 16 * 24 * 14})
        for model, grid in (("hidream", 32), ("flux2-klein-4b", 16), ("z-image-turbo", 16)):
            self.assertEqual(server._visual_token_stages("image", {
                "model": model, "width": 2048, "height": 2048,
            }), {"output": (2048 // grid) ** 2})

    def test_reported_usage_is_validated_and_not_double_counted(self):
        job_id = "token-test"
        with patch.dict(server._jobs, {job_id: {"logs": deque()}}):
            for usage in ({"total_tokens": 10}, {"prompt_tokens": 3, "completion_tokens": 7},
                          {"input_tokens": 3, "output_tokens": 7}):
                server._record_token_usage(job_id, {"usage": usage})
                self.assertEqual(server._jobs[job_id]["tokens"], 10)
            for usage in ({"total_tokens": True}, {"total_tokens": -1},
                          {"total_tokens": "5"}, {"input_tokens": -1, "output_tokens": 2}, []):
                with self.assertRaises(RuntimeError):
                    server._record_token_usage(job_id, {"usage": usage})
            server._record_token_usage(job_id, {"usage": {"total_tokens": 0}})
            self.assertEqual(server._jobs[job_id]["tokens"], 0)

    def test_h3_stream_captures_usage_and_actual_output_geometry(self):
        job_id = "stream-test"
        complete = {"type": "complete", "width": 64, "height": 32, "frames": 5,
                    "usage": {"total_tokens": 123}}
        response = io.BytesIO(("data: " + json.dumps(complete) + "\n").encode())
        with patch.dict(server._jobs, {job_id: {"logs": deque(), "cancel_requested": False}}), \
                patch.object(server, "urlopen", return_value=response), \
                patch.object(server, "_decode_model_media", return_value=(Path("out.mp4"), None)):
            server._generate(job_id, "h3", server._validate_generation({"prompt": "Film"}), Path("out.mp4"))
            self.assertEqual(server._jobs[job_id]["tokens"], 123)
            self.assertEqual(server._jobs[job_id]["visual_token_stages"], {"output": 4})
        self.assertTrue(response.closed)

    def test_visual_history_round_trip_does_not_invent_runtime_usage(self):
        with tempfile.TemporaryDirectory() as temp, patch.object(server, "OUTPUT_ROOT", Path(temp)):
            item_id = str(server.uuid.uuid4())
            path = Path(temp) / f"h3-{item_id}.mp4"
            path.write_bytes(b"media")
            job = {"id": item_id, "kind": "video", "created_at": 1, "prompt": "Film"}
            settings = server._validate_generation({"model": "ltx-2.3-distilled-q4", "prompt": "Film"})
            server._persist_history(job, [path], settings)
            public = server._public_job({**job, "status": "completed"})
            restored = server._history_items()[0]
            self.assertIsNone(restored["tokens"])
            self.assertIsNone(public["tokens"])
            self.assertEqual(restored["visual_tokens"], public["visual_tokens"])
            self.assertEqual(restored["visual_token_stages"], public["visual_token_stages"])
            self.assertEqual(public["visual_tokens"], public["visual_token_stages"]["stage2"])


if __name__ == "__main__":
    unittest.main()
