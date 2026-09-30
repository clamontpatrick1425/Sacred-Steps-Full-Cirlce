/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — Multi-Device Phone Preview Engine
 * Provides authentic hardware chassis, camera cutouts, status bars, and colorways for various smartphones
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Wifi, 
  Battery, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Scale,
  RotateCw,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Signal
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { PHONE_MODELS, PhoneModel, DEFAULT_PHONE_ID } from '../data/phoneModelsData';
import { triggerHaptic } from '../utils/haptics';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { 
    deviceMockup, 
    toggleDeviceMockup, 
    soundEnabled, 
    toggleSound, 
    openLegalModal,
    selectedPhoneModel,
    setSelectedPhoneModel,
    selectedPhoneColor,
    setSelectedPhoneColor,
    phoneOrientation,
    togglePhoneOrientation,
    phoneScale,
    setPhoneScale,
    hapticsEnabled
  } = useSacredStore();

  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [deviceSelectorOpen, setDeviceSelectorOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeModel: PhoneModel = 
    PHONE_MODELS.find(m => m.id === selectedPhoneModel) || PHONE_MODELS[0];

  const activeColor = 
    activeModel.colorways.find(c => c.name === selectedPhoneColor) || activeModel.colorways[0];

  // If active color isn't available for the current model, reset to first
  useEffect(() => {
    if (!activeModel.colorways.some(c => c.name === selectedPhoneColor)) {
      setSelectedPhoneColor(activeModel.colorways[0].name);
    }
  }, [activeModel, selectedPhoneColor, setSelectedPhoneColor]);

  const handleSelectModel = (modelId: string) => {
    if (hapticsEnabled) triggerHaptic('soft');
    setSelectedPhoneModel(modelId);
    const targetModel = PHONE_MODELS.find(m => m.id === modelId);
    if (targetModel) {
      setSelectedPhoneColor(targetModel.colorways[0].name);
    }
    setDeviceSelectorOpen(false);
    setDesktopDropdownOpen(false);
  };

  const handleNextModel = () => {
    const currentIndex = PHONE_MODELS.findIndex(m => m.id === activeModel.id);
    const nextIndex = (currentIndex + 1) % PHONE_MODELS.length;
    handleSelectModel(PHONE_MODELS[nextIndex].id);
  };

  const handlePrevModel = () => {
    const currentIndex = PHONE_MODELS.findIndex(m => m.id === activeModel.id);
    const prevIndex = (currentIndex - 1 + PHONE_MODELS.length) % PHONE_MODELS.length;
    handleSelectModel(PHONE_MODELS[prevIndex].id);
  };

  // Dimensions based on orientation
  const isLandscape = phoneOrientation === 'landscape';
  const width = isLandscape ? activeModel.viewportHeight : activeModel.viewportWidth;
  const height = isLandscape ? activeModel.viewportWidth : activeModel.viewportHeight;

  // ----------------------------------------------------------------------
  // 1. STANDARD RESPONSIVE DESKTOP VIEW
  // ----------------------------------------------------------------------
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

              {/* Phone Preview Selector Dropdown */}
              <div className="relative" ref={desktopDropdownRef}>
                <div className="inline-flex rounded-xl shadow-xs border border-[#E8DED6] bg-[#FAF5F0] overflow-hidden">
                  <button
                    onClick={toggleDeviceMockup}
                    className="px-3 py-1.5 text-xs text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center gap-1.5 font-medium border-r border-[#E8DED6]"
                    title="Open Phone Preview Mode"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-[#7A5B0B]" />
                    <span>Phone Preview</span>
                  </button>

                  <button
                    onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                    className="px-2 py-1.5 text-xs text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors"
                    title="Select Phone Model for Preview"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {desktopDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-[#FFF9F5] border border-[#E8DED6] rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-[#E8DED6] flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#796B64]">
                        Select Phone Preview
                      </span>
                      <span className="text-[10px] text-[#7A5B0B] font-medium font-mono">
                        {PHONE_MODELS.length} Devices
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto py-1">
                      {PHONE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            handleSelectModel(model.id);
                            if (!deviceMockup) toggleDeviceMockup();
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors text-xs ${
                            selectedPhoneModel === model.id
                              ? 'bg-[#2D2421] text-white'
                              : 'text-[#2D2421] hover:bg-[#FAF5F0]'
                          }`}
                        >
                          <div>
                            <span className="font-semibold block">{model.name}</span>
                            <span className={`text-[10px] ${selectedPhoneModel === model.id ? 'text-[#E8DED6]' : 'text-[#796B64]'}`}>
                              {model.screenDiagonal} · {model.resolutionLabel} · {model.os}
                            </span>
                          </div>
                          {selectedPhoneModel === model.id && (
                            <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          {children}
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // 2. MULTI-DEVICE PHONE PREVIEW MODE
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#E5DDD5] py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center justify-start text-[#2D2421] select-none">
      {/* Top Floating Master Device Toolbar */}
      <div className="sticky top-2 z-50 mb-4 w-full max-w-4xl bg-[#FFF9F5]/95 backdrop-blur-md border border-[#D5C7BD] rounded-3xl p-2 sm:p-3 shadow-lg flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Device Switcher & Quick Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Previous/Next Model Buttons */}
          <div className="flex items-center rounded-xl bg-white border border-[#E8DED6] shadow-2xs">
            <button
              onClick={handlePrevModel}
              className="p-1.5 text-[#796B64] hover:text-[#2D2421] transition-colors"
              title="Previous Phone Model"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextModel}
              className="p-1.5 text-[#796B64] hover:text-[#2D2421] transition-colors border-l border-[#E8DED6]"
              title="Next Phone Model"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Device Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDeviceSelectorOpen(!deviceSelectorOpen)}
              className="py-1.5 px-3 rounded-xl bg-white border border-[#E8DED6] hover:bg-[#FAF5F0] text-xs font-semibold text-[#2D2421] flex items-center gap-2 transition shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#7A5B0B]" />
              <div className="text-left leading-tight">
                <span className="block font-serif font-bold text-xs">{activeModel.name}</span>
                <span className="block text-[9px] text-[#796B64] font-mono">
                  {activeModel.screenDiagonal} ({activeModel.resolutionLabel})
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#796B64] ml-1" />
            </button>

            {/* Dropdown Menu */}
            {deviceSelectorOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#FFF9F5] border border-[#E8DED6] rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-[#E8DED6] flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#796B64]">
                    Choose Phone Model
                  </span>
                  <span className="text-[10px] text-[#5A6E4B] font-semibold bg-[#C8D5B9]/40 px-2 py-0.5 rounded-full">
                    Realistic Bezels
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto py-1">
                  {PHONE_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleSelectModel(model.id)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors text-xs ${
                        selectedPhoneModel === model.id
                          ? 'bg-[#2D2421] text-white'
                          : 'text-[#2D2421] hover:bg-[#FAF5F0]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs">{model.name}</span>
                          <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono ${
                            selectedPhoneModel === model.id ? 'bg-white/20 text-white' : 'bg-[#FAF5F0] text-[#796B64]'
                          }`}>
                            {model.brand}
                          </span>
                        </div>
                        <span className={`text-[10px] block mt-0.5 ${
                          selectedPhoneModel === model.id ? 'text-[#E8DED6]' : 'text-[#796B64]'
                        }`}>
                          {model.screenDiagonal} · {model.resolutionLabel} · {model.cutoutType.replace('_', ' ')}
                        </span>
                      </div>
                      {selectedPhoneModel === model.id && (
                        <Check className="w-4 h-4 text-[#C8D5B9]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colorway Swatches for Active Model */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-white border border-[#E8DED6] rounded-xl shadow-2xs">
            {activeModel.colorways.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedPhoneColor(c.name)}
                className={`w-5 h-5 rounded-full border transition-all ${
                  selectedPhoneColor === c.name
                    ? 'ring-2 ring-[#2D2421] ring-offset-1 scale-110'
                    : 'border-[#D5C7BD] opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.name} chassis finish`}
              />
            ))}
          </div>
        </div>

        {/* Right: Controls & Exit Frame */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Orientation Toggle */}
          <button
            onClick={() => {
              if (hapticsEnabled) triggerHaptic('soft');
              togglePhoneOrientation();
            }}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition shadow-2xs ${
              isLandscape
                ? 'bg-[#2D2421] text-white border-[#2D2421]'
                : 'bg-white border-[#E8DED6] text-[#796B64] hover:text-[#2D2421]'
            }`}
            title={`Rotate Device to ${isLandscape ? 'Portrait' : 'Landscape'}`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px] font-semibold">{isLandscape ? 'Landscape' : 'Portrait'}</span>
          </button>

          {/* Zoom / Scale Selector */}
          <div className="hidden lg:flex items-center rounded-xl bg-white border border-[#E8DED6] p-0.5 text-xs text-[#796B64] shadow-2xs">
            {[0.8, 0.9, 1.0].map((scale) => (
              <button
                key={scale}
                onClick={() => setPhoneScale(scale)}
                className={`px-2 py-1 rounded-lg font-medium transition text-[11px] ${
                  phoneScale === scale
                    ? 'bg-[#2D2421] text-white font-bold'
                    : 'hover:text-[#2D2421] hover:bg-[#FAF5F0]'
                }`}
              >
                {Math.round(scale * 100)}%
              </button>
            ))}
          </div>

          {/* Audio Chime Mute/Unmute */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-white border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] transition-all shadow-2xs"
            title={soundEnabled ? 'Mute Sanctuary Bell' : 'Enable Sanctuary Bell'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Exit Mobile Frame */}
          <button
            onClick={toggleDeviceMockup}
            className="py-1.5 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
            title="Return to Responsive Desktop Layout"
          >
            <Monitor className="w-3.5 h-3.5 text-[#FFD4C4]" />
            <span className="hidden sm:inline">Exit Phone Preview</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container with Dynamic Scaling */}
      <div 
        className="transition-all duration-300 ease-out origin-top flex items-center justify-center py-2"
        style={{ transform: `scale(${phoneScale})` }}
      >
        {/* PHONE HARDWARE OUTER CHASSIS */}
        <div 
          className="relative transition-all duration-300 shadow-2xl flex flex-col overflow-hidden"
          style={{
            width: `${width + 24}px`,
            height: `${height + (activeModel.hasTouchIdButton ? 120 : 28)}px`,
            borderRadius: `${activeModel.borderRadius}px`,
            backgroundColor: activeColor.hex,
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
          }}
        >
          {/* Side Hardware Buttons (Authentic metallic buttons on outer edge) */}
          {!isLandscape && (
            <>
              {/* Left Side: Volume Buttons & Action Button */}
              <div 
                className="absolute -left-[3px] top-24 w-[3px] h-7 rounded-l-xs opacity-90"
                style={{ backgroundColor: activeColor.borderHex }}
              />
              <div 
                className="absolute -left-[3px] top-36 w-[3px] h-12 rounded-l-xs opacity-90"
                style={{ backgroundColor: activeColor.borderHex }}
              />
              <div 
                className="absolute -left-[3px] top-52 w-[3px] h-12 rounded-l-xs opacity-90"
                style={{ backgroundColor: activeColor.borderHex }}
              />

              {/* Right Side: Power Button */}
              <div 
                className="absolute -right-[3px] top-36 w-[3px] h-16 rounded-r-xs opacity-90"
                style={{ backgroundColor: activeColor.borderHex }}
              />
            </>
          )}

          {/* Top Forehead Area for Classic iPhone SE */}
          {activeModel.cutoutType === 'forehead_chin' && (
            <div className="h-14 bg-black flex items-center justify-center relative shrink-0">
              {/* Speaker Earpiece Slit */}
              <div className="w-16 h-1 bg-[#222] rounded-full" />
              {/* Front Camera Dot */}
              <div className="w-2.5 h-2.5 bg-[#181818] rounded-full absolute left-1/4 ring-1 ring-[#333]" />
            </div>
          )}

          {/* PHONE SCREEN BEZEL & INNER DISPLAY CONTAINER */}
          <div 
            className="flex-1 bg-[#FAF5F0] overflow-hidden flex flex-col relative m-[12px] border border-black/10"
            style={{
              borderRadius: `${activeModel.innerRadius}px`
            }}
          >
            {/* ================= OS STATUS BAR & CUTOUT ================= */}
            {activeModel.os === 'iOS' ? (
              /* iOS Status Bar */
              <div className="pt-3 px-6 pb-1.5 flex items-center justify-between text-xs text-[#2D2421] shrink-0 bg-[#FAF5F0]/95 backdrop-blur-md z-30">
                <span className="font-semibold text-xs tracking-tight font-sans pl-1">
                  {currentTime}
                </span>

                {/* DYNAMIC ISLAND CUTOUT */}
                {activeModel.cutoutType === 'dynamic_island' && (
                  <div 
                    className="bg-black rounded-full flex items-center justify-between px-2.5 transition-all hover:scale-105 cursor-pointer shadow-md group"
                    style={{
                      width: `${activeModel.cutoutWidth || 120}px`,
                      height: `${activeModel.cutoutHeight || 34}px`
                    }}
                    title="Dynamic Island"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1A1A1A] ring-1 ring-[#333]" />
                      <span className="w-1 h-1 rounded-full bg-[#C8D5B9] animate-pulse" />
                    </div>
                    <span className="text-[9px] text-[#A89B94] font-medium font-serif opacity-75 group-hover:opacity-100">
                      Grace
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-[#222]" />
                  </div>
                )}

                {/* CLASSIC NOTCH CUTOUT */}
                {activeModel.cutoutType === 'classic_notch' && (
                  <div 
                    className="bg-black rounded-b-2xl flex items-center justify-center relative -mt-3 shadow-md"
                    style={{
                      width: `${activeModel.cutoutWidth || 140}px`,
                      height: `${activeModel.cutoutHeight || 28}px`
                    }}
                  >
                    <div className="w-12 h-1 bg-[#222] rounded-full mb-1" />
                    <div className="w-2.5 h-2.5 bg-[#181818] rounded-full absolute right-6 ring-1 ring-[#333]" />
                  </div>
                )}

                {/* Right Status Indicators (iOS) */}
                <div className="flex items-center gap-1.5 pr-1">
                  <Signal className="w-3 h-3 text-[#2D2421]" />
                  <Wifi className="w-3 h-3 text-[#2D2421]" />
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-mono font-bold">100%</span>
                    <Battery className="w-4 h-4 text-[#2D2421]" />
                  </div>
                </div>
              </div>
            ) : (
              /* Android Status Bar (Samsung & Pixel) */
              <div className="pt-2 px-5 pb-1 flex items-center justify-between text-xs text-[#2D2421] shrink-0 bg-[#FAF5F0]/95 backdrop-blur-md z-30">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs tracking-tight font-sans">
                    {currentTime}
                  </span>
                  {activeModel.brand === 'Google' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7A5B0B]/20 text-[7px] flex items-center justify-center font-bold">
                      G
                    </span>
                  )}
                </div>

                {/* CENTERED HOLE PUNCH CAMERA */}
                {activeModel.cutoutType === 'punch_hole' && (
                  <div 
                    className="bg-black rounded-full ring-2 ring-black/40 flex items-center justify-center mx-auto shadow-inner"
                    style={{
                      width: `${activeModel.cutoutWidth || 13}px`,
                      height: `${activeModel.cutoutHeight || 13}px`
                    }}
                    title="Front Camera"
                  >
                    <div className="w-1 h-1 rounded-full bg-[#1a2233]" />
                  </div>
                )}

                {/* Right Status Indicators (Android) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold tracking-tight">5G</span>
                  <Wifi className="w-3 h-3 text-[#2D2421]" />
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-mono font-bold">98%</span>
                    <Battery className="w-3.5 h-3.5 text-[#2D2421]" />
                  </div>
                </div>
              </div>
            )}

            {/* SCROLLABLE INNER APP CONTAINER */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-3 sm:px-4 pt-1 pb-16 scroll-smooth"
            >
              {children}
            </div>

            {/* ================= BOTTOM NAVIGATION INDICATORS ================= */}
            {activeModel.os === 'iOS' && activeModel.cutoutType !== 'forehead_chin' && (
              /* iOS Home Indicator Bar */
              <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none z-40">
                <div className="w-32 h-1 bg-[#2D2421]/50 rounded-full" />
              </div>
            )}

            {activeModel.os === 'Android' && (
              /* Android Gesture Navigation Line */
              <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none z-40">
                <div className="w-24 h-1 bg-[#2D2421]/40 rounded-full" />
              </div>
            )}
          </div>

          {/* Bottom Chin Bezel for Classic iPhone SE (with Touch ID) */}
          {activeModel.hasTouchIdButton && (
            <div className="h-16 bg-black flex items-center justify-center shrink-0">
              <button
                onClick={() => {
                  if (hapticsEnabled) triggerHaptic('step');
                  scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-12 h-12 rounded-full border-2 border-[#444] bg-[#111] hover:border-[#888] transition-all flex items-center justify-center active:scale-95 shadow-inner"
                title="Touch ID Home Button (Scrolls to top)"
              >
                <div className="w-10 h-10 rounded-full border border-[#222]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Device Spec Ribbon */}
      <div className="mt-3 text-center text-xs text-[#796B64] flex items-center gap-3 bg-[#FFF9F5]/80 px-4 py-1.5 rounded-full border border-[#D5C7BD] shadow-xs">
        <span className="font-semibold text-[#2D2421]">{activeModel.name}</span>
        <span>•</span>
        <span>{activeModel.screenDiagonal} Display</span>
        <span>•</span>
        <span className="font-mono text-[11px]">{width} × {height} pt</span>
        <span>•</span>
        <span>{activeColor.name}</span>
      </div>
    </div>
  );
};
