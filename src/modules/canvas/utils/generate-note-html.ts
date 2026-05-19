import type { JSONContent } from '@tiptap/core'
import { generateHTML } from '@tiptap/html'

import { CANVAS_NOTE_EDITOR_EXTENSIONS } from './note-editor-extensions'

/** Renders a Tiptap JSON document as static HTML using the canvas note editor schema. */
export function generateNoteHtml(content: JSONContent): string {
  return generateHTML(content, CANVAS_NOTE_EDITOR_EXTENSIONS)
}
