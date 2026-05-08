'use client'

import { useState } from 'react'

import { GoogleGIcon } from '@/common/components/google-g-icon'
import { signInWithGoogleAndEstablishSession } from '@/modules/auth/services/google-sign-in-flow'

import './login-page.css'

const ERROR_COPY: Record<string, string> = {
  firebase_client_unconfigured:
    'Sign-in is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID.',
  popup_failed: 'Google sign-in was cancelled or blocked. Try again.',
  session_exchange_failed:
    'Could not start a session. Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set on the server so your ID token can be verified.',
}

export function LoginPage() {
  const [pending, setPending] = useState(false)
  const [errorKey, setErrorKey] = useState<string | null>(null)

  async function onContinueWithGoogle() {
    setErrorKey(null)
    setPending(true)
    try {
      const err = await signInWithGoogleAndEstablishSession()
      if (err != null) {
        setErrorKey(err)
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="login-shell">
      <div className="login-card">
        <h1 className="login-title">Sign in</h1>
        <p className="login-lede">Continue with your Google account to open the dashboard.</p>
        <button
          type="button"
          className="login-cta"
          data-testid="login-google-button"
          disabled={pending}
          onClick={() => void onContinueWithGoogle()}
        >
          <GoogleGIcon className="login-cta__g" />
          <span>Continue with Google</span>
        </button>
        {errorKey !== null && (
          <p className="login-error" role="alert">
            {ERROR_COPY[errorKey] ?? errorKey}
          </p>
        )}
      </div>
    </main>
  )
}
