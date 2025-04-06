import { Game, Player, Team, Round, Answer } from '../db/schema';

// Game state management
export class GameManager {
  private games: Map<string, Game> = new Map();
  private players: Map<string, Player> = new Map();
  private teams: Map<string, Team> = new Map();
  
  // Create a new game
  createGame(hostId: string): Game {
    const gameCode = this.generateGameCode();
    const game: Game = {
      id: `game_${Date.now()}`,
      code: gameCode,
      hostId,
      status: 'waiting',
      currentRound: 0,
      teams: [],
      players: [],
      rounds: [],
      strikes: 0,
      scores: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.games.set(gameCode, game);
    return game;
  }
  
  // Generate a unique game code
  private generateGameCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure code is unique
    if (this.games.has(code)) {
      return this.generateGameCode();
    }
    
    return code;
  }
  
  // Get game by code
  getGame(code: string): Game | undefined {
    return this.games.get(code);
  }
  
  // Add player to game
  addPlayer(gameCode: string, player: Player): boolean {
    const game = this.games.get(gameCode);
    if (!game) return false;
    
    game.players.push(player.id);
    this.players.set(player.id, player);
    game.updatedAt = new Date();
    
    return true;
  }
  
  // Create a team
  createTeam(gameCode: string, name: string): Team | undefined {
    const game = this.games.get(gameCode);
    if (!game) return undefined;
    
    const team: Team = {
      id: `team_${Date.now()}`,
      name,
      players: [],
      score: 0,
      gameId: game.id
    };
    
    game.teams.push(team.id);
    this.teams.set(team.id, team);
    game.updatedAt = new Date();
    
    return team;
  }
  
  // Add player to team
  addPlayerToTeam(gameCode: string, playerId: string, teamId: string): boolean {
    const game = this.games.get(gameCode);
    const team = this.teams.get(teamId);
    const player = this.players.get(playerId);
    
    if (!game || !team || !player) return false;
    
    team.players.push(playerId);
    game.updatedAt = new Date();
    
    return true;
  }
  
  // Start game
  startGame(gameCode: string): boolean {
    const game = this.games.get(gameCode);
    if (!game) return false;
    
    game.status = 'playing';
    game.currentRound = 0;
    game.updatedAt = new Date();
    
    return true;
  }
  
  // Add round to game
  addRound(gameCode: string, round: Round): boolean {
    const game = this.games.get(gameCode);
    if (!game) return false;
    
    game.rounds.push(round);
    game.updatedAt = new Date();
    
    return true;
  }
  
  // Start next round
  nextRound(gameCode: string): Round | undefined {
    const game = this.games.get(gameCode);
    if (!game || game.currentRound >= game.rounds.length - 1) return undefined;
    
    game.currentRound++;
    game.strikes = 0;
    game.updatedAt = new Date();
    
    return game.rounds[game.currentRound];
  }
  
  // Reveal answer
  revealAnswer(gameCode: string, answerId: string): Answer | undefined {
    const game = this.games.get(gameCode);
    if (!game) return undefined;
    
    const currentRound = game.rounds[game.currentRound];
    if (!currentRound) return undefined;
    
    const answer = currentRound.answers.find(a => a.id === answerId);
    if (!answer) return undefined;
    
    answer.revealed = true;
    game.updatedAt = new Date();
    
    return answer;
  }
  
  // Add strike
  addStrike(gameCode: string): number {
    const game = this.games.get(gameCode);
    if (!game) return -1;
    
    game.strikes++;
    game.updatedAt = new Date();
    
    return game.strikes;
  }
  
  // Add points to team
  addPoints(gameCode: string, teamId: string, points: number): number {
    const game = this.games.get(gameCode);
    const team = this.teams.get(teamId);
    if (!game || !team) return -1;
    
    team.score += points;
    game.updatedAt = new Date();
    
    return team.score;
  }
  
  // End game
  endGame(gameCode: string): boolean {
    const game = this.games.get(gameCode);
    if (!game) return false;
    
    game.status = 'ended';
    game.updatedAt = new Date();
    
    return true;
  }
  
  // Get winning team
  getWinningTeam(gameCode: string): Team | undefined {
    const game = this.games.get(gameCode);
    if (!game) return undefined;
    
    let highestScore = -1;
    let winningTeamId = '';
    
    for (const teamId of game.teams) {
      const team = this.teams.get(teamId);
      if (team && team.score > highestScore) {
        highestScore = team.score;
        winningTeamId = teamId;
      }
    }
    
    return this.teams.get(winningTeamId);
  }
  
  // Process buzzer press
  processBuzzerPress(gameCode: string, playerId: string, timestamp: number): boolean {
    const game = this.games.get(gameCode);
    if (!game || game.status !== 'playing') return false;
    
    // In a real implementation, we would compare timestamps to determine the first player to buzz
    // For now, we'll just return true to indicate success
    return true;
  }
}

// Export singleton instance
export const gameManager = new GameManager();
