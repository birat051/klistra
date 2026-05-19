'use client'

import type { JSONContent } from '@tiptap/core'

import { generateNoteHtml } from '@/modules/canvas/utils/generate-note-html'

import { NoteEditorEditView } from './note-editor-edit-view'

import './note-editor.css'

export interface I_CANVAS_NoteEditorProps {
  content: JSONContent
  isEditing: boolean
  onBlur?: () => void
  onDone?: () => void
  color?: string
  onColorChange?: (hex: string) => void
  doneLabel?: string
}

/** Tiptap note body — static HTML when idle, live editor + full toolbar when editing. */
export function NoteEditor({
  content,
  isEditing,
  onBlur,
  onDone,
  color,
  onColorChange,
  doneLabel,
}: I_CANVAS_NoteEditorProps) {
  if (!isEditing) {
    return (
      <div
        data-testid="klistra-note-editor-static"
        className="cv-note__b cv-note-editor__static"
        dangerouslySetInnerHTML={{ __html: generateNoteHtml(content) }}
      />
    )
  }

  return (
    <NoteEditorEditView
      content={content}
      onBlur={onBlur}
      onDone={onDone}
      color={color}
      onColorChange={onColorChange}
      doneLabel={doneLabel}
    />
  )
}
