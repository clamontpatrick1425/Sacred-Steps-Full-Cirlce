import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, 
  Sparkles, ArrowLeft, Heart, Shield, Activity
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';

const PHASE_DURATIONS = {
  inhale: 4,
  hold: 7,
  exhale: 8,
};

const TOTAL_CYCLES = 3; // 3 * 19s = 57s (~60 second session)

export const BreathworkScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { soundEnabled, hapticsEnabled, setSosActiveScreen } = useSacredStore();

  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(PHASE_DURATIONS.inhale);
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState<number>(60);
  const [audioGuidance, setAudioGuidance] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger phase sound and haptics
  const announcePhase = (newPhase: BreathPhase) => {
    if (hapticsEnabled) {
      if (newPhase === 'inhale') triggerHaptic('soft');
      else if (newPhase === 'hold') triggerHaptic('pulse');
      else if (newPhase === 'exhale') triggerHaptic('step');
      else if (newPhase === 'complete') triggerHaptic('heavy');
    }

    if (soundEnabled && audioGuidance) {
      if (newPhase === 'inhale') {
        sanctuaryAudio.playGraceChime('breathIn');
        sanctuaryAudio.speakBreathGuidance('Inhale deeply through your nose');
      } else if (newPhase === 'hold') {
        sanctuaryAudio.playGraceChime('breathHold');
        sanctuaryAudio.speakBreathGuidance('Hold gently');
      } else if (newPhase === 'exhale') {
        sanctuaryAudio.playGraceChime('breathOut');
        sanctuaryAudio.speakBreathGuidance('Exhale slowly through your mouth');
      } else if (newPhase === 'complete') {
        sanctuaryAudio.playGraceChime('stepComplete');
        sanctuaryAudio.speakBreathGuidance('Peace be with you. You made it through.');
      }
    }
  };

  // Timer Tick
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTotalSecondsRemaining((prevTotal) => {
        if (prevTotal <= 1) {
          setIsRunning(false);
          setPhase('complete');
          announcePhase('complete');
          return 0;
        }
        return prevTotal - 1;
      });

      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            announcePhase('hold');
            return PHASE_DURATIONS.hold;
          } else if (phase === 'hold') {
            setPhase('exhale');
            announcePhase('exhale');
            return PHASE_DURATIONS.exhale;
          } else if (phase === 'exhale') {
            // Completed one cycle
            if (currentCycle >= TOTAL_CYCLES) {
              setIsRunning(false);
              setPhase('complete');
              announcePhase('complete');
              return 0;
            } else {
              setCurrentCycle((c) => c + 1);
              setPhase('inhale');
              announcePhase('inhale');
              return PHASE_DURATIONS.inhale;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phase, currentCycle, audioGuidance, soundEnabled, hapticsEnabled]);

  const handleStart = () => {
    if (phase === 'idle' || phase === 'complete') {
      setPhase('inhale');
      setCurrentCycle(1);
      setPhaseSecondsLeft(PHASE_DURATIONS.inhale);
      setTotalSecondsRemaining(60);
      announcePhase('inhale');
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    sanctuaryAudio.cancelSpeech();
  };

  const handleReset = () => {
    setIsRunning(false);
    sanctuaryAudio.cancelSpeech();
    setPhase('idle');
    setCurrentCycle(1);
    setPhaseSecondsLeft(PHASE_DURATIONS.inhale);
    setTotalSecondsRemaining(60);
  };

  // Get visual scale & text based on phase
  const getPhaseStyles = () => {
    switch (phase) {
      case 'inhale':
        return {
          scale: 'scale-125 duration-[4000ms]',
          bgColor: 'bg-gradient-to-tr from-[#FFE5D9] via-[#FFCAD4] to-[#C8D5B9]',
          ringColor: 'ring-[#FFCAD4]',
          label: 'INHALE',
          spiritualSub: 'Receive God’s breath of life & calm',
          countTarget: PHASE_DURATIONS.inhale,
        };
      case 'hold':
        return {
          scale: 'scale-125 animate-pulse duration-1000',
          bgColor: 'bg-gradient-to-tr from-[#E6D5F0] via-[#FAF5F0] to-[#FFD4C4]',
          ringColor: 'ring-[#E6D5F0]',
          label: 'HOLD STILL',
          spiritualSub: 'Rest safely in His eternal presence',
          countTarget: PHASE_DURATIONS.hold,
        };
      case 'exhale':
        return {
          scale: 'scale-90 duration-[8000ms]',
          bgColor: 'bg-gradient-to-tr from-[#C8D5B9] via-[#FAF5F0] to-[#E6D5F0]',
          ringColor: 'ring-[#C8D5B9]',
          label: 'EXHALE SLOWLY',
          spiritualSub: 'Release fear, urgency, and the storm',
          countTarget: PHASE_DURATIONS.exhale,
        };
      case 'complete':
        return {
          scale: 'scale-110 duration-700',
          bgColor: 'bg-gradient-to-tr from-[#C8D5B9] via-[#FFF9F5] to-[#FFD4C4]',
          ringColor: 'ring-[#C8D5B9]',
          label: 'PEACE RESTORED',
          spiritualSub: 'You rode this wave with grace',
          countTarget: 0,
        };
      default:
        return {
          scale: 'scale-100 duration-500',
          bgColor: 'bg-gradient-to-tr from-[#FFE5D9] via-[#FFF9F5] to-[#E6D5F0]',
          ringColor: 'ring-[#E8DED6]',
          label: 'READY',
          spiritualSub: '4s Inhale · 7s Hold · 8s Exhale',
          countTarget: 4,
        };
    }
  };

  const currentStyles = getPhaseStyles();

  return (
    <div className="flex flex-col h-full text-[#2D2421]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED6]">
        <button
          onClick={() => {
            sanctuaryAudio.cancelSpeech();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#796B64] hover:text-[#2D2421] p-1.5 rounded-lg hover:bg-[#F5EFEB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SOS Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#796B64] bg-[#F5EFEB] px-2.5 py-1 rounded-full border border-[#E8DED6]">
            {totalSecondsRemaining}s left
          </span>
          <button
            onClick={() => setAudioGuidance(!audioGuidance)}
            className={`p-2 rounded-xl transition-colors ${
              audioGuidance 
                ? 'bg-[#E6D5F0] text-[#2D2421]' 
                : 'bg-[#F5EFEB] text-[#796B64]'
            }`}
            title={audioGuidance ? 'Audio Guidance Enabled' : 'Audio Guidance Muted'}
          >
            {audioGuidance ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Breathing Experience */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 text-center">
        {/* Cycle indicator */}
        <div className="mb-4 flex items-center gap-2">
          {[1, 2, 3].map((cycleNum) => (
            <div
              key={cycleNum}
              className={`h-2 rounded-full transition-all ${
                currentCycle === cycleNum && phase !== 'complete'
                  ? 'w-8 bg-[#2D2421]'
                  : currentCycle > cycleNum || phase === 'complete'
                  ? 'w-4 bg-[#5A6E4B]'
                  : 'w-4 bg-[#E8DED6]'
              }`}
            />
          ))}
          <span className="text-xs font-medium text-[#796B64] ml-1">
            {phase === 'complete' ? '3 of 3 Complete' : `Cycle ${currentCycle} of 3`}
          </span>
        </div>

        {/* Breathing Visual Orb */}
        <div className="relative w-64 h-64 flex items-center justify-center my-4">
          {/* Outer Ripple Rings */}
          <div 
            className={`absolute inset-0 rounded-full border border-[#FFCAD4]/50 transition-transform ease-out ${
              phase === 'inhale' ? 'scale-125 opacity-70' : 'scale-95 opacity-20'
            }`} 
          />
          <div 
            className={`absolute -inset-4 rounded-full border border-[#C8D5B9]/40 transition-transform ease-out ${
              phase === 'hold' ? 'scale-115 opacity-60' : 'scale-90 opacity-10'
            }`} 
          />

          {/* Central Breathing Orb */}
          <div
            className={`w-48 h-48 rounded-full shadow-2xl flex flex-col items-center justify-center p-4 transition-all ease-in-out ring-4 ${currentStyles.bgColor} ${currentStyles.ringColor} ${currentStyles.scale}`}
          >
            {phase === 'complete' ? (
              <CheckCircle className="w-12 h-12 text-[#5A6E4B] animate-bounce" />
            ) : (
              <>
                <span className="font-serif text-3xl font-black text-[#2D2421] tracking-tight">
                  {phase === 'idle' ? '4-7-8' : `${phaseSecondsLeft}s`}
                </span>
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#5A453F] mt-1">
                  {currentStyles.label}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Spiritual & Somatic Guidance */}
        <div className="max-w-xs mt-3 min-h-[60px]">
          <p className="font-serif text-base font-semibold text-[#2D2421] transition-all">
            {currentStyles.spiritualSub}
          </p>
          {phase === 'idle' && (
            <p className="text-xs text-[#796B64] mt-1">
              Press Start. The 4-7-8 method rapidly regulates the vagus nerve and shuts down fight-or-flight panic.
            </p>
          )}
        </div>

        {/* Completion Sanctuary Banner */}
        {phase === 'complete' && (
          <div className="w-full max-w-sm mt-3 p-4 rounded-2xl bg-[#FFF9F5] border border-[#C8D5B9] shadow-sm text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-1.5 text-[#5A6E4B]">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                Nervous System Calmed
              </h4>
            </div>
            <p className="font-scripture italic text-sm text-[#4A3E39] mb-3">
              "The Lord is my strength and my shield; my heart trusts in Him, and He helps me." — Psalm 28:7
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSosActiveScreen('craving')}
                className="flex-1 py-2 px-3 bg-[#2D2421] text-[#FFF9F5] rounded-xl text-xs font-semibold hover:bg-[#4A3E39] transition-colors"
              >
                Log Craving Victory
              </button>
              <button
                onClick={() => setSosActiveScreen('ground')}
                className="flex-1 py-2 px-3 bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] rounded-xl text-xs font-semibold hover:bg-[#F5EFEB] transition-colors"
              >
                Read Scripture
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="pt-3 border-t border-[#E8DED6] flex items-center justify-between gap-3">
        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center justify-center"
          title="Reset 60s Breathwork"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {isRunning ? (
          <button
            onClick={handlePause}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] font-semibold text-sm hover:bg-[#F5EFEB] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Pause className="w-4 h-4 text-[#796B64]" />
            <span>Pause Exercise</span>
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2D2421] to-[#4A3E39] text-[#FFF9F5] font-semibold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Play className="w-4 h-4 text-[#FFD4C4] fill-current" />
            <span>{phase === 'complete' ? 'Repeat 60s Session' : phase === 'idle' ? 'Begin 60-Second Breath' : 'Resume Breath'}</span>
          </button>
        )}

        <button
          onClick={() => {
            sanctaudioReset: sanctuaryAudio.cancelSpeech();
            setSosActiveScreen('ground');
          }}
          className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center justify-center"
          title="Switch to Scripture Grounding"
        >
          <Shield className="w-4 h-4 text-[#5A6E4B]" />
        </button>
      </div>
    </div>
  );
};
