import { storage } from '@wxt-dev/storage'
import { useEffect, useState } from 'react'

/**
 * 用户自行配置的 MCP 服务。内置托管应用已移除，因此存储层只接受自定义服务。
 */
export interface McpServer {
  id: string
  displayName: string
  type: 'custom'
  config: {
    url: string
    description?: string
  }
}

export const mcpServerStorage = storage.defineItem<McpServer[]>(
  'local:mcpServers',
  {
    fallback: [],
  },
)

/**
 * 过滤旧版本遗留的托管应用，并将结果回写，避免升级后仍展示或发送预置连接器。
 */
function keepCustomServers(servers: unknown[]): McpServer[] {
  return servers.filter(
    (server): server is McpServer =>
      typeof server === 'object' &&
      server !== null &&
      (server as McpServer).type === 'custom' &&
      typeof (server as McpServer).displayName === 'string' &&
      typeof (server as McpServer).config?.url === 'string',
  )
}

/**
 * @public
 */
export function useMcpServers() {
  const [servers, setServers] = useState<McpServer[]>([])

  useEffect(() => {
    void mcpServerStorage.getValue().then(async (storedServers) => {
      const customServers = keepCustomServers(storedServers ?? [])
      setServers(customServers)
      if (customServers.length !== (storedServers ?? []).length) {
        await mcpServerStorage.setValue(customServers)
      }
    })
    const unwatch = mcpServerStorage.watch((newValue) => {
      setServers(keepCustomServers(newValue ?? []))
    })
    return unwatch
  }, [])

  const addServer = async (server: McpServer) => {
    const current = keepCustomServers((await mcpServerStorage.getValue()) ?? [])
    await mcpServerStorage.setValue([...current, server])
  }

  const removeServer = async (id: string) => {
    const current = keepCustomServers((await mcpServerStorage.getValue()) ?? [])
    await mcpServerStorage.setValue(
      current.filter((server) => server.id !== id),
    )
  }

  return { servers, addServer, removeServer }
}
