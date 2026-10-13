"""Run bundled MFLUX image pipelines with strictly local model weights."""

import argparse


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", choices=("flux2-klein-4b", "z-image-turbo"), required=True)
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--seed", type=int, required=True)
    parser.add_argument("--width", type=int, required=True)
    parser.add_argument("--height", type=int, required=True)
    parser.add_argument("--steps", type=int, required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--reference-image", action="append", default=[])
    args = parser.parse_args()
    if args.reference_image and (args.model != "flux2-klein-4b" or len(args.reference_image) > 5):
        parser.error("Reference conditioning requires FLUX.2 Klein and at most five images.")
    from mflux.models.common.config.model_config import ModelConfig
    from mflux.models.common.resolution.config_resolution import ConfigResolution

    config: ModelConfig = ConfigResolution.resolve_restricted(args.model, args.model)
    if args.model == "flux2-klein-4b":
        if args.reference_image:
            from mflux.models.flux2.variants.edit.flux2_klein_edit import Flux2KleinEdit

            model = Flux2KleinEdit(model_config=config, model_path=args.model_path, quantize=4)
        else:
            from mflux.models.flux2.variants import Flux2Klein

            model = Flux2Klein(model_config=config, model_path=args.model_path, quantize=4)
        guidance = 1.0
        scheduler = "flow_match_euler_discrete"
    else:
        from mflux.models.z_image.variants.z_image import ZImage

        model = ZImage(model_config=config, model_path=args.model_path, quantize=4)
        guidance = 0.0
        scheduler = "linear"
    print(f"Generating {args.model}: {args.width}x{args.height}, {args.steps} steps", flush=True)
    image = model.generate_image(
        seed=args.seed, prompt=args.prompt, width=args.width, height=args.height,
        num_inference_steps=args.steps, guidance=guidance,
        scheduler=scheduler,
        **({"image_paths": args.reference_image} if args.reference_image else {}),
    )
    image.save(path=args.output, export_json_metadata=False)


if __name__ == "__main__":
    main()
