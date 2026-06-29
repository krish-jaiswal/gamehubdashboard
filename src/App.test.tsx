import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the dashboard title', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /game hub dashboard/i }),
    ).toBeInTheDocument()
  })

  it('adds a new game to the library', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Title'), 'Pixel Quest')
    await user.type(screen.getByLabelText('Genre'), 'Adventure')
    await user.click(screen.getByRole('button', { name: /add game/i }))

    expect(screen.getByText('Pixel Quest')).toBeInTheDocument()
    expect(screen.getByText(/Adventure · PC/)).toBeInTheDocument()
  })

  it('removes a game from the library', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('Stellar Odyssey')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: /remove stellar odyssey/i }),
    )
    expect(screen.queryByText('Stellar Odyssey')).not.toBeInTheDocument()
  })
})
