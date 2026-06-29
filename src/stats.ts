import type { Game } from './types'

export interface DashboardStats {
  totalGames: number
  totalHours: number
  averageRating: number
  nowPlaying: number
}

export function computeStats(games: Game[]): DashboardStats {
  const totalGames = games.length
  const totalHours = games.reduce((sum, g) => sum + g.hoursPlayed, 0)

  const ratedGames = games.filter((g) => g.rating > 0)
  const averageRating =
    ratedGames.length === 0
      ? 0
      : ratedGames.reduce((sum, g) => sum + g.rating, 0) / ratedGames.length

  const nowPlaying = games.filter((g) => g.status === 'playing').length

  return { totalGames, totalHours, averageRating, nowPlaying }
}
