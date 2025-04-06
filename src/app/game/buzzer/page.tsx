"use client";

import { useState, useEffect } from 'react';
import { useSocket } from '../../../lib/socket/socket-context';

export default function BuzzerPage() {
  const { socket, playerName, gameCode, isConnected } = useSocket();
  const [lastBuzzTime, setLastBuzzTime] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [latency, setLatency] = useState(0);

  // Measure latency on component mount
  useEffect(() => {
    if (socket && isConnected) {
      // Set up ping-pong for latency measurement
      const pingInterval = setInterval(() => {
        const start = Date.now();
        socket.emit('ping', () => {
          const duration = Date.now() - start;
          setLatency(duration);
        });
      }, 5000);

      // Listen for buzzer acknowledgment
      socket.on('buzzer_acknowledged', (data) => {
        if (data.success) {
          setFeedback('Buzz registered!');
        } else {
          setFeedback('Someone else buzzed first!');
        }
        setTimeout(() => setFeedback(''), 2000);
      });

      return () => {
        clearInterval(pingInterval);
        socket.off('buzzer_acknowledged');
      };
    }
  }, [socket, isConnected]);

  const handleBuzz = () => {
    if (!socket || !isConnected || cooldown) return;
    
    // Prevent spam clicking with 1-second cooldown
    const now = Date.now();
    if (now - lastBuzzTime < 1000) return;
    
    setLastBuzzTime(now);
    setCooldown(true);
    setFeedback('Buzzing...');
    
    // Send buzz to server with client timestamp for latency compensation
    socket.emit('buzzer_press', { timestamp: now });
    
    // Reset cooldown after 1 second
    setTimeout(() => {
      setCooldown(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-blue-800 rounded-lg p-6 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">BUZZER</h1>
          
          <div className="mb-6">
            <p className="text-white mb-1">Player: {playerName}</p>
            <p className="text-white mb-1">Game: {gameCode}</p>
            <p className="text-white text-sm">Latency: {latency}ms</p>
          </div>
          
          <button
            onClick={handleBuzz}
            disabled={cooldown || !isConnected}
            className={`w-64 h-64 rounded-full focus:outline-none transition-all transform ${
              cooldown 
                ? 'bg-gray-500 scale-95' 
                : 'bg-red-600 hover:bg-red-500 active:scale-95 shadow-lg'
            }`}
          >
            <span className="text-white text-4xl font-bold">
              {cooldown ? 'WAIT' : 'BUZZ!'}
            </span>
          </button>
          
          {feedback && (
            <div className="mt-6 text-xl font-bold text-yellow-400">
              {feedback}
            </div>
          )}
          
          <div className="mt-8">
            <a href="/game/waiting" className="text-yellow-400 hover:text-yellow-300">
              Back to Waiting Room
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
