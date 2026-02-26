import { useEffect, useRef, useCallback, useState } from 'react';
import { GameState, WinningLine } from '../types';
import { BingoCard } from './BingoCard';
import { TranscriptPanel } from './TranscriptPanel';
import { GameControls } from './GameControls';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useBingoDetection } from '../hooks/useBingoDetection';
import { getClosestToWin } from '../lib/bingoChecker';
import { showToast } from './ui/Toast';
import { cn } from '../lib/utils';

interface Props {
  game: GameState;
  toggleSquare: (row: number, col: number) => void;
  processTranscript: (transcript: string) => void;
  handleWin: (line: WinningLine, winningWord: string) => void;
  newCard: () => void;
  resetGame: () => void;
  setListening: (listening: boolean) => void;
}

export function GameBoard({
  game,
  toggleSquare,
  processTranscript,
  handleWin,
  newCard,
  resetGame,
  setListening,
}: Props) {
  const speech = useSpeechRecognition();
  const [detectedWords, setDetectedWords] = useState<string[]>([]);

  const { checkBingo } = useBingoDetection(game.card, handleWin);

  const handleTranscript = useCallback(
    (transcript: string) => {
      processTranscript(transcript);
    },
    [processTranscript],
  );

  // Watch for auto-fills and trigger bingo check + toasts
  const prevFilledCountRef = useRef(game.filledCount);
  useEffect(() => {
    if (game.filledCount > prevFilledCountRef.current && game.card) {
      for (const row of game.card.squares) {
        for (const sq of row) {
          if (sq.isAutoFilled && sq.filledAt && sq.filledAt > Date.now() - 1000) {
            showToast(`✨ Detected: "${sq.word}"`, 'success');
            setDetectedWords(prev => [...prev, sq.word]);
          }
        }
      }
    }
    prevFilledCountRef.current = game.filledCount;
  }, [game.filledCount, game.card]);

  // Check bingo after each fill
  useEffect(() => {
    if (!game.card || game.status !== 'playing') return;
    // Find the last filled word
    let lastWord = '';
    let lastTime = 0;
    for (const row of game.card.squares) {
      for (const sq of row) {
        if (sq.isFilled && !sq.isFreeSpace && sq.filledAt && sq.filledAt > lastTime) {
          lastTime = sq.filledAt;
          lastWord = sq.word;
        }
      }
    }
    if (lastWord) {
      checkBingo(lastWord);
    }
  }, [game.filledCount, game.card, game.status, checkBingo]);

  const toggleListening = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
      setListening(false);
    } else {
      speech.startListening(handleTranscript);
      setListening(true);
    }
  }, [speech, handleTranscript, setListening]);

  if (!game.card) return null;

  const closest = getClosestToWin(game.card);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🎯 Meeting Bingo</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {speech.isListening && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Listening
              </span>
            )}
            <span>{game.filledCount}/25 filled</span>
          </div>
        </div>

        {/* Near-bingo indicator */}
        {closest && closest.needed === 1 && (
          <div className={cn(
            'text-center text-sm font-semibold py-1 px-3 rounded-full',
            'bg-amber-100 text-amber-700 animate-pulse',
          )}>
            🔥 One away from BINGO!
          </div>
        )}

        {/* Bingo Card */}
        <BingoCard
          card={game.card}
          winningLine={game.winningLine}
          onSquareClick={toggleSquare}
        />

        {/* Transcript */}
        <TranscriptPanel
          transcript={speech.transcript}
          interimTranscript={speech.interimTranscript}
          detectedWords={detectedWords}
          isListening={speech.isListening}
        />

        {/* Controls */}
        <GameControls
          isListening={speech.isListening}
          isSpeechSupported={speech.isSupported}
          onToggleListening={toggleListening}
          onNewCard={newCard}
          onHome={resetGame}
        />
      </div>
    </div>
  );
}
