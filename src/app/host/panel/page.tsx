"use client";

import { type NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';

const HostPanel: NextPage = () => {
  const [gameCode, setGameCode] = useState('ABC123');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team 1', score: 0, players: ['Player 1', 'Player 2'] },
    { id: 2, name: 'Team 2', score: 0, players: ['Player 3', 'Player 4'] }
  ]);
  
  // Sample questions for demonstration
  const questions = [
    {
      id: 1,
      text: "Name something people do before going to bed.",
      answers: [
        { text: "Brush teeth", points: 30 },
        { text: "Read a book", points: 22 },
        { text: "Watch TV", points: 15 },
        { text: "Take a shower/bath", points: 12 },
        { text: "Set alarm", points: 10 },
        { text: "Check phone", points: 7 },
        { text: "Pray", points: 4 }
      ]
    },
    {
      id: 2,
      text: "Name something people take to the beach.",
      answers: [
        { text: "Towel", points: 28 },
        { text: "Sunscreen", points: 24 },
        { text: "Umbrella", points: 18 },
        { text: "Cooler", points: 12 },
        { text: "Beach chair", points: 10 },
        { text: "Sunglasses", points: 5 },
        { text: "Book", points: 3 }
      ]
    }
  ];
  
  return (
    <>
      <Head>
        <title>Family Feud - Host Panel</title>
        <meta name="description" content="Family Feud Host Control Panel" />
      </Head>
      
      <main className="min-h-screen bg-blue-900 text-white">
        <div className="bg-blue-950 p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400">HOST PANEL</h1>
          <div className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold">
            Game Code: {gameCode}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Left column - Teams */}
          <div className="bg-blue-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Teams</h2>
            
            <div className="space-y-4">
              {teams.map(team => (
                <div key={team.id} className="bg-blue-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{team.name}</h3>
                    <div className="flex items-center space-x-2">
                      <button className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center">-</button>
                      <span className="font-bold">{team.score}</span>
                      <button className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center">+</button>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-300">Players:</p>
                    <ul className="list-disc list-inside">
                      {team.players.map((player, index) => (
                        <li key={index}>{player}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded">
                Add Team
              </button>
            </div>
          </div>
          
          {/* Middle column - Current Question */}
          <div className="bg-blue-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Current Question</h2>
            
            <div className="bg-blue-700 rounded-lg p-4 mb-4">
              <p className="text-lg font-bold mb-2">{questions[currentQuestion].text}</p>
              
              <div className="space-y-2 mt-4">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <div key={index} className="flex justify-between items-center bg-blue-600 p-2 rounded">
                    <span>{answer.text}</span>
                    <span className="bg-yellow-400 text-blue-900 px-2 py-1 rounded font-bold">{answer.points}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button 
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
          
          {/* Right column - Game Controls */}
          <div className="bg-blue-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Game Controls</h2>
            
            <div className="space-y-4">
              <button className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-4 rounded">
                Start Game
              </button>
              
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-4 rounded">
                Next Round
              </button>
              
              <button className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded">
                Reset Round
              </button>
              
              <div className="bg-blue-700 rounded-lg p-4">
                <h3 className="font-bold mb-2">Strike Controls</h3>
                <div className="flex justify-between">
                  <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
                    Add Strike
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
                    Reset Strikes
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-700 rounded-lg p-4">
                <h3 className="font-bold mb-2">Answer Controls</h3>
                <button className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mb-2">
                  Reveal Answer
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
                  Reveal All Answers
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default HostPanel;
