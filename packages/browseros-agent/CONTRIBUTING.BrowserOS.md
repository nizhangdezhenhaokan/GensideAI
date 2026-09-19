# 为 BrowserOS 做贡献

这是 [BrowserOS](../../README.BrowserOS.md) 的智能体平台。BrowserOS 是一个内置 AI 智能体、可以由 AI Agent 驱动操作的浏览器。

如果你还没有阅读过项目根目录下的 [贡献指南](../../CONTRIBUTING.md)，请先从那里开始，然后再回来阅读本文。

如果你正在开发的是 BrowserOS neo，请查看：

[CONTRIBUTING.md](CONTRIBUTING.md)

## 你将要开发的内容

BrowserOS 由两个需要协同运行的部分组成。

| 项目                            | 说明                                   | 技术栈                                                                                                                                           |
| ----------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`apps/app`](apps/app/)       | 浏览器扩展。包含新标签页、侧边栏聊天、首次使用引导和设置页面       | WXT + React 浏览器扩展、GraphQL + codegen + graphqlsp、AI SDK React bindings、Radix、shadcn、PostHog                                                    |
| [`apps/server`](apps/server/) | 服务端。提供 MCP 工具接口，以及负责执行任务的 Agent Loop | Bun。使用 Hono + zod-validator，通过 Hono 提供 MCP 服务，Drizzle ORM + drizzle-kit，并通过 AI SDK 支持 Anthropic、OpenAI、Google、Bedrock、Azure、OpenRouter 等模型提供商 |

浏览器扩展通过 GraphQL 与 Server 通信。

GraphQL Schema 位于：

```text
apps/app/schema/schema.graphql
```

相关的强类型 GraphQL 文档是自动生成的，因此修改 Schema 之后，不要直接编辑生成文件，而应该执行：

```bash
bun run codegen:agent
```

## 环境要求

| 工具            | 用途                                   | 安装方式                                                     |
| ------------- | ------------------------------------ | -------------------------------------------------------- |
| **Bun**       | 包管理器和运行时，具体版本固定在 `package.json` 中    | `curl -fsSL https://bun.sh/install \| bash`              |
| **Go**        | 开发环境 Supervisor 是一个 Go 程序，每次运行都会重新编译 | `brew install go`                                        |
| **Lima**      | Dev Supervisor 强依赖 Lima，如果没有安装会拒绝启动  | `brew install lima`                                      |
| **BrowserOS** | Supervisor 会启动已经安装好的 BrowserOS 应用    | [下载](https://files.browseros.com/download/BrowserOS.dmg) |

这一条开发路径不需要 Rust。

Rust 只在 BrowserOS neo 后端开发时才需要。

目前完整的开发运行流程只支持 macOS。

Supervisor 通过硬编码的：

```text
/Applications/...
```

路径查找 BrowserOS 浏览器。

因此 Linux 和 Windows 开发者目前可以：

* 安装项目依赖；
* 执行代码检查；
* 执行测试。

但目前还不能通过这套开发流程启动 BrowserOS 或 BrowserOS neo。

## 初始化

执行：

```bash
cd packages/browseros-agent

bun install

cp .env.development.example .env.development
```

第一次运行时，`.env.development` 中的所有配置都是可选的。

这个文件主要保存：

* Analytics 分析统计 Key；
* Sentry DSN；
* 端口覆盖配置。

这些都不是让开发环境正常运行所必需的。

因此复制该文件后，可以直接继续后面的步骤。

也可以执行：

```bash
bun run dev:setup
```

这个命令会完成同样的依赖安装，但：

* 使用 frozen lockfile；
* 安装完成后运行 codegen。

CI 使用的就是这种方式。

## 启动

执行：

```bash
bun run dev:watch
```

这个命令会启动三个进程，并启动浏览器连接这些服务：

```text
apps/app       wxt                       浏览器扩展，支持热更新

apps/app       bun run dev:web           Web 预览

apps/server    bun --watch src/index.ts  Server，代码变化后自动重启
```

停止所有进程：

```bash
bun run dev:stop
```

## `:new` 与普通模式的区别

有两种启动方式，它们的差异比名字看起来更重要。

|         | `bun run dev:watch`                          | `bun run dev:watch:new`         |
| ------- | -------------------------------------------- | ------------------------------- |
| 端口      | 固定：CDP `9000`、Server `9100`、Extension `9300` | 在 `9000～9999` 范围内随机选择           |
| Profile | 使用持久化开发 Profile，会保留状态                        | 每次运行都会创建全新的临时目录                 |
| 启动行为    | **会杀掉占用这些端口的进程，以及正在使用该 Profile 的浏览器**        | 只处理它自己的 Server 端口，并在启动前清理       |
| 适用场景    | 希望登录状态和设置在重启后继续保留                            | 同时运行多个实例、测试首次启动行为，或不希望影响已经运行的实例 |

当你刚开始熟悉项目时，`:new` 是更安全的默认选择。

不过它也不是完全无干扰。

Server 会在启动前立即清理自己需要使用的端口。

因此，如果一个进程在端口选定之后、BrowserOS Server 启动之前抢占了该端口，它仍有可能被终止。

两种模式都会对 Browser Profile 加锁。

因此两个 Watch 进程无法同时管理同一个 Profile。

## 启动 BrowserOS neo Stack

以下两个命令是互斥的，不是叠加关系：

```text
dev:watch
```

和：

```text
dev:claw:watch
```

一次命令只运行一个产品。

如果需要开发 BrowserOS neo，请查看：

```text
CONTRIBUTING.md
```

## 提交 PR 之前

执行：

```bash
bun run check    # lint、typecheck 和 fallow

bun test         # TypeScript 测试
```

Lint 和代码格式化使用 Biome。

自动修复可以执行：

```bash
bun run lint:fix
```

如果修改了 GraphQL Schema，需要重新生成相关文件并提交：

```bash
bun run codegen:agent
```

## 常用辅助命令

| 命令                        | 作用                             |
| ------------------------- | ------------------------------ |
| `bun run start:server`    | 只启动 Server，不启动浏览器              |
| `bun run start:agent`     | 只启动浏览器扩展开发服务器                  |
| `bun run dev:app-onboard` | 单独启动首次使用 Onboarding 流程         |
| `bun run devtools`        | 启动连接 Server 的 AI SDK DevTools  |
| `bun run dev:reset`       | 删除开发 Profile 并以干净状态重新启动        |
| `bun run dev:cleanup`     | 停止开发进程并释放相关端口                  |
| `bun run dev:manual`      | 静态构建扩展，而不是使用热更新，适用于需要手动加载扩展的情况 |

## 项目目录结构

```text
apps/

  app/                     浏览器扩展

    entrypoints/           WXT 入口

    screens/               每个页面一个目录

    components/            公共 UI 组件

    modules/               跨模块基础设施

    hooks/                 全局 Hooks

    lib/                   工具函数

    schema/                GraphQL Schema


  server/

    src/

      agent/               Agent Loop

      api/                 HTTP 路由

      tools/               MCP 工具接口

      lib/                 Server 内部共享模块

    tests/


  app-onboard/             首次启动引导页面（Vite）


packages/                  TypeScript 共享包

tools/dev/                 Go 编写的开发环境 Supervisor
```

## 获取帮助

[Discord](https://discord.gg/YKwjt5vuKr)

[Slack](https://dub.sh/browserOS-slack)

[Discussions](https://github.com/browseros-ai/BrowserOS/discussions)

PR 规范、CLA，以及 BrowserOS 浏览器本体的构建说明，都位于项目根目录下的：

```text
CONTRIBUTING.md
```
