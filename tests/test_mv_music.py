from __future__ import annotations

import io
import json
import struct
import tempfile
import threading
import unittest
import wave
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from webapp import mv_music, mv_projects, server


def wav_bytes(channels=1, frames=8000):
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as audio:
        audio.setnchannels(channels)
        audio.setsampwidth(2)
        audio.setframerate(8000)
        audio.writeframes(b"\0\0" * channels * frames)
    return buffer.getvalue()


class MVMusicTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.content = wav_bytes()

    def upload(self, content=None):
        content = self.content if content is None else content
        return mv_music.save_upload(self.root, io.BytesIO(content), len(content), "test.wav")

    def test_private_streamed_upload_and_draft_deletion_keep_music(self):
        item = self.upload()
        self.assertEqual(item["duration"], 1)
        self.assertEqual(mv_music.list_music(self.root), [item])
        source = mv_music.resolve(self.root, item["id"])
        path = Path(source["path"])
        self.assertEqual(path.read_bytes(), self.content)
        self.assertEqual(path.stat().st_mode & 0o777, 0o600)
        self.assertEqual(path.parent.stat().st_mode & 0o777, 0o700)
        draft = mv_projects.save_project(self.root, {
            "name": "Upload draft", "music_source_id": item["id"], "prompt": "", "aspect": "16:9"
        }, lambda value: mv_music.resolve(self.root, value))
        mv_projects.delete_project(self.root, draft["id"], draft["revision"])
        self.assertEqual(path.read_bytes(), self.content)
        self.assertEqual(mv_music.list_music(self.root), [item])

    def test_invalid_truncated_multichannel_and_bad_chunk_lengths_are_rejected(self):
        for content in (b"fake wav", self.content[:-1], wav_bytes(channels=3),
                        self.content[:40] + b"\xff\xff\xff\xff" + self.content[44:]):
            with self.subTest(size=len(content)), self.assertRaisesRegex(ValueError, "invalid_mv_wav"):
                self.upload(content)
            self.assertEqual(mv_music.list_music(self.root), [])
        with self.assertRaises(ValueError):
            mv_music.save_upload(self.root, io.BytesIO(self.content[:-1]), len(self.content), "test.wav")
        self.assertEqual(list((self.root / "mv" / "music").iterdir()), [])

    def test_stereo_ieee_float_and_extensible_pcm_are_supported(self):
        stereo = wav_bytes(channels=2)
        self.assertEqual(self.upload(stereo)["channels"], 2)
        floating = bytearray(self.content)
        struct.pack_into("<H", floating, 20, 3)
        struct.pack_into("<I", floating, 28, 8000 * 4)
        struct.pack_into("<HH", floating, 32, 4, 32)
        self.assertEqual(self.upload(bytes(floating))["duration"], 0.5)
        extension = (struct.pack("<HHI", 22, 16, 1)
                     + b"\x01\0\0\0\0\0\x10\0\x80\0\0\xaa\0\x38\x9b\x71")
        extensible = bytearray(self.content[:16] + struct.pack("<I", 40)
                               + self.content[20:36] + extension + self.content[36:])
        struct.pack_into("<I", extensible, 4, len(extensible) - 8)
        struct.pack_into("<H", extensible, 20, 0xFFFE)
        self.assertEqual(self.upload(bytes(extensible))["duration"], 1)
        struct.pack_into("<H", extensible, 36, 4096)
        with self.assertRaisesRegex(ValueError, "invalid_mv_wav"):
            self.upload(bytes(extensible))

    def test_final_odd_pcm8_chunk_without_padding_is_supported(self):
        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as audio:
            audio.setnchannels(1)
            audio.setsampwidth(1)
            audio.setframerate(8000)
            audio.writeframes(b"\x80" * 3)
        self.assertEqual(self.upload(buffer.getvalue())["duration"], 3 / 8000)

    def test_size_duration_capacity_and_path_limits(self):
        with patch.object(mv_music, "MAX_UPLOAD_BYTES", len(self.content) - 1):
            with self.assertRaisesRegex(ValueError, "mv_wav_limit"):
                self.upload()
        with patch.object(mv_music, "MAX_DURATION", 0.5):
            with self.assertRaisesRegex(ValueError, "mv_wav_limit"):
                self.upload()
        with self.assertRaisesRegex(ValueError, "invalid_mv_wav"):
            mv_music.save_upload(self.root, io.BytesIO(self.content), len(self.content), "../test.wav")
        with patch.object(mv_music, "MAX_TRACKS", 1):
            item = self.upload()
            with self.assertRaisesRegex(ValueError, "mv_music_storage_full"):
                self.upload()
        self.assertEqual(mv_music.list_music(self.root), [item])

    def test_symlinks_and_corrupt_metadata_fail_explicitly(self):
        item = self.upload()
        path = self.root / "mv" / "music" / f"{item['id']}.json"
        data = path.read_bytes()
        path.write_text("{broken")
        with self.assertRaisesRegex(RuntimeError, "mv_music_storage_invalid"):
            mv_music.list_music(self.root)
        path.write_bytes(data)
        audio = path.with_suffix(".wav")
        external = self.root / "external.wav"
        audio.rename(external)
        audio.symlink_to(external)
        with self.assertRaisesRegex(RuntimeError, "mv_music_storage_invalid"):
            mv_music.resolve(self.root, item["id"])
        self.assertEqual(external.read_bytes(), self.content)

    def test_legacy_drafts_merge_alongside_uploaded_music(self):
        item = self.upload()
        draft = mv_projects.save_project(self.root, {
            "name": "Keep", "music_source_id": item["id"], "prompt": "", "aspect": "16:9"
        }, lambda value: mv_music.resolve(self.root, value))
        legacy = self.root / "mv-projects"
        legacy.mkdir()
        path = self.root / "mv" / f"{draft['id']}.json"
        path.rename(legacy / path.name)
        self.assertEqual(mv_projects.list_projects(self.root), [draft])
        self.assertEqual(mv_music.list_music(self.root), [item])

    def test_http_upload_preview_range_reopen_and_origin_guard(self):
        with patch.object(server, "OUTPUT_ROOT", self.root):
            httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.WebHandler)
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            base = f"http://127.0.0.1:{httpd.server_port}"
            try:
                def upload(origin=None):
                    headers = {"Content-Type": "audio/wav"}
                    if origin:
                        headers["Origin"] = origin
                    return urlopen(Request(base + "/api/mv-music?name=test.wav",
                                           data=self.content, headers=headers, method="POST"))
                with self.assertRaises(HTTPError) as failure:
                    upload("https://untrusted.invalid")
                self.assertEqual(failure.exception.code, 403)
                failure.exception.close()
                for endpoint, headers, expected_status in (
                    ("/api/mv-music", {}, 400),
                    ("/api/mv-music?name=test.wav&path=extra", {}, 400),
                    ("/api/mv-music?name=test.wav", {"Transfer-Encoding": "chunked"}, 400),
                    ("/api/mv-music?name=test.wav", {"Content-Length": "invalid"}, 400),
                    ("/api/mv-music?name=test.wav", {"Content-Length": str(512 * 1024 * 1024 + 1)}, 413),
                ):
                    with self.subTest(endpoint=endpoint, headers=headers), self.assertRaises(HTTPError) as failure:
                        urlopen(Request(base + endpoint, data=b"invalid", headers=headers, method="POST"))
                    self.assertEqual(failure.exception.code, expected_status)
                    failure.exception.close()
                with upload() as response:
                    self.assertEqual(response.status, 201)
                    item = json.loads(response.read())["item"]
                with urlopen(base + "/api/mv-music") as response:
                    self.assertEqual(json.loads(response.read())["items"], [item])
                with urlopen(Request(base + item["audio_url"], headers={"Range": "bytes=0-43"})) as response:
                    self.assertEqual(response.status, 206)
                    self.assertEqual(response.read(), self.content[:44])
                draft = {"name": "HTTP upload", "music_source_id": item["id"], "prompt": "", "aspect": "16:9"}
                with urlopen(Request(base + "/api/mv-projects", data=json.dumps(draft).encode(),
                                     headers={"Content-Type": "application/json"}, method="POST")) as response:
                    project = json.loads(response.read())["project"]
                self.assertTrue(project["music_available"])
                self.assertEqual(project["audio_url"], item["audio_url"])
                with urlopen(base + "/api/mv-projects") as response:
                    self.assertEqual(json.loads(response.read())["items"], [project])
                with urlopen(Request(base + f"/api/mv-projects/{project['id']}",
                                     data=json.dumps({"revision": project["revision"]}).encode(),
                                     headers={"Content-Type": "application/json"}, method="DELETE")) as response:
                    self.assertEqual(response.status, 200)
                with urlopen(base + item["audio_url"]) as response:
                    self.assertEqual(response.read(), self.content)
            finally:
                httpd.shutdown()
                httpd.server_close()
                thread.join()


if __name__ == "__main__":
    unittest.main()
