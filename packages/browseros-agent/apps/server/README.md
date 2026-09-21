<<<<<<< HEAD
# BrowserOS Server

MCP server and AI agent loop powering BrowserOS browser automation. This is the core backend — it connects to Chromium via CDP, exposes 53+ MCP tools, and runs the AI agent that interprets natural language into browser actions.

> **Runtime:** [Bun](https://bun.sh) · **Framework:** [Hono](https://hono.dev) · **AI:** [Vercel AI SDK](https://sdk.vercel.ai) · **License:** [AGPL-3.0](../../../../LICENSE)

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         MCP Clients                                  │
│           (Agent UI, Claude Code, Gemini CLI, browseros-cli)         │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP / SSE / StreamableHTTP
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BrowserOS Server (Bun)                             │
│                                                                      │
│   /mcp ─────── MCP tool endpoints (53+ tools)                       │
│   /chat ────── Agent streaming (AI SDK)                              │
│   /system/health ─ Health check                                      │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Agent Loop                                                  │   │
│   │  ├── Multi-provider AI SDK (OpenAI, Anthropic, Google, ...) │   │
│   │  ├── Session & conversation management                       │   │
│   │  ├── Context overflow handling + compaction                  │   │
│   │  └── MCP client for external tool servers                    │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  CDP-backed browser tools                                   │   │
│   │  (tabs, bookmarks, history, navigation, tab groups,         │   │
│   │   screenshots, DOM, network, console, input)                │   │
│   └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                │ Chrome DevTools Protocol
                                ▼
                     ┌─────────────────────┐
                     │   Chromium CDP      │
                     │  (port 9000)        │
                     │                     │
                     │  DOM, network,      │
                     │  input, screenshots │
                     └─────────────────────┘
```

## MCP Tools

Tools organized by category:

| Category | Tools |
|----------|-------|
| **Navigation** | `new_page`, `navigate`, `go_back`, `go_forward`, `reload` |
| **Input** | `click`, `type`, `press_key`, `hover`, `scroll`, `drag`, `fill`, `clear`, `focus`, `check`, `uncheck`, `select_option`, `upload_file` |
| **Observation** | `take_snapshot`, `take_enhanced_snapshot`, `extract_text`, `extract_links` |
| **Screenshots** | `take_screenshot`, `save_screenshot` |
| **Evaluation** | `evaluate_script` |
| **Pages** | `list_pages`, `active_page`, `close_page`, `new_hidden_page` |
| **Windows** | `window_list`, `window_create`, `window_close`, `window_activate` |
| **Bookmarks** | `bookmark_list`, `bookmark_create`, `bookmark_remove`, `bookmark_update`, `bookmark_move`, `bookmark_search` |
| **History** | `history_search`, `history_recent`, `history_delete`, `history_delete_range` |
| **Tab Groups** | `group_list`, `group_create`, `group_update`, `group_ungroup`, `group_close` |
| **Filesystem** | `ls`, `read`, `write`, `edit`, `find`, `grep`, `bash` |
| **DOM** | `dom`, `dom_search` |
| **Console** | `get_console_messages` |
| **Other** | `browseros_info`, `handle_dialog`, `wait_for`, `download`, `export_pdf`, `output_file`, `nudges` |

## Agent Loop

The agent loop uses the [Vercel AI SDK](https://sdk.vercel.ai) to orchestrate multi-step browser automation:

- **Multi-provider support** — OpenAI, Anthropic, Google, Azure, Bedrock, OpenRouter, Ollama, LM Studio, and any OpenAI-compatible endpoint
- **Session management** — conversations persist in a local SQLite database
- **Context overflow handling** — automatic message compaction when context windows fill up
- **MCP clients** — use the same loopback `/mcp` runtime for BrowserOS tools and connect to external MCP servers for additional integrations
- **Server-owned execution** — browser permissions, output grants, metrics, and tab-presence effects live behind `BrowserToolRuntime`

### Provider Factory

The provider factory (`src/agent/provider-factory.ts`) creates AI SDK providers from runtime configuration, supporting hot-swapping between providers without restart.

## Directory Structure

```
apps/server/
├── src/
│   ├── index.ts               # Server entry point
│   ├── main.ts                # Server initialization
│   ├── api/                   # HTTP route handlers
│   ├── agent/                 # Agent loop
│   │   ├── ai-sdk-agent.ts    # Main agent implementation
│   │   ├── provider-factory.ts# LLM provider factory
│   │   ├── session-store.ts   # Conversation persistence
│   │   ├── compaction.ts      # Context window management
│   │   └── mcp-builder.ts     # Internal and external MCP client setup
│   ├── api/services/mcp/
│   │   └── browser-tool-runtime.ts # Browser tool leases, guards, execution, and effects
│   ├── browser/               # Browser connection layer
│   ├── tools/                 # MCP tool implementations
│   │   ├── navigation.ts
│   │   ├── input.ts
│   │   ├── snapshot.ts
│   │   ├── filesystem/
│   │   └── ...
│   ├── lib/                   # Shared utilities
│   └── rpc.ts                 # JSON-RPC type definitions
├── tests/
│   ├── tools/                 # Tool-level tests
│   └── server.integration.test.ts
└── package.json
```

## Development

### Prerequisites

- [Bun](https://bun.sh) runtime
- A running BrowserOS instance (for CDP connectivity)

### Setup

```bash
# From this app directory, create the shared root development env file
(cd ../.. && cp .env.development.example .env.development)

# Start the server directly (dev:watch generates this config automatically)
bun --env-file=../../.env.development src/index.ts --config ../../config.dev.json
```

See the [agent monorepo README](../../README.md) for full environment variable reference and `dev:watch` setup.

### Testing

```bash
bun run test:tools          # Tool-level tests
bun run test:integration    # Full integration tests (requires running BrowserOS)
```

### Building

```bash
# Build cross-platform server binaries
bun run build

# Build for specific targets
bun scripts/build/server.ts --target=darwin-arm64,linux-x64

# Build without uploading to R2
bun scripts/build/server.ts --target=all --no-upload
```

## Release Flow

Server releases are GitHub Releases for annotated component tags. They do not build or upload server binaries; GitHub provides the source zip and tarball for the tag.

Bump `packages/browseros-agent/apps/server/package.json` and the matching `bun.lock` entry in a PR, merge it, then tag the merged commit:

```bash
git tag -a agent-server/v0.0.123 -m "BrowserOS Server - v0.0.123"
git push origin agent-server/v0.0.123
```

The workflow validates the tag against the hardcoded package path. A tag push fails if the tagged commit's package version does not match the tag version. Manual dispatch can set the package version on the default branch, update the matching lockfile entry, create the annotated tag, and publish the GitHub Release.

## Sidecar Config

`--config <path>` is the only server startup config input. The JSON sidecar carries `ports.server`, `ports.cdp`, `ports.proxy`, `directories.resources`, `directories.execution`, and optional `instance.*` metadata. Dev, dogfood, and Chromium-managed launches generate this file before starting the binary.
=======
# BrowserOS Server

用于驱动 BrowserOS 浏览器自动化的 MCP 服务器和 AI 智能体循环。它是核心后端 —— 通过 CDP 连接 Chromium，提供 53+ 个 MCP 工具，并运行 AI 智能体，将自然语言解释为浏览器操作。

> **运行时：** [Bun](https://bun.sh) · **框架：** [Hono](https://hono.dev) · **AI：** [Vercel AI SDK](https://sdk.vercel.ai) · **许可证：** [AGPL-3.0](../../../../LICENSE)

## 架构

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         MCP 客户端                                  │
│            (Agent UI, Claude Code, Gemini CLI, browseros-cli)        │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP / SSE / StreamableHTTP
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BrowserOS Server (Bun)                            │
│                                                                      │
│   /mcp ─────── MCP 工具端点（53+ 个工具）                            │
│   /chat ────── 智能体流式输出（AI SDK）                              │
│   /system/health ─ 健康检查                                          │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐    │
│   │  智能体循环                                                 │    │
│   │  ├── 多提供商 AI SDK（OpenAI、Anthropic、Google 等）       │    │
│   │  ├── 会话与对话管理                                        │    │
│   │  ├── 上下文溢出处理 + 压缩                                 │    │
│   │  └── 用于外部工具服务器的 MCP 客户端                       │    │
│   └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐    │
│   │  基于 CDP 的浏览器工具                                      │    │
│   │  （标签页、书签、历史记录、导航、标签页分组、               │    │
│   │   截图、DOM、网络、控制台、输入）                            │    │
│   └─────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                │ Chrome DevTools Protocol
                                ▼
                     ┌─────────────────────┐
                     │    Chromium CDP     │
                     │   （端口 9000）     │
                     │                     │
                     │   DOM、网络、       │
                     │   输入、截图        │
                     └─────────────────────┘
```

## MCP 工具

工具按类别组织：

| 类别        | 工具                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **导航**    | `new_page`, `navigate`, `go_back`, `go_forward`, `reload`                                                                             |
| **输入**    | `click`, `type`, `press_key`, `hover`, `scroll`, `drag`, `fill`, `clear`, `focus`, `check`, `uncheck`, `select_option`, `upload_file` |
| **页面观察**  | `take_snapshot`, `take_enhanced_snapshot`, `extract_text`, `extract_links`                                                            |
| **截图**    | `take_screenshot`, `save_screenshot`                                                                                                  |
| **脚本执行**  | `evaluate_script`                                                                                                                     |
| **页面**    | `list_pages`, `active_page`, `close_page`, `new_hidden_page`                                                                          |
| **窗口**    | `window_list`, `window_create`, `window_close`, `window_activate`                                                                     |
| **书签**    | `bookmark_list`, `bookmark_create`, `bookmark_remove`, `bookmark_update`, `bookmark_move`, `bookmark_search`                          |
| **历史记录**  | `history_search`, `history_recent`, `history_delete`, `history_delete_range`                                                          |
| **标签页分组** | `group_list`, `group_create`, `group_update`, `group_ungroup`, `group_close`                                                          |
| **文件系统**  | `ls`, `read`, `write`, `edit`, `find`, `grep`, `bash`                                                                                 |
| **DOM**   | `dom`, `dom_search`                                                                                                                   |
| **控制台**   | `get_console_messages`                                                                                                                |
| **其他**    | `browseros_info`, `handle_dialog`, `wait_for`, `download`, `export_pdf`, `output_file`, `nudges`                                      |

## 智能体循环

智能体循环使用 [Vercel AI SDK](https://sdk.vercel.ai) 来编排多步骤浏览器自动化：

* **多提供商支持** —— OpenAI、Anthropic、Google、Azure、Bedrock、OpenRouter、Ollama、LM Studio，以及任何兼容 OpenAI 接口的服务

* **会话管理** —— 对话持久化保存在本地 SQLite 数据库中

* **上下文溢出处理** —— 当上下文窗口被填满时，自动进行消息压缩

* **MCP 客户端** —— BrowserOS 工具使用同一个本地回环 `/mcp` 运行时，同时也可以连接外部 MCP 服务器，以增加更多集成能力

* **服务端托管执行** —— 浏览器权限、输出授权、指标以及标签页存在状态相关的副作用，都由 `BrowserToolRuntime` 统一管理

### Provider Factory

Provider Factory（`src/agent/provider-factory.ts`）根据运行时配置创建 AI SDK Provider，并支持在无需重启的情况下热切换不同 Provider。

### 固定 vLLM 模型

设置下面三个 Server 环境变量后，`/chat` 将固定使用一个 vLLM
OpenAI-compatible 模型，并忽略客户端提交的 Provider、Base URL、API Key
和模型选择：

```env
BROWSEROS_VLLM_BASE_URL=http://127.0.0.1:8000/v1
BROWSEROS_VLLM_API_KEY=
BROWSEROS_VLLM_MODEL=your-served-model-name
```

`BROWSEROS_VLLM_BASE_URL` 必须包含 `/v1`。智能体通过 OpenAI-compatible
Chat Completions 调用模型；模型需要支持 vLLM 的 `/v1/chat/completions`，并在
智能体模式下支持工具调用。API Key 可留空（取决于 vLLM 启动参数）。只配置其中
一部分会直接报出缺少的配置，避免退回到客户端选择的 Provider。

## 目录结构

```text
apps/server/

├── src/

│   ├── index.ts                # 服务器入口

│   ├── main.ts                 # 服务器初始化

│   ├── api/                    # HTTP 路由处理器

│   ├── agent/                  # 智能体循环

│   │   ├── ai-sdk-agent.ts     # 智能体主要实现

│   │   ├── provider-factory.ts # LLM Provider 工厂

│   │   ├── session-store.ts    # 对话持久化

│   │   ├── compaction.ts       # 上下文窗口管理

│   │   └── mcp-builder.ts      # 内部与外部 MCP 客户端配置

│   ├── api/services/mcp/

│   │   └── browser-tool-runtime.ts # 浏览器工具租约、保护、执行和副作用管理

│   ├── browser/                # 浏览器连接层

│   ├── tools/                  # MCP 工具实现

│   │   ├── navigation.ts

│   │   ├── input.ts

│   │   ├── snapshot.ts

│   │   ├── filesystem/

│   │   └── ...

│   ├── lib/                    # 共享工具

│   └── rpc.ts                  # JSON-RPC 类型定义

├── tests/

│   ├── tools/                  # 工具级测试

│   └── server.integration.test.ts

└── package.json
```

## 开发

### 前置条件

* [Bun](https://bun.sh) 运行时

* 一个正在运行的 BrowserOS 实例（用于 CDP 连接）

### 配置

```bash
# 从当前应用目录创建共享的根目录开发环境变量文件
(cd ../.. && cp .env.development.example .env.development)

# 直接启动服务器（dev:watch 会自动生成该配置）
bun --env-file=../../.env.development src/index.ts --config ../../config.dev.json
```

完整的环境变量说明以及 `dev:watch` 配置，请参阅 [agent monorepo README](../../README.md)。

### 测试

```bash
bun run test:tools          # 工具级测试

bun run test:integration    # 完整集成测试（需要正在运行的 BrowserOS）
```

### 构建

```bash
# 构建跨平台服务器二进制文件
bun run build

# 针对指定目标平台构建
bun scripts/build/server.ts --target=darwin-arm64,linux-x64

# 构建所有目标，但不上传到 R2
bun scripts/build/server.ts --target=all --no-upload
```

## 发布流程

服务器发布版本使用带注释组件标签的 GitHub Releases。发布流程不会构建或上传服务器二进制文件；GitHub 会为对应标签提供源码 zip 和 tarball。

在 PR 中更新 `packages/browseros-agent/apps/server/package.json` 以及对应的 `bun.lock` 条目，合并后，为合并后的提交创建标签：

```bash
git tag -a agent-server/v0.0.123 -m "BrowserOS Server - v0.0.123"

git push origin agent-server/v0.0.123
```

工作流会校验标签与硬编码的软件包路径。如果被打标签提交中的软件包版本与标签版本不一致，标签推送将失败。

手动触发工作流时，可以在默认分支上设置软件包版本、更新对应的锁文件条目、创建带注释的标签，并发布 GitHub Release。

## Sidecar 配置

`--config <path>` 是服务器启动时唯一的配置输入。

该 JSON Sidecar 配置文件包含：

* `ports.server`
* `ports.cdp`
* `ports.proxy`
* `directories.resources`
* `directories.execution`
* 可选的 `instance.*` 元数据

开发环境、dogfood 环境以及由 Chromium 管理的启动流程，都会在启动二进制文件之前生成该配置文件。
>>>>>>> GensideAI/lsk
