import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/global.css'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner'
import { AnalyticsProvider } from '@/lib/analytics/AnalyticsProvider.tsx'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { enableLlmChatToolbarButton } from '@/lib/browseros/enableLlmChatToolbarButton'
import { mountFinanceSidebarTrigger } from '@/lib/browseros/mountFinanceSidebarTrigger'
import { QueryProvider } from '@/lib/graphql/QueryProvider'
import { loadProviders } from '@/lib/llm-hub/storage'
import { sentryRootErrorHandler } from '@/lib/sentry/sentryRootErrorHandler.ts'
import { App } from './App'

const $root = document.getElementById('root')

// BrowserOS 新标签页属于扩展自身页面，不能依赖普通网页内容脚本注入悬浮入口。
mountFinanceSidebarTrigger()
void enableLlmChatToolbarButton()
void loadProviders()

if ($root) {
  ReactDOM.createRoot($root, sentryRootErrorHandler).render(
    <React.StrictMode>
      <AuthProvider>
        <QueryProvider>
          <AnalyticsProvider>
            <ThemeProvider>
              <App />
              <Toaster />
            </ThemeProvider>
          </AnalyticsProvider>
        </QueryProvider>
      </AuthProvider>
    </React.StrictMode>,
  )
}
