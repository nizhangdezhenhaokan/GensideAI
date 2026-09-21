import { MessageSquare, MousePointer2 } from 'lucide-react'
import type { FC } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ChatMode } from '@/modules/chat/chat-types'

export interface ChatModeToggleProps {
  mode: ChatMode
  onModeChange: (mode: ChatMode) => void
}

export const ChatModeToggle: FC<ChatModeToggleProps> = ({
  mode,
  onModeChange,
}) => {
  const isAgentMode = mode === 'agent'

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onModeChange(isAgentMode ? 'chat' : 'agent')}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-medium text-xs transition-all',
              isAgentMode
                ? 'border-border/50 bg-muted text-muted-foreground hover:text-foreground'
                : 'border-[var(--accent-orange)]/30 bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]',
            )}
          >
            {isAgentMode ? (
              <>
                <MousePointer2 className="h-3 w-3" />
                <span>智能体模式已开启</span>
              </>
            ) : (
              <>
                <MessageSquare className="h-3 w-3" />
                <span>聊天模式已开启</span>
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px]">
          {isAgentMode
            ? 'AI 可以浏览、点击和跳转页面'
            : 'AI 仅能阅读内容，不能点击或跳转页面'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
