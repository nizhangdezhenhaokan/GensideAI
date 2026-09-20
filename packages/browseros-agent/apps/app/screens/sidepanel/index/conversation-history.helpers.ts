import dayjs from 'dayjs'
import type { ServerConversationSummary } from '@/modules/conversations/conversations.hooks'

export type HistoryGroup = {
  key: 'today' | 'threeDays' | 'week' | 'month' | 'older'
  label: string
  conversations: ServerConversationSummary[]
}

export const groupConversations = (
  conversations: ServerConversationSummary[],
  currentTime = Date.now(),
): HistoryGroup[] => {
  const now = dayjs(currentTime).startOf('day')
  const groups: HistoryGroup[] = [
    { key: 'today', label: '今天', conversations: [] },
    { key: 'threeDays', label: '近三天', conversations: [] },
    { key: 'week', label: '近一周', conversations: [] },
    { key: 'month', label: '近一月', conversations: [] },
    { key: 'older', label: '更早之前', conversations: [] },
  ]

  for (const conversation of conversations) {
    const daysAgo = Math.max(
      0,
      now.diff(dayjs(conversation.lastMessagedAt).startOf('day'), 'day'),
    )
    const groupIndex =
      daysAgo === 0
        ? 0
        : daysAgo <= 3
          ? 1
          : daysAgo <= 7
            ? 2
            : daysAgo <= 30
              ? 3
              : 4
    groups[groupIndex].conversations.push(conversation)
  }

  return groups
}
