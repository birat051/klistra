import { FieldPath, getFirestore, type DocumentData } from 'firebase-admin/firestore'
import { Timestamp as ClientTimestamp } from 'firebase/firestore'

import { ensureFirebaseAdminInitialized } from '@/common/services/firebase-admin-app'

import type { I_DASHBOARD_DashboardRoomRow } from '../types'

function toClientTimestamp(value: unknown): ClientTimestamp {
  if (
    value &&
    typeof value === 'object' &&
    'toMillis' in value &&
    typeof (value as { toMillis: () => number }).toMillis === 'function'
  ) {
    return ClientTimestamp.fromMillis((value as { toMillis: () => number }).toMillis())
  }
  return ClientTimestamp.now()
}

function sortByUpdatedDesc(rows: I_DASHBOARD_DashboardRoomRow[]): I_DASHBOARD_DashboardRoomRow[] {
  return [...rows].sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis())
}

async function fetchUserDisplayName(uid: string): Promise<string> {
  const db = getFirestore()
  const snap = await db.collection('users').doc(uid).get()
  const name = snap.data()?.displayName
  if (typeof name === 'string' && name.trim()) {
    return name.trim()
  }
  return 'Owner'
}

function mapRoomDoc(
  id: string,
  data: DocumentData,
  ownerDisplayName: string,
): I_DASHBOARD_DashboardRoomRow {
  const rawName = data.name
  return {
    id,
    name: typeof rawName === 'string' && rawName.trim() ? rawName.trim() : 'Untitled',
    ownerDisplayName,
    updatedAt: toClientTimestamp(data.updatedAt),
  }
}

export async function fetchOwnedRooms(userId: string): Promise<I_DASHBOARD_DashboardRoomRow[]> {
  if (!ensureFirebaseAdminInitialized()) {
    return []
  }

  const db = getFirestore()
  const [ownerName, snap] = await Promise.all([
    fetchUserDisplayName(userId),
    db.collection('rooms').where('createdBy', '==', userId).get(),
  ])

  const rows = snap.docs.map((d) => mapRoomDoc(d.id, d.data(), ownerName))
  return sortByUpdatedDesc(rows)
}

export async function fetchCollaboratingRooms(
  userId: string,
): Promise<I_DASHBOARD_DashboardRoomRow[]> {
  if (!ensureFirebaseAdminInitialized()) {
    return []
  }

  const db = getFirestore()
  let memberSnap
  try {
    memberSnap = await db
      .collectionGroup('members')
      .where(FieldPath.documentId(), '==', userId)
      .get()
  } catch {
    return []
  }

  const roomIds = new Set<string>()
  for (const doc of memberSnap.docs) {
    const roomRef = doc.ref.parent.parent
    if (roomRef) {
      roomIds.add(roomRef.id)
    }
  }

  const rows: I_DASHBOARD_DashboardRoomRow[] = []
  for (const roomId of roomIds) {
    const roomDoc = await db.collection('rooms').doc(roomId).get()
    if (!roomDoc.exists) {
      continue
    }
    const data = roomDoc.data()!
    const createdBy = data.createdBy
    if (typeof createdBy !== 'string' || createdBy === userId) {
      continue
    }
    const ownerDisplayName = await fetchUserDisplayName(createdBy)
    rows.push(mapRoomDoc(roomId, data, ownerDisplayName))
  }

  return sortByUpdatedDesc(rows)
}
