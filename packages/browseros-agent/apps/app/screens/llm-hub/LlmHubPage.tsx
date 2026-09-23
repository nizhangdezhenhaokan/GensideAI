import { type FC, useState } from 'react'
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
import type { LlmHubProvider } from '@/lib/llm-hub/storage'
import { useLlmHubProviders } from '@/modules/llm-hub/llm-hub.hooks'
import { AddHubProviderDialog } from './AddHubProviderDialog'
import { HubProvidersList } from './HubProvidersList'
import { LlmHubHeader } from './LlmHubHeader'

/** @public */
export const LlmHubPage: FC = () => {
  const { providers, isLoading, saveProvider, deleteProvider } =
    useLlmHubProviders()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const handleAddProvider = () => {
    setEditingIndex(null)
    setIsAddDialogOpen(true)
  }

  const handleEditProvider = (index: number) => {
    setEditingIndex(index)
    setIsAddDialogOpen(true)
  }

  const handleDeleteProvider = (index: number) => {
    setDeleteIndex(index)
  }

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      await deleteProvider(deleteIndex)
      setDeleteIndex(null)
    }
  }

  const handleSaveProvider = async (provider: LlmHubProvider) => {
    await saveProvider(provider, editingIndex ?? undefined)
  }

  const providerToDelete = deleteIndex !== null ? providers[deleteIndex] : null
  const editingProvider = editingIndex !== null ? providers[editingIndex] : null

  return (
    <div className="fade-in slide-in-from-bottom-5 animate-in space-y-6 duration-500">
      <LlmHubHeader />

      <HubProvidersList
        providers={providers}
        isLoading={isLoading}
        onEditProvider={handleEditProvider}
        onDeleteProvider={handleDeleteProvider}
        onAddProvider={handleAddProvider}
      />

      <AddHubProviderDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        initialValues={editingProvider}
        onSave={handleSaveProvider}
      />

      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => !open && setDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除服务提供商</AlertDialogTitle>
            <AlertDialogDescription>
              确定要从 LLM 对话提供商中删除“{providerToDelete?.name}”吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
