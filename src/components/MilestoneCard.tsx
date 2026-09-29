import React from 'react';
import { 
  CheckCircle2, Flame, Share2, Sparkles, Trophy, 
  BookOpen, ChevronRight, Lock, Calendar
} from 'lucide-react';
import { MilestoneItem } from '../data/milestoneData';
import { useSacredStore } from '../store/useSacredStore';

interface MilestoneCardProps {
  milestone: MilestoneItem;
  daysInGrace: number;
  onOpenCelebration: (m: MilestoneItem) => void;
  onOpenShare: (m: MilestoneItem) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  daysInGrace,
  onOpenCelebration,
  onOpenShare,
}) => {
  const { litCandlesMap, toggleLightCandle } = useSacredStore();

  const isAchieved = daysInGrace >= milestone.days;
  const daysRemaining = Math.max(0, milestone.days - daysInGrace);
  const progressPercent = Math.min(100, Math.max(0, Math.round((daysInGrace / milestone.days) * 100)));
  const isCandleLit = Boolean(litCandlesMap[milestone.id]);

  return (
    <div
      className={`rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden group ${
        isAchieved
          ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FFFBF0] to-[#FAF4E5] border-[#E5C158] shadow-[0_4px_20px_rgba(212,175,55,0.12)] hover:shadow-[0_8px_28px_rgba(212,175,55,0.22)]'
          : 'bg-[#FFF9F5]/70 border-[#E8DED6] opacity-85 hover:opacity-100 hover:bg-[#FFF9F5]'
      }`}
    >
      {/* Warm Gold Corner Ribbon for Achieved */}
      {isAchieved && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E5C158]/20 via-[#F4E4C1]/30 to-transparent rounded-bl-full pointer-events-none" />
      )}

      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Symbol Avatar */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs transition-transform group-hover:scale-105 ${
              isAchieved
                ? 'bg-gradient-to-tr from-[#F4E4C1] to-[#FFF9F5] border border-[#E5C158] ring-2 ring-[#D4AF37]/20'
                : 'bg-[#FAF5F0] border border-[#E8DED6] grayscale-50'
            }`}
          >
            <span>{milestone.symbol}</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isAchieved
                  ? 'bg-[#E5C158]/25 text-[#7A5B0B] border border-[#E5C158]/50'
                  : 'bg-[#E8DED6]/60 text-[#796B64]'
              }`}>
                {milestone.badgeName}
              </span>

              {isAchieved && (
                <span className="text-[10px] text-[#5A6E4B] flex items-center gap-0.5 font-semibold">
                  <CheckCircle2 className="w-3 h-3 fill-current" />
                  <span>Achieved</span>
                </span>
              )}
            </div>

            <h3 className="font-serif text-base font-bold text-[#2D2421]">
              {milestone.title}
            </h3>
          </div>
        </div>

        {/* Action Quick Buttons */}
        <div className="flex items-center gap-1">
          {/* Virtual Candle Button */}
          <button
            onClick={() => toggleLightCandle(milestone.id)}
            className={`p-2 rounded-xl border transition-all ${
              isCandleLit
                ? 'bg-[#FFF2D6] border-[#E5C158] text-[#D4AF37] shadow-xs'
                : 'bg-[#FAF5F0] border-[#E8DED6] text-[#A89B94] hover:text-[#D4AF37]'
            }`}
            title={isCandleLit ? 'Candle is lit before God' : 'Light a remembrance candle'}
          >
            <Flame className={`w-4 h-4 ${isCandleLit ? 'animate-flame fill-current text-[#E68A00]' : ''}`} />
          </button>

          {/* Social Share Button */}
          <button
            onClick={() => onOpenShare(milestone)}
            className="p-2 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
            title="Create Shareable Aesthetic Graphic"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[#5C4D46] leading-relaxed mb-4">
        {milestone.description}
      </p>

      {/* Progress or Completion Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-[11px] font-medium">
          <span className="text-[#796B64]">
            {isAchieved 
              ? 'Milestone secured in God’s grace' 
              : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} to milestone`}
          </span>
          <span className={`font-mono font-semibold ${isAchieved ? 'text-[#7A5B0B]' : 'text-[#796B64]'}`}>
            {progressPercent}%
          </span>
        </div>

        <div className="h-2 w-full bg-[#E8DED6]/70 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isAchieved
                ? 'bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#F4E4C1]'
                : 'bg-gradient-to-r from-[#FFD4C4] to-[#C8D5B9]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card Action Footers */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E8DED6]/60">
        <div className="flex items-center gap-1.5 text-[11px] text-[#796B64]">
          <BookOpen className="w-3.5 h-3.5 text-[#5A6E4B]" />
          <span className="truncate max-w-[180px] sm:max-w-xs italic font-scripture text-xs">
            {milestone.eBookPrayer.title}
          </span>
        </div>

        <button
          onClick={() => onOpenCelebration(milestone)}
          className={`py-2 px-3.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
            isAchieved
              ? 'bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39]'
              : 'bg-white border border-[#E8DED6] text-[#2D2421] hover:bg-[#FAF5F0]'
          }`}
        >
          {isAchieved ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Celebrate</span>
            </>
          ) : (
            <>
              <span>Preview Altar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
