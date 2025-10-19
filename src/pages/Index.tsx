import { useState } from 'react';
import { Globe } from '@/components/Globe';
import { TranslationInput } from '@/components/TranslationInput';
import { toast } from 'sonner';
import { translationService, COUNTRY_LANGUAGES, LANGUAGE_GROUPS } from '@/services/translationService';
import { ALL_COUNTRIES } from '@/data/countries';

interface CountryMarker {
  country: string;
  translation: string;
  position: [number, number, number]; // [longitude, latitude, altitude]
}

const Index = () => {
  const [markers, setMarkers] = useState<CountryMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [translationText, setTranslationText] = useState<string>('');

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
    if (text.length > 25) {
      toast.error('Text must be 25 characters or less');
      return;
    }

    setIsLoading(true);
    setMarkers([]);
    setTranslationText(text);

    try {
      // Detect source language
      const sourceLang = translationService.detectLanguage(text);
      
      // Get all unique language codes from the comprehensive database
      const targetLanguages = [...new Set(ALL_COUNTRIES.map(country => country.languageCode))];
      
      toast.info('Translating text... This may take a moment.');
      
      // Translate to multiple languages
      const translations = await translationService.translateToMultipleLanguages(
        text, 
        sourceLang, 
        targetLanguages
      );
      
      // Create markers for each translation - show one country per language
      const newMarkers: CountryMarker[] = targetLanguages.map(lang => {
        // Find the first country that speaks this language
        const countryData = ALL_COUNTRIES.find(country => country.languageCode === lang);
        const translation = translations[lang] || `[${lang.toUpperCase()}] ${text}`;
        
        if (countryData) {
          return {
            country: countryData.name,
            translation: translation,
            position: [...countryData.coordinates, 0] as [number, number, number],
          };
        }
        return null;
      }).filter(Boolean) as CountryMarker[];

      setMarkers(newMarkers);
      toast.success('Translations loaded! Click markers to see translations.');
    } catch (error) {
      toast.error('Failed to translate text. Please try again.');
      console.error('Translation error:', error);
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
            <Globe markers={markers} translationText={translationText} />
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
