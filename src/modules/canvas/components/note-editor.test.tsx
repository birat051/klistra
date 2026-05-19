import type { JSONContent } from '@tiptap/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { generateNoteHtml } from '@/modules/canvas/utils/generate-note-html'

import { NoteEditor } from './note-editor'

const sampleDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Workshop goals' }],
    },
  ],
}

const boldDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'emphasis', marks: [{ type: 'bold' }] }],
    },
  ],
}

const editorStub = {
  isDestroyed: false,
  isActive: vi.fn(() => false),
  chain: vi.fn(() => ({
    focus: vi.fn().mockReturnThis(),
    toggleHeading: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    toggleItalic: vi.fn().mockReturnThis(),
    toggleStrike: vi.fn().mockReturnThis(),
    toggleCode: vi.fn().mockReturnThis(),
    toggleBulletList: vi.fn().mockReturnThis(),
    toggleOrderedList: vi.fn().mockReturnThis(),
    toggleBlockquote: vi.fn().mockReturnThis(),
    extendMarkRange: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
    unsetLink: vi.fn().mockReturnThis(),
    run: vi.fn(),
  })),
  on: vi.fn(),
  off: vi.fn(),
  getJSON: vi.fn(() => sampleDoc),
  getAttributes: vi.fn(() => ({})),
  commands: {
    setContent: vi.fn(),
  },
}

const useEditorMock = vi.fn(() => editorStub)

vi.mock('@tiptap/react', () => ({
  useEditor: (options: unknown) => useEditorMock(options),
  EditorContent: ({ onBlur }: { onBlur?: () => void }) => (
    <div data-testid="klistra-note-editor-tiptap" onBlur={onBlur} role="textbox" />
  ),
}))

describe('NoteEditor', () => {
  beforeEach(() => {
    useEditorMock.mockClear()
    editorStub.isActive.mockClear()
    editorStub.on.mockClear()
    editorStub.off.mockClear()
  })

  it('renders static HTML output when `isEditing` is false', () => {
    render(<NoteEditor content={sampleDoc} isEditing={false} />)

    const staticView = screen.getByTestId('klistra-note-editor-static')
    expect(staticView).toBeInTheDocument()
    expect(staticView).toHaveTextContent('Workshop goals')
    expect(screen.queryByTestId('klistra-note-editor-tiptap')).not.toBeInTheDocument()
  })

  it('mounts the Tiptap editor when `isEditing` is true', () => {
    render(<NoteEditor content={sampleDoc} isEditing />)

    expect(screen.getByTestId('klistra-note-editor-tiptap')).toBeInTheDocument()
    expect(screen.queryByTestId('klistra-note-editor-static')).not.toBeInTheDocument()
    expect(useEditorMock).toHaveBeenCalled()
  })

  it('calls `onBlur` when the editor loses focus', () => {
    const onBlur = vi.fn()
    render(<NoteEditor content={sampleDoc} isEditing onBlur={onBlur} />)

    fireEvent.blur(screen.getByTestId('klistra-note-editor-tiptap'))

    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('static HTML matches `generate-note-html` output for a given doc snapshot', () => {
    render(<NoteEditor content={boldDoc} isEditing={false} />)

    expect(screen.getByTestId('klistra-note-editor-static').innerHTML).toBe(
      generateNoteHtml(boldDoc),
    )
  })
})
