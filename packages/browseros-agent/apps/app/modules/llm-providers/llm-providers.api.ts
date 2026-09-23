import type { ProviderRoutes } from '@browseros/server'
import { hc } from 'hono/client'
import type { LlmProviderConfig } from '@/lib/llm-providers/types'
import { resolveAgentServerUrlWithRetry } from '@/modules/browseros/agent-server-url.helpers'
import { toProviderConfigs, toProviderPayload } from './llm-providers.helpers'
import { bumpProviderRevision } from './llm-providers.revision'

async function providersClient() {
  const baseUrl = await resolveAgentServerUrlWithRetry()
  return hc<ProviderRoutes>(`${baseUrl}/providers`)
}

export async function putProvider(config: LlmProviderConfig): Promise<void> {
  const client = await providersClient()
  const response = await client[':providerId'].$put({
    param: { providerId: config.id },
    json: toProviderPayload(config),
  })
  if (!response.ok) {
    throw new Error(`保存服务提供商失败（HTTP ${response.status}）`)
  }
  await bumpProviderRevision()
}

export async function deleteProvider(providerId: string): Promise<void> {
  const client = await providersClient()
  const response = await client[':providerId'].$delete({
    param: { providerId },
  })
  if (!response.ok && response.status !== 404) {
    throw new Error(`删除服务提供商失败（HTTP ${response.status}）`)
  }
  await bumpProviderRevision()
}

/** 获取服务端保存的默认服务提供商 ID。 */
export async function fetchDefaultProviderId(): Promise<string | null> {
  const client = await providersClient()
  const response = await client.default.$get()
  if (!response.ok) {
    throw new Error(`加载默认服务提供商失败（HTTP ${response.status}）`)
  }
  const { provider } = await response.json()
  return provider?.id ?? null
}

export async function putDefaultProvider(providerId: string): Promise<void> {
  const client = await providersClient()
  const response = await client.default.$put({ json: { providerId } })
  if (!response.ok) {
    throw new Error(`设置默认服务提供商失败（HTTP ${response.status}）`)
  }
  await bumpProviderRevision()
}

/** 获取服务端的完整服务提供商清单。 */
export async function listProviders(): Promise<LlmProviderConfig[]> {
  const client = await providersClient()
  const response = await client.index.$get()
  if (!response.ok) {
    throw new Error(`加载服务提供商失败（HTTP ${response.status}）`)
  }
  const { providers } = await response.json()
  return toProviderConfigs(providers)
}

/**
 * 获取前端可选择的模型。
 *
 * BrowserOS 托管模型仅保留在服务端历史数据中，智慧小财神前端不展示、
 * 不选择该模型，避免覆盖用户已经配置好的智谱模型。
 */
export async function fetchProviders(): Promise<LlmProviderConfig[]> {
  const configs = await listProviders()
  return configs.filter((provider) => provider.type !== 'browseros')
}

/**
 * 为非 React 调用方提供的列表读取接口；服务不可用时返回 null。
 */
export async function listProvidersOrNull(): Promise<
  LlmProviderConfig[] | null
> {
  try {
    return await listProviders()
  } catch {
    return null
  }
}
