"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSocket } from '../../../lib/socket/socket-context';
import { useLocalization } from '../../../lib/localization/localization';

export default function MobileOptimizedBuzzer() {
  const { socket, playerName, gameCode, isConnected } = useSocket();
  const { t } = useLocalization();
  const [lastBuzzTime, setLastBuzzTime] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [latency, setLatency] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);

  // Check orientation on mount and when window resizes
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    // Initial check
    checkOrientation();
    
    // Add event listener
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

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
    <>
      <Head>
        <title>{t('buzzer')} - {t('appTitle')}</title>
        <meta name="description" content={`${t('appTitle')} ${t('buzzer')}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      
      <div className="min-h-screen bg-blue-900 text-white">
        <div className="bg-blue-950 p-3 text-center">
          <h1 className="text-2xl font-bold text-yellow-400">{t('buzzer').toUpperCase()}</h1>
        </div>
        
        <div className={`container mx-auto p-4 ${isLandscape ? 'landscape-flex' : ''}`}>
          <div className={`flex ${isLandscape ? 'flex-row justify-around' : 'flex-col items-center justify-center'} min-h-[70vh]`}>
            <button
              onClick={handleBuzz}
              onTouchStart={handleBuzz}
              disabled={cooldown || !isConnected}
              className={`buzzer-button ${
                cooldown 
                  ? 'bg-gray-500 scale-95' 
                  : 'bg-red-600 hover:bg-red-500 active:scale-95 shadow-lg'
              }`}
              aria-label={t('buzzer')}
            >
              <span className="text-white text-4xl font-bold">
                {cooldown ? t('wait') : t('buzz')}
              </span>
            </button>
            
            <div className={`player-info ${isLandscape ? 'mt-0 ml-4 text-left' : 'mt-8 text-center'}`}>
              <div className="text-xl mb-1">{t('player')}: {playerName}</div>
              <div className="text-lg text-yellow-400 mb-1">{t('gameCode')}: {gameCode}</div>
              <div className="text-sm text-gray-300">{t('latency')}: {latency}ms</div>
            </div>
          </div>
          
          {feedback && (
            <div className="mt-4 text-center text-xl font-bold text-yellow-400 h-8">
              {feedback}
            </div>
          )}
        </div>
        
        <nav className="mobile-nav">
          <a href="/game/buzzer" className="mobile-nav-item active">
            <span className="mobile-nav-icon">🔴</span>
            {t('buzzer')}
          </a>
          <a href="/game/waiting" className="mobile-nav-item">
            <span className="mobile-nav-icon">👥</span>
            {t('teams')}
          </a>
          <a href="/game/title" className="mobile-nav-item">
            <span className="mobile-nav-icon">🎮</span>
            {t('game')}
          </a>
        </nav>
      </div>
    </>
  );
}
