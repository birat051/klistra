import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CANVAS_NOTE_COLOR_SWATCHES } from '@/modules/canvas/constants/canvas-note-swatches'

import { ColorPicker } from './color-picker'

describe('ColorPicker', () => {
  it('renders exactly 6 colour swatches', () => {
    render(
      <ColorPicker
        value={CANVAS_NOTE_COLOR_SWATCHES[0]}
        onChange={vi.fn()}
        groupAriaLabel="Note color"
      />,
    )

    const group = screen.getByRole('group', { name: 'Note color' })
    expect(group).toBeInTheDocument()
    const swatches = Array.from(group.querySelectorAll('button.cv-swatch'))
    expect(swatches).toHaveLength(6)
  })

  it('clicking a swatch calls onChange with the correct hex value', () => {
    const onChange = vi.fn()
    render(<ColorPicker value={CANVAS_NOTE_COLOR_SWATCHES[0]} onChange={onChange} />)

    const group = screen.getByRole('group', { name: 'Note color' })
    const buttons = Array.from(group.querySelectorAll('button.cv-swatch'))
    fireEvent.click(buttons[3] as HTMLButtonElement)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(CANVAS_NOTE_COLOR_SWATCHES[3])
  })

  it('active swatch has the correct aria-pressed state', () => {
    const activeIndex = 4
    const active = CANVAS_NOTE_COLOR_SWATCHES[activeIndex]
    render(<ColorPicker value={active} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: `Note color ${activeIndex + 1}` })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    for (let i = 0; i < CANVAS_NOTE_COLOR_SWATCHES.length; i += 1) {
      if (i === activeIndex) continue
      expect(screen.getByRole('button', { name: `Note color ${i + 1}` })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    }
  })
})
