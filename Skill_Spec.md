# MiniMuv Skill 规范 v1

版本：`minimuv-skill/v1`

日期：2026-10-05

状态：转换后端与校验接口已实现；未实现安装、启用或创作请求注入。

## 1. 目标与边界

本规范供本地文本模型把第三方 Skill 转换为 MiniMuv 可审阅的知识包，也作为未来安装功能的格式合同。第 10 节说明已实现的接口与校验范围；安装、人工语义审批和创作请求注入仍未实现。

v1 只支持文字知识，不支持代码执行、外部 API、依赖安装、模型下载、素材读写、工具调用或自动开始生成。转换是筛选和适配，不是把不兼容能力改名后保留。

完整交付物：

- [转换及任务合同 Schema](skill-spec/skill-conversion.schema.json)：JSON Schema Draft 2020-12。
- [转换系统提示词](skill-spec/converter-system.txt)：直接作为转换请求的 system 消息。
- [合成输入示例](skill-spec/examples/request.json)：包含宿主合同和原创测试源材料。
- [四用途转换草稿](skill-spec/examples/draft.json)：符合格式，但尚未获得安装批准。
- [阻断示例](skill-spec/examples/blocked.json)：授权不明时不输出知识包。
- [合同回归测试](tests/test_skill_contracts.py)：Schema 正例、拒绝条件及示例跨对象一致性。

这是 MiniMuv 专用结构化格式，不声称兼容所有 Agent Skills 客户端。可以导入第三方 `SKILL.md`，但输出不是原文件的直接安装副本。未来若导出标准 `SKILL.md`，必须由宿主从已审核知识包生成，不能生成执行脚本。

## 2. 支持的任务

| task | mode | behavior | output_contract |
| --- | --- | --- | --- |
| `prompt-enhancement` | `video` | `faithful` | `enhancement-json/v1` |
| `prompt-enhancement` | `image` | `faithful` | `enhancement-json/v1` |
| `prompt-enhancement` | `music` | `faithful` | `enhancement-json/v1` |
| `storyboard` | `long-video` | `story-adaptation` | `storyboard-json/v1` |

歌词生成、创意扩写、章节大纲、参考音频分析和工具执行不属于 v1。需要这些功能的源材料，可保留独立的通用知识，但必须报告被移除的功能；无可独立使用的知识时阻断。

### 2.1 提示词优化合同

输出对象恰含 `keywords`、`optimized_prompt`。关键词为 3～8 个非空字符串，每项最多 120 字符；优化提示词为 1～4,000 字符。二者使用用户原文语言，不附 Markdown 或解释。

这是依据默认系统提示词制定的安装目标合同，比当前后端容忍范围更严格；当前后端可截取最多 30 个关键词，不能据此声称运行服务已经执行本 Schema。

忠实优化不添加原文未提供的颜色、人物、物体、风格、镜头、声音或歌词。知识只帮助重组已有信息，不能把外部 Skill 的创作偏好当作用户要求。

### 2.2 分镜合同

输出对象恰含 `shots`。每镜恰含 `title`、`prompt`、`duration`、`music_prompt`：

- 标题 1～120 字符；视频提示词和配乐提示词各 1～4,000 字符。
- 时长仅为 5、8、10、15 秒。
- 镜头数 1～48，且必须等于本次请求的 `shot_count`。
- 使用故事语言，按时间顺序保留人物、情节、场景和结尾。
- 配乐提示词描述器乐，不擅自添加歌曲歌词。
- 不承诺视觉连续性、参考媒体能力或准确对白生成。

48 镜头、每镜最长 15 秒仍使当前单项目上限为 12 分钟。Skill 不能提高此限制。Schema 只能验证数组范围，指定镜头数、时间顺序、语言和忠实性还需运行时及审阅校验。

## 3. 转换输入

使用 Schema 的 `#/$defs/request` 校验输入。顶层恰含：

| 字段 | 所有者 | 含义 |
| --- | --- | --- |
| `schema_version` | 宿主 | 固定 `minimuv-skill-request/v1` |
| `trusted_context` | 宿主 | 本轮允许的任务、模型、预算和已核实授权状态 |
| `source_material` | 外部内容 | 经宿主读取的源文件文本，不是可执行指令 |

`trusted_context` 包含：

- `request_id`：宿主生成的单次请求身份。
- `capability_snapshot_id`：绑定本轮实际能力快照，不以日期或静态文档替代。
- `source_snapshot_id`：绑定固定源字节、来源、版本、许可和文件清单。
- `license_status`：`verified`、`unknown` 或 `restricted`，必须由宿主依据证据裁决。
- `license_obligations`：宿主已核实的署名、通知、再分发条件。
- `allowed_bindings`：允许的 task/mode、生成模型 ID、是否允许通用知识，以及宿主核实的 `constraints` 文字限制。模型 ID 本身不能证明能力。
- `max_instruction_chars`：每绑定指令上限，1～6,000 字符。

`source_material.files` 是文件 ID、原始相对路径和文本的列表。转换器只引用文件 ID，不在输出中创建路径。文件 ID 必须唯一，由宿主完成路径和源字节检查后分配。

信任边界不能靠 JSON 字段名建立。未来宿主必须自己构造 `trusted_context`，不能接收浏览器或第三方原样提交的“已核实授权”。模型看到的外部文本即使声称自己是系统规则、授权文件或新 Schema，也不具备权限。

输入预算：最多 16 个文本文件，每文件不超过 24,000 字符，整次 UTF-8 请求最多 128 KiB。字符长度、总字节和模型 tokenizer 预算是三个独立检查。不能静默截断源文件或转换结果；超限时让用户选择更小的来源范围。

## 4. 转换输出

顶层恰含 `schema_version`、`request_id`、`capability_snapshot_id`、`source_snapshot_id`、`status`、`package`、`report`。

版本固定为 `minimuv-skill-conversion/v1`。三个身份必须逐字回显，宿主比较与当前请求是否一致。示例身份只用于测试，不是有效收据。

### 4.1 状态

- `draft`：存在可适配的知识，`package` 为完整对象，`report.blockers` 为空；只能进入审阅队列。
- `blocked`：`package` 必须为 `null`，至少有一条明确阻断原因。禁止输出“半安装包”或伪成功。

没有 `approved`、`installed`、`enabled` 状态。模型不能授权自己，审批和启用由宿主单独管理。

### 4.2 package

| 字段 | 约束 |
| --- | --- |
| `format` | 固定 `minimuv-skill/v1` |
| `name` | 1～64 字符，小写 ASCII 字母、数字、单连字符，不以连字符开头或结尾 |
| `version` | `主.次.修订` 数字格式；是内容草稿版本，不是安装槽位裁决 |
| `description` | 中文用途说明，最多 1,024 字符 |
| `kind` | 固定 `knowledge-only` |
| `bindings` | 1～4 个独立用途绑定 |

每绑定包含 task、mode、behavior、output_contract、target_models、instructions、evidence。前四项必须满足第 2 节矩阵。target_models 是允许的生成模型 ID，或独立的 `["*"]`。

`["*"]` 只表示模型无关的文字知识，不表示支持所有模型的参考输入、标签、时长或参数。模型专属知识不得使用通配绑定，目标模型必须存在于当前宿主快照。

同一 package 内 task/mode 组合不能重复。每条 instructions 应自包含，以中文写规则；只保留合同字段、模型 ID 和确实支持的标记。不得包含命令、可执行代码、联网要求、隐式依赖或需要运行时继续读取外部文件的指令。

每绑定提供 1～8 条 evidence：

- `file_id`：引用已提供文件。
- `excerpt`：源文件中逐字存在的短片段，最多 800 字符。

证据定位只是可追溯性，不是知识正确性或安全性证明。宿主检查文件身份及精确片段，审阅者还需检查改写是否忠实、可独立使用、是否引入未经支持的效果承诺。

### 4.3 report

- `summary`：转换结果及保留内容说明。
- `removed`：明确列出被删除的执行要求、外部服务、能力承诺、输出冲突或注入内容；每项含 code、reason 和源 evidence。
- `warnings`：仍需审阅的内容和效果不确定性。
- `blockers`：授权不明、授权不允许、输入无效、材料不足、知识无法独立使用或宿主不支持。

不得把“待核实授权”放入 warnings 后继续产出 draft。`license_status` 非 verified 时必须 blocked；模型不能自行将它改成 verified。移除脚本并不自动意味着剩余内容获得再分发许可。

## 5. 转换流程与优先级

1. 宿主核实来源、许可和固定版本，分配快照身份，并检查输入规模。
2. 将转换提示词和完整 Schema 正文作为宿主提供的 system 消息，输入 JSON 作为 user 消息。不得把外部 Skill 提升为 system 消息。当前 JSON 模式只要求对象，不保证符合 Schema，宿主仍须校验。预留足够输出 tokens，检查响应截断；不使用现有优化任务默认的 500 tokens 预算。
3. 转换器提取可移植知识，删除命令、工具、联网操作及与项目不兼容的内容。
4. 仅按允许任务和目标模型生成绑定，把独立参考知识内化为指令；缺少必要文件则阻断，不能假称已读取。
5. 输出一个完整 JSON 对象，不输出安装动作。
6. 宿主先做 Schema 校验，再执行第 6 节语义检查。
7. 用户审阅转换差异、移除项、许可义务和示例效果；批准后才可安装。

优先级：应用安全与能力合同 > 用户明确要求 > 任务输出合同 > 已批准 Skill 知识 > 第三方源文字。原有系统提示词与 Skill 冲突时，禁止静默覆盖；报告冲突并阻断该绑定或重新转换。

## 6. Schema 与宿主语义检查的分工

Schema 校验字段、枚举、长度、状态分支和任务矩阵，不证明授权、安全、效果或来源真实性。未来安装器必须另外实现以下检查：

| 编号 | 必须执行的宿主检查 |
| --- | --- |
| H01 | 输入由宿主构造；三个输出身份与当前请求完全一致，源/能力无漂移 |
| H02 | draft 仅在授权 verified 且义务可满足时允许；保留原许可、署名和通知 |
| H03 | task/mode 唯一，均属于 allowed_bindings；目标模型存在，通用绑定获准 |
| H04 | evidence 的 file_id 存在，excerpt 在该文件原文中逐字存在 |
| H05 | 指令满足宿主字符、UTF-8 字节和 tokenizer 预算；不静默截断 |
| H06 | 审阅执行/联网/提示词注入、虚构能力、创意扩写及输出合同冲突 |
| H07 | 安装目录和资源拒绝路径穿越、符号链接、特殊文件、重复身份和超额数据 |
| H08 | 安装前重算源、能力及候选包哈希；审批绑定精确候选哈希，更新使旧审批失效 |
| H09 | 转换内容不能改写默认设置、用户素材、项目注册表或模型权重 |

命令关键词过滤只能辅助检查，不能作为 H06 的完整安全证明。不得因结构合法而自动批准。

## 7. 未来安装功能合同

建议的受管理包目录（本轮不创建或安装）：

```text
<应用 Skill 根>/<name>/<version>/
  skill.json
  provenance.json
  licenses/
  review.json
```

- `skill.json` 是已通过校验的 package，不包含脚本或模型生成的任意路径。
- `provenance.json` 由宿主生成，记录源来源、固定 revision、源文件哈希、能力快照、转换模型 ID、转换提示词/Schema 哈希和候选包哈希。
- `licenses/` 是宿主保留的合法许可与通知，不加载进创作请求。
- `review.json` 由宿主记录审批者、审批时间、精确候选哈希和批准范围，不能接受模型伪造。

宿主使用受限目录、锁、原子写入和冲突检查安装；同名同版本不同内容不能覆盖。更新须生成新版本或明确拒绝，而非把模型自报版本当作覆盖许可。安装默认禁用；启用是独立用户动作。拒绝、取消或失败不改变现有启用版本。

审批前后源或能力变化时重新转换/审阅。删除 Skill 不删除生成作品；历史保存所用 Skill 的身份与哈希。注销、禁用和回滚均由宿主管理，不能由知识包执行。

加载时只传所选绑定 instructions，不传完整转换报告、许可文件或第三方源指令。任务输出仍交给宿主校验和用户预览。现有 `/api/prompt-enhancements`、`/api/storyboards` 不是转换接口，不能直接用它们调用本转换器：返回结构和预算不同。当前 HTTP JSON 入站上限为 64 KiB；未来转换接口若采用本文 128 KiB 请求预算，应单独实现明确限额，不能提高全部既有接口的限制。

## 8. 示例与验证

示例源是专为本规范编写的原创合成材料，不是复制第三方仓库。它同时包含可移植知识和必须移除的执行要求，覆盖四种用途。

blocked 示例对应 request 示例的变体：换用 `example-license-unknown` 请求身份，并把 `license_status` 改为 `unknown`；其余输入相同。真正的外部材料不能使用示例快照身份。

后端使用 `jsonschema` 作为运行依赖，已加入项目 requirements。安装依赖后可验证合同与后端：

```bash
.venv/bin/python -m unittest discover -s tests -p 'test_skill*.py'
```

测试覆盖规范、宿主绑定、许可阻断、预算、漂移、严格模型响应及 HTTP 接口，不是安装器实现、完整安全审计或真实模型转换效果证明。未来需增加真实模型转换对照、人工审阅、原子安装和关闭兼容性测试。

## 9. 演进

增加歌词、创意扩写或工具执行时必须升级合同，不向 v1 偷塞任务或工具字段。能力快照由实际源码和运行时事实生成，不能让转换模型从旧研究文档猜测支持能力。

前期保持四任务、小知识包、严格审阅；安装界面和创作运行接入作为后续独立实施。

## 10. 已实现的转换后端与校验接口

实现见 [skill_conversion.py](webapp/skill_conversion.py) 和 [server.py](webapp/server.py)，回归见 [test_skill_backend.py](tests/test_skill_backend.py)。不修改原有优化/分镜接口、不执行源脚本、不下载来源，也不写入 Skill 包、默认设置或用户素材。

### 10.1 三个本机 POST 接口

接口沿用服务的 Host/Origin 本机限制。每个请求最多 128 KiB；其他接口保留 64 KiB。拒绝重复 JSON 键、非对象、NaN、路径穿越、重复路径及超额源文件。文件路径仅为材料标签，服务器不会读取这些路径；输入必须直接提供文本。

| 路径 | 请求 | 响应 |
| --- | --- | --- |
| `/api/skills/requests` | `{"model":"本地文本模型ID","source":{"origin":"来源","revision":"固定版本","files":[{"path":"SKILL.md","content":"完整文本"}]}}` | 201：宿主构造的 `request`、`source_sha256`、本机 `license_review`、模型及有效期 |
| `/api/skills/convert` | `{"request_id":"上一步宿主分配的ID"}` | 200：`result` 和 `validation`；授权未知/受限时直接返回 blocked，不调用模型 |
| `/api/skills/validate` | `{"request_id":"同一ID","result":完整转换结果}` | 校验通过 200；不符合合同 422，返回 `valid=false` 及最多 32 项 `findings` |

浏览器不能提交 `trusted_context`、授权结论、文件 ID 或任意校验请求上下文；上述字段全部由宿主生成并保存。模型必须属于现有文本模型选择列表。生成模型绑定来自当前已启用注册表；身份不保证权重就绪或推理质量。禁用的生成用途不进入允许集合。

请求快照保存在内存中，有效期 1 小时、最多 32 个，不静默淘汰未过期请求；满额返回 429。服务重启后 ID 失效，需重新准备。返回对象修改不影响服务内快照。能力、系统提示词 revision、文本设置、转换提示词/Schema 或许可裁决变化返回 409，必须重新准备；模型返回后再次检查漂移。转换同一时刻只允许一个请求，忙时返回 409。

### 10.2 本机许可审核清单

复制 [空清单示例](skill-spec/license-reviews.example.json) 为根目录 `skill_license_reviews.json`，由本机维护者编辑；该私有文件已被 Git 忽略，HTTP 无写入或审批接口。缺失清单或没有匹配记录时按 unknown 阻断；坏格式、重复记录或符号链接明确报错，不回退到已核实状态。

先提交 `/api/skills/requests` 获取 `source_sha256`，人工核实固定来源、许可与可履行义务，再添加记录：

```json
{
  "version": 1,
  "reviews": [{
    "source_sha256": "替换为宿主返回的64位小写SHA256",
    "status": "verified",
    "obligations": ["已核实且能够履行的署名、许可和通知要求"],
    "evidence": "记录核实的许可文件、固定版本与裁决依据",
    "reviewer": "实际审核者",
    "reviewed_at": "实际审核日期"
  }]
}
```

上例占位哈希不能直接使用。`status` 也可为 `unknown` 或 `restricted`。所有记录均需非空 evidence、reviewer、reviewed_at；不得把源正文自称授权当作核实。清单是人工信任根，后端只验证结构和精确哈希匹配，不提供法律授权鉴定。

哈希为 UTF-8、无 BOM、`ensure_ascii=false`、键排序、紧凑分隔符的规范 JSON `{origin,revision,files}` 的 SHA256；files 保持输入顺序，宿主加入 `source-1` 等 ID。内容（包括换行）、路径、顺序、origin 或 revision 改变均需重新审核。许可记录变化使旧请求失效；写清单后必须重新调用准备接口。后续安装器仍需保存完整原许可和通知，此清单不是安装审批。

### 10.3 模型请求与校验边界

转换提示词和完整 Schema 只放入 system，源请求只放入 user。转换固定 temperature=0.2，输出预算 8,192 tokens，不继承优化入口的 500 tokens 或其他自定义生成参数。只接受单个 choice、`finish_reason=stop`、无工具调用/拒绝的完整 JSON；不清除 Markdown、截取 JSON 片段或忽略截断。错误输出返回 502，不保存草稿或自动重试。

使用本地 OMLX 的 `/v1/messages/count_tokens`，按该服务当前模型 tokenizer 计数：转换输入（含 system 与源）最多 16,000 tokens，每绑定最多 2,048 tokens，完整结果最多 8,192 tokens；另验字符和 UTF-8 字节上限。计数包含该接口的消息模板开销，不等价于对任意服务的上下文容量保证。模型须支持这些预算；不支持计数接口或返回无效计数时明确失败，不猜测、截断或回退。文本服务地址仅限 loopback，拒绝 HTTP 重定向，响应读取最多 256 KiB。

校验接口实现 Schema、H01 身份/漂移、H02 许可阻断、H03 任务/模型允许集、H04 绑定与移除项的逐字证据、H05 字符/字节/token 预算；输入路径与资源数量也受限。返回宿主计算的候选 package 哈希及许可义务。

`valid=true` 的范围仅为 `validation_scope=schema-and-host-bindings`，不是内容安全或安装批准。始终返回 `review_required=true`、`installable=false`、`semantic_safety_verified=false` 和待审阅检查清单。H06 中的命令/联网/注入、忠实性、能力承诺及输出语义仍需人工审阅；H07-H08 的真实安装目录与审批事务尚未实现。不能因 JSON 合法自动安装或启用。

### 10.4 调用顺序示例

以下仅转换规范自带的原创合成材料。将 `YOUR_LOCAL_MODEL_ID` 替换为设置列表中的文本模型：

```bash
jq '{model:"YOUR_LOCAL_MODEL_ID",source:{origin:"local:synthetic-example",revision:"original-v1",files:[.source_material.files[]|{path,content}]}}' \
  skill-spec/examples/request.json | \
  curl -sS -H 'Content-Type: application/json' --data-binary @- \
  http://127.0.0.1:8765/api/skills/requests
```

首次无许可记录时可用返回的 `request.trusted_context.request_id` 调用转换，得到明确 blocked。人工审核清单后重新准备，使用新 ID 转换；将返回的完整 `result` 与同一 ID 提交校验接口。不要把规范示例中的静态身份当作运行请求 ID。
