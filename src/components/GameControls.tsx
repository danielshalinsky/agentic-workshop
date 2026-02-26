import { Button } from './ui/Button';

interface Props {
  isListening: boolean;
  isSpeechSupported: boolean;
  onToggleListening: () => void;
  onNewCard: () => void;
  onHome: () => void;
}

export function GameControls({
  isListening,
  isSpeechSupported,
  onToggleListening,
  onNewCard,
  onHome,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {isSpeechSupported && (
        <Button
          variant={isListening ? 'secondary' : 'primary'}
          onClick={onToggleListening}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? '⏹️ Stop Listening' : '🎤 Start Listening'}
        </Button>
      )}
      <Button variant="secondary" onClick={onNewCard}>
        🔄 New Card
      </Button>
      <Button variant="ghost" onClick={onHome}>
        🏠 Home
      </Button>
    </div>
  );
}
