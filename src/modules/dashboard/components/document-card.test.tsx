import { Timestamp } from 'firebase/firestore'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DocumentCard } from './document-card'

const MINUTE_MS = 60_000

describe('DocumentCard', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders document name, owner avatar initials, and formatted timestamp', () => {
    const now = new Date('2026-05-09T12:30:00.000Z')
    vi.useFakeTimers({ now })
    const updatedAt = Timestamp.fromMillis(now.getTime() - 5 * MINUTE_MS)
    render(
      <DocumentCard
        roomId="room-1"
        name="Q2 Notes"
        ownerDisplayName="Jane Doe"
        updatedAt={updatedAt}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Q2 Notes' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: "Jane Doe's avatar" })).toHaveTextContent('JD')
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.getByText('5 minutes ago')).toBeInTheDocument()
  })

  it('double-clicking the label puts it into rename mode', () => {
    render(
      <DocumentCard
        roomId="room-1"
        name="Q2 Notes"
        ownerDisplayName="Jane Doe"
        updatedAt={Timestamp.fromMillis(Date.now())}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Q2 Notes' }))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('pressing Escape in rename mode cancels and restores the original name', () => {
    render(
      <DocumentCard
        roomId="room-1"
        name="Original"
        ownerDisplayName="Jane Doe"
        updatedAt={Timestamp.fromMillis(Date.now())}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Original' }))
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Changed' } })
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' })
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Original' })).toBeInTheDocument()
  })

  it('blurring the rename input calls onRename with the new value', () => {
    const onRename = vi.fn()
    render(
      <DocumentCard
        roomId="room-1"
        name="Q2 Notes"
        ownerDisplayName="Jane Doe"
        updatedAt={Timestamp.fromMillis(Date.now())}
        onRename={onRename}
        onDelete={vi.fn()}
      />,
    )
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Q2 Notes' }))
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '  New Title  ' } })
    fireEvent.blur(input)
    expect(onRename).toHaveBeenCalledWith('New Title')
  })

  it('delete button triggers the confirmation dialog', () => {
    const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false)
    render(
      <DocumentCard
        roomId="room-1"
        name="Q2 Notes"
        ownerDisplayName="Jane Doe"
        updatedAt={Timestamp.fromMillis(Date.now())}
        onRename={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(confirmSpy).toHaveBeenCalled()
  })

  it('confirming delete calls onDelete with the correct roomId', () => {
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true)
    const onDelete = vi.fn()
    render(
      <DocumentCard
        roomId="room-1"
        name="Q2 Notes"
        ownerDisplayName="Jane Doe"
        updatedAt={Timestamp.fromMillis(Date.now())}
        onRename={vi.fn()}
        onDelete={onDelete}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledWith('room-1')
  })
})
