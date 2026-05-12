import { describe, expect, it } from 'vitest'

import type { I_CANVAS_Note } from '../types'

import { noteContainsPoint, snapToGrid } from './note-geometry'

function mockNote(overrides: Partial<I_CANVAS_Note> = {}): I_CANVAS_Note {
  return {
    id: 'n1',
    x: 10,
    y: 20,
    width: 100,
    height: 60,
    color: '#000',
    authorId: 'u1',
    title: '',
    body: '',
    ...overrides,
  }
}

describe('snapToGrid', () => {
  it('rounds x and y to the nearest grid increment', () => {
    expect(snapToGrid(7, 13, 10)).toEqual({ x: 10, y: 10 })
    expect(snapToGrid(14, -6, 8)).toEqual({ x: 16, y: -8 })
    expect(snapToGrid(2.4, 2.6, 1)).toEqual({ x: 2, y: 3 })
  })

  it('leaves coordinates unchanged when gridSize is not positive', () => {
    expect(snapToGrid(5, 5, 0)).toEqual({ x: 5, y: 5 })
    expect(snapToGrid(5, 5, -4)).toEqual({ x: 5, y: 5 })
  })
})

describe('noteContainsPoint', () => {
  it('returns true when point is inside note bounds', () => {
    const note = mockNote()
    expect(noteContainsPoint(note, 50, 40)).toBe(true)
    expect(noteContainsPoint(note, 10, 20)).toBe(true)
  })

  it('returns false when point is outside note bounds', () => {
    const note = mockNote()
    expect(noteContainsPoint(note, 5, 40)).toBe(false)
    expect(noteContainsPoint(note, 50, 10)).toBe(false)
    expect(noteContainsPoint(note, 200, 200)).toBe(false)
  })

  it('returns false on the right and bottom edges (half-open)', () => {
    const note = mockNote()
    expect(noteContainsPoint(note, 109.9, 50)).toBe(true)
    expect(noteContainsPoint(note, 110, 50)).toBe(false)
    expect(noteContainsPoint(note, 50, 79.9)).toBe(true)
    expect(noteContainsPoint(note, 50, 80)).toBe(false)
  })

  it('returns false when width or height is not positive', () => {
    expect(noteContainsPoint(mockNote({ width: 0 }), 10, 20)).toBe(false)
    expect(noteContainsPoint(mockNote({ height: -1 }), 10, 20)).toBe(false)
  })
})
