import type { Game } from './types'

export const initialGames: Game[] = [
  {
    id: 'g1',
    title: 'Stellar Odyssey',
    genre: 'RPG',
    platform: 'PC',
    hoursPlayed: 42,
    rating: 5,
    status: 'playing',
  },
  {
    id: 'g2',
    title: 'Neon Drift',
    genre: 'Racing',
    platform: 'Console',
    hoursPlayed: 12,
    rating: 4,
    status: 'completed',
  },
  {
    id: 'g3',
    title: 'Dungeon Depths',
    genre: 'Roguelike',
    platform: 'PC',
    hoursPlayed: 0,
    rating: 0,
    status: 'backlog',
  },
]
