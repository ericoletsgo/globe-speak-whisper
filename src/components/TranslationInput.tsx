import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';

interface TranslationInputProps {
  onTranslate: (text: string) => void;
  isLoading?: boolean;
}

export const TranslationInput = ({
  onTranslate,
  isLoading = false,
}: TranslationInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) onTranslate(text.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto px-4">
      <div className="flex gap-2 p-1.5 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
        <Input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a word or short phrase…"
          className="flex-1 bg-transparent border-0 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full px-4 h-10"
          disabled={isLoading}
          maxLength={40}
        />
        <Button
          type="submit"
          disabled={isLoading || !text.trim()}
          size="sm"
          className="bg-sky-500 hover:bg-sky-400 text-white rounded-full px-5 h-10 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span className="ml-2 hidden sm:inline text-sm">Translate</span>
        </Button>
      </div>
      <p className="text-center mt-2 text-[10px] text-white/25 select-none">
        {text.length > 0
          ? `${text.length}/40 characters`
          : 'Zoom in to discover more translations'}
      </p>
    </form>
  );
};
