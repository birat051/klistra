'use client'

import { useState } from 'react'

import { createDashboardRoom } from '@/modules/dashboard/actions/create-dashboard-room'
import type { IDashboardCopy } from '@/modules/dashboard/dashboard-i18n'

import { CreateDocumentModal } from './create-document-modal'

export interface I_DASHBOARD_DashboardCreateFabProps {
  copy: IDashboardCopy
}

export function DashboardCreateFab({ copy }: I_DASHBOARD_DashboardCreateFabProps) {
  const [creating, setCreating] = useState(false)

  async function handleCreate(name: string): Promise<void> {
    const result = await createDashboardRoom(name)
    if (result.ok) {
      setCreating(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="fab"
        aria-label={copy.fabAria}
        onClick={() => setCreating(true)}
      >
        <span className="fab__plus" aria-hidden="true">
          +
        </span>
        {copy.fab}
      </button>

      {creating ? (
        <CreateDocumentModal
          copy={copy}
          onClose={() => setCreating(false)}
          onCreate={(name) => {
            void handleCreate(name)
          }}
        />
      ) : null}
    </>
  )
}
