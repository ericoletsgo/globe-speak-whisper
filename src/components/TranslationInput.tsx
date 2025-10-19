import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface TranslationInputProps {
  onTranslate: (text: string) => void;
  isLoading?: boolean;
}

export const TranslationInput = ({ onTranslate, isLoading = false }: TranslationInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTranslate(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur-xl animate-glow-pulse" />
        <div className="relative flex gap-2 p-1 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/30">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate (max 25 characters)..."
            className="flex-1 bg-background/50 border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
            disabled={isLoading}
            maxLength={25}
          />
          <Button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <Globe className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span className="ml-2">Translate</span>
          </Button>
        </div>
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-muted-foreground">
          {text.length}/25 characters
        </span>
      </div>
    </form>
  );
};
