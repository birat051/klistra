import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

function SmokePlaceholder() {
  return <div data-testid="runner-smoke">klistra</div>
}

describe('test runner', () => {
  it('runs vitest with React Testing Library', () => {
    render(<SmokePlaceholder />)
    expect(screen.getByTestId('runner-smoke')).toHaveTextContent('klistra')
  })
})
