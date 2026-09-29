import React from 'react';
import { Phone, MessageSquare, ShieldAlert, Heart, X } from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';

export const CrisisModal: React.FC = () => {
  const { crisisModalOpen, setCrisisModalOpen } = useSacredStore();

  if (!crisisModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#FFF9F5] border border-[#E8DED6] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-dialog-title"
      >
        {/* Soft Dawn Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFD4C4] via-[#E6D5F0] to-[#C8D5B9]" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#FFD4C4]/50 text-[#9C3E32]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="crisis-dialog-title" className="font-serif text-xl text-[#2D2421] font-semibold">
                You Are Not Alone
              </h2>
              <p className="text-xs text-[#796B64]">Immediate Grace & Safe Harbor</p>
            </div>
          </div>
          <button 
            onClick={() => setCrisisModalOpen(false)}
            className="p-1.5 rounded-lg text-[#796B64] hover:bg-[#F5EFEB] transition-colors"
            aria-label="Close crisis support modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Crisis Protocol Message */}
        <div className="p-4 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] mb-6">
          <p className="font-sans text-sm sm:text-base leading-relaxed text-[#2D2421] font-medium">
            "I hear how much pain you are in, and you don’t have to carry this alone right now. Please reach out to people who can help keep you safe: Call or text <strong className="text-[#9C3E32]">988</strong> (Suicide & Crisis Lifeline) or go to the nearest emergency room. I am here to pray with you when you are safe."
          </p>
        </div>

        {/* Immediate Safe Action Buttons */}
        <div className="space-y-3 mb-6">
          <a
            href="tel:988"
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] transition-colors shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#FFD4C4]" />
              <div className="text-left">
                <span className="block text-sm font-semibold">Call 988 Lifeline</span>
                <span className="block text-xs text-[#C8D5B9]">Free, confidential, available 24/7</span>
              </div>
            </div>
            <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-md">Dial 988</span>
          </a>

          <a
            href="sms:988"
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#796B64]" />
              <div className="text-left">
                <span className="block text-sm font-semibold">Text 988 Lifeline</span>
                <span className="block text-xs text-[#796B64]">Text with a compassionate crisis counselor</span>
              </div>
            </div>
            <span className="text-xs font-mono bg-[#E8DED6]/70 px-2.5 py-1 rounded-md">Text 988</span>
          </a>

          <div className="p-3 rounded-lg bg-[#E6D5F0]/30 border border-[#E6D5F0] flex items-center gap-3">
            <Heart className="w-4 h-4 text-[#796B64] shrink-0" />
            <span className="text-xs text-[#4A3E39]">
              Crisis Text Line: Text <strong className="font-semibold text-[#2D2421]">HOME</strong> to <strong className="font-semibold text-[#2D2421]">741741</strong> anytime.
            </span>
          </div>
        </div>

        {/* Scriptural Haven Anchor */}
        <div className="text-center pt-3 border-t border-[#E8DED6]">
          <p className="font-scripture italic text-base text-[#4A3E39]">
            "The Lord is near to the brokenhearted and saves the crushed in spirit."
          </p>
          <span className="text-xs font-sans uppercase tracking-widest text-[#796B64] mt-1 block">
            Psalm 34:18
          </span>
        </div>
      </div>
    </div>
  );
};
