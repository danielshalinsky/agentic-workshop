import { useEffect } from 'react';
import { CategoryId } from './types';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';
import { ToastContainer } from './components/ui/Toast';
import { useGame } from './hooks/useGame';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GameState } from './types';

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

export default function App() {
  const [game, setGame] = useLocalStorage<GameState>('meeting-bingo-game', INITIAL_STATE);

  const {
    startGame,
    toggleSquare,
    processTranscript,
    handleWin,
    newCard,
    resetGame,
    setListening,
    rehydrateFilledWords,
  } = useGame(game, setGame);

  // Rehydrate filled words ref from persisted state on mount
  useEffect(() => {
    rehydrateFilledWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    setGame(prev => ({ ...prev, status: 'setup' }));
  };

  const handleCategorySelect = (categoryId: CategoryId) => {
    startGame(categoryId);
  };

  const handlePlayAgain = () => {
    setGame(prev => ({ ...prev, status: 'setup' }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {game.status === 'idle' && (
        <LandingPage onStart={handleStart} />
      )}
      {game.status === 'setup' && (
        <CategorySelect
          onSelect={handleCategorySelect}
          onBack={resetGame}
        />
      )}
      {game.status === 'playing' && game.card && (
        <GameBoard
          game={game}
          toggleSquare={toggleSquare}
          processTranscript={processTranscript}
          handleWin={handleWin}
          newCard={newCard}
          resetGame={resetGame}
          setListening={setListening}
        />
      )}
      {game.status === 'won' && (
        <WinScreen
          game={game}
          onPlayAgain={handlePlayAgain}
          onHome={resetGame}
        />
      )}
      <ToastContainer />
    </div>
  );
}
