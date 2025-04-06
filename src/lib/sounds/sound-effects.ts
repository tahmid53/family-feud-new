// Sound effects manager for Family Feud
import { useEffect, useState } from 'react';

// Define sound types
type SoundType = 
  | 'intro'
  | 'correct'
  | 'wrong'
  | 'strike'
  | 'buzzer'
  | 'timer'
  | 'win'
  | 'fastMoney'
  | 'fastMoneyReveal'
  | 'fastMoneySuccess'
  | 'fastMoneyFail';

// Sound file paths
const soundPaths: Record<SoundType, string> = {
  intro: '/sounds/intro.mp3',
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  strike: '/sounds/strike.mp3',
  buzzer: '/sounds/buzzer.mp3',
  timer: '/sounds/timer.mp3',
  win: '/sounds/win.mp3',
  fastMoney: '/sounds/fast-money.mp3',
  fastMoneyReveal: '/sounds/fast-money-reveal.mp3',
  fastMoneySuccess: '/sounds/fast-money-success.mp3',
  fastMoneyFail: '/sounds/fast-money-fail.mp3'
};

// Sound manager hook
export function useSoundEffects() {
  const [sounds, setSounds] = useState<Record<SoundType, HTMLAudioElement | null>>({
    intro: null,
    correct: null,
    wrong: null,
    strike: null,
    buzzer: null,
    timer: null,
    win: null,
    fastMoney: null,
    fastMoneyReveal: null,
    fastMoneySuccess: null,
    fastMoneyFail: null
  });
  
  const [isMuted, setIsMuted] = useState(false);
  
  // Initialize sounds
  useEffect(() => {
    const loadedSounds: Record<SoundType, HTMLAudioElement> = {} as Record<SoundType, HTMLAudioElement>;
    
    // Load all sounds
    Object.entries(soundPaths).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      loadedSounds[key as SoundType] = audio;
    });
    
    setSounds(loadedSounds);
    
    // Cleanup
    return () => {
      Object.values(loadedSounds).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);
  
  // Play sound function
  const playSound = (type: SoundType) => {
    if (isMuted || !sounds[type]) return;
    
    // Stop the sound if it's already playing
    sounds[type]!.pause();
    sounds[type]!.currentTime = 0;
    
    // Play the sound
    sounds[type]!.play().catch(error => {
      console.error(`Error playing sound ${type}:`, error);
    });
  };
  
  // Stop sound function
  const stopSound = (type: SoundType) => {
    if (!sounds[type]) return;
    
    sounds[type]!.pause();
    sounds[type]!.currentTime = 0;
  };
  
  // Stop all sounds
  const stopAllSounds = () => {
    Object.values(sounds).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (!isMuted) {
      stopAllSounds();
    }
  };
  
  return {
    playSound,
    stopSound,
    stopAllSounds,
    isMuted,
    toggleMute
  };
}
