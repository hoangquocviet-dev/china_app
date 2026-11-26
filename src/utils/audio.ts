class AudioManager {
  private ctx: AudioContext | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private chineseVoice: SpeechSynthesisVoice | null = null;
  private isSoundEnabled: boolean = true;
  private speechRate: number = 0.85;
  private speechRateSubscribers: Set<(rate: number) => void> = new Set();
  private fallbackAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initVoices();
    if (typeof window !== 'undefined') {
      try {
        const savedRate = window.localStorage.getItem('hanziflow_tts_speed');
        if (savedRate) {
          const parsed = parseFloat(savedRate);
          if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
            this.speechRate = parsed;
          }
        }
      } catch {}
    }
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

  public getSpeechRate(): number {
    return this.speechRate;
  }

  public setSpeechRate(rate: number): void {
    const clamped = Math.max(0.5, Math.min(2.0, rate));
    this.speechRate = clamped;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('hanziflow_tts_speed', String(clamped));
      } catch {}
    }
    this.speechRateSubscribers.forEach((cb) => {
      try { cb(clamped); } catch {}
    });
  }

  public cycleSpeechRate(): number {
    // 0.75x (Chậm) -> 1.0x (Chuẩn) -> 1.25x (Nhanh) -> 0.75x
    let next = 1.0;
    if (this.speechRate <= 0.8) {
      next = 1.0;
    } else if (this.speechRate <= 1.05) {
      next = 1.25;
    } else {
      next = 0.75;
    }
    this.setSpeechRate(next);
    return next;
  }

  public subscribeSpeechRate(callback: (rate: number) => void): () => void {
    this.speechRateSubscribers.add(callback);
    return () => {
      this.speechRateSubscribers.delete(callback);
    };
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

  // Pitch-escalating combo chime for mini-games
  public playComboChime(combo: number = 1): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
      const baseFreq = scale[Math.min(Math.max(0, combo - 1), scale.length - 1)];

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.14);
      gain1.gain.setValueAtTime(0.14, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);
    } catch {
      // Audio suppressed safely
    }
  }

  // Crisp bubbly pop sound for Speed Match card pairs
  public playMatchPop(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.09);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Audio suppressed safely
    }
  }

  // Turbo dash whoosh for Word Runner
  public playLaserDash(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Audio suppressed safely
    }
  }

  // 4-note celebratory arcade arpeggio for Wave Clear / Level Up
  public playLevelUp(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.13, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch {
      // Audio suppressed safely
    }
  }

  // Gentle retro cadence for Game Over
  public playGameOver(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [392.0, 349.23, 329.63, 261.63];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.11;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.11, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.28);
      });
    } catch {
      // Audio suppressed safely
    }
  }

  // Urgent subtle tick for final countdown seconds
  public playTick(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio suppressed safely
    }
  }

  // Robust multi-tier Chinese speech pronunciation
  public speakChinese(text: string, rate?: number): Promise<void> {
    const actualRate = typeof rate === 'number' ? rate : this.speechRate;
    return new Promise((resolve) => {
      if (!this.isSoundEnabled) {
        resolve();
        return;
      }

      const cleanText = text.replace(/[/\\()[\]]/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }

      // Tier 1: Device Native Web Speech API
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.cancel();

          // Re-check voices if not loaded earlier
          if (!this.chineseVoice) {
            this.initVoices();
          }

          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = 'zh-CN';
          utterance.rate = actualRate;

          if (this.chineseVoice) {
            utterance.voice = this.chineseVoice;
          }

          let resolved = false;
          utterance.onend = () => {
            if (!resolved) {
              resolved = true;
              resolve();
            }
          };

          utterance.onerror = () => {
            if (!resolved) {
              resolved = true;
              this.fallbackSpeakAudio(cleanText).then(resolve);
            }
          };

          // Wake up audio context
          this.getAudioContext();
          window.speechSynthesis.speak(utterance);

          // Safety timeout in case speech synthesis hangs on certain Android devices
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve();
            }
          }, 6000);

          return;
        } catch {
          // Continue to Tier 2
        }
      }

      // Tier 2 Fallback: Online TTS endpoint
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

        // Primary fallback: Google Translate TTS (CORS-friendly audio)
        const primaryUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=${encodeURIComponent(text)}`;
        const audio = new Audio(primaryUrl);
        this.fallbackAudio = audio;

        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };

        audio.onended = finish;
        audio.onerror = () => {
          // Secondary fallback: Youdao
          try {
            const secondaryUrl = `https://dict.youdao.com/dictvoice?type=0&audio=${encodeURIComponent(text)}`;
            const fallback2 = new Audio(secondaryUrl);
            this.fallbackAudio = fallback2;
            fallback2.onended = finish;
            fallback2.onerror = finish;
            fallback2.play().catch(finish);
          } catch {
            finish();
          }
        };

        audio.play().catch(finish);
        setTimeout(finish, 5000);
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
