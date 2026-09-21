import { type FC, useState } from 'react'
import { Outlet } from 'react-router'
import type { Provider } from '@/components/chat/chatComponentTypes'
import {
  ChatSessionProvider,
  useChatSessionContext,
} from '@/modules/chat/chat-session-context'
import { ChatHeader } from '@/screens/sidepanel/index/ChatHeader'
import { ConversationHistoryOverlay } from '@/screens/sidepanel/index/ConversationHistoryOverlay'

const offlineHeaderProvider: Provider = {
  id: 'browseros-offline',
  name: '智慧小财神',
  type: 'browseros',
  kind: 'llm',
}

const ChatLayoutContent: FC = () => {
  const {
    providers,
    selectedProvider,
    handleSelectProvider,
    resetConversation,
    messages,
  } = useChatSessionContext()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const handleNewConversation = () => {
    setIsHistoryOpen(false)
    resetConversation()
  }

  return (
    <div className="finance-sidebar-root mx-auto flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <ChatHeader
        selectedProvider={selectedProvider ?? offlineHeaderProvider}
        onSelectProvider={handleSelectProvider}
        providers={providers}
        onNewConversation={handleNewConversation}
        hasMessages={messages.length > 0}
        fixedBrandName="智慧小财神"
        onOpenHistory={() => setIsHistoryOpen((open) => !open)}
        isHistoryOpen={isHistoryOpen}
      />
      <div className="finance-sidebar-content relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
        <ConversationHistoryOverlay
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
        />
      </div>
    </div>
  )
}

export const ChatLayout: FC = () => {
  return (
    <ChatSessionProvider origin="sidepanel">
      <ChatLayoutContent />
    </ChatSessionProvider>
  )
}
