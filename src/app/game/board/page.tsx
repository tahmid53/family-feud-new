"use client";

import { type NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';

const GameBoard: NextPage = () => {
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);
  const [strikes, setStrikes] = useState(0);
  
  // Sample question and answers for UI demonstration
  const question = "Name something people do before going to bed.";
  const answers = [
    { id: 1, text: "Brush teeth", points: 30 },
    { id: 2, text: "Read a book", points: 22 },
    { id: 3, text: "Watch TV", points: 15 },
    { id: 4, text: "Take a shower/bath", points: 12 },
    { id: 5, text: "Set alarm", points: 10 },
    { id: 6, text: "Check phone", points: 7 },
    { id: 7, text: "Pray", points: 4 }
  ];
  
  const revealAnswer = (id: number) => {
    if (!revealedAnswers.includes(id)) {
      setRevealedAnswers([...revealedAnswers, id]);
    }
  };
  
  const addStrike = () => {
    if (strikes < 3) {
      setStrikes(strikes + 1);
    }
  };
  
  return (
    <>
      <Head>
        <title>Family Feud - Game Board</title>
        <meta name="description" content="Family Feud Game Board" />
      </Head>
      
      <main className="min-h-screen bg-blue-900 text-white flex flex-col">
        {/* Header with scores */}
        <div className="bg-blue-950 p-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">
            Team 1: 0
          </div>
          <h1 className="text-3xl font-bold text-yellow-400">FAMILY FEUD</h1>
          <div className="text-2xl font-bold text-yellow-400">
            Team 2: 0
          </div>
        </div>
        
        {/* Question */}
        <div className="bg-blue-800 p-6 text-center">
          <h2 className="text-3xl font-bold">{question}</h2>
        </div>
        
        {/* Game board */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-4xl grid grid-cols-1 gap-4">
            {answers.map((answer) => (
              <div 
                key={answer.id}
                className={`bg-blue-700 rounded-lg p-4 flex justify-between items-center ${
                  revealedAnswers.includes(answer.id) ? 'bg-blue-600' : ''
                }`}
              >
                <div className="w-8 h-8 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center font-bold">
                  {answer.id}
                </div>
                <div className="flex-1 text-center">
                  {revealedAnswers.includes(answer.id) ? (
                    <span className="text-2xl font-bold">{answer.text}</span>
                  ) : (
                    <span className="text-2xl font-bold">?????</span>
                  )}
                </div>
                <div className="w-16 h-10 bg-yellow-400 text-blue-900 rounded flex items-center justify-center font-bold text-xl">
                  {revealedAnswers.includes(answer.id) ? answer.points : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Strikes */}
        <div className="bg-blue-800 p-4 flex justify-center space-x-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`text-5xl font-bold ${i <= strikes ? 'text-red-500' : 'text-gray-600'}`}
            >
              X
            </div>
          ))}
        </div>
        
        {/* Host controls */}
        <div className="bg-blue-950 p-4 flex justify-center space-x-4">
          <button 
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
            onClick={() => revealAnswer(revealedAnswers.length + 1)}
          >
            Reveal Next Answer
          </button>
          <button 
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
            onClick={addStrike}
          >
            Add Strike
          </button>
          <button 
            className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded"
          >
            Next Round
          </button>
        </div>
      </main>
    </>
  );
};

export default GameBoard;
