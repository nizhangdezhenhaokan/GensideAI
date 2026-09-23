/**
 * @license
 * Copyright 2025 BrowserOS
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { LLMConfig } from '@browseros/shared/schemas/llm'
import {
  type FixedVllmConfig,
  loadFixedVllmConfig,
} from '../../lib/clients/llm/fixed-vllm-config'
import type { ProviderRow } from '../../lib/db/schema'
import type {
  BrowserOsChatRequest,
  HydratedBrowserOsChatRequest,
} from '../types'

export interface ChatProviderLookup {
  get(id: string): Promise<ProviderRow | null>
  getDefault(): Promise<ProviderRow | null>
}

export type HydrationResult =
  | {
      ok: true
      request: HydratedBrowserOsChatRequest
      /**
       * Whether the configuration came from a stored row rather than from the
       * request. The caller has to gate on this: supplying the user's
       * credentials is a privilege the request itself does not carry, where
       * sending its own is not.
       */
      usedStoredProvider: boolean
    }
  | { ok: false; error: string }

/**
 * 旧 BrowserOS 托管模型不再作为聊天回退。历史任务仍携带该 ID 时，
 * 改为读取当前默认模型；若默认项同样是旧模型，则明确拒绝请求。
 */
async function resolveStoredProvider(
  store: ChatProviderLookup,
  namedId?: string,
): Promise<ProviderRow | null> {
  const namedRow = namedId ? await store.get(namedId) : null
  const selectedRow = namedRow ?? (namedId ? null : await store.getDefault())

  if (selectedRow?.kind !== 'llm' || selectedRow.type !== 'browseros') {
    return selectedRow
  }

  if (!namedId) return null

  const defaultRow = await store.getDefault()
  if (defaultRow?.kind === 'llm' && defaultRow.type !== 'browseros') {
    return defaultRow
  }

  return null
}

function toLlmConfig(
  row: ProviderRow,
): Partial<LLMConfig> & { model?: string } {
  return {
    provider: row.type as LLMConfig['provider'],
    providerId: row.id,
    model: row.modelId ?? undefined,
    apiKey: row.apiKey ?? undefined,
    baseUrl: row.baseUrl ?? undefined,
    headers: row.headers ?? undefined,
    resourceName: row.resourceName ?? undefined,
    region: row.region ?? undefined,
    accessKeyId: row.accessKeyId ?? undefined,
    secretAccessKey: row.secretAccessKey ?? undefined,
    sessionToken: row.sessionToken ?? undefined,
    reasoningEffort: row.reasoningEffort as LLMConfig['reasoningEffort'],
    reasoningSummary: row.reasoningSummary as LLMConfig['reasoningSummary'],
  }
}

/**
 * Fills a chat request's provider configuration from the stored row.
 *
 * The server owns the provider list and which one is selected, so a client only
 * has to name an id, and with none given the selected provider is used. The
 * row wins over anything sent inline, because it is the source of truth and a
 * client may be holding a copy from before an edit.
 *
 * A request that names nothing the server knows keeps whatever it sent, which
 * is how a client from before this change still works: it ships the whole
 * configuration and never relies on the lookup.
 */
export async function hydrateChatProvider(
  request: BrowserOsChatRequest,
  store: ChatProviderLookup,
  fixedConfig: FixedVllmConfig | null = loadFixedVllmConfig(),
): Promise<HydrationResult> {
  if (fixedConfig) {
    return {
      ok: true,
      usedStoredProvider: true,
      request: {
        ...request,
        provider: fixedConfig.provider,
        providerId: fixedConfig.providerId,
        model: fixedConfig.model,
        baseUrl: fixedConfig.baseUrl,
        apiKey: fixedConfig.apiKey,
        headers: undefined,
        upstreamProvider: undefined,
        resourceName: undefined,
        region: undefined,
        accessKeyId: undefined,
        secretAccessKey: undefined,
        sessionToken: undefined,
        target: {
          type: 'browseros',
          providerId: fixedConfig.providerId,
        },
      },
    }
  }

  const namedId = request.target.providerId
  const row = await resolveStoredProvider(store, namedId)

  if (row && row.kind !== 'llm') {
    // Reached by naming an acp agent on the browseros path, or by having one
    // selected while the client sends no target. Falling through would run the
    // conversation on some other provider entirely.
    return {
      ok: false,
      error: `Provider ${row.id} is a coding agent and cannot serve a browseros chat request`,
    }
  }

  const hydrated = row
    ? { ...request, ...toLlmConfig(row) }
    : { ...request, providerId: namedId }

  // 旧客户端可能仍携带 BrowserOS 托管模型的完整配置。该配置不能绕过
  // 默认模型选择，否则在本地配置不可用时会重新访问已移除的托管回退。
  if (hydrated.provider === 'browseros') {
    return {
      ok: false,
      error: 'Legacy BrowserOS hosted provider is unavailable; select a default LLM provider',
    }
  }

  if (!hydrated.provider) {
    return {
      ok: false,
      error: namedId
        ? `Unknown or unavailable provider ${namedId}`
        : 'No provider given and none is selected',
    }
  }

  const providerId = row?.id ?? namedId
  if (!providerId) {
    return { ok: false, error: 'No provider given and none is selected' }
  }

  return {
    ok: true,
    usedStoredProvider: row !== null,
    request: {
      ...hydrated,
      provider: hydrated.provider,
      contextWindowSize: row?.contextWindow ?? request.contextWindowSize,
      supportsImages: row ? row.supportsImages : request.supportsImages,
      target: { type: 'browseros', providerId },
    },
  }
}
