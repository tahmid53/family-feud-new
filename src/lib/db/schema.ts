// Database schema for Family Feud game

export interface Question {
  id: string;
  text: string;
  category: string;
  answers: Answer[];
}

export interface Answer {
  text: string;
  points: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  isHost: boolean;
  isActive: boolean;
  joinedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  players: Player[];
}

export interface Game {
  id: string;
  status: 'waiting' | 'playing' | 'round_end' | 'game_end';
  currentRound: number;
  totalRounds: number;
  teams: Team[];
  currentTeamId: string | null;
  currentQuestionId: string | null;
  revealedAnswers: string[];
  strikes: number;
  hostId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory database for development
export const inMemoryDb = {
  questions: [] as Question[],
  games: [] as Game[],
  players: [] as Player[],
  teams: [] as Team[],
};
