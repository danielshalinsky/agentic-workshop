import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types';
import { CATEGORIES } from '../data/categories';
import { BingoCard } from './BingoCard';
import { Button } from './ui/Button';
import { shareResult } from '../lib/shareUtils';
import { showToast } from './ui/Toast';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const category = CATEGORIES.find(c => c.id === game.category);
  const duration =
    game.startedAt && game.completedAt
      ? Math.round((game.completedAt - game.startedAt) / 60000)
      : null;

  const handleShare = async () => {
    try {
      await shareResult(game);
      showToast('Result copied to clipboard!', 'success');
    } catch {
      showToast('Could not share result', 'warning');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 animate-bounce-in">
          🎉 🎊 BINGO! 🎊 🎉
        </h1>

        {game.card && (
          <BingoCard
            card={game.card}
            winningLine={game.winningLine}
            onSquareClick={() => {}}
          />
        )}

        <div className="space-y-2 text-gray-700">
          {category && (
            <p className="text-sm text-gray-500">📋 {category.name}</p>
          )}
          {duration !== null && <p>⏱️ Time to BINGO: {duration} minutes</p>}
          {game.winningWord && (
            <p>🏆 Winning word: &ldquo;{game.winningWord}&rdquo;</p>
          )}
          <p>📊 Squares filled: {game.filledCount}/24</p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={handleShare}>📤 Share Result</Button>
          <Button variant="secondary" onClick={onPlayAgain}>
            🔄 Play Again
          </Button>
          <Button variant="ghost" onClick={onHome}>
            🏠 Home
          </Button>
        </div>
      </div>
    </div>
  );
}
