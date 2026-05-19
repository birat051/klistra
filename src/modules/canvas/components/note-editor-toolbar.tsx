'use client'

import type { Editor } from '@tiptap/core'
import { useEffect, useState } from 'react'

import { ColorPicker } from './color-picker'
import { EditorToolbarButton } from './editor-toolbar-button'
import {
  EditorToolbarBoldIcon,
  EditorToolbarBulletsIcon,
  EditorToolbarCodeIcon,
  EditorToolbarH1Icon,
  EditorToolbarH2Icon,
  EditorToolbarItalicIcon,
  EditorToolbarLinkIcon,
  EditorToolbarOrderedIcon,
  EditorToolbarQuoteIcon,
  EditorToolbarStrikeIcon,
} from './editor-toolbar-icons'

import './editor-toolbar.css'

export interface I_CANVAS_NoteEditorToolbarProps {
  editor: Editor | null
  color?: string
  onColorChange?: (hex: string) => void
  onDone?: () => void
  doneLabel?: string
}

/** Full edit toolbar — design: `design/canvas.jsx` `EditToolbar`. */
export function NoteEditorToolbar({
  editor,
  color,
  onColorChange,
  onDone,
  doneLabel = 'Done',
}: I_CANVAS_NoteEditorToolbarProps) {
  const [, setRevision] = useState(0)

  useEffect(() => {
    if (!editor) {
      return
    }

    const refresh = (): void => {
      setRevision((value) => value + 1)
    }

    editor.on('selectionUpdate', refresh)
    editor.on('transaction', refresh)

    return () => {
      editor.off('selectionUpdate', refresh)
      editor.off('transaction', refresh)
    }
  }, [editor])

  function handleLink(): void {
    if (!editor) {
      return
    }

    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', previousUrl ?? 'https://')

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="cv-edit-toolbar" role="toolbar" aria-label="Note editor">
      <div className="cv-edit-toolbar__group">
        <EditorToolbarButton
          label="H1"
          isActive={editor?.isActive('heading', { level: 1 }) ?? false}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <EditorToolbarH1Icon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="H2"
          isActive={editor?.isActive('heading', { level: 2 }) ?? false}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <EditorToolbarH2Icon />
        </EditorToolbarButton>
      </div>
      <span className="cv-edit-toolbar__sep" aria-hidden />
      <div className="cv-edit-toolbar__group">
        <EditorToolbarButton
          label="Bold"
          isActive={editor?.isActive('bold') ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <EditorToolbarBoldIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Italic"
          isActive={editor?.isActive('italic') ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <EditorToolbarItalicIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Strikethrough"
          isActive={editor?.isActive('strike') ?? false}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <EditorToolbarStrikeIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Code"
          isActive={editor?.isActive('code') ?? false}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <EditorToolbarCodeIcon />
        </EditorToolbarButton>
      </div>
      <span className="cv-edit-toolbar__sep" aria-hidden />
      <div className="cv-edit-toolbar__group">
        <EditorToolbarButton
          label="Bullet list"
          isActive={editor?.isActive('bulletList') ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <EditorToolbarBulletsIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Numbered list"
          isActive={editor?.isActive('orderedList') ?? false}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <EditorToolbarOrderedIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Blockquote"
          isActive={editor?.isActive('blockquote') ?? false}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <EditorToolbarQuoteIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Link"
          isActive={editor?.isActive('link') ?? false}
          onClick={handleLink}
        >
          <EditorToolbarLinkIcon />
        </EditorToolbarButton>
      </div>
      {color !== undefined && onColorChange ? (
        <>
          <span className="cv-edit-toolbar__sep" aria-hidden />
          <ColorPicker value={color} onChange={onColorChange} groupAriaLabel="Note color" />
        </>
      ) : null}
      {onDone ? (
        <>
          <span className="cv-edit-toolbar__sep" aria-hidden />
          <button type="button" className="cv-edit-toolbar__done" onClick={onDone}>
            {doneLabel}
          </button>
        </>
      ) : null}
    </div>
  )
}
