/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GlobalAudioBar.tsx
 * Floating audio control pill allowing users to monitor and immediately stop or end speech
 */

import React from 'react';
import { Square, Volume2, X } from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { triggerHaptic } from '../utils/haptics';

export const GlobalAudioBar: React.FC = () => {
  const { isAudioPlaying, activeAudioTitle, stopAudio, hapticsEnabled } = useSacredStore();

  if (!isAudioPlaying) return null;

  const handleStop = () => {
    if (hapticsEnabled) triggerHaptic('soft');
    stopAudio();
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-[#2D2421]/95 backdrop-blur-md text-[#FFF9F5] border border-[#FFD4C4]/30 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center justify-between gap-3">
        {/* Left: Waveform animation & Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-[#FFF9F5]/10 flex items-center justify-center shrink-0 text-[#FFD4C4]">
            {/* Animated Sound Bars */}
            <div className="flex items-center gap-0.5 h-3.5">
              <span className="w-0.5 h-3 bg-[#FFD4C4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-2 bg-[#FFD4C4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-3.5 bg-[#FFD4C4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="w-0.5 h-1.5 bg-[#FFD4C4] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFD4C4]">
                Audio Playing
              </span>
            </div>
            <p className="text-xs font-serif truncate text-[#FFF9F5] font-medium">
              {activeAudioTitle || 'Spoken Scripture & Prayer'}
            </p>
          </div>
        </div>

        {/* Right: Stop Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleStop}
            className="py-1.5 px-3.5 rounded-xl bg-[#D97768] hover:bg-[#C86455] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Stop audio playback"
            aria-label="Stop audio playback"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Audio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
