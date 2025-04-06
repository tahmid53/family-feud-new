// Localization support for Family Feud
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'es';

// Define translation keys
type TranslationKey = 
  | 'appTitle'
  | 'joinGame'
  | 'hostGame'
  | 'enterName'
  | 'enterGameCode'
  | 'join'
  | 'create'
  | 'waiting'
  | 'start'
  | 'buzzer'
  | 'strike'
  | 'correct'
  | 'nextRound'
  | 'fastMoney'
  | 'teamName'
  | 'player'
  | 'host'
  | 'points'
  | 'timer'
  | 'back'
  | 'settings'
  | 'sound'
  | 'language'
  | 'changeTitleText'
  | 'teamSelection'
  | 'selectTeam'
  | 'gameOver'
  | 'winner'
  | 'playAgain'
  | 'exitGame';

// Define translations
const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    appTitle: 'Family Feud',
    joinGame: 'Join Game',
    hostGame: 'Host a Game',
    enterName: 'Enter your name',
    enterGameCode: 'Enter game code',
    join: 'Join',
    create: 'Create',
    waiting: 'Waiting for players...',
    start: 'Start Game',
    buzzer: 'Buzzer',
    strike: 'Strike',
    correct: 'Correct',
    nextRound: 'Next Round',
    fastMoney: 'Fast Money',
    teamName: 'Team Name',
    player: 'Player',
    host: 'Host',
    points: 'Points',
    timer: 'Timer',
    back: 'Back',
    settings: 'Settings',
    sound: 'Sound',
    language: 'Language',
    changeTitleText: 'Change Title Text',
    teamSelection: 'Team Selection',
    selectTeam: 'Select Team',
    gameOver: 'Game Over',
    winner: 'Winner',
    playAgain: 'Play Again',
    exitGame: 'Exit Game'
  },
  es: {
    appTitle: 'Cien Latinos Dijeron',
    joinGame: 'Unirse al Juego',
    hostGame: 'Ser Anfitrión',
    enterName: 'Ingresa tu nombre',
    enterGameCode: 'Ingresa el código del juego',
    join: 'Unirse',
    create: 'Crear',
    waiting: 'Esperando jugadores...',
    start: 'Iniciar Juego',
    buzzer: 'Timbre',
    strike: 'Error',
    correct: 'Correcto',
    nextRound: 'Siguiente Ronda',
    fastMoney: 'Dinero Rápido',
    teamName: 'Nombre del Equipo',
    player: 'Jugador',
    host: 'Anfitrión',
    points: 'Puntos',
    timer: 'Temporizador',
    back: 'Atrás',
    settings: 'Configuración',
    sound: 'Sonido',
    language: 'Idioma',
    changeTitleText: 'Cambiar Texto del Título',
    teamSelection: 'Selección de Equipo',
    selectTeam: 'Seleccionar Equipo',
    gameOver: 'Fin del Juego',
    winner: 'Ganador',
    playAgain: 'Jugar de Nuevo',
    exitGame: 'Salir del Juego'
  }
};

// Create context
type LocalizationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LocalizationContext = createContext<LocalizationContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => ''
});

// Provider component
export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Custom hook to use localization
export const useLocalization = () => useContext(LocalizationContext);
