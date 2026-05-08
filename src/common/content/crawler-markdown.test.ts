import { describe, expect, it } from 'vitest'

import { LLMS_FULL_TXT, LLMS_TXT } from './crawler-markdown'

describe('crawler-markdown', () => {
  it('exports non-empty llms index and full file', () => {
    expect(LLMS_TXT.trim().length).toBeGreaterThan(80)
    expect(LLMS_FULL_TXT.trim().length).toBeGreaterThan(LLMS_TXT.length)
    expect(LLMS_TXT).toContain('# Klistra')
    expect(LLMS_TXT).toContain('/llms-full.txt')
    expect(LLMS_FULL_TXT).toContain('Firestore')
    expect(LLMS_FULL_TXT).toContain('Yjs')
  })
})
