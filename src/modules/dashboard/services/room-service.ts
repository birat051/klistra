import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { randomUUID } from 'node:crypto'

import { ensureFirebaseAdminInitialized } from '@/common/services/firebase-admin-app'

export async function createRoom(userId: string, name: string): Promise<string> {
  if (!ensureFirebaseAdminInitialized()) {
    throw new Error('Firebase Admin is not configured')
  }

  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error('Room name cannot be empty')
  }

  const db = getFirestore()
  const roomId = randomUUID()
  const roomRef = db.collection('rooms').doc(roomId)
  const memberRef = roomRef.collection('members').doc(userId)

  const batch = db.batch()
  batch.set(roomRef, {
    name: trimmed,
    createdBy: userId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  batch.set(memberRef, {
    role: 'owner',
    joinedAt: FieldValue.serverTimestamp(),
    displayName: '',
  })

  await batch.commit()
  return roomId
}
