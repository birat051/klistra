import type { Timestamp } from 'firebase/firestore'

export interface I_DASHBOARD_DashboardRoomRow {
  id: string
  name: string
  ownerDisplayName: string
  updatedAt: Timestamp
}
