import { Button } from './ui/Button';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            🎯 Meeting Bingo
          </h1>
          <p className="text-lg text-gray-600">
            Turn any meeting into a game.
            <br />
            Auto-detects buzzwords using speech recognition!
          </p>
        </div>

        <Button size="lg" onClick={onStart} className="text-xl px-8 py-4">
          🎮 New Game
        </Button>

        <p className="text-sm text-gray-400">
          🔒 Audio processed locally. Never recorded.
        </p>

        <div className="border-t border-gray-200 pt-6 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            How It Works
          </h2>
          <ol className="text-left text-gray-600 space-y-2 text-sm">
            <li>1. Pick a buzzword category</li>
            <li>2. Enable microphone for auto-detection</li>
            <li>3. Join your meeting and listen</li>
            <li>4. Watch squares fill automatically!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
