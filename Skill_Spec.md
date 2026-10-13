# MiniMuv 创作预设与兼容 Skill 规范

版本：`minimuv-skill/v1`

日期：2026-10-05

状态：现有知识型 Skill 为兼容存储格式；本次更新按下述创作预设流程实施。

## 0. 创作预设流程（2026-10-08）

用户流程：**GitHub 链接 → 确认许可 → 提取多个子预设 → 保存草稿 → 编辑与预览 → 应用**。

- 一个仓库中的各 `SKILL.md` 目录独立提取，保留固定 commit、源文件、许可和署名义务；不执行源脚本。已完成的子预设不因其他子项失败而丢失。
- 转换后自动保存私密草稿。普通编辑器直接编辑每个适用任务的「方法指导」，同步更新兼容知识包；原始 JSON 和证据作为高级信息保留。编辑不改变来源、许可、任务身份或证据。
- 预览展示本次实际应用的方法文本、适用任务、来源与许可。保存草稿不开始生成，也不修改全局系统提示词。
- 「应用」先保存最新编辑，再进行结构、许可、任务和预算校验；通过后发布为可选创作预设，无需另做安装和启用两步。发布不自动选择，也不启动媒体生成。用户在对应创作任务中显式选择，保持既有最多四个、有序加载的行为。
- 已安装的 v1 Skill 无需重新导入；其启停、类别及精确修订选择继续兼容。重复应用同一草稿更新同一个预设，采用 CAS，不能覆盖其他窗口的修改。
- 方法指导作为文本模型的低优先级参考，不把第三方原文直接提升为 system。用户故事与要求、应用能力及 JSON/时长合同优先；忠实优化不因应用预设而自动变成创意扩写。
- 视频和图片生成接收最终画面描述，不接收预设的独立聊天式 system 消息。预设不能增加模型能力，也不保证人物场景一致性或创作质量。
- 用户修改的指导是用户编辑内容，不冒充逐字源摘录。原始 evidence 保持精确来源校验；自动校验只证明结构与宿主绑定，不证明语义安全。
- 新预设以兼容 v1 包发布，API 保留 `/api/skills/*` 和原存储目录。新增发布接口负责草稿发布和更新；旧安装接口保留，避免破坏现有数据及客户端。

实现验收：多子项草稿、指导编辑同步、预览、首次应用、重复应用、CAS 冲突、许可/预算拒绝、旧 Skill 读取与任务选择；界面支持现有十四种语言。媒体生成必须仍由用户独立触发。

## 1. 目标与边界

本规范供本地文本模型把第三方 Skill 转换为 MiniMuv 知识包。第 10 节说明许可确认、转换、自动校验安装与调用接口；确认许可后无需额外人工内容审批，自动校验不代表模型判断内容安全。

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
| `prompt-enhancement` | `mv` | `faithful` | `enhancement-json/v1` |
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
- 时长为所选视频模型支持范围内的任意整秒：H3/FastH3 为 5～15 秒，LTX-2.3 为 1～20 秒。Schema 允许 1～20 整秒，宿主再次按请求的 `target_model` 校验具体范围；文本模型 ID 不用于决定视频时长。
- 镜头数 1～48，且必须等于本次请求的 `shot_count`。
- 使用故事语言，按时间顺序保留人物、情节、场景和结尾。
- 配乐提示词描述器乐，不擅自添加歌曲歌词。
- 不承诺视觉连续性、参考媒体能力或准确对白生成。

48 是单次规划批次上限，不是项目总上限。长视频项目最多 1,800 秒、1,800 镜，按批规划与分段合成；MV 仍使用独立的 48 镜限制。预设不能提高宿主限制。指定镜头数、语言和忠实性还需运行时校验。

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

输入预算：最多 16 个文本文件，每文件不超过 96,000 字符且 384,000 UTF-8 字节，整次 UTF-8 请求最多 512 KiB。字符长度、总字节和模型 tokenizer 预算是独立检查。不能静默截断源文件或转换结果；超限时选择更小来源范围或适当的输入预算与模型。

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
7. 自动保存合格草稿；用户选择安装时由宿主读取精确修订并重新校验。用户仍可查看转换差异、移除项、许可义务和示例效果，但不要求额外人工内容审批。

优先级：应用安全与能力合同 > 用户明确要求 > 任务输出合同 > 已批准 Skill 知识 > 第三方源文字。原有系统提示词与 Skill 冲突时，禁止静默覆盖；报告冲突并阻断该绑定或重新转换。

## 6. Schema 与宿主语义检查的分工

Schema 校验字段、枚举、长度、状态分支和任务矩阵，不证明授权、安全、效果或来源真实性。宿主安装/加载还必须执行以下检查：

| 编号 | 必须执行的宿主检查 |
| --- | --- |
| H01 | 输入由宿主构造；三个输出身份与当前请求完全一致，源/能力无漂移 |
| H02 | draft 仅在授权 verified 且义务可满足时允许；保留原许可、署名和通知 |
| H03 | task/mode 唯一，均属于 allowed_bindings；目标模型存在，通用绑定获准 |
| H04 | evidence 的 file_id 存在，excerpt 在该文件原文中逐字存在 |
| H05 | 指令满足宿主字符、UTF-8 字节和 tokenizer 预算；不静默截断 |
| H06 | 转换器删除执行/联网/提示词注入、虚构能力、创意扩写及输出合同冲突；宿主检查不构成完整内容安全证明 |
| H07 | 安装目录和资源拒绝路径穿越、符号链接、特殊文件、重复身份和超额数据 |
| H08 | 安装前重算源、能力及候选包哈希；审批绑定精确候选哈希，更新使旧审批失效 |
| H09 | 转换内容不能改写默认设置、用户素材、项目注册表或模型权重 |

命令关键词过滤只能辅助检查，不能作为 H06 的完整安全证明。自动安装校验不是内容安全认证，且不能自动启用或开始媒体生成。

## 7. 安装功能合同

原建议的受管理包目录：

```text
<应用 Skill 根>/<name>/<version>/
  skill.json
  provenance.json
  licenses/
  review.json
```

当前实现使用 `<应用 Skill 根>/<宿主UUID>.json` 单文件封装上述知识包、provenance、原文/许可通知和审批记录，以一次原子替换保证整体提交，不创建第三方任意路径。具体接口与限制见第 10.7 节。

- `skill.json` 是已通过校验的 package，不包含脚本或模型生成的任意路径。
- `provenance.json` 由宿主生成，记录源来源、固定 revision、源文件哈希、能力快照、转换模型 ID、转换提示词/Schema 哈希和候选包哈希。
- `licenses/` 是宿主保留的合法许可与通知，不加载进创作请求。
- `review.json` 对应封装中的宿主校验记录：自动模式记录 `method=automatic-validation` 与精确哈希，不伪造人工检查；既有人工审批记录保持兼容，不能接受模型伪造。

宿主使用受限目录、锁、原子写入和冲突检查安装；同名同版本不同内容不能覆盖。更新须生成新版本或明确拒绝，而非把模型自报版本当作覆盖许可。安装默认禁用；启用是独立用户动作。拒绝、取消或失败不改变现有启用版本。

审批前后源或能力变化时重新转换/审阅。删除 Skill 不删除生成作品；历史保存所用 Skill 的身份与哈希。注销、禁用和回滚均由宿主管理，不能由知识包执行。

加载时只传所选绑定 instructions，不传完整转换报告、许可文件或第三方源指令。任务输出仍交给宿主校验和用户预览。`/api/prompt-enhancements`、`/api/storyboards` 不是转换接口，返回结构和预算不同。普通 HTTP JSON 入站上限仍为 64 KiB；Skill 接口单独采用 512 KiB，不能提高全部既有接口的限制。

## 8. 示例与验证

示例源是专为本规范编写的原创合成材料，不是复制第三方仓库。它同时包含可移植知识和必须移除的执行要求，覆盖四种用途。

blocked 示例对应 request 示例的变体：换用 `example-license-unknown` 请求身份，并把 `license_status` 改为 `unknown`；其余输入相同。真正的外部材料不能使用示例快照身份。

后端使用 `jsonschema` 作为运行依赖，已加入项目 requirements。安装依赖后可验证合同与后端：

```bash
.venv/bin/python -m unittest discover -s tests -p 'test_skill*.py'
```

测试覆盖规范、宿主绑定、许可阻断、预算、漂移、严格模型响应、草稿持久化、自动及旧审批安装与 HTTP 接口，不是完整安全审计或真实模型转换效果证明。真实模型转换质量仍需独立验收。

## 9. 演进

增加歌词、创意扩写或工具执行时必须升级合同，不向 v1 偷塞任务或工具字段。能力快照由实际源码和运行时事实生成，不能让转换模型从旧研究文档猜测支持能力。

当前只读知识包支持视频、MV、图像、音乐提示词优化与长视频/MV分镜；安装和显式创作接入已实现，不扩展为工具执行。

## 10. 已实现的转换后端与校验接口

实现见 [skill_conversion.py](webapp/skill_conversion.py) 和 [server.py](webapp/server.py)，回归见 [test_skill_backend.py](tests/test_skill_backend.py)。不修改原有优化/分镜接口、不执行源脚本、不下载来源，也不写入 Skill 包、默认设置或用户素材。

### 10.1 本机 POST 接口

接口沿用服务的 Host/Origin 本机限制。每个 Skill 请求最多 512 KiB；其他接口保留 64 KiB。拒绝重复 JSON 键、非对象、NaN、路径穿越、重复路径及超额源文件。文件路径仅为材料标签，服务器不会读取这些路径；输入必须直接提供文本。

| 路径 | 请求 | 响应 |
| --- | --- | --- |
| `/api/skills/requests` | `{"model":"本地文本模型ID","source":{"origin":"来源","revision":"固定版本","files":[{"path":"SKILL.md","content":"完整文本"}]}}` | 201：宿主构造的 `request`、`source_sha256`、本机 `license_review`、模型及有效期 |
| `/api/skills/convert` | `{"request_id":"上一步宿主分配的ID"}` | 200：`result` 和 `validation`；授权未知/受限时直接返回 blocked，不调用模型；完整候选不合格时 422，保留候选与具体 findings |
| `/api/skills/validate` | `{"request_id":"同一ID","result":完整转换结果}` | 校验通过 200；不符合合同 422，返回 `valid=false` 及最多 32 项 `findings` |
| `/api/skills/license-review` | `{"source":完整源快照,"license_name":"MIT","license_path":"LICENSE"}` | 200：用户确认后写入精确源摘要绑定的本机许可记录；若候选未在来源检测到则 422 |
| `/api/skills/licenses` | `{"source":完整源快照}` | 200：返回许可候选，仅识别，不确认授权 |

浏览器不能提交 `trusted_context`、授权结论、文件 ID 或任意校验请求上下文；上述字段全部由宿主生成并保存。许可确认接口也不接受哈希、义务或审核证据字段，只从精确来源原文重新识别候选并记录用户确认。模型必须属于现有文本模型选择列表。生成模型绑定来自当前已启用注册表；身份不保证权重就绪或推理质量。禁用的生成用途不进入允许集合。

请求快照保存在内存中，有效期 1 小时、最多 32 个，不静默淘汰未过期请求；满额返回 429。未保存的请求在重启后失效；已保存草稿可通过第 10.5 节的打开接口恢复宿主快照。返回对象修改不影响服务内快照。能力、系统提示词 revision、文本设置、转换提示词/Schema 或许可裁决变化返回 409，必须重新准备；模型返回后再次检查漂移。转换同一时刻只允许一个请求，忙时返回 409。

### 10.2 本机许可审核清单

复制 [空清单示例](skill-spec/license-reviews.example.json) 可供维护者离线编辑；实际清单位于根目录 `skill_license_reviews.json`，已被 Git 忽略。缺失清单或没有精确来源摘要匹配记录时按 unknown 阻断；坏格式、重复记录或符号链接明确报错，不回退到已核实状态。

GitHub 查找先固定 commit，并立即取得关联许可证正文，在独立区域展示候选；用户查看原文并显式确认后，才解锁文档选择和读取。后端读取前重验该来源、版本与许可原文的精确确认记录，再检查许可证目录适用范围；读取完成后将确认记录绑定到完整来源快照。较近的目录许可证不能被根许可证替代。宿主只从许可原文识别明确的 SPDX 或少数常见名称；未识别时保持 unknown。文本识别不是法律核实，也不推断可履行义务。确认接口不接受客户端提供的哈希、状态、义务或证据。确认不代表安装批准或自动启用。

许可确认请求格式为：

```json
{
  "source": {"origin": "固定来源", "revision": "固定版本", "files": [{"path": "SKILL.md", "content": "..."}, {"path": "LICENSE", "content": "..."}]},
  "license_name": "MIT",
  "license_path": "LICENSE"
}
```

后端从规范化后的完整 `{origin,revision,files}` 计算 SHA256，记录 `status=verified`、`license_name`、空 `obligations`、固定来源中的许可路径、确认方式和时间。它不会声称自动检查或解释法律义务；用户确认前，`unknown` 仍阻断。

旧版或离线维护者也可按以下格式编辑记录：

```json
{
  "version": 1,
  "reviews": [{
    "source_sha256": "替换为宿主返回的64位小写SHA256",
    "status": "verified",
    "license_name": "MIT",
    "obligations": ["已核实且能够履行的署名、许可和通知要求"],
    "evidence": "记录核实的许可文件、固定版本与裁决依据",
    "reviewer": "实际审核者",
    "reviewed_at": "实际审核日期"
  }]
}
```

上例占位哈希不能直接使用。`license_name` 对既有记录可省略；`status` 也可为 `unknown` 或 `restricted`。所有记录均需非空 evidence、reviewer、reviewed_at；不得把自动识别的许可证名称伪装成用户确认。清单是本机确认信任根，后端校验结构和精确哈希匹配，不提供法律授权鉴定。

哈希为 UTF-8、无 BOM、`ensure_ascii=false`、键排序、紧凑分隔符的规范 JSON `{origin,revision,files}` 的 SHA256；files 保持输入顺序，宿主加入 `source-1` 等 ID。内容（包括换行）、路径、顺序、origin 或 revision 改变均需重新审核。许可记录变化使旧请求失效；确认后界面会重新调用准备接口。后续安装器仍需保存完整原许可和通知，此清单不是安装审批。

### 10.3 模型请求与校验边界

转换提示词和完整 Schema 只放入 system，源请求只放入 user。转换固定 temperature=0.2，输出预算 8,192 tokens，并使用 OMLX 的 `response_format=json_schema`、完整转换 Schema 与 `strict=true`；不继承优化入口的 500 tokens 或其他自定义生成参数。只接受单个 choice、`finish_reason=stop`、无工具调用/拒绝的完整 JSON；不清除 Markdown、截取片段或静默剥除非法字段。完整 JSON 候选未通过宿主校验时返回 422，界面保留候选和具体错误，允许编辑及保存私有草稿，但禁止安装。真正上游请求、截断或解析失败仍返回 502，不伪装成功或自动重试。

使用本地 OMLX 的 `/v1/messages/count_tokens` 真实计数。文本设置 `skill_input_token_budget` 默认 64,000，可配置 16,000–128,000；转换输入包含 system、完整 Schema、源与消息模板。每绑定仍最多 2,048 tokens，完整结果最多 8,192 tokens。超过输入预算返回 413，并显示实际计数与限额；模型列表提供 `max_model_len` 时，还须容纳实际输入加 8,192 输出预留，否则在生成前明确拒绝。不提供容量的服务仍可能自行拒绝上下文，配置预算不是容量保证。不支持计数/结构化输出或返回无效计数时明确失败，不猜测、截断或回退。创作辅助入口保持原 16,000-token 与 128-KiB 输入边界。文本服务仅限 loopback，拒绝重定向，响应最多 256 KiB。

校验接口实现 Schema、H01 身份/漂移、H02 许可阻断、H03 任务/模型允许集、H04 绑定与移除项的逐字证据、H05 字符/字节/token 预算；输入路径与资源数量也受限。返回宿主计算的候选 package 哈希及许可义务。

`valid=true` 的范围仅为 `validation_scope=schema-and-host-bindings`，不是内容安全证明。返回 `review_required=false`、`review_checks=[]`、`semantic_safety_verified=false`；无 Finding 的 draft 返回 `installable=true`。H07-H08 的真实安装目录与精确哈希事务由独立安装接口执行。自动安装复核不保证忠实性、能力承诺或输出语义安全，安装仍需用户动作且不自动启用。

### 10.4 调用顺序示例

以下仅转换规范自带的原创合成材料。将 `YOUR_LOCAL_MODEL_ID` 替换为设置列表中的文本模型：

```bash
jq '{model:"YOUR_LOCAL_MODEL_ID",source:{origin:"local:synthetic-example",revision:"original-v1",files:[.source_material.files[]|{path,content}]}}' \
  skill-spec/examples/request.json | \
  curl -sS -H 'Content-Type: application/json' --data-binary @- \
  http://127.0.0.1:8765/api/skills/requests
```

首次无许可记录时可用返回的 `request.trusted_context.request_id` 调用转换，得到明确 blocked。人工审核清单后重新准备，使用新 ID 转换；将返回的完整 `result` 与同一 ID 提交校验接口。不要把规范示例中的静态身份当作运行请求 ID。

### 10.5 转换审阅与本机草稿持久化

顶部 **Skill 转换** 提供十四语言独立工作区，操作提示固定在转换窗口顶部。许可证在独立区域展示，不混入正文编辑框；准备、草稿和安装仍保留完整许可原文。可直接选择 Markdown/UTF-8 文件，自动填写本地来源、内容哈希版本和 Skill 名称：优先 frontmatter `name`，其次一级标题，最后目录或文件名；保留手动名称。仍支持正文文件数组 JSON 编辑。导入会使旧校验失效，最多 16 文件、每个 96,000 字符且 384,000 UTF-8 字节；完整 HTTP 请求最多 512 KiB。客户端只读用户明确选择的本地文件，源路径不用于读取服务器文件。GitHub 获取见下节，不执行内容。

界面展示源哈希、许可状态与义务、逐字原文、用途绑定与指令、证据摘录、移除项、警告及阻断项。候选采用完整 JSON 编辑器；更改候选立即使旧校验失效，修改原文、固定版本或模型需重新准备/转换。许可确认后不再要求额外人工内容审阅；自动检查不保证内容安全、忠实性或模型效果。安装与独立启用见第 10.7 节。

界面转换成功且候选通过自动校验后，后端自动保存草稿并返回其 revision；更新已有草稿仍须 CAS。阻断或不合格候选不自动保存成可安装草稿。仍可手动保存源文件已准备但尚未转换的草稿，以及 JSON 尚未写完的编辑。格式不正确仍可保存文字，不得把保存成功伪装成校验通过。未保存修改有离开确认，请求处理中禁止切换和编辑。

| 接口 | 请求与行为 |
| --- | --- |
| `GET /api/skills/drafts` | 返回私有草稿元数据列表，含 `id`、`name`、`revision`、模型、源哈希、时间 |
| `POST /api/skills/drafts` | `{id, revision, name, request_id, result_text}`；新建时前两项为 `null`，更新使用当前宿主 revision；只从服务内请求取得可信原文，不接收客户端宿主快照/审批 |
| `POST /api/skills/drafts/{id}/open` | `{}`；返回 `draft` 和 `snapshot_current`，从私有文件恢复内存请求，有效期重新计时；保留候选的原绑定，不偷偷替换身份 |
| `POST /api/skills/drafts/{id}/delete` | `{revision}`；与修改同样进行精确 revision 比较，过期返回 409，不删错版本 |
| `POST /api/skills/validate` | 除原 `result` 对象格式，也接受 `{request_id, result_text}`，由宿主严格解析原始 JSON，拒绝重复键 |

私有目录为 `~/Library/Application Support/MiniMuv/skill-drafts`，不随媒体输出迁移，不进入仓库。目录权限 `0700`、文件 `0600`，UUID 文件名与路径校验、符号链接/特殊文件拒绝、线程及进程锁、临时文件写入/fsync/原子替换；无静默覆盖、丢弃或损坏记录回退。上限 100 草稿、每文件 2 MiB、总计 64 MiB，HTTP 请求为 512 KiB；扩大单文件存储以容纳重复的完整源与合同快照，坏记录或存储错误明确失败。私有文件不是加密存储，包含原文、模型/文本设置与转换合同快照。

草稿不持久保存“有效/批准”裁决，重新打开统一 `validation_state=pending`、`installable=false`；无需手动重新校验，安装接口读取持久草稿并自动校验。宿主比较当前能力、许可清单、文本设置、转换提示词/Schema：漂移时返回 `snapshot_current=false`，旧候选可查看/保存，但不能继续转换或安装；必须重新准备并转换。保存依赖尚有效的内存请求；请求过期时先重新打开已保存草稿，未保存请求需重新准备。保存接口不会调用模型或自动改写候选，也不修改本机许可清单。

实现及回归见 [skill_drafts.py](webapp/skill_drafts.py)、[skill-review.js](webapp/static/skill-review.js)、[持久化测试](tests/test_skill_drafts.py) 和 [审阅界面测试](tests/test_skill_review_ui.mjs)。

### 10.6 GitHub 文件、Skill 目录与仓库获取

粘贴公开 GitHub 仓库、目录或文件地址，点击 **查找源文件**，宿主解析为精确 commit，并取得关联许可证正文。先查看、选择并确认许可，随后勾选文档并 **读取选中文件**；读取后自动准备转换请求和名称。接着可以转换并自动保存草稿，再选择已支持的 Skill 类别直接安装。保存不会清除同一候选当前有效的校验；重新打开后安装自动重验。多个 Skill 显示完整路径，不执行引用。含 `/` 的分支名请改用 commit 地址。

单个 GitHub 链接支持多子 Skill：勾选各目录的 `SKILL.md` 及所需参考正文，点击 **转换所选子 Skill**。按最近 `SKILL.md` 目录归属分组，嵌套与同级 Skill 独立；没有勾选所属 `SKILL.md` 的参考文件拒绝合并，每组最多15份正文。逐组读取、准备、调用同一所选文本模型并保存独立草稿，不同时加载多个模型。任一项失败保留已成功项并展示具体原因；507停止后续转换，释放内存后可重试。同页重试跳过成功保存的子项；刷新页面后通过持久草稿列表恢复，重试缓存不跨页面保存。近目录不同许可须单独确认，不用根许可越权。

草稿列表支持勾选多项并 **安装所选草稿**，顺序使用精确 revision 和各包全部支持类别，默认禁用。成功项取消勾选，失败项保留供重试；整批并非原子事务，也不覆盖同名同版本。原有100草稿/安装包、32个一小时内存请求及各项字节/token预算保持不变，超额明确失败。

| 接口 | 行为 |
| --- | --- |
| `POST /api/skills/github/discover` | `{url}`；返回 `origin`、固定 `revision`、文件选项、默认路径及 `license_sources` 许可正文与候选；不读取 Skill 正文 |
| `POST /api/skills/github/fetch` | `{origin, revision, paths, license_name, license_path}`；commit 为40位小写SHA，选择1–15个非许可文档，重验许可确认、范围及 blob，附加所选许可证并绑定完整源 |

仅访问构造的 `https://api.github.com` HTTPS 端点，不接受任意下载 URL、私有仓库凭据或代理，禁止重定向；连接超时20秒，文件树响应最多2MiB，最多200文档选项，超限必须缩小到Skill目录。文件要求普通非链接文本、受现有ASCII路径限制，最多384,000 UTF-8字节且96,000字符，最终原文和请求受512KiB限制；检查 blob SHA、实际字节数与严格UTF-8。网络、权限/限流、树截断、非文字、大小或损坏响应均明确失败，不覆盖当前原文，不伪装成功。

查找本身不修改许可清单，不将仓库公开、LICENSE存在或勾选视作 `verified`。用户确认后写入精确许可源记录；读取文档时重验该记录，并写入完整源绑定。无确认、许可漂移或目录范围不适用均明确拒绝读取。准备阶段只接受与完整精确源哈希匹配的记录；内容、所选文件或顺序变化均需重新确认。该确认仅解锁转换草稿，不安装、不启用、不注入创作。普通 `source.origin` 字段仍仅为标签，不因填写URL隐式联网。

实现见 [skill_sources.py](webapp/skill_sources.py)；网络行为使用合成/模拟GitHub响应回归，不以自动化测试下载并运行第三方Skill。

### 10.7 草稿安装、启用与显式组合调用

确认许可后，点击转换由本地文本模型生成并自动保存草稿；选择类别后直接 **安装草稿**，无需审核者姓名或五项人工勾选。宿主读取精确 revision 的持久草稿并重新校验 Schema、身份、证据、许可和 tokenizer 预算。记录 `method=automatic-validation`，不伪造人工审阅；既有人工审批记录和旧接口保持兼容。安装默认禁用，必须在已安装列表独立 **启用**，禁用后才可删除。HTTP 507 表示文本模型加载内存不足，应等待媒体生成结束、释放内存或选择较小模型，不绕过内存保护。

| 接口 | 请求与行为 |
| --- | --- |
| `GET /api/skills/installed` | 返回身份、revision、绑定范围、包哈希、审批者/时间、enabled、available；漂移显示不可用 |
| `POST /api/skills/install` | `{draft_id,revision,categories}`；宿主读取并自动校验持久草稿；旧人工审批请求形状保持兼容 |
| `POST /api/skills/installed/{id}/enabled` | `{revision,enabled}`；启用重验 token 预算和当前合同，独立 CAS；漂移仍允许禁用 |
| `POST /api/skills/installed/{id}/categories` | `{revision,categories}`；非空去重类别多选，独立 CAS，不改批准知识或启用状态 |
| `POST /api/skills/installed/{id}/delete` | `{revision}`；启用状态拒绝删除，不影响作品/历史 |
| 原创作文本接口 | 可选 `skills:[{id,revision}]` 和 `target_model`；后者为当前生成模型，而原 `model` 仍是本地文本模型 |

受限目录 `~/Library/Application Support/MiniMuv/skills` 采用单一 UUID JSON 原子封装，保存完整候选、源原文、许可审核记录、能力/文本配置及转换合同。宿主审批绑定完整 record、result 与 package 的哈希、审核者和时间；全部读取复核哈希、结构与原文身份。导入时须包含履行义务所需的许可与通知正文，它们只保存，不注入创作。目录 `0700`、文件 `0600`，线程/进程锁、CAS、fsync、拒绝链接和特殊文件；100 份、每份 2 MiB、总 64 MiB，Skill HTTP 为 512 KiB。单文件布局防止部分安装；不是加密或对同一用户恶意修改的密码学认证。

同名同版本一律拒绝覆盖，即使内容一致；更新须新版本并重新转换校验，不自动关闭或替换旧版。安装失败或取消不改已有启用状态。源、许可、能力、文本设置或转换合同变化时阻断启用/加载，须重新转换校验；不存在忽略漂移或成功形回退。

安装时可多选视频、MV生成、图像、音乐、长视频类别（`video,mv,image,music,long-video`），至少一个且不得超出已批准 binding 的模式范围。MV提示词仍是视频模型的文字优化任务，但通过独立的 `mv` binding 和类别选择；既有 `video` binding 不会自动扩展为 MV 能力。已安装列表可修改并保存类别；这是宿主管理元数据，不修改审批知识哈希，也不增加模型能力。旧封装与未传 categories 的旧接口默认采用已有 binding 支持的类别，无须重新安装。类别变更产生新 revision，旧选择显式失效。

四用途均显式选择最多 4 个已启用且类别、任务/模式/生成模型匹配的 Skill，默认不选，界面筛选与服务端执行均验证类别。按勾选顺序组合；只传绑定 `instructions`，不传 source、report、license、evidence。应用安全能力、用户要求、输出合同优先于知识，冲突知识不覆盖这些要求。组合指令上限 24,000 UTF-8 字节及 2,048 tokenizer tokens；完整请求上限 128 KiB、16,000 input tokens，超限或 tokenizer 不可用明确阻断，不截断或忽略 Skill。

输出继续按既有合同校验，保留视频总长/单镜头时长要求。提示词须用户应用，分镜生成后可编辑，不自动启动媒体生成。没选 Skill 不增加 tokenizer 调用，保持旧行为。已应用提示词与自动分镜保存 Skill 身份、版本和包哈希作为历史归因；编辑对应文字后取消本次新归因，恢复/删除历史不重新启用或注入 Skill。归因字段不是安全授权。

实现见 [安装存储](webapp/skill_installations.py)、[选择与管理界面](webapp/static/skill-installed.js)、[后端回归](tests/test_skill_installations.py) 和 [界面回归](tests/test_skill_installed_ui.mjs)。
