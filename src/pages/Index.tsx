import { useState } from 'react';
import { Globe } from '@/components/Globe';
import { TranslationInput } from '@/components/TranslationInput';
import { toast } from 'sonner';

interface CountryMarker {
  country: string;
  translation: string;
  position: [number, number, number]; // [longitude, latitude, altitude]
}

const Index = () => {
  const [markers, setMarkers] = useState<CountryMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Language to country mapping with longitude/latitude coordinates
  const languageCountries: Record<string, { name: string; position: [number, number, number] }> = {
    'en': { name: 'United States', position: [-95.7129, 37.0902, 0] }, // Center of USA
    'es': { name: 'Spain', position: [-3.7492, 40.4637, 0] }, // Madrid
    'fr': { name: 'France', position: [2.3522, 48.8566, 0] }, // Paris
    'de': { name: 'Germany', position: [10.4515, 51.1657, 0] }, // Berlin
    'it': { name: 'Italy', position: [12.5674, 41.8719, 0] }, // Rome
    'pt': { name: 'Brazil', position: [-51.9253, -14.2350, 0] }, // Brasília
    'ru': { name: 'Russia', position: [105.3188, 61.5240, 0] }, // Moscow
    'ja': { name: 'Japan', position: [138.2529, 36.2048, 0] }, // Tokyo
    'zh': { name: 'China', position: [104.1954, 35.8617, 0] }, // Beijing
    'ar': { name: 'Saudi Arabia', position: [45.0792, 23.8859, 0] }, // Riyadh
    'hi': { name: 'India', position: [78.9629, 20.5937, 0] }, // New Delhi
    'ko': { name: 'South Korea', position: [127.7669, 35.9078, 0] }, // Seoul
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
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center pt-8 pb-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
            Global Translator
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Translate across the world in real-time
          </p>
        </div>

        {/* Globe container - much taller and fills most of screen */}
        <div className="relative w-full flex-1 px-4 pb-4 animate-fade-in">
          <div className="w-full h-full max-w-7xl mx-auto border-2 border-primary/30 rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm" style={{ minHeight: '65vh' }}>
            <Globe markers={markers} />
          </div>
        </div>

        {/* Input at bottom */}
        <div className="w-full px-4 pb-8 pt-4 animate-fade-in">
          <TranslationInput onTranslate={handleTranslate} isLoading={isLoading} />
        </div>

        {/* Markers info */}
        {markers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl mx-auto px-4 pb-8 animate-fade-in">
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
