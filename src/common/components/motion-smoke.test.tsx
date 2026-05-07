import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MotionSmoke } from './motion-smoke'

describe('MotionSmoke', () => {
  it('renders the animated label', () => {
    render(<MotionSmoke />)
    expect(screen.getByTestId('motion-smoke')).toHaveTextContent('Framer Motion is active')
  })
})
