/**
 * Web Speech API service – pronounces translations using the browser's
 * built-in text-to-speech engine.  No external API key required.
 *
 * Voice matching strategy (tries in order):
 *   1. Exact locale match  (e.g. voice.lang === 'ja-JP')
 *   2. Prefix match         (e.g. voice.lang starts with 'ja')
 *   3. Pre-built map        (populated at page load + voiceschanged)
 *   4. Fallback: just set utterance.lang and let the browser pick
 */

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

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voicesByLang = new Map<string, SpeechSynthesisVoice>();

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      this.synth.addEventListener('voiceschanged', () => this.loadVoices());
    }
  }

  /* ── internal ── */

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.voicesByLang.clear();

    for (const v of voices) {
      const short = v.lang.split('-')[0].toLowerCase();
      const existing = this.voicesByLang.get(short);
      // prefer higher-quality network voices (Chrome) over local voices
      if (!existing || (!v.localService && existing.localService)) {
        this.voicesByLang.set(short, v);
      }
    }
  }

  /**
   * Try hard to find a voice that can speak this language.
   * Returns null if nothing matches – the browser will still
   * try its best based on `utterance.lang`.
   */
  private findBestVoice(langCode: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    const locale = LOCALE_MAP[langCode];

    // 1️⃣  Exact locale match  (e.g. 'ja-JP')
    if (locale) {
      const exact = voices.find(v => v.lang === locale);
      if (exact) return exact;
    }

    // 2️⃣  Any voice whose lang starts with the short code
    const lc = langCode.toLowerCase();
    const candidates = voices.filter(
      v =>
        v.lang.toLowerCase() === lc ||
        v.lang.toLowerCase().startsWith(lc + '-'),
    );
    // prefer network voices for quality
    const network = candidates.find(v => !v.localService);
    if (network) return network;
    if (candidates.length > 0) return candidates[0];

    // 3️⃣  Pre-built map (catches voices whose BCP-47 tag is non-standard)
    const mapped = this.voicesByLang.get(lc);
    if (mapped) return mapped;

    return null;
  }

  /* ── public ── */

  /** Speak `text` in the given language. Returns true if speech started. */
  speak(text: string, languageCode: string): boolean {
    if (!this.synth) return false;
    this.synth.cancel(); // stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);

    // Find the best matching voice
    const voice = this.findBestVoice(languageCode);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang; // use the voice's own locale tag
    } else {
      // No matching voice – still set lang so the OS-level TTS can try
      utterance.lang = LOCALE_MAP[languageCode] ?? languageCode;
    }

    utterance.rate = 0.85;
    utterance.pitch = 1;

    this.synth.speak(utterance);
    return true;
  }

  get isAvailable(): boolean {
    return this.synth !== null;
  }
}

export const speechService = new SpeechService();
