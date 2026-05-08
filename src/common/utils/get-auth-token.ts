import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'
import type { NextRequest } from 'next/server'

export type { DecodedIdToken }

export async function getAuthToken(request: NextRequest): Promise<DecodedIdToken | null> {
  const session = request.cookies.get('__session')?.value
  if (!session) {
    return null
  }

  if (!ensureFirebaseAdminApp()) {
    return null
  }

  try {
    return await getAuth().verifyIdToken(session)
  } catch {
    return null
  }
}

function ensureFirebaseAdminApp(): boolean {
  if (getApps().length > 0) {
    return true
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!raw) {
    return false
  }

  try {
    const credentials = JSON.parse(raw) as {
      project_id: string
      client_email: string
      private_key: string
    }

    initializeApp({
      credential: cert({
        projectId: credentials.project_id,
        clientEmail: credentials.client_email,
        privateKey: credentials.private_key,
      }),
    })
    return true
  } catch {
    return false
  }
}
