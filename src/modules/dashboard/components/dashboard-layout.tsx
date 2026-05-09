import Link from 'next/link'

import { getDashboardCopy, type IDashboardLocale } from '@/modules/dashboard/dashboard-i18n'
import type { I_DASHBOARD_DashboardRoomRow } from '@/modules/dashboard/types'

import { DashboardCreateFab } from './dashboard-create-fab'
import { DashboardPage } from './dashboard-page'

import './dashboard-chrome.css'
import './dashboard-page.css'

function userInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return '?'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function firstName(displayName: string): string {
  const part = displayName.trim().split(/\s+/)[0]
  return part || displayName || 'there'
}

export interface I_DASHBOARD_DashboardLayoutProps {
  locale: IDashboardLocale
  userDisplayName: string
  userEmail?: string
  owned: I_DASHBOARD_DashboardRoomRow[]
  collaborating: I_DASHBOARD_DashboardRoomRow[]
}

/** Server Component: chrome + document list. Client boundary is only `DashboardCreateFab`. */
export function DashboardLayout({
  locale,
  userDisplayName,
  userEmail,
  owned,
  collaborating,
}: I_DASHBOARD_DashboardLayoutProps) {
  const copy = getDashboardCopy(locale)
  const greetName = firstName(userDisplayName)

  return (
    <div data-klistra-dashboard-page className="dash">
      <header className="dashbar">
        <div className="dashbar__inner">
          <Link href={`/${locale}`} className="brand">
            <span className="brand__mark" aria-hidden="true" />
            <span className="brand__name">klistra</span>
          </Link>
          <div className="dash-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
            />
          </div>
          <button type="button" className="dash-sort">
            <span>{copy.sortRecent}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M2 4l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="dashbar__right">
            <button
              type="button"
              className="user-avatar"
              title={userEmail ?? userDisplayName}
              aria-label={copy.accountAria}
            >
              {userInitials(userDisplayName)}
            </button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <h1 className="dash-greet">
          {copy.greetA}
          <em>{greetName}</em>
          {copy.greetB}
        </h1>
        <p className="dash-sub">{copy.greetSub}</p>

        <DashboardPage locale={locale} owned={owned} collaborating={collaborating} copy={copy} />
      </main>

      <DashboardCreateFab copy={copy} />
    </div>
  )
}
