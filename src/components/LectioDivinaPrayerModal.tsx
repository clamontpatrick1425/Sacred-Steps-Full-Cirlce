/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — Audio-Guided Lectio Divina & Breath-Synced Scripture
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Wind, 
  Music, 
  BookOpen, 
  Heart, 
  ChevronRight, 
  ChevronLeft,
  Waves,
  Bell,
  Disc3,
  Feather
} from 'lucide-react';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';
import { useSacredStore } from '../store/useSacredStore';

interface LectioDivinaPrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVerse?: {
    reference: string;
    text: string;
  };
}

interface LectioMovement {
  id: 'lectio' | 'meditatio' | 'oratio' | 'contemplatio';
  name: string;
  latinName: string;
  action: string;
  subtitle: string;
  guidanceText: string;
  prompt: string;
  durationSeconds: number;
}

interface BreathScripturePair {
  id: string;
  reference: string;
  inhalePhrase: string;
  exhalePhrase: string;
  theme: string;
}

const BREATH_SCRIPTURES: BreathScripturePair[] = [
  {
    id: 'psalm-46-10',
    reference: 'Psalm 46:10',
    inhalePhrase: 'Be still...',
    exhalePhrase: '...and know that I am God',
    theme: 'Peace & Sovereignty'
  },
  {
    id: '2cor-12-9',
    reference: '2 Corinthians 12:9',
    inhalePhrase: 'My grace is sufficient for you...',
    exhalePhrase: '...My power is perfected in weakness',
    theme: 'Sufficient Grace'
  },
  {
    id: 'psalm-23-1',
    reference: 'Psalm 23:1',
    inhalePhrase: 'The Lord is my shepherd...',
    exhalePhrase: '...I shall not want',
    theme: 'Contentment & Provision'
  },
  {
    id: '1peter-5-7',
    reference: '1 Peter 5:7',
    inhalePhrase: 'Cast all your anxiety on Him...',
    exhalePhrase: '...because He cares for you',
    theme: 'Releasing Burden'
  },
  {
    id: 'john-14-27',
    reference: 'John 14:27',
    inhalePhrase: 'Peace I leave with you...',
    exhalePhrase: '...My peace I give to you',
    theme: 'Quiet Rest'
  },
  {
    id: 'psalm-51-10',
    reference: 'Psalm 51:10',
    inhalePhrase: 'Create in me a clean heart...',
    exhalePhrase: '...and renew a right spirit within me',
    theme: 'Clean Spirit'
  }
];

const LECTIO_MOVEMENTS: LectioMovement[] = [
  {
    id: 'lectio',
    name: 'Reading',
    latinName: 'Lectio',
    action: 'Read slowly and receive',
    subtitle: 'Listen with the ear of the heart',
    guidanceText: 'Open your hands in your lap. Listen not with analytical critique, but as a beloved child receiving a letter from their Father. Let each word wash over your spirit.',
    prompt: 'What word, phrase, or truth captures your attention as you listen?',
    durationSeconds: 45
  },
  {
    id: 'meditatio',
    name: 'Reflecting',
    latinName: 'Meditatio',
    action: 'Meditate upon God\'s love',
    subtitle: 'Chew and savor the divine promise',
    guidanceText: 'Ruminate on the phrase that stood out. Why does this word speak to your recovery today? See God\'s sovereign grace standing between you and your past shame.',
    prompt: 'Where does God\'s tenderness meet your present struggle right now?',
    durationSeconds: 60
  },
  {
    id: 'oratio',
    name: 'Praying',
    latinName: 'Oratio',
    action: 'Pour out honest prayer',
    subtitle: 'Speak without masks or hiding',
    guidanceText: 'Pour out whatever rises: confession, gratitude, hunger, weariness. God already knows every chamber of your heart; there is no need to pretend or perform.',
    prompt: 'Whisper your raw, unedited prayer directly to Christ.',
    durationSeconds: 60
  },
  {
    id: 'contemplatio',
    name: 'Resting',
    latinName: 'Contemplatio',
    action: 'Rest in sovereign grace',
    subtitle: 'Abide in wordless communion',
    guidanceText: 'Release even your words. Simply sit in the presence of God like a child resting in a parent\'s embrace. Grace holds you. You are forgiven, sustained, and free.',
    prompt: 'Breathe in His stillness. You do not have to fight alone anymore.',
    durationSeconds: 60
  }
];

export const LectioDivinaPrayerModal: React.FC<LectioDivinaPrayerModalProps> = ({
  isOpen,
  onClose,
  initialVerse
}) => {
  const { soundEnabled, hapticsEnabled, todaysAnchor } = useSacredStore();

  const activeVerse = initialVerse || todaysAnchor.verse;

  // Active View Tab: 'lectio' | 'breath-synced'
  const [activeMode, setActiveMode] = useState<'lectio' | 'breath-synced'>('lectio');

  // Lectio Divina states
  const [currentMovementIndex, setCurrentMovementIndex] = useState(0);
  const [isLectioPlaying, setIsLectioPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(LECTIO_MOVEMENTS[0].durationSeconds);
  const [ambientSound, setAmbientSound] = useState<'gentle-cello' | 'flowing-stream' | 'soft-chime' | 'off'>('flowing-stream');

  // Breath-Synced Scripture states
  const [selectedBreathIndex, setSelectedBreathIndex] = useState(0);
  const [isBreathRunning, setIsBreathRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [breathVoiceSpoken, setBreathVoiceSpoken] = useState(true);

  const currentMovement = LECTIO_MOVEMENTS[currentMovementIndex];
  const activeBreathScripture = BREATH_SCRIPTURES[selectedBreathIndex];

  // Stop ambient and speech when closing modal
  useEffect(() => {
    if (!isOpen) {
      sanctuaryAudio.stopAmbientTrack();
      sanctuaryAudio.cancelSpeech();
      setIsLectioPlaying(false);
      setIsBreathRunning(false);
    } else {
      // Start soothing stream ambient by default if sound enabled
      if (soundEnabled && ambientSound !== 'off') {
        sanctuaryAudio.startAmbientTrack(ambientSound);
      }
    }
  }, [isOpen]);

  // Ambient track change handler
  const handleAmbientChange = (type: 'gentle-cello' | 'flowing-stream' | 'soft-chime' | 'off') => {
    setAmbientSound(type);
    if (hapticsEnabled) triggerHaptic('soft');
    if (type === 'off') {
      sanctuaryAudio.stopAmbientTrack();
    } else {
      sanctuaryAudio.startAmbientTrack(type);
    }
  };

  // Lectio timer loop
  useEffect(() => {
    if (!isLectioPlaying) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Transition to next movement or complete
          if (currentMovementIndex < LECTIO_MOVEMENTS.length - 1) {
            const nextIdx = currentMovementIndex + 1;
            setCurrentMovementIndex(nextIdx);
            if (hapticsEnabled) triggerHaptic('step');
            if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
            speakMovementGuidance(nextIdx);
            return LECTIO_MOVEMENTS[nextIdx].durationSeconds;
          } else {
            setIsLectioPlaying(false);
            if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLectioPlaying, currentMovementIndex, soundEnabled, hapticsEnabled]);

  const speakMovementGuidance = (index: number) => {
    const m = LECTIO_MOVEMENTS[index];
    if (index === 0) {
      sanctuaryAudio.speakScripture(
        `Lectio: Reading slowly. "${activeVerse.reference}. ${activeVerse.text}." ${m.guidanceText}`
      );
    } else {
      sanctuaryAudio.speakScripture(
        `${m.latinName}: ${m.name}. ${m.guidanceText} ${m.prompt}`
      );
    }
  };

  const handleToggleLectioPlay = () => {
    if (hapticsEnabled) triggerHaptic('soft');
    const next = !isLectioPlaying;
    setIsLectioPlaying(next);

    if (next) {
      if (ambientSound !== 'off') {
        sanctuaryAudio.startAmbientTrack(ambientSound);
      }
      speakMovementGuidance(currentMovementIndex);
    } else {
      sanctuaryAudio.cancelSpeech();
    }
  };

  const handleSelectMovement = (idx: number) => {
    if (hapticsEnabled) triggerHaptic('soft');
    setCurrentMovementIndex(idx);
    setSecondsRemaining(LECTIO_MOVEMENTS[idx].durationSeconds);
    if (isLectioPlaying) {
      speakMovementGuidance(idx);
    }
  };

  // Breath-Synced Scripture timer loop
  useEffect(() => {
    if (!isBreathRunning) return;

    const timer = setInterval(() => {
      setBreathCount(prev => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            if (hapticsEnabled) triggerHaptic('soft');
            if (soundEnabled) sanctuaryAudio.playGraceChime('breathHold');
            return 4;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            if (hapticsEnabled) triggerHaptic('step');
            if (soundEnabled) sanctuaryAudio.playGraceChime('breathOut');
            if (breathVoiceSpoken) {
              sanctuaryAudio.speakBreathGuidance(activeBreathScripture.exhalePhrase);
            }
            return 4;
          } else {
            // Completed cycle
            setBreathPhase('inhale');
            if (hapticsEnabled) triggerHaptic('pulse');
            if (soundEnabled) sanctuaryAudio.playGraceChime('breathIn');
            if (breathVoiceSpoken) {
              sanctuaryAudio.speakBreathGuidance(activeBreathScripture.inhalePhrase);
            }
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathRunning, breathPhase, activeBreathScripture, breathVoiceSpoken, hapticsEnabled, soundEnabled]);

  const handleToggleBreath = () => {
    if (hapticsEnabled) triggerHaptic('soft');
    const next = !isBreathRunning;
    setIsBreathRunning(next);
    if (next) {
      setBreathPhase('inhale');
      setBreathCount(4);
      if (soundEnabled) sanctuaryAudio.playGraceChime('breathIn');
      if (breathVoiceSpoken) {
        sanctuaryAudio.speakBreathGuidance(activeBreathScripture.inhalePhrase);
      }
      if (ambientSound !== 'off') {
        sanctuaryAudio.startAmbientTrack(ambientSound);
      }
    } else {
      sanctuaryAudio.cancelSpeech();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-[36px] max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#2D2421] relative">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8DED6] bg-[#FAF5F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD4C4] via-[#E6D5F0] to-[#C8D5B9] flex items-center justify-center text-[#2D2421] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#7A5B0B]" />
            </span>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2D2421] leading-tight">
                Contemplative Sanctuary
              </h3>
              <p className="text-[11px] text-[#796B64]">
                Audio-Guided Lectio Divina & Breath-Synced Scripture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#E8DED6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-2.5 bg-[#FAF5F0] border-b border-[#E8DED6] flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveMode('lectio');
              if (hapticsEnabled) triggerHaptic('soft');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeMode === 'lectio'
                ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                : 'bg-white border border-[#E8DED6] text-[#796B64] hover:bg-[#F5EFEB]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>4-Stage Lectio Divina</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('breath-synced');
              if (hapticsEnabled) triggerHaptic('soft');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeMode === 'breath-synced'
                ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                : 'bg-white border border-[#E8DED6] text-[#796B64] hover:bg-[#F5EFEB]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breath-Synced Scripture</span>
          </button>
        </div>

        {/* Ambient Soundscape Bar */}
        <div className="bg-[#FFFDF9] border-b border-[#E8DED6] px-4 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-[#796B64]">
            <Music className="w-3.5 h-3.5 text-[#5A6E4B]" />
            <span className="text-[11px] font-medium">Ambient Sound:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'flowing-stream', label: 'Stream', icon: Waves },
              { id: 'gentle-cello', label: 'Cello', icon: Disc3 },
              { id: 'soft-chime', label: 'Chimes', icon: Bell },
              { id: 'off', label: 'Mute', icon: VolumeX }
            ].map(snd => {
              const Icon = snd.icon;
              const isSelected = ambientSound === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => handleAmbientChange(snd.id as any)}
                  className={`py-1 px-2.5 rounded-full text-[10px] font-medium flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-[#2D2421] text-white shadow-2xs font-semibold'
                      : 'bg-white border border-[#E8DED6] text-[#796B64] hover:bg-[#FAF5F0]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{snd.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeMode === 'lectio' ? (
            /* ================= MODE A: LECTIO DIVINA ================= */
            <div className="space-y-5">
              {/* Scripture Anchor Banner */}
              <div className="bg-white border border-[#E8DED6] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-2 text-center">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-3 py-0.5 rounded-full border border-[#E5C158]/40">
                  {activeVerse.reference}
                </span>
                <p className="font-scripture italic text-base sm:text-lg text-[#2D2421] leading-relaxed px-2">
                  "{activeVerse.text}"
                </p>
              </div>

              {/* 4 Sacred Movements Carousel */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {LECTIO_MOVEMENTS.map((mov, idx) => {
                  const isCurrent = idx === currentMovementIndex;
                  return (
                    <button
                      key={mov.id}
                      onClick={() => handleSelectMovement(idx)}
                      className={`p-2.5 rounded-2xl text-center transition-all border ${
                        isCurrent
                          ? 'bg-[#2D2421] text-white border-[#2D2421] shadow-xs'
                          : 'bg-white border-[#E8DED6] text-[#796B64] hover:bg-[#FAF5F0]'
                      }`}
                    >
                      <span className="text-[9px] uppercase font-bold tracking-wider block opacity-75">
                        Stage {idx + 1}
                      </span>
                      <span className="font-serif text-xs sm:text-sm font-bold block truncate">
                        {mov.latinName}
                      </span>
                      <span className="text-[10px] block opacity-85 mt-0.5 truncate">
                        {mov.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Movement Detail Card */}
              <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#E6D5F0]/25 border border-[#E8DED6] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#E6D5F0]/70 flex items-center justify-center text-[#4E2B5A]">
                      <Feather className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#2D2421]">
                        {currentMovement.latinName} · {currentMovement.name}
                      </h4>
                      <p className="text-[11px] text-[#796B64]">
                        {currentMovement.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Circular Timer Progress */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8DED6] text-xs font-mono font-bold text-[#2D2421]">
                    <span>{secondsRemaining}s</span>
                  </div>
                </div>

                <p className="text-xs text-[#4A3E39] leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-[#E8DED6]">
                  {currentMovement.guidanceText}
                </p>

                <div className="p-3 bg-[#FAF5F0] rounded-2xl border border-[#E8DED6] text-xs font-medium text-[#2D2421] italic">
                  <strong>Contemplative Prompt:</strong> {currentMovement.prompt}
                </div>

                {/* Primary Play / Pause Audio Control */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      if (currentMovementIndex > 0) handleSelectMovement(currentMovementIndex - 1);
                    }}
                    disabled={currentMovementIndex === 0}
                    className="p-2.5 rounded-2xl bg-white border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous Movement"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleToggleLectioPlay}
                    className="py-3 px-6 rounded-2xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
                  >
                    {isLectioPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause Guided Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-[#FFD4C4]" />
                        <span>Begin 4-Movement Meditation</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (currentMovementIndex < LECTIO_MOVEMENTS.length - 1) handleSelectMovement(currentMovementIndex + 1);
                    }}
                    disabled={currentMovementIndex === LECTIO_MOVEMENTS.length - 1}
                    className="p-2.5 rounded-2xl bg-white border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next Movement"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= MODE B: BREATH-SYNCED SCRIPTURE ================= */
            <div className="space-y-5">
              {/* Scripture Pair Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#796B64]">
                  Select Biblical Breath Phrase
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {BREATH_SCRIPTURES.map((pair, idx) => {
                    const isSelected = idx === selectedBreathIndex;
                    return (
                      <button
                        key={pair.id}
                        onClick={() => {
                          setSelectedBreathIndex(idx);
                          if (hapticsEnabled) triggerHaptic('soft');
                        }}
                        className={`p-2.5 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'bg-[#2D2421] text-white border-[#2D2421] shadow-2xs'
                            : 'bg-white border-[#E8DED6] text-[#4A3E39] hover:bg-[#FAF5F0]'
                        }`}
                      >
                        <span className={`text-[10px] font-bold block ${isSelected ? 'text-[#FFD4C4]' : 'text-[#7A5B0B]'}`}>
                          {pair.reference}
                        </span>
                        <span className="text-xs font-semibold block truncate">
                          {pair.theme}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Breathing Circle Visualizer */}
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <div 
                  className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full flex flex-col items-center justify-center p-4 border-2 transition-all duration-1000 relative shadow-inner ${
                    breathPhase === 'inhale'
                      ? 'scale-110 bg-[#FFD4C4]/50 border-[#E89E88] shadow-[0_0_40px_rgba(255,212,196,0.6)]'
                      : breathPhase === 'hold'
                      ? 'scale-110 bg-[#F4E4C1]/50 border-[#D4AF37] shadow-[0_0_40px_rgba(244,228,193,0.6)]'
                      : 'scale-90 bg-[#E6D5F0]/50 border-[#B99AC9] shadow-[0_0_20px_rgba(230,213,240,0.4)]'
                  }`}
                >
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#796B64] mb-1">
                    {breathPhase === 'inhale' ? 'Inhale Divine Peace' : breathPhase === 'hold' ? 'Hold in Still Trust' : 'Exhale Burden & Fear'}
                  </span>

                  <span className="font-serif text-3xl font-black text-[#2D2421]">
                    {breathCount}s
                  </span>

                  {/* Active Scripture Phrase */}
                  <p className="font-scripture italic text-sm font-semibold text-[#2D2421] mt-2 px-3 leading-snug">
                    {breathPhase === 'exhale'
                      ? activeBreathScripture.exhalePhrase
                      : activeBreathScripture.inhalePhrase}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={handleToggleBreath}
                    className="py-3 px-6 rounded-2xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
                  >
                    {isBreathRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause Breathing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-[#FFD4C4]" />
                        <span>Start Breath-Synced Prayer</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setBreathVoiceSpoken(!breathVoiceSpoken)}
                    className={`p-3 rounded-2xl border transition-all ${
                      breathVoiceSpoken
                        ? 'bg-white border-[#2D2421] text-[#2D2421]'
                        : 'bg-[#FAF5F0] border-[#E8DED6] text-[#9E8E87]'
                    }`}
                    title={breathVoiceSpoken ? 'Mute Guide Voice' : 'Enable Guide Voice'}
                  >
                    {breathVoiceSpoken ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 border-t border-[#E8DED6] bg-[#FAF5F0] text-center text-xs text-[#796B64]">
          <p className="font-serif italic">
            "A Path to Recovery, A Life in Grace" · C. Lamont Patrick
          </p>
        </div>
      </div>
    </div>
  );
};
