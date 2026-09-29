/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — Interactive 3D Recovery Coin Vault & Milestone Reflection
 */

import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  Sparkles, 
  Award, 
  Lock, 
  Check, 
  Share2, 
  Heart, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Save,
  Feather
} from 'lucide-react';
import { SACRED_MILESTONES, MilestoneItem } from '../data/milestoneData';
import { useSacredStore } from '../store/useSacredStore';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface RecoveryCoinVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysInGrace: number;
  initialMilestoneId?: string;
  onOpenShare?: (milestone: MilestoneItem) => void;
}

export const RecoveryCoinVaultModal: React.FC<RecoveryCoinVaultModalProps> = ({
  isOpen,
  onClose,
  daysInGrace,
  initialMilestoneId,
  onOpenShare
}) => {
  const { 
    milestoneReflections, 
    saveMilestoneReflection, 
    cleanStartDate,
    hapticsEnabled, 
    soundEnabled 
  } = useSacredStore();

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialMilestoneId) {
      const idx = SACRED_MILESTONES.findIndex(m => m.id === initialMilestoneId);
      if (idx !== -1) return idx;
    }
    // Default to the highest achieved milestone or the first
    const achieved = SACRED_MILESTONES.filter(m => daysInGrace >= m.days);
    return achieved.length > 0 ? achieved.length - 1 : 0;
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentMilestone = SACRED_MILESTONES[currentIndex];
  const isUnlocked = daysInGrace >= currentMilestone.days;

  // Load existing reflection if available
  React.useEffect(() => {
    setIsFlipped(false);
    const existing = milestoneReflections[currentMilestone.id];
    setGratitudeText(existing?.gratitude || '');
    setSaveSuccess(false);
  }, [currentIndex, currentMilestone.id, milestoneReflections]);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (hapticsEnabled) triggerHaptic('soft');
    if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
    setIsFlipped(!isFlipped);
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeText.trim()) return;

    saveMilestoneReflection(currentMilestone.id, {
      gratitude: gratitudeText.trim()
    });

    if (hapticsEnabled) triggerHaptic('step');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const getRomanNumeral = (days: number) => {
    if (days === 1) return 'I';
    if (days === 7) return 'VII';
    if (days === 14) return 'XIV';
    if (days === 30) return 'XXX';
    if (days === 60) return 'LX';
    if (days === 90) return 'XC';
    if (days === 180) return 'VI MO';
    if (days === 270) return 'IX MO';
    if (days === 365) return 'I YR';
    return `${days}D`;
  };

  const getCoinGradients = (days: number) => {
    if (days <= 7) {
      // Warm Copper / Rose Bronze
      return {
        front: 'from-[#D99B82] via-[#E8B4A2] to-[#B37059]',
        rim: 'border-[#B37059]',
        innerRing: 'border-[#8F5542]',
        accent: 'text-[#5C2E20]',
        bezel: 'shadow-[0_12px_36px_rgba(179,112,89,0.35)]'
      };
    } else if (days <= 60) {
      // Classic Silver / Antiqued Steel
      return {
        front: 'from-[#E0E2E5] via-[#F4F5F7] to-[#B8BCC2]',
        rim: 'border-[#9FA4AB]',
        innerRing: 'border-[#7E838B]',
        accent: 'text-[#3D4148]',
        bezel: 'shadow-[0_12px_36px_rgba(159,164,171,0.35)]'
      };
    } else if (days <= 270) {
      // Polished Golden Brass
      return {
        front: 'from-[#F5D77F] via-[#FFF1BD] to-[#C99C3B]',
        rim: 'border-[#B88628]',
        innerRing: 'border-[#94681A]',
        accent: 'text-[#61420B]',
        bezel: 'shadow-[0_12px_36px_rgba(201,156,59,0.38)]'
      };
    } else {
      // Radiant Sovereign Gold
      return {
        front: 'from-[#FFD966] via-[#FFF4D0] to-[#D4A017]',
        rim: 'border-[#C48C08]',
        innerRing: 'border-[#8C6202]',
        accent: 'text-[#573C00]',
        bezel: 'shadow-[0_16px_44px_rgba(212,160,23,0.45)]'
      };
    }
  };

  const coinTheme = getCoinGradients(currentMilestone.days);

  // Compute achievement date based on cleanStartDate
  const achievedDateStr = new Date(
    new Date(cleanStartDate).getTime() + currentMilestone.days * 24 * 60 * 60 * 1000
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-[36px] max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-center relative">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8DED6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#E5C158]/20 text-[#7A5B0B]">
              <Sparkles className="w-4 h-4 text-[#7A5B0B]" />
            </span>
            <div className="text-left">
              <h3 className="font-serif text-base font-bold text-[#2D2421]">
                Sacred Recovery Coin Vault
              </h3>
              <p className="text-[11px] text-[#796B64]">
                Interactive 3D Fellowship Medallions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Milestone Selector Ribbon */}
        <div className="bg-[#FAF5F0] border-b border-[#E8DED6] py-2 px-3 overflow-x-auto no-scrollbar flex items-center gap-2 justify-start sm:justify-center">
          {SACRED_MILESTONES.map((m, idx) => {
            const achieved = daysInGrace >= m.days;
            const isSelected = idx === currentIndex;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  if (hapticsEnabled) triggerHaptic('soft');
                }}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                    : achieved
                    ? 'bg-white border border-[#E8DED6] text-[#2D2421] hover:bg-[#F5EFEB]'
                    : 'bg-transparent text-[#9E8E87] border border-dashed border-[#D5C7BD]'
                }`}
              >
                <span>{m.symbol}</span>
                <span>{m.days}d</span>
                {achieved ? (
                  <Check className="w-3 h-3 text-[#5A6E4B]" />
                ) : (
                  <Lock className="w-2.5 h-2.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Center Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Milestone Title & Status */}
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-3 py-0.5 rounded-full border border-[#E5C158]/40">
              {currentMilestone.badgeName}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2421]">
              {currentMilestone.title}
            </h2>
            <p className="text-xs text-[#796B64] max-w-sm mx-auto">
              {currentMilestone.description}
            </p>
          </div>

          {/* 3D Interactive Coin Container */}
          <div className="flex flex-col items-center justify-center py-2">
            <div 
              onClick={handleFlip}
              className="cursor-pointer group select-none relative"
              style={{ perspective: '1000px' }}
              title="Tap to flip coin"
            >
              <div 
                className="w-56 h-56 sm:w-64 sm:h-64 rounded-full relative transition-transform duration-700 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* ===================== FRONT FACE ===================== */}
                <div 
                  className={`absolute inset-0 rounded-full border-8 ${coinTheme.rim} ${coinTheme.bezel} bg-gradient-to-tr ${coinTheme.front} p-3 flex flex-col items-center justify-between text-center`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Outer Engraved Ring Text */}
                  <div className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#4A3222] opacity-80 pt-1">
                    UNITY · SERVICE · RECOVERY
                  </div>

                  {/* Inner Stamped Ring */}
                  <div className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-dashed ${coinTheme.innerRing} flex flex-col items-center justify-center p-2 relative bg-white/10 backdrop-blur-2xs shadow-inner`}>
                    <span className="text-2xl mb-0.5">{currentMilestone.symbol}</span>
                    <span className={`font-serif text-3xl sm:text-4xl font-black ${coinTheme.accent} tracking-wider`}>
                      {getRomanNumeral(currentMilestone.days)}
                    </span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#5A3816] mt-0.5">
                      {currentMilestone.days === 1 ? 'Day At A Time' : `${currentMilestone.days} Days Clean`}
                    </span>
                  </div>

                  {/* Bottom Engraved Text */}
                  <div className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#4A3222] opacity-80 pb-1">
                    TO THINE OWN SELF BE TRUE
                  </div>
                </div>

                {/* ===================== BACK FACE ===================== */}
                <div 
                  className={`absolute inset-0 rounded-full border-8 ${coinTheme.rim} ${coinTheme.bezel} bg-gradient-to-br ${coinTheme.front} p-4 flex flex-col items-center justify-between text-center`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {/* Top Scripture Reference */}
                  <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4A3222] pt-1">
                    {currentMilestone.bibleVerse.reference}
                  </div>

                  {/* Center Scripture Verse */}
                  <div className="px-2">
                    <p className="font-scripture italic text-xs sm:text-sm text-[#381F0E] leading-relaxed line-clamp-4">
                      "{currentMilestone.bibleVerse.text}"
                    </p>
                  </div>

                  {/* Bottom Achievement Date */}
                  <div className="text-[10px] font-sans font-semibold text-[#4A3222] pb-1">
                    {isUnlocked ? `Achieved: ${achievedDateStr}` : `Goal: ${currentMilestone.days} Days in Grace`}
                  </div>
                </div>
              </div>
            </div>

            {/* Flip Indicator Button */}
            <button
              onClick={handleFlip}
              className="mt-4 px-4 py-1.5 rounded-full bg-white border border-[#E8DED6] hover:border-[#2D2421] text-xs font-semibold text-[#2D2421] flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#796B64]" />
              <span>Tap to Flip ({isFlipped ? 'Show Front' : 'Show Verse'})</span>
            </button>
          </div>

          {/* Milestone Reflection Prompt (Gratitude to God) */}
          <div className="bg-white border border-[#E8DED6] rounded-3xl p-4 sm:p-5 text-left space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-[#8B261D]" />
              <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                Milestone Reflection: Gratitude to God
              </h4>
            </div>

            <p className="text-xs text-[#796B64] italic">
              "{currentMilestone.reflectionPrompts.gratitude}"
            </p>

            <form onSubmit={handleSaveReflection} className="space-y-2.5">
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                placeholder="Write your personal gratitude or testimony for this milestone... (Saved locally to your encrypted vault)"
                rows={3}
                className="w-full p-3 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] text-xs text-[#2D2421] placeholder-[#A89B94] focus:outline-none focus:ring-2 focus:ring-[#E5C158] transition-all resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#5A6E4B] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Zero-knowledge client encrypted</span>
                </span>

                <button
                  type="submit"
                  className="py-1.5 px-3.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold hover:bg-[#4A3E39] flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-[#FFD4C4]" />
                      <span>Save Reflection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Pagination & Share Controls */}
        <div className="p-4 border-t border-[#E8DED6] bg-[#FFF9F5] flex items-center justify-between">
          <button
            onClick={() => {
              if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
            }}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl text-[#796B64] hover:text-[#2D2421] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {onOpenShare && (
              <button
                onClick={() => onOpenShare(currentMilestone)}
                className="py-2 px-4 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-xs font-semibold text-[#2D2421] hover:bg-[#F5EFEB] flex items-center gap-1.5 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-[#796B64]" />
                <span>Share Medallion</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (currentIndex < SACRED_MILESTONES.length - 1) setCurrentIndex(currentIndex + 1);
            }}
            disabled={currentIndex === SACRED_MILESTONES.length - 1}
            className="p-2 rounded-xl text-[#796B64] hover:text-[#2D2421] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
