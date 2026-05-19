import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NoteEditorToolbar } from './note-editor-toolbar'

interface I_ChainMock {
  focus: ReturnType<typeof vi.fn>
  toggleHeading: ReturnType<typeof vi.fn>
  toggleBold: ReturnType<typeof vi.fn>
  toggleItalic: ReturnType<typeof vi.fn>
  toggleStrike: ReturnType<typeof vi.fn>
  toggleCode: ReturnType<typeof vi.fn>
  toggleBulletList: ReturnType<typeof vi.fn>
  toggleOrderedList: ReturnType<typeof vi.fn>
  toggleBlockquote: ReturnType<typeof vi.fn>
  extendMarkRange: ReturnType<typeof vi.fn>
  setLink: ReturnType<typeof vi.fn>
  unsetLink: ReturnType<typeof vi.fn>
  run: ReturnType<typeof vi.fn>
}

interface I_EditorMock {
  isActive: ReturnType<typeof vi.fn>
  chain: ReturnType<typeof vi.fn>
  getAttributes: ReturnType<typeof vi.fn>
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
}

function createEditorMock(): { editor: I_EditorMock; chain: I_ChainMock } {
  const chain: I_ChainMock = {
    focus: vi.fn(),
    toggleHeading: vi.fn(),
    toggleBold: vi.fn(),
    toggleItalic: vi.fn(),
    toggleStrike: vi.fn(),
    toggleCode: vi.fn(),
    toggleBulletList: vi.fn(),
    toggleOrderedList: vi.fn(),
    toggleBlockquote: vi.fn(),
    extendMarkRange: vi.fn(),
    setLink: vi.fn(),
    unsetLink: vi.fn(),
    run: vi.fn(),
  }

  chain.focus.mockReturnValue(chain)
  chain.toggleHeading.mockReturnValue(chain)
  chain.toggleBold.mockReturnValue(chain)
  chain.toggleItalic.mockReturnValue(chain)
  chain.toggleStrike.mockReturnValue(chain)
  chain.toggleCode.mockReturnValue(chain)
  chain.toggleBulletList.mockReturnValue(chain)
  chain.toggleOrderedList.mockReturnValue(chain)
  chain.toggleBlockquote.mockReturnValue(chain)
  chain.extendMarkRange.mockReturnValue(chain)
  chain.setLink.mockReturnValue(chain)
  chain.unsetLink.mockReturnValue(chain)
  chain.run.mockReturnValue(true)

  const editor: I_EditorMock = {
    isActive: vi.fn(() => false),
    chain: vi.fn(() => chain),
    getAttributes: vi.fn(() => ({ href: undefined })),
    on: vi.fn(),
    off: vi.fn(),
  }

  return { editor, chain }
}

describe('NoteEditorToolbar', () => {
  it('renders full toolbar controls and subscribes/unsubscribes editor listeners', () => {
    const { editor } = createEditorMock()
    const { unmount } = render(<NoteEditorToolbar editor={editor as never} />)

    for (const label of [
      'H1',
      'H2',
      'Bold',
      'Italic',
      'Strikethrough',
      'Code',
      'Bullet list',
      'Numbered list',
      'Blockquote',
      'Link',
    ]) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }

    expect(editor.on).toHaveBeenCalledWith('selectionUpdate', expect.any(Function))
    expect(editor.on).toHaveBeenCalledWith('transaction', expect.any(Function))

    unmount()

    expect(editor.off).toHaveBeenCalledWith('selectionUpdate', expect.any(Function))
    expect(editor.off).toHaveBeenCalledWith('transaction', expect.any(Function))
  })

  it('runs formatting commands when toolbar buttons are clicked', () => {
    const { editor, chain } = createEditorMock()
    render(<NoteEditorToolbar editor={editor as never} />)

    fireEvent.click(screen.getByRole('button', { name: 'H1' }))
    expect(chain.toggleHeading).toHaveBeenCalledWith({ level: 1 })

    fireEvent.click(screen.getByRole('button', { name: 'H2' }))
    expect(chain.toggleHeading).toHaveBeenCalledWith({ level: 2 })

    fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }))
    fireEvent.click(screen.getByRole('button', { name: 'Strikethrough' }))
    fireEvent.click(screen.getByRole('button', { name: 'Code' }))
    fireEvent.click(screen.getByRole('button', { name: 'Bullet list' }))
    fireEvent.click(screen.getByRole('button', { name: 'Numbered list' }))
    fireEvent.click(screen.getByRole('button', { name: 'Blockquote' }))

    expect(chain.toggleBold).toHaveBeenCalled()
    expect(chain.toggleItalic).toHaveBeenCalled()
    expect(chain.toggleStrike).toHaveBeenCalled()
    expect(chain.toggleCode).toHaveBeenCalled()
    expect(chain.toggleBulletList).toHaveBeenCalled()
    expect(chain.toggleOrderedList).toHaveBeenCalled()
    expect(chain.toggleBlockquote).toHaveBeenCalled()
    expect(chain.run).toHaveBeenCalled()
  })

  it('handles link action branches from prompt', () => {
    const { editor, chain } = createEditorMock()
    render(<NoteEditorToolbar editor={editor as never} />)

    const promptSpy = vi.spyOn(window, 'prompt')

    promptSpy.mockReturnValueOnce(null)
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    expect(chain.setLink).not.toHaveBeenCalled()
    expect(chain.unsetLink).not.toHaveBeenCalled()

    promptSpy.mockReturnValueOnce('')
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    expect(chain.unsetLink).toHaveBeenCalled()
    expect(chain.extendMarkRange).toHaveBeenCalledWith('link')

    promptSpy.mockReturnValueOnce('https://example.com')
    fireEvent.click(screen.getByRole('button', { name: 'Link' }))
    expect(chain.setLink).toHaveBeenCalledWith({ href: 'https://example.com' })

    promptSpy.mockRestore()
  })

  it('renders optional color picker and done button', () => {
    const { editor } = createEditorMock()
    const onColorChange = vi.fn()
    const onDone = vi.fn()

    render(
      <NoteEditorToolbar
        editor={editor as never}
        color="#cfe0ec"
        onColorChange={onColorChange}
        onDone={onDone}
        doneLabel="Done now"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Note color 3' }))
    expect(onColorChange).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Done now' }))
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
