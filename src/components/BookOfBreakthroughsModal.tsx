/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — "Book of Breakthroughs" Spiritual Memoir & PDF Export
 */

import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Trophy,
  Check,
  Feather
} from 'lucide-react';
import { useSacredStore, JournalItem } from '../store/useSacredStore';
import { SACRED_MILESTONES } from '../data/milestoneData';
import { triggerHaptic } from '../utils/haptics';

interface BookOfBreakthroughsModalProps {
  isOpen: boolean;
  onClose: () => void;
  decryptedEntries: { [id: string]: string };
}

export const BookOfBreakthroughsModal: React.FC<BookOfBreakthroughsModalProps> = ({
  isOpen,
  onClose,
  decryptedEntries
}) => {
  const { 
    journalEntries, 
    savedBreakthroughs, 
    milestoneReflections, 
    getDaysInGrace, 
    cleanStartDate,
    hapticsEnabled 
  } = useSacredStore();

  const printAreaRef = useRef<HTMLDivElement>(null);
  const daysInGrace = getDaysInGrace();

  if (!isOpen) return null;

  const handlePrint = () => {
    if (hapticsEnabled) triggerHaptic('soft');
    window.print();
  };

  const handleDownloadTxt = () => {
    if (hapticsEnabled) triggerHaptic('step');
    const sections: string[] = [];
    sections.push("=====================================================");
    sections.push("SACRED STEPS: BOOK OF BREAKTHROUGHS & SPIRITUAL MEMOIR");
    sections.push("Based on 'Sacred Steps to Redemption' by C. Lamont Patrick");
    sections.push(`Clean & Serene Since: ${new Date(cleanStartDate).toLocaleDateString()}`);
    sections.push(`Days Walking in Sovereign Grace: ${daysInGrace} Days`);
    sections.push("=====================================================\n");

    sections.push("--- CHAPTER I: 12-STEP ENCRYPTED REFLECTIONS ---");
    journalEntries.forEach((entry, i) => {
      sections.push(`\n[Entry ${i + 1}] ${entry.title}`);
      if (entry.stepNumber) sections.push(`12-Step Level: Step ${entry.stepNumber}`);
      sections.push(`Date: ${new Date(entry.date).toLocaleDateString()}`);
      if (entry.stepPrompt) sections.push(`Guided Prompt: "${entry.stepPrompt}"`);
      sections.push(`Reflection:\n${decryptedEntries[entry.id] || '(Encrypted)'}\n`);
    });

    sections.push("\n--- CHAPTER II: SAVED S.T.E.P. BREAKTHROUGHS ---");
    savedBreakthroughs.forEach((b, i) => {
      sections.push(`\n[Breakthrough ${i + 1}] Category: ${b.triggerCategory}`);
      sections.push(`User Struggle: "${b.userStruggle}"`);
      sections.push(`(S) Scripture: ${b.scripture.reference} - "${b.scripture.text}"`);
      sections.push(`(T) Dismantling Truth: ${b.truth.statement}`);
      sections.push(`(E) Embrace Affirmation: "${b.embrace.affirmation}"`);
      sections.push(`(P) Practice Micro-Step: ${b.practice.microStep}`);
      sections.push(`Date Saved: ${new Date(b.timestamp).toLocaleDateString()}\n`);
    });

    sections.push("\n=====================================================");
    sections.push("A Path to Recovery, A Life in Grace · C. Lamont Patrick");
    sections.push("=====================================================");

    const blob = new Blob([sections.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sacred-steps-book-of-breakthroughs-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF5F0] border border-[#E8DED6] rounded-[32px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Action Toolbar */}
        <div className="p-4 bg-[#FFF9F5] border-b border-[#E8DED6] flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#E6D5F0] text-[#2D2421]">
              <BookOpen className="w-4 h-4 text-[#70427D]" />
            </span>
            <div className="text-left">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D2421]">
                Book of Breakthroughs (Memoir Export)
              </h3>
              <p className="text-[11px] text-[#796B64]">
                Printable Spiritual Recovery Archive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFD4C4]" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="py-1.5 px-3 rounded-xl bg-white border border-[#E8DED6] hover:bg-[#F5EFEB] text-xs font-semibold text-[#2D2421] flex items-center gap-1.5 shadow-2xs"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5 text-[#796B64]" />
              <span className="hidden sm:inline">Export Text</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#E8DED6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div ref={printAreaRef} className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-white text-[#2D2421] print:p-0">
          {/* Memoir Cover & Title Page */}
          <div className="text-center space-y-3 pb-8 border-b-2 border-[#2D2421]/15">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#7A5B0B] bg-[#FFF2D6] px-3.5 py-1 rounded-full border border-[#E5C158]/50">
              Personal Recovery Chronicle
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2421] tracking-tight">
              The Book of Breakthroughs
            </h1>
            <p className="font-serif italic text-sm text-[#796B64]">
              A Prayerful Path from Darkness to Divine Grace
            </p>
            <div className="pt-2 text-xs text-[#796B64] space-y-1">
              <p>
                Anchored in the teachings of <strong>C. Lamont Patrick</strong>
              </p>
              <p>
                Author of <em>Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery</em>
              </p>
            </div>

            {/* Journey Stats Badge */}
            <div className="inline-flex items-center gap-4 bg-[#FAF5F0] border border-[#E8DED6] rounded-2xl py-2 px-5 text-xs text-[#4A3E39] mt-3">
              <div>
                <span className="block text-[10px] text-[#796B64] uppercase font-bold">Clean Date</span>
                <span className="font-bold">{new Date(cleanStartDate).toLocaleDateString()}</span>
              </div>
              <div className="h-6 w-px bg-[#D5C7BD]" />
              <div>
                <span className="block text-[10px] text-[#796B64] uppercase font-bold">Sovereign Freedom</span>
                <span className="font-bold">{daysInGrace} Days in Grace</span>
              </div>
              <div className="h-6 w-px bg-[#D5C7BD]" />
              <div>
                <span className="block text-[10px] text-[#796B64] uppercase font-bold">12-Step Reflections</span>
                <span className="font-bold">{journalEntries.length} Recorded</span>
              </div>
            </div>
          </div>

          {/* Section 1: 12-Step Journal Reflections */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[#E8DED6] pb-2">
              <Feather className="w-4 h-4 text-[#8B261D]" />
              <h2 className="font-serif text-lg font-bold text-[#2D2421]">
                Chapter I: 12-Step Guided Reflections
              </h2>
            </div>

            {journalEntries.length === 0 ? (
              <p className="text-xs text-[#796B64] italic">
                No entries recorded yet. Begin your reflections in the 12-Step Vault.
              </p>
            ) : (
              <div className="space-y-6">
                {journalEntries.map((entry, idx) => (
                  <div key={entry.id} className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#796B64]">
                      <div className="flex items-center gap-2">
                        {entry.stepNumber && (
                          <span className="bg-[#2D2421] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Step {entry.stepNumber}
                          </span>
                        )}
                        <span className="font-semibold text-[#2D2421]">Entry #{idx + 1}</span>
                      </div>
                      <span>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#2D2421]">
                      {entry.title}
                    </h3>

                    {entry.stepPrompt && (
                      <p className="text-xs text-[#5A6E4B] italic bg-white p-2.5 rounded-xl border border-[#E8DED6]">
                        "{entry.stepPrompt}"
                      </p>
                    )}

                    <div className="text-xs font-sans leading-relaxed text-[#3D332F] whitespace-pre-wrap pt-1">
                      {decryptedEntries[entry.id] || '(Encrypted reflection - unlock vault to view)'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Saved S.T.E.P. Breakthroughs */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 border-b border-[#E8DED6] pb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-[#2D2421]">
                Chapter II: Sacred S.T.E.P.™ Breakthroughs
              </h2>
            </div>

            {savedBreakthroughs.length === 0 ? (
              <p className="text-xs text-[#796B64] italic">
                No breakthroughs bookmarked yet. Save moments of victory during your S.T.E.P. sessions.
              </p>
            ) : (
              <div className="space-y-4">
                {savedBreakthroughs.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] space-y-2 text-xs">
                    <div className="flex justify-between font-medium text-[#796B64]">
                      <span className="font-bold text-[#2D2421]">{b.triggerCategory}</span>
                      <span>{new Date(b.timestamp).toLocaleDateString()}</span>
                    </div>

                    <p className="text-[#554742] italic">"{b.userStruggle}"</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="bg-white p-2.5 rounded-xl border border-[#E8DED6]">
                        <strong className="text-[#7A5B0B] block text-[10px] uppercase font-bold">(S) Scripture</strong>
                        <p className="italic">{b.scripture.reference}: "{b.scripture.text}"</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-[#E8DED6]">
                        <strong className="text-[#8B261D] block text-[10px] uppercase font-bold">(T) Truth</strong>
                        <p>{b.truth.statement}</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-[#E8DED6]">
                        <strong className="text-[#70427D] block text-[10px] uppercase font-bold">(E) Embrace</strong>
                        <p className="font-serif italic font-bold">"{b.embrace.affirmation}"</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-[#E8DED6]">
                        <strong className="text-[#3F522C] block text-[10px] uppercase font-bold">(P) Practice</strong>
                        <p>{b.practice.microStep}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Memoir Footer */}
          <div className="pt-8 border-t border-[#E8DED6] text-center space-y-1 text-xs text-[#796B64]">
            <p className="font-serif italic text-sm text-[#2D2421]">
              "My grace is sufficient for you, for my power is made perfect in weakness." — 2 Corinthians 12:9
            </p>
            <p>
              SacredSteps: Daily Grace · The Sacred S.T.E.P. Method™ · C. Lamont Patrick
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
