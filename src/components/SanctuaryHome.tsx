import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wind, 
  Play, 
  Pause, 
  Volume2, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Flame, 
  Compass,
  AlertCircle,
  Sunrise,
  Heart,
  BookOpen,
  CheckCircle2,
  Lock,
  Brain,
  Music,
  Headphones,
  Moon,
  Bell,
  Square
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { DAILY_DEVOTIONALS, RECOVERY_TRIGGERS } from '../data/devotionals';
import { TWELVE_STEPS_BOOK_DATA } from '../data/twelveStepsBookData';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';
import { LectioDivinaPrayerModal } from './LectioDivinaPrayerModal';
import { LiturgicalRitualModal } from './LiturgicalRitualModal';

export const SanctuaryHome: React.FC = () => {
  const { 
    getDaysInGrace, 
    completedStepsCount, 
    setActiveTab, 
    setCrisisModalOpen,
    todaysAnchor,
    graceDeck,
    active12StepNumber,
    stepCompletedMap,
    hapticsEnabled,
    soundEnabled,
    openSos,
    activeRitualModal,
    openRitualModal,
    closeRitualModal,
    getTodaysRitual,
    preferredVoiceId,
    isAudioPlaying,
    activeAudioId,
    setAudioPlaying,
    stopAudio
  } = useSacredStore();

  const isSpeakingDevotional = isAudioPlaying && activeAudioId === 'sanctuary-devotional';

  const daysInGrace = getDaysInGrace();
  const todaysRitual = getTodaysRitual();
  const currentStep = TWELVE_STEPS_BOOK_DATA[active12StepNumber - 1] || TWELVE_STEPS_BOOK_DATA[0];
  const total12StepsCompleted = Object.values(stepCompletedMap).filter(Boolean).length;

  // Time-aware devotional (morning vs evening)
  const currentHour = new Date().getHours();
  const isEvening = currentHour >= 18 || currentHour < 5;
  const currentDevotional = DAILY_DEVOTIONALS.find(d => isEvening ? d.period === 'evening' : d.period === 'morning') || DAILY_DEVOTIONALS[0];

  // Breathwork State (4-7-8 breathing)
  const [showLectioModal, setShowLectioModal] = useState(false);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [completedBreathCycles, setCompletedBreathCycles] = useState(0);

  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Advance phase
        if (breathPhase === 'inhale') {
          setBreathPhase('hold');
          if (hapticsEnabled) triggerHaptic('soft');
          return 7;
        } else if (breathPhase === 'hold') {
          setBreathPhase('exhale');
          if (hapticsEnabled) triggerHaptic('soft');
          if (soundEnabled) sanctuaryAudio.playGraceChime('breathOut');
          return 8;
        } else {
          // cycle completed
          setBreathPhase('inhale');
          setCompletedBreathCycles(c => c + 1);
          if (hapticsEnabled) triggerHaptic('step');
          if (soundEnabled) sanctuaryAudio.playGraceChime('breathIn');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase, hapticsEnabled, soundEnabled]);

  const toggleBreathwork = () => {
    const next = !isBreathingActive;
    setIsBreathingActive(next);
    if (next) {
      setBreathPhase('inhale');
      setBreathTimer(4);
      if (hapticsEnabled) triggerHaptic('pulse');
      if (soundEnabled) sanctuaryAudio.playGraceChime('breathIn');
    }
  };

  const handleSpeakDevotional = () => {
    if (isSpeakingDevotional) {
      stopAudio();
      if (hapticsEnabled) triggerHaptic('soft');
      return;
    }

    if (hapticsEnabled) triggerHaptic('pulse');
    setAudioPlaying(true, currentDevotional.title, 'sanctuary-devotional');
    sanctuaryAudio.speakScripture(
      `${currentDevotional.verseRef}. ${currentDevotional.verseText}. ${currentDevotional.reflection}`,
      preferredVoiceId,
      currentDevotional.title
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Sanctuary Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#796B64] block mb-1">
            {isEvening ? 'Evening Sanctuary' : 'Morning Horizon'}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#2D2421] font-semibold">
            Grace Over Perfection
          </h1>
        </div>
        <button
          onClick={() => setCrisisModalOpen(true)}
          className="text-xs px-3 py-1.5 rounded-full text-[#9C3E32] bg-[#FFD4C4]/50 hover:bg-[#FFD4C4]/80 transition-colors flex items-center gap-1.5 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Lifeline 988</span>
        </button>
      </div>

      {/* Days of Grace & Quick Progress Metric */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#F5EFEB] border border-[#E8DED6] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#796B64] font-medium">Days of Grace</span>
            <Flame className="w-4 h-4 text-[#FFD4C4]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2421]">
              {daysInGrace}
            </span>
            <span className="text-xs text-[#796B64]">days forward</span>
          </div>
          <p className="text-[11px] text-[#796B64] mt-1.5">
            One day, one step, one breath in Christ.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#F5EFEB] border border-[#E8DED6] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#796B64] font-medium">Steps Completed</span>
            <ShieldCheck className="w-4 h-4 text-[#C8D5B9]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2421]">
              {completedStepsCount}
            </span>
            <span className="text-xs text-[#796B64]">victories</span>
          </div>
          <p className="text-[11px] text-[#796B64] mt-1.5">
            Lies dismantled with the S.T.E.P. method.
          </p>
        </div>
      </div>

      {/* Liturgical Rhythm (Morning Dawn Offering & Evening Grace Review) Card */}
      <div 
        onClick={() => {
          openRitualModal(isEvening ? 'evening' : 'morning');
          if (hapticsEnabled) triggerHaptic('soft');
        }}
        className="p-5 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF5F0] to-[#E6D5F0]/20 border border-[#E8DED6] shadow-sm hover:border-[#D5C7BD] transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              isEvening ? 'bg-[#E6D5F0]/70 text-[#543864]' : 'bg-[#FFD4C4]/60 text-[#7C3626]'
            }`}>
              {isEvening ? <Moon className="w-5 h-5" /> : <Sunrise className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-2 py-0.5 rounded-full border border-[#E5C158]/40">
                  Liturgical Rhythm
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8D5B9]" />
                <span className="text-[10px] text-[#796B64]">
                  {isEvening ? 'Evening Grace Review (Examen)' : 'Morning Dawn Offering'}
                </span>
              </div>
              <h3 className="font-serif text-base text-[#2D2421] font-semibold mt-0.5 group-hover:text-black">
                {isEvening 
                  ? '3-Min Christian Examen & Resting in Peace'
                  : 'Set Intention & Surrender One Lie for Today'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-[#2D2421] bg-white px-3 py-1.5 rounded-xl border border-[#E8DED6] shrink-0 shadow-xs group-hover:bg-[#FAF5F0]">
            <span>{isEvening ? (todaysRitual.eveningCompleted ? 'Review' : 'Begin Examen') : (todaysRitual.morningCompleted ? 'Review' : 'Begin Offering')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#E8DED6]/70 flex items-center justify-between text-xs text-[#5C4D46]">
          <span className="text-[11px] flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${
              (isEvening ? todaysRitual.eveningCompleted : todaysRitual.morningCompleted) ? 'bg-[#5A6E4B]' : 'bg-[#E5C158]'
            }`} />
            <span>
              {isEvening
                ? (todaysRitual.eveningCompleted ? 'Evening Examen Completed' : 'Evening Examen Pending')
                : (todaysRitual.morningCompleted ? 'Dawn Offering Consecrated' : 'Dawn Offering Pending')}
            </span>
          </span>
          <span className="text-[11px] text-[#796B64] flex items-center gap-1">
            <Bell className="w-3 h-3 text-[#796B64]" />
            <span>Scheduled Reminders Active</span>
          </span>
        </div>
      </div>

      {/* Daily Anchor Feature Card */}
      <div 
        onClick={() => setActiveTab('anchor')}
        className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] shadow-sm hover:border-[#D5C7BD] transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD4C4]/60 flex items-center justify-center text-[#7C3626] shrink-0">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#796B64]">
                  Morning Routine
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8D5B9]" />
                <span className="text-[10px] text-[#796B64]">
                  Prayer → Scripture → Affirmation
                </span>
              </div>
              <h3 className="font-serif text-base text-[#2D2421] font-semibold mt-0.5 group-hover:text-black">
                Today's Daily Anchor: "{todaysAnchor.prayer.title}"
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-[#2D2421] bg-[#FFF9F5] px-3 py-1.5 rounded-xl border border-[#E8DED6] shrink-0 shadow-xs">
            <span>Swipe Cards</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#E8DED6]/70 flex items-center justify-between text-xs text-[#4A3E39]">
          <span className="italic truncate pr-4">
            "{todaysAnchor.verse.reference}: {todaysAnchor.verse.text.slice(0, 75)}..."
          </span>
          <span className="text-[11px] text-[#796B64] shrink-0 flex items-center gap-1">
            <Heart className="w-3 h-3 text-[#D97768] fill-[#D97768]" />
            <span>Deck: {graceDeck.length}</span>
          </span>
        </div>
      </div>

      {/* Interactive 12-Step Journal Banner Card */}
      <div 
        onClick={() => setActiveTab('stepJournal')}
        className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm hover:border-[#D5C7BD] transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6D5F0]/60 flex items-center justify-center text-[#3E2B52] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#796B64]">
                  Interactive 12-Step Journal
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8D5B9]" />
                <span className="text-[10px] text-[#796B64]">
                  C. Lamont Patrick Book Guide
                </span>
              </div>
              <h3 className="font-serif text-base text-[#2D2421] font-semibold mt-0.5 group-hover:text-black">
                Step {currentStep.stepNumber}: {currentStep.bookSubtitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-[#2D2421] bg-[#FAF5F0] px-3 py-1.5 rounded-xl border border-[#E8DED6] shrink-0 shadow-xs">
            <span>Open Journal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#E8DED6]/70 flex items-center justify-between text-xs text-[#4A3E39]">
          <span className="text-[11px] text-[#796B64]">
            "{currentStep.traditionalTitle.slice(0, 60)}..."
          </span>
          <span className="text-[11px] font-medium text-[#243317] flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C8D5B9]" />
            <span>{total12StepsCompleted} of 12 Steps Done</span>
          </span>
        </div>
      </div>

      {/* Encrypted 12-Step Journal & AI Pattern Vault Banner */}
      <div 
        onClick={() => setActiveTab('journal')}
        className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF9F5] via-[#FAF5F0] to-[#E6D5F0]/20 border border-[#E8DED6] shadow-sm hover:border-[#D5C7BD] transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8D5B9]/60 flex items-center justify-center text-[#2A3B1F] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A6E4B]">
                  Encrypted Sanctuary Vault
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6D5F0]" />
                <span className="text-[10px] text-[#796B64]">
                  AES-256 • Biometrics • Voice-to-Text
                </span>
              </div>
              <h3 className="font-serif text-base text-[#2D2421] font-semibold mt-0.5 group-hover:text-black">
                12-Step Encrypted Journal & AI Insights
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-[#2D2421] bg-[#FAF5F0] px-3 py-1.5 rounded-xl border border-[#E8DED6] shrink-0 shadow-xs">
            <span>Open Vault</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#E8DED6]/70 flex items-center justify-between text-xs text-[#796B64]">
          <span className="text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A6E4B]" />
            <span>Local-first zero knowledge storage</span>
          </span>
          <span className="text-[11px] flex items-center gap-1 text-[#2D2421] font-medium">
            <Brain className="w-3.5 h-3.5 text-[#C4A9D8]" />
            <span>On-device pattern recognition</span>
          </span>
        </div>
      </div>

      {/* Today's Sacred Devotional */}
      <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm relative overflow-hidden">
        {/* Soft Dawn Corner Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#FFD4C4]/30 via-[#E6D5F0]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E6D5F0]" />
            <span className="font-sans text-xs tracking-wider uppercase font-semibold text-[#796B64]">
              {currentDevotional.title}
            </span>
          </div>
          <button
            onClick={handleSpeakDevotional}
            className={`p-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              isSpeakingDevotional
                ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs ring-2 ring-[#FFD4C4]'
                : 'text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB]'
            }`}
            title={isSpeakingDevotional ? "Stop audio" : "Listen to Devotional"}
            aria-label={isSpeakingDevotional ? "Stop audio" : "Listen to Devotional"}
          >
            {isSpeakingDevotional ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
                <span className="text-[11px] font-semibold pr-0.5">Stop</span>
              </>
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>

        <blockquote className="font-scripture italic text-xl sm:text-2xl text-[#2D2421] leading-relaxed mb-3">
          "{currentDevotional.verseText}"
        </blockquote>

        <div className="text-right mb-4">
          <span className="font-sans text-xs uppercase tracking-wider text-[#796B64] font-medium">
            {currentDevotional.verseRef}
          </span>
        </div>

        <p className="font-sans text-sm text-[#4A3E39] leading-relaxed mb-4 border-t border-[#E8DED6] pt-3">
          {currentDevotional.reflection}
        </p>

        <div className="p-3 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-xs text-[#2D2421] font-medium flex items-center justify-between">
          <span className="italic">Anchor: {currentDevotional.graceAnchor}</span>
          <button 
            onClick={() => setActiveTab('guide')}
            className="text-xs text-[#2D2421] font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            <span>Anchor In Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Audio-Guided Lectio Divina & Breath-Synced Scripture Feature Card */}
      <div 
        onClick={() => {
          setShowLectioModal(true);
          if (hapticsEnabled) triggerHaptic('soft');
        }}
        className="p-5 rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF4E8] to-[#E6D5F0]/30 border border-[#E5C158]/50 shadow-sm hover:border-[#D4AF37] transition-all cursor-pointer relative overflow-hidden group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#FFF1BD] flex items-center justify-center text-[#4A3222] shrink-0 shadow-xs">
              <Headphones className="w-5 h-5 text-[#5A3816]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-2 py-0.5 rounded-full border border-[#E5C158]/40">
                  Audio-Guided Sanctuary
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8D5B9]" />
                <span className="text-[10px] text-[#796B64]">
                  Ambient Soundscapes · 2–5 min
                </span>
              </div>
              <h3 className="font-serif text-base text-[#2D2421] font-bold mt-1 group-hover:text-black">
                Lectio Divina & Breath-Synced Scripture
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D2421] bg-white px-3 py-1.5 rounded-xl border border-[#E8DED6] shrink-0 shadow-2xs group-hover:bg-[#FAF5F0]">
            <span>Listen & Breathe</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        <p className="text-xs text-[#5C4D46] leading-relaxed mt-3">
          Immerse in soothing flowing streams, warm cello drones, or temple chimes while being gently guided through <strong>Lectio</strong>, <strong>Meditatio</strong>, <strong>Oratio</strong>, and <strong>Contemplatio</strong> with synchronized breathing.
        </p>

        <div className="mt-3 pt-2.5 border-t border-[#E5C158]/30 flex items-center justify-between text-xs text-[#796B64]">
          <span className="text-[11px] flex items-center gap-1.5 text-[#5A6E4B] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>4-Stage Sacred Movement · Psalm 46:10 Breath Pacer</span>
          </span>
          <span className="text-[11px] font-bold text-[#7A5B0B]">
            Stream · Cello · Chimes
          </span>
        </div>
      </div>

      {/* Guided 4-7-8 Breath of Stillness */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] shadow-sm text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-left">
            <Wind className="w-4 h-4 text-[#796B64]" />
            <div>
              <h2 className="font-serif text-base text-[#2D2421] font-semibold">
                4-7-8 Breath of Stillness
              </h2>
              <span className="text-[11px] text-[#796B64]">
                Inhale peace · Hold in trust · Release the burden
              </span>
            </div>
          </div>
          <button
            onClick={toggleBreathwork}
            className="px-3 py-1.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#FFD4C4]" />}
            <span>{isBreathingActive ? 'Pause' : 'Breathe'}</span>
          </button>
        </div>

        {/* Breathing Visual Pacer */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div 
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border transition-all duration-700 relative ${
              breathPhase === 'inhale' 
                ? 'scale-110 bg-[#FFD4C4]/40 border-[#FFD4C4]' 
                : breathPhase === 'hold'
                ? 'scale-110 bg-[#F4E4C1]/40 border-[#F4E4C1]'
                : 'scale-90 bg-[#E6D5F0]/40 border-[#E6D5F0]'
            }`}
          >
            <span className="font-serif text-3xl font-semibold text-[#2D2421]">
              {breathTimer}s
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#796B64] mt-1">
              {breathPhase === 'inhale' ? 'Inhale Peace' : breathPhase === 'hold' ? 'Hold Trust' : 'Exhale Burden'}
            </span>
          </div>

          <span className="text-xs text-[#796B64] mt-4 block">
            {completedBreathCycles > 0 ? `${completedBreathCycles} mindful breath cycles completed` : 'Tap breathe to steady your nervous system'}
          </span>

          <div className="mt-3 flex justify-center">
            <button
              onClick={() => openSos('breathe')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8DED6] text-xs font-semibold text-[#2D2421] hover:bg-[#F5EFEB] transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5A6E4B]" />
              <span>Full 60s Breathwork & Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Real-Time Triggers (Quick S.T.E.P. Entry) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base text-[#2D2421] font-semibold">
            Need Immediate Grace?
          </h2>
          <button
            onClick={() => setActiveTab('guide')}
            className="text-xs text-[#796B64] hover:text-[#2D2421] transition-colors flex items-center gap-1"
          >
            <span>Open Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {RECOVERY_TRIGGERS.map((trigger) => (
            <button
              key={trigger.id}
              onClick={() => setActiveTab('guide')}
              className="text-left p-3.5 rounded-xl bg-[#FFF9F5] border border-[#E8DED6] hover:border-[#D5C7BD] hover:bg-[#F5EFEB] transition-all duration-200 group"
            >
              <div 
                className="w-2 h-2 rounded-full mb-2" 
                style={{ backgroundColor: trigger.color }}
              />
              <span className="block text-xs font-semibold text-[#2D2421] group-hover:text-[#000]">
                {trigger.name}
              </span>
              <span className="block text-[11px] text-[#796B64] mt-0.5">
                {trigger.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lectio Divina & Breath-Synced Scripture Modal */}
      <LectioDivinaPrayerModal
        isOpen={showLectioModal}
        onClose={() => setShowLectioModal(false)}
      />

      {/* Sacred Morning & Evening Rituals Modal */}
      <LiturgicalRitualModal
        isOpen={activeRitualModal !== null}
        onClose={closeRitualModal}
        initialTab={activeRitualModal || (isEvening ? 'evening' : 'morning')}
      />
    </div>
  );
};
