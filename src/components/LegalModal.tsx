/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — Legal & Privacy Popup Modal
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Printer, 
  AlertTriangle, 
  Lock, 
  ExternalLink, 
  ChevronRight,
  Heart,
  Scale
} from 'lucide-react';
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS, LegalDocument, LegalSection } from '../data/legalDocuments';
import { triggerHaptic } from '../utils/haptics';

export type LegalDocType = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  initialType?: LegalDocType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialType = 'privacy',
  onClose
}) => {
  const [activeType, setActiveType] = useState<LegalDocType>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial type when opening
  useEffect(() => {
    if (isOpen) {
      setActiveType(initialType);
      setSearchQuery('');
      setCopied(false);
    }
  }, [isOpen, initialType]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const currentDoc: LegalDocument = useMemo(() => {
    return activeType === 'privacy' ? PRIVACY_POLICY : TERMS_AND_CONDITIONS;
  }, [activeType]);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return currentDoc.sections;
    const q = searchQuery.toLowerCase();
    return currentDoc.sections.filter((sec) => {
      const matchTitle = sec.title.toLowerCase().includes(q);
      const matchSummary = sec.summary.toLowerCase().includes(q);
      const matchContent = sec.content.some((p) => p.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchContent;
    });
  }, [currentDoc, searchQuery]);

  const handleCopyDoc = async () => {
    triggerHaptic('soft');
    const fullText = [
      `${currentDoc.title} — ${currentDoc.subtitle}`,
      `Last Updated: ${currentDoc.lastUpdated} | Effective Date: ${currentDoc.effectiveDate}`,
      `Badge: ${currentDoc.badge}`,
      `\n${currentDoc.intro}\n`,
      ...currentDoc.sections.map((sec) => {
        return `\n${sec.title}\n${sec.summary}\n${sec.content.join('\n')}\n`;
      })
    ].join('\n');

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    triggerHaptic('soft');
    window.print();
  };

  const handleScrollToSection = (sectionId: string) => {
    triggerHaptic('soft');
    const el = document.getElementById(`legal-sec-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div 
        className="bg-[#FFF9F5] w-full max-w-3xl max-h-[92vh] rounded-[28px] border border-[#E8DED6] shadow-2xl flex flex-col overflow-hidden text-left relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & Tab Switcher */}
        <div className="bg-gradient-to-r from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border-b border-[#E8DED6] px-5 sm:px-7 pt-5 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#2D2421] text-[#FFF9F5]">
                {activeType === 'privacy' ? <ShieldCheck className="w-5 h-5 text-[#C8D5B9]" /> : <Scale className="w-5 h-5 text-[#FFD4C4]" />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#796B64]">
                    Official Legal Covenant
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#796B64]" />
                  <span className="text-[10px] text-[#5A6E4B] font-medium">
                    Updated {currentDoc.lastUpdated}
                  </span>
                </div>
                <h2 id="legal-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#2D2421]">
                  {currentDoc.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleCopyDoc}
                className="px-2.5 py-1.5 rounded-xl border border-[#E8DED6] bg-white text-[#796B64] hover:text-[#2D2421] hover:bg-[#FAF5F0] transition-colors text-xs flex items-center gap-1.5 shadow-2xs"
                title="Copy Full Legal Text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#5A6E4B]" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#E8DED6] bg-white text-[#796B64] hover:text-[#2D2421] hover:bg-[#FAF5F0] transition-colors text-xs flex items-center gap-1.5 shadow-2xs"
                title="Print Document"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#E8DED6]/50 transition-colors"
                aria-label="Close legal modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#E8DED6]/40 p-1 rounded-2xl w-full sm:w-auto self-start">
            <button
              onClick={() => {
                setActiveType('privacy');
                triggerHaptic('soft');
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeType === 'privacy'
                  ? 'bg-white text-[#2D2421] shadow-xs'
                  : 'text-[#796B64] hover:text-[#2D2421]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A6E4B]" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => {
                setActiveType('terms');
                triggerHaptic('soft');
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeType === 'terms'
                  ? 'bg-white text-[#2D2421] shadow-xs'
                  : 'text-[#796B64] hover:text-[#2D2421]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#9C3E32]" />
              <span>Terms & Conditions</span>
            </button>
          </div>

          {/* Quick Search & Pill Bar */}
          <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#796B64] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${currentDoc.title} (e.g. encryption, medical, sponsor, 988)...`}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E8DED6] bg-white text-xs text-[#2D2421] placeholder-[#A89B94] focus:outline-hidden focus:ring-1 focus:ring-[#2D2421]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#796B64] hover:text-[#2D2421]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
              <span className="text-[10px] text-[#796B64] uppercase font-bold shrink-0">
                Jump to:
              </span>
              {currentDoc.sections.slice(0, 4).map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollToSection(sec.id)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#E8DED6] hover:border-[#2D2421] hover:text-[#2D2421] text-[#796B64] whitespace-nowrap transition-colors shadow-2xs"
                >
                  {sec.title.split('.')[1]?.trim() || sec.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6 text-[#2D2421]"
        >
          {/* Top Trust Badge & Summary Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#F5EFEB] border border-[#E8DED6] space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#2D2421] text-[#FFF9F5] flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#FFD4C4]" />
                <span>{currentDoc.badge}</span>
              </span>
              <span className="text-xs text-[#796B64]">
                Effective: {currentDoc.effectiveDate}
              </span>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-[#4A3E39] leading-relaxed">
              "{currentDoc.intro}"
            </p>
          </div>

          {/* Special Critical Callouts */}
          {activeType === 'privacy' ? (
            <div className="p-4 rounded-2xl bg-[#C8D5B9]/25 border border-[#C8D5B9] flex items-start gap-3 text-xs leading-relaxed text-[#243317]">
              <ShieldCheck className="w-5 h-5 text-[#5A6E4B] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm text-[#1A2610]">
                  Zero-Knowledge Guarantee
                </strong>
                SacredSteps runs on client-side Web Crypto AES-GCM 256-bit cryptography. We possess no master decryption keys or backdoors. Your recovery thoughts remain strictly between you, God, and the trusted people you explicitly choose to invite.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FFD4C4]/35 border border-[#E8A598] flex items-start gap-3 text-xs leading-relaxed text-[#5C2318]">
              <AlertTriangle className="w-5 h-5 text-[#9C3E32] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm text-[#4A1910]">
                  Emergency & Non-Medical Notice
                </strong>
                This application is a spiritual devotional companion, NOT a substitute for licensed healthcare, medical detox, or psychiatric treatment. If you are experiencing acute withdrawal or suicidal thoughts, call or text <strong>988</strong> immediately.
              </div>
            </div>
          )}

          {/* Section List */}
          {filteredSections.length === 0 ? (
            <div className="py-12 text-center text-[#796B64] space-y-2">
              <p className="text-sm">No sections match your search "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#2D2421] font-semibold underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => (
              <section 
                key={sec.id} 
                id={`legal-sec-${sec.id}`}
                className="scroll-mt-4 p-5 rounded-2xl bg-white border border-[#E8DED6] shadow-2xs space-y-3 transition-colors hover:border-[#D5C7BD]"
              >
                <div className="border-b border-[#FAF5F0] pb-2.5">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D2421] flex items-center justify-between">
                    <span>{sec.title}</span>
                  </h3>
                  <p className="text-xs text-[#5A6E4B] font-medium mt-0.5">
                    {sec.summary}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-[#4A3E39] leading-relaxed font-sans">
                  {sec.content.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Bottom Lifeline / Support Banner */}
          <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#796B64]">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#D97768]" />
              <span>Questions or rights requests? Contact <strong>privacy@sacredstepsrecovery.com</strong></span>
            </div>
            <button
              onClick={() => {
                setActiveType(activeType === 'privacy' ? 'terms' : 'privacy');
                triggerHaptic('soft');
              }}
              className="text-xs font-semibold text-[#2D2421] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View {activeType === 'privacy' ? 'Terms & Conditions' : 'Privacy Policy'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Bottom Sticky Controls */}
        <div className="bg-[#FFF9F5] border-t border-[#E8DED6] px-5 sm:px-7 py-3.5 shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-[#796B64] hidden sm:block">
            SacredSteps: Daily Grace · The Sacred S.T.E.P. Method™
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold hover:bg-[#4A3E39] transition-all shadow-sm"
            >
              Understood & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
