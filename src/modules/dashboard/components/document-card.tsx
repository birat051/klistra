'use client'

import { Timestamp } from 'firebase/firestore'
import { useRef, useState } from 'react'

import { formatTimestamp, type IFormatTimestampLocale } from '@/common/utils/format-timestamp'
import { personDisplayInitials } from '@/common/utils/person-initials'
import {
  documentCardAvatarBackground,
  documentCardOwnerFirstName,
} from '@/modules/dashboard/utils/document-card-display'

import './document-card.css'

interface I_DASHBOARD_DocumentCardProps {
  locale?: IFormatTimestampLocale
  roomId: string
  name: string
  ownerDisplayName: string
  /** Unix ms (RSC-safe); converted to `Timestamp` inside for formatting. */
  updatedAtMillis: number
  deleteLabel?: string
  deleteConfirmMessage?: string
  onRename: (newName: string) => void
  onDelete: (roomId: string) => void
}

export function DocumentCard({
  locale = 'en',
  roomId,
  name,
  ownerDisplayName,
  updatedAtMillis,
  deleteLabel = 'Delete',
  deleteConfirmMessage = 'Delete this document?',
  onRename,
  onDelete,
}: I_DASHBOARD_DocumentCardProps) {
  const updatedAt = Timestamp.fromMillis(updatedAtMillis)
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState('')
  const skipBlurCommitRef = useRef(false)

  function startRename(): void {
    setDraftName(name)
    setIsRenaming(true)
  }

  function cancelRename(): void {
    skipBlurCommitRef.current = true
    setIsRenaming(false)
  }

  function commitRename(): void {
    setIsRenaming(false)
    onRename(draftName.trim())
  }

  const updated = updatedAt.toDate()
  const avatarAria =
    locale === 'sv' ? `${ownerDisplayName} — profilbild` : `${ownerDisplayName}'s avatar`

  return (
    <article className="doccard">
      <div className="doccard__preview" aria-hidden="true">
        <div className="doccard__preview-canvas">
          <div className="doccard__preview-grid" />
          <div
            className="note"
            style={{
              position: 'absolute',
              left: '8%',
              top: '14%',
              width: '72px',
              background: 'var(--note-mist)',
              transform: 'rotate(-2deg)',
            }}
          >
            <div className="h">Goals</div>
            <div className="b">Ship v1</div>
          </div>
          <div
            className="note"
            style={{
              position: 'absolute',
              left: '48%',
              top: '38%',
              width: '68px',
              background: 'var(--note-cream)',
              transform: 'rotate(3deg)',
            }}
          >
            <div className="h">Notes</div>
            <div className="b">Retro</div>
          </div>
          <div
            className="note"
            style={{
              position: 'absolute',
              left: '22%',
              top: '52%',
              width: '64px',
              background: 'var(--note-sage)',
              transform: 'rotate(-1deg)',
            }}
          >
            <div className="b" style={{ fontStyle: 'italic' }}>
              Next steps…
            </div>
          </div>
        </div>
      </div>

      <div className="doccard__body">
        {isRenaming ? (
          <input
            className="doccard__name"
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={() => {
              if (skipBlurCommitRef.current) {
                skipBlurCommitRef.current = false
                return
              }
              commitRename()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault()
                cancelRename()
              }
            }}
            autoFocus
          />
        ) : (
          <button type="button" className="doccard__name" onDoubleClick={startRename}>
            {name}
          </button>
        )}

        <div className="doccard__meta">
          <span className="doccard__owner">
            <span
              role="img"
              aria-label={avatarAria}
              className="doccard__owner-avatar"
              style={{ background: documentCardAvatarBackground(ownerDisplayName) }}
            >
              {personDisplayInitials(ownerDisplayName)}
            </span>
            <span className="doccard__owner-name">
              {documentCardOwnerFirstName(ownerDisplayName)}
            </span>
          </span>
          <span className="doccard__sep">·</span>
          <time dateTime={updated.toISOString()}>{formatTimestamp(updatedAt, locale)}</time>
        </div>

        <button
          type="button"
          className="doccard__delete"
          onClick={() => {
            if (globalThis.confirm(deleteConfirmMessage)) {
              onDelete(roomId)
            }
          }}
        >
          {deleteLabel}
        </button>
      </div>
    </article>
  )
}
