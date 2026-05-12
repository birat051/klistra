import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'

import { getDashboardCopy } from '@/modules/dashboard/dashboard-i18n'

import { DashboardPage } from './dashboard-page'

const enCopy = getDashboardCopy('en')

function renderDashboardPage(ui: ReactElement) {
  return render(
    <div data-klistra-dashboard-page className="dash">
      <main className="dash-main">{ui}</main>
    </div>,
  )
}

describe('DashboardPage', () => {
  it('shows empty state when the owned document list is empty', () => {
    renderDashboardPage(<DashboardPage locale="en" copy={enCopy} owned={[]} collaborating={[]} />)

    expect(screen.getByRole('region', { name: 'My documents' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No documents yet' })).toBeInTheDocument()
    expect(
      screen.getByText('Pick up where you left off, or start something new.'),
    ).toBeInTheDocument()

    expect(screen.queryByRole('region', { name: 'Collaborating' })).not.toBeInTheDocument()
  })

  it('renders one DocumentCard per owned document under "My documents"', () => {
    renderDashboardPage(
      <DashboardPage
        locale="en"
        copy={enCopy}
        owned={[
          {
            id: 'room-1',
            name: 'Q2 Retro',
            ownerDisplayName: 'Jane Doe',
            updatedAtMillis: Date.now(),
          },
        ]}
        collaborating={[]}
      />,
    )

    expect(screen.getByRole('region', { name: 'My documents' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /my documents/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Q2 Retro' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'No documents yet' })).not.toBeInTheDocument()
  })

  it('renders one DocumentCard per document under "Collaborating"', () => {
    renderDashboardPage(
      <DashboardPage
        locale="en"
        copy={enCopy}
        owned={[]}
        collaborating={[
          {
            id: 'collab-1',
            name: 'Shared board',
            ownerDisplayName: 'Alex Kim',
            updatedAtMillis: Date.now(),
          },
        ]}
      />,
    )

    expect(screen.getByRole('region', { name: 'Collaborating' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Shared board' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: "Alex Kim's avatar" })).toBeInTheDocument()
  })

  it('hides the "Collaborating" section when the list is empty', () => {
    renderDashboardPage(
      <DashboardPage
        locale="en"
        copy={enCopy}
        owned={[
          {
            id: 'only-mine',
            name: 'Private notes',
            ownerDisplayName: 'Me Myself',
            updatedAtMillis: Date.now(),
          },
        ]}
        collaborating={[]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Private notes' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Collaborating' })).not.toBeInTheDocument()
  })
})
