/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — App Footer
 * Provides intuitive, persistent access to Privacy Policy and Terms and Conditions popups,
 * 988 Crisis Lifeline, and Zero-Knowledge security notices.
 */

import React from 'react';
import { ShieldCheck, Scale, PhoneCall, Lock, Heart, Sparkles } from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { triggerHaptic } from '../utils/haptics';

interface AppFooterProps {
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  className?: string;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onOpenLegal, className = '' }) => {
  const { setCrisisModalOpen } = useSacredStore();

  const handleOpen = (type: 'privacy' | 'terms') => {
    triggerHaptic('soft');
    onOpenLegal(type);
  };

  const handleCrisis = () => {
    triggerHaptic('pulse');
    setCrisisModalOpen(true);
  };

  return (
    <footer className={`mt-10 pt-6 pb-8 border-t border-[#E8DED6]/80 text-center space-y-4 ${className}`}>
      {/* Legal & Safety Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
        <button
          onClick={() => handleOpen('privacy')}
          className="px-3 py-1.5 rounded-full bg-[#FFF9F5] border border-[#E8DED6] hover:border-[#2D2421] text-[#4A3E39] hover:text-[#2D2421] transition-all flex items-center gap-1.5 shadow-2xs group"
          aria-label="Open Privacy Policy Popup"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#5A6E4B] group-hover:scale-110 transition-transform" />
          <span className="font-medium">Privacy Policy</span>
        </button>

        <span className="text-[#C5B8AF] hidden sm:inline">•</span>

        <button
          onClick={() => handleOpen('terms')}
          className="px-3 py-1.5 rounded-full bg-[#FFF9F5] border border-[#E8DED6] hover:border-[#2D2421] text-[#4A3E39] hover:text-[#2D2421] transition-all flex items-center gap-1.5 shadow-2xs group"
          aria-label="Open Terms and Conditions Popup"
        >
          <Scale className="w-3.5 h-3.5 text-[#9C3E32] group-hover:scale-110 transition-transform" />
          <span className="font-medium">Terms & Conditions</span>
        </button>

        <span className="text-[#C5B8AF] hidden sm:inline">•</span>

        <button
          onClick={handleCrisis}
          className="px-3 py-1.5 rounded-full bg-[#FFD4C4]/40 hover:bg-[#FFD4C4]/70 border border-[#E8A598] text-[#7C3626] transition-all flex items-center gap-1.5 shadow-2xs font-medium"
          aria-label="Open Emergency Crisis Lifeline"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Lifeline 988</span>
        </button>
      </div>

      {/* Security & Non-Medical Assurance Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#796B64]">
        <span className="inline-flex items-center gap-1">
          <Lock className="w-3 h-3 text-[#5A6E4B]" />
          <span>Zero-Knowledge AES-256 Vault</span>
        </span>
        <span className="text-[#C5B8AF]">•</span>
        <span className="inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#C4A9D8]" />
          <span>On-Device Pattern Analysis</span>
        </span>
        <span className="text-[#C5B8AF]">•</span>
        <span className="inline-flex items-center gap-1">
          <Heart className="w-3 h-3 text-[#D97768]" />
          <span>Not Medical Advice</span>
        </span>
      </div>

      {/* Copyright & Faith Statement */}
      <div className="space-y-1">
        <p className="font-serif text-xs text-[#2D2421]">
          © {new Date().getFullYear()} SacredSteps: Daily Grace · C. Lamont Patrick
        </p>
        <p className="font-sans text-[11px] text-[#796B64]">
          The Sacred S.T.E.P. Method™ · A Path to Recovery, A Life in Grace
        </p>
      </div>
    </footer>
  );
};
