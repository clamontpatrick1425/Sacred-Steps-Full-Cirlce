import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, Flame, Heart, Sparkles, 
  Trash2, ShieldCheck, History, Plus
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { triggerHaptic } from '../utils/haptics';

const TRIGGER_PRESETS = [
  'Loneliness / Isolation',
  'Exhaustion / Weariness',
  'Anger / Resentment',
  'Anxiety / Fear of Future',
  'Familiar Place or Person',
  'Boredom / Restlessness',
  'Celebratory Impulse',
  'Physical Ache / Stress',
];

const OUTCOME_PRESETS = [
  'Completed 4-7-8 Breathwork',
  'Recited Grounding Scripture',
  'Called Sponsor / Safe Friend',
  'Prayed the S.T.E.P. Method',
  'Drank Cold Water & Waited 15 Min',
  'Stepped Outside for Mindful Walk',
  'Grace Prevailed — Urge Passed',
];

export const CravingLogScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { cravingLogs, addCravingLog, deleteCravingLog, hapticsEnabled, setSosActiveScreen } = useSacredStore();

  const [activeTab, setActiveTab] = useState<'log' | 'history'>('log');
  const [intensity, setIntensity] = useState<number>(6);
  const [selectedTrigger, setSelectedTrigger] = useState<string>(TRIGGER_PRESETS[0]);
  const [customTrigger, setCustomTrigger] = useState<string>('');
  const [selectedOutcome, setSelectedOutcome] = useState<string>(OUTCOME_PRESETS[0]);
  const [customOutcome, setCustomOutcome] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [justSaved, setJustSaved] = useState<boolean>(false);

  const getIntensityLabel = (val: number) => {
    if (val <= 3) return { label: 'Mild Whisper', color: 'text-[#5A6E4B]', bg: 'bg-[#C8D5B9]/40', border: 'border-[#C8D5B9]' };
    if (val <= 6) return { label: 'Rising Surge', color: 'text-[#A06020]', bg: 'bg-[#F4E4C1]/60', border: 'border-[#F4E4C1]' };
    if (val <= 8) return { label: 'Heavy Storm', color: 'text-[#B84030]', bg: 'bg-[#FFD4C4]/70', border: 'border-[#FFD4C4]' };
    return { label: 'Acute Peak Crisis', color: 'text-[#8B1E14]', bg: 'bg-[#FFCAD4]', border: 'border-[#FFCAD4]' };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTrigger = customTrigger.trim() || selectedTrigger;
    const finalOutcome = customOutcome.trim() || selectedOutcome;

    addCravingLog({
      intensity,
      trigger: finalTrigger,
      outcome: finalOutcome,
      notes: notes.trim() || undefined,
    });

    if (hapticsEnabled) triggerHaptic('step');
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setActiveTab('history');
    }, 900);
  };

  const activeIntensityMeta = getIntensityLabel(intensity);

  return (
    <div className="flex flex-col h-full text-[#2D2421]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED6]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#796B64] hover:text-[#2D2421] p-1.5 rounded-lg hover:bg-[#F5EFEB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SOS Menu</span>
        </button>

        <div className="flex items-center p-0.5 rounded-xl bg-[#F5EFEB] border border-[#E8DED6]">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'log'
                ? 'bg-white text-[#2D2421] shadow-xs'
                : 'text-[#796B64] hover:text-[#2D2421]'
            }`}
          >
            Log Storm
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeTab === 'history'
                ? 'bg-white text-[#2D2421] shadow-xs'
                : 'text-[#796B64] hover:text-[#2D2421]'
            }`}
          >
            <span>History</span>
            <span className="text-[10px] bg-[#FAF5F0] px-1.5 py-0.2 rounded-full font-mono">
              {cravingLogs.length}
            </span>
          </button>
        </div>

        <span className="text-[11px] font-sans text-[#5A6E4B] flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Private</span>
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto py-3 px-1">
        {activeTab === 'log' ? (
          <form onSubmit={handleSave} className="space-y-4 animate-in fade-in duration-200">
            {/* Intensity Slider Card */}
            <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#796B64] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#B84030]" />
                  Craving Intensity (1 - 10)
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${activeIntensityMeta.bg} ${activeIntensityMeta.color} border ${activeIntensityMeta.border}`}>
                  {intensity}/10 · {activeIntensityMeta.label}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2.5 bg-[#FAF5F0] rounded-lg appearance-none cursor-pointer accent-[#2D2421] mt-2 mb-1"
              />

              <div className="flex justify-between text-[10px] text-[#796B64] font-mono px-1">
                <span>1 (Mild whisper)</span>
                <span>5 (Noticeable urge)</span>
                <span>10 (Peak storm)</span>
              </div>
            </div>

            {/* Trigger Selector */}
            <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-4 sm:p-5 shadow-xs">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#796B64] block mb-2">
                What Triggered This Urge?
              </span>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {TRIGGER_PRESETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedTrigger(t);
                      setCustomTrigger('');
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedTrigger === t && !customTrigger
                        ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                        : 'bg-[#FAF5F0] text-[#796B64] border border-[#E8DED6] hover:text-[#2D2421]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                placeholder="Or type specific trigger..."
                className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#FFB4A2]"
              />
            </div>

            {/* Outcome / Response */}
            <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-4 sm:p-5 shadow-xs">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#796B64] block mb-2">
                How Did You Respond / Weather It?
              </span>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {OUTCOME_PRESETS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      setSelectedOutcome(o);
                      setCustomOutcome('');
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedOutcome === o && !customOutcome
                        ? 'bg-[#5A6E4B] text-white shadow-xs'
                        : 'bg-[#FAF5F0] text-[#796B64] border border-[#E8DED6] hover:text-[#2D2421]'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={customOutcome}
                onChange={(e) => setCustomOutcome(e.target.value)}
                placeholder="Or custom victory action taken..."
                className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#C8D5B9]"
              />
            </div>

            {/* Reflection Note */}
            <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-4 sm:p-5 shadow-xs">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#796B64] block mb-2">
                Personal Grace Reflection (Optional)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="How did God hold you steady? What lie did you unmask?"
                className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#FFB4A2] resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#2D2421] to-[#4A3E39] text-[#FFF9F5] font-semibold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {justSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#C8D5B9]" />
                  <span>Logged Victory in Grace!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FFD4C4]" />
                  <span>Save Craving Moment</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* History View */
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Recovery Resilience Stats Card */}
            <div className="bg-gradient-to-tr from-[#FFD4C4]/30 via-[#FFF9F5] to-[#C8D5B9]/30 rounded-3xl p-4 border border-[#E8DED6] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#5A6E4B] block">
                  Resilience Record
                </span>
                <h4 className="font-serif text-lg font-bold text-[#2D2421]">
                  {cravingLogs.length} Storms Weathered
                </h4>
                <p className="text-[11px] text-[#796B64]">
                  Every storm you survive proves that cravings have a finite crest.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DED6] flex items-center justify-center text-[#5A6E4B] shadow-2xs">
                <Heart className="w-6 h-6 fill-current" />
              </div>
            </div>

            {cravingLogs.length === 0 ? (
              <div className="p-8 text-center text-[#796B64] bg-[#FFF9F5] rounded-3xl border border-[#E8DED6]">
                <p className="text-xs">No craving moments logged yet.</p>
                <button
                  onClick={() => setActiveTab('log')}
                  className="mt-2 text-xs font-semibold text-[#2D2421] underline"
                >
                  Log your first moment
                </button>
              </div>
            ) : (
              cravingLogs.map((log) => {
                const meta = getIntensityLabel(log.intensity);
                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-2xs space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${meta.bg} ${meta.color} border ${meta.border}`}>
                          {log.intensity}/10 · {meta.label}
                        </span>
                        <span className="text-[10px] text-[#796B64]">
                          {new Date(log.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteCravingLog(log.id)}
                        className="p-1 text-[#A89B94] hover:text-[#B84030] transition-colors rounded-lg"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-[#2D2421]">
                        <strong className="text-[#796B64]">Trigger:</strong> {log.trigger}
                      </p>
                      <p className="text-[#5A6E4B] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{log.outcome}</span>
                      </p>
                      {log.notes && (
                        <p className="text-xs text-[#796B64] italic bg-[#FAF5F0] p-2 rounded-xl mt-1.5 border border-[#E8DED6]">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Bottom Switcher */}
      <div className="pt-3 border-t border-[#E8DED6] flex items-center justify-between">
        <button
          onClick={() => setSosActiveScreen('breathe')}
          className="text-xs text-[#796B64] hover:text-[#2D2421]"
        >
          &larr; Switch to Breathwork
        </button>
        <button
          onClick={() => setSosActiveScreen('connect')}
          className="text-xs text-[#796B64] hover:text-[#2D2421]"
        >
          Call Sponsor &rarr;
        </button>
      </div>
    </div>
  );
};
