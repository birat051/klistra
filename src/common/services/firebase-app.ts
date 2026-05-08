import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'

/** Browser Firebase app; requires `NEXT_PUBLIC_FIREBASE_*` env vars at build time. */
export function getFirebaseClientApp(): FirebaseApp | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  if (
    apiKey == null ||
    apiKey === '' ||
    authDomain == null ||
    authDomain === '' ||
    projectId == null ||
    projectId === ''
  ) {
    return null
  }

  if (getApps().length > 0) {
    return getApp()
  }

  return initializeApp({
    apiKey,
    authDomain,
    projectId,
  })
}
