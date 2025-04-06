"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// Define types for our socket context
type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  gameCode: string | null;
  playerName: string | null;
  playerId: string | null;
  isHost: boolean;
  connect: (gameCode: string, playerName: string, isHost?: boolean) => void;
  disconnect: () => void;
};

// Create the context with default values
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  gameCode: null,
  playerName: null,
  playerId: null,
  isHost: false,
  connect: () => {},
  disconnect: () => {},
});

// Provider component
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  // Function to connect to the socket server
  const connect = (gameCode: string, playerName: string, isHost = false) => {
    // Create socket connection
    const newSocket = io('/', {
      query: {
        gameCode,
        playerName,
        isHost: isHost ? 'true' : 'false',
      },
    });

    // Set up event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
      setGameCode(gameCode);
      setPlayerName(playerName);
      setIsHost(isHost);
      console.log('Connected to socket server');
    });

    newSocket.on('player_id', (id: string) => {
      setPlayerId(id);
      console.log('Received player ID:', id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    // Save the socket instance
    setSocket(newSocket);
  };

  // Function to disconnect from the socket server
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setGameCode(null);
      setPlayerName(null);
      setPlayerId(null);
      setIsHost(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        gameCode,
        playerName,
        playerId,
        isHost,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);
