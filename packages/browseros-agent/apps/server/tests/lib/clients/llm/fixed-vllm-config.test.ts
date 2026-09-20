import { describe, expect, it } from 'bun:test'
import {
  FIXED_VLLM_PROVIDER_ID,
  loadFixedVllmConfig,
} from '../../../../src/lib/clients/llm/fixed-vllm-config'

describe('loadFixedVllmConfig', () => {
  it('returns null when fixed vLLM is not configured', () => {
    expect(loadFixedVllmConfig({})).toBeNull()
  })

  it('creates one OpenAI-compatible provider', () => {
    expect(
      loadFixedVllmConfig({
        BROWSEROS_VLLM_BASE_URL: 'http://127.0.0.1:8000/v1/',
        BROWSEROS_VLLM_API_KEY: 'secret',
        BROWSEROS_VLLM_MODEL: 'Qwen/Qwen3-32B',
      }),
    ).toEqual({
      provider: 'openai-compatible',
      providerId: FIXED_VLLM_PROVIDER_ID,
      baseUrl: 'http://127.0.0.1:8000/v1',
      apiKey: 'secret',
      model: 'Qwen/Qwen3-32B',
    })
  })

  it('rejects a partial fixed configuration', () => {
    expect(() =>
      loadFixedVllmConfig({
        BROWSEROS_VLLM_BASE_URL: 'http://127.0.0.1:8000/v1',
      }),
    ).toThrow('BROWSEROS_VLLM_MODEL')
  })
})
