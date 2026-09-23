import { getBrowserOSAdapter } from './adapter'
import { BROWSEROS_PREFS } from './prefs'

/**
 * 恢复原生 Chat 工具栏入口，使其在浏览器右上角重新可见。
 */
export async function enableLlmChatToolbarButton(): Promise<void> {
  try {
    await getBrowserOSAdapter().setPref(BROWSEROS_PREFS.SHOW_LLM_CHAT, true)
  } catch {
    // 非 BrowserOS 环境没有原生偏好设置 API，无需阻断扩展页面加载。
  }
}
