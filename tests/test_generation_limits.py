from __future__ import annotations

import unittest
from unittest.mock import patch

from webapp import generation_limits, server, workflows
from test_workflows import make_payload


class GenerationLimitsTests(unittest.TestCase):
    def test_every_whole_second_in_each_video_range_reaches_both_validators(self):
        for model, (minimum, maximum) in generation_limits.VIDEO_DURATIONS.items():
            steps = generation_limits.sampling_range(model)["default"]
            for duration in range(minimum, maximum + 1):
                with self.subTest(model=model, duration=duration):
                    settings = server._validate_generation({
                        "model": model, "prompt": "A boat", "duration": duration, "steps": steps,
                    })
                    self.assertEqual(settings["duration"], duration)
                    divisor, remainder = (8, 1) if model.startswith("ltx-") else (17, 5)
                    self.assertEqual(settings["num_frames"] % divisor, remainder)
                    self.assertGreaterEqual(settings["num_frames"], duration * 24)
                    payload = make_payload("music3")
                    payload.update(model=model, shot_mode="independent")
                    payload["shots"][0].update(duration=duration, steps=steps)
                    self.assertEqual(workflows._validate_payload(payload)["shots"][0]["duration"], duration)
            for duration in (minimum - 0.01, maximum + 0.01, True, float("nan"), float("inf")):
                with self.subTest(model=model, invalid=duration):
                    with self.assertRaisesRegex(ValueError, "invalid_duration"):
                        server._validate_generation({
                            "model": model, "prompt": "A boat", "duration": duration, "steps": steps,
                        })

    def test_all_adjustable_integer_steps_and_fixed_recipes(self):
        for model, kind, turbo in (("h3", "video", True), ("h3", "video", False),
                                   ("music3", "music", True)):
            limits = generation_limits.sampling_range(model, kind, turbo)
            for steps in range(limits["min"], limits["max"] + 1):
                with self.subTest(model=model, turbo=turbo, steps=steps):
                    payload = {"model": model, "prompt": "A boat", "steps": steps, "turbo": turbo}
                    if kind == "music":
                        payload["lyrics_mode"] = "instrumental"
                        result = server._validate_music_generation(payload)
                    else:
                        result = server._validate_generation(payload)
                        workflow = make_payload()
                        workflow["shots"][0].update(steps=steps, turbo=turbo)
                        self.assertEqual(workflows._validate_payload(workflow)["shots"][0]["steps"], steps)
                    self.assertEqual(result["steps"], steps)
            for steps in (limits["min"] - 1, limits["max"] + 1, True, 4.5, float("nan"), float("inf")):
                with self.subTest(invalid=steps), self.assertRaises(ValueError):
                    generation_limits.validate_steps(steps, model, kind, turbo)
        for model in generation_limits.VIDEO_DURATIONS:
            limits = generation_limits.sampling_range(model)
            if not limits.get("fixed"):
                continue
            self.assertEqual(generation_limits.validate_steps(limits["default"], model), limits["default"])
            for steps, turbo in ((limits["default"] + 1, True), (limits["default"], False)):
                with self.subTest(model=model), self.assertRaises(ValueError):
                    generation_limits.validate_steps(steps, model, turbo=turbo)

    def test_music_fractional_segments_remain_compatible_and_capabilities_are_honest(self):
        settings = server._validate_music_generation({
            "prompt": "Soft piano", "lyrics_mode": "instrumental", "duration": 301 / 2, "steps": 17,
        })
        self.assertEqual(settings["duration"], 150.5)
        capabilities = generation_limits.capabilities()
        self.assertEqual(capabilities["duration_limits"]["music"]["music3"]["max"], 300)
        for key in ("duration_limits", "sampling_limits"):
            self.assertEqual(capabilities[key]["music"]["yue2-3b-8bit"], {"automatic": True})
        capabilities["sampling_limits"]["music"]["music3"]["max"] = 999
        self.assertEqual(generation_limits.sampling_range("music3", "music")["max"], 30)

    def test_storyboard_runtime_contract_is_bound_to_the_video_not_text_model(self):
        for model, duration in (("h3", 7), ("h3-fasth3-vsa-q8", 13),
                                ("ltx-2.3-distilled-q4", 1), ("ltx-2.3-distilled-q8", 20)):
            settings = server._validate_storyboard_request({
                "story": "A boat", "model": "text-local", "target_model": model,
                "shot_duration": duration, "total_duration": duration * 2,
            })
            self.assertEqual(settings["video_model"], model)
            shot = {"title": "A boat", "prompt": "A boat", "music_prompt": "Piano", "duration": duration}
            with patch.object(server, "_local_text_models", return_value=[{"id": "text-local"}]), \
                    patch.object(server, "_request_local_text_json",
                                 return_value={"shots": [shot, shot]}) as request:
                self.assertEqual(len(server._storyboard_with_local_model(settings)["shots"]), 2)
                minimum, maximum = generation_limits.duration_range(model)
                self.assertIn(f"between {minimum} and {maximum}", request.call_args.args[1])
                request.return_value = {"shots": [shot, {**shot, "duration": duration + 0.5}]}
                with self.assertRaises(RuntimeError):
                    server._storyboard_with_local_model(settings)
        for target, duration in (("h3", 1), ("h3", 20), ("unknown", 7)):
            with self.assertRaises(ValueError):
                server._validate_storyboard_request({
                    "story": "A boat", "model": "text-local", "target_model": target,
                    "shot_duration": duration, "total_duration": duration * 2,
                })


if __name__ == "__main__":
    unittest.main()
