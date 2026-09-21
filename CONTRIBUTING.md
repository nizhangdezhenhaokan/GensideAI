<<<<<<< HEAD
# 为 BrowserOS neo 和 BrowserOS 做贡献

感谢你来到这里。无论你是想修复 Bug、开发新功能、改进文档，还是只是想看看项目，我们都非常欢迎你。

这两个浏览器都来自同一个代码仓库，并且有四个主要的开发方向。请选择与你想要修改的内容最匹配的方向。

## 选择你的开发方向

| 方向                                                                  | 你将负责的内容                            | 技术栈                   | 环境搭建成本             |
| ------------------------------------------------------------------- | ---------------------------------- | --------------------- | ------------------ |
| **[BrowserOS neo](packages/browseros-agent/CONTRIBUTING.md)**       | Cockpit 新标签页、Agent 连接的 MCP 接口、会话回放 | TypeScript、React、Rust | 约 15 分钟            |
| **[BrowserOS](packages/browseros-agent/CONTRIBUTING.BrowserOS.md)** | 侧边栏聊天、Agent 执行循环、定时任务、设置           | TypeScript、React、Bun  | 约 15 分钟            |
| **CLI**                                                             | 从终端或编程 Agent 中控制 BrowserOS         | Go                    | 约 5 分钟             |
| **Browser**                                                         | Chromium 补丁、构建系统、平台功能              | C++、Python            | 约 100GB 磁盘空间，耗时数小时 |

大多数贡献者会从 BrowserOS neo 或 BrowserOS 开始。

这两个项目都位于 `packages/browseros-agent` 中，并共享同一套工具链，因此只要完成其中一个项目的开发环境搭建，另一个项目的大部分环境也就已经准备好了。

## 开始之前

**请使用 Bun。**

Bun 是 Agent monorepo 唯一受支持的包管理器和运行时。

`packages/browseros-agent/package.json` 中固定了 Bun 的版本，同时将所有其他包管理器都设置成了 `please-use-bun`，因此 npm、yarn 和 pnpm 都会被直接拒绝。

请按照 [Bun 安装指南](https://bun.sh/docs/installation) 安装 Bun。

CI 会通过读取同一个 `package.json` 来安装项目指定的 Bun 版本，因此在本地使用相同版本，可以确保你的依赖解析结果与 CI 环境保持一致。

可以通过以下命令检查当前 Bun 版本：

```bash
bun --version
```

每个开发方向对应的指南中，还会列出该方向所需要的其他依赖。

## 浏览器开发

构建 Chromium Fork 与上面介绍的其他开发工作有很大不同。

只有当你需要修改**浏览器本身**，而不是修改运行在浏览器内部的功能时，才需要进入这个开发方向。

**你需要准备：**

* 大约 100GB 的可用磁盘空间，用于存放 Chromium 源码；
* 16GB 或更多内存；
* Python 3.12 或更高版本，并安装 [uv](https://docs.astral.sh/uv/)；
* 对应操作系统的编译工具链：

  * macOS：Xcode Command Line Tools；
  * Linux：`build-essential`；
  * Windows：Visual Studio Build Tools。

**首先获取 Chromium 源码。**

根据你的操作系统，按照 [Chromium: Get the Code](https://www.chromium.org/developers/how-tos/get-the-code/) 中的说明操作。

该流程会配置 `depot_tools` 并下载 Chromium 源代码树，这个过程通常需要几个小时。

**然后进行构建：**

```bash
cd packages/browseros
uv sync                                   # 只需执行一次
cp .env.example .env                      # 只需执行一次，然后填写所需配置

# 对任一产品执行 Debug 构建
uv run browseros build --preset debug --product browseros   --chromium-src /path/to/chromium/src
uv run browseros build --preset debug --product browserclaw --chromium-src /path/to/chromium/src

# 查看构建过程具体会执行哪些操作，但不真正执行构建
uv run browseros build --preset release --show-plan
```

在现代硬件上，一次构建通常需要 1 到 3 个小时。

`browseros build` 每次只会为：

* 一个产品；
* 一个平台；

生成一个二进制文件。











发布 Release 属于另外一套独立的工作流程。

如果你想了解完整的构建流程，请阅读：

[`packages/browseros/bos_build/README.md`](packages/browseros/bos_build/README.md)

## 创建 Pull Request

* **标题必须采用 [Conventional Commits](https://www.conventionalcommits.org/) 格式。** CI 会自动检查这一点。
* **说明你修改了什么，以及为什么要修改。** “为什么修改”是代码 diff 本身无法告诉审核者的信息。
* **如果修改涉及可视化内容，请提供截图或短视频。**
* **关联对应的 Issue**，例如：

```text
Fixes #123
```

在推送代码之前，请先运行检查：

```bash
cd packages/browseros-agent
bun run check     # 一次执行 lint、类型检查以及 fallow
bun test          # 运行 TypeScript 测试套件
```

### 签署 CLA

当你第一次提交 Pull Request 时，一个 Bot 会要求你签署 Contributor License Agreement（贡献者许可协议）。

请先阅读：

[CLA.md](CLA.md)

然后在你的 PR 下方准确评论以下内容：

```text
I have read the CLA Document and I hereby sign the CLA
```

中文含义为：

> 我已经阅读 CLA 文档，并在此签署该 CLA。

Bot 会记录你的签署状态一次，之后不会再次要求你签署。

## 其他参与方式

你不一定需要写代码，也可以对这个项目作出有价值的贡献。

* **报告 Bug。**
  通过 [创建 Issue](https://github.com/browseros-ai/BrowserOS/issues/new/choose) 描述：

  * 你执行了什么操作；
  * 你原本期望发生什么；
  * 实际发生了什么；
  * 你的操作系统及版本。
    如果能附上截图或录屏，会非常有帮助。

* **提出新功能建议。**
  可以从 [Issue 选择页面](https://github.com/browseros-ai/BrowserOS/issues/new/choose) 开始，也可以先在 [Discord](https://discord.gg/YKwjt5vuKr) 中讨论你的想法。

* **改进文档。**
  网站文档位于 [`docs/`](docs/) 目录，并使用 MDX 编写。
  如果你在使用过程中刚刚遇到了某个错误步骤，并顺手把它修正，这就是非常有价值的贡献。

* **在你的环境中进行测试。**
  不同的操作系统、不同的 Agent、不同寻常的硬件环境，都可能暴露新的边界情况。
  很多边界问题，只有真正使用这些环境的人才能发现。

## 获取帮助

* **[Discord](https://discord.gg/YKwjt5vuKr)** 和 **[Slack](https://dub.sh/browserOS-slack)**：适合实时交流和提问；
* **[GitHub Discussions](https://github.com/browseros-ai/BrowserOS/discussions)**：适合较长的讨论；
* **[GitHub Issues](https://github.com/browseros-ai/BrowserOS/issues)**：用于提交 Bug；
* **安全问题：** 请不要创建公开 Issue。请按照 [SECURITY.md](.github/SECURITY.md) 的说明提交私有安全公告（Private Advisory）。

## 许可证

通过为本项目作出贡献，即表示你同意你的贡献内容按照 AGPL-3.0 许可证进行授权。

---
=======
# 为 BrowserOS neo 和 BrowserOS 做贡献

感谢你来到这里。无论你是想修复 Bug、开发新功能、改进文档，还是只是想看看项目，我们都非常欢迎你。

这两个浏览器都来自同一个代码仓库，并且有四个主要的开发方向。请选择与你想要修改的内容最匹配的方向。

## 选择你的开发方向

| 方向                                                                  | 你将负责的内容                            | 技术栈                   | 环境搭建成本             |
| ------------------------------------------------------------------- | ---------------------------------- | --------------------- | ------------------ |
| **[BrowserOS neo](packages/browseros-agent/CONTRIBUTING.md)**       | Cockpit 新标签页、Agent 连接的 MCP 接口、会话回放 | TypeScript、React、Rust | 约 15 分钟            |
| **[BrowserOS](packages/browseros-agent/CONTRIBUTING.BrowserOS.md)** | 侧边栏聊天、Agent 执行循环、定时任务、设置           | TypeScript、React、Bun  | 约 15 分钟            |
| **CLI**                                                             | 从终端或编程 Agent 中控制 BrowserOS         | Go                    | 约 5 分钟             |
| **Browser**                                                         | Chromium 补丁、构建系统、平台功能              | C++、Python            | 约 100GB 磁盘空间，耗时数小时 |

大多数贡献者会从 BrowserOS neo 或 BrowserOS 开始。

这两个项目都位于 `packages/browseros-agent` 中，并共享同一套工具链，因此只要完成其中一个项目的开发环境搭建，另一个项目的大部分环境也就已经准备好了。

## 开始之前

**请使用 Bun。**

Bun 是 Agent monorepo 唯一受支持的包管理器和运行时。

`packages/browseros-agent/package.json` 中固定了 Bun 的版本，同时将所有其他包管理器都设置成了 `please-use-bun`，因此 npm、yarn 和 pnpm 都会被直接拒绝。

请按照 [Bun 安装指南](https://bun.sh/docs/installation) 安装 Bun。

CI 会通过读取同一个 `package.json` 来安装项目指定的 Bun 版本，因此在本地使用相同版本，可以确保你的依赖解析结果与 CI 环境保持一致。

可以通过以下命令检查当前 Bun 版本：

```bash
bun --version
```

每个开发方向对应的指南中，还会列出该方向所需要的其他依赖。

## 浏览器开发

构建 Chromium Fork 与上面介绍的其他开发工作有很大不同。

只有当你需要修改**浏览器本身**，而不是修改运行在浏览器内部的功能时，才需要进入这个开发方向。

**你需要准备：**

* 大约 100GB 的可用磁盘空间，用于存放 Chromium 源码；
* 16GB 或更多内存；
* Python 3.12 或更高版本，并安装 [uv](https://docs.astral.sh/uv/)；
* 对应操作系统的编译工具链：

  * macOS：Xcode Command Line Tools；
  * Linux：`build-essential`；
  * Windows：Visual Studio Build Tools。

**首先获取 Chromium 源码。**

根据你的操作系统，按照 [Chromium: Get the Code](https://www.chromium.org/developers/how-tos/get-the-code/) 中的说明操作。

该流程会配置 `depot_tools` 并下载 Chromium 源代码树，这个过程通常需要几个小时。

**然后进行构建：**

```bash
cd packages/browseros
uv sync                                   # 只需执行一次
cp .env.example .env                      # 只需执行一次，然后填写所需配置

# 对任一产品执行 Debug 构建
uv run browseros build --preset debug --product browseros   --chromium-src /path/to/chromium/src
uv run browseros build --preset debug --product browserclaw --chromium-src /path/to/chromium/src

# 查看构建过程具体会执行哪些操作，但不真正执行构建
uv run browseros build --preset release --show-plan
```

在现代硬件上，一次构建通常需要 1 到 3 个小时。

`browseros build` 每次只会为：

* 一个产品；
* 一个平台；

生成一个二进制文件。











发布 Release 属于另外一套独立的工作流程。

如果你想了解完整的构建流程，请阅读：

[`packages/browseros/bos_build/README.md`](packages/browseros/bos_build/README.md)

## 创建 Pull Request

* **标题必须采用 [Conventional Commits](https://www.conventionalcommits.org/) 格式。** CI 会自动检查这一点。
* **说明你修改了什么，以及为什么要修改。** “为什么修改”是代码 diff 本身无法告诉审核者的信息。
* **如果修改涉及可视化内容，请提供截图或短视频。**
* **关联对应的 Issue**，例如：

```text
Fixes #123
```

在推送代码之前，请先运行检查：

```bash
cd packages/browseros-agent
bun run check     # 一次执行 lint、类型检查以及 fallow
bun test          # 运行 TypeScript 测试套件
```

### 签署 CLA

当你第一次提交 Pull Request 时，一个 Bot 会要求你签署 Contributor License Agreement（贡献者许可协议）。

请先阅读：

[CLA.md](CLA.md)

然后在你的 PR 下方准确评论以下内容：

```text
I have read the CLA Document and I hereby sign the CLA
```

中文含义为：

> 我已经阅读 CLA 文档，并在此签署该 CLA。

Bot 会记录你的签署状态一次，之后不会再次要求你签署。

## 其他参与方式

你不一定需要写代码，也可以对这个项目作出有价值的贡献。

* **报告 Bug。**
  通过 [创建 Issue](https://github.com/browseros-ai/BrowserOS/issues/new/choose) 描述：

  * 你执行了什么操作；
  * 你原本期望发生什么；
  * 实际发生了什么；
  * 你的操作系统及版本。
    如果能附上截图或录屏，会非常有帮助。

* **提出新功能建议。**
  可以从 [Issue 选择页面](https://github.com/browseros-ai/BrowserOS/issues/new/choose) 开始，也可以先在 [Discord](https://discord.gg/YKwjt5vuKr) 中讨论你的想法。

* **改进文档。**
  网站文档位于 [`docs/`](docs/) 目录，并使用 MDX 编写。
  如果你在使用过程中刚刚遇到了某个错误步骤，并顺手把它修正，这就是非常有价值的贡献。

* **在你的环境中进行测试。**
  不同的操作系统、不同的 Agent、不同寻常的硬件环境，都可能暴露新的边界情况。
  很多边界问题，只有真正使用这些环境的人才能发现。

## 获取帮助

* **[Discord](https://discord.gg/YKwjt5vuKr)** 和 **[Slack](https://dub.sh/browserOS-slack)**：适合实时交流和提问；
* **[GitHub Discussions](https://github.com/browseros-ai/BrowserOS/discussions)**：适合较长的讨论；
* **[GitHub Issues](https://github.com/browseros-ai/BrowserOS/issues)**：用于提交 Bug；
* **安全问题：** 请不要创建公开 Issue。请按照 [SECURITY.md](.github/SECURITY.md) 的说明提交私有安全公告（Private Advisory）。

## 许可证

通过为本项目作出贡献，即表示你同意你的贡献内容按照 AGPL-3.0 许可证进行授权。

---
>>>>>>> GensideAI/lsk
