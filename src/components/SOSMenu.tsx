import React, { useEffect } from 'react';
import { 
  X, Wind, BookOpen, PhoneCall, Sparkles, Flame, 
  ShieldAlert, ShieldCheck, HeartHandshake, ChevronRight, Activity, Headphones
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { BreathworkScreen } from './BreathworkScreen';
import { GroundingScreen } from './GroundingScreen';
import { ConnectScreen } from './ConnectScreen';
import { CravingLogScreen } from './CravingLogScreen';
import { LectioDivinaPrayerModal } from './LectioDivinaPrayerModal';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

export const SOSMenu: React.FC = () => {
  const { isSosOpen, closeSos, sosActiveScreen, setSosActiveScreen, hapticsEnabled, cravingLogs } = useSacredStore();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSosOpen) {
        closeSos();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSosOpen, closeSos]);

  if (!isSosOpen) return null;

  const handleSelectScreen = (screen: 'breathe' | 'ground' | 'connect' | 'craving' | 'lectio') => {
    if (hapticsEnabled) triggerHaptic('soft');
    setSosActiveScreen(screen);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-menu-title"
    >
      {/* Click outside to close (backdrop) */}
      <div 
        className="absolute inset-0" 
        onClick={closeSos} 
        aria-hidden="true" 
      />

      {/* Bottom Sheet Card Container */}
      <div className="relative w-full max-w-lg bg-[#FFF9F5] border-t sm:border border-[#E8DED6] rounded-t-[36px] sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[92vh] sm:max-h-[88vh] flex flex-col z-10 overflow-hidden">
        {/* Top Dawn Gradient Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFCAD4] via-[#FFE5D9] to-[#C8D5B9]" />

        {/* Drag Pill Handle */}
        <div className="w-12 h-1.5 bg-[#E8DED6] rounded-full mx-auto mb-3 shrink-0 sm:hidden" />

        {/* Content Router */}
        {sosActiveScreen === 'breathe' && (
          <BreathworkScreen onBack={() => setSosActiveScreen('menu')} />
        )}

        {sosActiveScreen === 'ground' && (
          <GroundingScreen onBack={() => setSosActiveScreen('menu')} />
        )}

        {sosActiveScreen === 'connect' && (
          <ConnectScreen onBack={() => setSosActiveScreen('menu')} />
        )}

        {sosActiveScreen === 'craving' && (
          <CravingLogScreen onBack={() => setSosActiveScreen('menu')} />
        )}

        {sosActiveScreen === 'lectio' && (
          <LectioDivinaPrayerModal 
            isOpen={true} 
            onClose={() => setSosActiveScreen('menu')} 
          />
        )}

        {/* Main SOS Menu View */}
        {sosActiveScreen === 'menu' && (
          <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#E8DED6] pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,_#FFE8E1_0%,_#FFCAD4_45%,_#FFAAA6_100%)] flex items-center justify-center shadow-xs">
                  <Activity className="w-5 h-5 text-[#8B261D]" />
                </div>
                <div>
                  <h2 id="sos-menu-title" className="font-serif text-lg font-bold text-[#2D2421] leading-tight">
                    Calm in the Storm
                  </h2>
                  <p className="text-[11px] text-[#796B64] font-medium">
                    Immediate emergency support when cravings or panic strike.
                  </p>
                </div>
              </div>

              <button
                onClick={closeSos}
                className="p-1.5 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
                aria-label="Close emergency support menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* THREE PRIMARY QUICK OPTIONS */}
            <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1">
              {/* Option 1: BREATHE */}
              <button
                onClick={() => handleSelectScreen('breathe')}
                className="w-full text-left p-4 rounded-3xl bg-[#FAF5F0] hover:bg-[#F5EFEB] border border-[#E8DED6] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-3.5 group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C8D5B9] to-[#FAF5F0] flex items-center justify-center text-[#2D2421] shrink-0 border border-[#C8D5B9]/60 group-hover:scale-105 transition-transform shadow-xs">
                  <Wind className="w-6 h-6 text-[#3F5234]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-serif text-sm font-bold text-[#2D2421]">
                      🌬️ BREATHE (4-7-8)
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#5A6E4B] bg-[#C8D5B9]/40 px-2 py-0.5 rounded-full">
                      60s Guided
                    </span>
                  </div>
                  <p className="text-xs text-[#796B64] leading-snug">
                    Visual growing/shrinking orb with gentle haptics & audio cues to reset your nervous system.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#796B64] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Option 2: LECTIO DIVINA & BREATH PRAYER */}
              <button
                onClick={() => handleSelectScreen('lectio')}
                className="w-full text-left p-4 rounded-3xl bg-[#FFFDF9] hover:bg-[#FAF5F0] border border-[#E5C158]/60 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-3.5 group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#FFF1BD] flex items-center justify-center text-[#4A3222] shrink-0 border border-[#D4AF37]/50 group-hover:scale-105 transition-transform shadow-xs">
                  <Headphones className="w-6 h-6 text-[#5A3816]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-serif text-sm font-bold text-[#2D2421]">
                      🎧 LECTIO & BREATH PRAYER
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-2 py-0.5 rounded-full border border-[#E5C158]/40">
                      Audio Sanctuary
                    </span>
                  </div>
                  <p className="text-xs text-[#796B64] leading-snug">
                    Soothing 2–5 min audio with stream/cello ambient & breath-synced scripture ("Be still...").
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#796B64] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Option 3: GROUND */}
              <button
                onClick={() => handleSelectScreen('ground')}
                className="w-full text-left p-4 rounded-3xl bg-[#FAF5F0] hover:bg-[#F5EFEB] border border-[#E8DED6] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-3.5 group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E6D5F0] to-[#FFE5D9] flex items-center justify-center text-[#2D2421] shrink-0 border border-[#E6D5F0]/80 group-hover:scale-105 transition-transform shadow-xs">
                  <BookOpen className="w-6 h-6 text-[#543864]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-serif text-sm font-bold text-[#2D2421]">
                      📖 GROUND in Scripture
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#543864] bg-[#E6D5F0]/50 px-2 py-0.5 rounded-full">
                      Truth Anchor
                    </span>
                  </div>
                  <p className="text-xs text-[#796B64] leading-snug">
                    Curated verses (Psalm 46:10, Phil 4:13) & affirmations to dismantle fear and cravings.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#796B64] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Option 4: CONNECT */}
              <button
                onClick={() => handleSelectScreen('connect')}
                className="w-full text-left p-4 rounded-3xl bg-[#FAF5F0] hover:bg-[#F5EFEB] border border-[#E8DED6] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-3.5 group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFD4C4] to-[#FFCAD4] flex items-center justify-center text-[#2D2421] shrink-0 border border-[#FFCAD4] group-hover:scale-105 transition-transform shadow-xs">
                  <PhoneCall className="w-6 h-6 text-[#8B261D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-serif text-sm font-bold text-[#2D2421]">
                      📞 CONNECT Support
                    </span>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#8B261D] bg-[#FFCAD4]/50 px-2 py-0.5 rounded-full">
                      Direct Dial
                    </span>
                  </div>
                  <p className="text-xs text-[#796B64] leading-snug">
                    1-tap reach to your Sponsor, SAMHSA Helpline (1-800-662-4357), or Crisis Text Line.
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#796B64] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Optional: LOG CRAVING MOMENT */}
              <button
                onClick={() => handleSelectScreen('craving')}
                className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-[#FAF5F0] border border-[#E8DED6] transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-[#FFCAD4]/40 text-[#8B261D]">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-serif text-xs font-bold text-[#2D2421] block">
                      Log Craving Moment (1-10 Scale)
                    </span>
                    <span className="text-[10px] text-[#796B64]">
                      Track triggers, intensity & record another victory weathered in grace.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold text-[#5A6E4B] bg-[#C8D5B9]/30 px-2 py-0.5 rounded-md">
                    {cravingLogs.length} Logged
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#796B64]" />
                </div>
              </button>
            </div>

            {/* Scriptural Peace Anchor Footer */}
            <div className="pt-2 border-t border-[#E8DED6] flex items-center justify-between text-[11px] text-[#796B64] shrink-0">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5A6E4B]" />
                <span>100% Offline Safe Harbor</span>
              </span>
              <span className="font-scripture italic text-xs text-[#2D2421]">
                "Be still, and know that I am God."
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
