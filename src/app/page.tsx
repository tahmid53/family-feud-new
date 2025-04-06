import { type NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Family Feud Game</title>
        <meta name="description" content="Play Family Feud with your family online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-8 text-center">
          FAMILY FEUD
        </h1>
        
        <div className="w-full max-w-md space-y-6">
          <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Join a Game</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded bg-blue-700 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="gameCode" className="block text-sm font-medium mb-1">
                  Game Code
                </label>
                <input
                  type="text"
                  id="gameCode"
                  className="w-full px-4 py-2 rounded bg-blue-700 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter game code"
                />
              </div>
              
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 transition">
                Join Game
              </button>
            </div>
          </div>
          
          <div className="bg-blue-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Host a Game</h2>
            <button className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-600 transition">
              Create New Game
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
