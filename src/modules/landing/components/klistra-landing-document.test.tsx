import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LANDING_SIGN_IN_HREF } from '@/modules/landing/landing-sign-in-href'

import { KlistraLandingDocument } from './klistra-landing-document'

describe('KlistraLandingDocument', () => {
  it('renders the hero headline and primary CTA for English', () => {
    render(<KlistraLandingDocument locale="en" />)
    expect(
      screen.getByRole('heading', { level: 1, name: /sticky-note canvas you.*never lose/i }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('landing-primary-cta')).toHaveTextContent('Continue with Google')
  })

  it('links the primary CTA to the sign-in route', () => {
    render(<KlistraLandingDocument locale="en" />)
    const cta = screen.getByTestId('landing-primary-cta')
    expect(cta).toHaveAttribute('href', LANDING_SIGN_IN_HREF)
  })

  it('renders four feature cards', () => {
    render(<KlistraLandingDocument locale="en" />)
    const region = screen.getByRole('region', { name: /messy middle of a project/i })
    const articles = within(region).getAllByRole('article')
    expect(articles).toHaveLength(4)
  })

  it('renders the hero demo canvas chrome (design /design/hero-demo)', () => {
    render(<KlistraLandingDocument locale="en" />)
    expect(screen.getByText('Q2 strategy retro')).toBeInTheDocument()
  })

  it('renders Swedish copy when locale is sv (SSR /en vs /sv route)', () => {
    render(<KlistraLandingDocument locale="sv" />)
    expect(screen.getByText('En yta för att tänka tillsammans')).toBeInTheDocument()
  })

  it('exposes locale switcher links to /en and /sv', () => {
    render(<KlistraLandingDocument locale="en" />)
    const lang = screen.getByRole('group', { name: 'Language' })
    expect(within(lang).getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en')
    expect(within(lang).getByRole('link', { name: 'SV' })).toHaveAttribute('href', '/sv')
    expect(within(lang).getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows the offline banner when the hero demo connection pill is toggled', () => {
    render(<KlistraLandingDocument locale="en" />)
    fireEvent.click(screen.getByRole('button', { name: /Currently online/i }))
    expect(
      screen.getByText(/You're offline\. Edits keep working — they'll sync when you reconnect\./),
    ).toBeInTheDocument()
  })
})
