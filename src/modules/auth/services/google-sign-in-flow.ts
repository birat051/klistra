import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { getFirebaseClientApp } from '@/common/services/firebase-app'

export type TGoogleSignInErrorCode =
  | 'firebase_client_unconfigured'
  | 'popup_failed'
  | 'session_exchange_failed'

/**
 * Firebase Auth Google popup, then POST ID token to `/api/auth/session` and redirect to the dashboard.
 */
export async function signInWithGoogleAndEstablishSession(): Promise<void | TGoogleSignInErrorCode> {
  const app = getFirebaseClientApp()
  if (app == null) {
    return 'firebase_client_unconfigured'
  }

  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  let idToken: string
  try {
    const credential = await signInWithPopup(auth, provider)
    idToken = await credential.user.getIdToken()
  } catch {
    return 'popup_failed'
  }

  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })

  if (!res.ok) {
    return 'session_exchange_failed'
  }

  window.location.assign(`/${document.documentElement.lang === 'sv' ? 'sv' : 'en'}/dashboard`)
}
