import type { Extensions } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

/**
 * Tiptap extensions shared by {@link generateNoteHtml} and `note-editor.tsx`.
 * Matches MVP formatting: bold/italic/strike, inline code, H1/H2, lists, blockquote, links.
 */
export const CANVAS_NOTE_EDITOR_EXTENSIONS: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2] },
    link: {
      openOnClick: false,
    },
  }),
]
