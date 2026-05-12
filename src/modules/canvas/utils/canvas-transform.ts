import type { I_CANVAS_Transform, I_CANVAS_Vec2 } from '../types'

/** Default zoom limits for `clampZoom` (multiplicative scale). */
export const CANVAS_ZOOM_MIN = 0.25
export const CANVAS_ZOOM_MAX = 4

/**
 * Clamps a zoom level to [{@link CANVAS_ZOOM_MIN}, {@link CANVAS_ZOOM_MAX}].
 */
export function clampZoom(scale: number): number {
  return Math.min(CANVAS_ZOOM_MAX, Math.max(CANVAS_ZOOM_MIN, scale))
}

/**
 * Returns a new transform with pan offset applied (screen-space pixels).
 */
export function applyPan(transform: I_CANVAS_Transform, delta: I_CANVAS_Vec2): I_CANVAS_Transform {
  return {
    x: transform.x + delta.x,
    y: transform.y + delta.y,
    scale: transform.scale,
  }
}

/**
 * Zooms by a **multiplicative** factor (`nextScale ≈ scale * delta`) while keeping the world
 * point under `origin` (screen coordinates) fixed: `screen = world * scale + pan`.
 *
 * The resulting scale is passed through {@link clampZoom}; pan is updated so the focal
 * world point still maps to `origin` after zoom.
 */
export function applyZoom(
  transform: I_CANVAS_Transform,
  delta: number,
  origin: I_CANVAS_Vec2,
): I_CANVAS_Transform {
  const prevScale = transform.scale
  const nextScale = clampZoom(prevScale * delta)

  if (prevScale === 0) {
    return { ...transform, scale: nextScale }
  }

  const worldX = (origin.x - transform.x) / prevScale
  const worldY = (origin.y - transform.y) / prevScale

  return {
    x: origin.x - worldX * nextScale,
    y: origin.y - worldY * nextScale,
    scale: nextScale,
  }
}
