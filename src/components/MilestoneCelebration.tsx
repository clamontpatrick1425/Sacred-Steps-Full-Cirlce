import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Flame, Volume2, Share2, Check, X, 
  BookOpen, Heart, ArrowRight, MessageSquare, ShieldCheck
} from 'lucide-react';
import { MilestoneItem } from '../data/milestoneData';
import { useSacredStore } from '../store/useSacredStore';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface MilestoneCelebrationProps {
  milestone: MilestoneItem;
  daysInGrace: number;
  onClose: () => void;
  onOpenShare: (m: MilestoneItem) => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  milestone,
  daysInGrace,
  onClose,
  onOpenShare,
}) => {
  const { 
    litCandlesMap, 
    toggleLightCandle, 
    milestoneReflections, 
    saveMilestoneReflection, 
    soundEnabled, 
    hapticsEnabled 
  } = useSacredStore();

  const isCandleLit = Boolean(litCandlesMap[milestone.id]);
  const savedReflection = milestoneReflections[milestone.id] || {};

  const [challenge, setChallenge] = useState(savedReflection.challenge || '');
  const [proudMoment, setProudMoment] = useState(savedReflection.proudMoment || '');
  const [gratitude, setGratitude] = useState(savedReflection.gratitude || '');
  const [hope, setHope] = useState(savedReflection.hope || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSpeakingPrayer, setIsSpeakingPrayer] = useState(false);

  // Play celebration entrance chime on load
  useEffect(() => {
    if (soundEnabled) {
      sanctuaryAudio.playGraceChime('stepComplete');
    }
    if (hapticsEnabled) {
      triggerHaptic('pulse');
    }
  }, []);

  const handleCandleToggle = () => {
    toggleLightCandle(milestone.id);
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    saveMilestoneReflection(milestone.id, {
      challenge: challenge.trim(),
      proudMoment: proudMoment.trim(),
      gratitude: gratitude.trim(),
      hope: hope.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSpeakPrayer = () => {
    if (isSpeakingPrayer) {
      sanctuaryAudio.cancelSpeech();
      setIsSpeakingPrayer(false);
      return;
    }
    setIsSpeakingPrayer(true);
    const textToSpeak = `${milestone.eBookPrayer.title}. ${milestone.eBookPrayer.text}. Scripture: ${milestone.bibleVerse.text} from ${milestone.bibleVerse.reference}.`;
    sanctuaryAudio.speakScripture(textToSpeak);
    setTimeout(() => setIsSpeakingPrayer(false), 15000);
  };

  // Sparkle particle mock data
  const particles = [
    { id: 1, left: '10%', top: '15%', delay: '0s', size: 'w-2 h-2' },
    { id: 2, left: '85%', top: '20%', delay: '1s', size: 'w-3 h-3' },
    { id: 3, left: '20%', top: '75%', delay: '2s', size: 'w-2.5 h-2.5' },
    { id: 4, left: '80%', top: '70%', delay: '0.5s', size: 'w-2 h-2' },
    { id: 5, left: '50%', top: '10%', delay: '1.5s', size: 'w-3 h-3' },
    { id: 6, left: '90%', top: '45%', delay: '2.5s', size: 'w-2 h-2' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      {/* Background Floating Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`absolute ${p.size} rounded-full bg-gradient-to-tr from-[#FFE5A3] to-[#E5C158] opacity-80 animate-sparkle shadow-[0_0_12px_#E5C158]`}
            style={{ left: p.left, top: p.top, animationDelay: p.delay }}
          />
        ))}
      </div>

      {/* Main Celebration Card */}
      <div className="relative w-full max-w-lg bg-[#FFFDF9] border-2 border-[#E5C158] rounded-[36px] shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto z-10 flex flex-col space-y-6 text-[#2D2421]">
        {/* Soft Golden Halo Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#FFF3D1] to-[#E5C158]" />

        {/* Top Dismiss & Share Controls */}
        <div className="flex items-center justify-between border-b border-[#E8DED6] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{milestone.symbol}</span>
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#E5C158]/20 px-2 py-0.5 rounded-full border border-[#E5C158]/40">
                {milestone.badgeName}
              </span>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#2D2421]">
                {milestone.days} Days in Sacred Grace
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenShare(milestone)}
              className="p-2 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Share Graphic on Social Media"
            >
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => {
                sanctuaryAudio.cancelSpeech();
                onClose();
              }}
              className="p-1.5 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
              aria-label="Close celebration"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIRTUAL CANDLE LIGHTING ALTAR */}
        <div className="bg-gradient-to-b from-[#FFF9EE] via-[#FFFDF7] to-[#FAF4E5] rounded-3xl p-5 border border-[#E5C158]/60 text-center relative shadow-xs flex flex-col items-center">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7A5B0B] mb-2 block">
            Altar of Remembrance
          </span>

          {/* Interactive Candle Vessel */}
          <div 
            onClick={handleCandleToggle}
            className="cursor-pointer select-none group my-2 flex flex-col items-center justify-center"
            title="Tap to light or extinguish remembrance candle"
          >
            {/* Candle Flame / Smoke */}
            <div className="h-10 flex items-end justify-center mb-1">
              {isCandleLit ? (
                <div className="relative flex flex-col items-center">
                  <div className="w-5 h-8 rounded-full bg-gradient-to-t from-[#FF7B00] via-[#FFD000] to-white animate-flame shadow-[0_0_20px_#FFAA00]" />
                  <div className="w-1.5 h-3 bg-gradient-to-t from-[#2D2421] to-transparent -mt-1 rounded-full" />
                </div>
              ) : (
                <div className="w-0.5 h-3 bg-[#796B64] rounded-t-sm" />
              )}
            </div>

            {/* Candle Wax Body */}
            <div className={`w-14 h-20 rounded-t-xl rounded-b-2xl border-2 transition-all flex flex-col items-center justify-between p-2 shadow-md ${
              isCandleLit 
                ? 'bg-gradient-to-b from-[#FFF8E7] to-[#FCECC2] border-[#E5C158] ring-4 ring-[#E5C158]/25' 
                : 'bg-[#F2ECE6] border-[#D5C7BD]'
            }`}>
              <div className="w-8 h-1 rounded-full bg-black/10" />
              <span className="text-xs font-serif font-bold text-[#7A5B0B]">
                {milestone.days}d
              </span>
              <div className="w-10 h-1.5 rounded-full bg-black/10" />
            </div>

            {/* Candle Platform / Plate */}
            <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-[#D5C7BD] via-[#E8DED6] to-[#D5C7BD] -mt-1 shadow-xs" />
          </div>

          <p className="font-serif text-sm font-semibold text-[#2D2421] mt-2">
            {isCandleLit 
              ? 'Your altar candle burns brightly in praise before God.' 
              : 'Tap the candle to light an altar of thanksgiving.'}
          </p>
          <span className="text-[11px] text-[#796B64]">
            "The spirit of a man is the candle of the Lord." — Proverbs 20:27
          </span>
        </div>

        {/* EBOOK SPECIAL PRAYER (from C. Lamont Patrick's book) */}
        <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-5 space-y-3 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#E6D5F0]/60 text-[#2D2421]">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#2D2421]">
                  {milestone.eBookPrayer.title}
                </h3>
                <span className="text-[10px] text-[#796B64]">
                  {milestone.eBookPrayer.chapterRef}
                </span>
              </div>
            </div>

            <button
              onClick={handleSpeakPrayer}
              className={`p-2 rounded-xl transition-colors ${
                isSpeakingPrayer ? 'bg-[#FFD4C4] text-[#2D2421]' : 'text-[#796B64] hover:bg-[#F5EFEB]'
              }`}
              title="Listen aloud with gentle voice"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8DED6] font-sans text-xs leading-relaxed text-[#2D2421] whitespace-pre-wrap italic">
            "{milestone.eBookPrayer.text}"
          </div>
        </div>

        {/* SCRIPTURE ANCHOR */}
        <div className="bg-[#FAF5F0] border border-[#E8DED6] rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#5A6E4B] bg-[#C8D5B9]/40 px-2.5 py-0.5 rounded-full">
              {milestone.bibleVerse.reference}
            </span>
            <span className="text-[10px] text-[#796B64]">
              {milestone.bibleVerse.translation}
            </span>
          </div>

          <p className="font-scripture italic text-base sm:text-lg leading-relaxed text-[#2D2421]">
            "{milestone.bibleVerse.text}"
          </p>

          <p className="text-xs text-[#796B64] pt-1 border-t border-[#E8DED6]">
            {milestone.bibleVerse.reflection}
          </p>
        </div>

        {/* REFLECTION PROMPTS (Challenge, Proud Moment, Gratitude, Hope) */}
        <form onSubmit={handleSaveReflection} className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DED6] pb-2">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#796B64]" />
              <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                Milestone Reflection
              </h4>
            </div>
            <span className="text-[10px] text-[#5A6E4B] flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Saved Privately</span>
            </span>
          </div>

          {/* 1. Challenge */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5C4D46] mb-1">
              ⚡ Challenge Faced: {milestone.reflectionPrompts.challenge}
            </label>
            <textarea
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              rows={2}
              placeholder="Write the truth of how God carried you through the storm..."
              className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E5C158] resize-none"
            />
          </div>

          {/* 2. Proud Moment */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5C4D46] mb-1">
              🌱 Quiet Victory: {milestone.reflectionPrompts.proudMoment}
            </label>
            <textarea
              value={proudMoment}
              onChange={(e) => setProudMoment(e.target.value)}
              rows={2}
              placeholder="What choice honored your recovery and character?"
              className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E5C158] resize-none"
            />
          </div>

          {/* 3. Gratitude */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5C4D46] mb-1">
              🙏 Deep Gratitude: {milestone.reflectionPrompts.gratitude}
            </label>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              rows={2}
              placeholder="Who or what gave you strength on this milestone?"
              className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E5C158] resize-none"
            />
          </div>

          {/* 4. Hope */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5C4D46] mb-1">
              ✨ Sacred Hope: {milestone.reflectionPrompts.hope}
            </label>
            <textarea
              value={hope}
              onChange={(e) => setHope(e.target.value)}
              rows={2}
              placeholder="What divine promise anchors your next season?"
              className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E5C158] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-[#2D2421] text-[#FFF9F5] font-semibold text-xs hover:bg-[#4A3E39] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#C8D5B9]" />
                <span>Reflections Saved to Milestone Altar!</span>
              </>
            ) : (
              <span>Save Personal Reflection</span>
            )}
          </button>
        </form>

        {/* Bottom Social Share Callout */}
        <div className="pt-2 border-t border-[#E8DED6] flex items-center justify-between">
          <button
            onClick={() => onOpenShare(milestone)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#2D2421] font-bold text-xs hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-white fill-current" />
            <span>Generate Aesthetic Social Media Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
