/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useSacredStore } from './store/useSacredStore';
import { PhoneFrame } from './components/PhoneFrame';
import { SanctuaryHome } from './components/SanctuaryHome';
import { DailyAnchorScreen } from './components/DailyAnchorScreen';
import { Interactive12StepJournal } from './components/Interactive12StepJournal';
import { StepGuideScreen } from './components/StepGuideScreen';
import { JournalHome } from './components/JournalHome';
import { MilestoneTrackerHome } from './components/MilestoneTrackerHome';
import { RNBlueprintViewer } from './components/RNBlueprintViewer';
import { BottomNavBar } from './components/BottomNavBar';
import { CrisisModal } from './components/CrisisModal';
import { LegalModal } from './components/LegalModal';
import { AppFooter } from './components/AppFooter';
import { SOSFloatingButton } from './components/SOSFloatingButton';
import { SOSMenu } from './components/SOSMenu';
import { MurfVoiceSettingsModal } from './components/MurfVoiceSettingsModal';
import { GlobalAudioBar } from './components/GlobalAudioBar';
import { readSponsorShareFromHash, SponsorShareData } from './services/encryptionService';
import { BookOpen, ShieldCheck, X } from 'lucide-react';

export default function App() {
  const { activeTab, legalModal, openLegalModal, closeLegalModal } = useSacredStore();
  const [sponsorShareData, setSponsorShareData] = useState<SponsorShareData | null>(null);

  // Check if opened via a sponsor share link (#sponsor-entry=...)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('sponsor-entry=')) {
      readSponsorShareFromHash(window.location.hash).then((data) => {
        if (data) {
          setSponsorShareData(data);
        }
      });
    }
  }, []);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'sanctuary':
        return <SanctuaryHome />;
      case 'anchor':
        return <DailyAnchorScreen />;
      case 'stepJournal':
        return <Interactive12StepJournal />;
      case 'guide':
        return <StepGuideScreen />;
      case 'journal':
        return <JournalHome />;
      case 'milestones':
        return <MilestoneTrackerHome />;
      case 'blueprint':
        return <RNBlueprintViewer />;
      default:
        return <SanctuaryHome />;
    }
  };

  return (
    <PhoneFrame>
      <div className="pb-24">
        {renderActiveScreen()}
        <AppFooter onOpenLegal={openLegalModal} />
      </div>
      <BottomNavBar />
      <CrisisModal />
      <LegalModal
        isOpen={legalModal !== null}
        initialType={legalModal || 'privacy'}
        onClose={closeLegalModal}
      />
      <SOSFloatingButton />
      <SOSMenu />
      <MurfVoiceSettingsModal />
      <GlobalAudioBar />

      {/* Sponsor Shared Entry Overlay if viewing via secure link */}
      {sponsorShareData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF9F5] max-w-lg w-full rounded-3xl border border-[#E8DED6] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-[#E8DED6] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#E6D5F0]/60 text-[#2D2421]">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                    Sponsor Review Link
                  </h4>
                  <p className="text-[10px] text-[#5A6E4B] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>End-to-End Decrypted</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSponsorShareData(null)}
                className="p-1 text-[#796B64] hover:text-[#2D2421] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {sponsorShareData.stepNumber && (
                <span className="bg-[#2D2421] text-[#FFF9F5] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                  Step {sponsorShareData.stepNumber}
                </span>
              )}
              <h3 className="font-serif text-base font-bold text-[#2D2421]">
                {sponsorShareData.title}
              </h3>
              {sponsorShareData.stepPrompt && (
                <p className="text-xs text-[#5A6E4B] italic bg-white p-2.5 rounded-xl border border-[#E8DED6]">
                  "{sponsorShareData.stepPrompt}"
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] font-sans text-xs leading-relaxed text-[#2D2421] whitespace-pre-wrap">
              {sponsorShareData.content}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#796B64] pt-2">
              <span>Shared: {new Date(sponsorShareData.sharedAt).toLocaleDateString()}</span>
              <button
                onClick={() => setSponsorShareData(null)}
                className="px-4 py-1.5 bg-[#2D2421] text-[#FFF9F5] rounded-xl text-xs font-medium"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
