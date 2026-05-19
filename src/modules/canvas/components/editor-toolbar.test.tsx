import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EditorToolbar } from './editor-toolbar'

/** Accessible labels from `design/canvas.jsx` EditToolbar (`title` attributes). */
const FORMAT_BUTTON_LABELS = ['Bold', 'Italic', 'Strikethrough', 'Code', 'Bullet list'] as const

describe('EditorToolbar', () => {
  it('renders buttons for bold, italic, strikethrough, inline code, and bullet list', () => {
    render(<EditorToolbar />)

    for (const label of FORMAT_BUTTON_LABELS) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('each button has a correct accessible label', () => {
    render(<EditorToolbar />)

    for (const label of FORMAT_BUTTON_LABELS) {
      expect(screen.getByRole('button', { name: label })).toHaveAccessibleName(label)
    }
  })

  it('bold button has an active class when `isBoldActive` prop is true', () => {
    render(<EditorToolbar isBoldActive />)

    expect(screen.getByRole('button', { name: 'Bold' })).toHaveClass('is-active')
  })

  it('clicking an inactive bold button calls `onBold`', () => {
    const onBold = vi.fn()
    render(<EditorToolbar isBoldActive={false} onBold={onBold} />)

    fireEvent.click(screen.getByRole('button', { name: 'Bold' }))

    expect(onBold).toHaveBeenCalledTimes(1)
  })
})
