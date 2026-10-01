/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MurfVoiceSettingsModal.tsx
 * Spiritual Voice Narrator Selection powered by Murf AI Text-to-Speech
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Volume2, 
  Square, 
  Check, 
  Sparkles, 
  Mic, 
  Play, 
  ShieldCheck, 
  Info,
  Radio
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface MurfVoice {
  voiceId: string;
  displayName: string;
  gender: string;
  style: string;
  description: string;
}

const DEFAULT_MURF_VOICES: MurfVoice[] = [
  {
    voiceId: 'en-US-wayne',
    displayName: 'Wayne (Calm & Grounded)',
    gender: 'Male',
    style: 'Calm',
    description: 'Deep, serene, contemplative tone ideal for scripture & meditation'
  },
  {
    voiceId: 'en-US-carter',
    displayName: 'Carter (Peaceful Narration)',
    gender: 'Male',
    style: 'Calm',
    description: 'Gentle, comforting pastoral cadence for devotionals'
  },
  {
    voiceId: 'en-US-terrell',
    displayName: 'Terrell (Inspirational)',
    gender: 'Male',
    style: 'Calm',
    description: 'Warm, compassionate spiritual guide with reverent pacing'
  },
  {
    voiceId: 'en-US-marcus',
    displayName: 'Marcus (Reverent & Mature)',
    gender: 'Male',
    style: 'Conversational',
    description: 'Clear, steady, reassuring recovery companion voice'
  },
  {
    voiceId: 'en-US-natalie',
    displayName: 'Natalie (Grace & Gentle)',
    gender: 'Female',
    style: 'Conversational',
    description: 'Soft, empathetic, nurturing presence for daily prayers'
  },
  {
    voiceId: 'en-US-alina',
    displayName: 'Alina (Warm & Compassionate)',
    gender: 'Female',
    style: 'Conversational',
    description: 'Peaceful, tender reflection voice for quiet moments'
  }
];

export const MurfVoiceSettingsModal: React.FC = () => {
  const { 
    isVoiceModalOpen, 
    closeVoiceModal, 
    preferredVoiceId, 
    setPreferredVoiceId,
    soundEnabled,
    hapticsEnabled
  } = useSacredStore();

  const [voices, setVoices] = useState<MurfVoice[]>(DEFAULT_MURF_VOICES);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [loadingVoiceId, setLoadingVoiceId] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const stopSample = useCallback(() => {
    if (audioInstance) {
      try {
        audioInstance.pause();
        audioInstance.src = '';
      } catch {}
      setAudioInstance(null);
    }
    sanctuaryAudio.cancelSpeech();
    setPlayingVoiceId(null);
    setLoadingVoiceId(null);
  }, [audioInstance]);

  // Cleanup on close or unmount
  useEffect(() => {
    if (!isVoiceModalOpen) {
      stopSample();
    }
    return () => {
      stopSample();
    };
  }, [isVoiceModalOpen, stopSample]);

  useEffect(() => {
    // Fetch available voices from backend proxy
    fetch('/api/voice/voices')
      .then(r => r.json())
      .then(data => {
        if (data.voices && Array.isArray(data.voices) && data.voices.length > 0) {
          setVoices(data.voices);
        }
      })
      .catch(() => {});
  }, []);

  const handleTestVoice = async (voice: MurfVoice) => {
    if (playingVoiceId === voice.voiceId) {
      stopSample();
      return;
    }

    stopSample();
    setLoadingVoiceId(voice.voiceId);

    const sampleText = `Be still, and know that I am God. Today, walk one step at a time in His abundant grace.`;

    try {
      const res = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          voiceId: voice.voiceId,
          style: voice.style,
          rate: -5
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audio.volume = 0.95;
          setAudioInstance(audio);
          setLoadingVoiceId(null);
          setPlayingVoiceId(voice.voiceId);

          audio.onended = () => {
            setPlayingVoiceId(null);
            setAudioInstance(null);
          };

          audio.onerror = () => {
            setPlayingVoiceId(null);
            setAudioInstance(null);
            sanctuaryAudio.speakScripture(sampleText, voice.voiceId);
          };

          await audio.play();
          return;
        }
      }
    } catch {
      // ignore
    }

    setLoadingVoiceId(null);
    setPlayingVoiceId(voice.voiceId);
    sanctuaryAudio.speakScripture(sampleText, voice.voiceId);
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, 4500);
  };

  const handleSelectVoice = (voiceId: string) => {
    if (hapticsEnabled) triggerHaptic('soft');
    if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
    setPreferredVoiceId(voiceId);
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-[32px] max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#2D2421]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DED6] bg-[#FAF5F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD4C4] via-[#F4E4C1] to-[#C8D5B9] flex items-center justify-center text-[#7A5B0B] shadow-xs">
              <Mic className="w-4 h-4 text-[#8A4F1D]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D2421] leading-tight">
                  Spiritual Voice Settings
                </h3>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#C8D5B9]/50 text-[#243317] border border-[#B8C8A7] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E5627] animate-pulse" />
                  Murf AI Active
                </span>
              </div>
              <p className="text-[11px] text-[#796B64] mt-0.5">
                Neural studio voices for prayers, daily scripture, and breathwork
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSample();
              closeVoiceModal();
            }}
            className="p-1.5 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#E8DED6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          <div className="p-3 bg-white rounded-2xl border border-[#E8DED6] text-xs text-[#5C4D46] leading-relaxed flex items-start gap-2 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <p>
              Your Murf AI API key is configured. Choose the voice that resonates most with your devotional time. Each voice has been calibrated with reverent pacing and calm cadence.
            </p>
          </div>

          {/* Voice Cards */}
          <div className="space-y-2.5">
            {voices.map((voice) => {
              const isSelected = preferredVoiceId === voice.voiceId;
              const isPlaying = playingVoiceId === voice.voiceId;
              const isLoading = loadingVoiceId === voice.voiceId;

              return (
                <div
                  key={voice.voiceId}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-[#2D2421] shadow-sm ring-1 ring-[#2D2421]/10'
                      : 'bg-[#FAF5F0]/60 border-[#E8DED6] hover:bg-white hover:border-[#D5C7BD]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif font-bold text-xs sm:text-sm text-[#2D2421]">
                          {voice.displayName}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded-md bg-[#FAF5F0] text-[#796B64] border border-[#E8DED6]">
                          {voice.gender} · {voice.style}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#796B64] leading-relaxed">
                        {voice.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Preview Button */}
                      <button
                        onClick={() => handleTestVoice(voice)}
                        className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all ${
                          isPlaying
                            ? 'bg-[#2D2421] text-white border-[#2D2421]'
                            : 'bg-white border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] hover:bg-[#FAF5F0]'
                        }`}
                        title={isPlaying ? 'Stop voice sample' : 'Listen to voice sample'}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="w-3.5 h-3.5 border-2 border-[#796B64] border-t-transparent rounded-full animate-spin" />
                        ) : isPlaying ? (
                          <Square className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                        <span className="text-[11px] hidden sm:inline">
                          {isPlaying ? 'Stop' : 'Sample'}
                        </span>
                      </button>

                      {/* Select Button */}
                      <button
                        onClick={() => handleSelectVoice(voice.voiceId)}
                        className={`py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-[#C8D5B9] text-[#243317] border-[#B8C8A7] shadow-2xs'
                            : 'bg-white border-[#E8DED6] text-[#2D2421] hover:bg-[#FAF5F0]'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#243317]" />
                            <span>Active</span>
                          </>
                        ) : (
                          <span>Select</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#E8DED6] bg-[#FAF5F0] flex items-center justify-between text-xs text-[#796B64] shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A6E4B]" />
            <span>Secure Server-Side Voice Proxy</span>
          </div>

          <button
            onClick={() => {
              stopSample();
              closeVoiceModal();
            }}
            className="py-1.5 px-4 rounded-xl bg-[#2D2421] text-white text-xs font-semibold hover:bg-[#4A3E39] transition shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
