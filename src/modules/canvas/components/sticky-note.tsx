'use client'

import { memo, useCallback, useRef, useState } from 'react'

import { ColorPicker } from './color-picker'

import './sticky-note.css'

const DRAG_THRESHOLD_PX = 4

interface I_DragSession {
  pointerId: number
  startClientX: number
  startClientY: number
  origX: number
  origY: number
  didDrag: boolean
}

export interface I_CANVAS_StickyNoteProps {
  id: string
  x: number
  y: number
  /** Background (hex or CSS color). */
  color: string
  title: string
  body: string
  width?: number
  height?: number
  isEditing: boolean
  colorPickerOpen: boolean
  onSelect: (id: string) => void
  onColorChange: (hex: string) => void
  /**
   * When set (and not editing), pointer-drag moves the note in the parent coordinate space.
   * Client pointer delta is applied 1:1; the canvas layer can map to world space later if needed.
   */
  onMove?: (id: string, x: number, y: number) => void
}

export const StickyNote = memo(function StickyNote({
  id,
  x,
  y,
  color,
  title,
  body,
  width = 180,
  height,
  isEditing,
  colorPickerOpen,
  onSelect,
  onColorChange,
  onMove,
}: I_CANVAS_StickyNoteProps) {
  const dragRef = useRef<I_DragSession | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const draggable = Boolean(onMove) && !isEditing

  const handleRootClick = useCallback((): void => {
    if (isEditing || draggable) {
      return
    }
    onSelect(id)
  }, [draggable, id, isEditing, onSelect])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      if (!draggable || !onMove || e.button !== 0) {
        return
      }
      const target = e.target as HTMLElement | null
      if (target?.closest('.cv-note__picker')) {
        return
      }

      const el = e.currentTarget
      if (typeof el.setPointerCapture === 'function') {
        el.setPointerCapture(e.pointerId)
      }
      dragRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        origX: x,
        origY: y,
        didDrag: false,
      }
    },
    [draggable, onMove, x, y],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      const session = dragRef.current
      if (!session || !onMove || e.pointerId !== session.pointerId) {
        return
      }

      const dx = e.clientX - session.startClientX
      const dy = e.clientY - session.startClientY
      const distance = Math.hypot(dx, dy)

      if (!session.didDrag && distance >= DRAG_THRESHOLD_PX) {
        session.didDrag = true
        setIsDragging(true)
      }
      if (session.didDrag) {
        onMove(id, session.origX + dx, session.origY + dy)
      }
    },
    [id, onMove],
  )

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      const session = dragRef.current
      if (!session || e.pointerId !== session.pointerId) {
        return
      }

      try {
        if (typeof e.currentTarget.releasePointerCapture === 'function') {
          e.currentTarget.releasePointerCapture(e.pointerId)
        }
      } catch {
        /* capture not set or unsupported (e.g. jsdom) */
      }

      dragRef.current = null
      setIsDragging(false)

      if (!session.didDrag && !isEditing) {
        onSelect(id)
      }
    },
    [id, isEditing, onSelect],
  )

  const rootClass = `cv-note${draggable ? ' cv-note--draggable' : ''}${isDragging ? ' cv-note--dragging' : ''}`

  return (
    <div
      data-testid={`klistra-sticky-note-${id}`}
      className={rootClass}
      style={{
        left: x,
        top: y,
        width,
        ...(height !== undefined ? { height } : {}),
        background: color,
      }}
      onClick={handleRootClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {colorPickerOpen ? (
        <div
          className="cv-note__picker"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          <ColorPicker value={color} onChange={onColorChange} />
        </div>
      ) : null}
      <div className="cv-note__h">{title}</div>
      <div className="cv-note__b">{body}</div>
    </div>
  )
})
