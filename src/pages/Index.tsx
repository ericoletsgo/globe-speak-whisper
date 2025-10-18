import { useState } from 'react';
import { Globe } from '@/components/Globe';
import { TranslationInput } from '@/components/TranslationInput';
import { toast } from 'sonner';

interface CountryMarker {
  country: string;
  translation: string;
  position: [number, number, number];
}

const Index = () => {
  const [markers, setMarkers] = useState<CountryMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Language to country mapping with approximate 3D positions on globe
  const languageCountries: Record<string, { name: string; position: [number, number, number] }> = {
    'en': { name: 'United States', position: [-1.5, 0.8, 0.8] },
    'es': { name: 'Spain', position: [-0.2, 0.8, 1.8] },
    'fr': { name: 'France', position: [0.1, 0.9, 1.8] },
    'de': { name: 'Germany', position: [0.3, 1.0, 1.7] },
    'it': { name: 'Italy', position: [0.3, 0.8, 1.8] },
    'pt': { name: 'Brazil', position: [-1.2, -0.5, 1.5] },
    'ru': { name: 'Russia', position: [1.2, 1.2, 0.5] },
    'ja': { name: 'Japan', position: [1.8, 0.7, -0.3] },
    'zh': { name: 'China', position: [1.5, 0.5, 0.8] },
    'ar': { name: 'Saudi Arabia', position: [0.8, 0.5, 1.5] },
    'hi': { name: 'India', position: [1.2, 0.3, 1.3] },
    'ko': { name: 'South Korea', position: [1.7, 0.7, 0.2] },
  };

  const handleTranslate = async (text: string) => {
    setIsLoading(true);
    setMarkers([]);

    try {
      // For now, we'll simulate translations
      // In a real app, this would call a translation API
      const targetLanguages = ['es', 'fr', 'de', 'ja', 'zh', 'ar'];
      
      const newMarkers: CountryMarker[] = targetLanguages.map(lang => {
        const countryInfo = languageCountries[lang];
        return {
          country: countryInfo.name,
          translation: `[${lang.toUpperCase()}] ${text}`, // Simulated translation
          position: countryInfo.position,
        };
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMarkers(newMarkers);
      toast.success('Translations loaded! Hover over markers to see translations.');
    } catch (error) {
      toast.error('Failed to translate text');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      {/* Corner decorative elements */}
      <div className="absolute top-4 left-4 w-32 h-32 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-32 h-32 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-32 h-32 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-32 h-32 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 gap-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
            Global Translator
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Translate across the world in real-time
          </p>
        </div>

        {/* Globe container */}
        <div className="relative w-full max-w-6xl aspect-[16/9] animate-fade-in">
          {/* Circular frame around globe */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 shadow-[0_0_30px_rgba(0,217,255,0.2)]" />
          <div className="absolute inset-4 rounded-full border border-primary/10" />
          
          {/* Globe */}
          <div className="absolute inset-8">
            <Globe markers={markers} />
          </div>
        </div>

        {/* Input */}
        <div className="w-full animate-fade-in">
          <TranslationInput onTranslate={handleTranslate} isLoading={isLoading} />
        </div>

        {/* Markers info */}
        {markers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl px-4 animate-fade-in">
            {markers.map((marker, i) => (
              <div
                key={i}
                className="p-3 bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg hover:border-primary/40 transition-colors"
              >
                <div className="text-xs text-primary font-semibold mb-1">
                  {marker.country}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {marker.translation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
