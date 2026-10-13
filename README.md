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

The local AI assistant can plan video, image, music and long-video creation. It checks the
requested parameters against the same backend validation used by the creation APIs, reports
current workflow and model readiness plus any blockers, and shows the planned operation before
asking for confirmation. Only after confirmation does it submit the request through the existing
creation endpoints; long-video plans create and start the existing workflow.

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
assembled video), and `mv/<project-id>.json` (music-driven MV project drafts).
Shared uploaded inputs remain in `first-frames/`.
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
64-pixel-aligned canvases and `8n+1` frame alignment. Both ordinary video and
long-video forms offer **Preview (512)**, **Standard (768, new default)** and
**High quality (1024)** final long-edge presets. The short edge is rounded to the
64-pixel grid, so the requested aspect ratio is approximate. These are actual
two-stage generation resolutions, not just an export resize. Higher resolution
requires more time and memory; it does not guarantee better motion or detail.
The distilled 8+3 sigma schedule is unchanged: adding arbitrary steps is not a
quality upgrade. `quality` accepts `preview`, `standard` or `high` in video and
workflow requests; invalid values fail explicitly. History and workflow manifests
save the preset; old records without it restore as Preview. All long-video shots
and the final assembly use the selected resolution (including subtitles).
The same quality controls apply to H3, using a **short-edge** target of
512 / 768 / 1024 instead, with a proportional area cap and 32-pixel alignment.
For 16:9 this yields about 896×512 / 1344×768 / 1792×1024. H3 Standard preserves
the existing canvas; High is experimental, with substantially more memory and
compute, and no real-machine quality guarantee. Old H3 records restore as Standard.
H3 Turbo/standard sampling controls remain independent of resolution quality.

H3 responses carry raw RGB frames and are limited to 768 MiB per response by
MLX-Serve. MiniMuv automatically splits oversized clips (including individual
long-video shots) into independent requests on H3's `17k+5` frame ladder. It keeps
the selected canvas, conditions each next segment on the previous tail frame,
removes the shared boundary frame, trims the final segment and PCM audio to the
original aligned frame count, then encodes one MP4. H3 audio rounds to 40 Hz latent
steps; a shortage of at most half a latent step is explicitly logged and padded
with silence, while larger shortages fail instead of shortening the clip.
For example, 362 frames at
1792×1024 use requests of 141, 141 and 90 frames rather than a 1900 MiB response.
Segments use the original seed plus their index modulo `2^32`; this changes the
sampling trajectory and may introduce seams, not guaranteed seamless motion.
Logs report each segment. Visual-token geometry sums all sampled segments; actual
runtime tokens are summed only when every segment reports them. LTX and H3 clips
that fit the limit retain their existing paths. Remove a custom `chain_windows`
override for oversized requests: server-side chaining still has the same total
response cap. This is a transport fix, not a promise that high-resolution inference
will fit available GPU memory.

Long-video workflows poll every two seconds and display the current video/music/
assembly stage, completed task count (not an estimated inference percentage),
elapsed time, live model logs, H3 segment and reported sampler steps. Polling
reconnects after a transport failure without restarting generation. Finished
attempt logs and retry decisions are saved in the workflow manifest; live logs
for an unfinished attempt remain in memory until that attempt ends.
Network resets/timeouts, incomplete H3 streams and HTTP 408/429/502/503/504 may
retry the current video or music task twice after 5 and 10 seconds, using new job
IDs and unchanged settings. Cancellation interrupts the retry wait. Invalid
parameters, model/runtime failures, memory errors and other failures stop with the
failed unit and correction guidance; completed media is retained for Resume.
Restore and edit instead creates a new editable draft and regenerates its shots.

Clear shots affects only the editable draft after confirmation; it does not save
or delete a workflow. Each saved workflow has a Delete button and the list has
Delete all. A confirmation dialog defaults to keeping media in the original
output directory, or explicitly allows deletion of that workflow directory's
media and generation records. Shared source images/music outside those directories
are never removed. Active workflows cannot be deleted; bulk deletion preflights
the exact selected IDs and refuses the entire batch if any is active or unsafe.
Preserved files remain on disk even though the deleted workflow leaves the list.

Q4 is the more conservative choice for a 64 GB Mac. Generation is serial; Q8 and
image loading still require real-machine memory/quality validation. Cancellation stops
the owned inference process group, including FFmpeg children, without stopping OMLX.

### Token metrics

All text-to-image models expose model-aware quality presets and the same five
aspect ratios as video (16:9, 9:16, 1:1, 4:3, 3:4), suitable for first-frame
inputs. Preview uses a 512-pixel long edge and Standard uses 1024. High keeps
Klein and Z-Image at their validated 1024-pixel recipe; for HiDream it selects
the nearest exact trained canvas (for example 2560x1440 for 16:9) instead of
forcing an off-spec size. Custom retains the 512/768/1024 choices and HiDream's
2048 option. Klein remains fixed at four steps and guidance 1.0; Z-Image remains
fixed at nine steps and guidance 0.

Image jobs can generate 1, 2, or 4 candidates sequentially with consecutive,
wrapping 32-bit seeds. This avoids loading multiple model instances at once.
Candidates are kept in one history record and can be selected and downloaded
from the result preview. Preview and submission share one canvas calculation;
the server validates the preset, canvas and candidate count, then verifies every
generated PNG before recording success. Quality, candidate count, size, aspect
and actual dimensions are saved in history.

The character-turnaround shortcut replaces ordinary candidates with exactly
three independently generated full-body views of one described character:
front, side profile, and back. Each view is rendered as its own image
containing a single isolated figure; the per-view prompt leads with that
constraint and strips multi-view directives such as "三视图", "turnaround" or
"front, side and back" from the visual description, so the description is used
only as the character design. The prompt stays purely affirmative and never
names a collage, contact sheet, grid or multi-figure panel, because the local
image models run without classifier-free guidance and would otherwise read those
nouns as something to draw. The three images remain one ordered history
asset and appear as a single selectable character reference in standalone
video, long-video, and MV settings. When selected for conditioning, all three
views are passed to FLUX.2 Klein as one character identity; it first composes
the requested shot's real opening frame, and the video model then consumes that
frame. Ordinary multi-candidate image jobs still contribute only their first
image when used as a visual reference.

Legacy HiDream requests/records retain their 2048-square behavior. Matching
aspect ratios does not guarantee identical video dimensions; first-frame
preprocessing still adapts the image to the video canvas.

Reference-image inputs are available in the image creation panel for HiDream-O1
(up to three images) and FLUX.2 Klein 4B (up to five). Upload PNG/JPEG/WebP files
up to 20 MB / 16 million pixels each, or add an image from project history.
Historical selections are copied into the managed upload store, so deleting the
source image does not invalidate the reference. Reorder or remove references
before generation; describe their intended use in the prompt. All candidates
and character turnaround views use the same ordered references. Image history
restores their IDs. Z-Image does not support this input. HiDream preprocessing
uses NumPy rather than PyTorch; reference fidelity is not guaranteed.

The **Scene multi-view** preset (HiDream / Klein) produces three independent
images: front wide-angle, side wide-angle and overhead spatial layout. The first
generated view is also supplied as a reference for the remaining two. One
reference slot is reserved for it (up to two uploaded HiDream references or four
Klein references). The preset is mutually exclusive with character turnaround.
Select the saved group in the scene section of video, long-video or MV visual
references to supply all three images, in order. These are 2D views, not a
rotatable 3D asset, and the model cannot guarantee exact spatial consistency.
The preset prioritizes distinct camera positions over copying the reference
composition: the side view moves to the right boundary and looks across the
scene; the overhead view looks vertically down, removing the ceiling for an
open-top interior cutaway. Unseen areas are inferred, not reconstructed from
measured geometry. Some models may still retain the reference viewpoint;
three successfully saved images alone do not prove correct camera changes.

H3 Turbo is fixed to the independently downloaded
`MiniMax-H3-Turbo-Lora/minimax_h3_turbo_v4_step600_ema.safetensors` under
`~/.omlx/models/pipenetwork`. Its 779,849,816 bytes and SHA256
`5f3a626cd72c93a8b9318d6760c510bc5092d2ab13aaba1f932c5bab07a416d3`
are verified before use (upstream revision
`43a74557ac3f6539db8e0f2a959d03feb7a81480`). No automatic download or fallback
to v1 occurs. The project creates an ignored symlink-based runtime pack under
`third_party/h3_turbo/.models/`, reusing the base model files and exposing v4
as `turbo_lora.safetensors`; the original base pack and its v1 adapter are
unchanged. A distinct runtime model ID prevents reuse of a loaded v1 pack.
Leave the optional H3 service model ID blank for this automatic binding.
MLX-Serve applies Turbo at strength 1.0 with its Turbo dual-stream schedule;
ordinary H3 requests leave Turbo off, and FastH3 never receives this adapter.
The supported v4 range is 4–8 steps; 6–8 is recommended for fast motion.
These are upstream recipe recommendations, not a guarantee of clip quality.
Older 2–3 step Turbo drafts need their step count changed before regeneration;
existing generated media is not changed. The adapter is Apache-2.0 licensed;
the base model retains its own MiniMax license.

The model settings dialog uses a wider responsive layout with collapsible
categories for video, music, text-to-image, encoders and text models. Model
placement follows the `/api/models` `model_options` registry, not display names;
new models must be registered under their corresponding type. Unclassified
entries remain visible under Other models. Collapsing a category does not discard
its inputs or exclude them from saving; invalid fields reopen their category.

The top bar exposes a single Settings entry. That dialog is one settings page
with a left sidebar that switches between the model/service settings, the system
prompt settings and the creation presets (skill conversion). Each section keeps
its own form, status line, unsaved-change confirmation and save action; closing
the dialog returns it to the model section.

Duration and adjustable sampling controls accept any whole number within the
selected model/recipe's range, not just presets. The same ranges are published
by `/api/models` and validated by single-generation and workflow endpoints:

| Model / recipe | Duration input (seconds) | Sampling steps |
| --- | --- | --- |
| H3 Turbo v4-600 EMA | 5–15 | 4–8 |
| H3 standard | 5–15 | 16–50 (current supported recipe range) |
| FastH3 VSA Q8 | 5–15 | Fixed 4 evaluations / 5 CLI schedule points |
| LTX-2.3 distilled Q4 / Q8 | 1–20 | Fixed 8 draft + 3 refine steps |
| Music3 | 1–300 | 1–30 (installed runtime limit) |
| YuE2 | Automatic from lyrics / EOS | Automatic; no manual sampling control |

The LTX upper range follows its [published 20-second capability](https://fal.ai/ltx-2.3);
it is not a local memory or quality guarantee. FastH3 retains the supported H3
request range rather than inferring a larger range from generic catalog checks.
Music3 duration is a ceiling: EOS may end a song sooner. Video duration uses
native frame alignment, without generate-then-trim; encoded duration can differ
slightly from the whole-second request. API durations remain fractional-capable
for existing records and internally split global scores; the UI accepts integers.
Changing models or Turbo mode updates limits without silently replacing input.
An out-of-range value must be corrected before generation or saving. Individual
shot cards also expose H3 sampling steps and Turbo mode; fixed recipes stay fixed.

Story auto-planning accepts a total duration and any whole-second per-shot duration
within the selected video model's range. The total must divide exactly; the read-only
shot count is calculated automatically. Ordinary long-video projects support up to
30 minutes (1,800 seconds) and 1,800 shots, including LTX's one-second shots.
Planning uses batches of at most 12 shots, with the complete story, global shot
positions and the previous two shots for continuity. Every batch uses a dedicated
exact-count output schema; selected Skills are rechecked for every batch and their
existing single-batch contract remains unchanged. All batches must pass before
the UI replaces the current storyboard; a later failure keeps it untouched.
The host requires the model to return the requested duration
for every shot. `/api/storyboards` accepts `total_duration` and `shot_duration`;
if `shot_count` is also supplied it must match. Legacy count-only requests remain
supported. This is planned duration, not an exact encoded-media duration guarantee
(model frame alignment still applies).

Assembly processes at most 16 shots at a time on the same 24 fps canvas. Temporary
parts use PCM audio; the final concat reads one playlist, copies normalized video,
and encodes AAC once to avoid accumulating encoder padding at part boundaries.
Global soundtrack offsets and lyric cues follow the complete timeline rather than
restarting in each part. The final frame count, duration and audio/video streams
are checked before atomically replacing the old final; failures clean only this
assembly's temporary assets and retain the previous final. Smaller projects keep
their existing assembly path. MV's independent 48-shot/audio-upload limits are
unchanged. Long projects take substantially more model time and disk space;
planning remains sequential and shows elapsed time, not a guessed percentage.

Reported runtime token usage and **visual sequence tokens (geometry)** are separate
metrics, not comparable billing units. H3 streaming `usage.total_tokens` (or input
+ output counts) and local `TOKENS:` reports are preserved in jobs and history.
Missing usage stays unknown, never an invented zero. Music3 requires a count from
every chunk; YuE2 counts runtime token callbacks. Text enhancement/Skill calls
are separate operations and are not added to media-generation usage.

Visual geometry covers target patches only: H3 uses `5n+2` latent frames on a
32-pixel grid; LTX uses `ceil(frames/8)` on a 32-pixel final grid and a 64-pixel
half-resolution grid. HiDream uses 32-pixel image patches (not VAE latents);
Klein and Z-Image use a 16-pixel target grid. The displayed count is the final
stage's sequence length, **not multiplied by denoising steps**. API/history
`visual_token_stages` also retains LTX stage 1 and stage 2 lengths separately.
These geometry-derived counts exclude text, audio, reference conditioning and
padding; they are not measured total computation or text-token consumption.
Long-video shots retain their own metrics; `visual_tokens` on the workflow API
sums final-stage target lengths only when every shot has a recorded count.
Legacy history without metrics remains unknown.

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

Video generation model options place MiniMax H3 8bit last as a non-priority choice,
preserving the relative order of other models and any existing selection.
An empty selection defaults to the first enabled option; H3 remains selectable.

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
preview and per-purpose default restoration. The nine purposes are AI assistant; shared faithful
editing rules; video, MV visual, image and music prompt optimization; long-video
story storyboards; fixed-audio MV visual storyboards; and Skill knowledge conversion.
Shared rules are prepended to all four optimization tasks. Storyboard and conversion
tasks have their own role/task/rules/output fields.

The AI assistant also has its own role/task/rules/output fields. Each chat request
appends the current UI language as an explicit response-language instruction,
including tool-error summaries and confirmation explanations. The preview shows
this language rule; switching UI languages affects the next chat request. A pending
confirmation retains the prompt and language of the request that created it.
Users may explicitly request another response language or a translation.
Prompt edits do not bypass the backend's write-confirmation gate. Existing five-
or eight-purpose settings are expanded in memory without changing saved overrides
or writing the file until you save.

Defaults are shipped in `webapp/system_prompts.json`. Saving writes an atomic,
private `system_prompts.json` in the project root (ignored by Git); include that
file when transferring your custom settings. Requests reload the configuration,
so saved edits apply to the next text-model request without a server restart.
Invalid files produce explicit errors rather than silently falling back to defaults.
Concurrent saves based on an outdated revision are rejected; reopen the editor
to load the latest file before reapplying your changes.

Both storyboard tasks must contain `{shot_count}` exactly once. Long-video counts
refer to the current planning batch, not the entire project. MV counts refer to the
host's fixed music intervals and cannot generate or replace a soundtrack.
JSON examples use
literal braces and are not template expressions. Editing output instructions does
not change backend response validation, field-length limits or supported shot
durations. **Restore defaults** affects the selected purpose only and must be saved
to take effect. These settings do not alter third-party model chat templates,
tokenizer formats, your story text or ordinary generation prompts.

Existing five-purpose version-1 override files are expanded in memory without
rewriting the file. All custom values are preserved, including the former MV
inheritance from video; saving persists the expanded eight-purpose configuration.
Partially missing or malformed configurations still fail explicitly.
Runtime timing, reference identity and selected Skill constraints are appended by
the host and are not editable. The Skill preview includes the fixed converter
contract and JSON Schema; only supplementary conversion guidance is editable.
Changes invalidate prepared Skill contract snapshots; re-prepare and reconvert
when a draft or installed Skill reports contract drift.

Skill evidence must be an exact contiguous excerpt of its supplied file, including
original punctuation, whitespace and language. If conversion fails solely with
H04 evidence findings, the host supplies the original sources and validation
feedback for **one** model retry, with the same identity, license, token and context
checks. It never fabricates evidence or weakens validation. A second failure is
reported with the candidate preserved and is not saved or installed.

## Long-form video: a practical segment workflow

MiniMuv includes a local storyboard workflow for producing a longer film from short H3 or LTX shots. In
the Studio, choose **Long video**, add and edit shots, choose the aspect ratio and soundtrack
strategy, then save the storyboard. Review it and select **Review & start** to run the workflow.
Saved workflows appear in **History → Long video** (and **All**), including drafts,
running, failed and completed projects. Select a card to open its storyboard and
existing resume/restore controls. The card's delete action retains the choice to
keep or remove generated media; **Delete all** in the Long video category applies
only to workflows, not ordinary image, music or video history.
The editor provides **Delete workflow** for the current project only and a
**+/−** control for its step list. Deleting the current workflow keeps the
editable storyboard but clears its old video bindings; saving again creates a
new workflow whose generated clips replace the storyboard previews.
**Clear shots** empties only the current project's storyboard, preserving that
project in history so new shots can be created. Its confirmation lets you keep
or delete that project's media. Other historical projects are never affected.
Batch **Delete all** remains exclusively in History.
The copy icon in the generation log header copies the entire current log,
including off-screen lines; clipboard permission failures are reported inline.
Removing or moving a shot in a saved, idle workflow automatically saves the
current editor and updates the workflow steps and numbering. Removing the last
shot uses the same project-scoped clear operation and media choice;
cancelling leaves the storyboard unchanged.
Two production paths are available:

- **Automatic: video, music & assembly** retains the existing end-to-end run.
- **Generate shots only** creates missing shot videos independently, without
  implicit previous-tail-frame conditioning, music inference or assembly.
  Each storyboard card has a video preview and **Generate / Regenerate this shot**.
  These actions save the storyboard first and run only the selected shot.
  An explicit first-frame image is still honored.
- Idle workflows can be edited in place: insert, remove or reorder shots, or change
  their prompts, duration, model, quality and first-frame image. Saving keeps
  unchanged independent shot videos and invalidates only changed clips. Canvas
  or model changes invalidate all clips; continuous-mode edits also invalidate
  affected downstream clips. The previous media files remain on disk.
- **Assemble shots** requires all clips to be ready and creates a clean assembly
  with the original shot audio. It does not require a video or music model.
- **Add global soundtrack** requires that clean assembly and the global music
  strategy (turn off per-shot music). It generates a new score or reuses that
  project's unchanged generated score,
  then replaces or mixes the soundtrack. Changing only music settings keeps the
  shot videos and clean assembly. Repeated scoring always starts from the clean
  assembly, not the already scored output; the video stream is copied without
  another video encode. Long video no longer offers history music selection or
  embedded lyric subtitles. Saving an old project clears those legacy options
  without deleting its existing media; history-based scores must be saved with
  a new score prompt before another automatic/scoring run.

The staged endpoints are `POST /api/workflows/<id>/videos`,
`POST /api/workflows/<id>/shots/<shot-id>/generate`,
`POST /api/workflows/<id>/assemble` and `POST /api/workflows/<id>/soundtrack`.
The original `start`/`resume` endpoints remain available. A failed staged run
resumes its own operation; active workflows cannot be edited or run concurrently.
Generation is serial because H3 and Music3 share the Mac's compute resources; standalone generation
is temporarily blocked while a workflow runs.

The workflow saves its manifest and final edit under
`~/.cache/minimax-h3-mlx/outputs/workflows/`. A failed or interrupted workflow keeps valid
completed shots and music segments; use **Resume workflow** to continue with missing work.
Every completed shot retains its actual first and last decoded PNG frames in the
workflow history. In continuous mode, unless an explicit first frame is selected, a shot uses the
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

### Music-driven MV creation

**MV creation** is a separate Studio category for the music-first pipeline in
[mv_plan.md](./mv_plan.md). Select a track from music history, listen to it, set
the project name, visual direction and aspect ratio, then **Save MV draft**.
Saved drafts are listed inside this category and can be reopened and updated.
MV headings, text inputs and selects reuse the existing workflow typography
and form styles rather than browser-default sizing. Shot cards use the shared
workflow labels and action buttons. MV progress logs appear below the right-hand
preview canvas in the same log panel style as other generation modes, only while
the MV category and a storyboard version are selected.

After saving, **Analyze music** runs the isolated CPU analyzer and displays
waveform, beats and downbeats. Select a video model and a local text model, set
the music start/end and target shot length, then **Plan storyboard**. Text
generation plans visual content only: the host fixes all cuts on a cumulative
24 fps integer-frame timeline, prioritizing downbeats near the target length.
The visual brief, text model and existing Skill prompt optimization sit in a
collapsible storyboard settings panel, using the long-video settings style.
The entire music-driven storyboard section can also collapse without losing
edited prompts or interrupting generation; progress logs remain below the canvas.
All shot cards sit in a separate collapsible storyboard list, so they can be
hidden while the timing settings, version selector and generation actions stay visible.
**Delete all shots** removes only the selected storyboard version after confirmation,
preserving the MV project, original music and generated media. Running versions cannot
be deleted. Use **Plan storyboard** to create and save a replacement, then **Save shots**
to persist further edits; other saved versions remain available.
MV planning requests a dedicated structured-output schema with an exact shot count
and only title/prompt fields, including when Skills are selected. Invalid model
output is rejected with count or shot-field details; no shots are silently truncated.
Beat settings automatically preview the exact clip intervals, generated lengths,
total duration and actual shot count without text/video inference or saving a
workflow. Audio analysis automatically sets the full audio range, including
tracks longer than 60 seconds. Total video duration is derived from that range
even while beat preview is pending or fails; shot count still requires a valid
preview. Manual trims are preserved until the audio source changes.
**Use full audio** restores the complete analyzable frame range (rounded down
to a whole 24 fps frame).
Edits invalidate the old preview immediately; stale responses cannot replace a
newer preview. Planning is enabled only after a current successful preview.
Unlike long video, total duration need not divide evenly by target shot length.
Missing analysis or usable beats is an explicit error, not guessed timing.
Each plan creates a separate persisted version; planning alone does not render.
 The selected text model receives the saved visual direction, fixed music
 intervals and the selected MV visual-prompt Skills (with their existing exact
 revision and approval checks). Titles and shot descriptions are requested in
 the visual direction's language, not English by default. Skills remain
 lower-priority visual reference knowledge and cannot alter timing or audio.

Review/edit titles, prompts and optional saved-image first frames, then save.
FastH3 is text-only and does not accept first frames. **Generate videos** renders
shots for review; each shot can be regenerated separately. **Export with original
music** requires every shot's media to be ready. **Generate and export** combines
these stages, and resumes failed/cancelled/interrupted work by reusing completed
shots. Cancellation retains completed media.
During generation, polling updates each shot's localized status, available step
progress and errors every 1.5 seconds. A completed shot immediately gets its video
preview while later shots are still rendering. Cards update in place: unchanged
previews keep playback position, edits and list expansion are preserved, and a
regenerated shot clears its stale preview until the new clip is ready. Previous-tail
first-frame previews also update as their preceding shot finishes.

Generation duration and final clip length are distinct: short cuts are trimmed
from model-compatible material rather than changing existing model duration
limits. Final assembly discards generated audio, cuts the source song once at
48 kHz sample boundaries, and encodes a single original-music track. Export checks
the exact video frame count and audio duration before publishing. Music content
changes block old plans; reanalyze and replan explicitly. Prompt/first-frame changes
invalidate the affected shot and following tail-frame-dependent shots, stopping
at an independent opening frame. From shot two onward, new plans default to
**Auto: previous shot's last frame** for models supporting image conditioning;
choose an image or None to override it. Selected opening images are previewed.
Fast H3 has no image conditioning and remains independent.
Each newly rendered shot preview is trimmed to its music interval and uses
only that interval of the supplied song, replacing generated audio. Chaining
uses the last frame of this trimmed clip. Single-shot generation requires a
completed preceding shot when chaining is enabled. Previously saved previews
are upgraded when reused for rendering; no running job is rewritten.
Timing/reordering currently requires a new
plan; A2V, manual beat corrections, lyric alignment/subtitles and transitions
are not included in this first loop. Synthetic FFmpeg tests verify cuts and
source-audio preservation, not model picture quality or internal motion sync.

`POST /api/mv-projects/<id>/beat-plan` requires `revision`, `model`, `start`, `end`,
and `shot_seconds`; it returns the source-bound exact beat plan without inference
or workflow creation. Storyboard creation recomputes and revalidates the same
plan rather than trusting preview timings from the browser.
`POST /api/mv-projects/<id>/storyboard` requires `revision`, `text_model`, `model`,
`quality`, `start`, `end`, and `shot_seconds`; it creates a workflow with a fixed
`mv_timeline`. `GET /api/mv-projects/<id>/workflows` lists its versions.
`POST /api/workflows/<id>/mv-update` uses `mv_revision` as `revision` and the complete
ordered `shots` list (`id`, `title`, `prompt`, `first_frame_id`).
`POST /api/workflows/<id>/mv-run` queues generation and original-music export;
the existing `videos`, `shots/<shot-id>/generate`, `assemble`, and `cancel`
actions are also supported. MV workflows share the durable workflow engine and
`long-video/<workflow-id>/` media storage, but are excluded from the long-video
editor's collection to protect their music timeline.

### Local MV analysis runtime

The first MV analysis dependency is deployed separately from the Python 3.14
application and MLX video environments. On Apple Silicon macOS, rebuild it with:

```bash
.venv/bin/python scripts/install_mv_runtime.py --with-checkpoint
third_party/mv_analysis/.venv/bin/python -I scripts/check_mv_runtime.py --smoke
```

The installer uses the hash-locked
[dependency manifest](./third_party/mv_analysis/requirements-runtime.txt) and
[source/checkpoint manifest](./third_party/mv_analysis/runtime.json). Beat This
source is vendored at `third_party/beat_this/`, including its MIT license.
Python 3.11.15, the isolated environment, copied dependencies, download caches
and the 81 MB `final0` checkpoint all stay inside `third_party/mv_analysis/`.
No external user site-packages or remotely fetched Python modules are required.
Generated environments/caches/checkpoints are not committed; source and manifests
are retained. Rebuild the environment when relocating the checkout.

The installer verifies existing source before reusing it, refuses to overwrite
local edits, and preserves interrupted downloads. Nonzero resume offsets require
HTTP 206 with the exact byte range; files are published only after size/hash
validation. Its log can be saved under `third_party/mv_analysis/.cache/install.log`.
The optional checkpoint flag is explicit: omitting it installs code only.

The check audits imported code before and after CPU inference without DBN or CUDA;
its synthetic smoke test
proves inference readiness, **not** beat accuracy or MV picture quality.
For an offline beat/downbeat TSV on a local WAV/FLAC/MP3 file, use the launcher
so PyTorch-generated temporary Python code also remains inside the project:

```bash
.venv/bin/python scripts/analyze_mv_music.py \
  /absolute/path/song.wav --output /absolute/path/song.beats
```

The output's first column is time in seconds; the second is the beat's position
within a bar (`1` marks a downbeat). The UI uses `analyze_mv_timeline.py` for its
cached JSON waveform/beat timeline. Existing LTX/Gemma weights and project-local video
code are reused. A2V dev weights, All-In-One/Demucs and lyric alignment remain
optional later stages; this installer does not download or enable them.

### MV history and draft storage

MV drafts appear in history under **All** and the independent **MV** filter;
selecting one reopens the editor, with confirmation before discarding unsaved edits.
Music can come from existing music history or **Upload WAV**. Imported copies
and private metadata are saved in `mv/music/` using UUID filenames; originals
are never moved or modified. PCM/IEEE Float RIFF WAV and extensible PCM/Float
WAV support mono/stereo, 8–192kHz, up to 12 minutes and 512MiB per file.
The UI previews and selects a successful upload without overwriting other draft
fields. Upload failures preserve the previous source. This collection is limited
to 100 tracks and 10GiB; deleting an MV draft retains its uploaded source too.
They persist under the configured output root's `mv/` directory and
remain separate from long-video workflows. Saving does not generate media,
download models or start a job; analysis, storyboard planning, rendering and
export are separate explicit actions.

`GET /api/mv-projects` lists drafts. `POST /api/mv-projects` creates one;
`POST /api/mv-projects/<id>/update` requires its current `revision` for conflict
protection. Payload fields are `name`, `music_source_id`, `prompt` and `aspect`.
`DELETE /api/mv-projects/<id>` requires a JSON body containing the current
`revision`; it deletes only that draft, never its source music.
`POST /api/mv-music?name=<filename.wav>` accepts the raw WAV request body
(not multipart or base64). `GET /api/mv-music` lists imported sources;
`GET /api/mv-music/<id>/audio` serves local preview audio with byte-range support.
Music IDs are resolved against local music history or the uploaded WAV store rather than accepting paths
or URLs. Drafts reference the source without copying or owning it; a deleted
track is marked missing and another track must be selected before saving.
The draft store uses atomic private files, rejects symlinks and malformed data,
and limits the collection to 100 projects.
Existing `mv-projects/` drafts migrate to `mv/` on access without changing IDs,
bytes or revisions. Conflicts, invalid manifests and symlinks block migration;
failed merges restore their own moves instead of overwriting existing projects.

### FastH3 VSA Q8 local generation

The video selector also offers **FastH3 VSA · Q8** (`h3-fasth3-vsa-q8`).
It reuses the verified package at
`~/.omlx/models/pipenetwork/MiniMax-H3-FastH3-VSA-DataFree-MLX-Q8`;
the model path remains editable in settings. This is a self-contained,
premerged student, not an adapter to load into the original Q4 H3 service.
Its text encoder, video/audio VAEs, VSA gates and AdaLN cache are included;
Gemma and a second base-model download are not required.

Install the pinned, signed mere.run **0.62.1** CLI and its complete support
bundle into this checkout (Apple Silicon, macOS 15+, FFmpeg and ffprobe):

```bash
bash scripts/install_mere_runtime.sh
```

The installer resumes its DMG download, verifies release SHA256
`8ebc99202f819922eb4f5c0840ff8cfca2d8c0030a477a32e482e1ab2b47bc05`,
checks the application signature, and copies the bundled CLI resources and
third-party notices. It does not install into `/usr/local`, replace the main
Python environment or download model weights. An existing runtime is not
overwritten. Runtime binaries, DMGs and model/cache directories are ignored
by Git. The application uses explicit local model paths and project-local
mere.run model/cache directories.

FastH3 uses its released VSA recipe at strength 1: **four model evaluations
are five schedule points** (`--steps 5` in mere.run). UI/history/workflows store
four evaluations; arbitrary Turbo/standard step controls are hidden.
Native progress reports real stages and denoising steps, not a fabricated
whole-job percentage. The owned subprocess supports cancellation independently
of MLX-Serve. **This FastH3 Preview v1 recipe supports text-to-audio/video only**:
actual inference rejects frame conditioning, even though generic CLI preflight
accepts `--h3-frame`. First-frame images and continuous tail-frame chaining are
therefore explicitly rejected, never silently dropped. Use original H3 or LTX
when opening images or continuous shots are required.

Standalone text-to-video, independent workflow shots, single-shot
regeneration, assembly and global scoring share this route. Frame counts remain
`17n+5` at 24 fps and shots accept any whole-second request from 5–15 seconds.
For this Q8 model the quality selector uses a **long edge** of 512/768/1024 px,
rounded to a 32-pixel grid (16:9: 512×288 / 768×448 / 1024×576),
rather than the original H3's much larger short-edge canvases. Start with
Preview on a 64 GB machine. Higher resolution increases memory/time and is
not quality-certified. The native MP4 contains generated stereo 32 kHz audio;
the application validates geometry/cadence and saves a WAV sidecar for history
and workflow audio reuse.

These already-downloaded weights are externally managed: their settings show
path/readiness, not a misleading download/resume action. Saving settings does
not initiate another large download.

**Turbo v4 remains unavailable for generation.** It is a separate LoRA, must not
be stacked onto the premerged FastH3 student, and mere.run's actual catalog
resolver rejects `--h3-adapter` for the existing legacy Q4 base. A compatible
base and verified v4 recipe are needed before enabling it; this integration
does not download that base or claim v4 compatibility.

Model weights remain subject to the MiniMax-H3 Community License, including
restrictions on use, distribution and display in the US, EU, UK and Republic
of Korea. Review the package's `LICENSE`, `NOTICE` and `MODIFICATIONS.md`.
The upstream `usageTermsAcknowledged` metadata is not user acceptance.
Successful smoke generation proves operation only, not long-video quality.

### Experimental H3 download placement

`scripts/finalize_h3_downloads.py` is a separate observer for the existing H3
download monitor. Preparation binds its unchanged plan and immutable Hub revisions
to authoritative file sizes and SHA256 LFS/Git blob SHA1 digests; it does not
download weights or alter an active download's path. The placement worker waits
until both jobs complete and the original monitor releases its locks, verifies
both snapshots, then uses same-filesystem exclusive directory renames into
`~/.omlx/models/pipenetwork/`. It never overwrites an existing destination,
deletes download caches or restarts a blocked download.

Its local config, log, status and verified placement receipt are under
`third_party/h3_downloads/.state/` (not committed). Detached operation requires
explicit user approval. Session exit does not stop an approved detached worker,
but machine shutdown/reboot does; relaunch it with the existing config:

```bash
third_party/mv_analysis/.venv/bin/python -I scripts/finalize_h3_downloads.py \
  --state "$PWD/third_party/h3_downloads/.state"
```

The Turbo download is a **LoRA adapter**, not a standalone model. Successful
placement is checksum validation, not a generation-quality or serving-readiness
certification. The original completed monitor retains its old source-path plan
for audit; use the placement receipt for the final paths, not that old plan.

Select the video model, quality, shot duration, shot mode, and soundtrack
manually. Entering the long-video module or creating a new draft no longer
applies an efficiency preset or switches the selected video model.
The video-quality note follows the selected model and interface language,
including its sampling recipe and conditioning limitations. Review a short
sample before committing to a full project; resolution is not a guarantee
of highest visual quality.
Independent shots never inherit the preceding shot's tail frame; supply
consistent character/style descriptions and an opening image for each shot
when identity matters. Select **Continuous shots** only for deliberate
continuations. Existing workflows and legacy clients retain continuous behavior,
including when restored. H3 response-size segmentation remains a transport
fallback, not a long-video quality strategy.

Story and music storyboards share a character/scene library with named image
references, one default scene, and per-shot character/scene selections.
Reference-frame mode sends the selected images independently to FLUX.2 Klein
Edit (up to four characters and one scene), then conditions the video on its
generated opening frame. It overrides that shot's manual/previous opening-frame
source; it does not stitch portraits into a collage. References are snapshotted
with the workflow so restoration does not depend on the original upload.
Reference previews resolve workflow snapshots, generated-image history and
uploaded first frames separately; missing images show a localized error rather
than an unusable preview. Character and scene controls share the application
form typography and button styles.
FastH3 remains text-only. Consistent identities and visual quality still require
review of generated samples; command and persistence tests are not quality tests.

Native negative prompts are supported by **LTX 2.3 Dev Q4** in single-video,
long-video, and MV generation. Project text is inherited by default; a shot can
override it, including with an explicitly empty prompt. The Dev path uses the
actual Dev transformer, one-stage CFG at 3.0, and 30 sampling steps by default.
It shares existing Q4 VAE/connector and Gemma assets, but requires the additional
`transformer-dev.safetensors` weight. Distilled, H3, and FastH3 cannot apply native
negative conditioning; nonempty requests for these models are rejected rather
than silently ignored or appended to the positive prompt. Empty Dev text is
passed explicitly, not replaced by the upstream default negative prompt.
The clear action uses the same secondary-button style as the other workflow
controls; clearing a shot override remains distinct from inheriting project text.

An interrupted or timed-out H3 response no longer triggers an automatic duplicate
request when termination of remote inference is unconfirmed. Check the video
service before resuming; completed media remains reusable.

During LTX generation, the live workflow status reports the runtime's actual
loading/encoding/decoding stages and separate first- and second-stage denoising
step counts. These are current-stage steps, not an estimated whole-film percentage:
finishing denoising still leaves decoding, any score generation and assembly.
Unknown log formats remain visible as logs rather than producing invented progress.

Local smoke measurements (2026-10-06, this Mac, fixed paper-boat prompt and seed 42):

| Configuration | Generated duration | Actual canvas | Elapsed |
| --- | --- | --- | --- |
| LTX q4, preview | 5.04 s | 512 × 256 | 84.0 s |
| LTX q8, preview | 5.04 s | 512 × 256 | 87.4 s |
| LTX q4, standard | 5.04 s | 768 × 448 | 191.5 s |
| LTX q4, two independent shots, no added score | 10.00 s assembled | 512 × 256 | 171.0 s |

The single-shot comparisons use the same 8+3-step distilled pipeline. These are
single-run throughput checks, not a quality ranking or proof of an absolute fastest
model. Canvas dimensions are rounded to the model grid; the selected aspect ratio
is therefore approximate at small sizes. The two-shot test verifies serial
generation, no tail-frame inheritance, and final assembly; it excludes Music3 time.
On this sample, standard takes about 2.28 times the preview time. Use preview
to iterate, then selectively regenerate accepted/key shots at standard or higher
quality after reviewing their output; this avoids paying the larger-canvas cost
for every rejected draft.

For planning and review, the workflow follows these steps:

1. **Plan a timeline.** Split the target runtime into story beats and shots within the selected video's duration range.
   Write a separate H3 prompt for every shot with the subject, action, location, camera, lighting,
   and intended transition. Keep shared character and style descriptions consistent. The existing
   **Automatic storyboarding** can turn a story of up to 30,000 characters into up to 1,800 editable
   shots using a selected local text model. Choose the final shot count and select **Generate
   & replace shots**. Each shot includes a title, video prompt, whole-second duration, and instrumental
   music prompt. A valid response replaces every shot while retaining the first shot's opening
   image selection and snapshot. The final storyboard cannot exceed 1,800 shots or 30 minutes.
   Review and save before starting generation.
   While waiting, an indeterminate progress indicator shows elapsed time, not a fabricated
   completion percentage. Incomplete or invalid model output leaves existing shots untouched
   and recommends switching text models or reducing the requested shots or story length.
   Requests stay on the configured loopback text service; malformed or truncated model output
   is reported without modifying the storyboard. Planning uses a batch-sized output token
   budget rather than the shorter prompt-optimizer budget. The source story is not saved in the
   workflow manifest; generated shots are saved with the storyboard.
   The story panel starts expanded. Use its **+ / −** header to collapse or reopen it
   without clearing inputs or stopping story planning.
   Use each editable shot's **↑ / ↓** controls to reorder it, or **Remove** to drop it.
   Shot numbers update immediately; **Save storyboard** synchronizes the saved workflow's
   video and per-shot music steps in that order. Running workflows remain read-only.
   Deleting a selected workflow (including **Delete all**) preserves the current editor
   as an unsaved draft, so it can be edited and saved as a new workflow. Media deletion
   remains a separate choice; deleted media cannot be reused as opening frames.
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
   regenerating completed score clips. Music3 accepts 1–300 seconds (up to five minutes) per request;
   this is a duration ceiling, not a guarantee that every generated song reaches it. Current shot
   durations follow the selected video model's range.
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
MLX-Serve API and loads the H3 package when requested. The UI offers model-specific whole-second durations, several
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

The studio detects the model files and runtime separately. HiDream supports the
five studio aspect ratios; its High preset uses the model's trained resolution
for the selected ratio. It does not support reference-image editing.

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

## Creative presets and compatible Skill API

The backend exposes localhost-only POST endpoints:

- `/api/skills/requests`: accept a selected text model and inline source files;
  the host creates immutable source/capability identities and reads local license review.
- `/api/skills/convert`: convert a prepared request to an automatically validated draft or
  a blocked result, using the bundled converter prompt and complete JSON Schema.
- `/api/skills/validate`: validate a result against its server-held request,
  including schema, identities, permission status, bindings, exact evidence and budgets.
- `/api/skills/license-review`: confirm a detected license candidate from its exact
  source snapshot; the server re-detects it and records a source-hash-bound local review.

Install the updated `requirements.txt` (`jsonschema` is now a runtime dependency)
and restart the web server to expose these endpoints. Conversion uses the local
OMLX `/v1/messages/count_tokens` API; missing token counting fails explicitly.
Skill endpoints accept 512 KiB JSON; existing endpoints retain 64 KiB.
Prepared requests expire after one hour and do not survive a server restart.

The **Creative presets** toolbar opens a fourteen-language workspace: import or
paste UTF-8 source files, prepare/convert, directly edit each task's method guidance
and inspect its live application preview. Original evidence and editable compatibility
JSON remain available as advanced information. No file or script is executed.
Editing invalidates checks; changing source or model requires preparation and
reconversion. Unknown licenses remain blocked.

Local sources accept one or more UTF-8 text files, or a whole folder via the folder
picker: folder imports keep each file's relative path (for example
`references/camera-and-impact.md`) so a `SKILL.md` that splits its rules across
referenced files converts as one complete preset. References that are not part of the
import are reported explicitly. GitHub file (`/blob/ref/path`), Skill directory
(`/tree/ref/path`) and repository URLs can be acquired explicitly: **Find documents**
pins the branch or tag to a commit and defaults to a `SKILL.md` and related license
file; **Read selected files** verifies Git blob hashes, loads the exact source and
automatically includes sibling documents referenced from the selected text (backtick
paths, markdown links and bare relative `.md`/`.txt` paths) within the license scope
and the per-Skill file budget. The license parser only
suggests a candidate from the retrieved text. The user must inspect and confirm it
before the host records approval for that exact source snapshot.
Only public `https://github.com` URLs and bounded, regular UTF-8 text files are
supported, with no credentials, proxy, redirect, clone or script execution. License
candidate detection is not legal verification and does not infer obligations. At most
200 document choices; narrow large repositories to a
Skill directory. Branch names containing `/` require an equivalent commit URL.
Existing inline source labels are not fetched implicitly.

GitHub's unauthenticated API is limited to 60 requests per hour, which a single
discovery can exhaust. Set the optional `GITHUB_TOKEN` environment variable to a
personal access token to raise the limit to 5,000 requests per hour; the token is
sent only to `api.github.com` over HTTPS and is never stored or logged. Rate-limit
and forbidden responses are reported distinctly, with the remaining reset time when
GitHub provides it.

`POST /api/skills/github/discover` accepts `{url}` and returns origin, commit revision
and selectable text paths with Skill/license suggestions. `POST
/api/skills/github/fetch` accepts `{origin, revision, paths, license_name, license_path}`
(1–15 non-license documents, plus the selected license), resolves relative references
inside those documents against the pinned tree, and returns inline source with any
detected license candidates; referencing more than the 15-document per-Skill budget
fails with `skill_reference_budget_exceeded`. `POST /api/skills/license-review`
accepts the exact source snapshot and a detected candidate; it re-detects the license
server-side, then writes a source-hash-bound record to the local, Git-ignored registry.
It does not accept client-supplied hashes, obligations or evidence. Network/rate-limit,
incomplete tree, size and UTF-8 errors are explicit; failed import does not overwrite
current text.

Successful UI conversions automatically save private drafts. Source-only or incomplete JSON
drafts can still be saved explicitly
under `~/Library/Application Support/MiniMuv/skill-drafts`, independently of media
output migration and the repository. The directory is `0700`, files `0600`; writes are
atomic and locked with revision conflict checks. Limits: 100 drafts, 2 MiB per stored
draft, 64 MiB total; endpoint JSON bodies remain capped at 512 KiB. Reopening restores
the host-held source snapshot after restart without accepting client trust claims.
Saved validation is never restored as approval: applying revalidates automatically; changed
capabilities, licensing, text settings or contracts require preparing and converting
again. Draft storage is private to this macOS user, not encrypted.

Draft API: `GET /api/skills/drafts` lists metadata; `POST /api/skills/drafts` saves
`{id, revision, name, request_id, result_text}` (`id` and `revision` are null for new
drafts). `POST /api/skills/drafts/{id}/open` with `{}` restores a draft;
`POST /api/skills/drafts/{id}/delete` requires `{revision}`. Updates/deletes return
409 on stale revision, preserving existing data. The validator also accepts
`{request_id, result_text}` to check raw JSON without hiding duplicate keys.

The local `skill_license_reviews.json` is private and Git-ignored. Offline maintainers
can use [the empty review template](skill-spec/license-reviews.example.json); never
accept client-supplied `verified` claims. The UI flow records a license only after the
user inspects and confirms the candidate; this is not an automated legal assessment,
installation approval or enablement. Unreviewed sources return blocked without calling
the conversion model. Review changes invalidate earlier request identities.

See [the Chinese specification and API examples](Skill_Spec.md#10-已实现的转换后端与校验接口)
and [the research document](Skill_Assist.md). Validation success is **not** a semantic
safety guarantee. Additional human content review is no longer required. GitHub acquisition
reads only pinned, selected source text; license detection is only a candidate until
the user confirms it.

### Applying presets and legacy Skill compatibility

Confirm the license, convert with the local text model and automatically save the draft,
then edit and preview its method guidance, choose categories and **Apply preset**.
No reviewer name, human checkboxes, separate install or enable step is required.
Applying rechecks format, evidence, source/context and tokenizer
budgets, binding automatic validation to exact package, result and source/context hashes.
Reopened drafts can be applied directly; old installations remain compatible.
`POST /api/skills/apply` accepts `{draft_id, revision, published_id, published_revision}`
and optional `categories`. Both published fields are null for a first application;
updates supply the existing preset's ID and exact revision from the installed list.
It publishes enabled, never starts media generation and never auto-selects the preset.
The same draft updates the same preset; concurrent first applications and stale
published revisions return 409 instead of creating duplicates or overwriting changes.
Guidance edits preserve original evidence and source metadata; they are user edits,
not claimed verbatim source excerpts.
HTTP 507 means the local text service cannot load the model within available memory:
wait for media generation to finish, close memory-heavy applications or select a smaller
text model. Source edits are preserved; the application does not weaken memory guards.
If automatic saving fails, the response retains the generated candidate and reports the
storage error; the single-draft editor preserves it for explicit saving, without claiming success.
The legacy `/api/skills/install` endpoint still installs disabled, with separate
enablement for old clients. New preset application publishes enabled. Select one
or more supported categories (video, image, music, long video, MV); unsupported
categories remain disabled and the server validates again before application.
Categories can be
changed later in the installed list with **Save categories**, without changing approved
instructions or enabling a package. Calling panels filter by category as well as
task/model compatibility. Old packages derive their categories from their bindings.
Disable before deleting. Identical name/version pairs cannot be overwritten;
Legacy installations require a new version and validation; same-draft preset
updates instead use explicit revision checks. Cancellation or failure leaves existing
enabled packages unchanged.

### Multiple sub-Skills from one GitHub URL

**Install all presets from URL** automates the whole flow for a repository or Skill
directory: it pins the commit, confirms the detected license, groups every `SKILL.md`
by its nearest directory, then fetches, converts and applies each child in sequence.
Each child is installed as an enabled preset with its supported categories; a failed
child is reported and does not block the others. This is the fastest path for a
repository such as `https://github.com/kangarooking/director-skills` that bundles
several Skills under one license.

For finer control, **Find documents** pins the commit and lists selectable text paths;
inspect and confirm the applicable license, then select each desired `SKILL.md` and
its required reference documents. **Convert selected sub-Skills** groups documents by
the nearest `SKILL.md` directory, including nested Skills separately. Each child is
fetched, prepared, converted and saved independently, in sequence; unselected sibling
Skills are not read or merged. Each group permits 15 non-license documents and retains
the normal source, request and tokenizer budgets.

Select saved drafts using the sidebar checkboxes and choose **Apply selected drafts**.
Each application uses its exact saved revision and publishes an enabled preset
with supported categories; updating a preset preserves its categories unless explicitly changed. The batch
is not an all-or-nothing transaction: successful drafts and installations survive a
later failure; failed installations stay selected for retry. Conversion retries in the
same page skip already saved children. After reloading, use the persisted draft list;
the batch retry cache itself is not persisted.

A child with a nearer/different license requires confirmation of that license and
selection of the relevant children; root approval cannot override it. Memory failure
(HTTP 507) stops further conversion attempts until the user retries. Existing limits
still apply (100 drafts/installations and 32 live prepared requests for one hour);
capacity, license, snapshot and duplicate name/version conflicts are reported per item,
never bypassed.

Packages are single atomic UUID-named JSON envelopes under
`~/Library/Application Support/MiniMuv/skills`, containing the knowledge package,
original source (including imported license/notice text), provenance and host approval.
The Skill review sidebar displays the current user's actual installed-package and
draft storage paths under their respective headings, including when the lists are empty.
This replaces the earlier suggested multi-file layout to avoid partially installed
packages. Storage is private, not encrypted: directory `0700`, files `0600`, locking,
revision CAS, fsync, 100 packages, 1 MiB per package and 64 MiB total. Links and special
files are rejected; no source paths become disk paths. Import all required license
and notice text before review; the operator license registry remains the trust root.

Select up to **4 enabled, matching Skills** in video/image/music prompt enhancement
or long-video storyboarding. Nothing is selected automatically. Selection order is
injection order; only the matching binding's instructions enter the local text request,
never source files, licenses or conversion reports. Application safety, capabilities,
user requirements and output/timing contracts take precedence. Combined instructions
must fit 24,000 UTF-8 bytes and 2,048 tokenizer tokens; the full creative request must
fit 128 KiB and 16,000 input tokens. Overflow blocks explicitly, without truncation.
Outputs are validated and previewed/editable; this never auto-starts media generation.
No Skills retains the existing path, with no extra tokenizer call.

Loading checks exact approval hashes and current licensing, capabilities, text settings
and converter contracts. Changes block enablement/use until reconversion and new review;
the installed list marks stale packages. Skills do not add vision/audio perception,
execute tools, install dependencies or download weights. Applied enhancement or storyboard
identity/version/package hashes are saved as historical attribution, not authority to
re-enable or re-inject a Skill. Editing the affected text clears that new attribution.

API: `GET /api/skills/installed`; `POST /api/skills/install` with
`{request_id,result_text,candidate_sha256,reviewer,checks,categories}`; categories are
nonempty, unique values from `video,image,music,long-video` supported by the bindings
(omitting this field preserves compatibility by selecting all supported categories).
Check keys are
`execution,capabilities,fidelity,contracts,licensing` (all exactly true).
`POST /api/skills/installed/{id}/enabled` takes `{revision,enabled}`;
`POST /api/skills/installed/{id}/delete` takes `{revision}`.
`POST /api/skills/installed/{id}/categories` takes `{revision,categories}`.
Creative endpoints optionally accept `skills:[{id,revision}]` and `target_model`
(the selected **generation** model, distinct from the text `model`).

Text-model JSON requests distinguish an upstream service error envelope from a
malformed completion envelope. An HTTP-success response containing `error` displays
the upstream error message (bounded to 2,000 characters), rather than reporting an
opaque `'choices'` lookup failure. Missing or empty `choices` is an explicit protocol
error; it is not treated as a successful empty result. Strict schema, truncation and
tool/refusal checks remain unchanged. This does not bypass model memory protection.

## Podcast production (local speech models)

The independent **Podcast** workspace supports local Fish Audio S2 Pro 8-bit,
VoxCPM2 4-bit, and Qwen3-TTS VoiceDesign 8-bit models, not music or video
generators. Fish Audio uses an authorized reference WAV (up to 60 seconds /
100 MiB) and its accurate transcript; confirm ownership or permission before
uploading, because that consent is required only when cloning a reference voice.
VoxCPM2 and Qwen3-TTS instead use a text description for each character's
designed voice, so they need no cloning consent and hide that checkbox.
References stay in private local output storage and
are not sent to a third-party service. Manage each model's enabled state and
local path in **Settings > Models**. VoxCPM2 and Qwen3-TTS are externally managed:
their verified local packages must be installed separately, and the app does not
offer project-managed downloads for them.

Write ordered segments for song introductions, monologues, endings, storytelling
or character dialogue. Each segment now supports two source modes: **Generate**
(Fish spoken TTS from segment text) or **Import** (external audio). Generated
segments can select different characters per segment, so one project can clone
and switch among multiple authorized voices. Fish generates **spoken audio**,
not singing. Split the script into short sentences when finer subtitle
boundaries are needed. Save the project, generate sequentially, and preview
completed segments while later segments are still running. Editing a segment or
its voice invalidates affected audio; unchanged completed segments can be reused
after interruption. Projects and results remain available after reload.
Podcast generation logs appear below the preview using the shared generation-log
container, heading typography and log-text styles; other modes' logs stay hidden.
Final video, image, music, long-video, MV and assembled podcast results use the
right-hand preview canvas. Selecting a history project restores its editor and
result; podcast projects are also available in history. Switching modes clears
unrelated media without deleting the saved result.

For imported segments, you can upload an existing WAV file or pull audio from
the app's saved music history list, then place it in the segment sequence.
The audio-source switch highlights the selected mode. An empty music library
shows how to generate music or upload a WAV; loading failures show an explicit
error instead of appearing as an empty library. Refresh updates music choices
without discarding unsaved segment edits.
Reorder segments, set the silence after each segment, and assemble without
invoking Fish. Inputs are normalized to 48 kHz mono PCM16 and concatenated;
this is sequential composition, not background music mixing. Optional
imported-audio text is user supplied, not recognized by an ASR model. Empty
imported text produces no subtitle cue but still advances time.
Download individual segments or the combined WAV and UTF-8 SRT/WebVTT subtitles.
Cue boundaries use actual
normalized audio sample counts plus gaps; each cue covers one script segment.
These are **segment-level**, not word-aligned,
timestamps. Silence is outside the spoken cue. A project supports up to 12
characters and 100 segments, with at most 8,000 characters of text per generated
segment and 0–30 seconds of inter-segment silence. Imported WAV files are limited
to 100 MiB and 12 minutes each.

Podcast rendering shares the application's single-generation resource gate.
Cancel stops only its own worker, retaining already completed segments. Model or
runtime unavailability, revision conflicts, upload errors and rendering failures
are reported explicitly. The current service must be restarted to load the new
backend routes; an old backend disables podcast actions and shows a restart notice.
Do not restart or cancel an unrelated running video merely to enable this workspace.

The `/api/podcasts` API lists and creates projects; project-specific `save`,
`generate`, `assemble`, and `delete` requests use the current `revision`.
Reference/import WAV uploads use `X-Podcast-Revision`; `cancel` targets only that
project's active job. Project GET responses expose per-segment progress and media
URLs, and `export/audio`, `export/srt`, and `export/vtt` serve the merged results.

## Settings, files, and privacy

The workspace expands with wider windows up to 1680 px, giving the editor and preview equal
additional space. Narrow windows keep the single-column layout.

History cards reserve space for metadata, a one-line project name and a two-line
prompt preview. Long names, dates and prompts are truncated within the card;
the history list fits ten complete cards before scrolling.

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
## 创作预设流程

第三方创作知识采用 **GitHub 链接 → 确认许可 → 提取多个子预设 → 保存草稿 → 编辑与预览 → 应用**。同仓库的子 Skill 分别转为草稿；可直接编辑每个任务的方法指导并预览，应用后成为创作页面可选预设，不再要求单独安装再启用。

新版后端重启后才开放预设发布；若仍在运行旧后端，界面明确提示并禁用应用按钮，草稿编辑、预览和保存仍可使用。重启前应等待当前媒体生成结束，不中断在途任务。

应用不自动启动生成，不改写全局文本系统提示词。预设是低优先级创作参考；用户要求、模型能力及输出合同优先，忠实优化不会自动扩写。来源 commit、许可、原始证据和旧 Skill 数据继续保留；重复应用更新同一预设并检查修订冲突。详见 [创作预设规范](Skill_Spec.md#0-创作预设流程2026-10-08)。
