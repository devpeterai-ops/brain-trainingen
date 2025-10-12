
import React, { useState, useEffect, useRef } from 'react';
import { ClockIcon, StarIcon, HeartIcon, SunIcon, MoonIcon, CloudIcon, LightningIcon, DiamondIcon, SmileyIcon } from './icons';

interface MemoryMatchGameProps {
  onGameOver: (time: number) => void;
}

const ICONS = [StarIcon, HeartIcon, SunIcon, MoonIcon, CloudIcon, LightningIcon, DiamondIcon, SmileyIcon];

type Card = {
  id: number;
  icon: React.FC<{ className?: string }>;
  isFlipped: boolean;
  isMatched: boolean;
};

const shuffleArray = (array: any[]) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onGameOver }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const gameIcons = [...ICONS, ...ICONS];
    const shuffledIcons = shuffleArray(gameIcons);
    setCards(shuffledIcons.map((Icon, index) => ({
      id: index,
      icon: Icon,
      isFlipped: false,
      isMatched: false,
    })));
  }, []);

  useEffect(() => {
    if (gameStarted) {
      const startTime = Date.now() - elapsedTime;
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        // Match
        setTimeout(() => {
          setCards(prevCards => prevCards.map((card, index) => {
            if (index === firstIndex || index === secondIndex) {
              return { ...card, isMatched: true };
            }
            return card;
          }));
          setFlippedIndices([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards => prevCards.map((card, index) => {
            if (index === firstIndex || index === secondIndex) {
              return { ...card, isFlipped: false };
            }
            return card;
          }));
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);
  
  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.isMatched);
    if (allMatched) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => onGameOver(elapsedTime), 500);
    }
  }, [cards, onGameOver, elapsedTime]);

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) {
      return;
    }

    if (!gameStarted) {
      setGameStarted(true);
    }

    setCards(prevCards => prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)));
    setFlippedIndices(prev => [...prev, index]);
  };
  
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 p-4">
       <header className="flex justify-between items-center text-slate-300 p-4 rounded-xl bg-slate-800 mb-4">
        <div className="text-xl font-bold">Drag: <span className="text-purple-400 text-3xl">{moves}</span></div>
        <div className="flex items-center space-x-2 text-3xl font-bold text-purple-400">
            <ClockIcon className="w-7 h-7 text-slate-300" />
            <span>{formatTime(elapsedTime)}</span>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-4 gap-3 w-full max-w-md aspect-square">
          {cards.map((card, index) => (
            <div key={card.id} className="perspective" onClick={() => handleCardClick(index)}>
                <div className={`card-inner ${card.isFlipped || card.isMatched ? 'is-flipped' : ''}`}>
                    <div className="card-face card-front bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
                    </div>
                    <div className={`card-face card-back rounded-lg flex items-center justify-center ${card.isMatched ? 'bg-teal-800' : 'bg-slate-700'}`}>
                        <card.icon className={`w-10 h-10 ${card.isMatched ? 'text-teal-400' : 'text-white'}`} />
                    </div>
                </div>
            </div>
          ))}
        </div>
      </main>
      <style jsx>{`
        .perspective {
            perspective: 1000px;
        }
        .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            cursor: pointer;
        }
        .is-flipped {
            transform: rotateY(180deg);
        }
        .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        .card-back {
            transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default MemoryMatchGame;
