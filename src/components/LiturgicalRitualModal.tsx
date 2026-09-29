/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — Sacred Morning & Evening Rituals (Liturgical Rhythm)
 * Morning "Dawn Offering" & Evening "Grace Review" (Christian Examen) with Gentle Reminders
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sunrise, 
  Moon, 
  Bell, 
  Check, 
  Sparkles, 
  Heart, 
  Volume2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw,
  Sliders,
  Send,
  Feather
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface LiturgicalRitualModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'morning' | 'evening' | 'settings';
}

const COMMON_LIES = [
  { lie: "I have to be perfect today or I am a failure.", truth: "God's grace is perfected in my weakness (2 Cor 12:9).", affirmation: "I am covered in grace, not bound by perfection." },
  { lie: "Nobody understands the depth of my struggle.", truth: "The Lord is near to the brokenhearted (Psalm 34:18).", affirmation: "I am seen, known, and loved by God." },
  { lie: "I must control every outcome to be safe.", truth: "Cast all your anxiety on Him, for He cares for you (1 Peter 5:7).", affirmation: "I am safe when I surrender control to Christ." },
  { lie: "My past mistakes define who I will always be.", truth: "Anyone in Christ is a new creation; the old has passed away (2 Cor 5:17).", affirmation: "I am a new creation walking in redemption." }
];

export const LiturgicalRitualModal: React.FC<LiturgicalRitualModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'morning'
}) => {
  const {
    todaysAnchor,
    getTodaysRitual,
    saveMorningRitual,
    saveEveningRitual,
    notificationSchedule,
    updateNotificationSchedule,
    testTriggerGentleBell,
    soundEnabled,
    hapticsEnabled
  } = useSacredStore();

  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'settings'>(initialTab);
  const todaysRitual = getTodaysRitual();

  // Morning "Dawn Offering" state
  const [morningStep, setMorningStep] = useState<1 | 2 | 3 | 4>(1);
  const [morningIntention, setMorningIntention] = useState(todaysRitual.morningIntention || 'Serenity, honesty, and walking one step at a time in Christ.');
  const [selectedLieIndex, setSelectedLieIndex] = useState(0);
  const [customLie, setCustomLie] = useState(todaysRitual.morningLieToSurrender || '');
  const [customTruth, setCustomTruth] = useState(todaysRitual.morningTruthToEmbrace || '');
  const [morningSaved, setMorningSaved] = useState(todaysRitual.morningCompleted);

  // Evening "Grace Review" (Christian Examen) state
  const [eveningStep, setEveningStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [eveningGodPresence, setEveningGodPresence] = useState(todaysRitual.eveningGodPresence || '');
  const [eveningGratitude, setEveningGratitude] = useState(todaysRitual.eveningGratitude || '');
  const [eveningReviewConfession, setEveningReviewConfession] = useState(todaysRitual.eveningReviewConfession || '');
  const [eveningPeaceBenediction, setEveningPeaceBenediction] = useState(todaysRitual.eveningPeaceBenediction || 'I place all unresolved burdens into Your hands. In peace I will lie down and sleep.');
  const [eveningSaved, setEveningSaved] = useState(todaysRitual.eveningCompleted);

  // Notification settings state
  const [morningTime, setMorningTime] = useState(notificationSchedule.morningTime);
  const [morningPrompt, setMorningPrompt] = useState(notificationSchedule.morningPrompt);
  const [morningEnabled, setMorningEnabled] = useState(notificationSchedule.morningEnabled);
  const [eveningTime, setEveningTime] = useState(notificationSchedule.eveningTime);
  const [eveningPrompt, setEveningPrompt] = useState(notificationSchedule.eveningPrompt);
  const [eveningEnabled, setEveningEnabled] = useState(notificationSchedule.eveningEnabled);
  const [soundChime, setSoundChime] = useState(notificationSchedule.soundChimeEnabled);
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [testSentMsg, setTestSentMsg] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  // Handle Morning Save
  const handleCompleteMorning = () => {
    const lie = customLie.trim() || COMMON_LIES[selectedLieIndex].lie;
    const truth = customTruth.trim() || COMMON_LIES[selectedLieIndex].truth;
    saveMorningRitual(morningIntention, lie, truth);
    setMorningSaved(true);
    setMorningStep(4);
    if (soundEnabled) sanctuaryAudio.playGraceChime('breathIn');
  };

  // Handle Evening Save
  const handleCompleteEvening = () => {
    saveEveningRitual(eveningGodPresence, eveningGratitude, eveningReviewConfession, eveningPeaceBenediction);
    setEveningSaved(true);
    setEveningStep(5);
    if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
  };

  // Handle Notification Permission
  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionStatus(perm);
        updateNotificationSchedule({ pwaPermissionGranted: perm === 'granted' });
        if (perm === 'granted') {
          testTriggerGentleBell('morning');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSaveSettings = () => {
    updateNotificationSchedule({
      morningEnabled,
      morningTime,
      morningPrompt,
      eveningEnabled,
      eveningTime,
      eveningPrompt,
      soundChimeEnabled: soundChime
    });
    setTestSentMsg('Notification schedule saved.');
    setTimeout(() => setTestSentMsg(null), 2500);
  };

  const handleTestNotification = (type: 'morning' | 'evening') => {
    testTriggerGentleBell(type);
    setTestSentMsg(`Gentle ${type === 'morning' ? 'Morning' : 'Evening'} chime & notification triggered.`);
    setTimeout(() => setTestSentMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-[36px] max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#2D2421]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DED6] bg-[#FAF5F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD4C4] via-[#F4E4C1] to-[#C8D5B9] flex items-center justify-center text-[#2D2421] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#7A5B0B]" />
            </span>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D2421] leading-tight">
                Liturgical Rhythm
              </h3>
              <p className="text-[11px] text-[#796B64]">
                Sacred Morning "Dawn Offering" & Evening "Grace Review"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#E8DED6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liturgical Tab Selector */}
        <div className="p-2.5 bg-[#FAF5F0] border-b border-[#E8DED6] flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('morning')}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'morning'
                ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                : 'bg-white border border-[#E8DED6] text-[#796B64] hover:bg-[#F5EFEB]'
            }`}
          >
            <Sunrise className="w-3.5 h-3.5 text-[#FFD4C4]" />
            <span>Dawn Offering</span>
            {morningSaved && <Check className="w-3 h-3 text-[#C8D5B9]" />}
          </button>

          <button
            onClick={() => setActiveTab('evening')}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'evening'
                ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                : 'bg-white border border-[#E8DED6] text-[#796B64] hover:bg-[#F5EFEB]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#C4A9D8]" />
            <span>Evening Examen</span>
            {eveningSaved && <Check className="w-3 h-3 text-[#C8D5B9]" />}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'settings'
                ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                : 'bg-white border border-[#E8DED6] text-[#796B64] hover:bg-[#F5EFEB]'
            }`}
            title="Scheduled Gentle Reminders"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reminders</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'morning' ? (
            /* ================= 1. MORNING DAWN OFFERING ================= */
            <div className="space-y-4">
              {/* Stepper Header */}
              <div className="flex items-center justify-between text-xs text-[#796B64] border-b border-[#E8DED6] pb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#7A5B0B]">
                  Morning Step {morningStep} of 4
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map(s => (
                    <span 
                      key={s} 
                      className={`w-2 h-2 rounded-full ${morningStep === s ? 'bg-[#2D2421]' : 'bg-[#E8DED6]'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Step 1: Spiritual Intention */}
              {morningStep === 1 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E4B] bg-[#C8D5B9]/40 px-2 py-0.5 rounded-full">
                      Movement 1 · Setting Intention
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#2D2421]">
                      Dedicate Your Heart Before the Day Rushes In
                    </h4>
                    <p className="text-xs text-[#5C4D46] leading-relaxed">
                      In active addiction or anxiety, mornings began with dread or frantic coping. Today begins in sovereign stillness. What is your holy intention for this day?
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#2D2421]">
                      Today's Consecrated Intention:
                    </label>
                    <textarea
                      value={morningIntention}
                      onChange={(e) => setMorningIntention(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E8DED6] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D2421]/20 resize-none text-[#2D2421]"
                      placeholder="e.g. To walk with patience, respond with grace instead of defensiveness, and remember I am clean in Christ."
                    />
                  </div>

                  <button
                    onClick={() => {
                      setMorningStep(2);
                      if (hapticsEnabled) triggerHaptic('soft');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-[#2D2421] text-white hover:bg-[#4A3E39] text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <span>Receive Daily Anchor Scripture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Step 2: Daily Anchor Scripture */}
              {morningStep === 2 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-2 py-0.5 rounded-full border border-[#E5C158]/40">
                      Movement 2 · Anchor Scripture
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#2D2421]">
                      {todaysAnchor.verse.reference}
                    </h4>
                    <blockquote className="font-scripture italic text-sm text-[#2D2421] leading-relaxed border-l-2 border-[#D4AF37] pl-3 py-1">
                      "{todaysAnchor.verse.text}"
                    </blockquote>
                  </div>

                  <div className="p-3.5 bg-[#FAF5F0] rounded-2xl border border-[#E8DED6] text-xs text-[#5C4D46] leading-relaxed">
                    <strong className="text-[#2D2421] block mb-1">Morning Reflection:</strong>
                    {todaysAnchor.prayer.content.slice(0, 160)}...
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMorningStep(1)}
                      className="py-2.5 px-4 rounded-2xl border border-[#E8DED6] bg-white text-xs font-semibold text-[#796B64]"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setMorningStep(3);
                        if (hapticsEnabled) triggerHaptic('soft');
                      }}
                      className="flex-1 py-2.5 rounded-2xl bg-[#2D2421] text-white hover:bg-[#4A3E39] text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                      <span>Surrender One Lie for Today</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Identify One Lie to Surrender */}
              {morningStep === 3 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B261D] bg-[#FFCAD4]/40 px-2 py-0.5 rounded-full">
                      Movement 3 · Dismantle the Lie
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#2D2421]">
                      Surrender One Specific Falsehood
                    </h4>
                    <p className="text-xs text-[#5C4D46] leading-relaxed">
                      Select or write the lie your ego or old triggers are whispering this morning. We replace it right now with God's unshakable truth.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {COMMON_LIES.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedLieIndex(idx);
                          setCustomLie(item.lie);
                          setCustomTruth(item.truth);
                        }}
                        className={`w-full text-left p-3 rounded-2xl border transition-all text-xs ${
                          selectedLieIndex === idx && !customLie
                            ? 'bg-[#2D2421] text-white border-[#2D2421]'
                            : 'bg-white border-[#E8DED6] text-[#4A3E39] hover:bg-[#FAF5F0]'
                        }`}
                      >
                        <span className="block font-semibold">"{item.lie}"</span>
                        <span className="block text-[11px] opacity-80 mt-0.5 italic">
                          → Truth: {item.truth}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setMorningStep(2)}
                      className="py-2.5 px-4 rounded-2xl border border-[#E8DED6] bg-white text-xs font-semibold text-[#796B64]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCompleteMorning}
                      className="flex-1 py-2.5 rounded-2xl bg-[#2D2421] text-white hover:bg-[#4A3E39] text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                      <span>Seal Dawn Offering in Grace</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Consecration Seal */}
              {morningStep === 4 && (
                <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#C8D5B9]/20 border border-[#C8D5B9] rounded-3xl p-5 text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <span className="w-12 h-12 rounded-full bg-[#C8D5B9]/60 mx-auto flex items-center justify-center text-[#2A3B1F] shadow-xs">
                    <Check className="w-6 h-6" />
                  </span>

                  <h4 className="font-serif text-lg font-bold text-[#2D2421]">
                    Dawn Offering Consecrated
                  </h4>

                  <p className="text-xs text-[#5C4D46] leading-relaxed max-w-sm mx-auto">
                    Your intention is sealed. The lie has been named and dismantled. You walk into this day under the unfailing banner of God's grace.
                  </p>

                  <div className="p-3 rounded-2xl bg-white border border-[#E8DED6] text-xs text-[#2D2421] font-medium text-left">
                    <p className="text-[10px] uppercase font-bold text-[#796B64] mb-0.5">Surrendered Lie:</p>
                    <p className="italic text-[#8B261D] mb-2">"{customLie || COMMON_LIES[selectedLieIndex].lie}"</p>
                    <p className="text-[10px] uppercase font-bold text-[#796B64] mb-0.5">Anchored Truth:</p>
                    <p className="text-[#5A6E4B] font-semibold">{customTruth || COMMON_LIES[selectedLieIndex].truth}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setMorningStep(1)}
                      className="py-2 px-3 rounded-xl border border-[#E8DED6] bg-white text-xs text-[#796B64] flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Edit Offering</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="py-2 px-5 rounded-xl bg-[#2D2421] text-white text-xs font-semibold"
                    >
                      Step into the Day
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'evening' ? (
            /* ================= 2. EVENING GRACE REVIEW (EXAMEN) ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#796B64] border-b border-[#E8DED6] pb-2">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#543864]">
                  Examen Movement {eveningStep} of 5 · 3-Minute Grace Review
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span 
                      key={s} 
                      className={`w-2 h-2 rounded-full ${eveningStep === s ? 'bg-[#543864]' : 'bg-[#E8DED6]'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Examen 1: Acknowledge God's Presence */}
              {eveningStep === 1 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#543864] bg-[#E6D5F0]/40 px-2 py-0.5 rounded-full">
                      Stage 1 · Stillness & Presence
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#2D2421]">
                      Rest Under God's Loving Gaze
                    </h4>
                    <p className="text-xs text-[#5C4D46] leading-relaxed">
                      Take a deep breath and release the tension in your jaw and shoulders. God has been with you through every minute of this day—not as a harsh judge, but as an affectionate shepherd.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#2D2421]">
                      Where did you sense God's quiet presence today?
                    </label>
                    <textarea
                      value={eveningGodPresence}
                      onChange={(e) => setEveningGodPresence(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E8DED6] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D2421]/20 resize-none text-[#2D2421]"
                      placeholder="e.g. In a quiet moment during lunch, a kind text from my sponsor, or a moment I paused before reacting."
                    />
                  </div>

                  <button
                    onClick={() => {
                      setEveningStep(2);
                      if (hapticsEnabled) triggerHaptic('soft');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-[#2D2421] text-white hover:bg-[#4A3E39] text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <span>Next: Gratitude in Recovery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Examen 2: Gratitude */}
              {eveningStep === 2 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E4B] bg-[#C8D5B9]/40 px-2 py-0.5 rounded-full">
                      Stage 2 · Gratitude
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#2D2421]">
                      Notice Small Victories and Gifts
                    </h4>
                    <p className="text-xs text-[#5C4D46] leading-relaxed">
                      Gratitude rewires the recovery brain from scarcity and craving to abundance and contentment. What 2 or 3 things are you grateful for tonight?
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#2D2421]">
                      Today's Gratitudes:
                    </label>
                    <textarea
                      value={eveningGratitude}
                      onChange={(e) => setEveningGratitude(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E8DED6] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D2421]/20 resize-none text-[#2D2421]"
                      placeholder="e.g. 1. Clean breath in my lungs. 2. A safe roof over my head. 3. Overcoming an urge to isolate."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEveningStep(1)}
                      className="py-2.5 px-4 rounded-2xl border border-[#E8DED6] bg-white text-xs font-semibold text-[#796B64]"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setEveningStep(3);
                        if (hapticsEnabled) triggerHaptic('soft');
                      }}
                      className="flex-1 py-2.5 rounded-2xl bg-[#2D2421] text-white hover:bg-[#4A3E39] text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                      <span>Review Without Shame</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Examen 3: Review without Shame */}
              {eveningStep === 3 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B261D] bg-[#FFCAD4]/40 px-2 py-0.5 rounded-full">
                      Stage 3 · Honest Review (Romans 8:1)
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#2D2421]">
                      Inspect Stumbles Without Self-Condemnation
                    </h4>
                    <p className="text-xs text-[#5C4D46] leading-relaxed">
                      "There is now no condemnation for those who are in Christ Jesus." Look back gently: Did resentment, irritation, or an old craving trigger flare up? Speak it honestly so it cannot hide in darkness.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#2D2421]">
                      What needs honest release tonight?
                    </label>
                    <textarea
                      value={eveningReviewConfession}
                      onChange={(e) => setEveningReviewConfession(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E8DED6] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D2421]/20 resize-none text-[#2D2421]"
                      placeholder="e.g. I snapped at someone when stressed, or I felt a sudden surge of old loneliness. Lord, I lay this down."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEveningStep(2)}
                      className="py-2.5 px-4 rounded-2xl border border-[#E8DED6] bg-white text-xs font-semibold text-[#796B64]"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setEveningStep(4);
                        if (hapticsEnabled) triggerHaptic('soft');
                      }}
                      className="flex-1 py-2.5 rounded-2xl bg-[#2D2421] text-white hover:bg-[#4A3E39] text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                      <span>Receive Forgiveness & Rest</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Examen 4: Benediction Prayer */}
              {eveningStep === 4 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-2 py-0.5 rounded-full border border-[#E5C158]/40">
                      Stage 4 · Night Benediction
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#2D2421]">
                      Psalm 4:8 · Resting in Safety
                    </h4>
                    <blockquote className="font-scripture italic text-sm text-[#2D2421] leading-relaxed border-l-2 border-[#543864] pl-3 py-1">
                      "In peace I will both lie down and sleep; for You alone, O Lord, make me dwell in safety."
                    </blockquote>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#2D2421]">
                      Your Night Prayer of Surrender:
                    </label>
                    <textarea
                      value={eveningPeaceBenediction}
                      onChange={(e) => setEveningPeaceBenediction(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E8DED6] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D2421]/20 resize-none text-[#2D2421]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEveningStep(3)}
                      className="py-2.5 px-4 rounded-2xl border border-[#E8DED6] bg-white text-xs font-semibold text-[#796B64]"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCompleteEvening}
                      className="flex-1 py-2.5 rounded-2xl bg-[#2D2421] text-white hover:bg-[#4A3E39] text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                      <span>Complete Evening Examen</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Examen 5: Rest in Peace Complete */}
              {eveningStep === 5 && (
                <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#E6D5F0]/30 border border-[#E6D5F0] rounded-3xl p-5 text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <span className="w-12 h-12 rounded-full bg-[#E6D5F0]/80 mx-auto flex items-center justify-center text-[#3B2544] shadow-xs">
                    <Moon className="w-6 h-6 text-[#543864]" />
                  </span>

                  <h4 className="font-serif text-lg font-bold text-[#2D2421]">
                    The Day is Placed in God's Hands
                  </h4>

                  <p className="text-xs text-[#5C4D46] leading-relaxed max-w-sm mx-auto">
                    You weathered another day in sovereign recovery. No guilt remains. Sleep peacefully under the guardian love of Christ.
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEveningStep(1)}
                      className="py-2 px-3 rounded-xl border border-[#E8DED6] bg-white text-xs text-[#796B64] flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Review Entry</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="py-2 px-5 rounded-xl bg-[#2D2421] text-white text-xs font-semibold"
                    >
                      Rest in Peace
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================= 3. SCHEDULED GENTLE REMINDERS / PWA ================= */
            <div className="space-y-4">
              <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#FFF2D6] text-[#7A5B0B]">
                      <Bell className="w-4 h-4" />
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                      PWA Notification & Bell Settings
                    </h4>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    permissionStatus === 'granted'
                      ? 'bg-[#C8D5B9]/40 text-[#3C6432]'
                      : 'bg-[#FFCAD4]/40 text-[#8B261D]'
                  }`}>
                    {permissionStatus === 'granted' ? 'Notifications Active' : 'Permission Needed'}
                  </span>
                </div>

                <p className="text-xs text-[#5C4D46] leading-relaxed">
                  Gentle sacred chimes and spiritual invitations to anchor your mornings and ease your evenings into peaceful sleep.
                </p>

                {permissionStatus !== 'granted' && (
                  <button
                    onClick={handleRequestPermission}
                    className="w-full py-2 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs mt-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8D5B9]" />
                    <span>Enable System Notifications</span>
                  </button>
                )}
              </div>

              {/* Morning Reminder Configuration */}
              <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-[#E5C158]" />
                    <span className="font-serif text-xs font-bold text-[#2D2421]">
                      Morning "Dawn Offering" Reminder
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={morningEnabled}
                    onChange={(e) => setMorningEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#2D2421] rounded"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-[10px] text-[#796B64] font-semibold block mb-1">Time</label>
                    <input
                      type="time"
                      value={morningTime}
                      onChange={(e) => setMorningTime(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-[#E8DED6] bg-[#FAF5F0]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-[#796B64] font-semibold block mb-1">Gentle Morning Prompt</label>
                    <input
                      type="text"
                      value={morningPrompt}
                      onChange={(e) => setMorningPrompt(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-[#E8DED6] bg-[#FAF5F0]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleTestNotification('morning')}
                  className="text-xs text-[#7A5B0B] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Test Gentle Morning Bell & Prompt</span>
                </button>
              </div>

              {/* Evening Examen Configuration */}
              <div className="bg-white border border-[#E8DED6] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#543864]" />
                    <span className="font-serif text-xs font-bold text-[#2D2421]">
                      Evening "Grace Review" Reminder
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={eveningEnabled}
                    onChange={(e) => setEveningEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#2D2421] rounded"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-[10px] text-[#796B64] font-semibold block mb-1">Time</label>
                    <input
                      type="time"
                      value={eveningTime}
                      onChange={(e) => setEveningTime(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-[#E8DED6] bg-[#FAF5F0]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-[#796B64] font-semibold block mb-1">Gentle Evening Prompt</label>
                    <input
                      type="text"
                      value={eveningPrompt}
                      onChange={(e) => setEveningPrompt(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-[#E8DED6] bg-[#FAF5F0]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleTestNotification('evening')}
                  className="text-xs text-[#543864] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Test Gentle Evening Chime & Prompt</span>
                </button>
              </div>

              {/* Sound Bell Chime Toggle */}
              <div className="p-3 bg-[#FAF5F0] rounded-2xl border border-[#E8DED6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#796B64]" />
                  <span className="text-xs font-semibold text-[#2D2421]">
                    Play Sacred Bell Chime With Reminder
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={soundChime}
                  onChange={(e) => setSoundChime(e.target.checked)}
                  className="w-4 h-4 accent-[#2D2421] rounded"
                />
              </div>

              {testSentMsg && (
                <div className="p-2.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                  <span>{testSentMsg}</span>
                </div>
              )}

              <button
                onClick={handleSaveSettings}
                className="w-full py-2.5 rounded-2xl bg-[#2D2421] text-white hover:bg-[#4A3E39] text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                <span>Save Reminder Preferences</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 border-t border-[#E8DED6] bg-[#FAF5F0] text-center text-xs text-[#796B64] shrink-0">
          <p className="font-serif italic text-[11px]">
            "A Path to Recovery, A Life in Grace" · C. Lamont Patrick
          </p>
        </div>
      </div>
    </div>
  );
};
