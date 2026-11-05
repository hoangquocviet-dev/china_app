class AudioManager {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private chineseVoice: SpeechSynthesisVoice | null = null;
  private isSoundEnabled: boolean = true;
  private fallbackAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopSpeech();
        }
      });
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      // Find high quality zh-CN / Mandarin voices
      this.chineseVoice =
        this.voices.find(
          (v) =>
            (v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.startsWith('cmn')) &&
            (v.name.includes('Google') ||
              v.name.includes('Natural') ||
              v.name.includes('Huihui') ||
              v.name.includes('Yaoyao') ||
              v.name.includes('Tingting') ||
              v.name.includes('Xiaoxiao'))
        ) ||
        this.voices.find((v) => v.lang.startsWith('zh-CN') || v.lang.startsWith('zh_CN')) ||
        this.voices.find((v) => v.lang.startsWith('zh')) ||
        null;
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isSoundEnabled = enabled;
  }

  public getSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }

  // Play subtle UI button click
  public playClick(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio suppressed safely
    }
  }

  // Play pleasant 2-tone success chime
  public playSuccessChime(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Note 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Note 2: B5 (987.77 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.1);
      gain2.gain.setValueAtTime(0.15, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.45);
    } catch {
      // Audio suppressed safely
    }
  }

  // Play stroke correct chime
  public playStrokeSuccess(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio suppressed safely
    }
  }

  // Play low buzz sound for wrong answers or incorrect strokes
  public playErrorBuzz(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.22);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio suppressed safely
    }
  }

  // Two-tier Chinese speech pronunciation
  public speakChinese(text: string, rate: number = 0.85): Promise<void> {
    return new Promise((resolve) => {
      const cleanText = text.replace(/[/\\()[\]]/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }

      // Check if Web Speech API has Chinese voice available
      const hasChinese =
        this.voices.some((v) => v.lang.startsWith('zh') || v.lang.includes('cmn')) ||
        Boolean(this.chineseVoice);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window && hasChinese) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = 'zh-CN';
          utterance.rate = rate;
          if (this.chineseVoice) {
            utterance.voice = this.chineseVoice;
          }
          utterance.onend = () => resolve();
          utterance.onerror = () => {
            this.fallbackSpeakAudio(cleanText).then(resolve);
          };

          this.getAudioContext();
          window.speechSynthesis.speak(utterance);
          return;
        } catch {
          // Continue to Tier 2
        }
      }

      // Tier 2 Fallback: Online Dictionary Audio endpoint
      this.fallbackSpeakAudio(cleanText).then(resolve);
    });
  }

  private fallbackSpeakAudio(text: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (this.fallbackAudio) {
          this.fallbackAudio.pause();
          this.fallbackAudio = null;
        }
        const audioUrl = `https://dict.youdao.com/dictvoice?type=0&audio=${encodeURIComponent(text)}`;
        const audio = new Audio(audioUrl);
        this.fallbackAudio = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      } catch {
        resolve();
      }
    });
  }

  public stopSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.fallbackAudio) {
      this.fallbackAudio.pause();
      this.fallbackAudio = null;
    }
  }

  public async teardownAudioForTesting(): Promise<void> {
    if (this.ctx) {
      await this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.stopSpeech();
  }
}

export const audioService = new AudioManager();
