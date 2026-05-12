import { describe, expect, it } from 'vitest'

import {
  CANVAS_ZOOM_MAX,
  CANVAS_ZOOM_MIN,
  applyPan,
  applyZoom,
  clampZoom,
} from './canvas-transform'

describe('applyPan', () => {
  it('shifts x and y by the delta values', () => {
    const t0 = { x: 10, y: -20, scale: 1.5 }
    expect(applyPan(t0, { x: 3, y: 7 })).toEqual({ x: 13, y: -13, scale: 1.5 })
  })

  it('does not mutate the input transform', () => {
    const t0 = { x: 0, y: 0, scale: 1 }
    applyPan(t0, { x: 1, y: 2 })
    expect(t0).toEqual({ x: 0, y: 0, scale: 1 })
  })
})

describe('applyZoom', () => {
  it('scales around the provided origin point (world under cursor stays fixed)', () => {
    const t0 = { x: 0, y: 0, scale: 1 }
    const origin = { x: 100, y: 50 }
    const t1 = applyZoom(t0, 2, origin)

    expect(t1.scale).toBe(2)
    const worldX = (origin.x - t0.x) / t0.scale
    const worldY = (origin.y - t0.y) / t0.scale
    expect(origin.x - worldX * t1.scale).toBeCloseTo(t1.x)
    expect(origin.y - worldY * t1.scale).toBeCloseTo(t1.y)

    const screenX = worldX * t1.scale + t1.x
    const screenY = worldY * t1.scale + t1.y
    expect(screenX).toBeCloseTo(origin.x)
    expect(screenY).toBeCloseTo(origin.y)
  })

  it('works when the viewport is already panned', () => {
    const t0 = { x: 30, y: -10, scale: 1 }
    const origin = { x: 100, y: 100 }
    const t1 = applyZoom(t0, 1.25, origin)
    const worldX = (origin.x - t0.x) / t0.scale
    const worldY = (origin.y - t0.y) / t0.scale
    expect(worldX * t1.scale + t1.x).toBeCloseTo(origin.x)
    expect(worldY * t1.scale + t1.y).toBeCloseTo(origin.y)
  })
})

describe('clampZoom', () => {
  it('returns min when scale is below bounds', () => {
    expect(clampZoom(0.1)).toBe(CANVAS_ZOOM_MIN)
  })

  it('returns max when scale is above bounds', () => {
    expect(clampZoom(10)).toBe(CANVAS_ZOOM_MAX)
  })

  it('returns the value unchanged when within bounds', () => {
    expect(clampZoom(1)).toBe(1)
    expect(clampZoom(CANVAS_ZOOM_MIN)).toBe(CANVAS_ZOOM_MIN)
    expect(clampZoom(CANVAS_ZOOM_MAX)).toBe(CANVAS_ZOOM_MAX)
  })
})
