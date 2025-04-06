"use client";

import { type NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const WaitingRoom: NextPage = () => {
  const [name, setName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([
    { id: '1', name: 'Player 1', team: 1 },
    { id: '2', name: 'Player 2', team: 1 },
    { id: '3', name: 'Player 3', team: 2 },
    { id: '4', name: 'Player 4', team: 2 },
  ]);
  const [selectedTeam, setSelectedTeam] = useState(0);
  
  useEffect(() => {
    // In a real implementation, this would parse URL params and connect to the server
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    const codeParam = urlParams.get('code');
    
    if (nameParam) setName(nameParam);
    if (codeParam) setGameCode(codeParam);
    
    // In a real implementation, this would listen for new players joining
  }, []);
  
  const joinTeam = (teamId: number) => {
    setSelectedTeam(teamId);
    // In a real implementation, this would send a request to the server
  };
  
  return (
    <>
      <Head>
        <title>Family Feud - Waiting Room</title>
        <meta name="description" content="Waiting for game to start" />
      </Head>
      
      <main className="min-h-screen bg-blue-900 text-white flex flex-col">
        <div className="bg-blue-950 p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400">WAITING ROOM</h1>
          <div className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold">
            Game Code: {gameCode}
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-800 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold mb-2">Welcome, {name}!</h2>
            <p>Waiting for the host to start the game. Please select a team below.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 */}
            <div className={`bg-blue-800 rounded-lg p-4 ${selectedTeam === 1 ? 'ring-4 ring-yellow-400' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Team 1</h2>
                <button 
                  onClick={() => joinTeam(1)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-1 px-4 rounded"
                >
                  Join Team
                </button>
              </div>
              
              <div className="space-y-2">
                {players.filter(p => p.team === 1).map(player => (
                  <div key={player.id} className="bg-blue-700 p-2 rounded">
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Team 2 */}
            <div className={`bg-blue-800 rounded-lg p-4 ${selectedTeam === 2 ? 'ring-4 ring-yellow-400' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Team 2</h2>
                <button 
                  onClick={() => joinTeam(2)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-1 px-4 rounded"
                >
                  Join Team
                </button>
              </div>
              
              <div className="space-y-2">
                {players.filter(p => p.team === 2).map(player => (
                  <div key={player.id} className="bg-blue-700 p-2 rounded">
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-yellow-400 text-lg">Waiting for the host to start the game...</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default WaitingRoom;
