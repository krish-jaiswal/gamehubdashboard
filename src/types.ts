export type GameStatus = 'playing' | 'completed' | 'backlog'

export interface Game {
  id: string
  title: string
  genre: string
  platform: string
  hoursPlayed: number
  rating: number
  status: GameStatus
}
