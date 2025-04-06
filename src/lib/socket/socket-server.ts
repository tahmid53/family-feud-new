// Server-side socket.io implementation for Family Feud
import { Server } from 'socket.io';
import http from 'http';
import { NextApiRequest } from 'next';
import { gameManager } from '../../lib/game/game-manager';

// Game rooms map to track active games
const gameRooms = new Map();

// Function to generate a unique game code
function generateGameCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar looking characters
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  
  // Check if code already exists, regenerate if needed
  if (gameRooms.has(code)) {
    return generateGameCode();
  }
  
  return code;
}

// Initialize Socket.IO server
export function initSocketServer(server: http.Server) {
  const io = new Server(server);
  
  io.on('connection', (socket) => {
    const { gameCode, playerName, isHost } = socket.handshake.query;
    
    console.log(`New connection: ${playerName} to game ${gameCode}, isHost: ${isHost}`);
    
    // Join the game room
    if (gameCode) {
      socket.join(gameCode);
      
      // Create game room if it doesn't exist and this is the host
      if (isHost === 'true' && !gameRooms.has(gameCode)) {
        gameRooms.set(gameCode, {
          host: socket.id,
          players: new Map(),
          teams: new Map(),
          gameState: null
        });
        
        // Create a new game in the game manager
        const game = gameManager.createGame(socket.id);
        gameRooms.get(gameCode).gameState = game;
        
        console.log(`Created new game room: ${gameCode}`);
      }
      
      // Add player to the game room
      if (gameRooms.has(gameCode)) {
        const room = gameRooms.get(gameCode);
        const player = gameManager.addPlayer(playerName as string, isHost === 'true');
        
        room.players.set(socket.id, player);
        
        // Send player ID back to the client
        socket.emit('player_id', player.id);
        
        // Notify all clients in the room about the new player
        io.to(gameCode).emit('player_joined', {
          id: player.id,
          name: player.name,
          isHost: player.isHost
        });
        
        // Send current game state to the new player
        socket.emit('game_state', room.gameState);
        
        // Send list of all players to the new player
        const playersList = Array.from(room.players.values()).map(p => ({
          id: p.id,
          name: p.name,
          teamId: p.teamId,
          isHost: p.isHost
        }));
        
        socket.emit('players_list', playersList);
        
        console.log(`Player ${playerName} (${player.id}) joined game ${gameCode}`);
      } else {
        // Game room doesn't exist
        socket.emit('error', { message: 'Game not found' });
        socket.disconnect();
      }
    }
    
    // Handle team selection
    socket.on('join_team', ({ teamId, playerId }) => {
      const room = gameRooms.get(gameCode);
      if (!room) return;
      
      const player = room.players.get(socket.id);
      if (!player) return;
      
      // Check if team exists, create if not
      if (!room.teams.has(teamId)) {
        const team = gameManager.createTeam(room.gameState.id, `Team ${room.teams.size + 1}`);
        if (team) {
          room.teams.set(teamId, team);
        }
      }
      
      // Add player to team
      const success = gameManager.addPlayerToTeam(player.id, teamId);
      
      if (success) {
        // Update player in room
        player.teamId = teamId;
        room.players.set(socket.id, player);
        
        // Notify all clients in the room
        io.to(gameCode).emit('team_updated', {
          playerId: player.id,
          teamId
        });
      }
    });
    
    // Handle game start
    socket.on('start_game', () => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      const success = gameManager.startGame(room.gameState.id);
      
      if (success) {
        // Update game state
        room.gameState = gameManager.getGame(room.gameState.id);
        
        // Notify all clients in the room
        io.to(gameCode).emit('game_started', room.gameState);
      }
    });
    
    // Handle buzzer press
    socket.on('buzzer_press', () => {
      const room = gameRooms.get(gameCode);
      if (!room) return;
      
      const player = room.players.get(socket.id);
      if (!player) return;
      
      // Send buzzer press to host with timestamp
      const timestamp = Date.now();
      io.to(room.host).emit('buzzer_pressed', {
        playerId: player.id,
        playerName: player.name,
        teamId: player.teamId,
        timestamp
      });
    });
    
    // Handle answer reveal
    socket.on('reveal_answer', ({ answerId }) => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      const success = gameManager.revealAnswer(room.gameState.id, answerId);
      
      if (success) {
        // Update game state
        room.gameState = gameManager.getGame(room.gameState.id);
        
        // Notify all clients in the room
        io.to(gameCode).emit('answer_revealed', {
          answerId,
          gameState: room.gameState
        });
      }
    });
    
    // Handle strike
    socket.on('add_strike', () => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      const success = gameManager.addStrike(room.gameState.id);
      
      if (success) {
        // Update game state
        room.gameState = gameManager.getGame(room.gameState.id);
        
        // Notify all clients in the room
        io.to(gameCode).emit('strike_added', {
          strikes: room.gameState.strikes,
          gameState: room.gameState
        });
      }
    });
    
    // Handle team switch
    socket.on('switch_team', () => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      const success = gameManager.switchTeam(room.gameState.id);
      
      if (success) {
        // Update game state
        room.gameState = gameManager.getGame(room.gameState.id);
        
        // Notify all clients in the room
        io.to(gameCode).emit('team_switched', {
          currentTeamId: room.gameState.currentTeamId,
          gameState: room.gameState
        });
      }
    });
    
    // Handle award points
    socket.on('award_points', ({ points }) => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      const success = gameManager.awardPoints(room.gameState.id, points);
      
      if (success) {
        // Update game state
        room.gameState = gameManager.getGame(room.gameState.id);
        
        // Get updated team
        const team = gameManager.getTeam(room.gameState.currentTeamId);
        
        // Notify all clients in the room
        io.to(gameCode).emit('points_awarded', {
          teamId: room.gameState.currentTeamId,
          points: team.score,
          gameState: room.gameState
        });
      }
    });
    
    // Handle end round
    socket.on('end_round', () => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      const success = gameManager.endRound(room.gameState.id);
      
      if (success) {
        // Update game state
        room.gameState = gameManager.getGame(room.gameState.id);
        
        // Notify all clients in the room
        io.to(gameCode).emit('round_ended', {
          gameState: room.gameState
        });
      }
    });
    
    // Handle next round
    socket.on('next_round', () => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      const success = gameManager.nextRound(room.gameState.id);
      
      if (success) {
        // Update game state
        room.gameState = gameManager.getGame(room.gameState.id);
        
        // Get current question
        const question = gameManager.getCurrentQuestion(room.gameState.id);
        
        // Notify all clients in the room
        io.to(gameCode).emit('round_started', {
          roundNumber: room.gameState.currentRound,
          question,
          gameState: room.gameState
        });
      }
    });
    
    // Handle team name change
    socket.on('change_team_name', ({ teamId, name }) => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      const team = room.teams.get(teamId);
      if (team) {
        team.name = name;
        room.teams.set(teamId, team);
        
        // Notify all clients in the room
        io.to(gameCode).emit('team_name_changed', {
          teamId,
          name
        });
      }
    });
    
    // Handle title text change
    socket.on('change_title_text', ({ text }) => {
      const room = gameRooms.get(gameCode);
      if (!room || room.host !== socket.id) return;
      
      // Store title text in room data
      room.titleText = text;
      
      // Notify all clients in the room
      io.to(gameCode).emit('title_text_changed', {
        text
      });
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Player disconnected from game ${gameCode}`);
      
      const room = gameRooms.get(gameCode);
      if (!room) return;
      
      // Check if this was the host
      if (room.host === socket.id) {
        // Notify all clients in the room that the host left
        io.to(gameCode).emit('host_left');
        
        // Remove the game room
        gameRooms.delete(gameCode);
        
        console.log(`Game room ${gameCode} removed because host left`);
      } else {
        // Remove player from the game room
        const player = room.players.get(socket.id);
        if (player) {
          room.players.delete(socket.id);
          
          // Notify all clients in the room
          io.to(gameCode).emit('player_left', {
            id: player.id,
            name: player.name
          });
          
          console.log(`Player ${player.name} (${player.id}) left game ${gameCode}`);
        }
      }
    });
  });
  
  return io;
}

// API route handler for creating a new game
export function handleCreateGame(req: NextApiRequest, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { hostName } = req.body;
  
  if (!hostName) {
    return res.status(400).json({ error: 'Host name is required' });
  }
  
  // Generate a unique game code
  const gameCode = generateGameCode();
  
  return res.status(200).json({ gameCode });
}

// API route handler for checking if a game exists
export function handleCheckGame(req: NextApiRequest, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { gameCode } = req.query;
  
  if (!gameCode) {
    return res.status(400).json({ error: 'Game code is required' });
  }
  
  const exists = gameRooms.has(gameCode);
  
  return res.status(200).json({ exists });
}
