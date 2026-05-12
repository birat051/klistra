import type { Timestamp } from 'firebase/firestore'

/** Server / API row (Firestore `Timestamp`). */
export interface I_DASHBOARD_DashboardRoomRow {
  id: string
  name: string
  ownerDisplayName: string
  updatedAt: Timestamp
}

/**
 * Serializable room row for Server → Client props (no `Timestamp`, no functions).
 * @see https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
 */
export interface I_DASHBOARD_DashboardRoomClientProps {
  id: string
  name: string
  ownerDisplayName: string
  updatedAtMillis: number
}

export function dashboardRoomToClientProps(
  row: I_DASHBOARD_DashboardRoomRow,
): I_DASHBOARD_DashboardRoomClientProps {
  return {
    id: row.id,
    name: row.name,
    ownerDisplayName: row.ownerDisplayName,
    updatedAtMillis: row.updatedAt.toMillis(),
  }
}
