import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createBrowserOSAction } from '@/lib/chat-actions/types'
import {
  SIDEPANEL_AI_TRIGGERED_EVENT,
  SIDEPANEL_STOP_CLICKED_EVENT,
  SIDEPANEL_TAB_REMOVED_EVENT,
  SIDEPANEL_TAB_TOGGLED_EVENT,
} from '@/lib/constants/analyticsEvents'
import { track } from '@/lib/metrics/track'
import { useChatSessionContext } from '@/modules/chat/chat-session-context'
import { useJtbdPopup } from '@/modules/jtbd-popup/jtbd-popup.hooks'
import { buildChatErrorProps } from './Chat.helpers'
import { ChatError } from './ChatError'
import { ChatFooter } from './ChatFooter'
import { ChatMessages } from './ChatMessages'
import { IncognitoNotice } from './IncognitoNotice'

/**
 * @public
 */
export const Chat = () => {
  const {
    mode,
    messages,
    sendMessage,
    status,
    stop,
    agentUrlError,
    chatError,
    canSend,
    selectedProvider,
    getActionForMessage,
    liked,
    onClickLike,
    disliked,
    onClickDislike,
    isRestoringConversation,
    isIncognito,
    retryLastTurn,
  } = useChatSessionContext()

  const {
    popupVisible,
    showDontShowAgain,
    recordMessageSent,
    triggerIfEligible,
    onTakeSurvey,
    onDismiss: onDismissJtbdPopup,
  } = useJtbdPopup()

  const [input, setInput] = useState('')
  const [attachedTabs, setAttachedTabs] = useState<chrome.tabs.Tab[]>([])

  useEffect(() => {
    ;(async () => {
      const currentTab = (
        await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })
      ).filter((tab) => tab.url?.startsWith('http'))
      setAttachedTabs(currentTab)
    })()
  }, [])

  // Trigger JTBD popup when AI finishes responding
  const previousChatStatus = useRef(status)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only trigger on status change
  useEffect(() => {
    const aiWasProcessing =
      previousChatStatus.current === 'streaming' ||
      previousChatStatus.current === 'submitted'
    const aiJustFinished = aiWasProcessing && status === 'ready'

    if (aiJustFinished && messages.length > 0) {
      triggerIfEligible()
    }
    previousChatStatus.current = status
  }, [status])

  const handleStop = () => {
    track(SIDEPANEL_STOP_CLICKED_EVENT)
    stop()
  }

  const toggleTabSelection = (tab: chrome.tabs.Tab) => {
    setAttachedTabs((prev) => {
      const isSelected = prev.some((t) => t.id === tab.id)
      track(SIDEPANEL_TAB_TOGGLED_EVENT, {
        action: isSelected ? 'removed' : 'added',
      })
      if (isSelected) {
        return prev.filter((t) => t.id !== tab.id)
      }
      return [...prev, tab]
    })
  }

  const removeTab = (tabId?: number) => {
    track(SIDEPANEL_TAB_REMOVED_EVENT)
    setAttachedTabs((prev) => prev.filter((t) => t.id !== tabId))
  }

  const executeMessage = (customMessageText?: string) => {
    const messageText = customMessageText ? customMessageText : input.trim()
    if (!messageText) return

    recordMessageSent()

    if (attachedTabs.length) {
      const action = createBrowserOSAction({
        mode,
        message: messageText,
        tabs: attachedTabs,
      })
      sendMessage({ text: messageText, action })
    } else {
      sendMessage({ text: messageText })
    }
    setInput('')
    setAttachedTabs([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (messages.length === 0) {
      track(SIDEPANEL_AI_TRIGGERED_EVENT, {
        mode,
        tabs_count: attachedTabs.length,
      })
    }
    executeMessage()
  }

  const chatErrorProps = buildChatErrorProps({
    chatError,
    selectedProvider,
    retryLastTurn,
  })

  return (
    <>
      <main className="mt-4 flex h-full flex-1 flex-col space-y-4 overflow-y-auto">
        {isRestoringConversation ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length > 0 ? (
          <ChatMessages
            messages={messages}
            status={status}
            getActionForMessage={getActionForMessage}
            liked={liked}
            onClickLike={onClickLike}
            disliked={disliked}
            onClickDislike={onClickDislike}
            showJtbdPopup={popupVisible}
            showDontShowAgain={showDontShowAgain}
            onTakeSurvey={onTakeSurvey}
            onDismissJtbdPopup={onDismissJtbdPopup}
          />
        ) : null}
        {agentUrlError && (
          <ChatError
            error={agentUrlError}
            providerType={selectedProvider?.type}
          />
        )}
        {chatErrorProps && <ChatError {...chatErrorProps} />}
      </main>

      {isIncognito && <IncognitoNotice />}

      <ChatFooter
        mode={mode}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        status={status}
        onStop={handleStop}
        sendDisabled={!canSend}
        attachedTabs={attachedTabs}
        onToggleTab={toggleTabSelection}
        onRemoveTab={removeTab}
      />
    </>
  )
}
