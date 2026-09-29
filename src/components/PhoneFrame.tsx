import React from 'react';
import { Smartphone, Monitor, Wifi, Battery, Volume2, VolumeX, ShieldCheck, Scale } from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { deviceMockup, toggleDeviceMockup, soundEnabled, toggleSound, openLegalModal } = useSacredStore();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!deviceMockup) {
    return (
      <div className="min-h-screen bg-[#FAF5F0] text-[#2D2421]">
        {/* Top Desktop Navigation & Controls Bar */}
        <header className="sticky top-0 z-40 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-[#E8DED6] px-4 sm:px-8 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FFD4C4] via-[#E6D5F0] to-[#C8D5B9] flex items-center justify-center text-xs font-serif font-bold text-[#2D2421] shadow-xs">
                S
              </span>
              <div>
                <span className="font-serif text-base font-semibold text-[#2D2421] block leading-none">
                  Sacred Steps Daily Grace
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#796B64] font-medium">
                  Your Daily Sanctuary for Recovery
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openLegalModal('privacy')}
                className="hidden md:flex items-center gap-1.5 text-xs text-[#796B64] hover:text-[#2D2421] px-2.5 py-1.5 rounded-xl hover:bg-[#F5EFEB] border border-transparent hover:border-[#E8DED6] transition-colors"
                title="View Privacy Policy"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#5A6E4B]" />
                <span>Privacy</span>
              </button>

              <button
                onClick={() => openLegalModal('terms')}
                className="hidden md:flex items-center gap-1.5 text-xs text-[#796B64] hover:text-[#2D2421] px-2.5 py-1.5 rounded-xl hover:bg-[#F5EFEB] border border-transparent hover:border-[#E8DED6] transition-colors"
                title="View Terms & Conditions"
              >
                <Scale className="w-3.5 h-3.5 text-[#9C3E32]" />
                <span>Terms</span>
              </button>

              <button
                onClick={toggleSound}
                className="p-2 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
                title={soundEnabled ? 'Mute Sanctuary Bell' : 'Enable Sanctuary Bell'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#A89B94]" />}
              </button>

              <button
                onClick={toggleDeviceMockup}
                className="px-3 py-1.5 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-xs text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center gap-1.5 font-medium"
                title="View in Mobile Device Frame"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Preview</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          {children}
        </main>
      </div>
    );
  }

  // Mobile Device Frame Mode
  return (
    <div className="min-h-screen bg-[#EDE5DE] py-6 sm:py-10 px-4 flex flex-col items-center justify-center">
      {/* Top Floating Control */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={toggleDeviceMockup}
          className="px-3.5 py-1.5 rounded-full bg-[#FFF9F5] border border-[#D5C7BD] text-xs font-medium text-[#2D2421] hover:bg-white shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit Mobile Frame</span>
        </button>

        <button
          onClick={toggleSound}
          className="p-1.5 rounded-full bg-[#FFF9F5] border border-[#D5C7BD] text-[#796B64] hover:text-[#2D2421] transition-all"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Phone Outer Chassis */}
      <div className="w-full max-w-[400px] h-[820px] bg-[#1E1917] rounded-[52px] p-3 shadow-2xl ring-1 ring-black/20 flex flex-col relative overflow-hidden">
        {/* Side Hardware Buttons */}
        <div className="absolute -left-[3px] top-28 w-[3px] h-9 bg-[#3D332F] rounded-l-md" />
        <div className="absolute -left-[3px] top-40 w-[3px] h-12 bg-[#3D332F] rounded-l-md" />
        <div className="absolute -left-[3px] top-56 w-[3px] h-12 bg-[#3D332F] rounded-l-md" />
        <div className="absolute -right-[3px] top-36 w-[3px] h-16 bg-[#3D332F] rounded-r-md" />

        {/* Screen Bezel & Container */}
        <div className="w-full h-full bg-[#FAF5F0] rounded-[42px] overflow-hidden flex flex-col relative">
          {/* iOS Dynamic Island & Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-[#2D2421] shrink-0 bg-[#FAF5F0]/90 backdrop-blur-sm z-30">
            <span className="font-semibold text-xs tracking-tight">{currentTime}</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#333] ml-auto mr-2" />
            </div>

            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-[#2D2421]" />
              <Battery className="w-3.5 h-3.5 text-[#2D2421]" />
            </div>
          </div>

          {/* Scrollable Mobile App Area */}
          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-16">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none z-40">
            <div className="w-32 h-1 bg-[#2D2421]/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
