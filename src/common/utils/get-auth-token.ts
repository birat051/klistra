import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'
import type { NextRequest } from 'next/server'

import { ensureFirebaseAdminInitialized } from '@/common/services/firebase-admin-app'

export type { DecodedIdToken }

export async function getAuthToken(request: NextRequest): Promise<DecodedIdToken | null> {
  const session = request.cookies.get('__session')?.value
  if (!session) {
    return null
  }

  if (!ensureFirebaseAdminInitialized()) {
    return null
  }

  try {
    return await getAuth().verifyIdToken(session)
  } catch {
    return null
  }
}
