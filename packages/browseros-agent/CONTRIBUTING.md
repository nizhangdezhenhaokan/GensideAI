<<<<<<< HEAD
# 为 BrowserOS neo 做贡献

这是 [BrowserOS neo](../../README.md) 的智能体平台。BrowserOS neo 是一个可以由智能体直接驱动操作的浏览器。

如果你还没有阅读项目根目录下的 [贡献指南](../../CONTRIBUTING.md)，请先从那里开始，然后再回来阅读本文。

如果你开发的是另一个 BrowserOS 浏览器版本，请查看：

[CONTRIBUTING.BrowserOS.md](CONTRIBUTING.BrowserOS.md)

## 你将要开发的内容

BrowserOS neo 由两个需要协同运行的部分组成。

| 项目                                                | 说明                                                 | 技术栈                                                                                                           |
| ------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`apps/claw-app`](apps/claw-app/)                 | Cockpit 控制台。它是一个新标签页界面，用于查看 Agent 工作过程、回放会话以及管理连接  | WXT + React 浏览器扩展、Tailwind v4、base-ui 和 Radix primitives、shadcn（base-vega）、TanStack Query 和 Table、xyflow、Rive |
| [`apps/claw-server-rust`](apps/claw-server-rust/) | 后端。提供 Agent 连接使用的 MCP Endpoint，以及 Cockpit 所依赖的 API | Rust。HTTP 使用 axum，数据库 ORM 和迁移使用 sea-orm，MCP 使用 rmcp，命令行处理使用 clap，分析统计使用 posthog-rs                            |

`claw-server-rust` 基于 `crates/` 目录中的多个共享 Rust crate：

* `browseros-cdp`：Chrome DevTools Protocol（CDP）绑定；
* `browseros-core`：核心基础原语；
* `browseros-mcp`：MCP Server；
* `claw-api`：前后端网络通信类型；
* `harness-integrations`：托管式 AI Coding Harness 集成。

前后端的通信类型都会自动生成。

[`packages/claw-api`](packages/claw-api/) 保存 TypeScript DTO。

[`packages/claw-api-client`](packages/claw-api-client/) 保存基于契约类型生成的 HTTP Client。

这两个 TypeScript 包与 Rust 的 `claw-api` crate 都由同一套 API Contract 生成。

因此，不要手动修改自动生成的文件。

如果需要更新，应执行：

```bash
bun run codegen:claw-api
```

## 环境要求

| 工具                | 用途                                                          | 安装方式                                                              |
| ----------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| **Bun**           | 包管理器和运行时，具体版本固定在 `package.json` 中                           | `curl -fsSL https://bun.sh/install \| bash`                       |
| **Go**            | Dev Supervisor 是一个 Go 程序，每次运行时都会重新编译                        | `brew install go`                                                 |
| **Lima**          | Dev Supervisor 强依赖 Lima，未安装时会拒绝启动                           | `brew install lima`                                               |
| **Rust**          | `claw-server-rust` 使用 Cargo 编译和运行                           | `brew install rustup && rustup-init`                              |
| **BrowserOS neo** | Supervisor 会启动已经安装好的 BrowserOS neo 应用                       | [下载](https://cdn.browseros.com/download/BrowserOS_neo.dmg)        |
| **Docker**        | 只有修改 API Contract 时才需要。`codegen:claw-api` 会在固定版本的容器中运行代码生成器 | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |

目前完整的开发运行流程只支持 macOS。

Supervisor 通过硬编码的：

```text
/Applications/...
```

路径查找 BrowserOS neo 浏览器。

因此 Linux 和 Windows 开发者目前可以：

* 安装依赖；
* 执行检查；
* 执行测试。

但目前还无法通过这套开发流程启动 BrowserOS neo 或另一个 BrowserOS 产品。

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

这些都不是启动开发环境所必需的。

因此复制该文件后，可以直接继续后面的步骤。

也可以执行：

```bash
bun run dev:setup
```

这个命令会完成类似的依赖安装，但使用 frozen lockfile，并在安装完成后执行 codegen。

CI 使用的就是这种方式。

## 启动

执行：

```bash
bun run dev:claw:watch:new
```

这个命令会启动三个进程，并启动浏览器连接这些服务：

```text
apps/claw-app            wxt                         Cockpit，支持热更新

apps/claw-app            bun run dev:web             Web 预览

apps/claw-server-rust    cargo run -p claw-server-rust
```

另外还会启动文件监听器，监听：

```text
apps/claw-server-rust/src
apps/claw-server-rust/Cargo.toml
apps/claw-server-rust 的测试 fixtures
```

当这些文件发生变化时，Rust Server 会自动重新启动。

第一次执行 Cargo 构建会比较耗时。

之后会使用增量编译，因此速度会更快。

停止所有开发进程：

```bash
bun run dev:stop
```

## `:new` 与普通模式的区别

有两种启动方式，它们之间的区别比较重要。

|         | `bun run dev:claw:watch`                     | `bun run dev:claw:watch:new`     |
| ------- | -------------------------------------------- | -------------------------------- |
| 端口      | 固定：CDP `9000`、Server `9100`、Extension `9300` | 在 `9000～9999` 范围内随机选择            |
| Profile | 使用持久化开发 Profile，会保留状态                        | 每次运行都会创建新的临时目录                   |
| 启动行为    | **会杀掉占用这些端口的进程，以及已经使用该 Profile 的浏览器**        | 只处理自己的 Server 端口，并在启动前清理         |
| 推荐使用场景  | 希望登录状态和设置在重启后继续保留                            | 同时运行多个实例、测试首次启动行为，或者不希望影响正在运行的实例 |

当你刚开始熟悉项目时，推荐使用：

```bash
bun run dev:claw:watch:new
```

它更加安全。

不过它也不是完全不会影响其他进程。

Server 会在启动前立即清理它自己的端口。

因此，如果某个进程在端口被选中之后、Server 真正启动之前抢占了该端口，那么该进程仍可能被终止。

两种模式都会对 Profile 加锁。

因此两个 Watch 进程不能同时管理同一个 Profile。

## 启动 BrowserOS Stack

以下两个命令是互斥的，而不是叠加关系：

```text
dev:watch
```

和：

```text
dev:claw:watch
```

一次命令只运行一个产品。

如果需要开发另一个 BrowserOS 浏览器，请查看：

```text
CONTRIBUTING.BrowserOS.md
```

## 提交 PR 之前

执行：

```bash
bun run check        # lint、typecheck 和 fallow

bun test             # TypeScript 测试

bun run test:rust    # Rust Workspace 测试

bun run lint:rust    # clippy，warning 会被当作 error

bun run fmt:rust     # rustfmt 格式检查
```

Lint 和格式化使用 Biome。

可以执行：

```bash
bun run lint:fix
```

自动修复可以处理的问题。

如果修改了 API Contract，需要重新生成相关代码并提交：

```bash
bun run codegen:claw-api

bun run test:claw-api-contract
```

## 常用辅助命令

| 命令                         | 作用                                |
| -------------------------- | --------------------------------- |
| `bun run dev:claw-onboard` | 单独运行 Onboarding 首次引导流程            |
| `bun run dev:reset`        | 删除开发 Profile，并从干净环境重新启动           |
| `bun run dev:cleanup`      | 停止开发进程并释放相关端口                     |
| `bun run devtools`         | 启动连接 Server 的 AI SDK DevTools     |
| `bun run dev:manual`       | 静态构建浏览器扩展，而不是使用热更新，适用于需要手动加载扩展的情况 |

## 项目目录结构

```text
apps/

  claw-app/                 Cockpit 浏览器扩展

    entrypoints/            WXT 入口

    screens/                每个页面对应一个目录

    components/             公共 UI 组件

    modules/                跨模块基础设施

    lib/                    工具函数


  claw-server-rust/         Rust 后端

    src/

    tests/


  claw-onboard/             首次启动 Onboarding（Vite）


crates/                     共享 Rust crates

packages/                   共享 TypeScript packages

tools/dev/                  Go 编写的 Dev Supervisor
```

## 获取帮助

[Discord](https://discord.gg/YKwjt5vuKr)

[Slack](https://dub.sh/browserOS-slack)

[GitHub Discussions](https://github.com/browseros-ai/BrowserOS/discussions)

PR 规范、CLA，以及 BrowserOS 浏览器本体的构建流程，都位于项目根目录下的：

```text
CONTRIBUTING.md
```
=======
# 为 BrowserOS neo 做贡献

这是 [BrowserOS neo](../../README.md) 的智能体平台。BrowserOS neo 是一个可以由智能体直接驱动操作的浏览器。

如果你还没有阅读项目根目录下的 [贡献指南](../../CONTRIBUTING.md)，请先从那里开始，然后再回来阅读本文。

如果你开发的是另一个 BrowserOS 浏览器版本，请查看：

[CONTRIBUTING.BrowserOS.md](CONTRIBUTING.BrowserOS.md)

## 你将要开发的内容

BrowserOS neo 由两个需要协同运行的部分组成。

| 项目                                                | 说明                                                 | 技术栈                                                                                                           |
| ------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`apps/claw-app`](apps/claw-app/)                 | Cockpit 控制台。它是一个新标签页界面，用于查看 Agent 工作过程、回放会话以及管理连接  | WXT + React 浏览器扩展、Tailwind v4、base-ui 和 Radix primitives、shadcn（base-vega）、TanStack Query 和 Table、xyflow、Rive |
| [`apps/claw-server-rust`](apps/claw-server-rust/) | 后端。提供 Agent 连接使用的 MCP Endpoint，以及 Cockpit 所依赖的 API | Rust。HTTP 使用 axum，数据库 ORM 和迁移使用 sea-orm，MCP 使用 rmcp，命令行处理使用 clap，分析统计使用 posthog-rs                            |

`claw-server-rust` 基于 `crates/` 目录中的多个共享 Rust crate：

* `browseros-cdp`：Chrome DevTools Protocol（CDP）绑定；
* `browseros-core`：核心基础原语；
* `browseros-mcp`：MCP Server；
* `claw-api`：前后端网络通信类型；
* `harness-integrations`：托管式 AI Coding Harness 集成。

前后端的通信类型都会自动生成。

[`packages/claw-api`](packages/claw-api/) 保存 TypeScript DTO。

[`packages/claw-api-client`](packages/claw-api-client/) 保存基于契约类型生成的 HTTP Client。

这两个 TypeScript 包与 Rust 的 `claw-api` crate 都由同一套 API Contract 生成。

因此，不要手动修改自动生成的文件。

如果需要更新，应执行：

```bash
bun run codegen:claw-api
```

## 环境要求

| 工具                | 用途                                                          | 安装方式                                                              |
| ----------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| **Bun**           | 包管理器和运行时，具体版本固定在 `package.json` 中                           | `curl -fsSL https://bun.sh/install \| bash`                       |
| **Go**            | Dev Supervisor 是一个 Go 程序，每次运行时都会重新编译                        | `brew install go`                                                 |
| **Lima**          | Dev Supervisor 强依赖 Lima，未安装时会拒绝启动                           | `brew install lima`                                               |
| **Rust**          | `claw-server-rust` 使用 Cargo 编译和运行                           | `brew install rustup && rustup-init`                              |
| **BrowserOS neo** | Supervisor 会启动已经安装好的 BrowserOS neo 应用                       | [下载](https://cdn.browseros.com/download/BrowserOS_neo.dmg)        |
| **Docker**        | 只有修改 API Contract 时才需要。`codegen:claw-api` 会在固定版本的容器中运行代码生成器 | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |

目前完整的开发运行流程只支持 macOS。

Supervisor 通过硬编码的：

```text
/Applications/...
```

路径查找 BrowserOS neo 浏览器。

因此 Linux 和 Windows 开发者目前可以：

* 安装依赖；
* 执行检查；
* 执行测试。

但目前还无法通过这套开发流程启动 BrowserOS neo 或另一个 BrowserOS 产品。

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

这些都不是启动开发环境所必需的。

因此复制该文件后，可以直接继续后面的步骤。

也可以执行：

```bash
bun run dev:setup
```

这个命令会完成类似的依赖安装，但使用 frozen lockfile，并在安装完成后执行 codegen。

CI 使用的就是这种方式。

## 启动

执行：

```bash
bun run dev:claw:watch:new
```

这个命令会启动三个进程，并启动浏览器连接这些服务：

```text
apps/claw-app            wxt                         Cockpit，支持热更新

apps/claw-app            bun run dev:web             Web 预览

apps/claw-server-rust    cargo run -p claw-server-rust
```

另外还会启动文件监听器，监听：

```text
apps/claw-server-rust/src
apps/claw-server-rust/Cargo.toml
apps/claw-server-rust 的测试 fixtures
```

当这些文件发生变化时，Rust Server 会自动重新启动。

第一次执行 Cargo 构建会比较耗时。

之后会使用增量编译，因此速度会更快。

停止所有开发进程：

```bash
bun run dev:stop
```

## `:new` 与普通模式的区别

有两种启动方式，它们之间的区别比较重要。

|         | `bun run dev:claw:watch`                     | `bun run dev:claw:watch:new`     |
| ------- | -------------------------------------------- | -------------------------------- |
| 端口      | 固定：CDP `9000`、Server `9100`、Extension `9300` | 在 `9000～9999` 范围内随机选择            |
| Profile | 使用持久化开发 Profile，会保留状态                        | 每次运行都会创建新的临时目录                   |
| 启动行为    | **会杀掉占用这些端口的进程，以及已经使用该 Profile 的浏览器**        | 只处理自己的 Server 端口，并在启动前清理         |
| 推荐使用场景  | 希望登录状态和设置在重启后继续保留                            | 同时运行多个实例、测试首次启动行为，或者不希望影响正在运行的实例 |

当你刚开始熟悉项目时，推荐使用：

```bash
bun run dev:claw:watch:new
```

它更加安全。

不过它也不是完全不会影响其他进程。

Server 会在启动前立即清理它自己的端口。

因此，如果某个进程在端口被选中之后、Server 真正启动之前抢占了该端口，那么该进程仍可能被终止。

两种模式都会对 Profile 加锁。

因此两个 Watch 进程不能同时管理同一个 Profile。

## 启动 BrowserOS Stack

以下两个命令是互斥的，而不是叠加关系：

```text
dev:watch
```

和：

```text
dev:claw:watch
```

一次命令只运行一个产品。

如果需要开发另一个 BrowserOS 浏览器，请查看：

```text
CONTRIBUTING.BrowserOS.md
```

## 提交 PR 之前

执行：

```bash
bun run check        # lint、typecheck 和 fallow

bun test             # TypeScript 测试

bun run test:rust    # Rust Workspace 测试

bun run lint:rust    # clippy，warning 会被当作 error

bun run fmt:rust     # rustfmt 格式检查
```

Lint 和格式化使用 Biome。

可以执行：

```bash
bun run lint:fix
```

自动修复可以处理的问题。

如果修改了 API Contract，需要重新生成相关代码并提交：

```bash
bun run codegen:claw-api

bun run test:claw-api-contract
```

## 常用辅助命令

| 命令                         | 作用                                |
| -------------------------- | --------------------------------- |
| `bun run dev:claw-onboard` | 单独运行 Onboarding 首次引导流程            |
| `bun run dev:reset`        | 删除开发 Profile，并从干净环境重新启动           |
| `bun run dev:cleanup`      | 停止开发进程并释放相关端口                     |
| `bun run devtools`         | 启动连接 Server 的 AI SDK DevTools     |
| `bun run dev:manual`       | 静态构建浏览器扩展，而不是使用热更新，适用于需要手动加载扩展的情况 |

## 项目目录结构

```text
apps/

  claw-app/                 Cockpit 浏览器扩展

    entrypoints/            WXT 入口

    screens/                每个页面对应一个目录

    components/             公共 UI 组件

    modules/                跨模块基础设施

    lib/                    工具函数


  claw-server-rust/         Rust 后端

    src/

    tests/


  claw-onboard/             首次启动 Onboarding（Vite）


crates/                     共享 Rust crates

packages/                   共享 TypeScript packages

tools/dev/                  Go 编写的 Dev Supervisor
```

## 获取帮助

[Discord](https://discord.gg/YKwjt5vuKr)

[Slack](https://dub.sh/browserOS-slack)

[GitHub Discussions](https://github.com/browseros-ai/BrowserOS/discussions)

PR 规范、CLA，以及 BrowserOS 浏览器本体的构建流程，都位于项目根目录下的：

```text
CONTRIBUTING.md
```
>>>>>>> GensideAI/lsk
