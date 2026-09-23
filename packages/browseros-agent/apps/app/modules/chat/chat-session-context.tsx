import { createContext, type FC, type ReactNode, useContext } from 'react'
import { type ChatSessionOptions, useChatSession } from './chat-session.hooks'

type ChatSessionContextValue = ReturnType<typeof useChatSession>

const ChatSessionContext = createContext<ChatSessionContextValue | null>(null)

/** 自定义 MCP 不需要远端授权同步，可在会话创建时直接使用。 */
export const ChatSessionProvider: FC<
  { children: ReactNode } & ChatSessionOptions
> = ({ children, ...options }) => {
  const session = useChatSession(options)
  return (
    <ChatSessionContext.Provider value={session}>
      {children}
    </ChatSessionContext.Provider>
  )
}

export const useChatSessionContext = () => {
  const context = useContext(ChatSessionContext)
  if (!context) {
    throw new Error(
      'useChatSessionContext must be used within a ChatSessionProvider',
    )
  }
  return context
}
