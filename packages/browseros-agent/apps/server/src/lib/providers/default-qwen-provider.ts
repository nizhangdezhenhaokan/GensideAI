import { logger } from '../logger'
import { dbProviderStore } from './provider-store'

/** 首次启动时写入的 Qwen 提供商固定标识，供默认选择稳定引用。 */
export const DEFAULT_QWEN_PROVIDER_ID = 'qwen3-8-flash'

const DEFAULT_QWEN_PROVIDER = {
  id: DEFAULT_QWEN_PROVIDER_ID,
  type: 'openai-compatible',
  name: 'Qwen3.8 Flash',
  baseUrl:
    'https://llm-noonk4nwgh129jfn.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
  modelId: 'qwen3.8-flash',
  supportsImages: false,
  contextWindow: 128000,
  temperature: 0.2,
} as const

/**
 * 仅在没有任何模型提供商的新数据库中创建 Qwen 默认项。
 * API 密钥仅从服务端环境变量读取，避免进入扩展包或前端存储。
 */
export async function seedDefaultQwenProvider(
  apiKey = "sk-ws-H.PIYRDDM.bnu4.MEUCIHnWQd4Ts-iGOb9m9tBkvFF-0EopEEV-e_NouvHkj6ccAiEAmi9VVg-guvVF-9BBDNaYDajyx6C5LNBhp2pFdWg9zNI",
): Promise<void> {
  const existingProviders = await dbProviderStore.listLlm()
  const legacyBrowserOSProvider = existingProviders.find(
    (provider) => provider.id === 'browseros' && provider.type === 'browseros',
  )
  const existingQwenProvider = existingProviders.find(
    (provider) => provider.id === DEFAULT_QWEN_PROVIDER_ID,
  )

  // 用户已有自定义模型时不覆盖选择；仅新数据库和旧 BrowserOS 托管项需要迁移。
  if (existingProviders.length > 0 && !legacyBrowserOSProvider) return

  if (!apiKey) {
    logger.warn(
      'Skipped Qwen default provider initialization: QWEN_API_KEY is missing',
      {
        providerId: DEFAULT_QWEN_PROVIDER_ID,
        modelId: DEFAULT_QWEN_PROVIDER.modelId,
      },
    )
    return
  }

  const qwenProvider =
    existingQwenProvider ??
    (await dbProviderStore.insertIfAbsent({
      ...DEFAULT_QWEN_PROVIDER,
      apiKey,
    }))
  if (!qwenProvider) return

  const defaultSet = await dbProviderStore.setDefault(qwenProvider.id)
  if (!defaultSet) {
    throw new Error(
      `Qwen default provider could not be selected: providerId=${qwenProvider.id}`,
    )
  }

  if (legacyBrowserOSProvider) {
    await dbProviderStore.remove(legacyBrowserOSProvider.id)
  }

  logger.info('Initialized Qwen default provider', {
    providerId: qwenProvider.id,
    modelId: qwenProvider.modelId,
    baseUrl: qwenProvider.baseUrl,
    migratedLegacyBrowserOSProvider: Boolean(legacyBrowserOSProvider),
  })
}
