/**
 * Multi-engine Text-to-Speech service.
 *
 * STRATEGY (in priority order, all synchronous from click handler):
 *
 * 1. pickVoice() finds an explicit voice match → use Web Speech API
 *    with `utterance.voice` set.
 *
 * 2. No explicit match → try Google Translate TTS <audio> element.
 *    If audio loads successfully → plays the correct language.
 *    If audio fails (403 / CORS / network) → falls back to (3).
 *
 * 3. Web Speech API with only `utterance.lang` set.  Chrome will
 *    auto-select its Google network voice from the lang hint even
 *    when getVoices() doesn't list it — this is how French etc.
 *    keep working.
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

    if (!this.synth) {
      this.playGoogleTTS(text, languageCode, done);
      return;
    }

    const voice = this.pickVoice(languageCode);

    if (voice) {
      // ── PATH A: Explicit voice match ─────────────────────────────────
      const utt = new SpeechSynthesisUtterance(text);
      utt.voice = voice;
      utt.lang = voice.lang;
      utt.rate = 0.85;
      utt.pitch = 1;
      utt.addEventListener('end', done, { once: true });
      utt.addEventListener('error', done, { once: true });
      this.synth.speak(utt);
      return;
    }

    // ── PATH B: No explicit match → Google TTS, then Web Speech ────────
    // Google TTS audio.play() MUST be called synchronously here (user
    // gesture context) to satisfy the browser's autoplay policy.
    this.playGoogleTTSThenWebSpeech(text, languageCode, done);
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

  // ── Google TTS with Web Speech fallback ─────────────────────────────────

  /**
   * Try Google Translate TTS.  If the audio fails to load (403 / CORS /
   * network error), fall back to Web Speech API with `utterance.lang`.
   */
  private playGoogleTTSThenWebSpeech(
    text: string,
    langCode: string,
    done: () => void,
  ): void {
    const locale = LOCALE_MAP[langCode] ?? langCode;
    const tl = locale.split('-')[0];
    const q = text.slice(0, 200);

    // Full parameter set matching google-tts-api's format
    const url =
      `https://translate.google.com/translate_tts` +
      `?ie=UTF-8&tl=${encodeURIComponent(tl)}&client=tw-ob` +
      `&q=${encodeURIComponent(q)}` +
      `&total=1&idx=0&textlen=${q.length}&prev=input&ttsspeed=1`;

    const audio = new Audio(url);
    audio.volume = 1;
    this.currentAudio = audio;

    // Guard: only fall back once
    let fellBack = false;
    const fallbackToWebSpeech = () => {
      if (fellBack) return;
      fellBack = true;
      this.currentAudio = null;
      this.speakWithLang(text, langCode, done);
    };

    audio.addEventListener('ended', done, { once: true });
    audio.addEventListener('error', fallbackToWebSpeech, { once: true });

    // play() must be synchronous from the click handler
    audio.play().catch(fallbackToWebSpeech);
  }

  // ── Web Speech fallback (lang-only) ─────────────────────────────────────

  /**
   * Web Speech API with only `utterance.lang` set (no explicit voice).
   * Chrome auto-selects its Google network voice from the lang hint
   * — this is what makes French, German, Spanish, etc. work even when
   * getVoices() doesn't list them.
   */
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

  // ── Standalone Google TTS (no synth available) ──────────────────────────

  private playGoogleTTS(
    text: string,
    langCode: string,
    done: () => void,
  ): void {
    try {
      const locale = LOCALE_MAP[langCode] ?? langCode;
      const tl = locale.split('-')[0];
      const q = text.slice(0, 200);
      const url =
        `https://translate.google.com/translate_tts` +
        `?ie=UTF-8&tl=${encodeURIComponent(tl)}&client=tw-ob` +
        `&q=${encodeURIComponent(q)}` +
        `&total=1&idx=0&textlen=${q.length}&prev=input&ttsspeed=1`;

      const audio = new Audio(url);
      audio.volume = 1;
      this.currentAudio = audio;
      audio.addEventListener('ended', done, { once: true });
      audio.addEventListener('error', () => {
        this.currentAudio = null;
        done();
      }, { once: true });
      audio.play().catch(() => {
        this.currentAudio = null;
        done();
      });
    } catch {
      done();
    }
  }
}

export const speechService = new SpeechService();
