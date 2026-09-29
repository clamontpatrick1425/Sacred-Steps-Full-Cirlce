import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Layers, 
  Sunrise, 
  Moon,
  Clock, 
  Compass, 
  Check,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Feather
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { DailyAnchorCard } from './DailyAnchorCard';
import { GraceDeckScreen } from './GraceDeckScreen';
import { LiturgicalRitualModal } from './LiturgicalRitualModal';

export const DailyAnchorScreen: React.FC = () => {
  const { 
    todaysAnchor, 
    graceDeck, 
    checkAndRefreshDailyAnchor,
    setActiveTab,
    activeRitualModal,
    openRitualModal,
    closeRitualModal,
    getTodaysRitual,
    notificationSchedule
  } = useSacredStore();

  const [activeSubTab, setActiveSubTab] = useState<'routine' | 'rituals' | 'graceDeck'>('routine');
  const [completeNotification, setCompleteNotification] = useState<boolean>(false);
  const todaysRitual = getTodaysRitual();

  // Midnight refresh check
  useEffect(() => {
    checkAndRefreshDailyAnchor();
    const interval = setInterval(() => {
      checkAndRefreshDailyAnchor();
    }, 30000);
    return () => clearInterval(interval);
  }, [checkAndRefreshDailyAnchor]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Navigation & Midnight indicator */}
      <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD4C4] ring-4 ring-[#FFD4C4]/40" />
            <h1 className="font-serif text-xl sm:text-2xl text-[#2D2421] font-semibold">
              Daily Anchor
            </h1>
          </div>

          {/* Sub-tab Pill: Today's Routine vs Rituals vs Grace Deck */}
          <div className="flex items-center p-1 bg-[#FAF5F0] border border-[#E8DED6] rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('routine')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                activeSubTab === 'routine'
                  ? 'bg-[#FFF9F5] text-[#2D2421] shadow-xs'
                  : 'text-[#796B64] hover:text-[#2D2421]'
              }`}
            >
              Today's Routine
            </button>
            <button
              onClick={() => setActiveSubTab('rituals')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                activeSubTab === 'rituals'
                  ? 'bg-[#FFF9F5] text-[#2D2421] shadow-xs'
                  : 'text-[#796B64] hover:text-[#2D2421]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Morning & Evening Rituals</span>
            </button>
            <button
              onClick={() => setActiveSubTab('graceDeck')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                activeSubTab === 'graceDeck'
                  ? 'bg-[#FFF9F5] text-[#2D2421] shadow-xs'
                  : 'text-[#796B64] hover:text-[#2D2421]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#D97768] fill-[#D97768]" />
              <span>Deck ({graceDeck.length})</span>
            </button>
          </div>
        </div>

        <p className="font-sans text-xs sm:text-sm text-[#796B64] leading-relaxed">
          Ground your morning before the world rushes in. Swipe through three sacred movements: 
          <strong className="text-[#2D2421]"> Prayer</strong> → 
          <strong className="text-[#2D2421]"> Bible Verse</strong> → 
          <strong className="text-[#2D2421]"> Affirmation</strong>.
        </p>

        <div className="mt-3 pt-2.5 border-t border-[#E8DED6] flex items-center justify-between text-[11px] text-[#796B64]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#A89B94]" />
            <span>Refreshes daily at midnight</span>
          </span>
          <span className="font-mono bg-[#FFF9F5] px-2 py-0.5 rounded border border-[#E8DED6]">
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Main View Router */}
      {activeSubTab === 'routine' ? (
        <div className="space-y-4">
          <DailyAnchorCard 
            card={todaysAnchor} 
            onComplete={() => {
              setCompleteNotification(true);
              setTimeout(() => setCompleteNotification(false), 3000);
            }} 
          />

          <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF9F5] to-[#FAF5F0] border border-[#E8DED6] flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#2D2421] block">
                Facing an active trigger today?
              </span>
              <span className="text-[11px] text-[#796B64]">
                Walk through the Sacred S.T.E.P. Method with The Guide.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('guide')}
              className="px-3.5 py-1.5 rounded-lg bg-[#FAF5F0] border border-[#E8DED6] text-xs text-[#2D2421] hover:bg-[#F5EFEB] font-medium transition-colors shrink-0"
            >
              Open S.T.E.P.
            </button>
          </div>
        </div>
      ) : activeSubTab === 'rituals' ? (
        /* Liturgical Rhythm Dashboard */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Morning "Dawn Offering" Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5F0] to-[#FFD4C4]/20 border border-[#E8DED6] shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFD4C4] to-[#F4E4C1] flex items-center justify-center text-[#7A5B0B] shadow-2xs">
                  <Sunrise className="w-5 h-5 text-[#8A4F1D]" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5B0B] bg-[#FFF2D6] px-2 py-0.5 rounded-full border border-[#E5C158]/40">
                      Sacred Morning
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      todaysRitual.morningCompleted ? 'bg-[#C8D5B9]/40 text-[#3C6432]' : 'bg-[#FAF5F0] text-[#796B64] border border-[#E8DED6]'
                    }`}>
                      {todaysRitual.morningCompleted ? '✓ Completed Today' : 'Pending Today'}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#2D2421] mt-1">
                    Morning "Dawn Offering"
                  </h3>
                </div>
              </div>

              <button
                onClick={() => openRitualModal('morning')}
                className="py-1.5 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
              >
                <span>{todaysRitual.morningCompleted ? 'Review' : 'Begin'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#5C4D46] leading-relaxed">
              Focus on setting spiritual intention, receiving the daily anchor scripture, and identifying one lie to surrender before the day begins.
            </p>

            {todaysRitual.morningCompleted && (
              <div className="p-3 bg-white rounded-2xl border border-[#E8DED6] text-xs space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E4B]">Today's Consecrated Offering:</p>
                <p className="text-[#2D2421] font-medium italic">"{todaysRitual.morningIntention}"</p>
                <p className="text-[11px] text-[#8B261D] pt-1">Surrendered: "{todaysRitual.morningLieToSurrender}"</p>
              </div>
            )}
          </div>

          {/* Evening "Grace Review" (Christian Examen) Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF5F0] to-[#E6D5F0]/25 border border-[#E8DED6] shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E6D5F0] to-[#D5C7BD] flex items-center justify-center text-[#543864] shadow-2xs">
                  <Moon className="w-5 h-5 text-[#543864]" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#543864] bg-[#E6D5F0]/40 px-2 py-0.5 rounded-full border border-[#D5BEE3]/50">
                      Sacred Evening
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      todaysRitual.eveningCompleted ? 'bg-[#C8D5B9]/40 text-[#3C6432]' : 'bg-[#FAF5F0] text-[#796B64] border border-[#E8DED6]'
                    }`}>
                      {todaysRitual.eveningCompleted ? '✓ Completed Today' : 'Pending Tonight'}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#2D2421] mt-1">
                    Evening "Grace Review" (Christian Examen)
                  </h3>
                </div>
              </div>

              <button
                onClick={() => openRitualModal('evening')}
                className="py-1.5 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
              >
                <span>{todaysRitual.eveningCompleted ? 'Review' : 'Begin'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#5C4D46] leading-relaxed">
              A 3-minute evening reflection allowing you to acknowledge God’s presence throughout your day, release any guilt or slip-ups without shame, and rest in peace.
            </p>

            {todaysRitual.eveningCompleted && (
              <div className="p-3 bg-white rounded-2xl border border-[#E8DED6] text-xs space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#543864]">Tonight's Examen Reflection:</p>
                <p className="text-[#2D2421] font-medium italic">"{todaysRitual.eveningPeaceBenediction}"</p>
              </div>
            )}
          </div>

          {/* Scheduled Gentle Reminders Quick Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8DED6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#FFF2D6] text-[#7A5B0B]">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <span className="font-serif text-xs font-bold text-[#2D2421] block">
                  Scheduled Gentle Reminders & Bell
                </span>
                <span className="text-[11px] text-[#796B64]">
                  Morning {notificationSchedule.morningTime} · Evening {notificationSchedule.eveningTime}
                </span>
              </div>
            </div>

            <button
              onClick={() => openRitualModal('settings')}
              className="py-1.5 px-3 rounded-xl border border-[#E8DED6] text-xs font-semibold text-[#2D2421] hover:bg-[#FAF5F0]"
            >
              Configure
            </button>
          </div>
        </div>
      ) : (
        <GraceDeckScreen onNavigateToToday={() => setActiveSubTab('routine')} />
      )}

      {/* Floating Complete Routine Alert */}
      {completeNotification && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
          <span>Routine complete. Walk in peace and grace today.</span>
        </div>
      )}

      {/* Liturgical Rituals Modal */}
      <LiturgicalRitualModal
        isOpen={activeRitualModal !== null}
        onClose={closeRitualModal}
        initialTab={activeRitualModal || 'morning'}
      />
    </div>
  );
};
