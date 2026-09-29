/**
 * SacredSteps: Audio Sanctuary Playback Engine
 * Web Audio API ambient soundscape synthesis, spoken word narration,
 * and MediaSession API system lock-screen integration.
 */

import { AudioTrack } from '../data/audioSanctuaryData';

class AudioSanctuaryService {
  private audioCtx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: (OscillatorNode | AudioNode)[] = [];
  private isAmbientPlaying = false;
  private currentTrack: AudioTrack | null = null;
  private isSpeaking = false;
  private currentSpeechUtterance: SpeechSynthesisUtterance | null = null;

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  // Start synthesizing ambient bed based on sound type
  startAmbient(soundType: AudioTrack['ambientSoundType'], volume = 0.35) {
    this.stopAmbient();
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(volume, now + 1.5);
      this.ambientGain.connect(this.audioCtx.destination);

      if (soundType === 'binaural-peace') {
        // 432Hz Solfeggio + 438Hz (6Hz Theta meditative binaural pulse)
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(432, now);
        osc2.frequency.setValueAtTime(438, now);

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(this.ambientGain);

        osc1.start();
        osc2.start();
        this.ambientNodes.push(osc1, osc2, filter);
      } else if (soundType === 'still-waters' || soundType === 'gentle-rain') {
        // Synthesize soft filtered water/rain texture with buffer source
        const bufferSize = this.audioCtx.sampleRate * 2;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.96 * b1 + white * 0.08;
          b2 = 0.90 * b2 + white * 0.12;
          output[i] = (b0 + b1 + b2) * 0.3;
        }

        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(soundType === 'still-waters' ? 450 : 800, now);

        whiteNoise.connect(filter);
        filter.connect(this.ambientGain);
        whiteNoise.start();
        this.ambientNodes.push(whiteNoise, filter);
      } else {
        // Singing bowl harmonic bed (432Hz, 540Hz harmonic fifth)
        const chord = [216, 432, 540];
        chord.forEach((freq) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const filter = this.audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, now);

          osc.connect(filter);
          if (this.ambientGain) filter.connect(this.ambientGain);
          osc.start();
          this.ambientNodes.push(osc, filter);
        });
      }

      this.isAmbientPlaying = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Stop ambient synthesizer smoothly
  stopAmbient() {
    if (this.ambientGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      } catch {}
    }
    setTimeout(() => {
      this.ambientNodes.forEach((node) => {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          }
          node.disconnect();
        } catch {}
      });
      this.ambientNodes = [];
      this.isAmbientPlaying = false;
    }, 550);
  }

  // Speak a narrative section with reverent cadence
  speakTranscriptText(text: string, rate = 1.0) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.6, Math.min(1.8, 0.86 * rate));
      utterance.pitch = 0.98;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Serena')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferred) utterance.voice = preferred;

      this.currentSpeechUtterance = utterance;
      this.isSpeaking = true;
      utterance.onend = () => {
        this.isSpeaking = false;
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  cancelNarration() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isSpeaking = false;
  }

  // Setup system lock-screen controls via Web MediaSession API
  setupMediaSession(
    track: AudioTrack, 
    callbacks: {
      onPlay: () => void;
      onPause: () => void;
      onSkipForward: () => void;
      onSkipBackward: () => void;
      onSeek: (seconds: number) => void;
    }
  ) {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    this.currentTrack = track;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: 'The Guide · C. Lamont Patrick',
        album: 'Sacred Steps to Redemption · Audio Sanctuary',
        artwork: [
          { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=512&q=80', sizes: '512x512', type: 'image/jpeg' },
          { src: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=192&q=80', sizes: '192x192', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => callbacks.onPlay());
      navigator.mediaSession.setActionHandler('pause', () => callbacks.onPause());
      navigator.mediaSession.setActionHandler('seekforward', () => callbacks.onSkipForward());
      navigator.mediaSession.setActionHandler('seekbackward', () => callbacks.onSkipBackward());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          callbacks.onSeek(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('stop', () => callbacks.onPause());
    } catch {
      // mediaSession not supported in this environment
    }
  }

  updateMediaPosition(currentTime: number, duration: number, playbackRate = 1.0) {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      if ('setPositionState' in navigator.mediaSession) {
        navigator.mediaSession.setPositionState({
          duration: Math.max(1, duration),
          playbackRate: Math.max(0.5, playbackRate),
          position: Math.min(currentTime, duration),
        });
      }
    } catch {}
  }
}

export const audioSanctuaryService = new AudioSanctuaryService();
