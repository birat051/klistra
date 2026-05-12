'use client'

import { useCallback, useRef } from 'react'

import { applyPan, applyZoom } from '@/modules/canvas/utils/canvas-transform'

import type { I_CANVAS_Note, I_CANVAS_Transform } from '../types'

import { StickyNote } from './sticky-note'

import './canvas.css'

/** Kept in sync with wheel handler — tests import for expected `applyZoom` results. */
export const CANVAS_WHEEL_ZOOM_FACTOR_IN = 1.08 as const
export const CANVAS_WHEEL_ZOOM_FACTOR_OUT = 1 / CANVAS_WHEEL_ZOOM_FACTOR_IN

const WHEEL_ZOOM_IN = CANVAS_WHEEL_ZOOM_FACTOR_IN
const WHEEL_ZOOM_OUT = CANVAS_WHEEL_ZOOM_FACTOR_OUT

export interface I_CANVAS_CanvasProps {
  notes: I_CANVAS_Note[]
  transform: I_CANVAS_Transform
  onTransformChange: (next: I_CANVAS_Transform) => void
  onCreateNote: (worldX: number, worldY: number) => void
  selectedNoteId?: string | null
  onSelectNote?: (id: string | null) => void
  onMoveNote?: (id: string, x: number, y: number) => void
}

interface I_PanSession {
  pointerId: number
  startClientX: number
  startClientY: number
  orig: I_CANVAS_Transform
}

export function Canvas({
  notes,
  transform,
  onTransformChange,
  onCreateNote,
  selectedNoteId = null,
  onSelectNote,
  onMoveNote,
}: I_CANVAS_CanvasProps) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const panRef = useRef<I_PanSession | null>(null)

  const clientToWorld = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const stage = stageRef.current
      if (!stage) {
        return { x: 0, y: 0 }
      }
      const r = stage.getBoundingClientRect()
      const lx = clientX - r.left
      const ly = clientY - r.top
      return {
        x: (lx - transform.x) / transform.scale,
        y: (ly - transform.y) / transform.scale,
      }
    },
    [transform.x, transform.y, transform.scale],
  )

  const handleWorldDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      if ((e.target as HTMLElement).closest('.cv-note')) {
        return
      }
      const { x, y } = clientToWorld(e.clientX, e.clientY)
      onCreateNote(x, y)
    },
    [clientToWorld, onCreateNote],
  )

  const endPan = useCallback((e: React.PointerEvent<HTMLDivElement>): void => {
    const session = panRef.current
    if (!session || e.pointerId !== session.pointerId) {
      return
    }
    const el = e.currentTarget
    try {
      if (typeof el.releasePointerCapture === 'function') {
        el.releasePointerCapture(e.pointerId)
      }
    } catch {
      /* noop */
    }
    panRef.current = null
  }, [])

  const handlePanPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      if ((e.target as HTMLElement).closest('.cv-note')) {
        return
      }
      if (e.button !== 0) {
        return
      }
      const el = e.currentTarget
      if (typeof el.setPointerCapture === 'function') {
        el.setPointerCapture(e.pointerId)
      }
      panRef.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        orig: { ...transform },
      }
    },
    [transform],
  )

  const handlePanPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): void => {
      const session = panRef.current
      if (!session || e.pointerId !== session.pointerId) {
        return
      }
      const dx = e.clientX - session.startClientX
      const dy = e.clientY - session.startClientY
      onTransformChange(applyPan(session.orig, { x: dx, y: dy }))
    },
    [onTransformChange],
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>): void => {
      e.preventDefault()
      const stage = stageRef.current
      if (!stage) {
        return
      }
      const r = stage.getBoundingClientRect()
      const origin = { x: e.clientX - r.left, y: e.clientY - r.top }
      const factor = e.deltaY < 0 ? WHEEL_ZOOM_IN : WHEEL_ZOOM_OUT
      onTransformChange(applyZoom(transform, factor, origin))
    },
    [onTransformChange, transform],
  )

  return (
    <div className="cv-stage" ref={stageRef}>
      <div
        className="cv-canvas"
        onPointerDown={handlePanPointerDown}
        onPointerMove={handlePanPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onWheel={handleWheel}
      >
        <div
          className="cv-canvas-world"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
          onDoubleClick={handleWorldDoubleClick}
        >
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              id={note.id}
              x={note.x}
              y={note.y}
              width={note.width}
              height={note.height}
              color={note.color}
              title={note.title}
              body={note.body}
              isEditing={selectedNoteId === note.id}
              colorPickerOpen={false}
              onSelect={(id) => onSelectNote?.(id)}
              onColorChange={() => {}}
              onMove={onMoveNote ? (id, nx, ny) => onMoveNote(id, nx, ny) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
