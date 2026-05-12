'use client'

import type { IDashboardCopy, IDashboardLocale } from '@/modules/dashboard/dashboard-i18n'
import type { I_DASHBOARD_DashboardRoomClientProps } from '@/modules/dashboard/types'
import {
  deleteDashboardRoom,
  renameDashboardRoom,
} from '@/modules/dashboard/utils/dashboard-room-actions'

import { DocumentCard } from './document-card'

import './dashboard-page.css'

export type { I_DASHBOARD_DashboardRoomClientProps }

export interface I_DASHBOARD_DashboardPageProps {
  locale: IDashboardLocale
  copy: IDashboardCopy
  owned?: I_DASHBOARD_DashboardRoomClientProps[]
  collaborating?: I_DASHBOARD_DashboardRoomClientProps[]
}

export function DashboardPage({
  locale,
  copy,
  owned = [],
  collaborating = [],
}: I_DASHBOARD_DashboardPageProps) {
  return (
    <>
      <section className="dash-section" aria-label={copy.sectionOwned}>
        <div className="dash-section__head">
          <h2 className="dash-section__title">
            {copy.sectionOwned}
            <span className="dash-section__count">
              {owned.length} {owned.length === 1 ? copy.countDoc : copy.countDocs}
            </span>
          </h2>
        </div>

        {owned.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty__art" aria-hidden="true">
              <div
                className="note"
                style={{
                  left: 0,
                  top: 0,
                  width: 80,
                  background: 'var(--note-mist)',
                  transform: 'rotate(-4deg)',
                }}
              >
                <div className="h">Brief</div>
              </div>
              <div
                className="note"
                style={{
                  left: 60,
                  top: 18,
                  width: 80,
                  background: 'var(--note-cream)',
                  transform: 'rotate(3deg)',
                }}
              >
                <div className="h">Idea</div>
              </div>
              <div
                className="note"
                style={{
                  left: 30,
                  top: 60,
                  width: 80,
                  background: 'var(--note-sage)',
                  transform: 'rotate(-2deg)',
                }}
              >
                <div className="h">Next</div>
              </div>
            </div>
            <h3>{copy.emptyOwnedHeading}</h3>
            <p>{copy.emptyOwnedSub}</p>
          </div>
        ) : (
          <div className="dash-grid">
            {owned.map((room) => (
              <DocumentCard
                key={room.id}
                locale={locale}
                roomId={room.id}
                name={room.name}
                ownerDisplayName={room.ownerDisplayName}
                updatedAtMillis={room.updatedAtMillis}
                deleteLabel={copy.delete}
                deleteConfirmMessage={copy.deleteConfirm}
                onRename={(newName) => renameDashboardRoom(room.id, newName)}
                onDelete={(roomId) => deleteDashboardRoom(roomId)}
              />
            ))}
          </div>
        )}
      </section>

      {collaborating.length > 0 ? (
        <section className="dash-section" aria-label={copy.sectionCollaborating}>
          <div className="dash-section__head">
            <h2 className="dash-section__title">
              {copy.sectionCollaborating}
              <span className="dash-section__count">
                {collaborating.length} {collaborating.length === 1 ? copy.countDoc : copy.countDocs}
              </span>
            </h2>
          </div>
          <div className="dash-grid">
            {collaborating.map((room) => (
              <DocumentCard
                key={room.id}
                locale={locale}
                roomId={room.id}
                name={room.name}
                ownerDisplayName={room.ownerDisplayName}
                updatedAtMillis={room.updatedAtMillis}
                deleteLabel={copy.delete}
                deleteConfirmMessage={copy.deleteConfirm}
                onRename={(newName) => renameDashboardRoom(room.id, newName)}
                onDelete={(roomId) => deleteDashboardRoom(roomId)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
