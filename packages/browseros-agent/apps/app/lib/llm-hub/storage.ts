import { getBrowserOSAdapter } from '@/lib/browseros/adapter'
import { BROWSEROS_PREFS } from '@/lib/browseros/prefs'

/** @public */
export interface LlmHubProvider {
  name: string
  url: string
}

const DEFAULT_DEEPSEEK_PROVIDER: LlmHubProvider = {
  name: 'DeepSeek',
  url: 'https://chat.deepseek.com',
}

const LEGACY_DEFAULT_PROVIDER_HOSTS = new Map([
  ['ChatGPT', 'chatgpt.com'],
  ['Claude', 'claude.ai'],
  ['Grok', 'grok.com'],
  ['Gemini', 'gemini.google.com'],
  ['Perplexity', 'perplexity.ai'],
])

// 仅清除旧版内置的名称与官网地址组合，避免误删用户自定义的同名提供方。
export function migrateLegacyHubProviders(
  providers: LlmHubProvider[],
): LlmHubProvider[] {
  const retained = providers.filter((provider) => {
    const legacyHost = LEGACY_DEFAULT_PROVIDER_HOSTS.get(provider.name)
    if (!legacyHost) return true

    try {
      const url = new URL(provider.url)
      return !(
        url.hostname.toLowerCase().replace(/^www\./, '') === legacyHost &&
        (url.pathname === '/' || url.pathname === '') &&
        !url.search &&
        !url.hash
      )
    } catch {
      return true
    }
  })

  if (retained.some((provider) => provider.name === 'DeepSeek')) {
    return retained
  }

  return [DEFAULT_DEEPSEEK_PROVIDER, ...retained]
}

export async function loadProviders(): Promise<LlmHubProvider[]> {
  try {
    const adapter = getBrowserOSAdapter()
    const providersPref = await adapter.getPref(
      BROWSEROS_PREFS.THIRD_PARTY_LLM_PROVIDERS,
    )
    const providers = (providersPref?.value as LlmHubProvider[]) || []
    const migrated = migrateLegacyHubProviders(providers)
    if (
      migrated.length !== providers.length ||
      migrated.some((provider, index) => provider !== providers[index])
    ) {
      await adapter.setPref(BROWSEROS_PREFS.THIRD_PARTY_LLM_PROVIDERS, migrated)
    }
    return migrated
  } catch {
    return []
  }
}

export async function saveProviders(
  providers: LlmHubProvider[],
): Promise<boolean> {
  try {
    const adapter = getBrowserOSAdapter()
    return await adapter.setPref(
      BROWSEROS_PREFS.THIRD_PARTY_LLM_PROVIDERS,
      providers,
    )
  } catch {
    return false
  }
}

export function getFaviconUrl(url: string, size = 128): string | undefined {
  try {
    const normalized = url.trim()
    if (!normalized) return undefined
    const parsed = new URL(
      normalized.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)
        ? normalized
        : `https://${normalized}`,
    )
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=${size}`
  } catch {
    return undefined
  }
}
