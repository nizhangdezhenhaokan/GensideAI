import { Plus, Server, Trash2 } from 'lucide-react'
import { type FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CUSTOM_MCP_ADDED_EVENT } from '@/lib/constants/analyticsEvents'
import { useMcpServers } from '@/lib/mcp/mcpServerStorage'
import { track } from '@/lib/metrics/track'
import { AddCustomMCPDialog } from './AddCustomMCPDialog'

/** 仅管理用户显式添加的 MCP 服务，不再暴露预置应用。 */
export const ConnectMCP: FC = () => {
  const { servers, addServer, removeServer } = useMcpServers()
  const [addingCustomMcp, setAddingCustomMcp] = useState(false)

  const addCustomServer = (config: {
    name: string
    url: string
    description: string
  }) => {
    void addServer({
      id: crypto.randomUUID(),
      displayName: config.name,
      type: 'custom',
      config: {
        url: config.url,
        description: config.description,
      },
    })
    track(CUSTOM_MCP_ADDED_EVENT)
  }

  return (
    <div className="fade-in slide-in-from-bottom-5 animate-in space-y-6 duration-500">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-orange)]/10">
            <Server className="h-6 w-6 text-[var(--accent-orange)]" />
          </div>
          <div className="flex-1">
            <h2 className="mb-1 font-semibold text-xl">自定义 MCP</h2>
            <p className="mb-6 text-muted-foreground text-sm">
              添加您自己的 MCP 服务地址，供智能体在对话中使用。
            </p>
            <Button variant="outline" onClick={() => setAddingCustomMcp(true)}>
              <Plus className="h-4 w-4" />
              <span>添加自定义 MCP</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
        <h3 className="mb-4 font-semibold text-lg">已添加的自定义 MCP</h3>
        {servers.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">
            暂无自定义 MCP
          </p>
        ) : (
          <div className="space-y-3">
            {servers.map((server) => (
              <div
                key={server.id}
                className="flex items-center gap-4 rounded-lg border border-border bg-background p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-orange)]/10">
                  <Server className="h-5 w-5 text-[var(--accent-orange)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{server.displayName}</p>
                  <p className="truncate text-muted-foreground text-sm">
                    {server.config.description || server.config.url}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void removeServer(server.id)}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="移除应用"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddCustomMCPDialog
        open={addingCustomMcp}
        onOpenChange={setAddingCustomMcp}
        onAddServer={addCustomServer}
      />
    </div>
  )
}
