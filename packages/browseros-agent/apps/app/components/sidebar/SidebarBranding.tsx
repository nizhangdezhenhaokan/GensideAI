import type { FC } from 'react'
import ProductLogo from '@/assets/product_logo.svg'
import { ThemeToggle } from '@/components/elements/theme-toggle'
import { useSessionInfo } from '@/lib/auth/sessionStorage'
import { cn } from '@/lib/utils'
import { useGraphqlQuery } from '@/modules/graphql/graphql-query.hooks'
import { GetProfileByUserIdDocument } from '@/screens/profile/graphql/profileDocument'

export interface SidebarBrandingProps {
  expanded?: boolean
}

export const SidebarBranding: FC<SidebarBrandingProps> = ({
  expanded = true,
}) => {
  const { sessionInfo } = useSessionInfo()

  const user = sessionInfo?.user
  const isLoggedIn = !!user

  const { data: profileData } = useGraphqlQuery(
    GetProfileByUserIdDocument,
    { userId: user?.id ?? '' },
    { enabled: !!user?.id },
  )

  const profile = profileData?.profileByUserId
  const profileName =
    profile?.firstName || profile?.lastName
      ? [profile.firstName, profile.lastName].filter(Boolean).join(' ')
      : null
  const displayName = profileName || user?.name || '用户'
  const displayImage = profile?.avatarUrl || user?.image

  const getInitials = (name?: string | null) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const headerIcon = isLoggedIn ? (
    displayImage ? (
      <img
        src={displayImage}
        alt={displayName}
        className="size-8 shrink-0 rounded-full object-cover"
      />
    ) : (
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
        {getInitials(displayName)}
      </div>
    )
  ) : (
    <img src={ProductLogo} alt="GensideAI" className="size-8" />
  )

  return (
    <div className="flex h-14 items-center justify-between border-b px-2">
      <div className="flex min-w-0 items-center gap-2 rounded-lg p-1.5">
        {headerIcon}
        <span
          className={cn(
            'truncate font-semibold transition-opacity duration-200',
            expanded ? 'opacity-100' : 'hidden',
          )}
        >
          {isLoggedIn ? displayName : 'GensideAI'}
        </span>
      </div>
      <div
        className={cn(
          'shrink-0 transition-opacity duration-200',
          expanded ? 'opacity-100' : 'hidden',
        )}
      >
        <ThemeToggle className="h-8 w-8" iconClassName="h-4 w-4" />
      </div>
    </div>
  )
}
