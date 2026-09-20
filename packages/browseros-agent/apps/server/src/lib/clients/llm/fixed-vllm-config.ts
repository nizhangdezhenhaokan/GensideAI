/**
 * @license
 * Copyright 2025 BrowserOS
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { LLM_PROVIDERS, type LLMConfig } from '@browseros/shared/schemas/llm'

export const FIXED_VLLM_PROVIDER_ID = 'browseros-fixed-vllm'

export type FixedVllmConfig = Required<
  Pick<LLMConfig, 'provider' | 'providerId' | 'model' | 'baseUrl'>
> &
  Pick<LLMConfig, 'apiKey'>

/**
 * Reads the single OpenAI-compatible model owned by BrowserOS Server.
 *
 * Returning null keeps tests and installations that have not opted into the
 * fixed vLLM deployment working. Setting either required value opts in and
 * makes a partial configuration fail loudly instead of falling back to a
 * client-selected provider.
 */
export function loadFixedVllmConfig(
  env: Record<string, string | undefined> = process.env,
): FixedVllmConfig | null {
  const baseUrl = env.BROWSEROS_VLLM_BASE_URL?.trim()
  const model = env.BROWSEROS_VLLM_MODEL?.trim()
  const apiKey = env.BROWSEROS_VLLM_API_KEY?.trim()

  if (!baseUrl && !model && !apiKey) return null
  if (!baseUrl) {
    throw new Error(
      'BROWSEROS_VLLM_BASE_URL is required when fixed vLLM is configured',
    )
  }
  if (!model) {
    throw new Error(
      'BROWSEROS_VLLM_MODEL is required when fixed vLLM is configured',
    )
  }

  const parsedUrl = new URL(baseUrl)
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('BROWSEROS_VLLM_BASE_URL must use http or https')
  }

  return {
    provider: LLM_PROVIDERS.OPENAI_COMPATIBLE,
    providerId: FIXED_VLLM_PROVIDER_ID,
    model,
    baseUrl: baseUrl.replace(/\/+$/, ''),
    ...(apiKey && { apiKey }),
  }
}
