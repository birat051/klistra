'use client'

import {
  EditorToolbarBoldIcon,
  EditorToolbarBulletsIcon,
  EditorToolbarCodeIcon,
  EditorToolbarItalicIcon,
  EditorToolbarStrikeIcon,
} from './editor-toolbar-icons'
import { EditorToolbarButton } from './editor-toolbar-button'

import './editor-toolbar.css'

export interface I_CANVAS_EditorToolbarProps {
  isBoldActive?: boolean
  onBold?: () => void
  onItalic?: () => void
  onStrikethrough?: () => void
  onInlineCode?: () => void
  onBulletList?: () => void
}

/** Inline formatting controls — design: `design/canvas.jsx` EditToolbar text group. */
export function EditorToolbar({
  isBoldActive = false,
  onBold,
  onItalic,
  onStrikethrough,
  onInlineCode,
  onBulletList,
}: I_CANVAS_EditorToolbarProps) {
  return (
    <div className="cv-edit-toolbar" role="toolbar" aria-label="Text formatting">
      <div className="cv-edit-toolbar__group">
        <EditorToolbarButton label="Bold" isActive={isBoldActive} onClick={onBold}>
          <EditorToolbarBoldIcon />
        </EditorToolbarButton>
        <EditorToolbarButton label="Italic" onClick={onItalic}>
          <EditorToolbarItalicIcon />
        </EditorToolbarButton>
        <EditorToolbarButton label="Strikethrough" onClick={onStrikethrough}>
          <EditorToolbarStrikeIcon />
        </EditorToolbarButton>
        <EditorToolbarButton label="Code" onClick={onInlineCode}>
          <EditorToolbarCodeIcon />
        </EditorToolbarButton>
        <EditorToolbarButton label="Bullet list" onClick={onBulletList}>
          <EditorToolbarBulletsIcon />
        </EditorToolbarButton>
      </div>
    </div>
  )
}
