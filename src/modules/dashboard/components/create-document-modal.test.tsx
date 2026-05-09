import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { getDashboardCopy } from '@/modules/dashboard/dashboard-i18n'

import { CreateDocumentModal } from './create-document-modal'

const enCopy = getDashboardCopy('en')

describe('CreateDocumentModal', () => {
  it('renders with an empty name input and disabled submit button', () => {
    render(<CreateDocumentModal copy={enCopy} onClose={vi.fn()} onCreate={vi.fn()} />)

    expect(screen.getByRole('heading', { level: 3, name: 'Name your canvas' })).toBeInTheDocument()
    expect(screen.getByText('You can rename it any time.')).toBeInTheDocument()

    const nameInput = screen.getByRole('textbox', { name: /e\.g\. sprint retro/i })
    expect(nameInput).toHaveValue('')

    expect(screen.getByRole('group', { name: /default note color/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Note color [1-6]$/ })).toHaveLength(6)

    expect(screen.getByRole('button', { name: 'Create canvas' })).toBeDisabled()
  })

  it('enables submit button once the name field is non-empty', () => {
    render(<CreateDocumentModal copy={enCopy} onClose={vi.fn()} onCreate={vi.fn()} />)

    const nameInput = screen.getByRole('textbox', { name: /e\.g\. sprint retro/i })
    const submit = screen.getByRole('button', { name: 'Create canvas' })

    expect(submit).toBeDisabled()
    fireEvent.change(nameInput, { target: { value: 'Q2 retro' } })
    expect(submit).not.toBeDisabled()
  })

  it('calls `onCreate` with the trimmed name on submit', () => {
    const onCreate = vi.fn()
    render(<CreateDocumentModal copy={enCopy} onClose={vi.fn()} onCreate={onCreate} />)

    fireEvent.change(screen.getByRole('textbox', { name: /e\.g\. sprint retro/i }), {
      target: { value: '  My Doc  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create canvas' }))

    expect(onCreate).toHaveBeenCalledTimes(1)
    expect(onCreate).toHaveBeenCalledWith('My Doc')
  })

  it('closes and resets on Escape key press', () => {
    const onClose = vi.fn()
    render(<CreateDocumentModal copy={enCopy} onClose={onClose} onCreate={vi.fn()} />)

    const nameInput = screen.getByRole('textbox', { name: /e\.g\. sprint retro/i })
    fireEvent.change(nameInput, { target: { value: 'Draft name' } })

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('textbox', { name: /e\.g\. sprint retro/i })).toHaveValue('')
  })
})
