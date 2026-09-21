import { getBrowserOSAdapter } from './adapter'
import { BROWSEROS_PREFS } from './prefs'

/**
 * 隐藏已弃用的原生 Chat 工具栏入口，避免它与智慧小财神 Assistant 并存。
 */
export async function disableLlmChatToolbarButton(): Promise<void> {
  try {
    await getBrowserOSAdapter().setPref(BROWSEROS_PREFS.SHOW_LLM_CHAT, false)
  } catch {
    // 非 BrowserOS 环境没有原生偏好 API，忽略即可。
  }
}
