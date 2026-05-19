'use client'

import type { JSONContent } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'

import { CANVAS_NOTE_EDITOR_EXTENSIONS } from '@/modules/canvas/utils/note-editor-extensions'

import { NoteEditorToolbar } from './note-editor-toolbar'

import './note-editor.css'

export interface I_CANVAS_NoteEditorEditViewProps {
  content: JSONContent
  onBlur?: () => void
  onDone?: () => void
  color?: string
  onColorChange?: (hex: string) => void
  doneLabel?: string
}

export function NoteEditorEditView({
  content,
  onBlur,
  onDone,
  color,
  onColorChange,
  doneLabel,
}: I_CANVAS_NoteEditorEditViewProps) {
  const editor = useEditor({
    extensions: CANVAS_NOTE_EDITOR_EXTENSIONS,
    content,
    editable: true,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return
    }

    const current = editor.getJSON()
    if (JSON.stringify(current) !== JSON.stringify(content)) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useEffect(() => {
    if (!editor || !onBlur) {
      return
    }

    const handleBlur = (): void => {
      onBlur()
    }

    editor.on('blur', handleBlur)
    return () => {
      editor.off('blur', handleBlur)
    }
  }, [editor, onBlur])

  return (
    <div className="cv-note-editor">
      <NoteEditorToolbar
        editor={editor}
        color={color}
        onColorChange={onColorChange}
        onDone={onDone}
        doneLabel={doneLabel}
      />
      <EditorContent
        editor={editor}
        className="cv-note-editor__content"
        data-testid="klistra-note-editor-tiptap"
        onBlur={onBlur}
      />
    </div>
  )
}
