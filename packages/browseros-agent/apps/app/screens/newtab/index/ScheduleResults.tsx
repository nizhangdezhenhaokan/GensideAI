import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  RotateCcw,
  Square,
  Trash2,
  XCircle,
} from 'lucide-react'
import { type FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { RunResultDialog } from '@/components/ai-elements/run-result-dialog'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SCHEDULED_TASK_CANCELLED_EVENT,
  SCHEDULED_TASK_RETRIED_EVENT,
  SCHEDULED_TASK_VIEW_MORE_IN_NEWTAB_EVENT,
  SCHEDULED_TASK_VIEW_RESULTS_IN_NEWTAB_EVENT,
} from '@/lib/constants/analyticsEvents'
import { track } from '@/lib/metrics/track'
import {
  useScheduledJobRuns,
  useScheduledJobs,
} from '@/modules/schedules/schedules.hooks'
import {
  countRunningRuns,
  type JobRunWithDetails,
  selectDisplayedRuns,
} from './schedule-results.helpers'

dayjs.extend(relativeTime)

const MAX_DISPLAY_COUNT = 3
const SCHEDULE_RESULTS_COLLAPSED_KEY = 'schedule-results-collapsed'

const getStatusIcon = (status: JobRunWithDetails['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-accent-orange" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-destructive" />
  }
}

const formatTimestamp = (dateString: string) =>
  dayjs(dateString).locale('zh-cn').fromNow()

export const ScheduleResults: FC = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem(SCHEDULE_RESULTS_COLLAPSED_KEY)
    return stored !== 'true'
  })
  const [viewingRun, setViewingRun] = useState<JobRunWithDetails | null>(null)
  const [runToDelete, setRunToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    localStorage.setItem(SCHEDULE_RESULTS_COLLAPSED_KEY, (!open).toString())
  }

  const { jobRuns, cancelJobRun, removeJobRun } = useScheduledJobRuns()
  const { jobs, runJob } = useScheduledJobs()

  const runningCount = countRunningRuns(jobRuns)
  const displayedRuns = useMemo(
    () => selectDisplayedRuns(jobRuns, jobs, MAX_DISPLAY_COUNT),
    [jobRuns, jobs],
  )

  const viewRun = (run: JobRunWithDetails) => {
    track(SCHEDULED_TASK_VIEW_RESULTS_IN_NEWTAB_EVENT)
    setViewingRun(run)
  }

  const handleCancelRun = async (runId: string) => {
    await cancelJobRun(runId)
    track(SCHEDULED_TASK_CANCELLED_EVENT)
  }

  const handleRetryRun = async (jobId: string) => {
    await runJob(jobId)
    setViewingRun(null)
    track(SCHEDULED_TASK_RETRIED_EVENT)
  }

  // 等服务端确认删除后再关闭弹窗，失败时保留记录供用户重试。
  const handleDeleteRun = async () => {
    if (!runToDelete || isDeleting) return
    setIsDeleting(true)
    try {
      await removeJobRun(runToDelete)
      if (viewingRun?.id === runToDelete) setViewingRun(null)
      setRunToDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除执行记录失败')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewMore = () => {
    track(SCHEDULED_TASK_VIEW_MORE_IN_NEWTAB_EVENT)
    navigate('/scheduled')
  }

  if (!displayedRuns.length) return null

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={handleOpenChange}
      className="space-y-3"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="group flex h-auto w-full items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3 transition-all hover:border-border hover:bg-card"
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground text-sm">
              定时任务执行结果
            </span>
            {runningCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {runningCount} 个任务运行中
              </Badge>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="fade-in-0 slide-in-from-top-2 animate-in space-y-2 duration-200">
        {displayedRuns.map((run) => (
          <Button
            key={run.id}
            variant="ghost"
            onClick={() => viewRun(run)}
            className="h-auto w-full justify-start rounded-xl border border-border/50 bg-card p-4 text-left transition-all hover:border-border"
          >
            <div className="flex w-full items-start gap-3">
              {getStatusIcon(run.status)}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="truncate font-medium text-foreground text-sm">
                    {run.job?.name}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(run.startedAt)}
                  </span>
                </div>
                {run.result && (
                  <p className="line-clamp-2 text-ellipsis text-muted-foreground text-xs">
                    {run.result}
                  </p>
                )}
              </div>
              {run.status === 'running' && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelRun(run.id)
                  }}
                  className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label="取消任务"
                >
                  <Square className="h-3.5 w-3.5" />
                </Button>
              )}
              {run.status === 'failed' && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRetryRun(run.jobId)
                  }}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="重试任务"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
              {run.status !== 'running' && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setRunToDelete(run.id)
                  }}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="删除执行记录"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </Button>
        ))}
        <Button variant="ghost" onClick={handleViewMore} className="w-full">
          查看更多
        </Button>
      </CollapsibleContent>

      <RunResultDialog
        run={viewingRun}
        jobName={viewingRun?.job?.name}
        onOpenChange={(open) => !open && setViewingRun(null)}
        onCancelRun={handleCancelRun}
        onRetryRun={handleRetryRun}
      />
      <AlertDialog
        open={runToDelete !== null}
        onOpenChange={(open) => !open && !isDeleting && setRunToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除执行记录</AlertDialogTitle>
            <AlertDialogDescription>
              确定删除这条执行记录吗？删除后无法恢复，定时任务本身不会被删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault()
                void handleDeleteRun()
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  )
}
