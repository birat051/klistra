import type { I_CANVAS_Note, I_CANVAS_Vec2 } from '../types'

/**
 * Snaps world coordinates to the nearest grid intersection.
 * If `gridSize` is not positive, returns `{ x, y }` unchanged.
 */
export function snapToGrid(x: number, y: number, gridSize: number): I_CANVAS_Vec2 {
  if (!(gridSize > 0) || !Number.isFinite(gridSize)) {
    return { x, y }
  }
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  }
}

/**
 * Hit-test for an axis-aligned note rectangle in world space.
 * The right and bottom edges are exclusive (point on x + width or y + height is outside).
 *
 * Notes with non-positive `width` or `height` never contain a point.
 */
export function noteContainsPoint(note: I_CANVAS_Note, x: number, y: number): boolean {
  if (!(note.width > 0) || !(note.height > 0)) {
    return false
  }
  return x >= note.x && x < note.x + note.width && y >= note.y && y < note.y + note.height
}
