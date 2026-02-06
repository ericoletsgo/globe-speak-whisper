/**
 * Translation service using the free MyMemory API.
 * No API key required.  Results are cached in-memory.
 *
 * Endpoint: https://api.mymemory.translated.net/get?q=TEXT&langpair=SRC|TGT
 */
import axios from 'axios';

class TranslationService {
  private cache = new Map<string, string>();

  /** Translate a single text string. */
  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<string> {
    if (sourceLang === targetLang) return text;

    const key = `${text}|${sourceLang}|${targetLang}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    try {
      const { data } = await axios.get(
        'https://api.mymemory.translated.net/get',
        {
          params: { q: text, langpair: `${sourceLang}|${targetLang}` },
          timeout: 4000,
        },
      );

      const result: string | undefined = data?.responseData?.translatedText;

      if (
        result &&
        data.responseStatus === 200 &&
        !result.startsWith('MYMEMORY WARNING') &&
        result !== 'NO QUERY SPECIFIED'
      ) {
        this.cache.set(key, result);
        return result;
      }

      // API didn't return a useful result – fall back
      return `[${targetLang}] ${text}`;
    } catch {
      return `[${targetLang}] ${text}`;
    }
  }

  /**
   * Translate to many languages at once.
   * Batches requests 5-at-a-time to stay under rate limits.
   */
  async translateToMultipleLanguages(
    text: string,
    sourceLang: string,
    targetLanguages: string[],
  ): Promise<Record<string, string>> {
    const translations: Record<string, string> = {};
    translations[sourceLang] = text; // source language is the original

    const targets = targetLanguages.filter(l => l !== sourceLang);

    const BATCH = 5;
    for (let i = 0; i < targets.length; i += BATCH) {
      const batch = targets.slice(i, i + BATCH);
      const results = await Promise.all(
        batch.map(async lang => ({
          lang,
          result: await this.translateText(text, sourceLang, lang),
        })),
      );
      for (const { lang, result } of results) {
        translations[lang] = result;
      }
      // brief pause between batches
      if (i + BATCH < targets.length) {
        await new Promise(r => setTimeout(r, 150));
      }
    }

    return translations;
  }
}

export const translationService = new TranslationService();
