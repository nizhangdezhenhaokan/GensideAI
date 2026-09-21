<<<<<<< HEAD
# BrowserOS Agent

The agent platform behind both browsers. [BrowserOS neo](../../README.md) is `claw-app` plus `claw-server-rust`, and [BrowserOS](../../README.BrowserOS.md) is `app` plus `server`.

## Start here instead

Setup, the dev loop, what each project is built with, and where the code lives are all in the contributing guides. This file does not repeat them.

- **[Contributing to BrowserOS neo](CONTRIBUTING.md)**
- **[Contributing to BrowserOS](CONTRIBUTING.BrowserOS.md)**
- **[Root contributing guide](../../CONTRIBUTING.md)** for the browser build, the CLA and PR conventions

What follows is reference material for people already set up: how environment configuration works, how servers are configured at startup, and how production artifacts are built.

## Environment configuration

Two root env files, both gitignored:

| File | Used by |
|---|---|
| `.env.development` | Local development, tests, app and server runs, codegen inputs |
| `.env.production` | Release builds and upload scripts |

Their tracked templates, `.env.development.example` and `.env.production.example`, are **generated** from [`@browseros/shared/env/registry`](packages/shared/src/env/registry.ts). Run `bun run env:examples` after changing the registry. CI drift-checks the generated output, so a registry change without a regenerated example fails the build.

Existing checkouts that still have old per-app env files can run `bun run env:migrate` to merge those values into the root files.

### Sections

| Section | File | Purpose |
|---|---|---|
| `dev-tools` | `.env.development` | Codegen and local tooling inputs such as `CDP_PROTOCOL_JSON` and `BROWSEROS_BINARY` |
| `app` | `.env.development` | Extension and local BrowserOS launch settings: dev ports, public Vite values, source-map upload, optional GraphQL schema path |
| `claw` | `.env.development` | BrowserOS neo overrides: API URL, user-data dir, CDP port, `BROWSERCLAW_DIR` |
| `server` | `.env.development`, `.env.production` | Server config URL, telemetry, Sentry, `NODE_ENV`, log level, local server test settings |
| `upload` | `.env.production` | Cloudflare R2 credentials and bucket for artifact uploads |

Production build and upload scripts read `.env.production` plus exported process env through `@browseros/shared/env/*`, and **exported process env wins**. A missing required value fails with an error naming the key, the section, and the file.

## Server sidecar config

Both servers read their startup configuration from a sidecar JSON file passed as `--config <path>`, rather than from flags or env. `tools/dev`, dogfood, and Chromium-managed launches all generate this file.

| Field | Description |
|---|---|
| `ports.server` | HTTP server port: MCP endpoints, chat, health |
| `ports.cdp` | Chromium CDP port, which the server connects to as a client |
| `ports.proxy` | Browser proxy port emitted by Chromium |
| `directories.resources` | Packaged resources root |
| `directories.execution` | Runtime execution, log and config directory |
| `instance.*` | Optional browser and client metadata |

Default local ports are `9100` for the server, `9000` for CDP, and `9300` for the extension. The dev supervisor may pick others; see the contributing guides.

## Typecheck: a gotcha worth knowing

`bun run typecheck` uses the native TypeScript 7 compiler, the Go-native build. Unlike an editor's bundled classic TypeScript, it does **not** implicitly include every `@types/*` package it finds. Each tsconfig has to list its ambient type packages in `compilerOptions.types`; the root defaults to `["node", "bun"]`.

A new package that omits this looks green in your editor and then fails CI with `Cannot find name 'Bun'` or `Cannot find name 'process'`. Add the names to that package's `types` array. For editor parity, install your editor's native TypeScript 7 support.

## Production artifacts

```bash
bun run build                 # server and agent
bun run build:server          # server resource artifacts for every target, uploads zips to R2
bun run build:claw-server     # five-platform BrowserOS neo Rust resources, uploads zips to R2
bun run build:agent           # the extension
```

`build:server` emits under `dist/prod/server/<target>/`, with zips at `dist/prod/server/`. The underlying script takes options directly:

```bash
bun scripts/build/server.ts --target=all
bun scripts/build/server.ts --target=darwin-arm64,linux-x64
bun scripts/build/server.ts --target=all --manifest=scripts/build/config/server-prod-resources.json
bun scripts/build/server.ts --target=all --no-upload
```

### BrowserOS neo Rust artifacts

The Rust builder runs on macOS and produces the same five resource zips as `release-claw-server.yml`: macOS ARM64 and x64, Linux ARM64 and x64, and Windows x64. Darwin targets use Cargo and Xcode, Linux targets use Zig with a glibc 2.17 floor, and Windows uses the MSVC ABI through `cargo-xwin`.

One-time host toolchain:

```bash
xcrun --find clang || xcode-select --install
brew install rustup zig llvm cmake nasm
rustup-init
export PATH="$(brew --prefix llvm)/bin:$PATH"

cargo install --locked cargo-zigbuild --version 0.23.0
cargo install --locked cargo-xwin --version 0.23.0
rustup target add \
  aarch64-apple-darwin \
  x86_64-apple-darwin \
  aarch64-unknown-linux-gnu \
  x86_64-unknown-linux-gnu \
  x86_64-pc-windows-msvc
```

The build preflights every selected target before compiling and repeats the install command for anything missing. `cargo-xwin` downloads and caches the Microsoft CRT and Windows SDK on its first run.

**Uploads are the default.** Without `--ci` or `--no-upload`, a build pushes its zips to R2. Pass one of them for a local build.

```bash
bun scripts/build/claw-server-rust.ts --target=all --ci        # all five, no R2 credentials needed
bun scripts/build/claw-server-rust.ts --target=darwin-arm64 --no-upload    # one target, local only
```

## Focused test groups

The full suites are `bun test` and `bun run test:main`. When you want a narrower loop:

```bash
cd apps/server
bun run test:tools         # the MCP tool surface
bun run test:cdp           # CDP and browser control
bun run test:integration   # end to end
```

## License

AGPL-3.0, same as the rest of the repo. See [LICENSE](../../LICENSE).
=======
# BrowserOS Agent

这是支撑两个浏览器项目的智能体平台。[BrowserOS neo](../../README.md) 由 `claw-app` 和 `claw-server-rust` 组成，而 [BrowserOS](../../README.BrowserOS.md) 由 `app` 和 `server` 组成。

## 建议从这里开始

项目配置、开发循环、各项目采用的技术栈，以及代码所在位置，都已经写在贡献指南中。本文档不会重复这些内容。

* **[为 BrowserOS neo 做贡献](CONTRIBUTING.md)**

* **[为 BrowserOS 做贡献](CONTRIBUTING.BrowserOS.md)**

* **[根目录贡献指南](../../CONTRIBUTING.md)**：包含浏览器构建、CLA 和 PR 规范

下面的内容主要作为已经完成环境配置的开发者参考：介绍环境配置如何工作、服务器启动时如何配置，以及生产环境产物如何构建。

## 环境配置

根目录包含两个环境变量文件，这两个文件都被 Git 忽略：

| 文件                 | 用途                      |
| ------------------ | ----------------------- |
| `.env.development` | 本地开发、测试、应用和服务器运行、代码生成输入 |
| `.env.production`  | 发布构建和上传脚本               |

它们对应的受版本控制模板 `.env.development.example` 和 `.env.production.example`，由 [`@browseros/shared/env/registry`](packages/shared/src/env/registry.ts) **自动生成**。

修改 registry 后，需要运行：

```bash
bun run env:examples
```

CI 会检查生成结果是否存在偏差，因此如果修改了 registry，却没有重新生成 example 文件，构建将失败。

对于仍然保留旧版“每个应用一个环境变量文件”的已有代码仓库，可以执行：

```bash
bun run env:migrate
```

将这些旧配置值合并到根目录环境变量文件中。

### 配置区段

| 区段          | 文件                                    | 用途                                                                       |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `dev-tools` | `.env.development`                    | 代码生成和本地开发工具输入，例如 `CDP_PROTOCOL_JSON` 和 `BROWSEROS_BINARY`                |
| `app`       | `.env.development`                    | 扩展和本地 BrowserOS 启动配置：开发端口、公开的 Vite 配置、Source Map 上传、可选 GraphQL Schema 路径 |
| `claw`      | `.env.development`                    | BrowserOS neo 覆盖配置：API URL、用户数据目录、CDP 端口、`BROWSERCLAW_DIR`               |
| `server`    | `.env.development`, `.env.production` | Server 配置 URL、遥测、Sentry、`NODE_ENV`、日志级别、本地 Server 测试配置                   |
| `upload`    | `.env.production`                     | 用于上传构建产物的 Cloudflare R2 凭证和存储桶                                           |

生产环境构建和上传脚本通过 `@browseros/shared/env/*` 读取 `.env.production` 以及进程中显式导出的环境变量，并且 **进程中导出的环境变量优先级更高**。

如果缺少某个必需配置项，程序会直接报错，并指出：

* 缺失的配置 key
* 所属 section
* 对应的配置文件

## Server Sidecar 配置

两个 Server 都通过：

```bash
--config <path>
```

指定的 Sidecar JSON 文件读取启动配置，而不是通过命令行 flags 或环境变量读取。

以下启动方式都会自动生成这个配置文件：

* `tools/dev`
* dogfood
* Chromium 管理的启动流程

| 字段                      | 说明                                 |
| ----------------------- | ---------------------------------- |
| `ports.server`          | HTTP Server 端口：用于 MCP 接口、聊天接口和健康检查 |
| `ports.cdp`             | Chromium CDP 端口，Server 会作为客户端连接该端口 |
| `ports.proxy`           | Chromium 提供的浏览器代理端口                |
| `directories.resources` | 打包资源的根目录                           |
| `directories.execution` | 运行时执行、日志和配置目录                      |
| `instance.*`            | 可选的浏览器和客户端元数据                      |

本地默认端口为：

```text
Server：9100
CDP：9000
Extension：9300
```

开发环境的 supervisor 可能会选择其他端口，具体参见贡献指南。

## Typecheck：一个值得注意的问题

```bash
bun run typecheck
```

使用原生 TypeScript 7 编译器，即基于 Go 实现的原生版本。

与编辑器内置的经典 TypeScript 编译器不同，它**不会自动加载所有发现的 `@types/*` 包**。

每个 `tsconfig` 都需要在：

```json
compilerOptions.types
```

中显式声明需要使用的环境类型包。

根目录默认配置为：

```json
["node", "bun"]
```

如果新建的 package 忘记配置这些类型，在编辑器里可能看起来完全正常，但是 CI 中会报错，例如：

```text
Cannot find name 'Bun'
```

或者：

```text
Cannot find name 'process'
```

解决方法是，把对应的类型包名称添加到该 package 的 `types` 数组中。

为了保证编辑器行为与 CI 一致，也建议安装编辑器对应的原生 TypeScript 7 支持。

## 生产环境构建产物

```bash
bun run build                 # 构建 server 和 agent

bun run build:server          # 为所有目标平台构建 server 资源，并将 zip 上传到 R2

bun run build:claw-server     # 为五个平台构建 BrowserOS neo Rust 资源，并上传 zip 到 R2

bun run build:agent           # 构建扩展
```

`build:server` 的输出目录为：

```text
dist/prod/server/<target>/
```

生成的 zip 文件位于：

```text
dist/prod/server/
```

底层构建脚本也可以直接传入参数：

```bash
bun scripts/build/server.ts --target=all

bun scripts/build/server.ts --target=darwin-arm64,linux-x64

bun scripts/build/server.ts --target=all --manifest=scripts/build/config/server-prod-resources.json

bun scripts/build/server.ts --target=all --no-upload
```

### BrowserOS neo Rust 构建产物

Rust 构建器运行在 macOS 上，并生成与 `release-claw-server.yml` 相同的五个平台资源 zip：

```text
macOS ARM64
macOS x64
Linux ARM64
Linux x64
Windows x64
```

不同平台使用的构建方式如下：

* Darwin 目标使用 Cargo 和 Xcode
* Linux 目标使用 Zig，并要求最低 glibc 2.17
* Windows 使用 MSVC ABI，并通过 `cargo-xwin` 构建

主机构建工具链只需要安装一次：

```bash
xcrun --find clang || xcode-select --install

brew install rustup zig llvm cmake nasm

rustup-init

export PATH="$(brew --prefix llvm)/bin:$PATH"

cargo install --locked cargo-zigbuild --version 0.23.0

cargo install --locked cargo-xwin --version 0.23.0

rustup target add \
  aarch64-apple-darwin \
  x86_64-apple-darwin \
  aarch64-unknown-linux-gnu \
  x86_64-unknown-linux-gnu \
  x86_64-pc-windows-msvc
```

构建脚本会在真正开始编译之前，对每个选中的 target 执行预检查。

如果发现缺失的工具或 target，会重新显示对应的安装命令。

`cargo-xwin` 在第一次运行时，会下载并缓存：

* Microsoft CRT
* Windows SDK

**默认情况下会上传构建产物。**

如果没有传入：

```text
--ci
```

或者：

```text
--no-upload
```

构建完成后会自动将 zip 上传到 R2。

如果只需要进行本地构建，应传入其中一个参数。

例如：

```bash
bun scripts/build/claw-server-rust.ts --target=all --ci
# 构建全部五个平台，不需要 R2 凭证

bun scripts/build/claw-server-rust.ts --target=darwin-arm64 --no-upload
# 只构建一个目标平台，仅保存在本地
```

## 定向测试组

完整测试套件为：

```bash
bun test
```

以及：

```bash
bun run test:main
```

如果只想执行范围更小的测试，可以：

```bash
cd apps/server

bun run test:tools         # MCP 工具接口测试

bun run test:cdp           # CDP 与浏览器控制测试

bun run test:integration   # 端到端测试
```

## 许可证

采用 AGPL-3.0，与仓库中的其他项目保持一致。

详情请查看 [LICENSE](../../LICENSE)。
>>>>>>> GensideAI/lsk
