<div align="center">

<img src="packages/browseros/resources/browseros/icons/product_logo_192.png" alt="BrowserOS" width="96" />

<h1>BrowserOS</h1>

<h3>为人而生的 AI 浏览器。</h3>

免费 · 开源 · 一切都运行在你的本地机器上

<a href="https://discord.gg/YKwjt5vuKr"><img src="https://img.shields.io/badge/Discord-555?logo=discord" alt="Discord" /></a>
<a href="https://dub.sh/browserOS-slack"><img src="https://img.shields.io/badge/Slack-555?logo=slack" alt="Slack" /></a>
<a href="https://x.com/browserOS_ai"><img src="https://img.shields.io/badge/@browserOS__ai-555?logo=x" alt="X / Twitter" /></a>
<a href="https://github.com/browseros-ai/BrowserOS"><img src="https://img.shields.io/github/stars/browseros-ai/BrowserOS?style=flat&logo=github&label=stars&color=4c71f2" alt="GitHub stars" /></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-555" alt="AGPL-3.0" /></a>

<a href="https://files.browseros.com/download/BrowserOS.dmg"><img src="https://img.shields.io/badge/Download-macOS-black?style=for-the-badge&logo=apple&logoColor=white" alt="下载 macOS 版本" /></a>
<a href="https://files.browseros.com/download/BrowserOS_installer.exe"><img src="https://img.shields.io/badge/Download-Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="下载 Windows 版本" /></a>
<a href="https://files.browseros.com/download/BrowserOS.AppImage"><img src="https://img.shields.io/badge/Download-Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black" alt="下载 Linux 版本" /></a>
<a href="https://cdn.browseros.com/download/BrowserOS.deb"><img src="https://img.shields.io/badge/Download-Debian-D70A53?style=for-the-badge&logo=debian&logoColor=white" alt="下载 Debian 版本" /></a>

**[官网](https://www.browseros.com/browseros/)** · **[文档](https://docs.browseros.com/browseros)** · **[企业版](mailto:founders@browseros.com?subject=Enterprise%3A%20BrowserOS&body=Hi%2C%0A%0AWe%27re%20looking%20at%20BrowserOS%20for%20our%20team.%0A%0ACompany%3A%0ATeam%20size%3A%0AWhat%20we%20want%20to%20automate%3A)**

</div>

> 正在寻找一个由你的 Agent 驱动的浏览器？那就是 **[BrowserOS neo](README.md)**，它与 BrowserOS 一同发布在这个仓库中。

BrowserOS 是一个免费、开源的 Chromium 分支，并在每个新标签页中内置了 AI Agent。你可以让它总结页面、自动点击完成某个流程、提取数据，或者运行定时任务；它会使用 20 多个内置工具以及 40 多个应用集成来完成工作。你可以使用自己的 AI API Key，也可以通过 Ollama 完全在本地运行。

如今几乎所有 AI 浏览器都会要求你登录它们的云服务并交出数据，而 BrowserOS 不会这样做。它仍然是你每天使用的浏览器，只不过多了一个随时可以通过一次按键唤起的实用 Agent。

## 快速开始

### 1. 安装 BrowserOS

```sh
brew install --cask browseros
```

更喜欢直接下载安装包？可选择 [macOS](https://files.browseros.com/download/BrowserOS.dmg) · [Windows](https://files.browseros.com/download/BrowserOS_installer.exe) · [Linux（AppImage）](https://files.browseros.com/download/BrowserOS.AppImage) · [Linux（Debian）](https://cdn.browseros.com/download/BrowserOS.deb)

### 2. 从 Chrome 导入数据

只需一次点击，即可导入你的书签、密码和扩展。

### 3. 连接你的 AI 提供商

支持 Claude、OpenAI、Gemini、通过 OAuth 使用 ChatGPT Pro，也支持通过 Ollama 或 LM Studio 使用本地模型。

## 核心功能

<table>
<tr>
<td width="40%" valign="middle">
<h4>BrowserOS Agent 实际运行效果</h4>
直接使用自然语言向它下达任务。内置 20 多个工具，并支持 40 多个应用集成（Gmail、Slack、GitHub、Linear、Notion 等）。<a href="https://docs.browseros.com/getting-started">文档</a>
</td>
<td width="60%">
<a href="https://www.youtube.com/watch?v=SoSFev5R5dI"><img src="docs/videos/browserOS-agent-in-action.gif" alt="BrowserOS Agent 使用自然语言完成浏览器任务" width="100%" /></a>
</td>
</tr>
<tr>
<td width="40%" valign="middle">
<h4>作为 MCP 安装，并通过 Claude Code 控制</h4>
将 BrowserOS 转换为 MCP Server，然后通过 Claude Code、Cursor 或任意 MCP Client 控制它。<a href="https://docs.browseros.com/features/use-with-claude-code">文档</a>
</td>
<td width="60%">
<video src="https://github.com/user-attachments/assets/c725d6df-1a0d-40eb-a125-ea009bf664dc" controls width="100%"></video>
</td>
</tr>
<tr>
<td width="40%" valign="middle">
<h4>使用 BrowserOS 进行对话</h4>
可以在侧边栏中围绕当前页面进行对话。你可以让它总结内容、提出问题，或者对正在阅读的内容进行转换处理。<a href="https://docs.browseros.com/getting-started">文档</a>
</td>
<td width="60%">
<video src="https://github.com/user-attachments/assets/726803c5-8e36-420e-8694-c63a2607beca" controls width="100%"></video>
</td>
</tr>
<tr>
<td width="40%" valign="middle">
<h4>使用 BrowserOS 抓取数据</h4>
让 Agent 面向某个页面，告诉它需要提取哪些内容，即可得到结构化数据。<a href="https://docs.browseros.com/getting-started">文档</a>
</td>
<td width="60%">
<video src="https://github.com/user-attachments/assets/9f038216-bc24-4555-abf1-af2adcb7ebc0" controls width="100%"></video>
</td>
</tr>
</table>

- **与本地文件协同工作。** 在同一个会话中，将浏览器自动化与本地文件操作结合起来。[文档](https://docs.browseros.com/features/cowork)
- **定时任务。** 让 Agent 自动运行：每天、每小时，或者每隔几分钟执行一次。[文档](https://docs.browseros.com/features/scheduled-tasks)
- **使用你自己的 AI。** 支持 11 个以上的提供商，也可以使用 Ollama 和 LM Studio 完全本地运行。[提供商列表](https://docs.browseros.com/features/bring-your-own-llm)
- **真正的广告拦截。** 使用 uBlock Origin，并完整支持 Manifest V2。[文档](https://docs.browseros.com/features/ad-blocking)

## 为什么选择 BrowserOS，而不是其他方案？

- **它不是“Chrome + AI 扩展”。** 浏览器扩展无法操作浏览器自身的 UI（browser chrome），无法执行定时后台任务，也无法原生提供 Agent 使用的 20 多个内置工具。BrowserOS 是把 Agent 直接集成进 Chromium 本身。
- **它也不是 Comet、Atlas 或 Dia。** 这些 AI 浏览器会把你的 Prompt 发送到它们的云端，并使用它们自己的模型。BrowserOS 则使用你的 AI Key，在你的本地机器上运行。你的数据仍然属于你自己。

## BrowserOS 对比

| | BrowserOS | Chrome | Brave | Dia | Comet | Atlas |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 开源 | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| AI Agent | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| MCP Server | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cowork（文件 + 浏览器） | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 定时任务 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 使用自己的 API Key | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 本地模型（Ollama） | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 本地优先隐私 | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 广告拦截（MV2） | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |

## 支持的平台

BrowserOS 支持 macOS、Windows 和 Linux。系统要求与 Google Chrome 相同。

## 获取帮助

- [Discord](https://discord.gg/YKwjt5vuKr) · [Slack](https://dub.sh/browserOS-slack)
- [报告 Bug](https://github.com/browseros-ai/BrowserOS/issues)
- [BrowserOS 文档](https://docs.browseros.com/browseros)
- 企业部署：[founders@browseros.com](mailto:founders@browseros.com?subject=Enterprise%3A%20BrowserOS&body=Hi%2C%0A%0AWe%27re%20looking%20at%20BrowserOS%20for%20our%20team.%0A%0ACompany%3A%0ATeam%20size%3A%0AWhat%20we%20want%20to%20automate%3A)

## 贡献与许可证

BrowserOS 与 BrowserOS neo 一同在这个仓库中开发。请参阅[贡献指南](CONTRIBUTING.md)以及[架构概览](README.md#architecture)。

本项目基于 [AGPL-3.0 许可证](LICENSE)开源。Copyright &copy; 2026 Felafax, Inc.
