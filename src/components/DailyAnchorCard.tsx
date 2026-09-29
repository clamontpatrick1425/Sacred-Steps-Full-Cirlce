import React, { useState, useRef } from 'react';
import { 
  Heart, 
  Volume2, 
  Share2, 
  Sunrise, 
  BookOpen, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Check 
} from 'lucide-react';
import { DailyContent } from '../data/dailyAnchorData';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';
import { useSacredStore } from '../store/useSacredStore';

interface DailyAnchorCardProps {
  card: DailyContent;
  onSaveToggle?: (card: DailyContent) => void;
  onComplete?: () => void;
  className?: string;
}

export const DailyAnchorCard: React.FC<DailyAnchorCardProps> = ({
  card,
  onSaveToggle,
  onComplete,
  className = '',
}) => {
  const { toggleSaveToGraceDeck, isSavedInGraceDeck, soundEnabled, hapticsEnabled } = useSacredStore();

  // 3-section flow: 0 = Prayer, 1 = Bible Verse, 2 = Affirmation
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isHeartAnimating, setIsHeartAnimating] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  // Swipe touch tracking for smooth 0.3s transition
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const isSaved = isSavedInGraceDeck(card.id);

  const sections = [
    { id: 'prayer', label: '1. Morning Prayer', icon: Sunrise, accentColor: '#FFD4C4' },
    { id: 'verse', label: '2. Bible Verse', icon: BookOpen, accentColor: '#E6D5F0' },
    { id: 'affirmation', label: '3. Affirmation', icon: Sparkles, accentColor: '#C8D5B9' },
  ];

  const handleNextSection = () => {
    if (activeSection < 2) {
      setActiveSection((prev) => prev + 1);
      if (hapticsEnabled) triggerHaptic('soft');
      if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
    }
  };

  const handlePrevSection = () => {
    if (activeSection > 0) {
      setActiveSection((prev) => prev - 1);
      if (hapticsEnabled) triggerHaptic('soft');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // px threshold

    if (diff > threshold) {
      handleNextSection();
    } else if (diff < -threshold) {
      handlePrevSection();
    }
  };

  const handleHeartClick = () => {
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 500);

    if (onSaveToggle) {
      onSaveToggle(card);
    } else {
      toggleSaveToGraceDeck(card);
    }
  };

  const handleSpeakAloud = () => {
    if (activeSection === 0) {
      sanctuaryAudio.speakScripture(`${card.prayer.title}. ${card.prayer.content}`);
    } else if (activeSection === 1) {
      sanctuaryAudio.speakScripture(`${card.verse.reference}. ${card.verse.text}`);
    } else {
      sanctuaryAudio.speakScripture(card.affirmation.text);
    }
  };

  const handleShare = () => {
    const text = `SacredSteps Daily Anchor\n\nPrayer: "${card.prayer.title}"\n${card.prayer.content}\n\nVerse: "${card.verse.text}" — ${card.verse.reference} (${card.verse.translation})\n\nAffirmation: "${card.affirmation.text}"\n\nA Path to Recovery, A Life in Grace.`;
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    if (hapticsEnabled) triggerHaptic('soft');
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 3-Section Selector Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {sections.map((sec, idx) => {
          const isActive = activeSection === idx;
          const isPassed = activeSection > idx;

          return (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(idx);
                if (hapticsEnabled) triggerHaptic('soft');
              }}
              className={`py-2 px-2.5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-[#FFF9F5] border-[#2D2421] shadow-xs ring-1 ring-[#2D2421]'
                  : 'bg-[#FFF9F5]/70 border-[#E8DED6] text-[#796B64] hover:bg-[#FFF9F5]'
              }`}
            >
              {/* Soft Dawn Top Indicator Bar */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                  isActive 
                    ? sec.id === 'prayer' ? 'bg-[#FFD4C4]' : sec.id === 'verse' ? 'bg-[#E6D5F0]' : 'bg-[#C8D5B9]'
                    : isPassed 
                    ? 'bg-[#C8D5B9]' 
                    : 'bg-transparent'
                }`} 
              />
              <div className="flex items-center gap-1.5">
                <sec.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2D2421]' : 'text-[#796B64]'}`} />
                <span className={`text-[11px] font-sans truncate ${isActive ? 'font-semibold text-[#2D2421]' : 'text-[#796B64]'}`}>
                  {sec.label.split('. ')[1]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Swipeable Card */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden min-h-[380px] flex flex-col justify-between select-none"
      >
        {/* Soft Dawn Gradient Aura */}
        <div 
          className={`absolute top-0 right-0 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
            activeSection === 0 
              ? 'bg-[#FFD4C4]/30' 
              : activeSection === 1 
              ? 'bg-[#E6D5F0]/30' 
              : 'bg-[#C8D5B9]/30'
          }`} 
        />

        {/* Card Header & Controls */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#796B64]">
                Section {activeSection + 1} of 3
              </span>
              <span className="text-[#E8DED6]">·</span>
              <span className="text-[11px] text-[#796B64]">
                {activeSection === 0 ? 'Surrender' : activeSection === 1 ? 'Scripture Anchor' : 'Spoken Affirmation'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Listen Aloud */}
              <button
                onClick={handleSpeakAloud}
                className="p-2 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
                title="Listen aloud with gentle cadence"
                aria-label="Listen aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
                title="Copy to clipboard"
                aria-label="Share card"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Heart Icon with Soft Animation */}
              <button
                onClick={handleHeartClick}
                className="p-2 rounded-xl hover:bg-[#F5EFEB] transition-colors relative group"
                title={isSaved ? "Remove from Grace Deck" : "Save to Grace Deck"}
                aria-label="Save to Grace Deck"
              >
                <Heart 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isSaved 
                      ? 'text-[#D97768] fill-[#D97768]' 
                      : 'text-[#796B64] hover:text-[#D97768]'
                  } ${isHeartAnimating ? 'scale-125 duration-150' : 'scale-100'}`}
                />
                {isSaved && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D97768] ring-2 ring-[#FFF9F5]" />
                )}
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Transition Sections (300ms ease) */}
          <div className="overflow-hidden relative">
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeSection * 100}%)` }}
            >
              {/* SECTION 1: PRAYER */}
              <div className="w-full shrink-0 pr-1">
                <div className="inline-block px-3 py-1 rounded-full bg-[#FFD4C4]/50 text-[#7C3626] text-[11px] font-medium mb-3">
                  {card.prayer.source}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2421] font-semibold mb-3 leading-tight">
                  {card.prayer.title}
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#4A3E39] leading-relaxed">
                  {card.prayer.content}
                </p>
              </div>

              {/* SECTION 2: BIBLE VERSE */}
              <div className="w-full shrink-0 px-1">
                <div className="inline-block px-3 py-1 rounded-full bg-[#E6D5F0]/60 text-[#4D3860] text-[11px] font-medium mb-3">
                  Holy Scripture · {card.verse.translation}
                </div>
                <blockquote className="font-scripture italic text-2xl sm:text-3xl text-[#2D2421] leading-relaxed mb-4 pl-4 border-l-2 border-[#E6D5F0]">
                  "{card.verse.text}"
                </blockquote>
                <div className="text-right">
                  <span className="font-sans text-xs tracking-wider uppercase font-semibold text-[#796B64] bg-[#FAF5F0] px-3 py-1.5 rounded-lg border border-[#E8DED6]">
                    {card.verse.reference}
                  </span>
                </div>
              </div>

              {/* SECTION 3: AFFIRMATION */}
              <div className="w-full shrink-0 pl-1">
                <div className="inline-block px-3 py-1 rounded-full bg-[#C8D5B9]/60 text-[#2C4119] text-[11px] font-medium mb-3">
                  Category: {card.affirmation.category}
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] text-center my-2">
                  <p className="font-serif italic text-xl sm:text-2xl text-[#2D2421] font-medium leading-relaxed">
                    "{card.affirmation.text}"
                  </p>
                  <span className="block text-xs text-[#796B64] mt-3">
                    Speak this aloud 3 times. Let truth replace any lingering fear.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Card Navigation & Progress */}
        <div className="pt-6 mt-6 border-t border-[#E8DED6] flex items-center justify-between">
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveSection(idx);
                  if (hapticsEnabled) triggerHaptic('soft');
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSection === idx 
                    ? 'w-6 bg-[#2D2421]' 
                    : 'w-2 bg-[#E8DED6] hover:bg-[#D5C7BD]'
                }`}
                aria-label={`Go to section ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSection}
              disabled={activeSection === 0}
              className="p-2 rounded-xl border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] hover:bg-[#FAF5F0] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous Section"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {activeSection < 2 ? (
              <button
                onClick={handleNextSection}
                className="px-4 py-2 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Next Section</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!isSaved) handleHeartClick();
                  if (hapticsEnabled) triggerHaptic('step');
                  if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
                  if (onComplete) onComplete();
                }}
                className="px-4 py-2 rounded-xl bg-[#C8D5B9] text-[#243317] text-xs font-semibold hover:bg-[#B8C8A7] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Complete Routine</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Copied Alert */}
      {copiedNotice && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
          <span>Daily Anchor copied to clipboard</span>
        </div>
      )}
    </div>
  );
};
