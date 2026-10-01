import React from 'react';
import { LifeBuoy, HeartHandshake } from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';

export const SOSFloatingButton: React.FC = () => {
  const { openSos, isSosOpen } = useSacredStore();

  // If SOS menu is already active, we keep button subtle or hidden to avoid duplicate overlays
  if (isSosOpen) return null;

  return (
    <div className="fixed right-3 bottom-18 sm:right-6 sm:bottom-22 z-40 select-none">
      <button
        onClick={() => openSos('menu')}
        type="button"
        aria-label="SOS Calm in the Storm: Emergency Support"
        className="group relative w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-full flex flex-col items-center justify-center p-0 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FFB4A2]/40 animate-sos-pulse cursor-pointer border border-white/60 bg-[radial-gradient(circle_at_35%_30%,_#FFE5DE_0%,_#FFCAD4_45%,_#FFB4A2_100%)] shadow-[0_6px_20px_rgba(255,160,140,0.5)] hover:shadow-[0_10px_30px_rgba(255,140,120,0.7)]"
      >
        {/* Soft Outer Halo Ring */}
        <span className="absolute inset-0 rounded-full border-2 border-white/40 pointer-events-none group-hover:scale-105 transition-transform" />

        {/* Floating Icons & Label */}
        <div className="flex flex-col items-center justify-center leading-none text-[#5A231C]">
          <span className="relative flex items-center justify-center mb-0.5">
            <LifeBuoy className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B261D] group-hover:rotate-45 transition-transform duration-500 drop-shadow-xs" />
            <HeartHandshake className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#5A231C] absolute" />
          </span>
          <span className="font-serif font-black tracking-wider text-[10px] sm:text-[11px] uppercase text-[#6B2017]">
            SOS
          </span>
          <span className="text-[7.5px] sm:text-[8px] font-sans font-bold tracking-tight text-[#8A3A30] uppercase mt-0.5">
            Calm
          </span>
        </div>

        {/* Ambient Badge Ping */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8E7E] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-[#E64C3C] border-2 border-white" />
        </span>
      </button>
    </div>
  );
};
