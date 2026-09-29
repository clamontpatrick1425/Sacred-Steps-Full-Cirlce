import React, { useState } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Calendar, 
  Bookmark, 
  Trash2, 
  Heart, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { RECOVERY_MILESTONES } from '../data/devotionals';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

export const MilestonesScreen: React.FC = () => {
  const { 
    getDaysInGrace, 
    cleanStartDate, 
    completedStepsCount, 
    savedBreakthroughs, 
    removeBreakthrough,
    resetGraceCompassionately,
    setCustomStartDate,
    hapticsEnabled,
    soundEnabled
  } = useSacredStore();

  const daysInGrace = getDaysInGrace();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [customDate, setCustomDate] = useState(cleanStartDate.slice(0, 10));

  const handleGraceReset = () => {
    resetGraceCompassionately();
    setShowResetConfirm(false);
  };

  const handleUpdateDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDate) {
      setCustomStartDate(new Date(customDate).toISOString());
      setIsEditingDate(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C8D5B9] ring-4 ring-[#C8D5B9]/30" />
          <h1 className="font-serif text-xl sm:text-2xl text-[#2D2421] font-semibold">
            Milestones of Grace
          </h1>
        </div>
        <p className="font-sans text-xs sm:text-sm text-[#796B64] leading-relaxed">
          Recovery is not a performance trial; it is a sacred journey of becoming rooted in truth.
        </p>

        {/* Current Standing Card */}
        <div className="mt-5 p-4 rounded-xl bg-[#FFF9F5] border border-[#E8DED6] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#796B64] block">
              Walking In Grace
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-serif text-3xl font-semibold text-[#2D2421]">
                {daysInGrace} Days
              </span>
              <span className="text-xs text-[#796B64]">
                since {new Date(cleanStartDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingDate(!isEditingDate)}
              className="p-2 rounded-lg text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
              title="Edit start date"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 rounded-lg bg-[#FAF5F0] border border-[#E8DED6] text-xs text-[#796B64] hover:text-[#9C3E32] hover:bg-[#FFD4C4]/20 transition-colors flex items-center gap-1.5"
              title="Compassionate Grace Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Grace Reset</span>
            </button>
          </div>
        </div>

        {/* Custom Date Form */}
        {isEditingDate && (
          <form onSubmit={handleUpdateDate} className="mt-3 p-3 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] flex items-center gap-2">
            <label className="text-xs text-[#796B64]">Set Clean Start Date:</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="p-1.5 text-xs rounded-lg bg-white border border-[#E8DED6] text-[#2D2421]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39]"
            >
              Update
            </button>
          </form>
        )}
      </div>

      {/* Compassionate Grace Reset Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#FFF9F5] border border-[#E8DED6] rounded-2xl p-6 shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-[#E6D5F0]/60 flex items-center justify-center mx-auto mb-3 text-[#2D2421]">
              <Heart className="w-6 h-6 text-[#796B64]" />
            </div>

            <h3 className="font-serif text-lg text-[#2D2421] font-semibold text-center mb-2">
              A Slip is Not a Fall from Grace
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#4A3E39] text-center leading-relaxed mb-6">
              "The steadfast love of the Lord never ceases; His mercies are new every morning." If you stumbled, you are not back at square one. You have accumulated wisdom, courage, and God’s grace. Reset with zero shame.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E8DED6] text-xs font-medium text-[#796B64] hover:bg-[#F5EFEB] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGraceReset}
                className="flex-1 py-2.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39] transition-colors shadow-sm"
              >
                Reset With Grace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Roadmap */}
      <div className="space-y-3">
        <h2 className="font-serif text-base text-[#2D2421] font-semibold">
          Roadmap of Faith & Freedom
        </h2>

        <div className="space-y-2.5">
          {RECOVERY_MILESTONES.map((milestone) => {
            const isAchieved = daysInGrace >= milestone.days;

            return (
              <div
                key={milestone.days}
                className={`p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                  isAchieved
                    ? 'bg-[#FFF9F5] border-[#C8D5B9] shadow-sm'
                    : 'bg-[#FAF5F0]/60 border-[#E8DED6] opacity-75'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 ${
                    isAchieved
                      ? 'bg-[#C8D5B9] text-[#2D2421]'
                      : 'bg-[#E8DED6] text-[#796B64]'
                  }`}
                >
                  {isAchieved ? <CheckCircle2 className="w-4 h-4" /> : milestone.days}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-semibold text-[#2D2421]">
                      {milestone.title}
                    </h3>
                    <span className="text-[11px] font-sans font-medium text-[#796B64]">
                      {milestone.days} {milestone.days === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <p className="text-xs text-[#796B64] mt-0.5 leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Breakthroughs */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base text-[#2D2421] font-semibold">
            Saved S.T.E.P. Breakthroughs
          </h2>
          <span className="text-xs text-[#796B64]">
            {savedBreakthroughs.length} saved
          </span>
        </div>

        {savedBreakthroughs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] text-center text-[#796B64]">
            <Bookmark className="w-6 h-6 mx-auto mb-2 text-[#E6D5F0]" />
            <p className="text-xs">
              When the S.T.E.P. method dismantles a lie, bookmark it here for quick reference during difficult moments.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedBreakthroughs.map((bt) => (
              <div
                key={bt.id}
                className="p-4 rounded-xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm relative group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-medium text-[#796B64] uppercase tracking-wider block">
                      {bt.triggerCategory || 'Breakthrough'}
                    </span>
                    <h3 className="font-serif text-sm font-semibold text-[#2D2421]">
                      "{bt.embrace.affirmation}"
                    </h3>
                  </div>
                  <button
                    onClick={() => removeBreakthrough(bt.id)}
                    className="p-1 text-[#A89B94] hover:text-[#9C3E32] transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <blockquote className="font-scripture italic text-xs text-[#4A3E39] mb-1 pl-2 border-l border-[#FFD4C4]">
                  "{bt.scripture.text}" — <span className="font-sans not-italic font-semibold">{bt.scripture.reference}</span>
                </blockquote>

                <div className="text-xs text-[#2D2421] mt-2 pt-2 border-t border-[#E8DED6]">
                  <strong>Dismantling Truth:</strong> {bt.truth.statement}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
