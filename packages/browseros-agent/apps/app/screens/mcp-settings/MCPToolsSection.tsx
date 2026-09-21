<<<<<<< HEAD
import { ChevronDown, Loader2, RefreshCw, Wrench } from 'lucide-react'
import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useMcpTools } from './mcp-tools-section.hooks'

export const MCPToolsSection: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toolsQuery = useMcpTools()

  const tools = toolsQuery.data ?? []
  const isLoading = toolsQuery.isFetching
  const error = toolsQuery.isError
    ? toolsQuery.error instanceof Error
      ? toolsQuery.error.message
      : String(toolsQuery.error)
    : null

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <CollapsibleTrigger className="flex flex-1 items-center justify-between text-left">
            <div>
              <h3 className="font-semibold text-lg">Available Tools</h3>
              {tools.length > 0 && (
                <p className="text-muted-foreground text-sm">
                  {tools.length} tools available
                </p>
              )}
            </div>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              void toolsQuery.refetch()
            }}
            disabled={isLoading}
            className="border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/20 hover:text-[var(--accent-orange)]"
            title="Refresh tools"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive text-sm">
            {error}
          </div>
        )}

        <CollapsibleContent className="pt-4">
          {tools.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-lg border border-border bg-background p-4 transition-all hover:border-[var(--accent-orange)]/50 hover:shadow-sm"
                >
                  <div className="mb-2 flex items-start gap-2">
                    <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-orange)]" />
                    <span className="min-w-0 break-words font-medium text-sm">
                      {tool.name}
                    </span>
                  </div>
                  {tool.description && (
                    <p className="line-clamp-2 break-words text-muted-foreground text-xs">
                      {tool.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
=======
import { ChevronDown, Loader2, RefreshCw, Wrench } from 'lucide-react'
import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useMcpTools } from './mcp-tools-section.hooks'

/** 将 MCP 工具的英文协议说明转换为设置页中的中文说明，不改变真实调用名称。 */
const TOOL_DESCRIPTIONS: Record<string, string> = {
  tabs: '管理浏览器标签页：列出、查看当前标签、新建或关闭标签页。',
  tab_groups: '管理标签页分组：列出、创建、更新、取消分组或关闭分组。',
  history: '查看最近的浏览历史记录，包括网址、标题和访问时间。',
  navigate: '打开网址，或在当前页面后退、前进和刷新。',
  snapshot: '获取页面的无障碍结构快照，为可操作元素提供引用标识。',
  diff: '查看自上次快照以来页面发生的变化。',
  act: '根据页面快照中的引用执行点击、输入、滚动、选择等操作。',
  download: '点击页面元素触发文件下载，并保存到 BrowserOS 输出目录。',
  upload: '通过文件输入框向页面上传本地文件。',
  read: '提取页面内容，可返回 Markdown、纯文本或链接列表。',
  grep: '在不输出整个页面的情况下搜索页面内容。',
  screenshot: '截取当前页面的屏幕截图。',
  pdf: '将当前页面保存为 PDF 文件。',
  wait: '等待指定时间、文本出现或选择器匹配后继续。',
  windows: '管理浏览器窗口：列出、新建、关闭或激活窗口。',
  evaluate: '在页面上下文中执行 JavaScript，用于读取状态或运行小型脚本。',
  run: '在服务器运行时通过 BrowserOS SDK 执行多步骤 JavaScript 脚本。',
  connector_mcp_servers: '查看或检查 BrowserOS 管理的应用连接器。',
  discover_server_categories_or_actions: '发现可用服务类别或操作。',
  get_category_actions: '查看指定类别下可用的操作。',
  get_action_details: '查看指定操作的详细参数与说明。',
  execute_action: '使用提供的参数执行指定操作，执行前请先查看操作详情。',
  search_documentation: '搜索服务文档，仅在服务类别或操作信息不足时使用。',
  handle_auth_failure: '处理执行操作时发生的身份验证失败。',
}

export const MCPToolsSection: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toolsQuery = useMcpTools()

  const tools = toolsQuery.data ?? []
  const isLoading = toolsQuery.isFetching
  const error = toolsQuery.isError
    ? toolsQuery.error instanceof Error
      ? toolsQuery.error.message
      : String(toolsQuery.error)
    : null

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <CollapsibleTrigger className="flex flex-1 items-center justify-between text-left">
            <div>
              <h3 className="font-semibold text-lg">可用工具</h3>
              {tools.length > 0 && (
                <p className="text-muted-foreground text-sm">
                  可用工具：{tools.length} 个
                </p>
              )}
            </div>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              void toolsQuery.refetch()
            }}
            disabled={isLoading}
            className="border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/20 hover:text-[var(--accent-orange)]"
            title="刷新工具"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive text-sm">
            {error}
          </div>
        )}

        <CollapsibleContent className="pt-4">
          {tools.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-lg border border-border bg-background p-4 transition-all hover:border-[var(--accent-orange)]/50 hover:shadow-sm"
                >
                  <div className="mb-2 flex items-start gap-2">
                    <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-orange)]" />
                    <span className="min-w-0 break-words font-medium text-sm">
                      {tool.name}
                    </span>
                  </div>
                  {(TOOL_DESCRIPTIONS[tool.name] || tool.description) && (
                    <p className="line-clamp-2 break-words text-muted-foreground text-xs">
                      {TOOL_DESCRIPTIONS[tool.name] || tool.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
>>>>>>> GensideAI/lsk
