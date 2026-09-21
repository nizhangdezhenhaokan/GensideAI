// 统一创建右侧智慧小财神入口，供普通网页内容脚本和 BrowserOS 新标签页共同复用。
import {
  RuntimeMessageType,
  sendRuntimeMessage,
} from '@/lib/messaging/runtime/runtimeMessages'

const FLOAT_TRIGGER_HOST_ID = 'browseros-finance-sidebar-trigger-host'

/**
 * 使用 Shadow DOM 隔离业务页面样式，确保入口在不同网站和新标签页上保持原型外观。
 */
export function mountFinanceSidebarTrigger(): void {
  if (document.getElementById(FLOAT_TRIGGER_HOST_ID)) return

  const host = document.createElement('div')
  host.id = FLOAT_TRIGGER_HOST_ID
  const shadowRoot = host.attachShadow({ mode: 'open' })
  const style = document.createElement('style')
  style.textContent = `
    :host {
      all: initial;
    }

    .finance-sidebar-float-trigger {
      position: fixed;
      z-index: 2147483646;
      top: 50%;
      right: 0;
      display: block;
      padding: 12px 6px;
      border: 0;
      border-radius: 8px 0 0 8px;
      color: #ffffff;
      background: linear-gradient(180deg, #3ca2f4 0%, #009d8f 100%);
      box-shadow: -2px 0 12px rgba(46, 134, 222, 0.4);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.35;
      letter-spacing: 2px;
      writing-mode: vertical-lr;
      cursor: pointer;
      transform: translateY(-50%);
      transition: filter 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }

    .finance-sidebar-float-trigger:hover {
      filter: brightness(1.06) saturate(1.08);
      box-shadow: -3px 0 16px rgba(46, 134, 222, 0.5);
      transform: translateY(-50%) translateX(-1px);
    }

    .finance-sidebar-float-trigger:focus-visible {
      outline: 2px solid rgba(255, 255, 255, 0.95);
      outline-offset: -3px;
    }

    .finance-sidebar-float-trigger.is-busy {
      cursor: wait;
      opacity: 0.78;
    }
  `

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'finance-sidebar-float-trigger'
  button.textContent = '智慧小财神'
  button.title = '打开或收起智慧小财神'
  button.setAttribute('aria-label', '打开或收起智慧小财神侧边栏')

  button.addEventListener('click', async () => {
    if (button.classList.contains('is-busy')) return
    button.classList.add('is-busy')
    button.disabled = true

    try {
      const result = await sendRuntimeMessage(
        RuntimeMessageType.toggleSidePanel,
      )
      button.setAttribute('aria-pressed', String(result.opened))
    } catch (error) {
      const currentError =
        error instanceof Error ? error : new Error(String(error))
      // biome-ignore lint/suspicious/noConsole: 内容脚本无法直接写入后台日志，控制台需保留完整故障上下文。
      console.error(
        `[${new Date().toISOString()}] mountFinanceSidebarTrigger 点击切换失败：` +
          `errorType=${currentError.name}，message=${currentError.message}，` +
          `url=${window.location.href}，stack=${currentError.stack ?? '无堆栈信息'}`,
      )
    } finally {
      button.disabled = false
      button.classList.remove('is-busy')
    }
  })

  shadowRoot.append(style, button)
  document.documentElement.appendChild(host)
}
