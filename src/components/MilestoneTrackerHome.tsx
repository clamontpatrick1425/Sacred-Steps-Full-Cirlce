import React, { useState } from 'react';
import { 
  Trophy, Flame, Sparkles, Calendar, RotateCcw, 
  Heart, Shield, ArrowRight, CheckCircle2, PhoneCall,
  Wind, Clock, Share2, HelpCircle
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { SACRED_MILESTONES, MilestoneItem } from '../data/milestoneData';
import { MilestoneCard } from './MilestoneCard';
import { MilestoneCelebration } from './MilestoneCelebration';
import { ShareableGraphicGenerator } from './ShareableGraphicGenerator';
import { RecoveryCoinVaultModal } from './RecoveryCoinVaultModal';
import { triggerHaptic } from '../utils/haptics';

export const MilestoneTrackerHome: React.FC = () => {
  const { 
    getDaysInGrace, 
    cleanStartDate, 
    setCustomStartDate, 
    resetGraceCompassionately,
    openSos,
    sponsorContact,
    litCandlesMap,
    hapticsEnabled
  } = useSacredStore();

  const daysInGrace = getDaysInGrace();

  // Modal states
  const [selectedCelebration, setSelectedCelebration] = useState<MilestoneItem | null>(null);
  const [selectedShare, setSelectedShare] = useState<MilestoneItem | null>(null);
  const [showCoinVault, setShowCoinVault] = useState<boolean>(false);
  const [showRelapseModal, setShowRelapseModal] = useState<boolean>(false);
  const [showCalendarEdit, setShowCalendarEdit] = useState<boolean>(false);
  const [customDateInput, setCustomDateInput] = useState<string>(cleanStartDate.slice(0, 10));

  // Determine next milestone
  const nextMilestone = SACRED_MILESTONES.find((m) => m.days > daysInGrace) || SACRED_MILESTONES[SACRED_MILESTONES.length - 1];
  const prevMilestone = [...SACRED_MILESTONES].reverse().find((m) => m.days <= daysInGrace);
  
  const daysUntilNext = Math.max(0, nextMilestone.days - daysInGrace);
  const prevDays = prevMilestone ? prevMilestone.days : 0;
  const range = nextMilestone.days - prevDays;
  const progressInSegment = Math.min(100, Math.max(0, Math.round(((daysInGrace - prevDays) / range) * 100)));

  const achievedCount = SACRED_MILESTONES.filter((m) => daysInGrace >= m.days).length;
  const totalLitCandles = Object.values(litCandlesMap).filter(Boolean).length;

  const handleUpdateDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDateInput) {
      setCustomStartDate(new Date(customDateInput).toISOString());
      setShowCalendarEdit(false);
      if (hapticsEnabled) triggerHaptic('step');
    }
  };

  const handleRelapseReset = () => {
    resetGraceCompassionately();
    setShowRelapseModal(false);
    if (hapticsEnabled) triggerHaptic('step');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* TOP HERO: CURRENT STREAK & SACRED PROGRESS */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF9F0] to-[#FAF4E5] border-2 border-[#E5C158] rounded-[36px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(212,175,55,0.15)] relative overflow-hidden">
        {/* Soft Golden Halo Background Ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#D4AF37]/25 via-[#F4E4C1]/20 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#E5C158]/20 text-[#7A5B0B] border border-[#E5C158]/40 shadow-xs">
              <Trophy className="w-5 h-5 text-[#8A6708]" />
            </span>
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7A5B0B] block">
                Sacred Milestones of Grace
              </span>
              <h1 className="font-serif text-lg font-bold text-[#2D2421]">
                Your Journey in Divine Light
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowCalendarEdit(!showCalendarEdit)}
              className="p-2 rounded-xl bg-white border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] transition-colors"
              title="Edit start date"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowRelapseModal(true)}
              className="py-1.5 px-3 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-xs font-semibold text-[#8B261D] hover:bg-[#FFCAD4]/30 transition-colors flex items-center gap-1 shadow-2xs"
              title="Gentle Harbor Support"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Compassion</span>
            </button>
          </div>
        </div>

        {/* Date Edit Dropdown */}
        {showCalendarEdit && (
          <form onSubmit={handleUpdateDate} className="mb-4 p-3 bg-white border border-[#E8DED6] rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
            <span className="text-xs text-[#796B64]">Sobriety Start:</span>
            <input
              type="date"
              value={customDateInput}
              onChange={(e) => setCustomDateInput(e.target.value)}
              className="p-1.5 text-xs rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421]"
            />
            <button
              type="submit"
              className="py-1.5 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold"
            >
              Save
            </button>
          </form>
        )}

        {/* Big Streak Numbers */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-2 border-y border-[#E5C158]/30 my-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl sm:text-6xl font-black text-[#2D2421] tracking-tight">
                {daysInGrace}
              </span>
              <span className="font-serif text-2xl font-bold text-[#7A5B0B]">
                {daysInGrace === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <p className="text-xs text-[#5C4D46] mt-0.5">
              Walking in sovereign freedom since{' '}
              <strong className="text-[#2D2421]">
                {new Date(cleanStartDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#E5C158]/50 text-center min-w-[90px] shadow-2xs">
              <span className="block text-base font-bold text-[#7A5B0B]">
                {achievedCount} / {SACRED_MILESTONES.length}
              </span>
              <span className="text-[10px] text-[#796B64] uppercase font-bold tracking-wider">
                Milestones
              </span>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#E5C158]/50 text-center min-w-[90px] shadow-2xs">
              <span className="block text-base font-bold text-[#E68A00] flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-current animate-flame" />
                <span>{totalLitCandles}</span>
              </span>
              <span className="text-[10px] text-[#796B64] uppercase font-bold tracking-wider">
                Altars Lit
              </span>
            </div>
          </div>
        </div>

        {/* Next Milestone Visual Progress Tracker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5C4D46] font-medium flex items-center gap-1">
              <span>Next Milestone:</span>
              <strong className="text-[#2D2421]">
                {nextMilestone.symbol} {nextMilestone.title}
              </strong>
            </span>
            <span className="font-mono text-[11px] font-bold text-[#7A5B0B] bg-[#FFF2D6] px-2 py-0.5 rounded-full border border-[#E5C158]/40">
              {daysUntilNext === 0 ? 'Reached!' : `${daysUntilNext} days away`}
            </span>
          </div>

          <div className="h-3 w-full bg-white rounded-full overflow-hidden p-0.5 border border-[#E5C158]/60 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#FFD4C4] transition-all duration-1000"
              style={{ width: `${daysUntilNext === 0 ? 100 : progressInSegment}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-[#796B64] font-medium">
            <span>{prevMilestone ? `${prevMilestone.symbol} ${prevMilestone.days}d` : 'Day 0'}</span>
            <span>{nextMilestone.symbol} {nextMilestone.days} Days Goal</span>
          </div>
        </div>
      </div>

      {/* COMPASSIONATE HARBOR BANNER (Relapse Prevention & Grace) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-tr from-[#FFF9F5] via-[#FAF5F0] to-[#E6D5F0]/25 border border-[#E8DED6] flex items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FFD4C4] text-[#8B261D]">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </span>
            <h4 className="font-serif text-sm font-bold text-[#2D2421]">
              "You're Still Loved" — Grace Over Shame
            </h4>
          </div>
          <p className="text-xs text-[#5C4D46] leading-relaxed">
            If you slipped or feel weary, God's mercies remain unspent. Every prayer and day collected remains eternal.
          </p>
        </div>

        <button
          onClick={() => setShowRelapseModal(true)}
          className="shrink-0 py-2.5 px-3.5 rounded-2xl bg-white border border-[#E8DED6] text-xs font-semibold text-[#2D2421] hover:bg-[#FAF5F0] transition-colors shadow-2xs"
        >
          Open Sanctuary
        </button>
      </div>

      {/* INTERACTIVE 3D COIN VAULT BANNER */}
      <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FFF8EC] to-[#FAF4E5] border border-[#E5C158]/60 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#FFF1BD] flex items-center justify-center text-[#4A3222] shadow-sm shrink-0">
            <Trophy className="w-6 h-6 text-[#5A3816]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-2 py-0.5 rounded-full border border-[#E5C158]/40">
                Interactive 3D Vault
              </span>
              <span className="text-[11px] font-medium text-[#796B64]">
                {achievedCount} of {SACRED_MILESTONES.length} Medallions Unlocked
              </span>
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D2421]">
              Sacred Recovery Medallions & Gratitude Journal
            </h3>
            <p className="text-xs text-[#796B64]">
              Inspect, flip, and write gratitude prayers on your fellowship coins.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowCoinVault(true);
            if (hapticsEnabled) triggerHaptic('soft');
          }}
          className="shrink-0 py-2.5 px-4 rounded-2xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold hover:bg-[#4A3E39] transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFD4C4]" />
          <span>Open Coin Vault</span>
        </button>
      </div>

      {/* TIMELINE OF ALL 9 SACRED MILESTONES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-serif text-base font-bold text-[#2D2421] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Sacred Milestones Timeline</span>
          </h2>
          <span className="text-xs text-[#796B64]">
            9 Milestones of Redemption
          </span>
        </div>

        <div className="space-y-3.5">
          {SACRED_MILESTONES.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              daysInGrace={daysInGrace}
              onOpenCelebration={(m) => setSelectedCelebration(m)}
              onOpenShare={(m) => setSelectedShare(m)}
            />
          ))}
        </div>
      </div>

      {/* RELAPSE / GENTLE HARBOR MODAL */}
      {showRelapseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-[36px] max-w-md w-full p-6 shadow-2xl space-y-4 text-center relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FFCAD4] to-[#FFE5D9] flex items-center justify-center mx-auto text-[#8B261D] shadow-md">
              <Heart className="w-7 h-7 fill-current" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8B261D] bg-[#FFCAD4]/40 px-3 py-1 rounded-full">
                Zero Condemnation
              </span>
              <h3 className="font-serif text-xl font-bold text-[#2D2421]">
                You Are Still Deeply Loved
              </h3>
            </div>

            <blockquote className="font-scripture italic text-sm text-[#4A3E39] bg-white p-3.5 rounded-2xl border border-[#E8DED6]">
              "For the righteous falls seven times and rises again." — Proverbs 24:16
            </blockquote>

            <p className="font-sans text-xs text-[#5C4D46] leading-relaxed text-left">
              If a stumble happened, your recovery is not erased. The days you lived clean were real, the prayers were heard, and the neural healing is in your body. Grace does not keep score. You have the freedom to reset with dignity, or to keep walking forward.
            </p>

            {/* Support Actions */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${sponsorContact.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold hover:bg-[#4A3E39] flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#FFD4C4]" />
                  <span>Call Sponsor</span>
                </a>

                <button
                  onClick={() => {
                    setShowRelapseModal(false);
                    openSos('breathe');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-xs font-semibold text-[#2D2421] hover:bg-[#F5EFEB] flex items-center justify-center gap-1.5"
                >
                  <Wind className="w-3.5 h-3.5 text-[#5A6E4B]" />
                  <span>SOS Breath</span>
                </button>
              </div>

              {/* Reset or Keep Going Options */}
              <div className="flex gap-2 pt-2 border-t border-[#E8DED6]">
                <button
                  onClick={() => setShowRelapseModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E8DED6] text-xs font-semibold text-[#796B64] hover:bg-[#FAF5F0]"
                >
                  Keep Journey Going
                </button>

                <button
                  onClick={handleRelapseReset}
                  className="flex-1 py-2.5 rounded-xl bg-[#8B261D] text-white text-xs font-semibold hover:bg-[#721C14] transition-colors"
                >
                  Reset With Grace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MILESTONE CELEBRATION MODAL */}
      {selectedCelebration && (
        <MilestoneCelebration
          milestone={selectedCelebration}
          daysInGrace={daysInGrace}
          onClose={() => setSelectedCelebration(null)}
          onOpenShare={(m) => {
            setSelectedCelebration(null);
            setSelectedShare(m);
          }}
        />
      )}

      {/* SHAREABLE GRAPHIC GENERATOR MODAL */}
      {selectedShare && (
        <ShareableGraphicGenerator
          milestone={selectedShare}
          daysInGrace={daysInGrace}
          onClose={() => setSelectedShare(null)}
        />
      )}

      {/* RECOVERY COIN VAULT MODAL (3D Tactile & Reflection) */}
      <RecoveryCoinVaultModal
        isOpen={showCoinVault}
        onClose={() => setShowCoinVault(false)}
        daysInGrace={daysInGrace}
        onOpenShare={(m) => {
          setShowCoinVault(false);
          setSelectedShare(m);
        }}
      />
    </div>
  );
};
