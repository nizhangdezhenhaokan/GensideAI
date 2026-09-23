import { beforeAll, describe, expect, it, mock } from 'bun:test'
import { type ComponentProps, createElement, type FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

type MockButtonProps = ComponentProps<'button'> & {
  variant?: string
  size?: string
}

mock.module('@/assets/browserclaw_logo.png', () => ({
  default: 'logo.png',
}))

mock.module('@/lib/metrics/track', () => ({
  track: () => {},
}))

mock.module('@/lib/sentry/sentry', () => ({
  sentry: {
    captureException: () => {},
  },
}))

mock.module('@/lib/constants/analyticsEvents', () => ({
  BROWSERCLAW_PROMO_BANNER_CLICKED_EVENT: 'ui.browserclaw_promo_banner.clicked',
  BROWSERCLAW_PROMO_BANNER_DISMISSED_EVENT:
    'ui.browserclaw_promo_banner.dismissed',
}))

mock.module('@/components/ui/button', () => ({
  Button: ({
    children,
    variant: _variant,
    size: _size,
    ...props
  }: MockButtonProps) =>
    createElement('button', { type: 'button', ...props }, children),
}))

mock.module('./browserclaw-promo.storage', () => ({
  browserClawPromoDismissedStorage: {
    getValue: async () => false,
    setValue: async () => {},
    watch: () => () => {},
  },
}))

let BrowserClawPromoBanner: FC
let BrowserClawPromoBannerCard: FC<{
  onOpen: () => void
  onDismiss: () => void
}>

beforeAll(async () => {
  const bannerModule = await import('./BrowserClawPromoBanner')
  BrowserClawPromoBanner = bannerModule.BrowserClawPromoBanner
  BrowserClawPromoBannerCard = bannerModule.BrowserClawPromoBannerCard
})

describe('BrowserClawPromoBanner', () => {
  it('renders the locked promo copy', () => {
    const html = renderToStaticMarkup(
      createElement(BrowserClawPromoBannerCard, {
        onOpen: () => {},
        onDismiss: () => {},
      }),
    )

    expect(html).toContain('探索另一款面向 AI 智能体的开源浏览器')
    expect(html).toContain('免费、开源，可前往项目网站了解详情并下载。')
    expect(html).toContain('Check it out')
  })

  it('renders nothing until persisted visibility resolves', () => {
    const html = renderToStaticMarkup(createElement(BrowserClawPromoBanner))

    expect(html).toBe('')
  })
})
