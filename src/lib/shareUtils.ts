import { GameState } from '../types';
import { CATEGORIES } from '../data/categories';

export function formatShareText(game: GameState): string {
  const category = CATEGORIES.find(c => c.id === game.category);
  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 60000)
    : null;

  const lines = [
    '🎯 Meeting Bingo!',
    '',
    `📋 ${category?.name ?? 'Unknown'}`,
    duration !== null ? `⏱️ Time to BINGO: ${duration} min` : null,
    game.winningWord ? `🏆 Winning word: "${game.winningWord}"` : null,
    `📊 Squares filled: ${game.filledCount}/24`,
    '',
    'Play Meeting Bingo!',
  ];

  return lines.filter(l => l !== null).join('\n');
}

export async function shareResult(game: GameState): Promise<void> {
  const text = formatShareText(game);

  if (navigator.share) {
    await navigator.share({ text });
  } else {
    await navigator.clipboard.writeText(text);
  }
}
