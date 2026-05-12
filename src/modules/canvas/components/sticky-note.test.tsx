import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CANVAS_NOTE_COLOR_SWATCHES } from '@/modules/canvas/constants/canvas-note-swatches'

import { StickyNote } from './sticky-note'

describe('StickyNote', () => {
  const baseProps = {
    id: 'note-1',
    x: 12,
    y: 34,
    title: 'Kickoff',
    body: 'Workshop goals…',
    color: CANVAS_NOTE_COLOR_SWATCHES[0],
    isEditing: false,
    colorPickerOpen: false,
    onSelect: vi.fn(),
    onColorChange: vi.fn(),
  }

  it('renders with the correct background colour from props', () => {
    const color = CANVAS_NOTE_COLOR_SWATCHES[2]
    render(<StickyNote {...baseProps} color={color} />)

    expect(screen.getByTestId('klistra-sticky-note-note-1')).toHaveStyle({
      background: color,
    })
  })

  it('calls `onSelect` when clicked in non-edit mode', () => {
    const onSelect = vi.fn()
    render(<StickyNote {...baseProps} onSelect={onSelect} />)

    fireEvent.click(screen.getByTestId('klistra-sticky-note-note-1'))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('note-1')
  })

  it('does not call `onSelect` when already in edit mode', () => {
    const onSelect = vi.fn()
    render(<StickyNote {...baseProps} onSelect={onSelect} isEditing />)

    fireEvent.click(screen.getByTestId('klistra-sticky-note-note-1'))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('renders `ColorPicker` when colour picker is open', () => {
    render(<StickyNote {...baseProps} colorPickerOpen />)

    expect(screen.getByRole('group', { name: 'Note color' })).toBeInTheDocument()
  })

  it('calls `onColorChange` with the selected colour value', () => {
    const onColorChange = vi.fn()
    const onSelect = vi.fn()
    render(
      <StickyNote
        {...baseProps}
        colorPickerOpen
        onColorChange={onColorChange}
        onSelect={onSelect}
      />,
    )

    const group = screen.getByRole('group', { name: 'Note color' })
    const swatches = group.querySelectorAll('button.cv-swatch')
    fireEvent.click(swatches[2] as HTMLButtonElement)

    expect(onColorChange).toHaveBeenCalledTimes(1)
    expect(onColorChange).toHaveBeenCalledWith(CANVAS_NOTE_COLOR_SWATCHES[2])
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('calls `onMove` with updated coordinates when the note is dragged', () => {
    const onMove = vi.fn()
    render(<StickyNote {...baseProps} onMove={onMove} />)

    const el = screen.getByTestId('klistra-sticky-note-note-1')
    fireEvent.pointerDown(el, { clientX: 100, clientY: 100, pointerId: 1, button: 0 })
    fireEvent.pointerMove(el, { clientX: 115, clientY: 108, pointerId: 1 })
    fireEvent.pointerUp(el, { clientX: 115, clientY: 108, pointerId: 1 })

    expect(onMove).toHaveBeenCalled()
    expect(onMove.mock.calls.at(-1)).toEqual(['note-1', 12 + 15, 34 + 8])
  })

  it('still calls `onSelect` on a click when `onMove` is provided but the pointer does not drag', () => {
    const onMove = vi.fn()
    const onSelect = vi.fn()
    render(<StickyNote {...baseProps} onMove={onMove} onSelect={onSelect} />)

    const el = screen.getByTestId('klistra-sticky-note-note-1')
    fireEvent.pointerDown(el, { clientX: 50, clientY: 50, pointerId: 2, button: 0 })
    fireEvent.pointerUp(el, { clientX: 50, clientY: 50, pointerId: 2 })

    expect(onMove).not.toHaveBeenCalled()
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('note-1')
  })

  it('does not start a drag from the colour picker area', () => {
    const onMove = vi.fn()
    render(<StickyNote {...baseProps} colorPickerOpen onMove={onMove} />)

    const picker = document.querySelector('.cv-note__picker')
    expect(picker).toBeTruthy()
    fireEvent.pointerDown(picker as HTMLElement, {
      clientX: 0,
      clientY: 0,
      pointerId: 3,
      button: 0,
    })
    fireEvent.pointerMove(screen.getByTestId('klistra-sticky-note-note-1'), {
      clientX: 40,
      clientY: 40,
      pointerId: 3,
    })

    expect(onMove).not.toHaveBeenCalled()
  })
})
