/**
 * SacredSteps: Haptics & Soothing Audio Sanctuary Engine
 * Subtle physical feedback and warm harmonic chimes
 */

class SanctuaryAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSources: { stop: () => void }[] = [];
  private ambientTimer: NodeJS.Timeout | null = null;
  private currentAmbientType: 'gentle-cello' | 'flowing-stream' | 'soft-chime' | 'none' = 'none';

  // Murf AI & Audio Playback State
  private currentAudio: HTMLAudioElement | null = null;
  private activeSpeechId: number = 0;
  private isSpeakingFlag: boolean = false;
  private currentVoiceId: string = 'en-US-carter';
  private speakingListeners: Set<(speaking: boolean) => void> = new Set();

  setDefaultVoiceId(voiceId: string) {
    if (voiceId) this.currentVoiceId = voiceId;
  }

  getDefaultVoiceId(): string {
    return this.currentVoiceId;
  }

  private setSpeaking(speaking: boolean) {
    this.isSpeakingFlag = speaking;
    this.speakingListeners.forEach(listener => {
      try {
        listener(speaking);
      } catch {}
    });
  }

  isSpeaking(): boolean {
    return this.isSpeakingFlag;
  }

  onSpeakingChange(listener: (speaking: boolean) => void): () => void {
    this.speakingListeners.add(listener);
    return () => this.speakingListeners.delete(listener);
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a gentle Tibetan singing bell / dawn chime chord
  playGraceChime(type: 'gentle' | 'stepComplete' | 'breathIn' | 'breathOut' | 'breathHold' | 'unlock' | 'sos' = 'gentle') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      let freqs: number[] = [432, 540]; // 432Hz grounding root

      if (type === 'stepComplete') {
        freqs = [432, 528, 648]; // Solfeggio 528Hz transformation chord
      } else if (type === 'breathIn') {
        freqs = [384, 480]; // Ascending peaceful tone
      } else if (type === 'breathHold') {
        freqs = [432, 518]; // Sustained stillness tone
      } else if (type === 'breathOut') {
        freqs = [324, 432]; // Descending release tone
      } else if (type === 'unlock') {
        freqs = [528, 660, 792];
      } else if (type === 'sos') {
        freqs = [396, 495]; // Grounding low chime
      }

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        // Warm low-pass filter to eliminate any harsh edge
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0, now);
        // Soft envelope: attack 30ms, long decay
        gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.04 + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'stepComplete' ? 2.5 : 1.8) + idx * 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + 3.0);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Start an Ambient Soundscape synthesized purely with Web Audio API nodes:
   * - gentle-cello: Warm monastic drone chord (C/G/D 130-220Hz) with gentle LFO swell
   * - flowing-stream: Babbling brook water frequencies with band-filtered soft pink noise
   * - soft-chime: Periodic resonant singing bowl rings at 432Hz
   */
  startAmbientTrack(type: 'gentle-cello' | 'flowing-stream' | 'soft-chime', volume: number = 0.4) {
    try {
      this.stopAmbientTrack();
      this.initContext();
      if (!this.ctx) return;

      this.currentAmbientType = type;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume * 0.22, this.ctx.currentTime + 1.2);
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'gentle-cello') {
        // Multi-oscillator warm cello & devotional pad
        const baseFreqs = [130.81, 196.00, 261.63]; // C3, G3, C4
        baseFreqs.forEach((freq, i) => {
          if (!this.ctx) return;
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();

          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 1.002, this.ctx.currentTime); // subtle warm chorus

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(260 + i * 40, this.ctx.currentTime);

          // Gentle breathing LFO on filter
          lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
          lfoGain.gain.setValueAtTime(60, this.ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(masterGain);

          osc1.start();
          osc2.start();
          lfo.start();

          this.ambientSources.push({
            stop: () => {
              try {
                osc1.stop();
                osc2.stop();
                lfo.stop();
              } catch {}
            }
          });
        });
      } else if (type === 'flowing-stream') {
        // Synthesize babbling brook / river stream using noise buffer
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02; // pink-like smoothing
          lastOut = output[i];
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(550, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

        // LFO to simulate gentle water ripples
        const rippleLfo = this.ctx.createOscillator();
        const rippleGain = this.ctx.createGain();
        rippleLfo.frequency.setValueAtTime(0.35, this.ctx.currentTime);
        rippleGain.gain.setValueAtTime(180, this.ctx.currentTime);
        rippleLfo.connect(rippleGain);
        rippleGain.connect(filter.frequency);

        whiteNoise.connect(filter);
        filter.connect(masterGain);

        whiteNoise.start();
        rippleLfo.start();

        this.ambientSources.push({
          stop: () => {
            try {
              whiteNoise.stop();
              rippleLfo.stop();
            } catch {}
          }
        });
      } else if (type === 'soft-chime') {
        // Singing bowl ambient: ring immediately and loop every 8 seconds
        this.playGraceChime('breathHold');
        this.ambientTimer = setInterval(() => {
          this.playGraceChime('gentle');
        }, 8000);
      }
    } catch {
      // Audio fallback
    }
  }

  stopAmbientTrack() {
    try {
      if (this.ambientTimer) {
        clearInterval(this.ambientTimer);
        this.ambientTimer = null;
      }
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        this.ambientSources.forEach(s => s.stop());
        this.ambientSources = [];
        this.ambientGain = null;
        this.currentAmbientType = 'none';
      }, 550);
    } catch {}
  }

  getCurrentAmbientType() {
    return this.currentAmbientType;
  }

  // Speak aloud with Murf AI studio voice (or gentle browser TTS fallback)
  async speakScripture(text: string, voiceId?: string) {
    if (typeof window === 'undefined') return;
    this.cancelSpeech();

    const speechId = ++this.activeSpeechId;
    this.setSpeaking(true);

    try {
      // First attempt studio-quality Murf AI voice via our server proxy
      const res = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: voiceId || this.currentVoiceId || 'en-US-carter',
          style: 'Calm',
          rate: 0
        })
      });

      // If user cancelled or triggered another audio while fetching, abort
      if (this.activeSpeechId !== speechId) return;

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioUrl && this.activeSpeechId === speechId) {
          const audio = new Audio(data.audioUrl);
          audio.volume = 0.95;
          this.currentAudio = audio;

          audio.onended = () => {
            if (this.activeSpeechId === speechId) {
              this.currentAudio = null;
              this.setSpeaking(false);
            }
          };

          audio.onerror = () => {
            // If audio load fails, fall back to browser speech synthesis
            if (this.activeSpeechId === speechId) {
              this.currentAudio = null;
              this.speakBrowserUtterance(text, speechId);
            }
          };

          await audio.play();
          return;
        }
      }
    } catch {
      // Network or fetch error
    }

    // Seamless fallback to browser speech synthesis if offline or error
    if (this.activeSpeechId === speechId) {
      this.speakBrowserUtterance(text, speechId);
    }
  }

  cancelSpeech() {
    this.activeSpeechId++;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = '';
      } catch {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.setSpeaking(false);
  }

  async speakBreathGuidance(phrase: string, voiceId?: string) {
    if (typeof window === 'undefined') return;
    this.cancelSpeech();

    const speechId = ++this.activeSpeechId;
    this.setSpeaking(true);

    try {
      const res = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: phrase,
          voiceId: voiceId || this.currentVoiceId || 'en-US-carter',
          style: 'Calm',
          rate: 0
        })
      });

      if (this.activeSpeechId !== speechId) return;

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioUrl && this.activeSpeechId === speechId) {
          const audio = new Audio(data.audioUrl);
          audio.volume = 0.95;
          this.currentAudio = audio;

          audio.onended = () => {
            if (this.activeSpeechId === speechId) {
              this.currentAudio = null;
              this.setSpeaking(false);
            }
          };

          audio.onerror = () => {
            if (this.activeSpeechId === speechId) {
              this.currentAudio = null;
              this.speakBrowserUtterance(phrase, speechId, 0.85);
            }
          };

          await audio.play();
          return;
        }
      }
    } catch {}

    if (this.activeSpeechId === speechId) {
      this.speakBrowserUtterance(phrase, speechId, 0.85);
    }
  }

  private speakBrowserUtterance(text: string, speechId: number, rate: number = 0.88) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.setSpeaking(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate; // Reverent pace
      utterance.pitch = 0.98;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Serena')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => {
        if (this.activeSpeechId === speechId) {
          this.setSpeaking(false);
        }
      };

      utterance.onerror = () => {
        if (this.activeSpeechId === speechId) {
          this.setSpeaking(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.setSpeaking(false);
    }
  }
}

export const sanctuaryAudio = new SanctuaryAudioEngine();

/**
 * Trigger subtle, calming haptic feedback
 */
export function triggerHaptic(style: 'soft' | 'step' | 'pulse' | 'heavy' = 'soft') {
  if (typeof window === 'undefined' || !window.navigator.vibrate) return;
  try {
    switch (style) {
      case 'soft':
        window.navigator.vibrate(12);
        break;
      case 'step':
        window.navigator.vibrate([15, 30, 20]);
        break;
      case 'pulse':
        window.navigator.vibrate([20, 40, 20]);
        break;
      case 'heavy':
        window.navigator.vibrate(40);
        break;
    }
  } catch {
    // Vibration ignored if blocked
  }
}
