<div align="center">
<img width="693" height="415" alt="BrowserOS neo：为你的 AI Agent 补上的浏览器" src="https://github.com/user-attachments/assets/8129f9c8-e8f4-4afe-834a-91397121d833" />

<br></br>
<a href="https://discord.gg/YKwjt5vuKr"><img src="https://img.shields.io/badge/Discord-555?logo=discord" alt="Discord" /></a>
<a href="https://dub.sh/browserOS-slack"><img src="https://img.shields.io/badge/Slack-555?logo=slack" alt="Slack" /></a>
<a href="https://x.com/browserOS_ai"><img src="https://img.shields.io/badge/@browserOS__ai-555?logo=x" alt="X / Twitter" /></a>
<a href="https://github.com/browseros-ai/BrowserOS"><img src="https://img.shields.io/github/stars/browseros-ai/BrowserOS?style=flat&logo=github&label=stars&color=4c71f2" alt="GitHub stars" /></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-555" alt="AGPL-3.0" /></a>
<br></br>

<a href="https://www.producthunt.com/products/browseros_ai?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-browseros-neo" target="_blank" rel="noopener noreferrer"><picture><source media="(prefers-color-scheme: dark)" srcset="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1031913&amp;theme=dark&amp;t=1786088428884" /><img alt="BrowserOS neo - 面向 Claude、Cowork 与 Codex 的浏览器 | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1031913&amp;theme=light&amp;t=1786088428884" /></picture></a>
<a href="https://trendshift.io/repositories/16468?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-16468" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/16468/daily?language=TypeScript" alt="browseros-ai%2FBrowserOS | Trendshift" width="250" height="55"/></a>
<br></br>

<a href="https://cdn.browseros.com/download/BrowserOS_neo.dmg"><img src="https://img.shields.io/badge/Download-macOS-black?style=for-the-badge&logo=apple&logoColor=white" alt="下载 macOS 版本" /></a>
<a href="https://cdn.browseros.com/download/BrowserOS_neo_installer.exe"><img src="https://img.shields.io/badge/Download-Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="下载 Windows 版本" /></a>

**[官网](https://www.browseros.com)** · **[文档](https://docs.browseros.com)** · **[企业版](mailto:founders@browseros.com?subject=Enterprise%3A%20BrowserOS%20neo&body=Hi%2C%0A%0AWe%27re%20looking%20at%20BrowserOS%20neo%20for%20our%20team.%0A%0ACompany%3A%0ATeam%20size%3A%0AWhat%20we%20want%20to%20automate%3A)**

免费 · 开源 · 一切都运行在你的本地机器上

</div>

这是一个专门给 AI Agent 使用的“第二浏览器”。只需一次点击即可从 Chrome 导入登录状态，然后连接 Claude Code、Codex 或任意 MCP Agent，把你的网页任务交给它们处理。多个 Agent 可以在各自的标签页中并行运行。你既可以实时观看执行过程，也可以像观看视频一样回放任何一次会话。

BrowserOS neo 并不是 Chrome 的替代品。它是一个与 Chrome 并列使用的辅助浏览器，并且专门针对 Agent 进行了友好设计。

## 快速开始

### 1. 安装 BrowserOS neo

```sh
brew tap browseros-ai/tap
brew install --cask browseros-neo
```

更喜欢直接下载安装包？可以下载 [macOS](https://cdn.browseros.com/download/BrowserOS_neo.dmg) 或 [Windows](https://cdn.browseros.com/download/BrowserOS_neo_installer.exe) 版本。

### 2. 从 Chrome 导入数据

只需一次点击，即可导入你的登录状态、书签和扩展。这样从第一个任务开始，Agent 就可以直接使用你的真实账号工作。

### 3. 连接你的 Agent

BrowserOS neo 会自动发现你本机上的 Claude Code、Codex、Cursor、VS Code、OpenClaw 和 Hermes。任意一个都可以一键连接。

### 4. 给它一个任务

从你的 Agent 中下达任务，而不是从浏览器中操作：

> 帮我预订去伦敦最便宜的航班。

你可以在新标签页中实时观看任务执行，也可以之后再回放。

## 你的 Agent 能做什么？

任何需要登录浏览器才能完成的工作，例如：

- 向社交媒体（LinkedIn、Twitter/X）发布内容、安排待发布内容、获取互动数据
- 清理收件箱、退订垃圾邮件
- 更新 CRM、提交报销、从内部工具中拉取报表

## 核心功能

<table>
<tr>
<td width="40%" valign="middle">
<h4>实时仪表盘</h4>
你的新标签页会显示当前正在工作的每个 Agent：它正在哪个网站上、正在做什么，以及任务进度如何。<a href="https://docs.browseros.com/neo/cockpit">文档</a>
</td>
<td width="60%">
<img src="docs/images/browserclaw--dashboard-populated.png" alt="BrowserOS neo 仪表盘，展示 Agent 会话和最近活动" width="100%" />
</td>
</tr>
<tr>
<td width="40%" valign="middle">
<h4>一键连接</h4>
自动连接到各种 Agent Harness。我们构建了一套针对网页操作优化的工具！<a href="https://docs.browseros.com/neo/mcp">文档</a>
</td>
<td width="60%">
<img src="docs/images/browserclaw--mcp-install-board.png" alt="BrowserOS neo MCP 连接面板，可一键安装并连接支持的 AI 工具" width="100%" />
</td>
</tr>
<tr>
<td width="40%" valign="middle">
<h4>回放每一次会话</h4>
每次会话都会以可拖动进度条的视频形式保存在你的磁盘上，并附带逐步操作时间线。你可以回退并准确查看当时发生了什么。<a href="https://docs.browseros.com/neo/audit-and-replay">文档</a>
</td>
<td width="60%">
<img src="docs/images/browserclaw--replay-scrubber.png" alt="BrowserOS neo 会话回放界面，包含视频进度条和操作时间线" width="100%" />
</td>
</tr>
</table>

- **使用你的真实登录状态。** Agent 使用你已经登录的账号自动处理真实工作，而不是在一个空白沙箱中运行。[工作原理](https://docs.browseros.com/neo/how-it-works)
- **多个 Agent 并行运行。** 可以同时启动多个任务。每个 Agent 都在自己的标签页中工作，而你仍然可以继续正常浏览网页。
- **更少的 Token 消耗。** 对于相同任务，相比 Claude 的 Chrome 扩展或 Codex Browser 等替代方案，BrowserOS neo 使用的 Token 更少。
- **仅本地运行，隐私优先。** 会话、截图和历史记录都保存在 `~/.browserclaw/` 目录下，不会离开你的机器。[隐私说明](https://docs.browseros.com/neo/privacy)

## 为什么选择 BrowserOS neo，而不是其他方案？

- **它不是无头浏览器驱动器。** Playwright 和 agent-browser 会启动一个全新的 Chrome 子进程，其中没有任何登录状态。这很适合 CI，但对于“读取我的收件箱”这类依赖已登录状态的真实工作并不实用。BrowserOS neo 可以一键导入你的登录状态，并在不同会话之间持续保留这些状态。
- **它不是云浏览器。** 云浏览器（例如 browser-use、browserbase）运行在数据中心中，因此登录你的账号会很麻烦；同时 Twitter、LinkedIn 等网站还可能因为你使用的是数据中心 IP 而进行限制。BrowserOS neo 运行在你的本地机器上，地址为 `127.0.0.1`。
- **它不是绑定特定 AI 的浏览器。** Atlas、Comet 和 Dia 只能与它们自己的 AI 配合使用。BrowserOS neo 则可以与你已经在使用和付费的 Agent 一起工作，例如 Claude Code、Cowork、Codex、Cursor 等。

## 本仓库中还包含：BrowserOS

<table>
<tr>
<td width="110" align="center" valign="middle">
<img src="packages/browseros/resources/browseros/icons/product_logo_192.png" alt="" width="72" />
</td>
<td valign="middle">
<h3>BrowserOS：为人而生的 AI 浏览器</h3>
它是一个 Chromium 分支，并在每个新标签页中内置 AI Agent，适用于由<b>你本人</b>进行浏览的场景。你可以使用自己的 AI Key，也可以通过 Ollama 完全在本地运行。
<br><br>
<b><a href="README.BrowserOS.md">了解 BrowserOS</a></b> &nbsp;·&nbsp; <a href="https://www.browseros.com/browseros/">官网</a> &nbsp;·&nbsp; <a href="https://docs.browseros.com/browseros">文档</a>
</td>
</tr>
</table>

## 常见问题

**BrowserOS neo 和 BrowserOS 有什么区别？**
BrowserOS neo 是一个由你的 AI 驱动的浏览器；BrowserOS 则是由你自己操作、同时内置 AI Agent 的浏览器。两者都从同一个仓库发布，并且可以同时运行。你可以继续保留日常使用的浏览器，让 Agent 在 neo 中工作。

**哪些 AI 工具可以与 BrowserOS neo 配合使用？**
任何支持 MCP 的 AI 都可以。Claude Code、Codex、Cursor、VS Code、Zed、OpenCode、Hermes、OpenClaw 和 Antigravity 都可以一键连接。

**会有任何数据离开我的机器吗？**
你的会话、截图、历史记录和设置都保存在 `~/.browserclaw/` 下，并且不会上传。BrowserOS neo 会发送匿名的产品使用事件（例如 Agent 连接/断开、版本、操作系统），以帮助改进应用；它不会发送 URL、页面内容、Prompt、工具结果或截图。你可以在“设置”中通过一个开关关闭该功能。[完整隐私政策](https://docs.browseros.com/neo/privacy)。

**我的 Chrome 扩展和书签还能用吗？**
可以。两个浏览器都是 Chromium 分支，因此 Chrome 扩展可以继续使用，同时你的书签、密码和设置也可以一键导入。

**支持哪些平台？**
BrowserOS neo 支持 macOS 和 Windows。BrowserOS 支持 macOS、Windows 和 Linux。系统要求与 Google Chrome 相同。

## 获取帮助

- [Discord](https://discord.gg/YKwjt5vuKr) · [Slack](https://dub.sh/browserOS-slack)
- [报告 Bug](https://github.com/browseros-ai/BrowserOS/issues)
- [BrowserOS neo 文档](https://docs.browseros.com) · [BrowserOS 文档](https://docs.browseros.com/browseros)
- 企业部署：[founders@browseros.com](mailto:founders@browseros.com?subject=Enterprise%3A%20BrowserOS%20neo&body=Hi%2C%0A%0AWe%27re%20looking%20at%20BrowserOS%20neo%20for%20our%20team.%0A%0ACompany%3A%0ATeam%20size%3A%0AWhat%20we%20want%20to%20automate%3A)

## 面向开发者

这两个浏览器都由同一个 Monorepo 发布。整个项目主要包含两个子系统：**浏览器**（Chromium 分支，使用 C++ 和 Python）以及 **Agent 平台**（使用 TypeScript、Rust 和 Go）。

### 架构

> 下图按“架构职责”展开到文件级：列出运行入口、构建配置、协议契约和核心业务文件。
> `*.test.*` / `*_test.*`、自动生成代码、数据库迁移、图片/字体、锁文件以及数量较多的
> Chromium Patch 不逐项重复，它们在所属目录节点中集中说明。

```
BrowserOS/
│
├── README.md                            # 英文项目首页（BrowserOS neo）
├── README.zh-CN.md                      # 中文项目首页与本架构索引
├── README.BrowserOS.md                  # BrowserOS 产品英文说明
├── README.BrowserOS.zh-CN.md            # BrowserOS 产品中文说明
├── CONTRIBUTING.md                      # 贡献入口与各开发方向的环境要求
├── CLA.md                               # Contributor License Agreement
├── LICENSE                              # AGPL-3.0 主许可证
├── LICENSE.ungoogled_chromium           # ungoogled-chromium 补丁许可证
├── lefthook.yml                         # 仓库级 Git Hook 编排
├── .gitattributes                       # Git LFS 与特殊文本属性
├── .gitignore                           # 仓库级忽略规则
├── .gitmodules                          # 私有内部文档等子模块声明
│
├── docs/                                # Mintlify 产品与开发文档
│   ├── docs.json                        # 文档站导航、主题和站点配置
│   ├── index.mdx                        # 文档站首页
│   ├── changelog.mdx                    # 面向用户的版本记录
│   ├── contributing.mdx                 # 文档站中的贡献说明
│   ├── theme.css                        # 文档站全局主题覆盖
│   ├── product-logo-link.js             # 产品 Logo 的交互脚本
│   ├── browseros/                       # BrowserOS 功能、集成与排障文档（每个 MDX 对应一个页面）
│   ├── neo/                             # BrowserOS neo 使用与隐私文档（每个 MDX 对应一个页面）
│   ├── snippets/                        # 多页面复用的 MDX 片段
│   ├── images/                          # README 与文档站图片资源
│   └── videos/                          # 演示视频和 Git LFS 媒体资源
│
├── packages/
│
│   ├── browseros/                       # Chromium Fork 的补丁、构建与发布系统
│   │   ├── CHROMIUM_VERSION             # BrowserOS 固定的 Chromium 四段版本号
│   │   ├── BASE_COMMIT                  # Patch 提取/校验所依据的 Chromium Commit
│   │   ├── pyproject.toml               # Python 包、browseros CLI 和开发依赖声明
│   │   ├── uv.lock                      # Python 依赖的可复现锁文件
│   │   ├── requirements.txt             # 兼容传统 pip 的依赖入口
│   │   ├── pyrightconfig.json           # Python 静态类型检查配置
│   │   ├── .env.example                 # 签名、R2、Chromium 路径等环境变量模板
│   │   ├── README.md                    # 浏览器构建系统概览
│   │
│   │   ├── bos_build/                   # BrowserOS 构建与发布系统（Python）
│   │   │   ├── browseros.py             # Typer 根应用；挂载 build/source/dev/release 等命令
│   │   │   ├── __main__.py              # 支持 python -m bos_build
│   │   │   ├── README.md                # 完整构建/发布系统说明
│   │   │   ├── bos_build.zh-CN.md       # 构建/发布系统中文说明
│   │   │   │
│   │   │   ├── cli/                     # CLI 参数解析层，不承载流水线实现
│   │   │   │   ├── build.py             # 解析 preset/profile/modules 并启动构建
│   │   │   │   ├── source.py            # Chromium checkout、sync 与缓存命令
│   │   │   │   ├── dev.py               # Patch doctor/extract 等开发命令
│   │   │   │   ├── product.py           # 产品定义检查命令
│   │   │   │   ├── ext.py               # 扩展构建与发布命令
│   │   │   │   ├── ota.py               # Server OTA 命令入口
│   │   │   │   ├── release.py           # 发布命令组装入口
│   │   │   │   ├── release_browser.py   # 浏览器 Release 操作
│   │   │   │   ├── release_candidate.py # Release Candidate 创建/检查
│   │   │   │   ├── release_component.py # Server/扩展等组件发布
│   │   │   │   ├── release_feeds.py     # Appcast/Feed 预览与发布
│   │   │   │   ├── release_resources.py # Release 资源准备与上传
│   │   │   │   └── release_suite.py     # 多平台 Release Suite 调度
│   │   │   │
│   │   │   ├── core/                    # 构建引擎核心
│   │   │   │   ├── context.py           # 单次构建的路径、版本、产品和架构上下文
│   │   │   │   ├── products.py          # ProductDescriptor 及产品注册表
│   │   │   │   ├── step.py              # Step 基类、阶段顺序和 Step Registry
│   │   │   │   ├── planner.py           # preset + switches → 有序 Step 计划
│   │   │   │   ├── resolver.py          # modules/phase/profile 的执行计划解析
│   │   │   │   ├── pipeline.py          # Pipeline 构造、校验与展示
│   │   │   │   ├── runner.py            # Step 的实际顺序执行与错误传播
│   │   │   │   ├── events.py            # 构建生命周期事件模型
│   │   │   │   ├── resume.py            # 断点续跑契约与产物一致性校验
│   │   │   │   └── checkout_lock.py     # Chromium checkout 跨进程互斥锁
│   │   │   │
│   │   │   ├── lib/                     # 构建与发布共用基础设施
│   │   │   │   ├── env.py               # .env 和必需环境变量读取
│   │   │   │   ├── paths.py             # 仓库、源码、输出目录解析
│   │   │   │   ├── versions.py          # Chromium/BrowserOS 版本计算
│   │   │   │   ├── utils.py             # 平台判断、命令执行和通用辅助函数
│   │   │   │   ├── logger.py            # 统一终端日志输出
│   │   │   │   ├── r2.py                # Cloudflare R2 客户端与对象操作
│   │   │   │   ├── sparkle.py           # Sparkle Appcast/签名公共逻辑
│   │   │   │   ├── notarization.py      # macOS Notarization API 封装
│   │   │   │   ├── notify.py            # 发布通知接口
│   │   │   │   └── testing.py           # 构建系统测试辅助设施
│   │   │   │
│   │   │   ├── patchkit/                # Chromium Patch 的非交互式实现
│   │   │   │   ├── batch_apply.py       # 批量应用文件级 Patch
│   │   │   │   ├── doctor.py            # 检查 Feature Registry 与 Patch 可应用性
│   │   │   │   ├── features_io.py       # .features.yaml 的读写与规范化
│   │   │   │   ├── validation.py        # Patch 路径、格式和状态校验
│   │   │   │   └── extract/
│   │   │   │       ├── common.py        # Patch 提取共享数据结构和写入逻辑
│   │   │   │       ├── extract_patch.py # 从单个 Chromium 文件提取 Patch
│   │   │   │       ├── extract_commit.py # 从一个 Commit 提取 Patch
│   │   │   │       ├── extract_range.py # 从 Commit 范围提取/合并 Patch
│   │   │   │       └── utils.py         # Git diff 解析与提取辅助函数
│   │   │   │
│   │   │   ├── products/                # 产品差异定义
│   │   │   │   ├── browseros/product.py # BrowserOS 品牌、Bundle ID、资源和产物定义
│   │   │   │   ├── browserclaw/product.py # BrowserOS neo 对应浏览器产品定义
│   │   │   │   ├── doctor.py            # 产品标识、资源和命名冲突检查
│   │   │   │   ├── resource_sources.py  # 产品组件资源来源模型
│   │   │   │   └── server_binaries.py   # Agent Server 二进制描述与选择
│   │   │   │
│   │   │   ├── config/                  # 数据驱动的构建配置
│   │   │   │   ├── BROWSEROS_BUILD_OFFSET # BrowserOS 相对 Chromium 的构建号偏移
│   │   │   │   ├── copy_resources.yaml  # 本地资源复制规则
│   │   │   │   ├── download_resources.yaml # 发布资源下载规则
│   │   │   │   └── gn/
│   │   │   │       ├── flags.*.debug.gn # 各平台 Debug GN 参数
│   │   │   │       └── flags.*.release.gn # 各平台 Release GN 参数
│   │   │   │
│   │   │   ├── profiles/
│   │   │   │   ├── release-ci.yaml      # CI Release 的固定 switches
│   │   │   │   ├── nightly-ci.yaml      # 无签名 Nightly CI 配置
│   │   │   │   └── nightly-macos.yaml   # 自托管 macOS Nightly 配置
│   │   │   │
│   │   │   ├── steps/                   # 真正修改源码/生成产物的 Build Step
│   │   │   │   ├── source/provision.py  # 创建并同步固定版本 Chromium checkout
│   │   │   │   ├── source/cache.py      # Chromium checkout 缓存恢复与保存
│   │   │   │   ├── setup/clean.py       # 清理上次构建及已应用修改
│   │   │   │   ├── setup/git.py         # Checkout 固定 Tag 并执行 gclient sync
│   │   │   │   ├── setup/configure.py   # 写入 args.gn 并执行 gn gen
│   │   │   │   ├── patches/patches.py   # 应用 BrowserOS 文件级 Patch
│   │   │   │   ├── patches/series_patches.py # 应用有序第三方 Patch Series
│   │   │   │   ├── extensions/bundled_extensions.py # 构建并嵌入 CRX 扩展
│   │   │   │   ├── compile/standard.py  # 调用 autoninja 编译单架构浏览器
│   │   │   │   ├── compile/universal.py # 编排 macOS Universal 双架构编译
│   │   │   │   ├── sign/windows.py      # Windows 可执行文件签名
│   │   │   │   ├── sign/macos.py        # macOS App Codesign/Notarize
│   │   │   │   ├── sign/linux.py        # Linux 产物签名占位/策略
│   │   │   │   ├── sign/sparkle.py      # Sparkle 更新包签名
│   │   │   │   ├── package/windows.py   # Windows Installer 打包
│   │   │   │   ├── package/macos.py     # macOS DMG/ZIP 打包
│   │   │   │   ├── package/linux.py     # Linux DEB/AppImage 打包入口
│   │   │   │   ├── package/merge.py     # 合并 macOS Universal 产物
│   │   │   │   ├── package/universalizer_patched.py # Universal App 合并适配器
│   │   │   │   ├── package/linux_packaging/*.py # AppImage/DEB 策略与运行时收集
│   │   │   │   ├── storage/download.py  # 从 R2/CDN 下载构建资源
│   │   │   │   └── storage/upload.py    # 上传最终构建产物
│   │   │   │
│   │   │   ├── release/                 # Build 之后的发布事务
│   │   │   │   ├── plan.py              # Release 计划模型
│   │   │   │   ├── candidate.py         # Candidate 创建与状态转换
│   │   │   │   ├── lane.py              # 单平台 Release Lane
│   │   │   │   ├── suite.py             # 多平台发布套件编排
│   │   │   │   ├── suite_artifact.py    # Suite 产物清单与校验
│   │   │   │   ├── suite_rolling.py     # Rolling/Nightly 发布策略
│   │   │   │   ├── browser_finalize.py  # 浏览器发布最终确认
│   │   │   │   ├── component_release.py # 独立组件版本发布
│   │   │   │   ├── components.py        # 可发布组件注册表
│   │   │   │   ├── resource_pins.py     # 构建资源版本 Pin
│   │   │   │   ├── prepared_resources.py # 已准备资源的 Manifest
│   │   │   │   ├── server_resources.py  # Server/Onboarding Bundle 资源
│   │   │   │   ├── r2_allocations.py    # R2 Key 分配与冲突保护
│   │   │   │   ├── appcast.py           # 浏览器更新 Appcast 生成
│   │   │   │   ├── github.py            # GitHub Release/Workflow 操作
│   │   │   │   ├── download.py          # Release 产物下载
│   │   │   │   ├── publish.py           # 发布提交与晋级
│   │   │   │   ├── extensions/build.py  # 扩展 Release 构建
│   │   │   │   ├── extensions/crx.py    # CRX3 打包与签名
│   │   │   │   ├── extensions/manifests.py # 扩展更新 Manifest
│   │   │   │   ├── extensions/release.py # 扩展发布事务
│   │   │   │   ├── extensions/specs.py  # 扩展产品规格
│   │   │   │   ├── extensions/workspace.py # 扩展工作区解析
│   │   │   │   ├── feeds/spec.py        # Feed/Appcast 规格定义
│   │   │   │   ├── feeds/render.py      # XML/JSON Feed 渲染
│   │   │   │   ├── feeds/publisher.py   # Feed 差异检查与发布
│   │   │   │   ├── ota/common.py        # OTA 公共模型
│   │   │   │   ├── ota/server.py        # Agent Server OTA 发布
│   │   │   │   └── ota/sign_binary.py   # OTA 二进制签名
│   │   │   │
│   │   │   ├── scripts/bump_version.py  # 更新 BrowserOS/Chromium 派生版本
│   │   │   ├── scripts/icon_generation/generate_icons.py # 生成各平台图标尺寸
│   │   │   └── docs/*.md                # CLI、CI、Nightly 和安装验证手册
│   │
│   │   ├── chromium_files/              # 新增到 Chromium 的完整文件（按目标路径镜像）
│   │   │   └── products/
│   │   │       ├── browseros/           # BrowserOS 品牌常量、Theme 与原生资源
│   │   │       └── browserclaw/         # BrowserOS neo 品牌常量、Theme 与原生资源
│   │
│   │   ├── chromium_patches/            # 每个 *.patch 对应一个 Chromium 目标文件
│   │   │   ├── .features.yaml           # Feature → Patch 文件的权威映射
│   │   │   ├── .store.yaml              # Patch Store 基线版本与元数据
│   │   │   ├── base/                    # 进程、路径、版本等 Chromium Base 修改
│   │   │   ├── chrome/browser/browseros/ # 原生 API、MCP、策略与产品能力
│   │   │   ├── chrome/browser/extensions/ # BrowserOS Extension API 修改
│   │   │   ├── chrome/browser/ui/       # Tab、Side Panel、Toolbar、WebUI 修改
│   │   │   ├── components/              # Preferences、Search、Update 等组件修改
│   │   │   ├── content/                 # Content/DevTools 协议与渲染进程修改
│   │   │   ├── extensions/              # Extension Framework 修改
│   │   │   ├── third_party/             # Blink、Sparkle 等第三方模块修改
│   │   │   ├── tools/                   # Metrics、GRIT 与生成工具修改
│   │   │   └── ui/                      # WebUI 与 Views 基础设施修改
│   │
│   │   ├── resources/                   # 产品图标、安装器素材与 macOS Entitlements
│   │   ├── series_patches/              # 按 series 顺序应用的 ungoogled/Windows Patch
│   │   └── tools/
│   │       ├── bpatch/src/main.rs        # Rust Patch 工作流 CLI 入口
│   │       ├── bpatch/src/*.rs           # apply/extract/rebase/store 的实现模块
│   │       ├── vendor_uploads/main.py    # 第三方 Bun/Lima/Codex 资源上传 CLI
│   │       └── vendor_uploads/support.py # Vendor 上传的环境与存储辅助函数
│
│   └── browseros-agent/                 # Agent 平台（TypeScript / Rust / Go）
│       ├── package.json                 # Bun Workspace、脚本和固定 Bun 版本
│       ├── bun.lock                     # JavaScript/TypeScript 依赖锁
│       ├── Cargo.toml                   # Rust Workspace 成员与共享依赖
│       ├── Cargo.lock                   # Rust 依赖锁
│       ├── turbo.json                   # Monorepo 构建任务依赖与缓存
│       ├── tsconfig.json                # TypeScript 根配置
│       ├── biome.json                   # 格式化与 Lint 规则
│       ├── bunfig.toml                  # Bun 运行时/测试配置
│       ├── process-compose.yaml         # 本地多进程开发编排
│       ├── server.json                  # Server 发布描述与资源版本
│       ├── config.sample.json           # Server 配置示例
│       ├── config.dev.json              # 本地开发配置
│       ├── .env.development.example     # 开发环境变量模板
│       ├── .env.production.example      # 生产环境变量模板
│       ├── README.md                    # Agent Monorepo 概览
│       ├── CONTRIBUTING.md              # BrowserOS neo 开发指南
│       └── CONTRIBUTING.BrowserOS.md    # BrowserOS Agent 开发指南
│       │
│       ├── apps/                        # 可独立运行/发布的应用
│       │
│       │   ├── app/                     # BrowserOS WXT + React 扩展
│       │   │   ├── package.json         # 扩展依赖与 build/dev/check 脚本
│       │   │   ├── wxt.config.ts        # Manifest、权限和 WXT 构建配置
│       │   │   ├── web-ext.config.ts    # 浏览器加载/调试配置
│       │   │   ├── codegen.ts           # 扩展构建前代码生成
│       │   │   ├── entrypoints/background/index.ts # Background Service Worker 入口
│       │   │   ├── entrypoints/app/main.tsx # New Tab/设置主应用挂载入口
│       │   │   ├── entrypoints/app/App.tsx # 主应用路由与页面装配
│       │   │   ├── entrypoints/sidepanel/main.tsx # Side Panel React 入口
│       │   │   ├── entrypoints/sidepanel/App.tsx # Side Panel 页面装配
│       │   │   ├── entrypoints/content.ts # 通用页面 Content Script
│       │   │   ├── entrypoints/auth.content/index.ts # OAuth 页面桥接脚本
│       │   │   ├── entrypoints/glow.content/index.ts # Agent 页面高亮效果入口
│       │   │   ├── entrypoints/selection.content.ts # 页面文本选择桥接脚本
│       │   │   ├── components/          # 可复用业务/UI 组件；每个 TSX 对应一个组件
│       │   │   ├── screens/             # New Tab、聊天、设置等页面级组件
│       │   │   ├── modules/             # Conversation、MCP、Schedule 等领域模块
│       │   │   └── lib/                 # Auth、BrowserOS API、存储、遥测等基础设施
│       │
│       │   ├── app-onboard/             # BrowserOS 首次启动引导（Vite）
│       │   │   ├── index.html           # Vite HTML 入口
│       │   │   ├── vite.config.ts       # 构建配置
│       │   │   ├── src/main.tsx         # React 挂载入口
│       │   │   ├── src/App.tsx          # Onboarding 根状态机
│       │   │   ├── src/styles.css       # 全局样式
│       │   │   └── src/onboarding/      # 各引导步骤及其组件
│       │
│       │   ├── claw-app/                # BrowserOS neo Cockpit 扩展
│       │   │   ├── package.json         # Cockpit 依赖与构建脚本
│       │   │   ├── wxt.config.ts        # New Tab 扩展 Manifest/WXT 配置
│       │   │   ├── web-ext.config.ts    # 本地加载 BrowserOS neo 的配置
│       │   │   ├── doctor.config.json   # 客户端诊断规则
│       │   │   ├── entrypoints/background.ts # Cockpit Background 入口
│       │   │   ├── entrypoints/recorder.content.ts # 会话录制 Content Script
│       │   │   ├── components/          # Cockpit/Audit/Harness/Skills 组件
│       │   │   ├── screens/             # Cockpit、Replay、Task Detail 页面
│       │   │   └── modules/             # API Client、Analytics、Recorder 等模块
│       │
│       │   ├── claw-onboard/            # BrowserOS neo 首次启动引导（Vite）
│       │   │   ├── index.html           # Vite HTML 入口
│       │   │   ├── vite.config.ts       # 引导应用构建配置
│       │   │   ├── src/main.tsx         # React 挂载入口
│       │   │   ├── src/App.tsx          # 导入 Chrome/连接 Agent 的流程根组件
│       │   │   └── src/styles.css       # 引导应用样式
│       │
│       │   ├── claw-server-rust/        # BrowserOS neo 本地后端（Rust）
│       │   │   ├── Cargo.toml           # Rust 二进制、Feature 与依赖声明
│       │   │   ├── build.rs             # 构建期版本/资源生成
│       │   │   ├── src/main.rs          # 进程入口
│       │   │   ├── src/lib.rs           # 可测试的 Library 入口
│       │   │   ├── src/app.rs           # HTTP/MCP/Service 的应用装配
│       │   │   ├── src/config.rs        # CLI、文件与环境配置合并
│       │   │   ├── src/runtime.rs       # Tokio Runtime 与生命周期
│       │   │   ├── src/storage.rs       # 数据/录制文件根目录管理
│       │   │   ├── src/ids.rs           # Session/Task/Dispatch 强类型 ID
│       │   │   ├── src/clock.rs         # 可替换时钟抽象
│       │   │   ├── src/error.rs         # 应用统一错误类型
│       │   │   ├── src/api/http/*.rs    # 每个文件对应一个 REST 资源 Handler
│       │   │   ├── src/api/mcp/service.rs # MCP Server 与 Browser Tools 装配
│       │   │   ├── src/api/mcp/dispatch.rs # Tool Call 分发与审计
│       │   │   ├── src/api/mcp/guards/*.rs # 浏览器连接、Scheme、页面所有权守卫
│       │   │   ├── src/api/mcp/effects/*.rs # Tool Call 后的 Session/Tab 副作用
│       │   │   ├── src/api/mcp/observers/audit.rs # MCP 调用审计观察器
│       │   │   ├── src/db/migration.rs  # SQLite Schema 迁移
│       │   │   ├── src/db/entities/*.rs # SeaORM 实体；每个文件对应一张表
│       │   │   ├── src/db/audit_log.rs  # 审计日志查询与写入
│       │   │   ├── src/db/session_tabs.rs # Session 与 Tab 关联存储
│       │   │   ├── src/db/skills.rs     # Skill 元数据存储
│       │   │   ├── src/identity/client.rs # Browser/Agent Client 身份
│       │   │   ├── src/identity/conversation.rs # 对话身份关联
│       │   │   └── src/services/        # Browser/Cockpit/Replay/Recording/Session 服务
│       │
│       │   ├── server/                  # BrowserOS Agent Server（Bun/TypeScript）
│       │   │   ├── package.json         # Server 依赖、构建与迁移脚本
│       │   │   ├── drizzle.config.ts    # SQLite/Drizzle Schema 配置
│       │   │   ├── src/index.ts         # Bun 可执行入口
│       │   │   ├── src/main.ts          # Server 启动、关停与组件装配
│       │   │   ├── src/config.ts        # Server 配置解析
│       │   │   ├── src/env.ts           # 类型化环境变量入口
│       │   │   ├── src/rpc.ts           # Server 内部 RPC 定义
│       │   │   ├── src/version.ts       # 构建版本读取
│       │   │   ├── src/compiled-bootstrap.ts # 编译后二进制 Bootstrap
│       │   │   ├── src/agent/ai-sdk-agent.ts # AI SDK Agent Loop
│       │   │   ├── src/agent/provider-factory.ts # LLM/ACP Provider 选择
│       │   │   ├── src/agent/mcp-builder.ts # 每次会话的 MCP Toolset 构造
│       │   │   ├── src/agent/compaction.ts # 上下文压缩流程
│       │   │   ├── src/agent/prompt.ts   # BrowserOS Agent System Prompt
│       │   │   ├── src/agent/session-store.ts # 运行中 Agent Session 状态
│       │   │   ├── src/api/server.ts    # HTTP Server 与 Middleware 装配
│       │   │   ├── src/api/routes/*.ts  # Chat/MCP/OAuth/Schedule 等 REST 路由
│       │   │   ├── src/api/services/    # 路由背后的 Chat、Klavis 与 MCP 服务
│       │   │   ├── src/lib/clients/     # LLM、OAuth、Gateway 外部客户端
│       │   │   ├── src/lib/db/          # Drizzle Client、Schema 与 SQL 迁移
│       │   │   ├── src/lib/mcp-manager/ # 外部 Agent MCP 配置协调服务
│       │   │   ├── src/lib/schedules/   # 定时任务与运行记录存储
│       │   │   └── src/tools/filesystem/ # 受路径边界保护的文件系统 Tools
│       │
│       │   └── cli/                     # BrowserOS CLI（Go）
│       │       ├── main.go              # CLI 进程入口
│       │       ├── cmd/root.go          # Cobra 根命令和全局参数
│       │       ├── cmd/init.go          # 初始化连接与配置
│       │       ├── cmd/launch.go        # 启动/连接 BrowserOS
│       │       ├── cmd/health.go        # Server/Browser 健康检查
│       │       ├── cmd/snap.go          # 获取可交互页面 Snapshot
│       │       ├── cmd/click.go          # 点击页面元素
│       │       ├── cmd/fill.go           # 填写表单控件
│       │       ├── cmd/eval.go           # 在页面执行 JavaScript
│       │       ├── cmd/nav.go            # 页面导航
│       │       ├── cmd/tabs.go           # Tab 查询与切换
│       │       ├── cmd/window.go         # Browser Window 操作
│       │       ├── cmd/screenshot.go     # 页面截图
│       │       ├── cmd/file_actions.go   # 上传/下载文件操作
│       │       ├── cmd/batch.go          # 批量执行浏览器动作
│       │       ├── cmd/update.go         # CLI 自更新
│       │       └── cmd/*.go              # 其余文件各实现一个同名浏览器子命令
│       │
│       ├── contracts/                   # 跨语言协议的唯一事实来源
│       │   ├── claw-api/openapi.yaml    # BrowserOS neo REST OpenAPI 根文档
│       │   ├── claw-api/parameters.yaml # 公共请求参数
│       │   ├── claw-api/responses.yaml  # 公共响应与错误
│       │   ├── claw-api/paths/*.yaml    # 每个 REST 资源的 Path 定义
│       │   ├── claw-api/schemas/*.yaml  # Audit/Session/Skill 等数据模型
│       │   ├── claw-api/fixtures/*.json # Schema 契约样例
│       │   ├── claw-mcp/README.md       # MCP 行为契约与一致性要求
│       │   ├── claw-mcp/tests/*.ts      # TS/Rust MCP 的跨实现一致性测试
│       │   └── claw-mcp/fixtures/       # MCP 浏览器行为测试页面
│       │
│       ├── packages/                    # 共享 TypeScript Package
│       │
│       │   ├── acpx-ai-provider/src/provider.ts # ACP Runtime 的 AI SDK Provider 工厂
│       │   ├── acpx-ai-provider/src/language-model.ts # ACP ↔ AI SDK 流式模型适配
│       │   ├── acpx-ai-provider/src/convert-prompt.ts # Prompt 转 ACP Request
│       │   ├── acpx-ai-provider/src/convert-events.ts # ACP Event 转 AI SDK Chunk
│       │   ├── agent-mcp-manager/src/api.ts # MCP 安装/移除/查询的高层 API
│       │   ├── agent-mcp-manager/src/planner/planner.ts # Agent 配置变更计划
│       │   ├── agent-mcp-manager/src/emitters/*.ts # JSON/YAML/TOML 配置写入器
│       │   ├── browser-core/src/browser.ts # Browser 控制门面
│       │   ├── browser-core/src/backends/cdp.ts # CDP Backend 实现
│       │   ├── browser-core/src/core/connection.ts # CDP 连接生命周期
│       │   ├── browser-core/src/core/input/*.ts # Click/Type/Mouse/Keyboard 实现
│       │   ├── browser-core/src/core/observer/*.ts # AX Tree 与页面观察
│       │   ├── browser-core/src/core/snapshot/*.ts # Snapshot Diff/Ref/Render
│       │   ├── browser-core/src/core/navigation.ts # 页面导航与等待
│       │   ├── browser-core/src/core/pages.ts # Tab/Page 注册表
│       │   ├── browser-core/src/core/screenshot*.ts # 截图、裁剪、Overlay 与队列
│       │   ├── browser-mcp/src/mcp-server.ts # TypeScript MCP Server
│       │   ├── browser-mcp/src/register.ts # Browser Tools 批量注册
│       │   ├── browser-mcp/src/tools/*.ts # 每个文件实现一个同名 MCP Tool
│       │   ├── build-server-tools/src/orchestrator.ts # Server Bundle 构建总编排
│       │   ├── build-server-tools/src/compile.ts # Bun/Rust 编译调用
│       │   ├── build-server-tools/src/stage.ts # 发布目录 Staging
│       │   ├── build-server-tools/src/manifest.ts # Bundle Manifest 生成
│       │   ├── cdp-protocol/src/generated/ # 从 Chromium Protocol 自动生成的 TS 类型
│       │   ├── claw-api/src/generated/   # 从 OpenAPI 自动生成的 TS Model
│       │   ├── claw-api-client/src/client.ts # 类型化 REST Client
│       │   ├── claw-api-client/src/urls.ts # Endpoint URL 构造
│       │   ├── diagnostics/src/collector.ts # 诊断信息采集
│       │   ├── diagnostics/src/DiagnosticsPage.tsx # 诊断 UI
│       │   ├── onboarding-video/src/Root.tsx # Remotion Composition 注册
│       │   ├── onboarding-video/src/FirstRunDemo.tsx # 首次启动演示时间线
│       │   ├── onboarding-video/src/scenes/*.tsx # 每个视频场景
│       │   └── shared/src/              # 常量、Env、Schema、Sentry 与公共类型
│       │
│       ├── crates/                      # 共享 Rust Crate
│       │
│       │   ├── browseros-cdp/src/lib.rs # Rust CDP Client 公共入口
│       │   ├── browseros-cdp/src/client.rs # WebSocket 请求/事件分发
│       │   ├── browseros-cdp/src/generated/ # CDP Domain/Command/Event 生成代码
│       │   ├── browseros-core/src/lib.rs # Rust Browser Core 公共入口
│       │   ├── browseros-core/src/browser.rs # Browser 控制门面
│       │   ├── browseros-core/src/connection.rs # CDP 连接管理
│       │   ├── browseros-core/src/input/*.rs # Mouse/Keyboard/Geometry 输入实现
│       │   ├── browseros-core/src/observer*.rs # 页面/AX Tree 观察与采集
│       │   ├── browseros-core/src/snapshot/*.rs # Snapshot Diff/Ref/Render
│       │   ├── browseros-core/src/screenshot/mod.rs # 页面截图
│       │   ├── browseros-core/src/session.rs # Browser Session 生命周期
│       │   ├── browseros-mcp/src/service.rs # Rust MCP Service
│       │   ├── browseros-mcp/src/framework.rs # Tool 执行框架与上下文
│       │   ├── browseros-mcp/src/tools/*.rs # 每个文件实现一个同名 MCP Tool
│       │   ├── claw-api/src/lib.rs       # OpenAPI 生成的 Rust API Model 出口
│       │   ├── harness-integrations/src/catalog.rs # Claude/Codex 等 Harness 能力目录
│       │   ├── harness-integrations/src/mcp/*.rs # MCP 配置规划、读写与应用
│       │   └── harness-integrations/src/skills/*.rs # Skill Manifest 与安装协调
│       │
│       ├── scripts/
│       │   ├── build/server.ts          # TypeScript Server Bundle 构建入口
│       │   ├── build/claw-server-rust.ts # Rust Server 跨平台构建入口
│       │   ├── build/cli.ts             # Go CLI 构建/发布入口
│       │   ├── build/app-onboard.ts     # BrowserOS Onboarding Bundle
│       │   ├── build/claw-onboard.ts    # BrowserOS neo Onboarding Bundle
│       │   ├── codegen/cdp-protocol.ts  # 生成 TypeScript CDP Binding
│       │   ├── codegen/claw-api.ts      # 从 OpenAPI 生成 API 类型
│       │   ├── generate-models.ts       # 聚合执行模型代码生成
│       │   ├── env/generate-examples.ts # 从 Env Registry 生成模板
│       │   ├── env/migrate-local.ts     # 本地环境变量迁移
│       │   ├── patch-windows-exe.ts     # 修补 Windows 二进制元数据
│       │   ├── run-bun-test.ts          # Bun 测试套件入口
│       │   ├── run-cargo-test.ts        # Cargo 测试套件入口
│       │   ├── run-test-suite.ts        # Monorepo 测试总编排
│       │   └── release/*                # Release PR、Changelog、Workflow 校验脚本
│       ├── resources/skills/browserclaw/SKILL.md # 随产品分发的 BrowserOS neo Skill
│       ├── third_party/bin/rcedit-x64.exe # Windows 资源编辑器（Git LFS）
│       └── tools/                       # dev/dogfood Go 工具：进程、端口、Profile 与构建管理
│
├── signatures/version1/cla.json         # 已签署 CLA 的身份记录
│
├── skills/browseros-neo/SKILL.md        # 仓库级 BrowserOS neo Agent Skill
│
├── tools/release_secrets/
│   ├── sync.py                          # GitHub/Cloudflare 等发布 Secret 同步工具
│   ├── sync_test.py                     # Secret 映射与 dry-run 测试
│   └── README.md                        # 权限模型与使用说明
│
└── updates/                             # 公开自动更新状态
    ├── browser/appcast*.xml             # 各产品/平台的浏览器更新 Feed
    ├── extensions/extensions*.json      # Bundled/Alpha 扩展版本清单
    ├── extensions/*manifest*.xml        # Chromium Extension Update Manifest
    ├── server/appcast-server*.xml       # BrowserOS Server OTA Feed
    ├── server/appcast-claw-server*.xml  # BrowserOS neo Server OTA Feed
    └── upload.sh                        # Legacy Update Manifest 上传脚本
```

| Package | 作用 |
|---------|-------------|
| [`packages/browseros`](packages/browseros/) | Chromium 分支：补丁、构建系统、签名 |
| [`packages/browseros-agent/apps/claw-server-rust`](packages/browseros-agent/apps/claw-server-rust/) | BrowserOS neo 后端：Agent 连接的 MCP Endpoint，以及仪表盘背后的 API |
| [`packages/browseros-agent/apps/claw-app`](packages/browseros-agent/apps/claw-app/) | BrowserOS neo 新标签页仪表盘：查看、回放和管理 Agent 会话 |
| [`packages/browseros-agent/apps/claw-onboard`](packages/browseros-agent/apps/claw-onboard/) | BrowserOS neo 首次运行引导 |
| [`packages/browseros-agent/apps/server`](packages/browseros-agent/apps/server/) | Bun Server：暴露浏览器 MCP 工具，并运行 BrowserOS AI Agent Loop |
| [`packages/browseros-agent/apps/app`](packages/browseros-agent/apps/app/) | BrowserOS 扩展：新标签页、侧边栏聊天、引导流程、设置 |
| [`packages/browseros-agent/apps/app-onboard`](packages/browseros-agent/apps/app-onboard/) | BrowserOS 首次运行引导 |
| [`packages/browseros-agent/apps/cli`](packages/browseros-agent/apps/cli/) | Go CLI：从终端或 AI Coding Agent 控制 BrowserOS |
