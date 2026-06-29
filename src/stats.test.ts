import { describe, expect, it } from 'vitest'
import { computeStats } from './stats'
import type { Game } from './types'

const sample: Game[] = [
  {
    id: '1',
    title: 'A',
    genre: 'RPG',
    platform: 'PC',
    hoursPlayed: 10,
    rating: 4,
    status: 'playing',
  },
  {
    id: '2',
    title: 'B',
    genre: 'Racing',
    platform: 'Console',
    hoursPlayed: 5,
    rating: 2,
    status: 'completed',
  },
  {
    id: '3',
    title: 'C',
    genre: 'Roguelike',
    platform: 'PC',
    hoursPlayed: 0,
    rating: 0,
    status: 'backlog',
  },
]

describe('computeStats', () => {
  it('counts total games', () => {
    expect(computeStats(sample).totalGames).toBe(3)
  })

  it('sums total hours played', () => {
    expect(computeStats(sample).totalHours).toBe(15)
  })

  it('averages only rated games', () => {
    expect(computeStats(sample).averageRating).toBe(3)
  })

  it('counts now playing games', () => {
    expect(computeStats(sample).nowPlaying).toBe(1)
  })

  it('handles an empty library', () => {
    expect(computeStats([])).toEqual({
      totalGames: 0,
      totalHours: 0,
      averageRating: 0,
      nowPlaying: 0,
    })
  })
})
