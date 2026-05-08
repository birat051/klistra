/** Common enums — see `docs/PROJECT_GUIDELINES.MD` §3.2 */

export enum E_ConnectionState {
  Online = 'online',
  Offline = 'offline',
  Reconnecting = 'reconnecting',
  Syncing = 'syncing',
}

export enum E_SyncStatus {
  Idle = 'idle',
  Saving = 'saving',
  Saved = 'saved',
}
