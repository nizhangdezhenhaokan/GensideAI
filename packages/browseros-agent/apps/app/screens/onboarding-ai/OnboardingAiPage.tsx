import type { FC } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'

/** The fixed Server-owned model needs no client-side provider onboarding. */
export const OnboardingAiPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-6">
      <div className="w-full max-w-lg space-y-5 rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="font-semibold text-3xl tracking-tight">智慧小财神</h1>
        <p className="text-muted-foreground">
          大模型已由 GensideAI 服务统一配置，无需选择或添加服务提供商。
        </p>
        <Button onClick={() => navigate('/home', { replace: true })}>
          开始使用
        </Button>
      </div>
    </div>
  )
}
