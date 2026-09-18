# bos_build

BrowserOS 和 BrowserClaw 的构建与发布系统。一个 Python CLI（`browseros`）可以把一份 Chromium checkout 转换成经过签名、打包的浏览器，然后将其发布。

所有命令都应从 `packages/browseros` 目录运行：

```bash
cd packages/browseros
uv sync                 # 只需执行一次
cp .env.example .env    # 只需执行一次，然后按需填写配置
uv run browseros --help
```

下面所有 `browseros …` 命令，实际都等价于 `uv run browseros …`。如果你已经激活了虚拟环境，就可以省略这个前缀。

## 请先阅读这里

**`browseros build` 只负责构建二进制文件，它不会发布产品。**

一次本地构建只会生成一个浏览器、一个产品、一个平台、一个架构。一次**发布（release）**则是通过 GitHub Workflow Dispatch 触发：它会为所有平台进行构建、上传到 R2、暂存更新源，并创建一个 GitHub Release 草稿。最后再由人工将其正式上线。

| 我想要…… | 应该执行 |
| --- | --- |
| 在本机进行构建 | `browseros build --preset debug` |
| 精确查看构建会执行哪些步骤 | `browseros build --preset release --show-plan` |
| 发布 BrowserOS 或 BrowserClaw | `gh workflow run release-browseros.yml` |
| 将已暂存的发布正式上线 | `browseros release publish`，然后执行 `browseros release appcast --publish` |
| 将扩展 CRX 发布到 alpha 渠道 | `gh workflow run release-extensions.yml` |
| 预览或推广扩展更新源 | `gh workflow run release-extension-feeds.yml` |
| 修复受跟踪的浏览器/服务器 appcast | `gh workflow run repair-update-feed.yml` |
| 获取今天已签名的 macOS 构建 | 下载 `nightly-browseros` / `nightly-browserclaw` 预发布版本 |
| 检查补丁栈 | `browseros dev doctor` |

## 思维模型

一次构建是“组合出来的”，而不是单纯“配置出来的”：

```text
preset + product + platform + arch + switches  ->  按顺序排列的步骤列表
```

- **preset** —— `release` 或 `debug`。它决定整个流水线的基本形态。
- **product** —— `browseros` 或 `browserclaw`。每个产品各有一个文件：`products/<id>/product.py`。
- **platform** —— 根据当前宿主机确定：macOS、Windows 或 Linux。
- **arch** —— `arm64`、`x64` 或 `universal`（仅 macOS；会展开为三次顺序执行的构建）。
- **switches** —— 一组扁平化选项，例如 `clean`、`provision`、`resource_mode`、`sign` 和 `upload`。优先级为：CLI > profile > preset 默认值。

构建组合逻辑集中在 `core/planner.py` 中的纯函数 `plan()`。除此之外，没有其他地方决定步骤执行顺序。各步骤通过 `@step(...)` 自注册，并声明自己所需的环境变量，因此缺少密钥时会在预检阶段失败，而不是编译了三个小时后才失败。

有两个选项经常被混淆：

- `--provision` 控制的是 **Chromium checkout**（`none`、`full`、`shallow`）。
- `--resource-mode published` 会从 R2/CDN 下载已经发布的组件资源；`--resource-mode source` 则会从当前 checkout 中构建选定的扩展、onboarding 和原生服务器。二者都不会控制 Chromium 的准备方式。

### 目录结构

整个系统由三套工具组成：BUILD（基于 `core/` 引擎的 `steps/`）、RELEASE（`release/`）和 DEV（`patchkit/`）；它们共同使用基础设施代码（`lib/`）和产品数据（`products/`）：

```text
bos_build/
  browseros.py  入口 —— `browseros` Typer 应用（也可使用 `python -m bos_build`）
  cli/          轻量 Typer 包装层（build、source、product、dev、release、ext、ota）
  core/         引擎：context、step registry、planner、runner、pipeline、
                resolver、events、product descriptor model —— 不包含领域知识
  lib/          基础设施：env、utils、logger、paths、notify、sparkle、versions、r2
  products/     每个产品一个包：define() 调用 + server bundles
  steps/        BUILD —— 通过 @step 注册的流水线步骤（source、setup、
                resources、patches、extensions、compile、sign、package、storage）
  release/      RELEASE —— list、publish、download、github、appcast；
                release/extensions/ 打包 CRX，release/feeds/ 发布更新源，
                release/ota/ 发布服务器 OTA 更新
  patchkit/     DEV —— 非交互式补丁接口：extract、batch-apply、
                .features.yaml IO、只读补丁栈 doctor
  profiles/     保存的开关集合（扁平 YAML）
  config/       数据：GN flags、resource YAML、appcast 模板、build offset
  docs/         下文链接的更深入运维文档
```

## 本地构建

始终建议先查看构建计划。查看计划并不需要准备 Chromium checkout：

```bash
browseros build --preset release --show-plan
```

它会打印组合后的构建步骤，以及每个步骤所需的环境变量，并标记这些变量是已设置还是缺失。

```bash
# 快速迭代
browseros build --preset debug --chromium-src ~/chromium/src

# 本地已签名的 release 构建，macOS arm64
browseros build --preset release --product browserclaw --arch arm64

# 从源码构建组件的集成流程，不签名、不上传
browseros build --preset release --product browseros --arch arm64 \
  --resource-mode source --source-sha "$(git rev-parse HEAD)" \
  --no-sign --no-upload --chromium-src ~/chromium/src

# 使用已经存在的 Chromium checkout 执行 release 形态的 Windows 构建
# （这里写成一行，因为 Windows 路径和 shell 续行都会使用反斜杠）
browseros build --preset release --provision none --clean --product browserclaw --arch x64 --sign --upload --chromium-src C:\src\chromium-3\src

# 失败后从指定步骤继续，而不重新编译
browseros build --preset release --from sign_macos

# 从组合后的构建计划中跳过指定步骤
browseros build --preset release --skip upload,series_patches
```

Profiles 是保存在 `profiles/` 中的一组开关配置：

| Profile | 使用位置 | 设置内容 |
| --- | --- | --- |
| `release-ci` | `build-browseros.yml`，可复用的 Linux/Windows 构建通道 | `preset: release`、`clean: false`、`provision: none` —— Workflow 自己负责准备并缓存 Chromium |
| `nightly-ci` | 未签名的云端 nightly 构建 | 与上面相同，并额外设置 `sign: false`、`upload: false` |
| `nightly-macos` | 两个产品的签名 family nightly | `preset: release`、`resource_mode: published` |

`release-macos.yml` 会在自托管 Mac 的持久化 checkout 上运行 `--preset release`，并从调用方接收 source 或 published 模式。

关于更深入的参数语义——例如 `--skip`、`--from`、`--gn-arg` 的优先级、`modules:` profiles、临时 runner——请参阅 [`docs/build-cli.md`](docs/build-cli.md)。

## 发布浏览器

完整发布只能通过 dispatch 触发，而且构建矩阵是固定的：Linux x64、已签名的 Windows x64，以及已签名的 macOS arm64、x64 和 universal。

从默认分支触发：

```bash
gh workflow run release-browseros.yml --ref main
gh workflow run release-browserclaw.yml --ref main
```

这里没有平台、组件、扩展渠道或签名相关的输入参数。Workflow 会固定触发时的 SHA，按照严格顺序将产品服务器和扩展发布到 alpha，并把它们精确的输出版本传递给每一个原生浏览器构建通道。已经提交的 onboarding 版本也会被固定，因此排队中的构建不会漂移到之后发布的组件版本。

### CI 会做什么，以及会在哪里停止

一次完整运行会先发布：

- 产品服务器 release；
- 最新资源别名；
- alpha 服务器 OTA；
- 产品扩展 CRX；
- alpha/bundled 扩展更新源；

然后才会为完整的原生平台矩阵构建浏览器产物。

浏览器 release 本身仍然保持在“暂存”状态：

- 浏览器交付物和元数据会上传到 R2。
- GitHub Release 保持为草稿。
- 生产环境浏览器 appcast 不会被修改。

是否将浏览器正式推广到生产环境，需要人工决定。

## 将发布版本正式上线

先检查，再推广。除非传入 `--publish`，否则所有 feed 命令默认都是 dry run。

真正发布时，会先把当前线上 feed 备份到 `feeds-history/`，并拒绝版本降级（可以通过 `--allow-downgrade` 覆盖）。

```bash
cd packages/browseros

# 1. 查看 CI 暂存了什么
browseros release list --version <version> --product browseros
browseros release feeds status

# 2. 将带版本号的 R2 对象复制到 live download/ 别名
browseros release publish --version <version> --product browseros

# 3. 先查看 appcast 差异，再正式发布
browseros release appcast --version <version> --product browseros
browseros release appcast --version <version> --product browseros --publish
```

如果是另一个产品，把参数改为 `--product browserclaw`。

如果需要手动重新创建 GitHub Release 草稿，可以执行：

```bash
browseros release github create --version <version> --draft --product <id>
```

服务器 OTA 的发布与完整浏览器 release 相互独立。单独的服务器 Workflow 只会发布 alpha appcast；生产环境仍需要显式执行：

```bash
browseros ota server promote --product <id> --publish
```

关于各构建通道的详细情况、所需 secrets、runner 成本以及故障排查，请参阅 [`docs/release-ci.md`](docs/release-ci.md)。

## 发布扩展

共有四个扩展会以签名后的 CRX 形式发布：

- `agent`
- `controller`
- `bugreporter`
- `browserclaw`

其中 `agent` 和 `browserclaw` 从当前仓库构建；另外两个会从外部仓库克隆。四个扩展都有独立于浏览器的版本号。

独立 Workflow 负责默认的 alpha 生命周期。对于仓库内的 `agent` 和 `browserclaw` 扩展，如果没有提供 `version`，它会：

1. 分配下一个版本号；
2. 构建并验证不可变 CRX；
3. 发布 GitHub Release；
4. 通过一个短生命周期 Pull Request 合并一致的、受跟踪的 alpha 快照；
5. 将这些完全一致的 feed 文件上传到 R2。

外部的 `controller` 和 `bugreporter` 发布时必须显式指定版本号，因为它们的源码 commit 并不是这个 monorepo 的 release SHA。

```bash
gh workflow run release-extensions.yml \
  -f extension=browserclaw

gh workflow run release-extensions.yml \
  -f version=0.1.10.0 \
  -f extension=browserclaw
```

受跟踪的 commit 会同时更新：

- `update-manifest.alpha.xml`
- `extensions.alpha.json`
- `bundled-manifest.xml`

`controller` 仍然会发布 CRX，但不会有 alpha 条目，因为它没有注册到客户端更新 feed 中。

如果选择 `all`，则必须显式提供一个由四个扩展共同使用的版本号。

如果构建被延迟，它的草稿会保持私有；之后执行 `finalize` dispatch 时才会完成 alpha 更新。

如果要预览、修复或明确推广到生产环境，请使用 feed Workflow：

```bash
gh workflow run release-extension-feeds.yml \
  -f channel=prod \
  -f pins=browserclaw=0.1.10.0

gh workflow run release-extension-feeds.yml \
  -f channel=prod \
  -f pins=browserclaw=0.1.10.0 \
  -f publish=true
```

`pins` 是可选的；未设置的扩展版本会沿用当前线上 manifests 中的值。

family nightly 会一次性生成仓库内两个扩展的 pin，并且只有在一次受跟踪状态的 squash merge 完成后才发布它们；独立扩展 Workflow 仍然是单独的自动 alpha 入口。

当 `publish=true` 时，feed Workflow 会先把每个 channel 精确生成的快照合并到默认分支，然后再把完全相同的文件上传到 R2。

因此，如果快照合并失败，该 channel 的线上 feed 不会受到影响。

对于 `channel=both`，alpha 会先于 production 完成，因此 production 能看到 alpha 中更新后的 bundled 版本。如果 production 随后失败，alpha 仍会保持已经提交并发布的状态；重新运行 Workflow 即可继续 production。

如果要通过同样的校验、备份和降级保护机制，重新发布一个受跟踪的浏览器或服务器 appcast：

```bash
gh workflow run repair-update-feed.yml \
  -f feed=appcast-server.xml \
  -f repair_invalid_live=true \
  -f publish=true
```

如果不勾选 `publish`，则会执行一次完整 dry-run diff。

只有当线上对象格式损坏或携带了错误的 channel 元数据时，才应启用 `repair_invalid_live`；即使走修复流程，仍然会拒绝可恢复的版本降级。

在本地有两个相关命令，它们的区别很重要：

```bash
# 只构建、打包、签名并上传 CRX
browseros ext release --version 0.0.118 --name agent

# 只处理 feeds，不构建 CRX
# 显式固定版本；未设置的扩展继续沿用线上版本
browseros release extensions --channel alpha --set agent=0.0.118
browseros release extensions --channel alpha --set browserclaw=0.1.4 --publish
```

`release extensions` 会同时重新生成：

- update manifest；
- `extensions.json`；
- bundled manifest；

因此它们不会彼此漂移。

本地 `--publish` 只是用于紧急情况的逃生通道，而且不会通过 Git 持久化 `updates/`；正常发布请使用 feed Workflow。

## 服务器与 nightly 构建

服务器和 onboarding bundle 都有独立于浏览器的版本号，而且各自由自己的 package 文件决定：

| Bundle | 版本来源 | Workflow | Tag |
| --- | --- | --- | --- |
| BrowserOS agent server | `packages/browseros-agent/apps/server/package.json` | `release-server.yml` | `agent-server/v*` |
| BrowserClaw server | `.../apps/claw-server-rust/Cargo.toml` | `release-claw-server.yml` | `claw-server-rust/v*` |
| BrowserOS onboarding | `.../apps/app-onboard/package.json` | `release-app-onboard.yml` | `app-onboard/v*` |
| BrowserClaw onboarding | `.../apps/claw-onboard/package.json` | `release-claw-onboard.yml` | `claw-onboard/v*` |

BrowserClaw 浏览器构建和服务器 OTA 都会使用发布在历史 key `claw-server-rust/prod-resources` 下的服务器 bundle。

为了兼容浏览器，打包时会统一把二进制名称规范为 `browseros-claw-server`。

有一个只能通过 dispatch 触发的 family Workflow，会在自托管 Mac 上同时构建两个已签名的 macOS nightly，并发布滚动更新的：

- `nightly-browseros`
- `nightly-browserclaw`

预发布版本。

它会固定一个源码 SHA，在草稿 transaction PR 中预留一个两个产品共享的浏览器版本，准备精确的私有组件资源，并在公开组件最终定版之前完成两个产品的构建。

随后，五个受跟踪的服务器/扩展快照会通过一次精确 HEAD 的 squash commit 进入 `main`。

参阅 [`docs/nightly-macos-ci.md`](docs/nightly-macos-ci.md)。

## 补丁与产品

```bash
browseros dev doctor                            # 检查 .features.yaml <-> 磁盘上的 patches
browseros dev doctor --against ~/chromium/src  # 按 feature 检查哪些补丁失败
browseros dev doctor --feature llm-chat --json # 筛选结果 / 机器可读输出

browseros product list                          # 已注册的产品
browseros product doctor                        # 检查产品标识唯一性 + 品牌资源
```

`dev doctor` 是只读命令，因此它可以在 CI 中运行，也适合在升级 Chromium 版本之前执行。

`--against` 只会以 dry-run 方式执行：

```bash
git apply --check
```

因此 Chromium 源码树不会被修改。

这个 dry run 比真正构建时的补丁应用步骤更严格，因为构建步骤在失败时还会回退到：

```text
--ignore-whitespace
--3way
```

所以 doctor 检查失败代表“需要关注”，并不一定意味着“无法构建”。

退出码：

- `0`：健康，无问题；
- `1`：发现问题；
- `2`：用法错误或环境错误。

交互式补丁操作——如 `apply`、`extract`，以及把补丁存储重新 pin 到新的 Chromium base——位于 Rust 工具 `bpatch` 中：

[`tools/bpatch/README.md`](../tools/bpatch/README.md)

`patchkit/` 则保留构建步骤依赖的非交互式 Python 接口。

## 真正的配置来源在哪里

| 内容 | 来源 |
| --- | --- |
| 浏览器版本 | `packages/browseros/resources/BROWSEROS_VERSION` |
| Chromium 固定版本 | `packages/browseros/CHROMIUM_VERSION`、`BASE_COMMIT` |
| 流水线结构 | `bos_build/core/planner.py` |
| 构建步骤及其所需环境变量 | `bos_build/steps/`，也会由 `--show-plan` 打印 |
| 产品标识 | `bos_build/products/<id>/product.py` |
| 补丁栈映射 | `packages/browseros/chromium_patches/.features.yaml` |
| 哪些源码资源会被发布 | `products/resource_sources.py`、`release/server_resources.py`、`config/copy_resources.yaml` |
| 已发布资源兼容性 | `config/download_resources.yaml` |
| family release transaction 的标识和状态 | `release/suite.py` |
| 本地 secrets | `packages/browseros/.env`（从 `.env.example` 复制） |
| 仓库 secrets | 由 `tools/release_secrets/sync.py` 同步 |

## 更深入的文档

| 文档 | 什么时候阅读 |
| --- | --- |
| [`docs/build-cli.md`](docs/build-cli.md) | 需要了解 `--skip` / `--from` / `--gn-arg` 优先级、`modules:` profiles 或临时 runner 配置时 |
| [`docs/release-ci.md`](docs/release-ci.md) | 正在执行 release，需要查看构建通道图、secrets 矩阵和推广命令时 |
| [`docs/warpbuild-ci.md`](docs/warpbuild-ci.md) | Linux 或 Windows 云端构建速度慢、卡住或成本过高时 |
| [`docs/nightly-macos-ci.md`](docs/nightly-macos-ci.md) | 调试已签名 nightly 或配置 Mac 构建机时 |
| [`docs/windows-install-verification.md`](docs/windows-install-verification.md) | 发布前需要手动验证 Windows 安装程序时 |

团队内部资料位于 `.internal-docs/` 子模块中（私有；构建 BrowserOS 并不需要其中任何内容）：

- `setup/release-browser.md` —— 单次浏览器 release 的运维手册，包括回滚流程；
- `setup/release-server.md` —— 发布 server、claw-server 和 onboard bundles；
- `setup/nightlies.md` —— 两个 mac nightly 以及背后的构建机器；
- `architecture/release-workflows.md` —— 各个 Workflow 之间的关系。该文档比 `docs/release-ci.md` 更旧；如果两者有冲突，以 Workflow 文件本身为准。

## 测试

```bash
uv run python -m unittest discover -s bos_build -t . -p "*_test.py"
uv run ruff check bos_build
```
