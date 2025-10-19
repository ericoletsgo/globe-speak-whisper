import axios from 'axios';
import { ALL_COUNTRIES, CountryData, getCountriesForZoomLevel as getCountriesForZoom } from '@/data/countries';

interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

// Legacy mapping for backward compatibility - populated from the comprehensive database
export const COUNTRY_LANGUAGES: Record<string, { language: string; code: string }> = {};

// Populate the legacy mapping from the comprehensive database
ALL_COUNTRIES.forEach(country => {
  COUNTRY_LANGUAGES[country.name] = {
    language: country.language,
    code: country.languageCode
  };
});

// Group countries by language for zoom-based display - generated from comprehensive database
export const LANGUAGE_GROUPS: Record<string, string[]> = {};

// Populate language groups from the comprehensive database
ALL_COUNTRIES.forEach(country => {
  if (!LANGUAGE_GROUPS[country.languageCode]) {
    LANGUAGE_GROUPS[country.languageCode] = [];
  }
  LANGUAGE_GROUPS[country.languageCode].push(country.name);
});

// Zoom level thresholds for showing different levels of detail
export const ZOOM_LEVELS = {
  LOW: 1.5,    // Show major language groups only
  MEDIUM: 2.5, // Show individual countries
  HIGH: 3.5,   // Show all countries
};

class TranslationService {
  private cache = new Map<string, string>();
  private baseUrl = 'https://libretranslate.de/translate';

  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    // Check cache first
    const cacheKey = `${text}-${sourceLang}-${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try LibreTranslate first
      const response = await axios.post(this.baseUrl, {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 3000 // 3 second timeout
      });

      const translatedText = response.data.translatedText;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      
      console.log(`Translation successful: ${text} -> ${translatedText} (${sourceLang} to ${targetLang})`);
      return translatedText;
    } catch (error) {
      console.error('LibreTranslate error:', error);
      
      // Try MyMemory API as fallback
      try {
        const fallbackResponse = await axios.get(`https://api.mymemory.translated.net/get`, {
          params: {
            q: text,
            langpair: `${sourceLang}|${targetLang}`
          },
          timeout: 3000
        });
        
        const translatedText = fallbackResponse.data.responseData.translatedText;
        
        // Cache the result
        this.cache.set(cacheKey, translatedText);
        
        console.log(`Translation successful (MyMemory): ${text} -> ${translatedText} (${sourceLang} to ${targetLang})`);
        return translatedText;
      } catch (fallbackError) {
        console.error('MyMemory API error:', fallbackError);
        
        // Final fallback: return original text with language indicator
        return `[${targetLang.toUpperCase()}] ${text}`;
      }
    }
  }

  async translateToMultipleLanguages(text: string, sourceLang: string, targetLanguages: string[]): Promise<Record<string, string>> {
    const translations: Record<string, string> = {};
    
    // Process translations in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < targetLanguages.length; i += batchSize) {
      const batch = targetLanguages.slice(i, i + batchSize);
      
      const promises = batch.map(async (lang) => {
        const translation = await this.translateText(text, sourceLang, lang);
        return { lang, translation };
      });
      
      const results = await Promise.all(promises);
      results.forEach(({ lang, translation }) => {
        translations[lang] = translation;
      });
      
      // Small delay between batches to be respectful to the API
      if (i + batchSize < targetLanguages.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return translations;
  }

  detectLanguage(text: string): string {
    // Simple language detection - in a real app you might use a proper detection service
    // For now, assume English as default
    return 'en';
  }

  getCountriesForZoomLevel(zoomLevel: number): string[] {
    if (zoomLevel < ZOOM_LEVELS.MEDIUM) {
      // Low zoom: show only major countries per language group
      return Object.keys(LANGUAGE_GROUPS).map(lang => {
        const countries = LANGUAGE_GROUPS[lang as keyof typeof LANGUAGE_GROUPS];
        return countries[0]; // Return first country as representative
      });
    } else if (zoomLevel < ZOOM_LEVELS.HIGH) {
      // Medium zoom: show all countries
      return Object.keys(COUNTRY_LANGUAGES);
    } else {
      // High zoom: show all countries (same as medium for now)
      return Object.keys(COUNTRY_LANGUAGES);
    }
  }

  getAllCountries(): string[] {
    return ALL_COUNTRIES.map(country => country.name);
  }

  getCountryData(countryName: string): CountryData | undefined {
    return ALL_COUNTRIES.find(country => country.name === countryName);
  }

  getCountriesWithCoordinates(): CountryData[] {
    return ALL_COUNTRIES;
  }
}

export const translationService = new TranslationService();
