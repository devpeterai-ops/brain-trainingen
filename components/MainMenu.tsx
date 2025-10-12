
import React from 'react';
import { GameType, Scores } from '../types';
import { TrophyIcon, BrainIcon } from './icons';

interface MainMenuProps {
  onStartGame: (game: GameType) => void;
  onShowHighScores: () => void;
  lastResult: { score: number; gameType: GameType } | null;
  clearLastResult: () => void;
  highScores: Scores;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowHighScores, lastResult, clearLastResult, highScores }) => {

  const gameTitles: Record<GameType, string> = {
    colorWord: 'Färgord',
    numberHunt: 'Sifferjakt',
    memoryMatch: 'Minnespar'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-900 text-white animate-fadeIn">
      {lastResult && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn" onClick={clearLastResult}>
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 m-4 max-w-sm w-full text-center border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Resultat</h2>
            <p className="text-lg mb-2">
              {gameTitles[lastResult.gameType]}
            </p>
            <p className="text-5xl font-bold mb-6">
              {lastResult.gameType === 'numberHunt' || lastResult.gameType === 'memoryMatch'
                ? `${(lastResult.score / 1000).toFixed(2)}s` 
                : lastResult.score}
              <span className="text-xl ml-2">{lastResult.gameType === 'colorWord' ? 'poäng' : ''}</span>
            </p>
            <button
              onClick={clearLastResult}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Stäng
            </button>
          </div>
        </div>
      )}

      <BrainIcon className="w-20 h-20 text-cyan-400 mb-4"/>
      <h1 className="text-5xl font-bold mb-2 tracking-tight">Hjärngympa</h1>
      <p className="text-slate-400 mb-12">Vässa ditt sinne med en snabb utmaning.</p>

      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={() => onStartGame('colorWord')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Färgord
        </button>
        <button
          onClick={() => onStartGame('numberHunt')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-4 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Sifferjakt
        </button>
         <button
          onClick={() => onStartGame('memoryMatch')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-4 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Minnespar
        </button>
        <button
          onClick={onShowHighScores}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-4 px-4 rounded-xl transition duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
        >
          <TrophyIcon className="w-5 h-5" />
          <span>High Scores</span>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
