import type { FC } from 'react'
import { ProviderIcon } from '@/lib/llm-providers/providerIcons'
import {
  type ProviderTemplate,
  providerTemplates,
} from '@/lib/llm-providers/providerTemplates'
import type { AcpAgentType } from '@/modules/agents/acp-agent-types'
import { AddProviderTile } from './AddProviderTile'

export interface AddProviderSectionProps {
  /** 保留兼容参数，避免其他调用方升级时中断；当前页面不再展示智能体入口。 */
  onCreateAgent?: (type: AcpAgentType) => void
  onCreateCustomAgent?: () => void
  onUseTemplate: (template: ProviderTemplate) => void
}

/** 仅展示用户当前可用的 OpenAI 兼容协议模型入口。 */
export const AddProviderSection: FC<AddProviderSectionProps> = ({
  onUseTemplate,
}) => {
  const compatibleTemplate = providerTemplates.find(
    (template) => template.id === 'openai-compatible',
  )

  if (!compatibleTemplate) return null

  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-base">添加模型</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <AddProviderTile
          label="OpenAI 兼容模型"
          icon={<ProviderIcon type={compatibleTemplate.id} size={26} />}
          onAdd={() => onUseTemplate(compatibleTemplate)}
        />
      </div>
    </section>
  )
}
