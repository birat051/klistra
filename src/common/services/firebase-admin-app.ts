import { cert, getApps, initializeApp } from 'firebase-admin/app'

/**
 * Initialise the Firebase Admin app once (service account from env).
 * Used by server routes that verify ID tokens or read session cookies.
 */
export function ensureFirebaseAdminInitialized(): boolean {
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
