import { beforeAll, describe, expect, it, mock } from 'bun:test'
import { createElement, type FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

mock.module('./MCPServerHeader', () => ({
  MCPServerHeader: () => createElement('div', null, 'server-header'),
}))

mock.module('./IntegrationsSection', () => ({
  IntegrationsSection: () => createElement('div', null, 'integrations'),
}))

mock.module('./MCPToolsSection', () => ({
  MCPToolsSection: () => createElement('div', null, 'tools'),
}))

mock.module('@/lib/browseros/helpers', () => ({
  getMcpServerUrl: async () => 'http://127.0.0.1:9200/mcp',
}))

let MCPSettingsPage: FC

beforeAll(async () => {
  MCPSettingsPage = (await import('./MCPSettingsPage')).MCPSettingsPage
})

describe('MCPSettingsPage', () => {
  it('renders the retained MCP configuration sections', () => {
    const html = renderToStaticMarkup(createElement(MCPSettingsPage))

    expect(html).toContain('server-header')
    expect(html).toContain('integrations')
    expect(html).toContain('tools')
  })
})
