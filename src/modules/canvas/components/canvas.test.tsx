import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CANVAS_NOTE_COLOR_SWATCHES } from '@/modules/canvas/constants/canvas-note-swatches'
import type { I_CANVAS_Note, I_CANVAS_Transform } from '@/modules/canvas/types'
import { applyPan, applyZoom } from '@/modules/canvas/utils/canvas-transform'

import { CANVAS_WHEEL_ZOOM_FACTOR_IN, CANVAS_WHEEL_ZOOM_FACTOR_OUT, Canvas } from './canvas'

const domRect: DOMRect = {
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
  width: 800,
  height: 600,
  toJSON: () => ({}),
}

function mockNote(overrides: Partial<I_CANVAS_Note> = {}): I_CANVAS_Note {
  return {
    id: 'n1',
    x: 10,
    y: 20,
    width: 180,
    height: 120,
    color: CANVAS_NOTE_COLOR_SWATCHES[0],
    authorId: 'u1',
    title: 'Note title',
    body: 'Note body',
    ...overrides,
  }
}

function renderCanvas(
  ui: ReactElement,
): ReturnType<typeof render> & { canvas: HTMLElement; world: HTMLElement } {
  const wrapped = (
    <div style={{ height: 600, width: 800 }} data-klistra-canvas-test-root>
      {ui}
    </div>
  )
  const result = render(wrapped)
  const canvas = result.container.querySelector('.cv-canvas') as HTMLElement | null
  const world = result.container.querySelector('.cv-canvas-world') as HTMLElement | null
  if (!canvas || !world) {
    throw new Error('expected .cv-canvas and .cv-canvas-world')
  }
  return { ...result, canvas, world }
}

describe('Canvas', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(domRect)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders all notes from the provided list', () => {
    const notes = [
      mockNote({ id: 'note-a', title: 'One', body: 'a' }),
      mockNote({ id: 'note-b', title: 'Two', body: 'b' }),
    ]
    const transform: I_CANVAS_Transform = { x: 0, y: 0, scale: 1 }

    renderCanvas(
      <Canvas
        notes={notes}
        transform={transform}
        onTransformChange={vi.fn()}
        onCreateNote={vi.fn()}
      />,
    )

    expect(screen.getByTestId('klistra-sticky-note-note-a')).toBeInTheDocument()
    expect(screen.getByTestId('klistra-sticky-note-note-b')).toBeInTheDocument()
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('double-click on empty canvas area calls `onCreateNote` with the correct x/y coordinates', () => {
    const onCreateNote = vi.fn()
    const transform: I_CANVAS_Transform = { x: 0, y: 0, scale: 1 }

    const { world } = renderCanvas(
      <Canvas
        notes={[mockNote({ id: 'note-a' })]}
        transform={transform}
        onTransformChange={vi.fn()}
        onCreateNote={onCreateNote}
      />,
    )

    fireEvent.doubleClick(world, { clientX: 100, clientY: 220 })

    expect(onCreateNote).toHaveBeenCalledTimes(1)
    expect(onCreateNote).toHaveBeenCalledWith(100, 220)

    onCreateNote.mockClear()
    fireEvent.doubleClick(screen.getByTestId('klistra-sticky-note-note-a'))
    expect(onCreateNote).not.toHaveBeenCalled()
  })

  it('pointerdown + pointermove on the background updates the pan transform', () => {
    const onTransformChange = vi.fn()
    const t0: I_CANVAS_Transform = { x: 0, y: 0, scale: 1 }

    const { canvas } = renderCanvas(
      <Canvas
        notes={[mockNote()]}
        transform={t0}
        onTransformChange={onTransformChange}
        onCreateNote={vi.fn()}
      />,
    )

    fireEvent.pointerDown(canvas, { clientX: 50, clientY: 50, pointerId: 7, button: 0 })
    fireEvent.pointerMove(canvas, { clientX: 70, clientY: 65, pointerId: 7 })

    expect(onTransformChange).toHaveBeenCalledWith(applyPan(t0, { x: 20, y: 15 }))
  })

  it('scroll wheel calls `applyZoom` and updates the transform (zoom in / zoom out)', () => {
    const onTransformChange = vi.fn()
    const t0: I_CANVAS_Transform = { x: 0, y: 0, scale: 1 }

    const { canvas } = renderCanvas(
      <Canvas
        notes={[]}
        transform={t0}
        onTransformChange={onTransformChange}
        onCreateNote={vi.fn()}
      />,
    )

    fireEvent.wheel(canvas, { clientX: 400, clientY: 300, deltaY: -100 })

    expect(onTransformChange).toHaveBeenCalledWith(
      applyZoom(t0, CANVAS_WHEEL_ZOOM_FACTOR_IN, { x: 400, y: 300 }),
    )

    onTransformChange.mockClear()

    fireEvent.wheel(canvas, { clientX: 100, clientY: 200, deltaY: 100 })

    expect(onTransformChange).toHaveBeenCalledWith(
      applyZoom(t0, CANVAS_WHEEL_ZOOM_FACTOR_OUT, { x: 100, y: 200 }),
    )
  })
})
