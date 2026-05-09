'use client'

import { useCallback, useEffect, useState } from 'react'

import type { IDashboardCopy } from '@/modules/dashboard/dashboard-i18n'
import './create-document-modal.css'

const DEFAULT_NOTE_SWATCHES = [
  '#cfe0ec',
  '#f1e7d0',
  '#cfdcc9',
  '#e7c9c9',
  '#ecdfc6',
  '#c8cdd6',
] as const

interface I_DASHBOARD_CreateDocumentModalProps {
  copy: IDashboardCopy
  onClose: () => void
  onCreate: (name: string) => void
}

export function CreateDocumentModal({
  copy,
  onClose,
  onCreate,
}: I_DASHBOARD_CreateDocumentModalProps) {
  const [name, setName] = useState('')
  const [colorIdx, setColorIdx] = useState(0)

  const handleClose = useCallback(() => {
    setName('')
    setColorIdx(0)
    onClose()
  }, [onClose])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handleClose])

  function submit(): void {
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    onCreate(trimmed)
  }

  return (
    <div
      data-klistra-create-document-modal
      className="modal"
      onClick={handleClose}
      role="presentation"
    >
      <div className="modal__card" onClick={(e) => e.stopPropagation()} role="presentation">
        <h3>{copy.modalTitle}</h3>
        <p className="modal__sub">{copy.modalSubtitle}</p>
        <input
          className="modal__input"
          placeholder={copy.modalPlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          aria-label={copy.modalPlaceholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) {
              submit()
            }
          }}
        />
        <div className="modal__colors" role="group" aria-label={copy.modalColorGroup}>
          {DEFAULT_NOTE_SWATCHES.map((hex, i) => (
            <button
              key={hex}
              type="button"
              className="modal__swatch"
              style={{ background: hex }}
              aria-pressed={colorIdx === i}
              aria-label={`${copy.modalNoteColorPrefix} ${i + 1}`}
              onClick={() => setColorIdx(i)}
            />
          ))}
        </div>
        <div className="modal__actions">
          <button type="button" className="ghost" onClick={handleClose}>
            {copy.modalCancel}
          </button>
          <button type="button" className="primary" disabled={!name.trim()} onClick={submit}>
            {copy.modalCreate}
          </button>
        </div>
      </div>
    </div>
  )
}
