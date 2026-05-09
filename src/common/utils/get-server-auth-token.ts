import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'
import { cookies } from 'next/headers'

import { ensureFirebaseAdminInitialized } from '@/common/services/firebase-admin-app'

export type { DecodedIdToken }

/** Verify the `__session` cookie (Firebase ID token) in Server Components and Server Actions. */
export async function getServerAuthToken(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('__session')?.value
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
