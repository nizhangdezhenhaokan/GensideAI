import { Server } from 'lucide-react'
import type { FC } from 'react'

/** The model is provisioned once by BrowserOS Server; clients cannot switch it. */
export const BrowserOsAiPane: FC = () => {
  return (
    <div className="fade-in slide-in-from-bottom-5 animate-in space-y-6 duration-500">
      <div>
        <h2 className="font-semibold text-xl">AI 模型</h2>
        <p className="text-muted-foreground text-sm">
          智慧小财神使用由 BrowserOS Server 统一配置的固定模型
        </p>
      </div>

      <section className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <Server className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div className="space-y-1">
          <h3 className="font-medium">智慧小财神</h3>
          <p className="text-muted-foreground text-sm">
            模型、接口地址和访问凭据由服务端维护，无需在扩展中添加或切换服务提供商。
          </p>
        </div>
      </section>
    </div>
  )
}
