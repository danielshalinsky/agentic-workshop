import { useEffect, useRef } from 'react';
import { BingoCard, WinningLine } from '../types';
import { checkForBingo } from '../lib/bingoChecker';

export function useBingoDetection(
  card: BingoCard | null,
  onBingo: (line: WinningLine, lastWord: string) => void,
) {
  const hasFiredRef = useRef(false);
  const lastFilledWordRef = useRef<string>('');

  useEffect(() => {
    hasFiredRef.current = false;
  }, [card?.words]);

  const checkBingo = (filledWord: string) => {
    if (!card || hasFiredRef.current) return;
    lastFilledWordRef.current = filledWord;

    const winningLine = checkForBingo(card);
    if (winningLine) {
      hasFiredRef.current = true;
      onBingo(winningLine, filledWord);
    }
  };

  return { checkBingo };
}
