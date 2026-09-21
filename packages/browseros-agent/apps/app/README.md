# BrowserOS Agent Extension

BrowserOS 内置的浏览器扩展，用于驱动 BrowserOS 的 AI 交互界面，包括：

* 带统一搜索的新标签页；
* 侧边栏聊天；
* 首次使用引导；
* 设置页面。

该扩展使用 [WXT](https://wxt.dev) 和 React 构建。

> 面向用户的功能文档请参考 [docs.browseros.com](https://docs.browseros.com)。

## 功能

* **AI 驱动的新标签页**：提供自定义新标签页，可统一搜索 Google，也可以直接向 AI 助手提问。
* **侧边栏聊天**：提供完整的 BrowserOS AI 聊天交互界面。
* **多模型提供商支持**：支持连接不同 LLM Provider，例如 OpenAI、Anthropic、Azure、Bedrock 等。
* **MCP 集成**：支持 Model Context Protocol，用于扩展 AI 的工具能力。
* **可视化反馈**：AI Agent 正在操作标签页时，会显示动态发光效果。
* **隐私优先**：数据主要在本地处理，同时可以自行配置模型提供商。

## 如何连接

该扩展与本地运行的 [BrowserOS Server](../../apps/server/) 通信。

BrowserOS Server 主要负责：

```text
AI Agent Loop
+
MCP Tools
+
CDP Connections
```

而浏览器扩展主要负责：

```text
UI 交互层
```

因此整体关系可以理解为：

```text
BrowserOS Extension
        ↓
      UI 层
        ↓
BrowserOS Server
        ↓
Agent Loop / MCP / CDP
```

## 项目目录结构

```text
apps/app
│
├── entrypoints/        # 应用从哪里启动
│
├── screens/            # 完整页面
│      ↓
├── modules/            # 业务功能
│      ↓
├── components/         # UI 组件
│      ↓
├── hooks/              # React Hooks
├── lib/                # 公共逻辑
│
├── schema/             # 数据定义
├── generated/          # 自动生成代码
│
├── assets/             # 构建资源
├── public/             # 静态资源
├── styles/             # 样式
│
├── .wxt/               # WXT 自动生成
├── dist/               # 构建产物
└── node_modules/       # 第三方依赖
```

# Entrypoints

## Background（`background.ts`）

这是浏览器扩展的 Service Worker，负责：

* 通过浏览器操作按钮打开或关闭 Side Panel；
* BrowserOS Core 健康检查；
* 获取 MCP Tools；
* 备份 LLM Provider 配置；
* 处理扩展首次安装事件，例如自动打开 Onboarding 页面。

可以理解成：

```text
background.ts
=
浏览器扩展后台控制中心
```

## New Tab（`newtab/`）

用于替换浏览器默认的新标签页。

主要功能包括：

### Unified Search Bar

统一搜索栏，可以：

```text
搜索 Google
或
直接向 AI 提问
```

### Tab Context

可以把已经打开的浏览器标签页附加到 AI 请求中，为 AI 提供上下文。

例如：

```text
当前打开网页
    ↓
提取标签页内容
    ↓
作为 Context
    ↓
发送给 AI
```

### Search Suggestions

实时获取 Google 搜索建议。

### AI Suggestions

根据当前上下文，提供 BrowserOS 可以执行的 AI 操作建议。

### Top Sites

快速访问经常访问的网站。

### Theme Toggle

支持：

```text
Light Mode
Dark Mode
```

## Side Panel（`sidepanel/`）

BrowserOS 的主要聊天界面。

主要功能包括：

### Chat Modes

可以在不同模式之间切换：

```text
Chat Mode
Agent Mode
```

Chat Mode 主要用于对话。

Agent Mode 主要用于让 AI 执行浏览器任务。

### Provider Selector

从已经配置好的 LLM Provider 中选择模型提供商。

例如：

```text
OpenAI
Anthropic
Azure
Bedrock
...
```

### Tab Attachment

可以将浏览器标签页中的内容作为 AI 上下文。

### Tool Calls

在界面中可视化展示 MCP Tool 调用过程。

例如：

```text
AI
 ↓
调用 MCP Tool
 ↓
read_page
click
navigate
...
```

### Message Actions

支持消息操作，例如：

```text
Like
Dislike
Copy
```

### Conversation Management

支持：

* 创建新的 Conversation；
* 查看历史 Conversation。

## Onboarding（`onboarding/`）

为第一次使用 BrowserOS 的用户提供多步骤引导流程。

包括：

* 欢迎页面和产品亮点；
* 带动画效果的功能展示卡片；
* 分步骤 Setup Wizard；
* LLM Provider 配置指南。

## Options（`options/`）

BrowserOS Agent Extension 的设置管理页面。

主要包含以下部分。

### AI Settings

配置 LLM Provider，例如：

```text
API Key
Model
Base URL
```

### LLM Hub

管理 Chat 场景相关的 Provider 配置。

### MCP Settings

查看和管理已经连接的 MCP Server。

### Connect MCP

添加：

```text
Managed MCP Server
或
Custom MCP Server
```

## Glow Content（`glow.content/`）

这是一个 Content Script。

当 AI Agent 正在操作某个浏览器标签页时，会在浏览器页面视口周围显示：

```text
橙色脉冲发光效果
```

用于提示：

> 当前页面正在被 AI Agent 操作。

# 开发

## 环境要求

需要：

* 安装 [Bun](https://bun.sh)；
* Chrome 或 Chromium 系浏览器；
* 本地运行 BrowserOS Server，如果需要完整功能。

## 初始化

从当前 App 目录执行：

```bash
# 在 monorepo 根目录创建共享开发环境变量文件

(cd ../.. && cp .env.development.example .env.development)

# 安装依赖

bun install

# 启动开发服务器

bun run dev

# Production 构建

bun run build

# 创建可分发 ZIP

bun run zip
```

## 加载浏览器扩展

第一步：

```bash
bun run dev
```

启动开发服务器。

第二步，在 Chrome 中打开：

```text
chrome://extensions
```

第三步，开启：

```text
Developer mode
```

也就是“开发者模式”。

第四步，点击：

```text
Load unpacked
```

也就是“加载已解压的扩展程序”。

然后选择：

```text
dist/
```

目录。

整体流程：

```text
bun run dev
    ↓
生成 dist/
    ↓
chrome://extensions
    ↓
Developer Mode
    ↓
Load unpacked
    ↓
选择 dist/
    ↓
BrowserOS Agent Extension 加载成功
```

## 环境变量

扩展开发环境变量统一配置在 Monorepo 根目录的：

```text
.env.development
```

例如：

```env
SENTRY_ORG=your-org

SENTRY_PROJECT=your-project

SENTRY_AUTH_TOKEN=your-token
```

这些变量主要用于 Sentry。

## GraphQL Schema

Codegen 需要 GraphQL Schema。

默认情况下，会使用项目自带的：

```text
schema/schema.graphql
```

因此通常不需要额外配置。

如果你能够访问原始 API 项目，也可以设置：

```env
GRAPHQL_SCHEMA_PATH=/path/to/api-repo/.../schema.graphql
```

让 Codegen 使用其他 GraphQL Schema 文件。

# 发布流程

BrowserOS Agent Extension 发布时会被构建成：

```text
签名后的 CRX 文件
```

构建使用可复用的 GitHub Actions Workflow：

```text
Release: Extensions (CRX)
```

正常的 BrowserOS 产品发布流程通过：

```text
release-browseros.yml
```

调用这个 Workflow。

当以下条件满足时：

```text
extensions = alpha
```

或者：

```text
extensions = prod
```

并且：

```text
extensions_version
```

已经设置，就会触发扩展发布流程。

## 单独发布 Agent Extension

如果只需要单独发布 Agent Extension，可以执行：

```bash
gh workflow run release-extensions.yml \
  -f version=0.0.119 \
  -f extension=agent
```

其中：

```text
version=0.0.119
```

指定扩展版本。

```text
extension=agent
```

指定发布 Agent Extension。

## Feed 生成

更新 Feed 的生成是另一套独立 Workflow。

默认情况下属于：

```text
dry-run
```

也就是只生成和检查，不真正发布。

首先执行：

```bash
gh workflow run release-extension-feeds.yml \
  -f channel=alpha \
  -f pins=agent=0.0.119
```

用于生成并检查更新 Feed。

确认 CRX 和生成的 Diff 没问题后，再执行：

```bash
gh workflow run release-extension-feeds.yml \
  -f channel=alpha \
  -f pins=agent=0.0.119 \
  -f publish=true
```

进行正式发布。

因此推荐流程为：

```text
生成 CRX
    ↓
生成 Feed（dry-run）
    ↓
检查 CRX
    ↓
检查 Diff
    ↓
确认无误
    ↓
publish=true
    ↓
正式发布 Feed
```

以前使用的：

```text
GitHub Release ZIP 分发
```

以及：

```text
Extension Component Tag Trigger
```

目前都只是历史方案，不再是当前正常发布路径。

# 开发工具

## Bun

Bun 是该项目唯一使用的：

```text
Runtime
+
Package Manager
```

所有脚本都使用：

```bash
bun run <script>
```

而不是：

```bash
npm run <script>
```

安装依赖使用：

```bash
bun install
```

开发脚本会自动读取 Monorepo 根目录的：

```text
.env.development
```

项目通过：

```text
package.json
```

中的：

```text
engines
```

字段限制 Bun 版本。

## Biome

项目使用：

```text
biome.json
```

统一配置：

```text
Linter
+
Formatter
```

主要配置包括：

### Formatting

格式化规则：

```text
2 空格缩进
单引号
不使用分号
```

### Linting

使用 Biome 推荐规则，并增加一些自定义检查，例如：

```text
Unused Imports
Unused Variables
```

### CSS Support

开启 Tailwind CSS Directive 解析支持。

### Import Organization

通过 Assist Action 自动进行：

```text
Import Sorting
```

即自动整理 Import 顺序。

# Scripts

| 命令                    | 作用                    |
| --------------------- | --------------------- |
| `bun run dev`         | 启动开发模式，并支持 Hot Reload |
| `bun run build`       | 构建 Production 浏览器扩展   |
| `bun run zip`         | 创建可分发 ZIP 文件          |
| `bun run lint`        | 执行 Biome Lint         |
| `bun run lint:fix`    | 自动修复可以修复的 Lint 问题     |
| `bun run typecheck`   | 执行 TypeScript 类型检查    |
| `bun run codegen`     | 生成 GraphQL 类型代码       |
| `bun run clean:cache` | 清理构建缓存                |
