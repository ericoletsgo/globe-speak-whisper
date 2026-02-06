/**
 * Multi-engine Text-to-Speech service.
 *
 * ENGINE 1 — Web Speech API  (browser built-in voices)
 *   Picks a language-specific voice from the browser's voice list.
 *   Zero latency, works offline for installed voices.
 *
 * ENGINE 2 — Google Translate TTS via /api/tts proxy
 *   Our own server-side proxy (Vite middleware in dev, Vercel Edge
 *   Function in production) fetches audio from Google Translate TTS.
 *   Covers every language Google Translate supports — Arabic, Greek,
 *   Korean, Filipino, Thai, Vietnamese, etc.
 *   No CORS issues because it's same-origin.
 *
 * ENGINE 3 — Web Speech API, lang-only  (last resort)
 *   Sets `utterance.lang` without a specific voice.  Chrome may still
 *   auto-select a Google network voice for many languages.
 *
 * The audio.play() in Engine 2 is called synchronously from the click
 * handler to satisfy the browser's autoplay policy.
 */

// ── Language → BCP 47 locale ────────────────────────────────────────────────

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
  it: 'it-IT', pt: 'pt-BR', ru: 'ru-RU', zh: 'zh-CN',
  ja: 'ja-JP', ko: 'ko-KR', ar: 'ar-SA', hi: 'hi-IN',
  tr: 'tr-TR', pl: 'pl-PL', nl: 'nl-NL', sv: 'sv-SE',
  da: 'da-DK', fi: 'fi-FI', no: 'nb-NO', el: 'el-GR',
  cs: 'cs-CZ', ro: 'ro-RO', hu: 'hu-HU', sk: 'sk-SK',
  bg: 'bg-BG', hr: 'hr-HR', uk: 'uk-UA', th: 'th-TH',
  vi: 'vi-VN', id: 'id-ID', ms: 'ms-MY', tl: 'fil-PH',
  he: 'he-IL', bn: 'bn-BD', ur: 'ur-PK', sw: 'sw-KE',
  ka: 'ka-GE', hy: 'hy-AM', az: 'az-AZ', be: 'be-BY',
  lt: 'lt-LT', lv: 'lv-LV', et: 'et-EE', sr: 'sr-RS',
  sq: 'sq-AL', mk: 'mk-MK', sl: 'sl-SI', is: 'is-IS',
  mt: 'mt-MT', ne: 'ne-NP', si: 'si-LK', km: 'km-KH',
  lo: 'lo-LA', my: 'my-MM', mn: 'mn-MN', kk: 'kk-KZ',
  uz: 'uz-UZ', tg: 'tg-TJ', ky: 'ky-KG', tk: 'tk-TM',
  ps: 'ps-AF', am: 'am-ET', ti: 'ti-ER', so: 'so-SO',
  mg: 'mg-MG', st: 'st-LS', bs: 'bs-BA', me: 'sr-ME',
  dz: 'dz-BT',
};

const LANG_FALLBACKS: Record<string, string[]> = {
  zh: ['zh-CN', 'zh-TW', 'zh-HK', 'cmn-Hans-CN'],
  no: ['nb-NO', 'nn-NO'],
  sr: ['sr-RS', 'sr-Latn-RS', 'hr-HR'],
  bs: ['bs-BA', 'hr-HR', 'sr-RS'],
  me: ['sr-ME', 'sr-RS', 'hr-HR'],
  pt: ['pt-BR', 'pt-PT'],
  tl: ['fil-PH', 'tl-PH'],
};

// For the TTS proxy, map language codes to simple Google TTS codes
const TTS_LANG_MAP: Record<string, string> = {
  tl: 'tl', // Filipino — Google TTS uses "tl", not "fil"
  no: 'no', // Norwegian
  he: 'iw', // Hebrew — Google uses old code "iw"
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function once(fn?: () => void): () => void {
  let called = false;
  return () => {
    if (called) return;
    called = true;
    fn?.();
  };
}

// ── Service ─────────────────────────────────────────────────────────────────

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synth = window.speechSynthesis;
      this.refreshVoiceCache();
      this.synth.addEventListener('voiceschanged', () =>
        this.refreshVoiceCache(),
      );
    }
  }

  // ── Voice cache ─────────────────────────────────────────────────────────

  private refreshVoiceCache() {
    if (!this.synth) return;
    const v = this.synth.getVoices();
    if (v.length > 0) this.cachedVoices = v;
  }

  private getVoices(): SpeechSynthesisVoice[] {
    if (this.synth) {
      const fresh = this.synth.getVoices();
      if (fresh.length > 0) {
        this.cachedVoices = fresh;
        return fresh;
      }
    }
    return this.cachedVoices;
  }

  // ── Voice selection ─────────────────────────────────────────────────────

  private pickVoice(langCode: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    const lc = langCode.toLowerCase();
    const locale = LOCALE_MAP[lc];

    // 1. Exact locale
    if (locale) {
      const found = voices.find(
        v => v.lang.replace(/_/g, '-').toLowerCase() === locale.toLowerCase(),
      );
      if (found) return found;
    }

    // 2. Prefix match, prefer network voices
    const prefixed = voices.filter(v => {
      const vl = v.lang.replace(/_/g, '-').toLowerCase();
      return vl === lc || vl.startsWith(lc + '-');
    });
    const network = prefixed.find(v => !v.localService);
    if (network) return network;
    if (prefixed.length > 0) return prefixed[0];

    // 3. Regional fallback chain
    const fbs = LANG_FALLBACKS[lc];
    if (fbs) {
      for (const fb of fbs) {
        const found = voices.find(
          v => v.lang.replace(/_/g, '-').toLowerCase() === fb.toLowerCase(),
        );
        if (found) return found;
      }
    }

    return null;
  }

  // ── Public API ──────────────────────────────────────────────────────────

  speak(text: string, languageCode: string, onEnd?: () => void): void {
    this.stop();
    const done = once(onEnd);

    // ── ENGINE 1: Web Speech API with matched voice ────────────────────
    const voice = this.pickVoice(languageCode);

    if (voice) {
      const utt = new SpeechSynthesisUtterance(text);
      utt.voice = voice;
      utt.lang = voice.lang;
      utt.rate = 0.85;
      utt.pitch = 1;
      utt.addEventListener('end', done, { once: true });
      utt.addEventListener('error', done, { once: true });
      if (this.synth) this.synth.speak(utt);
      return;
    }

    // ── ENGINE 2: /api/tts proxy (same-origin, no CORS issues) ─────────
    // Must call play() synchronously from click to satisfy autoplay.
    this.playProxyTTS(text, languageCode, done);
  }

  stop(): void {
    this.synth?.cancel();
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
  }

  get isAvailable(): boolean {
    return this.synth !== null;
  }

  // ── Proxy TTS with Web Speech fallback ──────────────────────────────────

  private playProxyTTS(
    text: string,
    langCode: string,
    done: () => void,
  ): void {
    const locale = LOCALE_MAP[langCode] ?? langCode;
    // Use the TTS-specific lang code if it differs from the standard one
    const tl = TTS_LANG_MAP[langCode] ?? locale.split('-')[0];
    const q = text.slice(0, 200);

    // Same-origin proxy — works in dev (Vite middleware) and prod (Vercel)
    const url = `/api/tts?tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(q)}`;

    const audio = new Audio(url);
    audio.volume = 1;
    this.currentAudio = audio;

    let fellBack = false;
    const fallbackToWebSpeech = () => {
      if (fellBack) return;
      fellBack = true;
      this.currentAudio = null;
      // ENGINE 3: Web Speech with lang hint (Chrome may auto-select voice)
      this.speakWithLang(text, langCode, done);
    };

    audio.addEventListener('ended', () => {
      this.currentAudio = null;
      done();
    }, { once: true });
    audio.addEventListener('error', fallbackToWebSpeech, { once: true });

    // play() synchronous from the click handler → autoplay allowed
    audio.play().catch(fallbackToWebSpeech);
  }

  // ── Web Speech fallback (lang-only) ─────────────────────────────────────

  private speakWithLang(
    text: string,
    langCode: string,
    done: () => void,
  ): void {
    if (!this.synth) {
      done();
      return;
    }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LOCALE_MAP[langCode] ?? langCode;
    utt.rate = 0.85;
    utt.pitch = 1;
    utt.addEventListener('end', done, { once: true });
    utt.addEventListener('error', done, { once: true });
    this.synth.speak(utt);
  }
}

export const speechService = new SpeechService();
