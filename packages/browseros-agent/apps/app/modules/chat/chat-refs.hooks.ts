import { useEffect, useRef } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { type McpServer, useMcpServers } from '@/lib/mcp/mcpServerStorage'
import { usePersonalization } from '@/lib/personalization/personalizationStorage'
import { useChatTargetSelection } from './use-chat-target-selection'

/** 将本地自定义服务转换为服务端 MCP 客户端需要的最小配置。 */
const constructCustomServers = (servers: McpServer[]) =>
  servers.map((server) => ({
    name: server.displayName,
    url: server.config.url,
  }))

export const useChatRefs = () => {
  const selection = useChatTargetSelection()
  const { servers: mcpServers } = useMcpServers()
  const { personalization } = usePersonalization()
  const enabledCustomServersRef = useRef(constructCustomServers(mcpServers))
  const personalizationRef = useRef(personalization)

  useDeepCompareEffect(() => {
    enabledCustomServersRef.current = constructCustomServers(mcpServers)
  }, [mcpServers])

  useEffect(() => {
    personalizationRef.current = personalization
  }, [personalization])

  return {
    ...selection,
    enabledCustomServersRef,
    personalizationRef,
  }
}
