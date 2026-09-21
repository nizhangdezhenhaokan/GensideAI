import { describe, expect, it } from 'bun:test'
import dayjs from 'dayjs'
import type { ServerConversationSummary } from '@/modules/conversations/conversations.hooks'
import { groupConversations } from './conversation-history.helpers'

const conversation = (
  id: string,
  timestamp: number,
): ServerConversationSummary => ({
  id,
  lastMessagedAt: timestamp,
  lastUserMessage: id,
})

describe('groupConversations', () => {
  it('splits history into the five requested non-overlapping time groups', () => {
    const now = dayjs('2026-09-20T12:00:00').valueOf()
    const atDaysAgo = (days: number) =>
      dayjs(now).subtract(days, 'day').hour(10).valueOf()

    const groups = groupConversations(
      [
        conversation('today', atDaysAgo(0)),
        conversation('three-days', atDaysAgo(3)),
        conversation('week', atDaysAgo(7)),
        conversation('month', atDaysAgo(30)),
        conversation('older', atDaysAgo(31)),
      ],
      now,
    )

    expect(
      groups.map((group) => group.conversations.map(({ id }) => id)),
    ).toEqual([['today'], ['three-days'], ['week'], ['month'], ['older']])
  })
})
