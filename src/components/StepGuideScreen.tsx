import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  ShieldCheck, 
  Volume2, 
  VolumeX,
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  RotateCcw, 
  PenLine, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Zap,
  Play,
  Square,
  Repeat
} from 'lucide-react';
import { useSacredStore, StepBreakthrough } from '../store/useSacredStore';
import { RECOVERY_TRIGGERS, TriggerItem } from '../data/devotionals';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface StepResponse {
  isCrisis?: boolean;
  message?: string;
  scripture: {
    reference: string;
    text: string;
  };
  truth: {
    lie: string;
    statement: string;
  };
  embrace: {
    affirmation: string;
  };
  practice: {
    microStep: string;
  };
  closing: string;
}

interface QuickPackItem {
  id: string;
  badge: string;
  title: string;
  lieLabel: string;
  prompt: string;
  color: string;
}

const TRIGGER_QUICK_PACKS: QuickPackItem[] = [
  {
    id: 'acute-craving',
    badge: 'Urgent Urge',
    title: 'Physical Craving & Body Urge',
    lieLabel: 'Lie: "I cannot endure this tension without using."',
    prompt: 'I am experiencing an intense physical craving right now. The pressure feels overwhelming and I need immediate spiritual grounding to withstand it.',
    color: '#D97768'
  },
  {
    id: 'past-shame',
    badge: 'Condemnation',
    title: 'Crushing Guilt & Past Shame',
    lieLabel: 'Lie: "I am permanently ruined and beyond grace."',
    prompt: 'I feel crushed by shame and regret over what I did in my past. The voice in my head says I am fundamentally bad and unforgivable.',
    color: '#8B261D'
  },
  {
    id: 'isolation',
    badge: 'Loneliness',
    title: 'Deep Loneliness & Abandonment',
    lieLabel: 'Lie: "Nobody cares and God has left me to struggle alone."',
    prompt: 'I feel completely alone and misunderstood. The emptiness inside makes me want to escape and numb myself.',
    color: '#7A5B0B'
  },
  {
    id: 'boiling-anger',
    badge: 'Resentment',
    title: 'Heated Anger & Bitterness',
    lieLabel: 'Lie: "Holding this grudge protects me from pain."',
    prompt: 'I am consumed with anger and bitterness over how someone treated me. The resentment is eating me alive and threatening my recovery.',
    color: '#C0392B'
  },
  {
    id: 'future-anxiety',
    badge: 'Fear',
    title: 'Fear of Relapse & Tomorrow',
    lieLabel: 'Lie: "I will inevitably fail and lose everything I\'ve rebuilt."',
    prompt: 'I am overwhelmed with anxiety about my future. Fear is telling me relapse is inevitable and God cannot sustain me.',
    color: '#3F522C'
  },
  {
    id: 'impostor-syndrome',
    badge: 'Identity',
    title: 'People-Pleasing & Impostor',
    lieLabel: 'Lie: "If people saw my real brokenness, they would leave."',
    prompt: 'I feel like a fraud in recovery. I smile on the outside while dying of self-hatred inside, terrified of being exposed.',
    color: '#70427D'
  }
];

export const StepGuideScreen: React.FC = () => {
  const { 
    recordStepCompleted, 
    bookmarkBreakthrough, 
    savedBreakthroughs, 
    setActiveTab, 
    setCrisisModalOpen,
    hapticsEnabled,
    soundEnabled,
    preferredVoiceId,
    setAudioPlaying,
    stopAudio
  } = useSacredStore();

  const [inputStruggle, setInputStruggle] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<StepResponse | null>(null);
  const [completedSubSteps, setCompletedSubSteps] = useState<{ [k: string]: boolean }>({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [speakingSection, setSpeakingSection] = useState<'scripture' | 'truth' | 'embrace' | 'practice' | 'all' | null>(null);

  useEffect(() => {
    return sanctuaryAudio.onSpeakingChange((speaking) => {
      if (!speaking) {
        setSpeakingSection(null);
      }
    });
  }, []);

  const handleSelectTrigger = (trigger: TriggerItem) => {
    setSelectedTrigger(trigger);
    setInputStruggle(trigger.defaultPrompt);
    if (hapticsEnabled) triggerHaptic('soft');
  };

  const handleRunQuickPack = (pack: QuickPackItem) => {
    setInputStruggle(pack.prompt);
    setSelectedTrigger({
      id: pack.id,
      name: pack.title,
      subtitle: pack.badge,
      color: pack.color,
      defaultPrompt: pack.prompt
    });
    handleRunStepMethod(pack.prompt);
  };

  const handleRunStepMethod = async (customPrompt?: string) => {
    const textToSubmit = customPrompt || inputStruggle.trim();
    if (!textToSubmit && !selectedTrigger) return;

    setIsLoading(true);
    if (hapticsEnabled) triggerHaptic('pulse');
    if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');

    try {
      const res = await fetch('/api/step-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          struggle: textToSubmit,
          trigger: selectedTrigger?.id || 'general',
        }),
      });

      const data: StepResponse = await res.json();

      if (data.isCrisis) {
        setCrisisModalOpen(true);
      }

      setActiveStep(data);
      setCompletedSubSteps({});
      setIsBookmarked(false);
      setSpeakingSection(null);
    } catch (err) {
      console.error('Failed to get step guidance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubStep = (stepKey: 'S' | 'T' | 'E' | 'P') => {
    const next = !completedSubSteps[stepKey];
    setCompletedSubSteps(prev => ({ ...prev, [stepKey]: next }));
    
    if (next) {
      if (hapticsEnabled) triggerHaptic('step');
      if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
    }

    // If completing the 'P' (Practice) step, count towards recovery steps
    if (stepKey === 'P' && next) {
      recordStepCompleted();
    }
  };

  const handleSpeakText = (text: string, section: 'scripture' | 'truth' | 'embrace' | 'practice' | 'all') => {
    if (speakingSection === section) {
      handleStopSpeaking();
      return;
    }

    sanctuaryAudio.cancelSpeech();
    if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
    setSpeakingSection(section);
    const title = `S.T.E.P. Guide: ${section.toUpperCase()}`;
    setAudioPlaying(true, title, `step-guide-${section}`);
    sanctuaryAudio.speakScripture(text, preferredVoiceId, title);
  };

  const handleStopSpeaking = () => {
    stopAudio();
    sanctuaryAudio.cancelSpeech();
    setSpeakingSection(null);
  };

  const handleSpeakFullStep = () => {
    if (!activeStep) return;
    if (speakingSection === 'all') {
      handleStopSpeaking();
      return;
    }
    const fullText = `Scripture: ${activeStep.scripture.reference}. ${activeStep.scripture.text}. Truth: ${activeStep.truth.statement}. Embrace: ${activeStep.embrace.affirmation}. Practice: ${activeStep.practice.microStep}. ${activeStep.closing}`;
    handleSpeakText(fullText, 'all');
  };

  const handleBookmark = () => {
    if (!activeStep) return;
    bookmarkBreakthrough({
      triggerCategory: selectedTrigger?.name || 'Daily Struggle',
      userStruggle: inputStruggle,
      scripture: activeStep.scripture,
      truth: activeStep.truth,
      embrace: activeStep.embrace,
      practice: activeStep.practice,
      closing: activeStep.closing,
    });
    setIsBookmarked(true);
  };

  const handleJournalThis = () => {
    setActiveTab('journal');
  };

  const handleReset = () => {
    sanctuaryAudio.cancelSpeech();
    setActiveStep(null);
    setInputStruggle('');
    setSelectedTrigger(null);
    setCompletedSubSteps({});
    setIsBookmarked(false);
    setSpeakingSection(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6D5F0] ring-4 ring-[#E6D5F0]/30" />
            <h1 className="font-serif text-xl sm:text-2xl text-[#2D2421] font-semibold">
              The Sacred S.T.E.P. Method™
            </h1>
          </div>
          <button
            onClick={() => setCrisisModalOpen(true)}
            className="text-xs px-2.5 py-1 rounded-md text-[#9C3E32] bg-[#FFD4C4]/40 hover:bg-[#FFD4C4]/60 transition-colors flex items-center gap-1 font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Crisis 988</span>
          </button>
        </div>
        <p className="font-sans text-xs sm:text-sm text-[#796B64] leading-relaxed">
          Dismantle lies, shame, and fear in real-time. Ground yourself in God’s truth: 
          <strong className="text-[#2D2421]"> (S)</strong>cripture · <strong className="text-[#2D2421]">(T)</strong>ruth · <strong className="text-[#2D2421]">(E)</strong>mbrace · <strong className="text-[#2D2421]">(P)</strong>ractice.
        </p>
      </div>

      {!activeStep ? (
        <>
          {/* Quick-Packs: Immediate Crossroads */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#796B64] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Crisis & Crossroads Quick-Packs (1-Tap S.T.E.P.)</span>
              </span>
              <span className="text-[10px] text-[#5A6E4B] bg-[#C8D5B9]/30 px-2 py-0.5 rounded-full font-medium">
                Instant Grounding
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TRIGGER_QUICK_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => handleRunQuickPack(pack)}
                  disabled={isLoading}
                  className="text-left p-3.5 rounded-2xl border border-[#E8DED6] bg-[#FFF9F5] hover:bg-[#FAF5F0] hover:border-[#2D2421] transition-all group shadow-2xs relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span 
                      className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: pack.color }}
                    >
                      {pack.badge}
                    </span>
                    <span className="text-[10px] font-semibold text-[#796B64] group-hover:text-[#2D2421] flex items-center gap-1">
                      <span>Begin</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-[#2D2421] mb-1">
                    {pack.title}
                  </h4>

                  <p className="text-[11px] text-[#796B64] italic line-clamp-1">
                    {pack.lieLabel}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-[#E8DED6]" />
            <span className="text-[11px] font-medium text-[#796B64]">or choose a personalized trigger</span>
            <div className="h-px flex-1 bg-[#E8DED6]" />
          </div>

          {/* Step 1: Select Immediate Trigger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#796B64]">
                1. What is threatening your peace right now?
              </label>
              <span className="text-xs text-[#796B64]">Tap a trigger</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {RECOVERY_TRIGGERS.map((trigger) => {
                const isSelected = selectedTrigger?.id === trigger.id;
                return (
                  <button
                    key={trigger.id}
                    onClick={() => handleSelectTrigger(trigger)}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-[#2D2421] bg-[#FFF9F5] shadow-sm ring-1 ring-[#2D2421]'
                        : 'border-[#E8DED6] bg-[#FFF9F5]/70 hover:bg-[#FFF9F5] hover:border-[#D5C7BD]'
                    }`}
                  >
                    <div 
                      className="w-2.5 h-2.5 rounded-full mb-2" 
                      style={{ backgroundColor: trigger.color }}
                    />
                    <div className="font-medium text-xs sm:text-sm text-[#2D2421] leading-tight">
                      {trigger.name}
                    </div>
                    <div className="text-[11px] text-[#796B64] mt-0.5">
                      {trigger.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Share Struggle Details */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#796B64] flex items-center justify-between">
              <span>2. Express what is pressing on your heart</span>
              <span className="text-[11px] font-normal normal-case text-[#796B64]">Private & confidential</span>
            </label>
            <div className="relative">
              <textarea
                value={inputStruggle}
                onChange={(e) => setInputStruggle(e.target.value)}
                placeholder="e.g., I was triggered after a hard phone call and the lie is telling me I might as well give up..."
                rows={4}
                className="w-full p-4 rounded-xl bg-[#FFF9F5] border border-[#E8DED6] text-sm text-[#2D2421] placeholder-[#A89B94] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0] focus:border-transparent transition-all resize-none shadow-sm"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            onClick={() => handleRunStepMethod()}
            disabled={isLoading || (!inputStruggle.trim() && !selectedTrigger)}
            className="w-full py-3.5 px-6 rounded-xl bg-[#2D2421] text-[#FFF9F5] font-medium text-sm hover:bg-[#4A3E39] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>The Guide is seeking Scripture & Truth...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#FFD4C4]" />
                <span>Walk Through S.T.E.P. Method</span>
              </>
            )}
          </button>
        </>
      ) : (
        /* Active S.T.E.P. Response View */
        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
          {/* Top Status & Controls */}
          <div className="flex items-center justify-between text-xs text-[#796B64] pb-1 border-b border-[#E8DED6]">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#2D2421]">Spiritual Anchorage</span>
              <span>·</span>
              <span>{selectedTrigger?.name || 'Guided Step'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className="hover:text-[#2D2421] transition-colors flex items-center gap-1"
                title="Save Breakthrough"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#C8D5B9]" />
                    <span className="text-[#2D2421] font-medium">Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
              <span>·</span>
              <button
                onClick={handleReset}
                className="hover:text-[#2D2421] transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Step</span>
              </button>
            </div>
          </div>

          {/* Interactive Voice Companion Bar */}
          <div className="bg-gradient-to-r from-[#FFF9F5] via-[#FAF5F0] to-[#E6D5F0]/30 border border-[#E8DED6] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2D2421] text-[#FFF9F5] flex items-center justify-center">
                {speakingSection ? (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-[#FFD4C4] h-full animate-pulse" />
                    <span className="w-0.5 bg-[#FFD4C4] h-2 animate-bounce" />
                    <span className="w-0.5 bg-[#FFD4C4] h-3.5 animate-pulse" />
                  </div>
                ) : (
                  <Volume2 className="w-4 h-4 text-[#FFD4C4]" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#796B64] block">
                  Interactive Audio Companion
                </span>
                <span className="font-serif text-xs font-bold text-[#2D2421]">
                  {speakingSection
                    ? `Speaking ${speakingSection === 'all' ? 'Entire S.T.E.P.' : speakingSection.toUpperCase()}...`
                    : 'Listen to the Guide’s Gentle Voice'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakFullStep}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                  speakingSection === 'all'
                    ? 'bg-[#8B261D] text-white'
                    : 'bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39]'
                }`}
              >
                {speakingSection === 'all' ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current text-[#FFD4C4]" />
                    <span>Listen All</span>
                  </>
                )}
              </button>

              {speakingSection && (
                <button
                  onClick={handleStopSpeaking}
                  className="py-1.5 px-2.5 rounded-xl bg-white border border-[#E8DED6] text-xs font-medium text-[#796B64] hover:text-[#2D2421]"
                  title="Silence voice"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* S.T.E.P. 4-Part Interactive Card */}
          <div className="space-y-4">
            {/* (S) Scripture */}
            <div 
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                completedSubSteps['S'] 
                  ? 'bg-[#FAF5F0] border-[#C8D5B9]/60' 
                  : 'bg-[#FFF9F5] border-[#E8DED6] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFD4C4]/60 text-[#2D2421] text-xs font-bold flex items-center justify-center">
                    S
                  </span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#796B64]">
                    Scripture Anchor
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeakText(`${activeStep.scripture.reference}. ${activeStep.scripture.text}`, 'scripture')}
                    className={`p-1.5 rounded-md transition-colors ${
                      speakingSection === 'scripture'
                        ? 'bg-[#FFD4C4] text-[#2D2421]'
                        : 'text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB]'
                    }`}
                    title={speakingSection === 'scripture' ? 'Pause voice' : 'Listen to scripture'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSubStep('S')}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors ${
                      completedSubSteps['S'] 
                        ? 'bg-[#C8D5B9]/40 text-[#3F522C] font-medium' 
                        : 'bg-[#F5EFEB] text-[#796B64] hover:text-[#2D2421]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedSubSteps['S'] ? 'Anchored' : 'Mark Anchored'}</span>
                  </button>
                </div>
              </div>

              <blockquote className="font-scripture italic text-lg sm:text-xl text-[#2D2421] leading-relaxed mb-2 pl-3 border-l-2 border-[#FFD4C4]">
                "{activeStep.scripture.text}"
              </blockquote>
              <div className="text-right">
                <span className="font-sans text-xs tracking-wider uppercase font-semibold text-[#796B64]">
                  {activeStep.scripture.reference}
                </span>
              </div>
            </div>

            {/* (T) Truth */}
            <div 
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                completedSubSteps['T'] 
                  ? 'bg-[#FAF5F0] border-[#C8D5B9]/60' 
                  : 'bg-[#FFF9F5] border-[#E8DED6] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E6D5F0]/60 text-[#2D2421] text-xs font-bold flex items-center justify-center">
                    T
                  </span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#796B64]">
                    Dismantling Truth
                  </span>
                </div>
                <button
                  onClick={() => toggleSubStep('T')}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors ${
                    completedSubSteps['T'] 
                      ? 'bg-[#C8D5B9]/40 text-[#3F522C] font-medium' 
                      : 'bg-[#F5EFEB] text-[#796B64] hover:text-[#2D2421]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedSubSteps['T'] ? 'Lie Dismantled' : 'Dismantle Lie'}</span>
                </button>
              </div>

              {/* The Lie being dismantled */}
              <div className="mb-2.5 text-xs text-[#9C3E32] flex items-start gap-1.5 bg-[#FFD4C4]/20 p-2.5 rounded-lg">
                <span className="font-semibold uppercase tracking-wider text-[10px]">The Lie:</span>
                <span className="italic">"{activeStep.truth.lie}"</span>
              </div>

              {/* The Single Grounding Truth */}
              <div className="text-sm sm:text-base text-[#2D2421] font-medium leading-relaxed bg-[#F5EFEB]/50 p-3 rounded-lg border border-[#E8DED6]">
                {activeStep.truth.statement}
              </div>
            </div>

            {/* (E) Embrace */}
            <div 
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                completedSubSteps['E'] 
                  ? 'bg-[#FAF5F0] border-[#C8D5B9]/60' 
                  : 'bg-[#FFF9F5] border-[#E8DED6] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#F4E4C1]/80 text-[#2D2421] text-xs font-bold flex items-center justify-center">
                    E
                  </span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#796B64]">
                    Embrace Affirmation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeakText(activeStep.embrace.affirmation, 'embrace')}
                    className={`p-1.5 rounded-md transition-colors ${
                      speakingSection === 'embrace'
                        ? 'bg-[#F4E4C1] text-[#2D2421]'
                        : 'text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB]'
                    }`}
                    title={speakingSection === 'embrace' ? 'Pause voice' : 'Speak affirmation aloud'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleSubStep('E')}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors ${
                      completedSubSteps['E'] 
                        ? 'bg-[#C8D5B9]/40 text-[#3F522C] font-medium' 
                        : 'bg-[#F5EFEB] text-[#796B64] hover:text-[#2D2421]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedSubSteps['E'] ? 'Spoken Aloud' : 'Speak Aloud'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF9F5] to-[#F5EFEB] border border-[#E8DED6] text-center">
                <p className="font-serif italic text-base sm:text-lg text-[#2D2421] font-medium">
                  "{activeStep.embrace.affirmation}"
                </p>
                <span className="block text-[11px] text-[#796B64] mt-1.5">
                  Say this out loud. Let your ears hear God’s truth from your own voice.
                </span>
              </div>
            </div>

            {/* (P) Practice */}
            <div 
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                completedSubSteps['P'] 
                  ? 'bg-[#FAF5F0] border-[#C8D5B9]/80 shadow-sm ring-1 ring-[#C8D5B9]' 
                  : 'bg-[#FFF9F5] border-[#E8DED6] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8D5B9] text-[#2D2421] text-xs font-bold flex items-center justify-center">
                    P
                  </span>
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#796B64]">
                    Micro-Practice Right Now
                  </span>
                </div>
                <button
                  onClick={() => toggleSubStep('P')}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                    completedSubSteps['P'] 
                      ? 'bg-[#C8D5B9] text-[#243317]' 
                      : 'bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedSubSteps['P'] ? 'Step Taken ✓' : 'Take This Step'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-sm text-[#2D2421] leading-relaxed">
                <strong>Your immediate action:</strong> {activeStep.practice.microStep}
              </div>
            </div>
          </div>

          {/* Guide Warm Sign-off */}
          <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#E8DED6] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E6D5F0]/60 flex items-center justify-center text-xs font-serif font-bold text-[#2D2421]">
                G
              </div>
              <div>
                <span className="font-serif italic text-sm text-[#2D2421] block">
                  "{activeStep.closing}"
                </span>
                <span className="text-[11px] text-[#796B64]">The Guide · A Path to Recovery, A Life in Grace</span>
              </div>
            </div>
            
            <button
              onClick={handleJournalThis}
              className="text-xs px-3 py-2 rounded-lg bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center gap-1.5 font-medium shrink-0"
            >
              <PenLine className="w-3.5 h-3.5 text-[#796B64]" />
              <span>Write in Journal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
