import dayjs from 'dayjs'
import { Check, ListChecks, Search, Trash2, X } from 'lucide-react'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { useChatSessionContext } from '@/modules/chat/chat-session-context'
import {
  useDeleteServerConversations,
  useServerConversations,
} from '@/modules/conversations/conversations.hooks'
import { groupConversations } from './conversation-history.helpers'

const formatConversationTime = (timestamp: number) => {
  const value = dayjs(timestamp)
  return value.isSame(dayjs(), 'day')
    ? value.format('今天 HH:mm')
    : value.format('MM-DD HH:mm')
}

export interface ConversationHistoryOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ConversationHistoryOverlay: FC<
  ConversationHistoryOverlayProps
> = ({ open, onOpenChange }) => {
  const navigate = useNavigate()
  const { conversationId: activeConversationId } = useChatSessionContext()
  const {
    data: conversations = [],
    isPending,
    isError,
  } = useServerConversations(open)
  const deleteConversations = useDeleteServerConversations()
  const [query, setQuery] = useState('')
  const [isManaging, setIsManaging] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    const sorted = [...conversations].sort(
      (a, b) => b.lastMessagedAt - a.lastMessagedAt,
    )
    if (!normalizedQuery) return sorted
    return sorted.filter((conversation) =>
      conversation.lastUserMessage
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    )
  }, [conversations, query])

  const groups = useMemo(
    () => groupConversations(filteredConversations),
    [filteredConversations],
  )

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onOpenChange])

  if (!open) return null

  const close = () => {
    onOpenChange(false)
    setIsManaging(false)
    setSelectedIds(new Set())
  }

  const openConversation = (id: string) => {
    close()
    navigate(`/?conversationId=${encodeURIComponent(id)}`)
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedIds((current) =>
      current.size === filteredConversations.length
        ? new Set()
        : new Set(filteredConversations.map((conversation) => conversation.id)),
    )
  }

  const confirmDelete = () => {
    const ids = pendingDeleteIds
    deleteConversations.mutate(ids, {
      onSuccess: () => {
        setSelectedIds((current) => {
          const next = new Set(current)
          for (const id of ids) next.delete(id)
          return next
        })
        setPendingDeleteIds([])
      },
    })
  }

  const hasConversations = filteredConversations.length > 0

  return (
    <div className="absolute inset-0 z-50 bg-background/55 p-2 backdrop-blur-[1px]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-history-title"
        className="mx-auto flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
      >
        <div className="border-border border-b p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2
              id="conversation-history-title"
              className="font-semibold text-base"
            >
              历史对话记录
            </h2>
            <button
              type="button"
              onClick={close}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="关闭历史对话记录"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 focus-within:border-[var(--accent-orange)]">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="搜索历史对话..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setIsManaging((value) => !value)
                setSelectedIds(new Set())
              }}
              className={cn(
                'rounded-lg border border-border p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                isManaging &&
                  'border-[var(--accent-orange)] text-[var(--accent-orange)]',
              )}
              title={isManaging ? '完成批量管理' : '批量管理'}
            >
              <ListChecks className="h-4 w-4" />
            </button>
          </div>

          {isManaging ? (
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={selectAll}
                disabled={!hasConversations}
                className="text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {selectedIds.size === filteredConversations.length &&
                hasConversations
                  ? '取消全选'
                  : '全选'}
              </button>
              <button
                type="button"
                disabled={selectedIds.size === 0}
                onClick={() => setPendingDeleteIds([...selectedIds])}
                className="flex items-center gap-1 text-destructive disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                删除所选（{selectedIds.size}）
              </button>
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isPending ? (
            <p className="p-8 text-center text-muted-foreground text-sm">
              正在加载历史对话...
            </p>
          ) : isError ? (
            <p className="p-8 text-center text-destructive text-sm">
              历史对话加载失败，请稍后重试
            </p>
          ) : !hasConversations ? (
            <p className="p-8 text-center text-muted-foreground text-sm">
              {query.trim() ? '没有匹配的历史对话' : '暂无历史对话'}
            </p>
          ) : (
            groups.map((group) =>
              group.conversations.length > 0 ? (
                <section key={group.key}>
                  <h3 className="sticky top-0 z-10 border-border/60 border-b bg-muted/90 px-3 py-2 font-medium text-muted-foreground text-xs backdrop-blur-sm">
                    {group.label}
                  </h3>
                  {group.conversations.map((conversation) => {
                    const selected = selectedIds.has(conversation.id)
                    const active = conversation.id === activeConversationId
                    return (
                      <div
                        key={conversation.id}
                        className={cn(
                          'group flex items-center border-border/40 border-b pr-2 transition-colors hover:bg-muted/50',
                          active && 'bg-muted/70',
                        )}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            isManaging
                              ? toggleSelected(conversation.id)
                              : openConversation(conversation.id)
                          }
                          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
                        >
                          {isManaging ? (
                            <span
                              className={cn(
                                'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border',
                                selected &&
                                  'border-[var(--accent-orange)] bg-[var(--accent-orange)] text-white',
                              )}
                            >
                              {selected ? <Check className="h-3 w-3" /> : null}
                            </span>
                          ) : null}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-foreground text-sm">
                              {conversation.lastUserMessage || '新对话'}
                            </span>
                            <span className="mt-0.5 block text-muted-foreground text-xs">
                              {formatConversationTime(
                                conversation.lastMessagedAt,
                              )}
                            </span>
                          </span>
                        </button>

                        {!isManaging ? (
                          <button
                            type="button"
                            onClick={() =>
                              setPendingDeleteIds([conversation.id])
                            }
                            className="rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-focus-within:opacity-100 group-hover:opacity-100"
                            title="删除对话"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    )
                  })}
                </section>
              ) : null,
            )
          )}
        </div>
      </section>

      <AlertDialog
        open={pendingDeleteIds.length > 0}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPendingDeleteIds([])
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除历史对话？</AlertDialogTitle>
            <AlertDialogDescription>
              将永久删除所选的 {pendingDeleteIds.length}{' '}
              个对话及其中的消息，此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
