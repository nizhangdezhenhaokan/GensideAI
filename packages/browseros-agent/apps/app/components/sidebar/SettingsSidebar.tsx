import {
  Activity,
  ArrowLeft,
  BookOpen,
  Bot,
  Compass,
  MessageSquare,
  Palette,
  Server,
} from 'lucide-react'
import type { FC } from 'react'
import { NavLink } from 'react-router'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/elements/theme-toggle'
import { Feature } from '@/lib/browseros/capabilities'
import { cn } from '@/lib/utils'
import { useCapabilities } from '@/modules/browseros/capabilities.hooks'

type BaseNavItem = {
  name: string
  icon: typeof Bot
  feature?: Feature
}

type InternalNavItem = BaseNavItem & {
  href?: never
  to: string
}

type ComingSoonNavItem = BaseNavItem & {
  action: 'coming-soon'
  to?: never
}

type NavItem = InternalNavItem | ComingSoonNavItem

type NavSection = {
  label: string
  items: NavItem[]
}

function isComingSoonNavItem(item: NavItem): item is ComingSoonNavItem {
  return 'action' in item
}

const getNavLinkClassName = (isActive: boolean) =>
  cn(
    'flex h-9 items-center gap-2 overflow-hidden whitespace-nowrap rounded-md px-3 font-medium text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
  )

const getSectionClassName = (index: number) =>
  cn(index > 0 && 'mt-3 border-t pt-3')

const sectionLabelClassName =
  'mb-2 px-3 font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.18em]'

const primarySettingsSections: NavSection[] = [
  {
    label: '模型提供商设置',
    items: [
      { name: 'AI 与智能体', to: '/settings/ai', icon: Bot },
      {
        name: '对话与顾问服务',
        to: '/settings/chat',
        icon: MessageSquare,
      },
    ],
  },
  {
    label: '其他',
    items: [
      {
        name: '自定义 GensideAI',
        to: '/settings/customization',
        icon: Palette,
      },
      { name: '将 GensideAI 用作 MCP', to: '/settings/mcp', icon: Server },
    ],
  },
]

const helpItems: NavItem[] = [
  { name: '文档', action: 'coming-soon', icon: BookOpen },
  { name: '功能介绍', action: 'coming-soon', icon: Compass },
  { name: '诊断信息', to: '/settings/diagnostics', icon: Activity },
]

export const SettingsSidebar: FC = () => {
  const { supports } = useCapabilities()

  const filteredSections = primarySettingsSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.feature || supports(item.feature),
      ),
    }))
    .filter((section) => section.items.length > 0)

  const filteredHelpItems = helpItems.filter(
    (item) => !item.feature || supports(item.feature),
  )

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon

    if (isComingSoonNavItem(item)) {
      return (
        <button
          key={item.name}
          type="button"
          onClick={() =>
            toast.info('正在开发中，敬请期待！', { position: 'top-center' })
          }
          className={getNavLinkClassName(false)}
        >
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{item.name}</span>
        </button>
      )
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end
        className={({ isActive }) => getNavLinkClassName(isActive)}
      >
        <Icon className="size-4 shrink-0" />
        <span className="truncate">{item.name}</span>
      </NavLink>
    )
  }

  const renderSection = (section: NavSection, index: number) => (
    <div key={section.label} className={getSectionClassName(index)}>
      <div className={sectionLabelClassName}>{section.label}</div>
      <nav className="space-y-1">{section.items.map(renderNavItem)}</nav>
    </div>
  )

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center justify-between border-b px-2">
        <NavLink
          to="/home"
          className="flex h-9 items-center gap-2 overflow-hidden whitespace-nowrap rounded-md px-3 font-medium text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span className="truncate">返回</span>
        </NavLink>
        <ThemeToggle
          className="mr-1 h-8 w-8 shrink-0"
          iconClassName="h-4 w-4"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-2">
        <div className="mb-2 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          设置
        </div>
        <div>{filteredSections.map(renderSection)}</div>
        <div className="mt-auto pt-4">
          <div className={sectionLabelClassName}>帮助</div>
          <nav className="space-y-1">
            {filteredHelpItems.map(renderNavItem)}
          </nav>
        </div>
      </div>
    </div>
  )
}
