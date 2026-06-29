import { useMemo, useState } from 'react'
import './App.css'
import type { Game, GameStatus } from './types'
import { initialGames } from './data'
import { computeStats } from './stats'

const STATUS_LABELS: Record<GameStatus, string> = {
  playing: 'Now Playing',
  completed: 'Completed',
  backlog: 'Backlog',
}

interface FormState {
  title: string
  genre: string
  platform: string
  hoursPlayed: string
  rating: string
  status: GameStatus
}

const EMPTY_FORM: FormState = {
  title: '',
  genre: '',
  platform: 'PC',
  hoursPlayed: '0',
  rating: '0',
  status: 'backlog',
}

function App() {
  const [games, setGames] = useState<Game[]>(initialGames)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const stats = useMemo(() => computeStats(games), [games])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.title.trim() === '') return

    const newGame: Game = {
      id: `g${Date.now()}`,
      title: form.title.trim(),
      genre: form.genre.trim() || 'Unknown',
      platform: form.platform,
      hoursPlayed: Number(form.hoursPlayed) || 0,
      rating: Number(form.rating) || 0,
      status: form.status,
    }

    setGames((prev) => [...prev, newGame])
    setForm(EMPTY_FORM)
  }

  const removeGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id))
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Game Hub Dashboard</h1>
        <p>Track your library, playtime, and ratings in one place.</p>
      </header>

      <section className="stats" aria-label="Library statistics">
        <StatCard label="Games" value={String(stats.totalGames)} />
        <StatCard label="Hours Played" value={String(stats.totalHours)} />
        <StatCard
          label="Avg Rating"
          value={stats.averageRating.toFixed(1)}
        />
        <StatCard label="Now Playing" value={String(stats.nowPlaying)} />
      </section>

      <main className="content">
        <section className="panel">
          <h2>Add a Game</h2>
          <form className="game-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                aria-label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Pixel Quest"
              />
            </label>
            <label>
              Genre
              <input
                aria-label="Genre"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                placeholder="e.g. Adventure"
              />
            </label>
            <label>
              Platform
              <select
                aria-label="Platform"
                value={form.platform}
                onChange={(e) =>
                  setForm({ ...form, platform: e.target.value })
                }
              >
                <option>PC</option>
                <option>Console</option>
                <option>Mobile</option>
              </select>
            </label>
            <label>
              Hours
              <input
                aria-label="Hours"
                type="number"
                min="0"
                value={form.hoursPlayed}
                onChange={(e) =>
                  setForm({ ...form, hoursPlayed: e.target.value })
                }
              />
            </label>
            <label>
              Rating
              <input
                aria-label="Rating"
                type="number"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </label>
            <label>
              Status
              <select
                aria-label="Status"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as GameStatus })
                }
              >
                <option value="backlog">Backlog</option>
                <option value="playing">Now Playing</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <button type="submit">Add Game</button>
          </form>
        </section>

        <section className="panel">
          <h2>Your Library</h2>
          {games.length === 0 ? (
            <p className="empty">No games yet. Add your first one!</p>
          ) : (
            <ul className="game-list">
              {games.map((game) => (
                <li key={game.id} className="game-card">
                  <div className="game-card__main">
                    <span className="game-card__title">{game.title}</span>
                    <span className="game-card__meta">
                      {game.genre} · {game.platform}
                    </span>
                  </div>
                  <div className="game-card__stats">
                    <span className={`badge badge--${game.status}`}>
                      {STATUS_LABELS[game.status]}
                    </span>
                    <span className="game-card__hours">
                      {game.hoursPlayed}h
                    </span>
                    <span className="game-card__rating">
                      {'★'.repeat(game.rating)}
                      {'☆'.repeat(5 - game.rating)}
                    </span>
                    <button
                      className="game-card__remove"
                      aria-label={`Remove ${game.title}`}
                      onClick={() => removeGame(game.id)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  )
}

export default App
