import type { JSONContent } from '@tiptap/core'
import { describe, expect, it } from 'vitest'

import { generateNoteHtml } from './generate-note-html'

const validDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hello note' }],
    },
  ],
}

const emptyDoc: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
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

const bulletListDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'First item' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Second item' }],
            },
          ],
        },
      ],
    },
  ],
}

describe('generateNoteHtml', () => {
  it('returns a non-empty HTML string for a valid Tiptap JSON doc', () => {
    const html = generateNoteHtml(validDoc)

    expect(html.length).toBeGreaterThan(0)
    expect(html).toContain('Hello note')
  })

  it('returns an empty paragraph string for an empty doc', () => {
    expect(generateNoteHtml(emptyDoc)).toBe('<p></p>')
  })

  it('preserves bold marks in the output HTML', () => {
    const html = generateNoteHtml(boldDoc)

    expect(html).toContain('<strong>emphasis</strong>')
  })

  it('preserves bullet list structure in the output HTML', () => {
    const html = generateNoteHtml(bulletListDoc)

    expect(html).toContain('<ul>')
    expect(html).toContain('<li>')
    expect(html).toContain('First item')
    expect(html).toContain('Second item')
  })
})
