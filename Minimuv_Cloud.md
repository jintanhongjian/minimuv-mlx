# MiniMuv Cloud 网络版可行性研究与开发计划

> 研究日期：2026-10-05。状态：规划建议，不是已实现功能或已验证的生产部署。
>
> 本次只新增本文件。不修改应用代码、配置、模型、下载任务、服务、AOCI 索引；不创建云资源、不上传项目或用户素材、不执行付费推理、不提交或推送 Git。
>
> 研究依据：当前项目源码和说明、Hugging Face 官方文档、公开模型卡、匿名查询的模型 `inferenceProviderMapping`。在线映射和价格会变化，实施时必须重新确认。

## 1. 执行结论

**可以规划开发为不依赖用户 Mac、Apple Silicon、MLX 或本地模型目录的网络版。建议采用“HF 托管推理路由 + HF 专用 GPU 推理部署 + 持久化工作流服务”的混合架构。**

这里的“可以”是架构与模型能力层面的条件性可行结论，不是全部功能已通过远程实测。视频首帧接续、同步音视频、歌词歌曲、部署许可和实际成本仍是立项闸门。

### 1.1 两种目标必须分开

| 目标 | 本次结论 |
|---|---|
| 所有能力只用 HF Inference Providers 现成统一 API，不维护任何模型服务 | 当前证据不足以保证；音乐和视频高级条件是主要缺口 |
| 所有模型推理都通过 HF 生态远程执行，包括 Providers、Inference Endpoints、HF GPU Jobs 或自有 GPU Spaces | 存在可行路径；需部署和验证缺少托管 API 的模型 |
| 保留所有当前模型名称、数值参数和像素级输出，直接把本地模型路径换成 URL | 不建议，也不能保证；不同架构和服务参数不等价 |
| 不限原模型或量化版本，保留图像、音视频、歌曲、分镜、历史恢复等功能 | 推荐目标；通过能力契约选择同类模型，而不是按名称机械映射 |

**“所有模型”的实施口径：覆盖当前八个模型选项所承载的全部功能，并允许同类模型替代。** 原来 LTX Q4/Q8 是本地部署档位，云端可合并成同一 LTX 服务的“快速/质量”预设；若保留两个选项，应明确只是云预设，不能虚标仍在运行 MLX Q4/Q8。

### 1.2 推荐的第一套云端组合

- 文本优化、关键词提取、自动分镜：HF Providers 上状态为 `live` 的 Qwen3-32B 等指令模型。
- 图像：Z-Image-Turbo、HiDream-I1-Full 等已有 Providers 映射的模型；FLUX.2 Klein 优先验证对应文生图接口，必要时自行部署。
- 单镜头音视频与首帧条件：优先在 HF Jobs 验证 LTX-2.3 官方 CUDA/PyTorch 流水线；稳定后按负载选择专用 Endpoint 或 GPU Space。
- 歌曲与纯音乐：优先在 HF Jobs 验证 ACE-Step；YuE 第一代为备选。不能用普通 TTS 冒充歌词歌曲，也不能用无歌词纯音乐模型覆盖全部音乐功能。
- 拼接、首尾帧提取、配乐、字幕：CPU 媒体 worker 执行 FFmpeg/ffprobe；这不是模型推理，不需要 GPU。
- 历史和素材：私有对象存储；HF Storage Buckets 是候选，数据库仍需单独设计。

**产品界面和业务编排不必全部托管在 HF；模型推理可以全部经 HF 远程完成。** 若要求应用本身也尽量托管在 HF，可使用 CPU Docker Space 承载 Web/API，但不要把临时磁盘当作持久数据库或任务队列。

## 2. 研究边界与证据等级

### 2.1 已完成的只读调查

1. 阅读当前功能说明、模型注册表、服务端调用方式、首尾帧保存与恢复、合片逻辑。
2. 查阅 HF Providers、Endpoints、Jobs、Spaces、Buckets、价格与安全文档。
3. 匿名读取部分候选模型公开 API 的 provider 映射、状态、任务类型和许可元数据。
4. 阅读 LTX-2.3、HiDream-I1、FLUX.2 Klein、ACE-Step、YuE 第一代模型卡及相关上游文档。

### 2.2 没有做的验证

- 没有登录或检查用户 HF 账户、余额、Token、权限、GPU 配额。
- 没有提交真实生成请求；没有测量成功率、画质、音质、时延或实际账单。
- 没有部署 Endpoint、Space、Job、Bucket、数据库或队列。
- 没有验证中国大陆访问质量、地区可用性、模型 gated 访问权和商业授权。
- 没有向第三方传送当前源码、提示词覆盖、素材、历史或凭据。

证据分级：

| 等级 | 含义 | 本计划用途 |
|---|---|---|
| E1 | 官方文档或模型卡说明有相应能力 | 证明候选方向，不证明当前账户可调用 |
| E2 | Hub 公共 API 显示指定 provider、task、`live` 状态 | 证明路由候选存在，不证明每个参数或生成质量 |
| E3 | 自有测试账户成功执行目标请求并验证媒体 | 本次未执行，后续 PoC 必须补齐 |
| E4 | 多用户、恢复、费用与负载测试通过 | 正式上线门槛，本次未执行 |

空映射只说明该仓库在本次查询中没有公开 Providers 映射；不证明模型不能远程运行，也不证明其他仓库或供应商没有服务。

## 3. 当前项目基线与云化切入点

| 当前模块 | 已观察到的职责 | 云化处理建议 |
|---|---|---|
| [webapp/server.py](./webapp/server.py) | 本机 HTTP 服务、模型选择、任务运行、历史、分镜；H3 走本机 SSE；其他模型启动本地进程 | 抽出任务编排和模型适配器；云 API 增加认证、租户、持久任务和网络安全边界 |
| [webapp/local_models.py](./webapp/local_models.py) | 本地权重、环境和命令、可用性与进度 | Cloud 模式替换成远程模型目录及能力探测，不删除本地模式 |
| [webapp/model_downloads.py](./webapp/model_downloads.py) | 本机续传、校验、暂停和下载监督 | 不作为云用户操作；如自建 GPU 服务，权重缓存属于运维部署职责 |
| [webapp/workflows.py](./webapp/workflows.py) | 分镜清单、实际首尾帧、历史副本恢复、配乐与字幕合成 | 保留业务语义；将绝对路径改为资产 ID，持久状态改成数据库与对象存储 |
| [webapp/output_storage.py](./webapp/output_storage.py) | 本机目录复制、校验和迁移 | 云端改为对象生命周期、导入导出与跨存储迁移 |
| [webapp/prompt_settings.py](./webapp/prompt_settings.py) 与 [webapp/system_prompts.json](./webapp/system_prompts.json) | JSON 系统提示词、校验、版本冲突与即时生效 | 保留默认内容和校验思想；覆盖配置按租户及版本隔离 |
| [webapp/static/app.js](./webapp/static/app.js)、[index.html](./webapp/static/index.html)、[app.css](./webapp/static/app.css) | 十四语言 UI、模型卡片、进度、四类创作、历史与恢复 | 优先复用交互和样式；能力驱动字段、云模型设置、账户与费用展示 |
| [third_party/local_models.json](./third_party/local_models.json) | 固定本地运行时和模型版本 | 新增独立云注册表；禁止直接把本地仓库清单当远程 API 清单 |

### 3.1 为什么不是简单改服务地址

- 当前服务绑定 `127.0.0.1:8765`，Host/Origin 与推理 URL 校验针对本机使用；不能靠开放端口变成安全 SaaS。
- 任务保存在进程内 `_jobs`，并通过 `_active_job_id` 控制本机活动生成；多实例与服务重启需另一套持久协调机制。
- H3 消费 `/v1/video/generations` 的项目特定 SSE 事件，不能假定 HF 视频服务也返回同样事件。
- 图像、LTX、Music3、YuE2 的现有执行依赖本地 Python 进程、环境和权重。
- 工作流与历史保存本地路径；云端实例重启或扩容后，路径不能代表跨实例可访问的资产。
- 设置目前是全局本机配置，不是多用户权限模型。共享服务的模型管理不能开放给普通用户。
- 当前生成 token、步骤日志、下载百分比不能直接转用到所有远程服务。

## 4. Hugging Face 的四条远程执行路径

| 路径 | 用途 | 优点 | 限制与定位 |
|---|---|---|---|
| Inference Providers | 调用 HF 路由支持的供应商模型 | 接入快、按调用付费、统一凭据入口 | 不是任意 Hub 模型；任务、参数、音轨、取消和结果保存期依供应商 |
| Inference Endpoints | 在 HF 管理的专用资源上部署模型 | 版本与环境可控；自定义 handler/container | GPU 就绪和初始化有成本；自行实现支持能力；大模型冷启动及长请求限制需实测 |
| 自有付费 GPU Spaces | 自定义模型服务、预览或小规模部署 | Gradio 或 Docker 均可构建应用；可管理 Secrets | 重启、休眠、磁盘持久性与扩容需专门设计；公共 demo 不是 SLA |
| HF Jobs | 一次性/批量推理，较长视频、歌曲与 PoC | 远程 GPU、明确任务生命周期、可取消、可设置超时 | 调度、环境安装与权重加载有延迟；结果必须主动持久化 |

### 4.1 使用边界

1. Providers “由 HF 路由”不等于“数据只在 HF 自有机器处理”，请求可能进入 fal-ai、wavespeed、replicate 等供应商。
2. 用户若要求推理不经过外部 Providers，则选择 HF 专用部署/Jobs，并明确底层云基础设施及地区；成本和运维随之增加。
3. 不抓取、借用或依赖他人的公共 Gradio Space 作为生产后端；可用性、配额和条款不受本项目控制。
4. ZeroGPU 是带队列和配额的动态 GPU 能力；当前文档限定 Gradio SDK，不能视为通用 Docker GPU。适合演示或验证，不作为生产长视频的唯一依赖。[S7]
5. Endpoints scale-to-zero 有冷启动。当前文档明确初始化期间可能返回 502，且没有替请求排队；MiniMuv 自己必须保存任务并等待服务就绪。[S6]
6. 不能假定自定义 Endpoint 支持任意长的异步后台任务。容器、副本生命周期、网关请求超时必须验证；长任务优先考虑 Jobs 或持久 GPU worker。

## 5. 功能与模型替代矩阵

### 5.1 八个本地选项及文本能力的映射

| 本地选项/用途 | 必须保留的能力 | 云候选与接入策略 | 当前证据与缺口 |
|---|---|---|---|
| H3 视频 | 文生视频、原生音视频、首帧条件、画幅、历史恢复 | 首选 LTX-2.3 专用部署；H3 的 Providers LoRA 路由作候选 | LTX 卡及流水线有联合音视频和 I2V 能力 E1；H3 LoRA 映射仅证明 T2V E2，音频和首帧未验证 |
| HiDream-O1 图像 | 文生图、方形图像、历史与 seed | HiDream-I1-Full Providers；或自建图像 Endpoint | 有 T2I `live` 映射 E2；I1 不是 O1，2048 输出和 seed 语义需测试 |
| FLUX.2 Klein 4B | 文生图、512/768/1024 尺寸 | 官方非 MLX 权重专用部署；路由满足能力后可优先调用 | 模型卡支持 T2I E1；本次映射为 image-to-image，不能据此声称统一文生图 API 可用 |
| Z-Image-Turbo | 文生图、多尺寸、快速生成 | Providers 为优先 | fal-ai、replicate、wavespeed T2I `live` E2；支持尺寸和限流仍须 E3 |
| LTX 2.3 Q4 | 快速音视频、文生/首帧视频 | LTX-2.3 distilled 1.1 CUDA 服务快速预设 | 官方存在对应 checkpoint E1，仓库 Providers 映射为空；需要自建远程推理 |
| LTX 2.3 Q8 | 较高质量音视频、同上 | 同一服务质量预设或独立部署 | 不宣称云预设等于 MLX Q8；质量和费用通过测评标定 |
| Music3 | 歌词歌曲、纯音乐、风格、时长、WAV | ACE-Step 自建 HF Jobs/Endpoint；若 Music3 同类 API 后续查证可另接 | ACE-Step 模型卡有歌曲、歌词编辑和时长能力 E1；映射为空，远程部署和中文歌词质量未测 |
| YuE2 3B | 歌词歌曲与纯音乐模式 | ACE-Step 为主，YuE 第一代 CUDA 流水线作为备选 | 不能把 YuE 第一代许可证套给 YuE2；备选的纯音乐和时长控制还需确认 |
| 本地文本优化/自动分镜 | 多语言、优化建议、关键词、合法分镜 JSON | Qwen/Qwen3-32B Providers 等 | 有 conversational `live` 映射 E2；结构化输出和字段合法性由应用再次校验 |
| 共用 Gemma 编码器 | 支持 LTX 推理 | 作为 LTX 云服务内部依赖，不是单独面向用户的 API | 权限、精度、内存、许可和缓存与 LTX 部署一起验证 |

### 5.2 在线映射调查快照

以下结果来自 2026-10-05 的匿名公开 API 查询；`live` 不是成功推理回执。

| HF 模型仓库 | 查询到的映射 | 计划解释 |
|---|---|---|
| `HiDream-ai/HiDream-I1-Full` | fal-ai、wavespeed：`live / text-to-image` | 可进入图像 PoC |
| `Tongyi-MAI/Z-Image-Turbo` | fal-ai、replicate、wavespeed：`live / text-to-image` | 可进入快速图像 PoC |
| `black-forest-labs/FLUX.2-klein-4B` | fal-ai、wavespeed：`live / image-to-image`，provider 路径含 edit | 与项目文生图所需任务不一致，需额外验证或自部署 |
| `black-forest-labs/FLUX.1-schnell` | nscale、fal-ai、wavespeed：`live / text-to-image`；部分其他项为 error | 可作为明确改名的图像替代，不静默冒充 Klein |
| `Qwen/Qwen3-32B` | nscale、featherless-ai、deepinfra：`live / conversational`；groq、novita 为 error | 只选择经测试的 live provider，不靠 auto 保证稳定 |
| `Wan-AI/Wan2.2-TI2V-5B` | fal-ai、replicate、wavespeed：`live / text-to-video` | 候选视频输出；映射不证明首帧请求和原生音频 |
| `larryvrh/MiniMax-H3-Turbo-Lora` | wavespeed：`live / text-to-video`，LoRA adapter | 不等同于原 H3 全功能服务，也不据 LoRA 元数据裁决基座许可 |
| `Lightricks/LTX-2.3` | `{}` | 优先 HF 专用部署，不承诺 Providers 一键调用 |
| `ACE-Step/ACE-Step-v1-3.5B` | `{}` | 优先 HF Jobs/专用部署 |

复查方式：读取 `https://huggingface.co/api/models/<repo>?expand[]=inferenceProviderMapping&expand[]=cardData`，并核对 `status`、`task`、`providerId`。该方法只查询公开信息，不需要读取用户 Token。[S19]

### 5.3 不允许的“伪等价”

- 静音视频再拼背景音乐，不等于 H3/LTX 原生同步音视频；若提供此模式，界面必须标记为降级合成。
- 文生视频模型支持条件输入，不代表 HF 路由公开首帧/尾帧参数。
- 图像超分得到 2048 PNG，不等于原生 2048 生成；记录原始尺寸和处理链。
- 英文歌曲可生成，不代表中文歌词逐字正确；需语言覆盖验收。
- 同 seed 不保证跨模型、供应商、版本产生同一内容；恢复记录必须保存模型与运行配置。
- `pipeline_tag=text-to-audio` 或一个音频 SDK 方法不保证歌词、声乐与伴奏控制；本次没有查证到统一歌词歌曲 Providers 接口。

## 6. 推荐架构

### 6.1 逻辑结构

```text
浏览器（现有十四语言创作 UI）
  │ HTTPS / 登录会话
  ▼
Cloud API：认证、租户、能力目录、参数校验、预算预授权
  ├── PostgreSQL：用户、项目、任务、分镜、配置、资产元数据、费用
  ├── 持久任务队列：提交、查询、远程状态协调、媒体后处理
  ├── 私有对象存储：首帧、视频、音轨、实际首尾帧、导出包
  └── Model Gateway：唯一服务器端模型入口
       ├── HF Providers：文本 / 已托管图像 / 验证过的视频
       ├── HF Endpoints 或自有 GPU Spaces：持续服务的自部署模型
       └── HF Jobs：批量、较长视频、歌曲、离线验证

CPU Media Worker：校验媒体 → 首尾帧 → 配乐/拼接/字幕 → 持久发布
浏览器仅查询业务任务，不直接掌握 HF Token 或模型服务管理权限
```

### 6.2 两种部署配置

**A. 推荐生产配置**

- 云 Web/API 与 CPU worker 独立容器部署，数据库和队列为持久服务。
- 模型推理全部经 HF Providers/Endpoints/Jobs。
- 私有媒体存储可采用 HF Buckets 或其他对象存储，使用统一 Storage Adapter。
- 优点：业务服务和昂贵 GPU 生命周期解耦，更容易控制任务恢复、鉴权和费用。

**B. HF 优先的展示/早期配置**

- CPU Docker Space 部署 Web/API，应用端口按 Space 配置，不照搬 macOS 8765 启动脚本。
- HF Jobs/GPU Endpoint 执行模型；外置持久数据库、队列及 HF 私有 Bucket 保存资产。
- 不能把 SQLite/WAL 数据库直接放在未经验证的对象存储挂载上，也不能把 Space 内存队列当持久队列。
- 若希望零外部数据库，可探索单实例持久服务，但其原子性、备份和故障恢复需独立设计，不能宣称具有生产多租户能力。

### 6.3 不推荐

- 浏览器直接持有平台 Token 调用 HF。
- 所有图像、文本、视频、音乐模型塞入一个 GPU Space，依靠切模型维持并发。
- 将一次数分钟生成绑在浏览器 HTTP 连接上，页面关闭即失去任务。
- 在公共 Hub dataset 中发布用户私有历史，或用 Git 提交频繁写任务状态。
- 把所有状态交给 Endpoint 副本的本地文件，缩容后无法恢复。

### 6.4 建议技术栈与未来代码边界

以下仅为未来开发建议，不表示已经创建模块：

- API：FastAPI + Pydantic，便于定义能力 schema、认证中间件、OpenAPI 和异步状态接口；静态 UI 可先沿用原生 JS，不强制改成 React。
- 持久状态：PostgreSQL 为事实来源；Redis 配合成熟 worker 框架承担队列和限流。队列丢失时由数据库待执行记录恢复，不能只靠 Redis。
- 模型客户端：固定版本的 `huggingface_hub`/`InferenceClient`；HF Jobs 和 Endpoint 管理操作独立于用户生成接口。
- 媒体：隔离 CPU worker 镜像内固定 FFmpeg、ffprobe 和字体；GPU 镜像按模型单独锁依赖。
- 建议模块：`cloud/api`、`cloud/auth`、`cloud/models`、`cloud/adapters`、`cloud/tasks`、`cloud/storage`、`cloud/workflows`、`cloud/billing`。允许后续按现有项目风格调整。
- 未来接口草案：`GET /api/v1/models`、`POST /api/v1/jobs`、`GET /api/v1/jobs/{id}`、`POST /api/v1/jobs/{id}/cancel`，以及受权限保护的资产、项目修订与提示词接口。
- 本机版继续使用原启动方式；Cloud 有独立入口、配置与依赖，不把现有 `start.command` 改成云部署脚本。
- 管理资源的 API 单独鉴权；不得将 HF deploy、任意 Job 命令或 Secrets 管理暴露给普通创作用户。

## 7. 模型网关与能力契约

### 7.1 模型身份拆分

每项云模型配置至少区分：

- `logical_model_id`：应用中的稳定 ID，例如 `cloud.video.ltx23.fast`。
- `display_name`：用户看见的真实模型与预设名称。
- `hf_repo_id`、固定 `revision`、运行镜像 digest。
- `transport`：`hf_provider`、`hf_endpoint`、`hf_job`、`owned_space`。
- `provider`、`provider_model_id` 或管理员登记的 deployment ID。
- `task` 和经测试的 `capabilities`。
- `parameter_schema`：尺寸、时长、帧数、steps、seed、音频、歌词及枚举约束。
- `credential_reference`：服务器 Secret 引用，不含明文 Token。
- `license_review`、`health_state`、`verified_at`、预计费用及限额。

禁止普通用户在模型设置里输入任意服务 URL、镜像、执行命令或仓库代码。

### 7.2 最小能力集

| 能力 | 需要记录的事实 |
|---|---|
| 图像 | T2I/I2I、允许尺寸、原生输出格式、seed 支持 |
| 视频 | T2V/I2V、首帧条件、原生音频、时长/帧数/画幅、最大请求 |
| 音乐 | 纯音乐、歌词、人声、支持语言、长度限制、返回采样率 |
| 文本 | system message、结构化输出、上下文、超时、token 用量 |
| 运维 | 提交/查询/取消方式、是否支持 webhook、状态粒度、结果 TTL |

对于未知能力使用 `unknown`，前端不能当成 `true`；未通过首帧测试的模型不能进入长视频接续模式。

### 7.3 统一业务请求与响应

- 请求：业务任务 ID、能力类型、提示词版本、参数、输入 asset IDs、用户预算和幂等键。
- 响应：业务状态、远程 request/job ID、媒体 asset IDs、实际参数、费用与错误。
- Provider 原始响应保留必要的脱敏诊断信息，但不向前端暴露密钥、内部路径和管理接口。
- 长任务优先 `submit/query/cancel`；同步接口也在服务端 worker 中运行，不锁住浏览器请求。
- 使用 HF `InferenceClient` 或文档明确的 HTTP 协议；OpenAI-compatible 只用于确认支持的聊天接口，不扩展假设到所有视频和歌曲。

### 7.4 参数归一化原则

- 前端默认值由能力目录产生，不全模型通用一个 steps/时长/分辨率列表。
- LTX-2.3 模型卡要求空间尺寸可被 32 整除，帧数采用 `8n+1` 几何；目标秒数、fps 和实际帧数需适配，并记录最终时长。[S12]
- 原来的 5/8/10/15 秒选项只有在远程模型确实接受时启用；不能静默取整后仍显示原时长。
- 音频转 WAV、视频统一 MP4 是交付格式归一化，不是宣称模型原生输出这些格式。
- 对不支持的参数明确报错或让用户选择兼容预设，不无声忽略。

## 8. 任务状态、取消与费用一致性

### 8.1 建议状态机

```text
created → validating → budget_reserved → queued
  → waiting_for_capacity → submitting → running
  → fetching_result → processing_media → completed

异常：failed / timed_out / cancel_requested / cancelled / reconciliation_required
```

- 所有状态写数据库；任务日志带事件序号，SSE/轮询都能断线恢复。
- 远程服务无步骤进度时显示“排队/运行/获取结果”，不伪造百分比。
- `model-notice` 保留为模型健康、队列、冷启动及任务提示区；不再显示本机权重下载。
- 图片、视频、歌曲、合片都只有媒体完整验证并持久保存后才算成功。
- API、队列、worker 使用租约、心跳、幂等和 outbox 等协调机制，防重复执行。

### 8.2 重试与不确定提交

- 查询、下载和后处理可按幂等条件重试。
- 429、服务初始化、暂时性网络错误采用有上限的退避；区分 Endpoint 冷启动与生成失败。
- 如果提交超时但供应商可能已经接受请求，标记 `reconciliation_required`，查询远程记录或等待回调；不能盲目再次创建收费任务。
- 供应商没有幂等/查询接口时，应用自己的幂等键不能保证外部“恰好一次”；界面和账务必须承认这种限制。
- 不自动跨 provider 切换已提交任务，避免重复计费和画质变化。

### 8.3 取消的真实含义

- 自有 HF Job 使用取消能力；GPU worker 在阶段边界检查取消。
- Providers 能否停止计算取决于服务，不能将关闭连接标记成已经停止计费。
- 用户取消后不再调度后续镜头，但已经接受的远程调用可能仍产生费用。
- 必要时先显示“取消已申请”，远端确认后才显示“已取消”；最终费用按账单事实结算。
- 删除历史不等于供应商同步删除其缓存；需明确结果保留和删除边界。

## 9. 长视频、首尾帧、修订与字幕

### 9.1 必须保留的当前语义

1. 自动分镜产生可编辑草稿，不自动代用户确认开始付费生成。
2. 每镜保存实际生成的首帧、尾帧及输入条件首帧，三者不可混为同一字段。
3. 默认让**上一镜实际尾帧成为下一镜的首帧条件**；用户指定首帧时优先该条件。
4. 条件约束不保证像素级首帧完全一致，需实测接续自然度。
5. 恢复历史创建新项目修订，不覆盖源历史；复用已保存素材供修正。
6. 长视频仅保留逐镜或全局新配乐生成，不再提供历史音乐来源选择及字幕烧录选项。音乐驱动视频归独立 MV 类别；本地当前仅支持音乐选择、试听和草稿保存，分析、分镜与生成按 [mv_plan.md](./mv_plan.md) 后续实现。

### 9.2 云工作流执行

- 长视频依赖图：分镜 → 首帧素材 → 视频镜头 → 边界帧 → 后继镜头 → 新配乐 → 合片 → 发布。MV 的音乐分析、时间轴和可选字幕是后续独立能力，不纳入长视频基础等价承诺。
- 依赖前镜尾帧的镜头顺序执行；只有互不依赖的镜头、图片和配乐可并行。
- 每镜生成结束即保存视频、音轨、媒体摘要和边界帧，再提交下一镜。
- 修改第 k 镜提示词、模型或条件帧时，沿依赖边标记下游结果过期；有独立显式首帧的后继是否复用由依赖图判定。
- 结果缓存键包括输入资产哈希、参数、提示词版本、模型 revision、provider 和预设；不能只根据分镜序号复用。
- 服务重启从已持久状态恢复，不重新生成已验证镜头，不从零提交全部收费任务。
- 无原生音轨时，不默认静音补齐后假报同步音视频成功；仅在用户确认的降级模式中允许。

### 9.3 媒体处理

- Worker 对结果检查大小、格式、分辨率、fps、时长、音视频流和可解码性。
- 使用 FFmpeg 提取 PNG 首尾帧，统一交付帧率/画幅/音频采样率，记录每次变换。
- 配乐支持原音、替换和混音规则；不能因拼接而意外丢弃用户选择的音轨。
- MV 后续开放字幕时，字体随镜像固定；十四语言及 RTL 文本分别检查字体覆盖和排版。
- MV 歌词字幕若按分段时间估计，需明确“估计时间轴”；精确字词同步另需对齐模型及许可审查。目前不承诺已实现。
- 输出先写唯一临时资产并验证，再发布数据库引用；失败清理只针对本任务临时文件。

## 10. 数据、资产与配置

### 10.1 建议数据实体

`users / tenants / projects / project_revisions / shots / jobs / job_attempts /
assets / model_deployments / prompt_profiles / usage_ledger / budget_reservations /
audit_events`

- 全部业务资源归属租户，服务端做对象级访问检查。
- asset 保存类型、哈希、字节数、媒体元数据、存储 key、来源任务与保留策略。
- 历史记录引用 asset ID，不保存供应商短时 URL 作为永久下载地址。
- workflow revision 和 shot 保留实际首帧、实际尾帧、条件帧、来源修订及依赖。
- 任务记录实际 provider、模型、预设、runtime revision、提交时间与远程 ID。

### 10.2 对象存储

- HF Buckets 当前文档提供可变、非版本化、S3-like 存储及 Spaces/Jobs 集成。[S9]
- 其能力不能自动等同于某云厂商完整 S3：签名 URL、CORS、生命周期、地区、IAM 粒度、并发语义均需 PoC。
- 如 HF Bucket 不满足直接私有下载和租户授权，API 代理授权下载，或改用满足要求的对象存储；模型仍经 HF 推理。
- 使用不可变唯一 key 保存修订；哈希校验不代替授权。
- 元数据由数据库管理，Bucket 不承担任务事务。
- 用户结果不可默认公开；对外分享使用独立分享授权、可撤销链接和有效期。

### 10.3 系统提示词

- 默认提示词继续由 JSON 描述，但用户覆盖改成租户级版本记录，避免一个用户修改影响全站。
- 管理员可编辑平台默认，用户可编辑自己有权限的用途配置。
- 保留 revision 冲突检测、字段长度、分镜数量占位符及合法输出校验。
- 任务开始冻结提示词版本；重新生成可选择沿用历史版本或明确升级。
- 模型针对性 prompting 建议作为 profile 层，而不是把服务商参数写入通用规则。

### 10.4 从本地导入

- 未来提供用户主动导出的迁移包：历史、项目修订、模型映射、生成参数、素材和校验清单。
- 不上传本地绝对目录、Token、环境和模型权重。
- 导入将路径转 asset ID，保留旧模型标签；待用户选择云映射后才能重新生成。
- 旧作品继续可查看，不因旧 MLX 模型云端不可用而失效。
- 迁移过程复制而不删除本地数据；验证成功后用户自己决定后续管理。

### 10.5 运维、备份与观测

- 按业务 task ID、remote ID 和 tenant ID 关联日志、调用时延、队列等待、失败、取消及费用；日志不保存密钥或默认记录完整私人素材。
- 数据库启用恢复方案，对象存储保留备份清单与哈希；非版本化 Bucket 的覆盖/删除需要应用级保护和独立备份。
- 初期可提出 RPO ≤15 分钟、RTO ≤4 小时的目标，成本与技术方案在 P0 确认，并在 P5 实际恢复演练；不能仅因“已开备份”就认为满足。
- 对 Provider 不可用、积压、重复提交疑似计费、余额低、资产保存失败和 GPU 长时间空闲收费分别告警。
- 模型目录定期复查可用性；新版本先验证、灰度再发布，不让上游 main 自动改变用户作品来源。
- 管理员可冻结新提交、等待已接受远程任务终态、导出账本和清理过期临时素材；不批量删除未知任务或用户作品。

## 11. 界面与体验计划

保持当前四类创作入口、十四语言、主题、折叠卡片、历史和分镜编辑交互。

Cloud 模式设置建议：

| 本地设置 | Cloud 模式 |
|---|---|
| 模型目录、Gemma 目录 | 模型真实名称、provider、能力、健康与版本 |
| 下载/继续、暂停下载 | 普通用户查看状态；部署启动/暂停只给管理员 |
| 本机服务 URL | 管理员登记的可信部署，不开放任意 URL |
| 输出目录 | 云存储用量、保留策略、授权下载与导出 |
| steps/seed 固定字段 | 按模型能力显示，未知或不支持时说明原因 |
| 当前本机任务进度 | 持久云任务状态、排队/冷启动、可取消性与费用 |

- 生成前显示预估费用和预算上限；长视频展示镜头数、顺序依赖和失败重试策略。
- 清楚区分“原生音视频”和“视频 + 后期配乐”。
- 显示实际使用的替代模型，不把 HiDream-I1 标成 O1，不把 ACE-Step 标成 Music3。
- 模型不可用时给出解释和可选择替代方案，不偷偷切换。
- 保存草稿、关闭页面和重新登录后恢复任务；生成按钮防重复提交。
- 所有新增状态、费用、许可和错误文案覆盖十四语言，验证阿拉伯语 RTL 与窄屏。

## 12. 安全、隐私与许可边界

本节是云产品设计要求，不是对当前代码已完成的安全审计。

### 12.1 认证和数据隔离

- 采用成熟的 OIDC/OAuth 登录或托管身份服务；HF OAuth 可作为候选登录方式。
- HF 登录身份不自动等于拥有用户推理账单授权；读取/推理权限及 Token 获取需独立合规设计。
- 会话 cookie 设置 HttpOnly、Secure、适当 SameSite；写操作有 CSRF 防护。
- CORS 与 Host/Origin 为明确域名允许列表，保留本机模式原保护，不直接删除。
- 每个项目、任务、资产和提示词的读取、修改、下载、删除都校验租户权限。
- 上传做大小、类型、解码、像素/时长限制，后台处理不执行上传内容。

### 12.2 凭据和网络

- 平台 HF Token 只放服务器 Secrets/Secret Manager，不放静态 JS、普通 JSON、URL、日志或导出包。
- MVP 优先平台付费 + 应用内用户额度。BYOK 若需要，后续单独设计加密、权限、撤销和不落日志。
- 数据库、对象存储与模型调用使用最小权限，Token 轮换可不重建用户任务。
- Provider 返回的媒体 URL 视为不可信外部输入：检查域名、DNS、重定向、大小、TLS 和超时，阻止私网地址与 metadata 访问。
- Endpoint/Space/Job 镜像和代码固定版本；默认不执行未审查的 `trust_remote_code`。

### 12.3 内容和隐私

- 生成前明确素材会传送到 HF 及指定 provider；HF Endpoints 的隐私说明不能泛化给第三方 Providers。[S10]
- 记录数据处理地区、provider 保留政策、日志策略、用户删除与备份期限。
- 默认私有历史；分享和训练再利用需独立明确同意。
- 歌曲、声音、人脸和参考图需要用户具有适当权利；制定禁止冒充、未经授权声纹使用和违法内容的规则。
- 针对高成本生成、防滥用和公开分享设置限额、内容检查及申诉流程。

### 12.4 许可证

| 候选 | 初步材料 | 必须完成的审查 |
|---|---|---|
| Z-Image、FLUX.2 Klein 4B、Qwen3-32B、ACE-Step | 元数据/模型卡显示 Apache-2.0 | 固定 checkpoint、附属编码器、代码及服务商输出条款 |
| HiDream-I1-Full | 主模型显示 MIT；模型卡列出其他 VAE/文本编码器 | 组件分别审查，尤其 gated Llama 编码器；不能只看主模型 MIT |
| LTX-2.3 | 仓库带 LTX-2 Community License | 审核具体 revision 的许可证、商业条件、关联依赖；不要套用上游 main 的新版 2.5 许可 |
| YuE 第一代 | 模型卡声明 Apache-2.0 | 完整两阶段组件及输出规则 |
| 当前 YuE2 MLX | 本地清单注明权重 CC BY-NC 4.0 | 不把第一代 YuE 授权套给 YuE2；商业服务默认不使用，除非取得明确授权 |
| H3 LoRA 路由 | adapter 元数据显示 Apache-2.0 | 基座、adapter、供应商服务许可分别确认，元数据不代替授权 |

本计划不是法律意见。不可因使用 HF API 就认为自动获得所有模型的商业许可。[S13–S18]

## 13. GPU 与运行环境计划

- Cloud API/媒体服务尽量不安装 MLX、Metal 或 macOS 专用依赖。
- 图像、视频、音乐使用独立镜像，按各流水线受支持的 Python/CUDA/PyTorch 版本固定，不能沿用本机解释器版本作为云端要求。
- LTX-2.3 先采用官方 `ltx-pipelines`，其模型卡尚称 Diffusers 集成 coming soon；实施时复查，不预设当前稳定 Diffusers 版本已支持完整能力。[S12]
- 模型和镜像下载使用固定 revision、校验和可复用缓存；gated 模型访问提前解决。
- LTX 22B 的 BF16 Transformer 权重理论量级约 44 GB，尚未包含编码器、VAE、激活和视频分辨率开销；不能因此推断 48 GB GPU 一定足够。
- 首轮以能提供足够余量的 80 GB 级 GPU 测量，再评估 CPU offload、FP8、较小分辨率或多 GPU。具体 HF SKU、区域与配额以控制台可用性为准。
- 每模型至少记录峰值 VRAM、CPU RAM、磁盘、冷启动、热运行时间、处理镜头长度及并发。
- 初期 GPU worker 每设备单任务，之后按实测显存扩容；不能以 API worker 数量直接决定 GPU 并发。
- 安排空闲缩容，但每次冷启动/权重加载都计入时延和费用模型。

## 14. 成本、配额与定价计划

### 14.1 成本模型

```text
单作品成本 =
  文本 token 调用
  + 图像请求
  + 视频各镜头调用或 GPU 占用
  + 音乐调用或 GPU 占用
  + 重试与冷启动
  + 媒体 CPU 处理
  + 存储和传输
  + 平台基础服务摊销
```

Providers 依供应商和模型计价；专用资源按占用时间计价。不能把“视频最终长度”直接当“GPU 运行秒数”，也不能把请求数当所有模型的统一计费单位。

### 14.2 官方价格参考与示例

- 本次 HF Endpoints 文档列出 AWS L4 x1 约 $0.8/小时、L40S x1 约 $1.8/小时、A100 80 GB x1 约 $2.5/小时；实际按分钟结算，初始化与运行也会影响费用。[S5]
- 上述是文档快照，不保证账户配额或该 GPU 能跑所选模型，且不能套给 Jobs/Spaces。
- Providers 文档列 Free $0.10/月、PRO $2/月 compute credits 等；额度小且可变，不能支撑“永久免费全模型”。[S4]
- 以 $2.5/小时资源持续运行 720 小时估算：单副本约 $1,800/月，尚不含其他服务。
- 若相同费率下一个作品累计占用 GPU 12 分钟，则 GPU 成本约 $0.50；这是算式示例，不是 LTX 性能承诺。
- 假设 3 分钟作品用 24 个约 8 秒镜头并裁剪合成，重试开销 15%，则镜头计费量期望约 27.6 次；具体价格为 `27.6 × 每镜头实际单价`，再加音乐/文字/存储。价格必须由 PoC 账单填入。

### 14.3 费用控制

- 用户/租户/模型/项目分别设置预算、并发、时长、分辨率和重试次数上限。
- 提交前预留额度，接受任务后记录实际消费，不以“界面取消”强制归零。
- 单任务额度不足则明确拒绝，不让长视频生成到一半无提示停摆。
- 开发账户设置总支出硬闸门和告警；测试资源按到期时间暂停/删除。
- 成本账本保留预估与实际之差；未确认供应商退款不返还为已到账。

## 15. 阶段化开发与交付闸门

以下排期按 1–2 名熟悉 Python/Web、GPU 部署和媒体处理的工程师估算，可并行；不是报价。GPU 配额、许可或复杂模型兼容会延长周期。**当前不执行任何阶段。**

| 阶段 | 预计投入 | 产物 | 进入下一阶段的条件 |
|---|---|---|---|
| P0 需求与资源确认 | 2–3 人日 | 全功能/降级边界、HF 账户权限、预算、许可清单 | 所有未知需求标记；用户批准 PoC 消费上限 |
| P1 模型能力 PoC | 5–10 人日 | 文本、图像、LTX 音视频、ACE-Step 歌曲的测试回执和账单 | 首帧+音频及歌词歌曲实测成功；无关键许可阻断 |
| P2 Cloud 基础与 Gateway | 5–8 人日 | 认证、租户、资产、持久任务、能力目录、预算记录 | 重启恢复、幂等、隔离和费用归属通过 |
| P3 单项生成与云 UI | 4–7 人日 | 图像/视频/音乐/文本完整链路，十四语言云设置 | 媒体交付及参数适配通过，不依赖用户本机推理 |
| P4 长视频与历史修订 | 5–8 人日 | DAG、边界帧、新配乐合成、恢复、导入导出 | 服务中断可恢复；下游失效与源历史不可变通过；MV增强另按mv_plan.md规划 |
| P5 生产加固与试运行 | 5–8 人日 | 限流、监控、备份、许可归档、灰度/回滚 | 多用户、负载、账单和故障演练满足上线门槛 |

总量约 26–44 人日；考虑串行闸门和外部等待，日历期建议预留 6–10 周。若只做图像/文本/基础视频展示可以缩短，但不能称全部现有功能完成。

### 15.1 P1 建议实验

1. 文本：多语言优化和分镜 JSON；计数、时长、字段及错误输出校验。
2. 图像：HiDream-I1、Z-Image、FLUX 候选，各尺寸和 seed；确认路由真实支持的任务。
3. 视频：先一镜 5–8 秒含音频，再两镜以第一镜尾帧接第二镜首帧；记录音轨、时长、几何和接续效果。
4. 歌曲：ACE-Step 至少测试中文歌词、英文歌词和纯音乐各一组；验证 WAV、时长、结构和用户主观听感。
5. 基础恢复：中断查询而不中断远程任务，重新连接可找到原 remote ID 和输出。
6. 费用：每次实验记录 cold/warm、GPU 型号、运行时间、计价方式和实际扣费。

如果 P1 的歌词或首帧音视频不通过，应改模型、调部署或明确缩小产品范围，而不是在代码已大量开发后才发现功能缺口。

## 16. 验收计划

以下数字是建议验收目标，需 P0 确認，不是当前项目测试结果。

### 16.1 功能验收

| 项目 | 最小验收 |
|---|---|
| 图像 | 生成合法 PNG；能力声明支持的每个尺寸各成功至少 3 次；2048 若经超分必须披露 |
| 文本 | 至少 30 组中/英输入；成功交付的分镜全部通过 schema、数量和时长校验；坏 JSON 明确失败或有界修复 |
| 视频 | 每个正式预设至少 10 次；媒体可解码、符合声明画幅/时长、应有音轨时确有有效音轨 |
| 首帧接续 | 至少 3 个三镜项目；保存条件帧和实际首尾帧；接续自然度人工检查，不宣称像素相等 |
| 音乐 | 中文、英文歌词与纯音乐至少各 5 次；可播放、时长符合支持范围，歌词与声乐质量人工签收 |
| 长视频 | 至少 1 个约 60 秒项目与 1 个约 3 分钟项目，含新配乐生成；不含历史音乐来源选择和字幕 |
| MV | 本地现阶段验证音乐选择、试听、草稿持久保存、重新编辑及缺失来源提示；生成能力另按 mv_plan.md 分阶段验收 |
| 历史修订 | 修改中间镜头后源历史不变；正确保留/失效下游；所有新素材可授权下载 |
| 本机独立性 | 无 MLX、无本地权重的普通浏览器设备仍能完成全部被声明支持的流程 |

精确时长验收可先设为差异不超过 `max(0.5 秒, 目标时长的 3%)`；若模型离散帧数不满足，必须在提交前披露实际输出时长，不能事后偷偷通过裁剪掩盖。

### 16.2 可靠性和权限

- 浏览器断网、刷新、登出重登不丢任务。
- API 与 worker 分别在提交前、提交后、取结果、后处理阶段重启，正确恢复状态。
- 模拟 429、冷启动 502、远程失败、坏媒体、供应商 URL 到期、存储失败、数据库提交失败。
- 同幂等键反复提交在业务上只创建一个任务；远程重复费用风险可见并能协调。
- 对取消但无法停止的 provider，测试界面与账本不虚报已停止计费。
- 用至少 10 个测试用户验证排队和租户隔离；执行越权 ID/下载/提示词读取负例。
- 做对象删除、备份恢复和源项目修订恢复演练。

### 16.3 性能与质量

- API 只受理任务：建议 p95 ≤ 1 秒，不把生成时间藏入 API 时延指标。
- 任务状态更新：正常网络建议 5 秒内可见；远端无百分比时只展示真实阶段。
- 分别统计冷启动/热启动 p50/p95、失败率、单任务成本、VRAM 和积压等待时间。
- 性能门槛由 P1 实测后定，不先承诺“几秒生成高清长视频”。
- 小规模稳定试运行建议至少 100 个混合任务，成功率目标 ≥95%；内容质量另做评测，不能只用 HTTP 200。

## 17. 风险与退路

| 风险 | 严重程度 | 应对 |
|---|---|---|
| 歌词歌曲无现成统一 API | 高 | ACE-Step HF 自部署先验证；不拿 TTS 替代 |
| I2V 与原生音频无法同时满足 | 高 | LTX 专用部署；替换候选；未验证不开放完整长视频 |
| 大模型 GPU/配额/费用过高 | 高 | Jobs 批量、预热复用、快/质量档；设预算；必要时降低明确公布的规格 |
| 商业许可阻断 | 高 | 固定 revision 审核；排除 NC 权重；替换或取得授权 |
| 重试重复计费、远程取消无效 | 高 | remote ID、幂等、协调态、取消费用说明 |
| 用户资料进入第三方 provider | 高 | 明示数据路径；选择专用部署；不假设统一隐私承诺 |
| Space/Endpoint 重启丢文件 | 高 | 外置数据库及对象存储；只在验证后发布 |
| 模型映射变化/供应商停服 | 中高 | 版本和能力目录、健康检测、显式换模型、不静默迁移 |
| 多镜人物一致性或音乐衔接不足 | 中高 | 首帧链、提示词模板、人工预览；必要时研究参考图/角色约束，作为扩展 |
| Bucket API 与预想不符 | 中 | Storage Adapter + PoC；可换对象存储，不影响模型网关 |
| 国内网络、上传时延 | 中 | 地区测试、分段上传、素材压缩、超时与断线恢复 |

优先级：

1. **P0 必须**：安全访问、文本、图像、含首帧与音轨的视频、歌词/纯音乐、持久历史、长视频恢复。
2. **P1 优先**：预算界面、完整十四语言、导入导出、用量监控、灰度部署。
3. **P2 扩展**：BYOK、协作编辑、精确歌词对齐、自动 provider 优选、更多参考帧能力。

允许先上线受限试用版，但要明确哪些 P0 能力尚未开放，不能因此宣布“所有模型云化完成”。

## 18. 后续实施范围与保护策略

后续若批准开发，建议在独立分支或独立 Cloud 应用入口实施，本机版继续可用：

1. 不直接改写现有 MLX 调用；先抽象模型网关接口，再实现 local/cloud 两套 transport。
2. 优先复用请求校验、前端交互、提示词默认和分镜语义，不机械复用本机路径与进程状态。
3. Cloud 依赖分组、镜像和配置独立；Apple Silicon 安装流程不被迫安装 CUDA 依赖。
4. 数据库 schema、工作流版本和资产映射均支持版本化迁移；试运行前完整备份。
5. 灰度按租户开启；失败可停新任务，保留已提交任务与结果可查询，不回退为丢数据。
6. 云注册表与本地注册表并存；旧历史继续保留真实来源，重新生成显式选择云替代。
7. 管理员部署资源与用户生成权限分开；UI 折叠不代表暂停 GPU，GPU 暂停是显式管理操作。

**本次没有实施以上变化。**

### 18.1 开始开发前待确认

- 网络版是个人远程使用、邀请制团队，还是公开收费 SaaS？
- 接受 HF 路由第三方 Providers，还是只接受专用部署？
- 预算、币种、并发和最大视频/歌曲长度是多少？
- 必须保留原生同步音视频，还是允许用户主动选择静音视频+后期配乐？
- 原模型品牌是否必须保留；哪些中文歌词与画质指标必须达到？
- 应用是否也必须托管在 HF，还是只要求所有模型经 HF 推理？
- 数据地区、素材保留时间和商业许可适用主体是什么？

这些问题在计划内登记，不在本次主动创建资源或进行收费验证。

## 19. 官方资料与核验来源

以下均为本次查阅的公开来源；上线前重新检查日期、版本、API 和条款。

- **S1**：[HF Inference Providers 总览](https://huggingface.co/docs/inference-providers/index)
- **S2**：[Text-to-image 参数与返回](https://huggingface.co/docs/inference-providers/tasks/text-to-image)
- **S3**：[Text-to-video 参数与返回](https://huggingface.co/docs/inference-providers/tasks/text-to-video)
- **S4**：[Providers 价格与计费](https://huggingface.co/docs/inference-providers/pricing)
- **S5**：[Inference Endpoints 价格](https://huggingface.co/docs/inference-endpoints/pricing)
- **S6**：[Endpoints 自动扩缩与冷启动](https://huggingface.co/docs/inference-endpoints/autoscaling)
- **S7**：[Spaces ZeroGPU 配额、SDK 和运行限制](https://huggingface.co/docs/hub/spaces-zerogpu)
- **S8**：[HF Jobs 总览](https://huggingface.co/docs/hub/jobs-overview)及[快速开始与结果持久化](https://huggingface.co/docs/hub/jobs-quickstart)
- **S9**：[HF Storage Buckets](https://huggingface.co/docs/hub/storage-buckets)及[Spaces 磁盘与卷](https://huggingface.co/docs/hub/spaces-storage)
- **S10**：[Endpoints 安全与隐私](https://huggingface.co/docs/inference-endpoints/security)
- **S11**：[Endpoint 自定义容器](https://huggingface.co/docs/inference-endpoints/guides/custom_container)及[Docker Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker)
- **S12**：[LTX-2.3 模型卡](https://huggingface.co/Lightricks/LTX-2.3)及[官方流水线说明](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-pipelines/README.md)
- **S13**：[LTX-2.3 仓库许可证](https://huggingface.co/Lightricks/LTX-2.3/blob/main/LICENSE)
- **S14**：[HiDream-I1-Full 模型卡与组件说明](https://huggingface.co/HiDream-ai/HiDream-I1-Full)
- **S15**：[FLUX.2 Klein 4B 模型卡](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)
- **S16**：[ACE-Step v1 3.5B 模型卡](https://huggingface.co/ACE-Step/ACE-Step-v1-3.5B)
- **S17**：[YuE 第一代模型卡及许可](https://huggingface.co/m-a-p/YuE-s1-7B-anneal-en-cot)
- **S18**：[MiniMax H3 Turbo LoRA 候选](https://huggingface.co/larryvrh/MiniMax-H3-Turbo-Lora)
- **S19**：公开模型 API 查询，例如 [LTX-2.3 映射](https://huggingface.co/api/models/Lightricks/LTX-2.3?expand%5B%5D=inferenceProviderMapping&expand%5B%5D=cardData)、[ACE-Step 映射](https://huggingface.co/api/models/ACE-Step/ACE-Step-v1-3.5B?expand%5B%5D=inferenceProviderMapping&expand%5B%5D=cardData)、[Z-Image 映射](https://huggingface.co/api/models/Tongyi-MAI/Z-Image-Turbo?expand%5B%5D=inferenceProviderMapping&expand%5B%5D=cardData)；其余模型使用相同查询方式。
- **S20**：[Chat Completion](https://huggingface.co/docs/inference-providers/tasks/chat-completion)、[Providers 任务列表](https://huggingface.co/docs/inference-providers/tasks/index)、[Qwen3-32B](https://huggingface.co/Qwen/Qwen3-32B)、[Wan2.2 TI2V](https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B)、[FLUX.1 schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell)。

### 最终建议

**批准“小预算、强验收”的 P1 可行性 PoC，而不是直接批准全站迁移。** 先验证 LTX 首帧音视频和 ACE-Step 中文歌词歌曲，再确定 GPU 配置、成本和生产 transport；同时快速验证图像与文本路由。通过后建设独立 Cloud 服务，复用 MiniMuv 的创作界面、提示词配置与分镜历史语义，保留现有本地版不受影响。
