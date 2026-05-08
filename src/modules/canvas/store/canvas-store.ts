'use client'

import { create } from 'zustand'

import { E_CANVAS_ActiveModal } from '../types'

/** Ephemeral canvas UI — collaborative note data stays in Yjs (guidelines §8.1). */
export interface I_CANVAS_UiStore {
  /** Selected sticky note id, or `null` if none. Never duplicate Yjs note payloads here. */
  selectedNote: string | null
  setSelectedNote: (noteId: string | null) => void
  activeModal: E_CANVAS_ActiveModal | null
  setActiveModal: (modal: E_CANVAS_ActiveModal | null) => void
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
}

export const useCanvasStore = create<I_CANVAS_UiStore>((set) => ({
  selectedNote: null,
  setSelectedNote: (noteId) => set({ selectedNote: noteId }),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  panelOpen: false,
  setPanelOpen: (open) => set({ panelOpen: open }),
}))
