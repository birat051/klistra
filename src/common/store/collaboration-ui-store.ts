'use client'

import { create } from 'zustand'

import { E_ConnectionState, E_SyncStatus } from '@/types'

/** Cross-cutting session/sync indicators (guidelines §8.2). */
export interface I_CollaborationUiStore {
  syncStatus: E_SyncStatus
  setSyncStatus: (status: E_SyncStatus) => void
  connectionState: E_ConnectionState
  setConnectionState: (state: E_ConnectionState) => void
}

export const useCollaborationUiStore = create<I_CollaborationUiStore>((set) => ({
  syncStatus: E_SyncStatus.Idle,
  setSyncStatus: (status) => set({ syncStatus: status }),
  connectionState: E_ConnectionState.Online,
  setConnectionState: (state) => set({ connectionState: state }),
}))
