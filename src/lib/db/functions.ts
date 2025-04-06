import { Question } from './schema';

// Function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Function to add a new question to the database
export function addQuestion(question: Omit<Question, 'id'>): Question {
  const newQuestion: Question = {
    id: generateId(),
    ...question
  };
  
  return newQuestion;
}

// Function to get a random question from the database
export function getRandomQuestion(questions: Question[]): Question | null {
  if (questions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

// Function to create a new game
export function createGame(hostId: string): Game {
  return {
    id: generateId(),
    status: 'waiting',
    currentRound: 0,
    totalRounds: 5,
    teams: [],
    currentTeamId: null,
    currentQuestionId: null,
    revealedAnswers: [],
    strikes: 0,
    hostId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Function to add a player to a game
export function addPlayer(name: string, isHost: boolean = false): Player {
  return {
    id: generateId(),
    name,
    teamId: '',
    isHost,
    isActive: true,
    joinedAt: new Date()
  };
}

// Function to create a team
export function createTeam(name: string): Team {
  return {
    id: generateId(),
    name,
    score: 0,
    players: []
  };
}

// Import the types
import { Game, Player, Team } from './schema';
