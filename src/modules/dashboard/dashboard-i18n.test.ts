import { describe, expect, it } from 'vitest'

import { getDashboardCopy } from './dashboard-i18n'

describe('getDashboardCopy', () => {
  it('returns English copy for an unknown locale string', () => {
    expect(getDashboardCopy('fr').sectionOwned).toBe('My documents')
  })

  it('returns Swedish copy for sv', () => {
    expect(getDashboardCopy('sv').sectionOwned).toBe('Mina dokument')
  })
})
