import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, Lightbulb } from 'lucide-react'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v3'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(1, '请输入服务器名称'),
  url: z.string().url('请输入有效的 URL'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export interface AddCustomMCPDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddServer: (config: {
    name: string
    url: string
    description: string
  }) => void
}

export const AddCustomMCPDialog: FC<AddCustomMCPDialogProps> = ({
  open,
  onOpenChange,
  onAddServer,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
    },
  })

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset()
    }
    onOpenChange(isOpen)
  }

  const onSubmit = (values: FormValues) => {
    onAddServer({
      name: values.name,
      url: values.url,
      description: values.description ?? '',
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>添加自定义应用</DialogTitle>
          <DialogDescription>配置自定义应用连接</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>服务器名称</FormLabel>
                  <FormControl>
                    <Input placeholder="我的自定义应用" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MCP 服务器 URL</FormLabel>
                  <FormDescription>（仅支持 HTTP）</FormDescription>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="http://mcp.example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述（可选）</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="描述此服务器的用途……"
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Collapsible>
              <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-2 rounded-md border border-[var(--accent-orange)]/30 bg-[var(--accent-orange)]/5 px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--accent-orange)]/10">
                <Lightbulb className="h-4 w-4 shrink-0 text-[var(--accent-orange)]" />
                <span className="flex-1 font-medium">如何获取 URL？</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 rounded-md border border-[var(--accent-orange)]/30 bg-[var(--accent-orange)]/5 px-3 py-2 text-muted-foreground text-sm">
                Notion、Slack、Stripe 等应用提供了可在本地运行的 MCP
                服务器。请查阅应用文档中的 MCP 配置指南，即可获得一个
                URL（通常以{' '}
                <code className="inline rounded bg-muted px-1 text-xs">
                  http://
                </code>
                ）开头），并粘贴到这里。
              </CollapsibleContent>
            </Collapsible>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                取消
              </Button>
              <Button
                type="submit"
                className="bg-[var(--accent-orange)] text-white hover:bg-[var(--accent-orange-bright)]"
              >
                添加服务器
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
