import { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface Props {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Choose Your Buzzword Pack
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map(category => (
            <Card
              key={category.id}
              hoverable
              onClick={() => onSelect(category.id)}
              className="text-center space-y-3 hover:ring-2 hover:ring-blue-400"
            >
              <div className="text-4xl">{category.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.description}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {category.words.slice(0, 4).map(word => (
                  <span
                    key={word}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
