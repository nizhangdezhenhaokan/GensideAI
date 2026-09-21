import { REPORTER_EXTENSION_ID } from '@browseros/diagnostics/contract'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'
import { parseBrowserOSApiUrl } from './lib/browseros-api-url'
import { archiveSourceMaps } from './lib/build/archive-source-maps'
import { LEGACY_AGENT_EXTENSION_ID } from './lib/constants/legacyAgentExtensionId'
import { PRODUCT_WEB_HOST } from './lib/constants/productWebHost'

// biome-ignore lint/style/noProcessEnv: build config file needs env access
const env = process.env
const reactModuleUrl = import.meta.resolve('@wxt-dev/module-react')

const apiUrl = new URL(parseBrowserOSApiUrl(env.VITE_PUBLIC_BROWSEROS_API))
const apiPattern = apiUrl.port
  ? `${apiUrl.hostname}:${apiUrl.port}`
  : apiUrl.hostname

// 开发版也使用正式扩展身份，否则 BrowserOS 原生 Assistant 入口无法识别本地侧边栏。
const AGENT_EXTENSION_KEY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuJJHDZtn81+shqM3VDVgL/WqS8UWOK7e5xKsDVpSqC4ZvdFdlQPPveUHQE0TmuCvqenaEcMUzbXD9f1G7EumQx0uudi2wdt9UE5CSZ1eiQb/6Ic65Iku6Ejvb/us9JiYihpAd+39+fkgabaPqxgj9w5uEw96DE8CaiJPEMJLK21/GxBWa5DJaOsxWPypbJxGS9odac1k4tjckcB66T9/nY06IwZlhD96zEek3ymF5bSC9aPFTBDS8y/7IXCWW/ZF6pT5KLBA74CXM+G7VDzQjNKONiMTxwEVjovc5jTpkBgdFRxavD3O3cJQI6ys1+1aEWwpP7aKcHpqetv1xcNpQwIDAQAB'

// See https://wxt.dev/api/config.html
// Extension ID will be kkalmcdibbgkillhfegffgegpdpdoobl
export default defineConfig({
  outDir: 'dist',
  // Resolve from this workspace before WXT loads user modules. Bun on Windows
  // otherwise resolves WXT's string module id from its global package cache.
  modules: [reactModuleUrl],
  // web-ext's Chromium CDP runner currently fails on Windows after a
  // successful build. Keep WXT watching and load dist/chrome-mv3-dev manually.
  webExt: {
    disabled: process.platform === 'win32',
  },
  hooks: {
    // All Vite builds (including Sentry uploads) finish before this hook; WXT's
    // ZIP and the release CRX packer then consume the extension without maps.
    'build:done': (wxt, output) => archiveSourceMaps(wxt.config, output),
  },
  manifest: ({ mode }) => ({
    name: '智慧小财神',
    key: AGENT_EXTENSION_KEY,
    ...(mode === 'development'
      ? {}
      : {
          update_url:
            'https://cdn.browseros.com/extensions/update-manifest.xml',
        }),
    // update_url: 'https://cdn.browseros.com/extensions/update-manifest.alpha.xml',
    externally_connectable: {
      ids: [REPORTER_EXTENSION_ID],
      matches: [`https://${apiPattern}/*`, `https://*.${apiPattern}/*`],
    },
    web_accessible_resources: [
      {
        resources: ['app.html'],
        matches: [
          `https://${PRODUCT_WEB_HOST}/*`,
          `https://*.${PRODUCT_WEB_HOST}/*`,
        ],
        extension_ids: [LEGACY_AGENT_EXTENSION_ID],
      },
    ],
    chrome_url_overrides: {
      newtab: 'app.html',
    },
    options_ui: {
      page: 'app.html#/settings',
      open_in_tab: true,
    },
    action: {
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        128: 'icon/128.png',
      },
      default_title: 'Ask BrowserOS',
    },
    permissions: [
      'system.cpu',
      'system.memory',
      'topSites',
      'storage',
      'unlimitedStorage',
      'scripting',
      'tabs',
      'tabGroups',
      'sidePanel',
      'bookmarks',
      'history',
      'browserOS',
      'alarms',
      'webNavigation',
      'downloads',
    ],
    host_permissions: ['http://127.0.0.1/*'],
  }),
  vite: () => ({
    build: {
      sourcemap: 'hidden',
    },
    plugins: [
      tailwindcss(),
      ...(env.SENTRY_AUTH_TOKEN
        ? [
            sentryVitePlugin({
              org: env.SENTRY_ORG,
              project: env.SENTRY_PROJECT,
              authToken: env.SENTRY_AUTH_TOKEN,
              // archiveSourceMaps retains full maps after every upload finishes.
            }),
          ]
        : []),
    ],
  }),
})
