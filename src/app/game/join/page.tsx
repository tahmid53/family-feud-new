"use client";

import { type NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';

const JoinGame: NextPage = () => {
  const [name, setName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  
  const handleJoin = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!gameCode.trim()) {
      setError('Please enter a game code');
      return;
    }
    
    setIsJoining(true);
    setError('');
    
    // In a real implementation, this would connect to the server
    // For now, we'll simulate joining with a timeout
    setTimeout(() => {
      // Redirect to the waiting room
      window.location.href = `/game/waiting?name=${encodeURIComponent(name)}&code=${encodeURIComponent(gameCode)}`;
    }, 1500);
  };
  
  return (
    <>
      <Head>
        <title>Family Feud - Join Game</title>
        <meta name="description" content="Join a Family Feud game" />
      </Head>
      
      <main className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-8">
          JOIN GAME
        </h1>
        
        <div className="w-full max-w-md bg-blue-800 p-6 rounded-lg shadow-lg">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded bg-blue-700 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your name"
                disabled={isJoining}
              />
            </div>
            
            <div>
              <label htmlFor="gameCode" className="block text-sm font-medium mb-1">
                Game Code
              </label>
              <input
                type="text"
                id="gameCode"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 rounded bg-blue-700 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter game code"
                disabled={isJoining}
              />
            </div>
            
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className={`w-full font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 transition ${
                isJoining
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-400 text-blue-900'
              }`}
            >
              {isJoining ? 'Joining...' : 'Join Game'}
            </button>
            
            <div className="text-center mt-4">
              <a href="/" className="text-yellow-400 hover:text-yellow-300">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default JoinGame;
