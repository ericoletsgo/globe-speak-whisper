/**
 * Web Speech API service – pronounces translations using the browser's
 * built-in text-to-speech engine.  No external API key required.
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

  /* ── public ── */

  /** Speak `text` in the given language. Returns true if speech started. */
  speak(text: string, languageCode: string): boolean {
    if (!this.synth) return false;
    this.synth.cancel(); // stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.voicesByLang.get(languageCode);
    if (voice) utterance.voice = voice;
    utterance.lang = LOCALE_MAP[languageCode] ?? languageCode;
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
