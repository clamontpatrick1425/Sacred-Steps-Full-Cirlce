import React, { useState } from 'react';
import { 
  Heart, 
  Layers, 
  Volume2, 
  Trash2, 
  Sunrise, 
  BookOpen, 
  Sparkles, 
  Share2, 
  ArrowRight, 
  Check, 
  Plus 
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { DailyContent } from '../data/dailyAnchorData';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface GraceDeckScreenProps {
  onNavigateToToday?: () => void;
}

export const GraceDeckScreen: React.FC<GraceDeckScreenProps> = ({ onNavigateToToday }) => {
  const { 
    graceDeck, 
    removeGraceDeckItem, 
    setActiveTab, 
    hapticsEnabled 
  } = useSacredStore();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<DailyContent | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(graceDeck.map((c) => c.affirmation.category)))];

  const filteredCards = filterCategory === 'all' 
    ? graceDeck 
    : graceDeck.filter((c) => c.affirmation.category === filterCategory);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeGraceDeckItem(id);
    if (hapticsEnabled) triggerHaptic('soft');
    if (selectedCard?.id === id) setSelectedCard(null);
  };

  const handleShareCard = (card: DailyContent, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `SacredSteps Grace Deck Card\n\n"${card.verse.text}" — ${card.verse.reference}\n\nAffirmation: "${card.affirmation.text}"\n\nA Path to Recovery, A Life in Grace.`;
    navigator.clipboard.writeText(text);
    if (hapticsEnabled) triggerHaptic('soft');
    setNotificationMsg('Grace Deck card copied to clipboard');
    setTimeout(() => setNotificationMsg(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97768] ring-4 ring-[#D97768]/30" />
            <h1 className="font-serif text-xl sm:text-2xl text-[#2D2421] font-semibold">
              The Grace Deck
            </h1>
          </div>

          <button
            onClick={onNavigateToToday}
            className="px-3.5 py-1.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sunrise className="w-3.5 h-3.5 text-[#FFD4C4]" />
            <span>Today's Anchor</span>
          </button>
        </div>

        <p className="font-sans text-xs sm:text-sm text-[#796B64] leading-relaxed">
          Your personal sanctuary collection of treasured prayers, sacred scriptures, and spoken affirmations from morning routines.
        </p>

        {/* Categories Bar */}
        {categories.length > 2 && (
          <div className="mt-4 pt-3 border-t border-[#E8DED6] flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-xs px-3 py-1 rounded-lg capitalize whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-[#2D2421] text-[#FFF9F5] font-medium'
                    : 'bg-[#FAF5F0] text-[#796B64] hover:text-[#2D2421] border border-[#E8DED6]'
                }`}
              >
                {cat === 'all' ? `All Cards (${graceDeck.length})` : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cards List or Empty State */}
      {graceDeck.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-[#FFF9F5] border border-[#E8DED6] text-[#796B64] space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FFD4C4]/40 text-[#D97768] flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 fill-[#D97768]/20" />
          </div>
          <h2 className="font-serif text-xl text-[#2D2421] font-semibold">
            Your Grace Deck is Waiting
          </h2>
          <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            During your morning anchor routine, tap the heart icon on any card to save cherished prayers and scriptures here for quick access when you need strength.
          </p>
          <button
            onClick={onNavigateToToday}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39] transition-all shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Begin Today's Morning Anchor</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FFD4C4]" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#796B64] px-1">
            <span>Showing {filteredCards.length} saved {filteredCards.length === 1 ? 'anchor' : 'anchors'}</span>
            <span>Tap card to view full prayer</span>
          </div>

          <div className="space-y-3">
            {filteredCards.map((card) => {
              const isSelected = selectedCard?.id === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(isSelected ? null : card)}
                  className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#FFF9F5] border-[#2D2421] shadow-md ring-1 ring-[#2D2421]'
                      : 'bg-[#FFF9F5] border-[#E8DED6] shadow-sm hover:border-[#D5C7BD]'
                  }`}
                >
                  {/* Subtle soft dawn edge indicator */}
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FFD4C4] via-[#E6D5F0] to-[#C8D5B9]" />

                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4 mb-3 pl-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E6D5F0]/60 text-[#3E2B52] text-[10px] font-semibold uppercase tracking-wider">
                          {card.affirmation.category}
                        </span>
                        <span className="text-[11px] text-[#796B64]">
                          {card.date}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg text-[#2D2421] font-semibold">
                        {card.prayer.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sanctuaryAudio.speakScripture(`${card.verse.reference}. ${card.verse.text}`);
                        }}
                        className="p-1.5 rounded-lg text-[#796B64] hover:text-[#2D2421] hover:bg-[#FAF5F0] transition-colors"
                        title="Listen to scripture"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleShareCard(card, e)}
                        className="p-1.5 rounded-lg text-[#796B64] hover:text-[#2D2421] hover:bg-[#FAF5F0] transition-colors"
                        title="Copy text"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleRemove(card.id, e)}
                        className="p-1.5 rounded-lg text-[#A89B94] hover:text-[#D97768] hover:bg-[#FAF5F0] transition-colors"
                        title="Remove from deck"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scripture Quote */}
                  <blockquote className="font-scripture italic text-lg sm:text-xl text-[#2D2421] mb-2 pl-4 border-l-2 border-[#FFD4C4]">
                    "{card.verse.text}"
                  </blockquote>
                  <div className="text-right mb-3 pl-2">
                    <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#796B64]">
                      — {card.verse.reference} ({card.verse.translation})
                    </span>
                  </div>

                  {/* Spoken Affirmation */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] text-xs sm:text-sm text-[#2D2421] pl-4">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-[#796B64] block mb-0.5">
                      Spoken Affirmation:
                    </span>
                    <p className="font-serif italic text-sm text-[#2D2421]">
                      "{card.affirmation.text}"
                    </p>
                  </div>

                  {/* Expanded Full Prayer Section */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-[#E8DED6] pl-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sunrise className="w-4 h-4 text-[#7C3626]" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#796B64]">
                          Morning Prayer ({card.prayer.source})
                        </span>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-[#4A3E39] leading-relaxed bg-white/70 p-4 rounded-2xl border border-[#E8DED6]">
                        {card.prayer.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Notification */}
      {notificationMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
          <span>{notificationMsg}</span>
        </div>
      )}
    </div>
  );
};
