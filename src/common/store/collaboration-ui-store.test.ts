import { beforeEach, describe, expect, it } from 'vitest'

import { E_ConnectionState, E_SyncStatus } from '@/types'
import { useCollaborationUiStore } from './collaboration-ui-store'

describe('useCollaborationUiStore', () => {
  beforeEach(() => {
    useCollaborationUiStore.setState({
      syncStatus: E_SyncStatus.Idle,
      connectionState: E_ConnectionState.Online,
    })
  })

  it('default state matches the defined shape', () => {
    const s = useCollaborationUiStore.getState()
    expect(s.syncStatus).toBe(E_SyncStatus.Idle)
    expect(s.connectionState).toBe(E_ConnectionState.Online)
    expect(typeof s.setSyncStatus).toBe('function')
    expect(typeof s.setConnectionState).toBe('function')
  })

  it('setSyncStatus updates only syncStatus', () => {
    useCollaborationUiStore.setState({
      connectionState: E_ConnectionState.Offline,
    })
    useCollaborationUiStore.getState().setSyncStatus(E_SyncStatus.Saving)

    const s = useCollaborationUiStore.getState()
    expect(s.syncStatus).toBe(E_SyncStatus.Saving)
    expect(s.connectionState).toBe(E_ConnectionState.Offline)
  })

  it('setConnectionState updates only connectionState', () => {
    useCollaborationUiStore.setState({
      syncStatus: E_SyncStatus.Saved,
    })
    useCollaborationUiStore.getState().setConnectionState(E_ConnectionState.Reconnecting)

    const s = useCollaborationUiStore.getState()
    expect(s.connectionState).toBe(E_ConnectionState.Reconnecting)
    expect(s.syncStatus).toBe(E_SyncStatus.Saved)
  })
})
