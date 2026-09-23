import { Plus, Server, Settings } from 'lucide-react'
import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMcpServers } from '@/lib/mcp/mcpServerStorage'

export interface AppSelectorProps {
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

/** 对话入口仅展示用户已添加的自定义 MCP 服务。 */
export const AppSelector: FC<AppSelectorProps> = ({
  children,
  side = 'bottom',
}) => {
  const [open, setOpen] = useState(false)
  const { servers } = useMcpServers()

  const openSettings = () => {
    window.open('/app.html#/connect-apps', '_blank')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side={side} align="end" className="w-72 p-0">
        <Command>
          <CommandInput placeholder="搜索自定义 MCP…" className="h-9" />
          <CommandList className="max-h-64 overflow-auto">
            <CommandEmpty>未找到自定义 MCP</CommandEmpty>
            {servers.length > 0 && (
              <CommandGroup heading="自定义 MCP">
                {servers.map((server) => (
                  <CommandItem
                    key={server.id}
                    value={`${server.displayName} ${server.config.description ?? ''}`}
                    onSelect={openSettings}
                    className="flex cursor-pointer items-center gap-3 px-3 py-2"
                  >
                    <Server className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        {server.displayName}
                      </span>
                      <span className="block truncate text-muted-foreground text-xs">
                        {server.config.description || server.config.url}
                      </span>
                    </div>
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <div className="border-border border-t p-1">
              <button
                type="button"
                onClick={openSettings}
                className="flex w-full items-center gap-3 rounded-md p-2 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                添加自定义 MCP
              </button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
