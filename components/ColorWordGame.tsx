
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { COLORS, COLOR_WORD_GAME_DURATION } from '../constants';
import { ColorInfo } from '../types';
import { ClockIcon } from './icons';

interface ColorWordGameProps {
  onGameOver: (score: number) => void;
}

const ColorWordGame: React.FC<ColorWordGameProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(COLOR_WORD_GAME_DURATION);
  const [currentWord, setCurrentWord] = useState<ColorInfo | null>(null);
  const [currentColor, setCurrentColor] = useState<ColorInfo | null>(null);
  const [options, setOptions] = useState<ColorInfo[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateNewProblem = useCallback(() => {
    setFeedback(null);
    
    let newWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    let newColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    // Ensure word and color are different
    while (newWord.name === newColor.name) {
      newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    setCurrentWord(newWord);
    setCurrentColor(newColor);

    // Generate options, including the correct one
    const incorrectOptions = COLORS.filter(c => c.name !== newColor.name);
    const shuffledIncorrect = incorrectOptions.sort(() => 0.5 - Math.random());
    const finalOptions = [newColor, ...shuffledIncorrect.slice(0, 3)].sort(() => 0.5 - Math.random());
    
    setOptions(finalOptions);
  }, []);
  
  useEffect(() => {
    generateNewProblem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onGameOver, score]);

  const handleAnswer = (selectedColor: ColorInfo) => {
    if (feedback) return; // Prevent multiple clicks

    if (selectedColor.name === currentColor?.name) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      setTimeout(generateNewProblem, 300);
    } else {
      setFeedback('incorrect');
      if (containerRef.current) {
        containerRef.current.classList.add('animate-shake');
        setTimeout(() => {
            containerRef.current?.classList.remove('animate-shake');
            generateNewProblem();
        }, 500);
      } else {
         setTimeout(generateNewProblem, 300);
      }
    }
  };

  const feedbackBorderStyle = feedback === 'incorrect' ? 'border-red-500' : 'border-transparent';

  return (
    <div ref={containerRef} className={`flex flex-col h-screen bg-slate-900 p-4 transition-all duration-300 border-4 ${feedbackBorderStyle}`}>
      <header className="flex justify-between items-center text-slate-300 p-4 rounded-xl bg-slate-800">
        <div className="text-2xl font-bold">Poäng: <span className="text-cyan-400">{score}</span></div>
        <div className="flex items-center space-x-2 text-2xl font-bold">
            <ClockIcon className="w-7 h-7" />
            <span className={timeLeft <= 10 ? "text-red-500" : "text-cyan-400"}>{timeLeft}s</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        {currentWord && currentColor && (
          <div className="text-6xl font-extrabold" style={{ color: COLORS.find(c => c.name === currentColor.name)?.class.includes('yellow') ? '#eab308' : undefined }}>
            <span className={currentColor.class}>{currentWord.name}</span>
          </div>
        )}
      </main>

      <footer className="grid grid-cols-2 gap-4">
        {options.map(option => (
          <button
            key={option.name}
            onClick={() => handleAnswer(option)}
            disabled={!!feedback}
            className="py-6 text-xl font-bold rounded-xl text-white transition-transform transform hover:scale-105 disabled:opacity-75"
            style={{ backgroundColor: COLORS.find(c => c.name === option.name)?.class.includes('yellow') ? '#ca8a04' : option.class.replace('text-', 'bg-').replace('-400', '-500').replace('-500', '-600') }}
          >
            {option.name}
          </button>
        ))}
      </footer>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ColorWordGame;
