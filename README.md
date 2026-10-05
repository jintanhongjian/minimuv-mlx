# MiniMuv

**A local-first creative studio for Apple silicon.** Turn prompts into synchronized video and
stereo audio with MiniMax H3, square images with HiDream-O1, or songs with MiniMax Music3 — from
one multilingual interface running on your Mac.

MiniMuv is a browser-based local application, not a hosted service or a text-chat interface. The
web app and model inference run locally. Model downloads come from Hugging Face; the optional
prompt optimizer connects to a text model served by your local OMLX instance.

## What you can make

| Mode | Model | Output |
|---|---|---|
| Video | MiniMax H3 FL2VA, 4-bit MLX-Serve package | Prompt-generated video with synchronized stereo audio |
| Image | HiDream-O1, Q6 MLX | Text-to-image, square 2048 × 2048 PNG |
| Image | FLUX.2 Klein 4B / Z-Image-Turbo, runtime 4-bit MLX | Local text-to-image PNG, 512 / 768 / 1024 pixels |
| Video | LTX-2.3 Distilled 1.1, Q4 / Q8 MLX | Local text- or first-frame-conditioned video with embedded audio |
| Music | MiniMax Music3, 8-bit MLX | WAV music, with lyrics or instrumental |

The prompt editor can also extract keywords and suggest an improved prompt using a local
OpenAI-compatible text-generation service. Review the suggestion before applying it. The UI
supports English, Simplified and Traditional Chinese, French, German, Japanese, Korean, Spanish,
Portuguese, Turkish, Arabic, Vietnamese, Indonesian, and Russian.

In **Music**, expand **Music quick settings** with the `+ / −` disclosure control.
Four independently collapsible categories provide genre, mood, vocal, instrument and
tempo keywords. Click a keyword to add its English model-input token to the editable
prompt; click it again to remove that standalone token. Custom prose remains intact,
and manual edits or restored history update the selected chips. These are prompt
shortcuts, not extra model parameters: lyrics, instrumental/lyrics mode, duration,
steps and seed remain unchanged. Keywords are disabled during generation or prompt
optimization, and additions exceeding the prompt limit report an error.

### Portable optional image and video models

Choose the model in the **Image**, **Video**, or **Long video** form. The original
H3 and HiDream options remain available. New models use local subprocesses, not OMLX's
text endpoint or the H3 MLX-Serve service. Their availability is checked independently.
History restores the selected model and image size; legacy history selects H3 or HiDream.
Saved workflows retain the video model and use it for every shot.

Each history entry has a Delete action with confirmation. It permanently removes
that entry's generated video/image/music, accompanying audio, saved generation
metadata and private first-frame snapshot from the active output folder. Unrelated
uploads, model weights and output-folder migration backups are not deleted.
Deletion is blocked during generation and when a long-video manifest still
references one of the entry's files. Files are selected by canonical entry ID and
known output names only; linked files are rejected. Deletion errors are reported
explicitly, including a partial filesystem failure, and the list is refreshed.

Settings manages the enabled state, display name and local directory of all eight
supported video/image/music models, plus the shared Gemma encoder directory. Generation
selectors are populated from `/api/models` using this saved registry, not HTML
options. Disabled models remain visible but cannot be selected for new generation;
restored history and workflows keep their model identity and cannot run until it
is enabled again. At least one model per mode must remain enabled. Model settings
do not add arbitrary inference backends. Legacy settings retain their H3/HiDream
directories; `models` is authoritative when present.
LTX's Gemma readiness check follows the actual `mlx-lm` weight-file discovery.
It validates Safetensors structure, complete numbered shards, unique tensor names
and coverage of indexed tensors, without trusting stale upstream shard filenames.
This reads metadata, not the full weights; download-time hash verification remains
separate and unchanged. Readiness is not an end-to-end generation test.
Model-card links appear in the expandable model settings, not in download notices.
Long-video mode has matching video and music cards that follow its model selections.

The output folder is also configurable in Settings. Changing it while idle copies
all results, history, uploaded first frames and long-video projects into an empty
new folder. Every copied file is SHA-256 checked before publication; project media
paths are rewritten, and settings switch only after the copy succeeds. Original
files are retained as a backup, not automatically deleted. Overlapping directories,
symlinks and special files are rejected. Generation or an active workflow prevents
settings changes, and output-writing requests are serialized with migration.
If saving settings fails after publication, the verified copy is retained and the
old settings remain active; the error reports this instead of claiming success.
Restarting uses the saved output folder. Configured model paths are also used by
download accounting and local inference; weights are never moved with outputs.

Generated projects are stored by category below the configured output directory:
`video/` (video, extracted audio, settings and conditioning frames), `image/`
(images and settings), `music/` (Music3 or YuE2 audio and settings), and
`long-video/<project-id>/` (storyboard, shots, soundtrack, boundary frames and
assembled video). Shared uploaded inputs remain in `first-frames/`.
On startup, recognized flat legacy files and `workflows/` projects are moved into
this layout and their stored media references are updated. Migration never
overwrites an existing destination; conflicts fail explicitly. Unknown files are
left untouched. Legacy history remains readable, including YuE2 songs.
History is shared across models and filtered only by creation category. New music
files use the model-independent `music-<id>.wav` name; legacy `music3-` and `yue2-`
names remain supported. Model identity is saved in generation settings (legacy
default H3/HiDream records use the corresponding default), so restoring a project
selects its original model rather than whichever model is currently selected.

The selected model's information box refreshes every ten seconds and displays its
download state, percentage, byte totals, progress bar and estimated download speed.
Speed is the byte increase between successful ten-second status polls, not a network
throughput measurement; LTX includes shared Gemma progress. The first sample shows
an unknown speed. Pausing, changing paths, decreasing byte counts, failed refreshes
or gaps longer than thirty seconds reset sampling; inactive downloads hide speed.
LTX totals include the
shared Gemma encoder, with separate component percentages. Download accounting uses
the pinned Hub file sizes in `third_party/local_model_downloads.json` for external
downloads, or the downloader's persisted per-file ETag/size plan for project-owned
downloads, not directory disk usage. Duplicate caches are never summed. External
progress uses the newest partial attempt per file; owned downloads select the
largest prefix matching the exact ETag. External activity is inferred from recent
file writes, while owned downloads expose their actual worker/pause/error state.
Owned completion requires a successful hash-verification receipt; external/legacy
completion indicates expected sizes or existing model readiness only. Neither is
a real generation test. Runtime readiness remains separate.

Weights and the shared video text encoder live outside the repository:

```text
~/.omlx/models/pipenetwork/FLUX.2-klein-4B/
~/.omlx/models/pipenetwork/Z-Image-Turbo/
~/.omlx/models/pipenetwork/ltx-2.3-mlx-q4/
~/.omlx/models/pipenetwork/ltx-2.3-mlx-q8/
~/.omlx/models/pipenetwork/gemma-3-12b-it-4bit/
```

The project bundles the complete MFLUX source and LTX core/pipelines source under
`third_party/mflux/` and `third_party/ltx_2_mlx/`, with upstream licenses. Fixed source
commits and model snapshot revisions are in `third_party/local_models.json`.
The image entry point is `scripts/generate_local_image.py`; LTX runs the bundled CLI.
Generation sets the Hugging Face and Transformers offline flags: missing weights cause
an error, not an implicit download or a switch to a different model.

To migrate, copy the project and weights, then rebuild the two independent Apple Silicon
Python 3.14 environments (do not copy virtual environments between machines):

```bash
bash scripts/install_local_runtimes.sh
# Download any missing immutable snapshots using the project's main environment:
.venv/bin/python scripts/download_local_models.py
# Or select one model; LTX selections automatically include the shared Gemma encoder:
.venv/bin/python scripts/download_local_models.py --model ltx-2.3-distilled-q4
```

The installer requires `uv` and FFmpeg and installs pinned package dependencies.
MLX, MLX-LM, MLX-Arsenal, Transformers and other framework dependencies are restored
from package distributions; the model-specific pipelines and application call code
are bundled, so migration does not require an external inference-source checkout.
Model licenses remain separate from software licenses: Klein 4B and Z-Image use
Apache-2.0, LTX uses the LTX community model license, and Gemma uses Google's Gemma terms.
Consult the downloaded model cards and license files before redistribution or commercial use.

Klein runs four steps; Z-Image-Turbo runs nine with its turbo linear scheduler.
The original image checkpoints are quantized at load time, so loading can require
considerably more memory than steady-state 4-bit inference. LTX always uses
`transformer-distilled-1.1.safetensors`, **never the Dev checkpoint** or a Dev+LoRA
substitute: eight half-resolution steps, 2x spatial upsampling, then three refinement
steps at full resolution. Both Q4 and Q8 use `--distilled --low-ram`, 24 fps,
64-pixel-aligned canvases with a 512-pixel long edge, and `8n+1` frame alignment.
Q4 is the more conservative choice for a 64 GB Mac. Generation is serial; Q8 and
image loading still require real-machine memory/quality validation. Cancellation stops
the owned inference process group, including FFmpeg children, without stopping OMLX.

### Resumable downloads in Settings

Each of the eight model entries in **Settings** has **Download / resume** and
**Pause download** controls. Save edited model/Gemma directories before starting.
Progress remains visible in the video/image/music model notice and in Settings,
refreshing every ten seconds without replacing unsaved form fields. LTX includes
the shared Gemma encoder; YuE2 includes its VAE. Pausing either model also pauses
its shared dependency, so it can affect another download using that dependency.
Pause downloads before changing their saved destination paths.

The downloader and supervisor live in this repository and use the declared
`huggingface_hub` dependency only for public snapshot metadata. No user skill,
temporary script, external `hf` executable, or inference-source checkout is needed.
The CLI downloader uses the same transfer implementation. Optional model revisions
remain pinned by the manifest; H3, HiDream and Music3 resolve a commit once and
persist it before transferring any files.

HTTPS transfers retain certificate and hostname verification. The declared
`certifi` dependency supplies public CA roots in addition to Python's default
trust configuration, including on macOS installations without a default CA bundle.
Certificate failures retain partial bytes; never disable TLS verification to resume.

Matching HF cache fragments are retained and the largest **same-file, same-ETag**
prefix is resumed with HTTP Range. A nonzero offset requires an exact HTTP 206
Content-Range; rejection never truncates data or silently restarts from zero.
Files are published only after size and SHA-256/Git-blob-SHA-1 verification.
Strict YuE runtimes cannot contain HF cache files: after verification their cache
is archived in the persistent download state, rather than deleting old fragments.
Unknown hashes and checksum/authorization failures are reported, not retried blindly.
Interrupted transfers retry after five minutes, up to twelve attempts. Pausing
terminates only the project's own downloader, keeping partial bytes. Existing
external download processes are not killed or duplicated.

Plans, logs and completion receipts persist in `~/.cache/minimuv/model-downloads`;
weights and HF partials remain in each saved model directory. Supervision runs
while the web service is running; after a restart, select **Download / resume**
to continue from retained bytes. This does not automatically reinstall inference
environments or certify real generation quality.

The MiniMax H3 service address, model ID and additional API parameters are grouped
at the bottom of the **h3** model directory/download card in settings. They apply
only to H3; LTX uses its local inference runtime and does not use that HTTP address.
Each model card has a **+/−** control to collapse or expand its fields. Cards start
expanded; collapsing does not pause downloads or omit fields from saved settings.
The HiDream and Music3 local-runner notices appear at the bottom of their model
cards and collapse with them. Music3 uses the directory in its model card,
without a duplicate path input.
Invalid fields automatically expand their card for correction.
In the composer, switching the video, image or music model also updates the
collapsed model summary, directory and available model-source link. Music
compute guidance and parameter visibility follow the selected music model.

## System prompt settings

Use **Prompt settings** in the header to edit the local text model's instructions.
The structured editor separates role, task, rules and output format, with a full
preview and per-purpose default restoration. It covers shared prompt-editing rules,
video/image/music prompt editing, and automatic storyboard planning. Shared rules
are prepended to each of the three mode-specific tasks.

Defaults are shipped in `webapp/system_prompts.json`. Saving writes an atomic,
private `system_prompts.json` in the project root (ignored by Git); include that
file when transferring your custom settings. Requests reload the configuration,
so saved edits apply to the next text-model request without a server restart.
Invalid files produce explicit errors rather than silently falling back to defaults.
Concurrent saves based on an outdated revision are rejected; reopen the editor
to load the latest file before reapplying your changes.

The storyboard task must contain `{shot_count}` exactly once. JSON examples use
literal braces and are not template expressions. Editing output instructions does
not change backend response validation, field-length limits or supported shot
durations. **Restore defaults** affects the selected purpose only and must be saved
to take effect. These settings do not alter third-party model chat templates,
tokenizer formats, your story text or ordinary generation prompts.

## Long-form video: a practical segment workflow

MiniMuv includes a local storyboard workflow for producing a longer film from short H3 shots. In
the Studio, choose **Long video**, add and edit shots, choose the aspect ratio and soundtrack
strategy, then save the storyboard. Review it and select **Review & start** to run the workflow.
Generation is serial because H3 and Music3 share the Mac's compute resources; standalone generation
is temporarily blocked while a workflow runs.

The workflow saves its manifest and final edit under
`~/.cache/minimax-h3-mlx/outputs/workflows/`. A failed or interrupted workflow keeps valid
completed shots and music segments; use **Resume workflow** to continue with missing work.
Every completed shot retains its actual first and last decoded PNG frames in the
workflow history. Unless an explicit first frame is selected, a shot uses the
previous shot's saved last frame as its first-frame condition. Frame links remain
available after a server restart, including for the final shot.

Select a finished, failed, cancelled or interrupted history project and choose
**Restore & edit** to create an independent editable draft. Saved first-frame
conditions (or the actual first frame for an originally unconditioned shot) are
copied into the new draft, so they survive removal of the source project. Edit
prompts or replace/clear the first-frame selections, save, and start regeneration.
The original project and its boundary frames remain in history. Older histories
with available shot videos have their boundary frames extracted on restoration.
Music3 score generation is enabled for the workflow. Choose an editable prompt for each shot, or
turn off **Generate a separate score for each shot** to provide one overall soundtrack prompt.
Overall scores cover the complete video; Music3 segments tracks longer than its 300-second
generation limit and joins those segments in timeline order. Choose score-only output or mix the
music with each shot's H3 audio. Separately generated shot cues can differ in style and may have
abrupt transitions at shot boundaries; the current workflow does not crossfade them.

For planning and review, the workflow follows these steps:

1. **Plan a timeline.** Split the target runtime into story beats and shots, each 5–15 seconds.
   Write a separate H3 prompt for every shot with the subject, action, location, camera, lighting,
   and intended transition. Keep shared character and style descriptions consistent. The existing
   **Automatic storyboarding** can turn a story of up to 30,000 characters into 1–48 editable
   shots using a selected local text model. Choose the number of new shots and select **Generate
   & add shots**. Each shot includes a title, H3 prompt, 5/8/10/15-second duration, and instrumental
   music prompt. Generated shots append to existing shots (empty placeholders are removed); the
   combined storyboard cannot exceed 48 shots. Review and save before starting generation.
   Requests stay on the configured loopback text service; malformed or truncated model output
   is reported without modifying the storyboard. Planning uses a shot-count-sized output token
   budget rather than the shorter prompt-optimizer budget. The source story is not saved in the
   workflow manifest; generated shots are saved with the storyboard.
2. **Choose opening frames.** Generate images in the standalone HiDream mode, then select an
   image from each shot's **First-frame image** dropdown in Long video. A thumbnail previews the
   selection; **None (text-to-video)** retains the existing text-only behavior. Saving copies the
   selected PNG into the workflow so it survives removal of the original history image. Each
   shot can use a different image. The image anchors the opening composition, not just the style,
   and is sent as base64 `first_frame_image` to the local MLX-Serve H3 endpoint. Use an H3-capable
   MLX-Serve build supporting this field; service errors are reported without text-only fallback.
   The standalone **Video** form also offers the same **First-frame image** dropdown and local
   upload control, independently of storyboard selections. Choose **None** to keep text-to-video.
   On submission the server validates the selected controlled image and freezes its bytes for
   the queued request; deleting the source afterward does not change that request. Missing or
   invalid images stop submission instead of silently falling back to text-only generation.
   Alternatively, use **Add a local image** under the dropdown. PNG, JPEG and WebP are accepted
   up to 20 MiB and 16 million pixels; the local server decodes them, applies EXIF orientation
   and stores an RGB PNG. The uploaded image is selected immediately with a preview; existing
   generated-image choices and **None** remain available. Upload failures preserve the prior
   selection. Saving still creates a private workflow snapshot for recovery. Files are sent only
   to this computer, not directly to a remote service. The reusable upload cache is deduplicated
   and capped at 100 images / 200 MiB; a full cache reports an error rather than deleting images.
   To reclaim space, remove unneeded PNGs from `~/.cache/minimax-h3-mlx/outputs/first-frames/`
   after saving the workflows that use them. Saved workflow snapshots remain intact.
3. **Generate shots in order.** The workflow submits one H3 job at a time, keeping the aspect ratio
   and visual style fixed. It retains each prompt, seed, settings, job ID, media path, and completion
   state in the workflow manifest so a failed run can resume without regenerating completed shots.
4. **Score each shot.** Optionally provide a distinct Music3 prompt for each shot. The workflow
   generates one score per shot, uses the selected audio strategy for that shot, and resumes without
   regenerating completed score clips. Music3 accepts 5–300 seconds (up to five minutes) per request;
   this is a duration ceiling, not a guarantee that every generated song reaches it. Current shot
   durations are 5–15 seconds.
5. **Assemble and verify.** Use FFmpeg to normalize clips to a common frame rate, canvas, video
   codec, and audio layout before concatenating. The current workflow uses hard cuts and does not
   add video dissolves or audio crossfades. It muxes the selected soundtrack strategy, then checks
   that the final file has video and audio streams and a duration close to the storyboard total.

The standalone generation endpoints remain available for one-off work: video (`POST /api/jobs`),
images (`POST /api/image-jobs`), and music (`POST /api/music-jobs`). Long-video projects use the
workflow endpoints: `POST /api/workflows` creates a draft, `POST /api/workflows/{id}/update`
updates it, `POST /api/workflows/{id}/start` starts a confirmed draft, and
`POST /api/workflows/{id}/resume` resumes a failed or interrupted run. Read state with
`GET /api/workflows` or `GET /api/workflows/{id}`; cancel with
`POST /api/workflows/{id}/cancel`. Workflow video and final media are served from
`/api/workflows/{id}/shots/{shot-id}/video`, `/api/workflows/{id}/shots/{shot-id}/audio`, and
`/api/workflows/{id}/final`. The manifest is persisted atomically on disk; live generation jobs
remain process-local and are marked interrupted after a server restart.

Cancellation stops the inference process owned by MiniMuv, not only the browser's
progress stream. If graceful termination does not finish within five seconds, the
server kills and reaps that process. Cancelling H3 unloads its owned inference service;
the next video request starts it again. Image and music cancellation stops their
individual subprocesses. The UI remains in cancelling state until job cleanup finishes.
Other applications' model services are not terminated; an unowned running H3 request
reports a cancellation error instead of pretending its computation stopped.

### Continuity options and current limitations

Adjacent prompts and matching seeds alone do not guarantee that a subject, composition, or motion
will carry across independently generated H3 clips. The strongest available code-level option is
H3 keyframe conditioning: `scripts/generate.py` accepts `--image` with a matching `--anchor first`
or `--anchor last` for each image. This is conditioning, not a guarantee of pixel-identical
continuity.

The Studio long-video workflow also supports a selected HiDream image as each shot's opening
frame through MLX-Serve. It does not automatically extract or pass the previous shot's ending
frame, expose last-frame anchors, or provide pure style-reference conditioning. Opening-frame
conditioning still does not guarantee consistent characters or seamless shot boundaries.

## Requirements

- macOS on Apple silicon, with enough free disk space and unified memory for the model you want to
  run. The complete H3 package is about **41.9 GB** on disk; Music3 8-bit is about **14.2 GB**.
- Python and the project dependencies in `requirements.txt`.
- The separate **MLX-Serve** executable for H3 video generation.
- Optional: `uv` and Python 3.11 for the isolated HiDream/Music3 inference environment.
- Optional: a local OMLX service with an OpenAI-compatible API for prompt optimization.

H3 generation is compute-intensive. Video length, resolution, model, and Mac hardware affect
generation time; even a short clip can take a while. MiniMuv runs one generation job at a time.

## Quick start: video and audio

Clone the repository, create its Python environment, and install the project dependencies:

```bash
git clone https://github.com/jintanhongjian/minimuv-mlx.git
cd minimuv-mlx
python3 -m venv .venv
./.venv/bin/python -m pip install --upgrade pip
./.venv/bin/pip install -r requirements.txt
```

Download the complete H3 model package (about 41.9 GB):

```bash
./.venv/bin/hf download ddalcu/MiniMax-H3-FL2VA-MLX-Serve-4bit \
  --local-dir "$HOME/.omlx/models/pipenetwork/MiniMax-H3-FL2VA-MLX-Serve-4bit"
```

Install the Apple-silicon build of
[MLX-Serve](https://github.com/ddalcu/mlx-serve/releases/latest) and make `mlx-serve` available
on `PATH` or at `~/.local/bin/mlx-serve`. Then start MiniMuv:

```bash
./.venv/bin/python -m webapp.server
```

Open <http://127.0.0.1:8765> and choose **Start and load model**. MiniMuv starts the local
MLX-Serve API and loads the H3 package when requested. The UI offers 5–15 second clips, several
aspect ratios, a seed, and Turbo preview settings.

On macOS, `start.command` starts the studio and opens it in your browser; `stop.command` stops the
studio and the MLX-Serve process it started. These launchers use the project `.venv`. Logs and the
server PID are stored in `~/Library/Application Support/MiniMuv/`.

## Optional: image generation

The image mode uses the Q6 weights from
[HiDream-O1-Image-Dev-mlx-q6](https://huggingface.co/mlx-community/HiDream-O1-Image-Dev-mlx-q6).
Download them to the default model directory:

```bash
./.venv/bin/hf download mlx-community/HiDream-O1-Image-Dev-mlx-q6 \
  --local-dir "$HOME/.omlx/models/mlx-community/HiDream-O1-Image-Dev-mlx-q6"
```

HiDream's inference scripts are bundled in `third_party/hidream_o1/`, with the upstream
MIT license, attribution, and pinned source revision. No separate inference-code download is
required. Create the project-local Python 3.11 environment and install its pinned dependencies:

```bash
uv venv --python 3.11 third_party/hidream_o1/.venv
uv pip install --python third_party/hidream_o1/.venv/bin/python \
  -r third_party/hidream_o1/requirements.txt
./third_party/hidream_o1/.venv/bin/python \
  third_party/hidream_o1/scripts/hidream_o1/generate_hidream_o1_mlx.py --shape-test
```

The studio detects the model files and runtime separately. HiDream mode generates square images
and does not support reference-image editing.

For migration, copy or clone this repository, recreate `.venv` and `third_party/hidream_o1/.venv` on the
destination Mac, and download or separately copy the model weights. Virtual environments and
weights are not committed. The bundled code is resolved relative to this repository, so neither
the original project location nor `~/.omlx/models/pipenetwork/hidream-o1-mlx-code` is required.
Set the destination model directory in **Settings**; if copying `settings.json`, review its
machine-specific paths. Restart the studio after setup when no generation is active. Do not
copy the old virtual environment: its interpreter paths are not portable.

## Optional: music generation

Download [MiniMax Music3 8-bit](https://huggingface.co/mlx-community/MiniMax-Music3-8bit):

```bash
./.venv/bin/hf download mlx-community/MiniMax-Music3-8bit \
  --local-dir "$HOME/.omlx/models/mlx-community/MiniMax-Music3-8bit"
```

Music3 uses the same project-local Python 3.11 environment as HiDream. Install the combined
dependency manifest so it provides `mlx_audio.music.generate` as well as HiDream:

```bash
uv pip install --python third_party/hidream_o1/.venv/bin/python \
  -r third_party/hidream_o1/requirements-music.txt
```

Select **Lyrics** or **Instrumental** in Music mode. Instrumental generation supplies the model's
`[instrumental]` condition automatically. Review the Music3 model card for its license and usage
terms before using or distributing generated music.

## Local prompt optimization

The optimizer uses only the model IDs configured in Settings, in their configured order.
Separate IDs with newlines or semicolons; trailing separators are removed and duplicates
are eliminated. This list also controls automatic storyboarding. Leave the list empty
to discover models from the local OMLX OpenAI-compatible API, which defaults to
`http://127.0.0.1:8000`. The service must still be reachable; a configured ID does not
guarantee that its weights are available. Start OMLX before opening MiniMuv, select a model in the prompt
editor, and review the extracted keywords and suggested prompt before applying it.

The studio only accepts loopback HTTP service URLs (`localhost`, `127.0.0.1`, or `::1`); remote
endpoints and API-key settings are not supported. To change the default OMLX address, set
`OMLX_BASE_URL` before starting the server, or update the service address in **Settings**. The
video service URL and default H3 model directory can also be configured with `MLX_SERVE_URL` and
`MINIMAX_H3_MODEL_DIR`.

## Knowledge-only Skill conversion API

The backend exposes three localhost-only POST endpoints:

- `/api/skills/requests`: accept a selected text model and inline source files;
  the host creates immutable source/capability identities and reads local license review.
- `/api/skills/convert`: convert a prepared request to a reviewed-later draft or
  a blocked result, using the bundled converter prompt and complete JSON Schema.
- `/api/skills/validate`: validate a result against its server-held request,
  including schema, identities, permission status, bindings, exact evidence and budgets.

Install the updated `requirements.txt` (`jsonschema` is now a runtime dependency)
and restart the web server to expose these endpoints. Conversion uses the local
OMLX `/v1/messages/count_tokens` API; missing token counting fails explicitly.
Only these endpoints accept 128 KiB JSON; existing endpoints retain 64 KiB.
Prepared requests expire after one hour and do not survive a server restart.

The operator-written `skill_license_reviews.json` is private and Git-ignored.
Use [the empty review template](skill-spec/license-reviews.example.json); never
accept client-supplied `verified` claims. Unreviewed sources return blocked without
calling the conversion model. Review changes invalidate earlier request identities.

See [the Chinese specification and API examples](Skill_Spec.md#10-已实现的转换后端与校验接口)
and [the research document](Skill_Assist.md). Validation success is **not** semantic
safety or installation approval: all drafts require human review. This backend does
not install, enable, execute, fetch external Skills or inject them into creation tasks.

## Settings, files, and privacy

The workspace expands with wider windows up to 1680 px, giving the editor and preview equal
additional space. Narrow windows keep the single-column layout.

Use **Theme** in the studio header to instantly switch between four dark palettes (Amber night,
Ocean blue, Forest green, Twilight violet) and four light palettes (Warm paper, Clear sky,
Fresh mint, Cherry blossom). Amber night remains the default. The palette applies
to all creation modes and the Settings dialog. Your choice stays in this browser's local storage,
survives reloads, and syncs across tabs; it does not change model settings or generated media.

Use **Settings** in the studio header to change model directories, local service URLs, an optional
H3 model ID, and model request parameters. Defaults are documented in
[`settings.example.json`](./settings.example.json); user settings are saved to the ignored
project-root `settings.json`.

Generated media and project history are kept locally under
`~/.cache/minimax-h3-mlx/outputs/`. New history records include the prompt, creation time and editable
generation settings. Selecting a history entry opens its Video, Image or Music form and restores
the saved prompt and controls without starting generation. You can edit them and generate again:
video restores duration, aspect, steps, seed, Turbo and opening frame; image restores seed;
music restores duration, steps, seed, lyrics mode and lyrics. Non-preset valid values remain
selectable. Video opening frames are saved as private history snapshots so deleting the original
image does not prevent reuse. Global model paths, service addresses and settings are not restored
or exposed in history.
Older records did not store generation settings: their available prompt is restored, missing
controls retain current values, and the UI displays an explicit notice. Original settings cannot
be recovered from those records. History selection is blocked during generation, uploads or text
planning/optimization to avoid disrupting active tasks. The server binds
to `127.0.0.1`, rejects non-local browser hosts, and does not accept or store API keys. Prompts sent
to the optimizer go to the configured local OMLX service, not a cloud API. Downloading models
still requires an internet connection.

## Developer notes

The repository also contains a from-scratch MLX implementation of the MiniMax H3 pipeline, parity
and quantization tools, and the MiniMuv web application:

```text
minimax_h3_mlx/    H3 transformer, VAEs, text encoder, scheduler, and pipeline
webapp/            localhost server and multilingual browser UI
scripts/           direct generation, quantization, evaluation, and Hub utilities
reference/          upstream Diffusers sources used for parity validation
tests/              web-app tests, MLX smoke tests, and model parity suites
```

Run the web-app tests with the standard library:

```bash
./.venv/bin/python -m unittest discover -s tests -p 'test_webapp.py' -v
```

The broader MLX parity suite is available as `scripts/run_tests.sh`; its reference tests require
the corresponding PyTorch, Transformers, and Diffusers validation dependencies.

## License

The software in this repository is licensed under [Apache-2.0](./LICENSE). Model weights and
third-party inference code have separate terms. In particular, review the
[MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE) and
the license and usage terms provided with each model before use or redistribution.

Powered by MiniMax H3.
