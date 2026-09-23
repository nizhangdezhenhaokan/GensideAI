import { Info, Keyboard } from 'lucide-react'
import type { FC } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface SidebarUserFooterProps {
  expanded?: boolean
  onOpenShortcuts?: () => void
}

export const SidebarUserFooter: FC<SidebarUserFooterProps> = ({
  expanded = true,
  onOpenShortcuts,
}) => {
  // const signInButton = (
  //   <Button
  //     variant="outline"
  //     className="h-9 w-full justify-start gap-2 overflow-hidden whitespace-nowrap px-3"
  //     disabled
  //   >
  //     <LogIn className="size-4 shrink-0" />
  //     <span
  //       className={cn(
  //         'truncate transition-opacity duration-200',
  //         expanded ? 'opacity-100' : 'opacity-0',
  //       )}
  //     >
  //       Sign in to BrowserOS
  //     </span>
  //   </Button>
  // )

  const aboutButton = (
    <Button
      type="button"
      variant="ghost"
      onClick={() =>
        toast.info('正在开发中，敬请期待！', { position: 'top-center' })
      }
      className="flex h-9 items-center gap-2 overflow-hidden whitespace-nowrap rounded-md px-3 font-medium text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <Info className="size-4 shrink-0" />
      <span
        className={cn(
          'truncate transition-opacity duration-200',
          expanded ? 'opacity-100' : 'opacity-0',
        )}
      >
        关于 GensideAI
      </span>
    </Button>
  )

  const shortcutsButton = (
    <Button
      variant="ghost"
      onClick={onOpenShortcuts}
      className="flex h-9 w-full items-center justify-start gap-2 overflow-hidden whitespace-nowrap rounded-md px-3 font-medium text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <Keyboard className="size-4 shrink-0" />
      <span
        className={cn(
          'truncate transition-opacity duration-200',
          expanded ? 'opacity-100' : 'opacity-0',
        )}
      >
        快捷键
      </span>
    </Button>
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="mt-auto space-y-1 border-t p-2">
        {expanded ? (
          shortcutsButton
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>{shortcutsButton}</TooltipTrigger>
            <TooltipContent side="right">快捷键</TooltipContent>
          </Tooltip>
        )}

        {expanded ? (
          aboutButton
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>{aboutButton}</TooltipTrigger>
            <TooltipContent side="right">关于 GensideAI</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
