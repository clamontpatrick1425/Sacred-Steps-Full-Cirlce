import React, { useState } from 'react';
import { 
  Phone, MessageSquare, ShieldAlert, UserCheck, Edit3, 
  Check, ArrowLeft, HeartHandshake, Shield, Sparkles, PhoneCall,
  Copy, ExternalLink, MapPin, Send, Heart, Flame
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { triggerHaptic } from '../utils/haptics';

export const ConnectScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { 
    sponsorContact, 
    updateSponsorContact, 
    hapticsEnabled, 
    setSosActiveScreen,
    active12StepNumber,
    cravingLogs
  } = useSacredStore();

  const [isEditingSponsor, setIsEditingSponsor] = useState(false);
  const [name, setName] = useState(sponsorContact.name);
  const [phone, setPhone] = useState(sponsorContact.phone);
  const [notes, setNotes] = useState(sponsorContact.notes || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check-In Generator States
  const [showCheckInGenerator, setShowCheckInGenerator] = useState(false);
  const [checkInUrge, setCheckInUrge] = useState(cravingLogs.length > 0 ? cravingLogs[cravingLogs.length - 1].intensity : 2);
  const [checkInStep, setCheckInStep] = useState(active12StepNumber || 1);
  const [checkInVictory, setCheckInVictory] = useState('Stayed grounded in prayer through morning stress');
  const [checkInPrayer, setCheckInPrayer] = useState('Peace of heart and clarity to stay clean tonight');
  const [copiedCheckIn, setCopiedCheckIn] = useState(false);

  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    updateSponsorContact({
      name: name.trim() || 'My Sponsor',
      phone: phone.trim() || '555-019-2834',
      notes: notes.trim(),
    });
    if (hapticsEnabled) triggerHaptic('step');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditingSponsor(false);
    }, 1000);
  };

  const sponsorFirstName = sponsorContact.name.split(' ')[0] || 'Friend';
  const sponsorSmsMessage = encodeURIComponent(
    `Hey ${sponsorFirstName}, I'm facing an acute craving/storm right now and need to connect with you.`
  );

  const formattedCheckInMessage = `Hey ${sponsorFirstName}! Here is my SacredSteps daily check-in:
🕊️ Urge Level: ${checkInUrge}/10
📖 Current 12-Step: Step ${checkInStep}
✨ Today's Victory: ${checkInVictory}
🙏 Prayer Need: ${checkInPrayer}
"A Path to Recovery, A Life in Grace."`;

  const handleCopyCheckIn = async () => {
    if (hapticsEnabled) triggerHaptic('soft');
    try {
      await navigator.clipboard.writeText(formattedCheckInMessage);
      setCopiedCheckIn(true);
      setTimeout(() => setCopiedCheckIn(false), 2500);
    } catch {
      // fallback
    }
  };

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

        <span className="text-xs font-serif font-bold text-[#2D2421]">
          Immediate Voice & Text Safe Harbor
        </span>

        <span className="text-[11px] font-sans font-medium text-[#5A6E4B] bg-[#C8D5B9]/30 px-2 py-0.5 rounded-full border border-[#C8D5B9]/40">
          100% Offline
        </span>
      </div>

      {/* Main Connect List */}
      <div className="flex-1 overflow-y-auto py-4 px-1 space-y-4">
        {/* Sponsor Contact Section */}
        <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFD4C4] to-[#E6D5F0] flex items-center justify-center text-[#2D2421]">
                <UserCheck className="w-5 h-5 text-[#8B261D]" />
              </div>
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#796B64] block">
                  Primary Lifeline
                </span>
                <h3 className="font-serif text-base font-bold text-[#2D2421]">
                  {sponsorContact.name}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsEditingSponsor(!isEditingSponsor)}
              className="p-1.5 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center gap-1 text-xs"
              title="Edit Sponsor Contact"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="text-[11px]">{isEditingSponsor ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {sponsorContact.notes && !isEditingSponsor && (
            <p className="text-xs text-[#796B64] italic bg-[#FAF5F0] p-2.5 rounded-xl border border-[#E8DED6] mb-3">
              "{sponsorContact.notes}"
            </p>
          )}

          {isEditingSponsor ? (
            <form onSubmit={handleSaveSponsor} className="space-y-3 pt-2 border-t border-[#E8DED6] animate-in fade-in duration-200">
              <div>
                <label className="block text-[11px] font-medium text-[#796B64] mb-1">
                  Sponsor Name / Nickname
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sarah M. (Sponsor)"
                  className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#FFB4A2]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#796B64] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 555-019-2834"
                  className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#FFB4A2]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#796B64] mb-1">
                  Gentle Note / Instructions
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Call anytime day or night, don't wait."
                  className="w-full px-3 py-2 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#FFB4A2]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold hover:bg-[#4A3E39] transition-colors flex items-center justify-center gap-1.5"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Sponsor Info</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${sponsorContact.phone}`}
                  className="py-3 px-3 rounded-2xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <PhoneCall className="w-4 h-4 text-[#FFD4C4]" />
                  <span className="text-xs font-semibold">Call Sponsor</span>
                </a>

                <a
                  href={`sms:${sponsorContact.phone}?body=${sponsorSmsMessage}`}
                  className="py-3 px-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#796B64]" />
                  <span className="text-xs font-semibold">Crisis Text</span>
                </a>
              </div>

              {/* One-Tap Daily Sponsor Check-In Button */}
              <button
                type="button"
                onClick={() => {
                  setShowCheckInGenerator(!showCheckInGenerator);
                  if (hapticsEnabled) triggerHaptic('soft');
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#FFD4C4]/40 via-[#E6D5F0]/40 to-[#FFF9F5] border border-[#E8DED6] text-xs font-semibold text-[#2D2421] hover:border-[#C8D5B9] flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7A5B0B]" />
                  <span>One-Tap Sponsor "Daily Grace" Check-In</span>
                </div>
                <span className="text-[11px] font-sans font-medium text-[#796B64]">
                  {showCheckInGenerator ? 'Collapse' : 'Generate SMS'}
                </span>
              </button>

              {/* Check-In Generator Details Drawer */}
              {showCheckInGenerator && (
                <div className="bg-[#FAF5F0] border border-[#E8DED6] rounded-2xl p-3.5 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#796B64]">
                      Customize Check-In
                    </span>
                    <span className="text-[10px] text-[#5A6E4B] bg-[#C8D5B9]/30 px-2 py-0.5 rounded-full font-medium">
                      Encrypted / Local
                    </span>
                  </div>

                  {/* Urge Level Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#554742]">Today's Craving Intensity:</span>
                      <strong className={`font-mono ${checkInUrge > 6 ? 'text-[#8B261D]' : 'text-[#2D2421]'}`}>
                        {checkInUrge} / 10
                      </strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={checkInUrge}
                      onChange={(e) => setCheckInUrge(Number(e.target.value))}
                      className="w-full accent-[#2D2421] cursor-pointer"
                    />
                  </div>

                  {/* Active Step Picker */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#796B64]">
                      Step Currently Practicing:
                    </label>
                    <select
                      value={checkInStep}
                      onChange={(e) => setCheckInStep(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421]"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
                        <option key={s} value={s}>
                          Step {s}: {s === 1 ? 'Honesty & Powerlessness' : s === 2 ? 'Hope & Restoring Sanity' : s === 3 ? 'Surrender to God' : s === 4 ? 'Moral Inventory' : `Step ${s}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Victory of the Day */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#796B64]">
                      Today's Victory:
                    </label>
                    <input
                      type="text"
                      value={checkInVictory}
                      onChange={(e) => setCheckInVictory(e.target.value)}
                      placeholder="e.g., Kept peaceful during family conversation"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421]"
                    />
                  </div>

                  {/* Prayer Need */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-[#796B64]">
                      Prayer Need:
                    </label>
                    <input
                      type="text"
                      value={checkInPrayer}
                      onChange={(e) => setCheckInPrayer(e.target.value)}
                      placeholder="e.g., Strength to remain anchored in grace tonight"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421]"
                    />
                  </div>

                  {/* Preview Box */}
                  <div className="bg-white p-3 rounded-xl border border-[#E8DED6] text-[11px] font-sans text-[#4A3E39] whitespace-pre-wrap leading-relaxed">
                    {formattedCheckInMessage}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyCheckIn}
                      className="py-2 px-3 rounded-xl bg-white border border-[#E8DED6] text-xs font-semibold text-[#2D2421] hover:bg-[#FAF5F0] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedCheckIn ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#5A6E4B]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#796B64]" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`sms:${sponsorContact.phone}?body=${encodeURIComponent(formattedCheckInMessage)}`}
                      className="py-2 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold hover:bg-[#4A3E39] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5 text-[#FFD4C4]" />
                      <span>Send SMS</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Local Recovery Fellowship & Group Locators (GEO Integration) */}
        <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8B261D]" />
              <h3 className="font-serif text-sm font-bold text-[#2D2421]">
                Find Local Recovery Meetings (GEO)
              </h3>
            </div>
            <span className="text-[10px] font-sans text-[#796B64] uppercase font-bold tracking-wider">
              In-Person & Online
            </span>
          </div>

          <p className="text-xs text-[#796B64] leading-relaxed">
            Never walk recovery in isolation. Locate safe, Christ-centered, and 12-step fellowship gatherings near your city:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href="https://www.celebraterecovery.com/crgroups"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-[#E8DED6] rounded-2xl hover:border-[#2D2421] flex items-center justify-between group transition-all"
            >
              <div>
                <span className="font-bold text-[#2D2421] block">Celebrate Recovery</span>
                <span className="text-[11px] text-[#796B64]">Christ-centered 12-step groups</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#796B64] group-hover:text-[#2D2421]" />
            </a>

            <a
              href="https://www.aa.org/find-aa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-[#E8DED6] rounded-2xl hover:border-[#2D2421] flex items-center justify-between group transition-all"
            >
              <div>
                <span className="font-bold text-[#2D2421] block">Alcoholics Anonymous</span>
                <span className="text-[11px] text-[#796B64]">Find local meetings & groups</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#796B64] group-hover:text-[#2D2421]" />
            </a>

            <a
              href="https://www.na.org/meetingsearch/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-[#E8DED6] rounded-2xl hover:border-[#2D2421] flex items-center justify-between group transition-all"
            >
              <div>
                <span className="font-bold text-[#2D2421] block">Narcotics Anonymous</span>
                <span className="text-[11px] text-[#796B64]">Worldwide NA meeting finder</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#796B64] group-hover:text-[#2D2421]" />
            </a>

            <a
              href="https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white border border-[#E8DED6] rounded-2xl hover:border-[#2D2421] flex items-center justify-between group transition-all"
            >
              <div>
                <span className="font-bold text-[#2D2421] block">Al-Anon Family Groups</span>
                <span className="text-[11px] text-[#796B64]">Strength for families & friends</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#796B64] group-hover:text-[#2D2421]" />
            </a>
          </div>
        </div>

        {/* National Verified Recovery Helplines */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#796B64] px-1 block">
            24/7 Free & Confidential Hotlines
          </span>

          {/* SAMHSA Helpline */}
          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#5A6E4B]" />
                <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                  SAMHSA National Helpline
                </h4>
              </div>
              <p className="text-[11px] text-[#796B64]">
                Substance Abuse & Mental Health · 24/7/365 · English & Spanish
              </p>
              <span className="text-xs font-mono font-bold text-[#2D2421] block">
                1-800-662-4357
              </span>
            </div>

            <a
              href="tel:18006624357"
              className="py-2.5 px-3.5 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] hover:bg-[#F5EFEB] text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#5A6E4B]" />
              <span>Call</span>
            </a>
          </div>

          {/* Crisis Text Line */}
          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#8B261D]" />
                <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                  Crisis Text Line
                </h4>
              </div>
              <p className="text-[11px] text-[#796B64]">
                Free, confidential crisis counseling via SMS text message
              </p>
              <span className="text-xs font-mono font-bold text-[#2D2421] block">
                Text HOME to 741741
              </span>
            </div>

            <a
              href="sms:741741?body=HOME"
              className="py-2.5 px-3.5 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] hover:bg-[#F5EFEB] text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#8B261D]" />
              <span>Text</span>
            </a>
          </div>

          {/* 988 Suicide & Crisis Lifeline */}
          <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#C0392B]" />
                <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                  988 Suicide & Crisis Lifeline
                </h4>
              </div>
              <p className="text-[11px] text-[#796B64]">
                Immediate compassionate help if in severe emotional pain
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href="tel:988"
                className="py-2 px-3 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-semibold hover:bg-[#4A3E39]"
              >
                Call 988
              </a>
              <a
                href="sms:988"
                className="py-2 px-3 rounded-xl bg-white border border-[#E8DED6] text-[#2D2421] text-xs font-semibold hover:bg-[#F5EFEB]"
              >
                Text
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Switcher */}
      <div className="pt-3 border-t border-[#E8DED6] flex items-center justify-between text-xs text-[#796B64]">
        <span>You don't have to carry this storm alone.</span>
        <button
          onClick={() => setSosActiveScreen('craving')}
          className="font-medium text-[#2D2421] hover:underline"
        >
          Log Craving Moment &rarr;
        </button>
      </div>
    </div>
  );
};
