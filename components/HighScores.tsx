
import React from 'react';
import { Scores } from '../types';
import { BackIcon, TrophyIcon, ClockIcon, PuzzlePieceIcon } from './icons';

interface HighScoresProps {
  scores: Scores;
  onBack: () => void;
}

const HighScores: React.FC<HighScoresProps> = ({ scores, onBack }) => {

  const formatTime = (time: number | null) => {
    if (time === null) return '-.--s';
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 p-4 animate-fadeIn">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
          <BackIcon className="w-6 h-6 text-slate-300" />
        </button>
        <h1 className="text-3xl font-bold text-center flex-grow -ml-10">High Scores</h1>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center space-y-8">
        <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-6 text-center border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-300 mb-2">Färgord</h2>
          <div className="flex items-center justify-center space-x-3">
            <TrophyIcon className="w-10 h-10 text-yellow-400" />
            <span className="text-5xl font-bold text-white">{scores.colorWord}</span>
            <span className="text-slate-400 self-end mb-1">poäng</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Högsta poäng</p>
        </div>

        <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-6 text-center border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-300 mb-2">Sifferjakt</h2>
           <div className="flex items-center justify-center space-x-3">
            <ClockIcon className="w-10 h-10 text-cyan-400" />
            <span className="text-5xl font-bold text-white">{formatTime(scores.numberHunt)}</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Bästa tid</p>
        </div>
        
        <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-6 text-center border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-300 mb-2">Minnespar</h2>
           <div className="flex items-center justify-center space-x-3">
            <PuzzlePieceIcon className="w-10 h-10 text-purple-400" />
            <span className="text-5xl font-bold text-white">{formatTime(scores.memoryMatch)}</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Bästa tid</p>
        </div>
      </div>

    </div>
  );
};

export default HighScores;
