import { useCallback, useRef } from 'react';
import { GameState, CategoryId, WinningLine } from '../types';
import { generateCard } from '../lib/cardGenerator';
import { countFilled } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';

const INITIAL_STATE: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export function useGame(game: GameState, setGame: (value: GameState | ((prev: GameState) => GameState)) => void) {
  const filledWordsRef = useRef<Set<string>>(new Set());

  const startGame = useCallback((categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    filledWordsRef.current = new Set();
    setGame({
      ...INITIAL_STATE,
      status: 'playing',
      category: categoryId,
      card,
      startedAt: Date.now(),
      filledCount: 1,
    });
  }, [setGame]);

  const toggleSquare = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;
      const square = prev.card.squares[row][col];
      if (square.isFreeSpace) return prev;

      const newSquares = prev.card.squares.map((r, ri) =>
        r.map((s, ci) => {
          if (ri === row && ci === col) {
            const nowFilled = !s.isFilled;
            if (nowFilled) {
              filledWordsRef.current.add(s.word.toLowerCase());
            } else {
              filledWordsRef.current.delete(s.word.toLowerCase());
            }
            return {
              ...s,
              isFilled: nowFilled,
              isAutoFilled: false,
              filledAt: nowFilled ? Date.now() : null,
            };
          }
          return s;
        }),
      );

      const newCard = { ...prev.card, squares: newSquares };
      return {
        ...prev,
        card: newCard,
        filledCount: countFilled(newCard),
      };
    });
  }, [setGame]);

  const processTranscript = useCallback((transcript: string) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;

      const detected = detectWordsWithAliases(
        transcript,
        prev.card.words,
        filledWordsRef.current,
      );

      if (detected.length === 0) return prev;

      const newSquares = prev.card.squares.map(r =>
        r.map(s => {
          if (detected.some(d => d.toLowerCase() === s.word.toLowerCase()) && !s.isFilled) {
            filledWordsRef.current.add(s.word.toLowerCase());
            return {
              ...s,
              isFilled: true,
              isAutoFilled: true,
              filledAt: Date.now(),
            };
          }
          return s;
        }),
      );

      const newCard = { ...prev.card, squares: newSquares };
      return {
        ...prev,
        card: newCard,
        filledCount: countFilled(newCard),
      };
    });
  }, [setGame]);

  const handleWin = useCallback((line: WinningLine, winningWord: string) => {
    setGame(prev => ({
      ...prev,
      status: 'won',
      completedAt: Date.now(),
      winningLine: line,
      winningWord,
      isListening: false,
    }));
  }, [setGame]);

  const newCard = useCallback(() => {
    if (game.category) {
      startGame(game.category);
    }
  }, [game.category, startGame]);

  const resetGame = useCallback(() => {
    filledWordsRef.current = new Set();
    setGame(INITIAL_STATE);
  }, [setGame]);

  const setListening = useCallback((listening: boolean) => {
    setGame(prev => ({ ...prev, isListening: listening }));
  }, [setGame]);

  const rehydrateFilledWords = useCallback(() => {
    if (!game.card) return;
    const filled = new Set<string>();
    for (const row of game.card.squares) {
      for (const sq of row) {
        if (sq.isFilled && !sq.isFreeSpace) {
          filled.add(sq.word.toLowerCase());
        }
      }
    }
    filledWordsRef.current = filled;
  }, [game.card]);

  return {
    startGame,
    toggleSquare,
    processTranscript,
    handleWin,
    newCard,
    resetGame,
    setListening,
    rehydrateFilledWords,
    filledWordsRef,
  };
}
