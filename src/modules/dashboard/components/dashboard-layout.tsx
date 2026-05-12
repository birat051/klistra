import Link from 'next/link'

import { personDisplayInitials } from '@/common/utils/person-initials'
import { getDashboardCopy, type IDashboardLocale } from '@/modules/dashboard/dashboard-i18n'
import {
  dashboardRoomToClientProps,
  type I_DASHBOARD_DashboardRoomRow,
} from '@/modules/dashboard/types'
import { dashboardGreetFirstName } from '@/modules/dashboard/utils/dashboard-greet-name'

import { DashboardCreateFab } from './dashboard-create-fab'
import { DashboardPage } from './dashboard-page'

import './dashboard-chrome.css'
import './dashboard-page.css'

export interface I_DASHBOARD_DashboardLayoutProps {
  locale: IDashboardLocale
  userDisplayName: string
  userEmail?: string
  owned: I_DASHBOARD_DashboardRoomRow[]
  collaborating: I_DASHBOARD_DashboardRoomRow[]
}

/** Server Component: chrome; client islands `DashboardPage` + `DashboardCreateFab`. */
export function DashboardLayout({
  locale,
  userDisplayName,
  userEmail,
  owned,
  collaborating,
}: I_DASHBOARD_DashboardLayoutProps) {
  const copy = getDashboardCopy(locale)
  const greetName = dashboardGreetFirstName(userDisplayName)

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
              {personDisplayInitials(userDisplayName)}
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

        <DashboardPage
          locale={locale}
          owned={owned.map(dashboardRoomToClientProps)}
          collaborating={collaborating.map(dashboardRoomToClientProps)}
          copy={copy}
        />
      </main>

      <DashboardCreateFab copy={copy} />
    </div>
  )
}
