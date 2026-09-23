/**
 * 纯函数：生成会话运行中 MCP、工作区与模式变化时供模型阅读的说明文本。
 */

/** 通知模型自定义 MCP 服务集合发生变更。 */
export function describeMcpChange(
  previousMcpKey: string | undefined,
  currentMcpKey: string,
): string {
  const oldServers = new Set((previousMcpKey ?? '').split(',').filter(Boolean))
  const newServers = new Set(currentMcpKey.split(',').filter(Boolean))
  const added = [...newServers].filter((server) => !oldServers.has(server))
  const removed = [...oldServers].filter((server) => !newServers.has(server))

  const parts: string[] = []
  if (removed.length > 0) {
    parts.push(
      `The following custom MCP services were removed: ${removed.join(', ')}. Their tools are no longer available.`,
    )
  }
  if (added.length > 0) {
    parts.push(
      `The following custom MCP services were added: ${added.join(', ')}. Their tools are now available.`,
    )
  }
  return (
    parts.join(' ') ||
    'Custom MCP services changed during this conversation. Use only tools that are currently registered.'
  )
}

/** Notice for a workspace connect, disconnect, or switch mid-conversation. */
export function describeWorkspaceChange(
  previousWorkingDir: string | undefined,
  currentWorkingDir: string | undefined,
  chatMode: boolean,
): string {
  if (!currentWorkingDir) {
    return [
      'The user disconnected the workspace during this conversation.',
      'Workspace filesystem tools (filesystem_write, filesystem_edit, filesystem_bash, filesystem_grep, filesystem_find, filesystem_ls, and workspace file reads) are no longer available.',
      'filesystem_read can only read BrowserOS-generated output files returned in this session.',
      'Return other output directly in chat.',
      'If the user asks for file operations, suggest they select a working directory from the chat toolbar.',
    ].join(' ')
  }
  if (!previousWorkingDir) {
    return chatMode
      ? [
          'The user connected a workspace during this conversation, but read-only chat mode cannot use workspace filesystem tools.',
          'filesystem_read can only read BrowserOS-generated output files returned in this session.',
        ].join(' ')
      : `The user connected a workspace during this conversation. Filesystem tools are now available. Working directory: ${currentWorkingDir}`
  }
  return chatMode
    ? [
        'The user switched workspace during this conversation, but read-only chat mode cannot use workspace filesystem tools.',
        'filesystem_read can only read BrowserOS-generated output files returned in this session.',
      ].join(' ')
    : `The user switched workspace during this conversation. Filesystem tools now use the new working directory: ${currentWorkingDir}`
}

/** Notice for a chat/agent mode switch mid-conversation. */
export function describeModeChange(
  chatMode: boolean,
  workspaceConnected: boolean,
): string {
  if (chatMode) {
    return workspaceConnected
      ? 'The user switched to read-only chat mode during this conversation. You can observe pages but can no longer interact with them, and workspace filesystem tools other than reading BrowserOS output files are no longer available.'
      : 'The user switched to read-only chat mode during this conversation. You can observe pages but can no longer interact with them or modify files.'
  }
  return workspaceConnected
    ? 'The user switched to agent mode during this conversation. You can interact with pages and perform browser actions again, and the workspace filesystem tools are available again. Any earlier statement that read-only chat mode blocked them no longer applies.'
    : 'The user switched to agent mode during this conversation. You can interact with pages and perform browser actions again.'
}
