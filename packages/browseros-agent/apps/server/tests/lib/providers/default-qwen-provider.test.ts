import { afterEach, describe, expect, test } from 'bun:test'
import { mkdtempSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { closeDb, initializeDb } from '../../../src/lib/db'
import {
  DEFAULT_QWEN_PROVIDER_ID,
  seedDefaultQwenProvider,
} from '../../../src/lib/providers/default-qwen-provider'
import { dbProviderStore } from '../../../src/lib/providers/provider-store'

describe('seedDefaultQwenProvider', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    closeDb()
    Bun.gc(true)
    await Promise.all(
      tempDirs.map((dir) =>
        rm(dir, {
          recursive: true,
          force: true,
          maxRetries: 3,
          retryDelay: 100,
        }),
      ),
    )
    tempDirs.length = 0
  })

  function useEmptyDatabase(): void {
    const dir = mkdtempSync(join(tmpdir(), 'browseros-qwen-seed-test-'))
    tempDirs.push(dir)
    initializeDb({ dbPath: join(dir, 'db', 'browseros.sqlite') })
  }

  test('首次启动会创建 Qwen3.8 Flash 并设为默认模型', async () => {
    useEmptyDatabase()

    await seedDefaultQwenProvider('test-qwen-key')

    expect(await dbProviderStore.getDefault()).toMatchObject({
      id: DEFAULT_QWEN_PROVIDER_ID,
      name: 'Qwen3.8 Flash',
      modelId: 'qwen3.8-flash',
      type: 'openai-compatible',
    })
    expect(
      (await dbProviderStore.getWithCredentials(DEFAULT_QWEN_PROVIDER_ID))
        ?.apiKey,
    ).toBe('test-qwen-key')
  })

  test('已有模型时不覆盖用户配置', async () => {
    useEmptyDatabase()
    await dbProviderStore.upsert({
      id: 'custom-model',
      type: 'openai-compatible',
      name: '用户模型',
      modelId: 'custom-model',
      contextWindow: 128000,
      apiKey: 'custom-key',
    })
    await dbProviderStore.setDefault('custom-model')

    await seedDefaultQwenProvider('test-qwen-key')

    expect(await dbProviderStore.get(DEFAULT_QWEN_PROVIDER_ID)).toBeNull()
    expect((await dbProviderStore.getDefault())?.id).toBe('custom-model')
  })

  test('会将旧 BrowserOS 托管默认项迁移为 Qwen3.8 Flash', async () => {
    useEmptyDatabase()
    await dbProviderStore.upsert({
      id: 'browseros',
      type: 'browseros',
      name: 'BrowserOS',
      modelId: 'browseros-auto',
      contextWindow: 200000,
    })
    await dbProviderStore.setDefault('browseros')

    await seedDefaultQwenProvider('test-qwen-key')

    expect((await dbProviderStore.getDefault())?.id).toBe(
      DEFAULT_QWEN_PROVIDER_ID,
    )
    expect(
      (await dbProviderStore.getWithCredentials(DEFAULT_QWEN_PROVIDER_ID))
        ?.apiKey,
    ).toBe('test-qwen-key')
    expect(await dbProviderStore.get('browseros')).toBeNull()
  })
})
