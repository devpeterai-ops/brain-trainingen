
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NUMBER_HUNT_GRID_SIZE } from '../constants';
import { ClockIcon } from './icons';

interface NumberHuntGameProps {
  onGameOver: (time: number) => void;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: number[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const NumberHuntGame: React.FC<NumberHuntGameProps> = ({ onGameOver }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const gridSize = NUMBER_HUNT_GRID_SIZE;
  const totalNumbers = gridSize * gridSize;

  useEffect(() => {
    const initialNumbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    setNumbers(shuffleArray(initialNumbers));
  }, [totalNumbers]);

  useEffect(() => {
    if (gameStarted) {
      const startTime = Date.now() - elapsedTime;
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (currentNumber > totalNumbers) {
      if (timerRef.current) clearInterval(timerRef.current);
      onGameOver(elapsedTime);
    }
  }, [currentNumber, totalNumbers, onGameOver, elapsedTime]);

  const handleNumberClick = (clickedNumber: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    if (clickedNumber === currentNumber) {
      setCurrentNumber(prev => prev + 1);
    }
  };
  
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 p-4">
      <header className="flex justify-between items-center text-slate-300 p-4 rounded-xl bg-slate-800 mb-4">
        <div className="text-xl font-bold">Hitta: <span className="text-cyan-400 text-3xl">{currentNumber}</span></div>
        <div className="flex items-center space-x-2 text-3xl font-bold text-cyan-400">
            <ClockIcon className="w-7 h-7 text-slate-300" />
            <span>{formatTime(elapsedTime)}</span>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        <div className={`grid grid-cols-${gridSize} gap-2 w-full max-w-md aspect-square`}>
          {numbers.map((num) => {
            const isClicked = num < currentNumber;
            return (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className={`flex items-center justify-center text-2xl font-bold rounded-lg transition-all duration-300
                  ${isClicked 
                    ? 'bg-slate-700 text-slate-500 scale-95' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 transform hover:scale-105'
                  }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default NumberHuntGame;