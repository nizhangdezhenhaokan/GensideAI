import { Plus } from 'lucide-react'
import { type FC, useState } from 'react'
import { toast } from 'sonner'
import { CloudSyncRetiredNotice } from '@/components/cloud-sync/CloudSyncRetiredNotice'
import { BrowserClawPromoBanner } from '@/components/promo/BrowserClawPromoBanner'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { Button } from '@/components/ui/button'
import { testProvider } from '@/lib/llm-providers/testProvider'
import type { LlmProviderConfig } from '@/lib/llm-providers/types'
import { track } from '@/lib/metrics/track'
import { useAgentServerUrl } from '@/modules/browseros/agent-server-url.hooks'
import { useLlmProviders } from '@/modules/llm-providers/llm-providers.hooks'
import { AddProviderSection } from './AddProviderSection'
import { AddProviderDialogs, useAddProvider } from './add-provider.hooks'
import { ConfiguredTargetsList } from './ConfiguredTargetsList'
import { useCodingAgents } from './coding-agents.hooks'
import { useDefaultChatTarget } from './default-chat-target.hooks'
import { NewProviderDialog } from './NewProviderDialog'

/**
 * AI 与智能体设置页。
 *
 * 恢复 BrowserOS 原有的提供商、智能体和默认模型管理入口；智慧小财神
 * 侧边栏继续使用这里选择的默认模型。
 */
export const BrowserOsAiPane: FC = () => {
  const {
    providers,
    defaultProviderId,
    saveProvider,
    setDefaultProvider,
    deleteProvider,
    isUnavailable: providersUnavailable,
  } = useLlmProviders()
  const { baseUrl: agentServerUrl } = useAgentServerUrl()
  const coding = useCodingAgents()
  const defaultTarget = useDefaultChatTarget({
    providers,
    agents: coding.agents,
    defaultProviderId,
    setDefaultProvider,
  })
  const { effectiveTarget } = defaultTarget
  const selectedProviderId =
    effectiveTarget.kind === 'llm' ? effectiveTarget.id : null
  const selectedAgentId =
    effectiveTarget.kind === 'acp' ? effectiveTarget.id : null

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProvider, setEditingProvider] =
    useState<LlmProviderConfig | null>(null)
  const [providerToDelete, setProviderToDelete] =
    useState<LlmProviderConfig | null>(null)
  const [testingProviderId, setTestingProviderId] = useState<string | null>(
    null,
  )
  const addProvider = useAddProvider({ providers, saveProvider })

  const handleEditProvider = (provider: LlmProviderConfig) => {
    setEditingProvider(provider)
    setIsEditDialogOpen(true)
  }

  const confirmDeleteProvider = async () => {
    if (!providerToDelete) return

    const oauthFlow = addProvider.oauthFlows[providerToDelete.type]
    if (oauthFlow) {
      await oauthFlow.disconnect()
      track(oauthFlow.disconnectedEvent)
    }

    await deleteProvider(providerToDelete.id)
    setProviderToDelete(null)
  }

  const handleTestProvider = async (provider: LlmProviderConfig) => {
    if (!agentServerUrl) {
      toast.error('连接测试失败', { description: '暂时无法连接到 GensideAI 服务。' })
      return
    }

    setTestingProviderId(provider.id)
    try {
      const result = await testProvider(provider, agentServerUrl)
      if (result.success) {
        toast.success('连接测试成功', { description: result.message })
      } else {
        toast.error('连接测试失败', { description: result.message })
      }
    } catch (error) {
      toast.error('连接测试失败', {
        description: error instanceof Error ? error.message : '发生未知错误。',
      })
    } finally {
      setTestingProviderId(null)
    }
  }

  return (
    <div className="fade-in slide-in-from-bottom-5 animate-in space-y-6 duration-500">
      <div>
        <h2 className="font-semibold text-xl">AI 与智能体</h2>
        <p className="text-muted-foreground text-sm">
          选择用于对话的模型，并连接您正在使用的其他 AI 服务。
        </p>
      </div>

      <CloudSyncRetiredNotice />

      <BrowserClawPromoBanner />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-base">
            已配置的提供商
            <span className="ml-1 font-normal text-muted-foreground">
              （{providers.length + coding.agents.length}）
            </span>
          </h3>
          <Button onClick={() => addProvider.openProviderForm()}>
            <Plus className="size-4" />
            添加
          </Button>
        </div>

        {providersUnavailable ? (
          <Alert variant="destructive">
            <AlertDescription>
              无法连接 GensideAI 服务，暂时不能加载提供商列表。已保存的配置不会丢失。
            </AlertDescription>
          </Alert>
        ) : null}

        <ConfiguredTargetsList
          providers={providers}
          coding={coding}
          selectedProviderId={selectedProviderId}
          selectedAgentId={selectedAgentId}
          testingProviderId={testingProviderId}
          onSelectProvider={defaultTarget.selectProvider}
          onSelectAgent={defaultTarget.selectAgent}
          onTestProvider={handleTestProvider}
          onEditProvider={handleEditProvider}
          onDeleteProvider={setProviderToDelete}
          onEditAgent={addProvider.openCustomAgentEditor}
        />
      </section>

      <AddProviderSection
        onUseTemplate={addProvider.onUseTemplate}
      />

      <AddProviderDialogs
        controller={addProvider}
        allowedProviderTypes={['openai-compatible']}
      />

      <NewProviderDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialValues={editingProvider ?? undefined}
        allowedProviderTypes={['openai-compatible']}
        onSave={async (provider) => {
          await saveProvider(provider)
        }}
      />

      <AlertDialog
        open={providerToDelete !== null}
        onOpenChange={(open) => !open && setProviderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除服务提供商</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除“{providerToDelete?.name}”吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProvider}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
