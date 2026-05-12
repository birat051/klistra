/** Canvas module types — see `docs/PROJECT_GUIDELINES.MD` §3 */

/** Viewport: screen = world × scale + pan (see `canvas-transform.ts`). */
export interface I_CANVAS_Transform {
  x: number
  y: number
  scale: number
}

export interface I_CANVAS_Vec2 {
  x: number
  y: number
}

/** Hex string from {@link CANVAS_NOTE_COLOR_SWATCHES} (`constants/canvas-note-swatches.ts`). */
export type I_CANVAS_NoteSwatchHex =
  (typeof import('./constants/canvas-note-swatches').CANVAS_NOTE_COLOR_SWATCHES)[number]

/** Sticky note in canvas world space (see `note-geometry.ts`). */
export interface I_CANVAS_Note {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  authorId: string
  title: string
  body: string
}

export enum E_CANVAS_ActiveModal {
  CreateDocument = 'create-document',
  Invite = 'invite',
}
