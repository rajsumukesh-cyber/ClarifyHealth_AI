class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  public isSpeaking: boolean = false;
  private onStateChangeCallback: ((speaking: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setListener(callback: (speaking: boolean) => void) {
    this.onStateChangeCallback = callback;
  }

  public speak(text: string, rate: number = 0.95, pitch: number = 1.0) {
    if (!this.synth) {
      console.warn('Speech synthesis is not supported by this browser.');
      return;
    }

    this.stop();

    // Clean markdown symbols or asterisks before speaking
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#/g, '')
      .replace(/•/g, '')
      .replace(/\[.*?\]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick a natural sounding English voice if available
    const voices = this.synth.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    }
  }
}

export const ttsService = new TTSService();
