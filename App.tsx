
import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import ColorWordGame from './components/ColorWordGame';
import NumberHuntGame from './components/NumberHuntGame';
import MemoryMatchGame from './components/MemoryMatchGame';
import HighScores from './components/HighScores';
import useLocalStorage from './hooks/useLocalStorage';
import { GameType, Scores } from './types';

type View = 'menu' | 'colorWord' | 'numberHunt' | 'memoryMatch' | 'highScores';

const App: React.FC = () => {
  const [view, setView] = useState<View>('menu');
  const [scores, setScores] = useLocalStorage<Scores>('brain-training-scores', {
    colorWord: 0,
    numberHunt: null,
    memoryMatch: null,
  });
  const [lastResult, setLastResult] = useState<{ score: number; gameType: GameType } | null>(null);

  const handleStartGame = (game: GameType) => {
    setView(game);
  };

  const handleShowHighScores = () => {
    setView('highScores');
  };

  const handleBackToMenu = () => {
    setView('menu');
  };

  const clearLastResult = () => {
    setLastResult(null);
  };

  const handleGameOver = useCallback((score: number, gameType: GameType) => {
    setLastResult({ score, gameType });
    if (gameType === 'colorWord') {
      if (score > scores.colorWord) {
        setScores(prev => ({ ...prev, colorWord: score }));
      }
    } else if (gameType === 'numberHunt') {
      if (scores.numberHunt === null || score < scores.numberHunt) {
        setScores(prev => ({ ...prev, numberHunt: score }));
      }
    } else if (gameType === 'memoryMatch') {
      if (scores.memoryMatch === null || score < scores.memoryMatch) {
         setScores(prev => ({ ...prev, memoryMatch: score }));
      }
    }
    setView('menu');
  }, [scores, setScores]);

  const renderView = () => {
    switch (view) {
      case 'colorWord':
        return <ColorWordGame onGameOver={(score) => handleGameOver(score, 'colorWord')} />;
      case 'numberHunt':
        return <NumberHuntGame onGameOver={(time) => handleGameOver(time, 'numberHunt')} />;
      case 'memoryMatch':
        return <MemoryMatchGame onGameOver={(time) => handleGameOver(time, 'memoryMatch')} />;
      case 'highScores':
        return <HighScores scores={scores} onBack={handleBackToMenu} />;
      case 'menu':
      default:
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onShowHighScores={handleShowHighScores}
            lastResult={lastResult}
            clearLastResult={clearLastResult}
            highScores={scores}
          />
        );
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen overflow-hidden bg-slate-900 shadow-2xl">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
      {renderView()}
    </div>
  );
};

export default App;
