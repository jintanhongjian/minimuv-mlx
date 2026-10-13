from __future__ import annotations

import base64
import io
import json
import shutil
import subprocess
import tempfile
import unittest
import wave
from collections import deque
from pathlib import Path
from unittest.mock import patch

from PIL import Image

from webapp import h3_transport, local_models, server


class H3TransportTests(unittest.TestCase):
    def test_all_canvases_and_durations_preserve_frames_and_response_budget(self):
        for quality in ("preview", "standard", "high"):
            for aspect in server.ASPECTS.values():
                width, height = local_models.video_canvas(aspect, quality, "h3")
                for seconds in (5, 8, 10, 15):
                    frames = server._align_frames(seconds * 24)
                    with self.subTest(quality=quality, aspect=aspect, seconds=seconds):
                        plan = h3_transport.windows(frames, width, height)
                        self.assertEqual(sum(retained for _, _, retained in plan), frames)
                        for index, (requested, skip, retained) in enumerate(plan):
                            self.assertEqual(requested % 17, 5)
                            self.assertLessEqual(requested * width * height * 3, h3_transport.MAX_RGB_BYTES)
                            self.assertEqual(skip, int(index > 0))
                            self.assertLessEqual(skip + retained, requested)
        self.assertEqual(h3_transport.windows(362, 1792, 1024),
                         [(141, 0, 141), (141, 1, 140), (90, 1, 81)])

    def test_exact_transport_threshold_and_impossible_canvas(self):
        with patch.object(h3_transport, "MAX_RGB_BYTES", 22 * 32 * 32 * 3):
            self.assertEqual(h3_transport.windows(22, 32, 32), [(22, 0, 22)])
            self.assertEqual(h3_transport.windows(39, 32, 32), [(22, 0, 22), (22, 1, 17)])
        with patch.object(h3_transport, "MAX_RGB_BYTES", 4 * 32 * 32 * 3):
            with self.assertRaisesRegex(ValueError, "transport_limit"):
                h3_transport.windows(22, 32, 32)

    @staticmethod
    def event(frames, index, *, audio=True):
        # Distinct frame values prove overlap removal and final trimming.
        rgb = b"".join(bytes([index * 40 + frame]) * (32 * 32 * 3) for frame in range(frames))
        event = {"type": "complete", "format": "rgb8", "width": 32, "height": 32,
                 "frames": frames, "fps": 24, "data": base64.b64encode(rgb).decode(),
                 "usage": {"total_tokens": 10 + index}}
        if audio:
            event.update(audio_format="pcm_s16le", audio_sample_rate=24000, audio_channels=1,
                         audio_data=base64.b64encode(
                             bytes([index, 0]) * (frames * 1000)).decode())
        return event

    def run_split(self, root, events, encoder):
        job_id = "transport-test"
        settings = {"width": 32, "height": 32, "num_frames": 56, "seed": 2**32 - 1,
                    "steps": 4, "turbo": True, "prompt": "Film", "first_frame_image": "original"}
        requests = []

        def respond(request, timeout):
            requests.append(json.loads(request.data))
            event = events[len(requests) - 1]
            return io.BytesIO(("data: " + json.dumps(event) + "\n").encode())

        job = {"logs": deque(), "cancel_requested": False}
        with patch.object(h3_transport, "MAX_RGB_BYTES", 22 * 32 * 32 * 3), \
                patch.dict(server._jobs, {job_id: job}), \
                patch.object(server, "urlopen", side_effect=respond), \
                patch.object(server, "_encode_h3_media", side_effect=encoder):
            result = server._generate(job_id, "h3", settings, root / "result.mp4")
        return result, requests, job

    def test_stitching_rgb_pcm_tail_conditioning_seeds_and_usage(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            observed = {}

            def encode(raw, audio, output, width, height, fps):
                rgb = raw.read_bytes()
                observed["frames"] = list(rgb[::32 * 32 * 3])
                self.assertEqual((width, height, fps), (32, 32, 24))
                with wave.open(str(audio)) as wav:
                    observed["audio_frames"] = wav.getnframes()
                    observed["audio"] = wav.readframes(wav.getnframes())
                output.write_bytes(b"encoded")

            result, requests, job = self.run_split(root, [self.event(22, i) for i in range(3)], encode)
            self.assertEqual(observed["frames"], list(range(22)) + list(range(41, 62)) + list(range(81, 94)))
            self.assertEqual(observed["audio_frames"], 56000)
            self.assertEqual(observed["audio"], b"\x00\x00" * 22000 + b"\x01\x00" * 21000 + b"\x02\x00" * 13000)
            self.assertEqual([r["num_frames"] for r in requests], [22, 22, 22])
            self.assertEqual([r["seed"] for r in requests], [2**32 - 1, 0, 1])
            self.assertEqual(requests[0]["first_frame_image"], "original")
            for index in (1, 2):
                with Image.open(io.BytesIO(base64.b64decode(requests[index]["first_frame_image"]))) as image:
                    self.assertEqual(image.size, (32, 32))
                    self.assertEqual(image.getpixel((0, 0)), ((index - 1) * 40 + 21,) * 3)
            self.assertEqual(job["tokens"], 33)
            self.assertEqual(job["visual_token_stages"], {"output": 21})
            self.assertEqual(set(root.iterdir()), set(result))

    def test_no_audio_and_missing_usage_remain_unavailable(self):
        with tempfile.TemporaryDirectory() as directory:
            events = [self.event(22, i, audio=False) for i in range(3)]
            del events[1]["usage"]
            def encode(raw, audio, output, *geometry):
                self.assertIsNone(audio)
                output.write_bytes(b"encoded")
            result, _, job = self.run_split(Path(directory), events, encode)
            self.assertIsNone(result[1])
            self.assertIsNone(job["tokens"])

    def test_native_40hz_audio_rounding_is_logged_and_timing_is_preserved(self):
        job_id = "audio-rounding"
        settings = {"width": 32, "height": 32, "num_frames": 90, "seed": 0,
                    "steps": 4, "turbo": True, "prompt": "Film"}
        def respond(request, timeout):
            frames = json.loads(request.data)["num_frames"]
            event = self.event(frames, 0)
            event["audio_sample_rate"] = 32000
            event["audio_data"] = base64.b64encode(b"\0\0" * (round(frames * 5 / 3) * 800)).decode()
            return io.BytesIO(("data: " + json.dumps(event) + "\n").encode())
        def encode(raw, audio, output, *geometry):
            with wave.open(str(audio)) as wav:
                self.assertEqual(wav.getnframes(), 120000)
            output.write_bytes(b"encoded")
        job = {"logs": deque(), "cancel_requested": False}
        with tempfile.TemporaryDirectory() as directory, \
                patch.object(h3_transport, "MAX_RGB_BYTES", 56 * 32 * 32 * 3), \
                patch.dict(server._jobs, {job_id: job}), \
                patch.object(server, "urlopen", side_effect=respond), \
                patch.object(server, "_encode_h3_media", side_effect=encode):
            server._generate(job_id, "h3", settings, Path(directory) / "output.mp4")
        self.assertTrue(any("padding 267 samples" in log for log in job["logs"]))

    def test_bad_segment_and_cancellation_do_not_publish_or_leave_temporary_files(self):
        for failure in ("geometry", "audio", "short-audio", "stream", "cancel"):
            with self.subTest(failure=failure), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                events = [self.event(22, i) for i in range(3)]
                if failure == "geometry":
                    events[1]["fps"] = 25
                elif failure == "audio":
                    events[1]["audio_channels"] = 2
                elif failure == "short-audio":
                    events[1]["audio_data"] = base64.b64encode(b"\0\0" * 20000).decode()
                elif failure == "stream":
                    events[1] = {"type": "error", "message": "backend failed"}
                def encode(raw, audio, output, *geometry):
                    output.write_bytes(b"partial")
                    raise server.GenerationCancelled("cancelled")
                with self.assertRaises(server.GenerationCancelled if failure == "cancel" else RuntimeError):
                    self.run_split(root, events, encode)
                self.assertEqual(list(root.iterdir()), [])

    @unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "ffmpeg required")
    def test_real_encoder_keeps_exact_frame_count_canvas_and_audio_duration(self):
        with tempfile.TemporaryDirectory() as directory:
            encoder = server._encode_h3_media
            (video, audio), _, _ = self.run_split(Path(directory),
                [self.event(22, i) for i in range(3)], encoder)
            metadata = json.loads(subprocess.run(
                [shutil.which("ffprobe"), "-v", "error", "-show_streams", "-of", "json", str(video)],
                capture_output=True, text=True, check=True).stdout)
            stream = next(s for s in metadata["streams"] if s["codec_type"] == "video")
            self.assertEqual((stream["width"], stream["height"], int(stream["nb_frames"])), (32, 32, 56))
            self.assertAlmostEqual(float(stream["duration"]), 56 / 24, places=4)
            with wave.open(str(audio)) as wav:
                self.assertEqual(wav.getnframes(), 56000)


if __name__ == "__main__":
    unittest.main()
