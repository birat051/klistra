import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const signInMock = vi.hoisted(() => vi.fn())

vi.mock('@/modules/auth/services/google-sign-in-flow', () => ({
  signInWithGoogleAndEstablishSession: () => signInMock(),
}))

import { LoginPage } from './login-page'

describe('LoginPage', () => {
  it('starts Google sign-in when the button is clicked', async () => {
    signInMock.mockResolvedValue(undefined)
    render(<LoginPage />)
    fireEvent.click(screen.getByTestId('login-google-button'))
    await waitFor(() => expect(signInMock).toHaveBeenCalledTimes(1))
  })

  it('shows an error message when sign-in returns a code', async () => {
    signInMock.mockResolvedValue('popup_failed')
    render(<LoginPage />)
    fireEvent.click(screen.getByTestId('login-google-button'))
    expect(await screen.findByRole('alert')).toHaveTextContent(/cancelled or blocked/i)
  })
})
