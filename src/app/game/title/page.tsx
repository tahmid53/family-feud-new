"use client";

import { useState, useEffect } from 'react';
import { useSocket } from '../../../lib/socket/socket-context';
import { useLocalization } from '../../../lib/localization/localization';
import Head from 'next/head';

export default function TitleScreen() {
  const { socket, isConnected, isHost, gameCode } = useSocket();
  const { t } = useLocalization();
  const [titleText, setTitleText] = useState('FAMILY FEUD');
  const [isEditing, setIsEditing] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Listen for title text changes from host
  useEffect(() => {
    if (socket && isConnected) {
      socket.on('title_text_changed', (data) => {
        setTitleText(data.text);
        
        // Add to history if not already there
        setGameHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length === 0 || newHistory[newHistory.length - 1].type !== 'title_change') {
            newHistory.push({
              type: 'title_change',
              text: data.text,
              timestamp: Date.now()
            });
            setCurrentHistoryIndex(newHistory.length - 1);
          }
          return newHistory;
        });
      });
      
      // Listen for game events to build history
      socket.on('game_started', () => {
        addToHistory('game_start', 'Game started');
      });
      
      socket.on('round_started', (data) => {
        addToHistory('round_start', `Round ${data.roundNumber} started`);
      });
      
      socket.on('answer_revealed', (data) => {
        addToHistory('answer_reveal', `Answer revealed: ${data.answerId}`);
      });
      
      socket.on('strike_added', () => {
        addToHistory('strike', 'Strike added');
      });
      
      socket.on('round_ended', () => {
        addToHistory('round_end', 'Round ended');
      });
      
      socket.on('fast_money_start', () => {
        addToHistory('fast_money_start', 'Fast Money round started');
      });
      
      return () => {
        socket.off('title_text_changed');
        socket.off('game_started');
        socket.off('round_started');
        socket.off('answer_revealed');
        socket.off('strike_added');
        socket.off('round_ended');
        socket.off('fast_money_start');
      };
    }
  }, [socket, isConnected]);
  
  // Add event to history
  const addToHistory = (type, description) => {
    setGameHistory(prev => {
      const newHistory = [...prev, {
        type,
        description,
        timestamp: Date.now()
      }];
      setCurrentHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  };
  
  // Navigate history
  const goBack = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      const event = gameHistory[currentHistoryIndex - 1];
      
      // Emit event to server to go back in history
      if (isHost && socket) {
        socket.emit('history_navigate', {
          index: currentHistoryIndex - 1,
          event
        });
      }
    }
  };
  
  const goForward = () => {
    if (currentHistoryIndex < gameHistory.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      const event = gameHistory[currentHistoryIndex + 1];
      
      // Emit event to server to go forward in history
      if (isHost && socket) {
        socket.emit('history_navigate', {
          index: currentHistoryIndex + 1,
          event
        });
      }
    }
  };
  
  // Update title text
  const handleTitleChange = (e) => {
    setTitleText(e.target.value);
  };
  
  const saveTitle = () => {
    if (isHost && socket) {
      socket.emit('change_title_text', { text: titleText });
    }
    setIsEditing(false);
  };
  
  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta name="description" content="Family Feud Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      
      <main className="min-h-screen bg-blue-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {isEditing && isHost ? (
            <div className="mb-8 text-center">
              <input
                type="text"
                value={titleText}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 text-4xl md:text-6xl font-bold text-center bg-blue-800 border-2 border-yellow-400 text-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                maxLength={30}
              />
              <button
                onClick={saveTitle}
                className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2 px-6 rounded-lg"
              >
                {t('save')}
              </button>
            </div>
          ) : (
            <h1 
              className="text-5xl md:text-7xl font-bold text-yellow-400 mb-8 text-center"
              onClick={() => isHost && setIsEditing(true)}
            >
              {titleText}
            </h1>
          )}
          
          <div className="bg-blue-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t('gameCode')}: {gameCode}</h2>
              
              {isHost && (
                <div className="flex space-x-2">
                  <button
                    onClick={goBack}
                    disabled={currentHistoryIndex <= 0}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      currentHistoryIndex <= 0
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    ← {t('back')}
                  </button>
                  <button
                    onClick={goForward}
                    disabled={currentHistoryIndex >= gameHistory.length - 1}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      currentHistoryIndex >= gameHistory.length - 1
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    {t('forward')} →
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-4">{t('joinGame')}</h3>
                <p className="mb-4">
                  {t('scanQRCode')}
                </p>
                <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                  {/* QR code would go here in a real implementation */}
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-black">QR Code</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">{t('gameControls')}</h3>
                <div className="space-y-4">
                  <a
                    href="/game/buzzer"
                    className="block w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg text-center"
                  >
                    {t('buzzer')}
                  </a>
                  
                  <a
                    href="/game/waiting"
                    className="block w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-4 rounded-lg text-center"
                  >
                    {t('joinTeam')}
                  </a>
                  
                  {isHost && (
                    <a
                      href="/host/panel"
                      className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-center"
                    >
                      {t('hostPanel')}
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {isHost && gameHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">{t('gameHistory')}</h3>
                <div className="bg-blue-700 rounded-lg p-2 max-h-40 overflow-y-auto">
                  {gameHistory.map((event, index) => (
                    <div 
                      key={index}
                      className={`py-1 px-2 rounded ${
                        index === currentHistoryIndex 
                          ? 'bg-yellow-500 text-blue-900' 
                          : 'hover:bg-blue-600'
                      }`}
                      onClick={() => {
                        setCurrentHistoryIndex(index);
                        if (isHost && socket) {
                          socket.emit('history_navigate', {
                            index,
                            event
                          });
                        }
                      }}
                    >
                      {event.type === 'title_change' 
                        ? `Title changed to: ${event.text}` 
                        : event.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
