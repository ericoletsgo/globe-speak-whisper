import { useState, useRef, useCallback } from 'react';
import { Globe, GlobeLabelData } from '@/components/Globe';
import { TranslationInput } from '@/components/TranslationInput';
import { translationService } from '@/services/translationService';
import { ALL_COUNTRIES, CountryData } from '@/data/countries';
import { toast } from 'sonner';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeLabel(
  c: CountryData,
  translations: Record<string, string>,
  fallback: string,
): GlobeLabelData {
  return {
    id: c.name,
    lat: c.coordinates[1],
    lng: c.coordinates[0],
    translation: translations[c.languageCode] ?? fallback,
    language: c.language,
    country: c.name,
    languageCode: c.languageCode,
    tier: c.tier,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

const Index = () => {
  const [labels, setLabels] = useState<GlobeLabelData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs so async callbacks always read the latest values
  const currentTextRef = useRef('');
  const translationCacheRef = useRef<Record<string, string>>({});
  const loadingLangsRef = useRef(new Set<string>());

  /** Rebuild the labels array from whatever translations are cached so far. */
  const rebuildLabels = useCallback(() => {
    const text = currentTextRef.current;
    const cache = translationCacheRef.current;
    if (!text) {
      setLabels([]);
      return;
    }
    // Only include countries whose language has been translated
    setLabels(
      ALL_COUNTRIES
        .filter(c => cache[c.languageCode] != null)
        .map(c => makeLabel(c, cache, text)),
    );
  }, []);

  // ── Initial translate (tier-1 only → fast) ──

  const handleTranslate = async (text: string) => {
    // Reset everything
    currentTextRef.current = text;
    translationCacheRef.current = {};
    loadingLangsRef.current.clear();
    setLabels([]);
    setIsLoading(true);

    try {
      const tier1Langs = [
        ...new Set(
          ALL_COUNTRIES.filter(c => c.tier === 1).map(c => c.languageCode),
        ),
      ];

      const trans = await translationService.translateToMultipleLanguages(
        text,
        'en',
        tier1Langs,
      );

      // Only apply if user hasn't typed something new
      if (currentTextRef.current !== text) return;

      translationCacheRef.current = trans;
      rebuildLabels();
      toast.success('Translations loaded – zoom in for more!');
    } catch (err) {
      console.error('Translation error:', err);
      toast.error('Translation failed – please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Lazy-load translations when the user zooms to a new tier ──

  const handleZoomTierChange = useCallback(
    async (newTier: 1 | 2 | 3) => {
      const text = currentTextRef.current;
      if (!text) return;

      // Which language codes do we need for this tier?
      const needed = [
        ...new Set(
          ALL_COUNTRIES
            .filter(c => c.tier <= newTier)
            .map(c => c.languageCode),
        ),
      ];

      const cache = translationCacheRef.current;
      const loading = loadingLangsRef.current;
      const missing = needed.filter(l => !cache[l] && !loading.has(l));

      if (missing.length === 0) {
        // All translations are already cached – just refresh labels
        // (the Globe may now be showing a wider tier)
        rebuildLabels();
        return;
      }

      // Mark as in-flight to avoid duplicate requests
      missing.forEach(l => loading.add(l));

      try {
        const extra = await translationService.translateToMultipleLanguages(
          text,
          'en',
          missing,
        );

        // Only apply if user hasn't changed the input
        if (currentTextRef.current !== text) return;

        translationCacheRef.current = { ...translationCacheRef.current, ...extra };
        missing.forEach(l => loading.delete(l));
        rebuildLabels();
      } catch (err) {
        console.error('Lazy translation error:', err);
        missing.forEach(l => loading.delete(l));
      }
    },
    [rebuildLabels],
  );

  // ── Render ──

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#070b14]">
      {/* ── Floating header ── */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none select-none">
        <div className="text-center pt-5 pb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white/90 tracking-tight drop-shadow-lg">
            Globe Speak
          </h1>
          <p className="text-[11px] text-sky-300/40 mt-0.5">
            See &amp; hear translations across the world
          </p>
        </div>
      </div>

      {/* ── Globe fills screen ── */}
      <div className="flex-1 w-full relative">
        <Globe
          labels={labels}
          isLoading={isLoading}
          onZoomTierChange={handleZoomTierChange}
        />
      </div>

      {/* ── Floating input ── */}
      <div className="absolute bottom-5 left-0 right-0 z-20">
        <TranslationInput onTranslate={handleTranslate} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
