import { beforeEach, describe, expect, it } from 'vitest'

import { E_CANVAS_ActiveModal } from '../types'
import { useCanvasStore } from './canvas-store'

const initialCanvasUi = {
  selectedNote: null as string | null,
  activeModal: null as E_CANVAS_ActiveModal | null,
  panelOpen: false,
}

describe('useCanvasStore', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      selectedNote: initialCanvasUi.selectedNote,
      activeModal: initialCanvasUi.activeModal,
      panelOpen: initialCanvasUi.panelOpen,
    })
  })

  it('default state matches the defined shape', () => {
    const s = useCanvasStore.getState()
    expect(s.selectedNote).toBeNull()
    expect(s.activeModal).toBeNull()
    expect(s.panelOpen).toBe(false)
    expect(typeof s.setSelectedNote).toBe('function')
    expect(typeof s.setActiveModal).toBe('function')
    expect(typeof s.setPanelOpen).toBe('function')
  })

  it('setSelectedNote updates only selectedNote', () => {
    useCanvasStore.setState({
      activeModal: E_CANVAS_ActiveModal.Invite,
      panelOpen: true,
    })
    useCanvasStore.getState().setSelectedNote('note-1')

    const s = useCanvasStore.getState()
    expect(s.selectedNote).toBe('note-1')
    expect(s.activeModal).toBe(E_CANVAS_ActiveModal.Invite)
    expect(s.panelOpen).toBe(true)
  })

  it('setActiveModal updates only activeModal', () => {
    useCanvasStore.setState({
      selectedNote: 'note-a',
      panelOpen: true,
    })
    useCanvasStore.getState().setActiveModal(E_CANVAS_ActiveModal.CreateDocument)

    const s = useCanvasStore.getState()
    expect(s.activeModal).toBe(E_CANVAS_ActiveModal.CreateDocument)
    expect(s.selectedNote).toBe('note-a')
    expect(s.panelOpen).toBe(true)
  })

  it('setPanelOpen updates only panelOpen', () => {
    useCanvasStore.setState({
      selectedNote: 'note-b',
      activeModal: E_CANVAS_ActiveModal.Invite,
    })
    useCanvasStore.getState().setPanelOpen(true)

    const s = useCanvasStore.getState()
    expect(s.panelOpen).toBe(true)
    expect(s.selectedNote).toBe('note-b')
    expect(s.activeModal).toBe(E_CANVAS_ActiveModal.Invite)
  })
})
