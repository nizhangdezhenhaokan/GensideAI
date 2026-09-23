// 验证旧版聊天入口迁移只影响内置默认项，不覆盖用户自定义配置。
import { describe, expect, it } from 'bun:test'
import { migrateLegacyHubProviders } from './storage'

describe('migrateLegacyHubProviders', () => {
  it('首次使用时只提供 DeepSeek', () => {
    expect(migrateLegacyHubProviders([])).toEqual([
      { name: 'DeepSeek', url: 'https://chat.deepseek.com' },
    ])
  })

  it('移除旧版内置项并保留自定义提供方', () => {
    expect(
      migrateLegacyHubProviders([
        { name: 'ChatGPT', url: 'https://chatgpt.com/' },
        { name: 'Claude', url: 'https://claude.ai/' },
        { name: 'Grok', url: 'https://grok.com/' },
        { name: 'Gemini', url: 'https://gemini.google.com/' },
        { name: 'Perplexity', url: 'https://www.perplexity.ai/' },
        { name: '自定义服务', url: 'https://example.com/chat' },
      ]),
    ).toEqual([
      { name: 'DeepSeek', url: 'https://chat.deepseek.com' },
      { name: '自定义服务', url: 'https://example.com/chat' },
    ])
  })

  it('保留用户修改过地址的同名提供方，重复迁移不再改变列表', () => {
    const providers = [
      { name: 'DeepSeek', url: 'https://chat.deepseek.com' },
      { name: 'ChatGPT', url: 'https://example.com/my-chat' },
    ]
    expect(migrateLegacyHubProviders(providers)).toEqual(providers)
    expect(
      migrateLegacyHubProviders(migrateLegacyHubProviders(providers)),
    ).toEqual(providers)
  })
})
