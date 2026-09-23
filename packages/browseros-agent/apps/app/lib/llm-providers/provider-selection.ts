import type { LlmProviderConfig } from './types'

export const DEFAULT_PROVIDER_ID = 'qwen3-8-flash'
export const DEFAULT_PROVIDER_NAME = 'Qwen3.8 Flash'
export const DEFAULT_PROVIDER_BASE_URL =
  'https://llm-noonk4nwgh129jfn.cn-beijing.maas.aliyuncs.com/compatible-mode/v1'
export const DEFAULT_PROVIDER_MODEL_ID = 'qwen3.8-flash'

/** 判断提供商是否为智谱开放平台，兼容用户已保存的自定义显示名称和 ID。 */
/** 判断提供商是否为首次启动时创建的 Qwen 默认模型。 */
export function isDefaultQwenProvider(provider: LlmProviderConfig): boolean {
  return (
    provider.id === DEFAULT_PROVIDER_ID ||
    provider.modelId === DEFAULT_PROVIDER_MODEL_ID ||
    provider.baseUrl === DEFAULT_PROVIDER_BASE_URL
  )
}

/** Resolves the persisted default id, repairing stale values to the first provider. */
export function resolveDefaultProviderId(
  providers: LlmProviderConfig[],
  defaultProviderId: string | null | undefined,
): string {
  if (
    defaultProviderId &&
    providers.some((provider) => provider.id === defaultProviderId)
  ) {
    return defaultProviderId
  }
  return providers[0]?.id ?? DEFAULT_PROVIDER_ID
}

/** Resolves the provider selected by the persisted default id. */
export function resolveSelectedProvider(
  providers: LlmProviderConfig[],
  defaultProviderId: string,
): LlmProviderConfig | null {
  return (
    providers.find((provider) => provider.id === defaultProviderId) ??
    providers[0] ??
    null
  )
}
