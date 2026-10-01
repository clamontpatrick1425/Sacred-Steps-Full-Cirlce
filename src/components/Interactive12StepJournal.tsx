import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Download, 
  Quote, 
  FileText, 
  Check, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookmarkCheck,
  Send,
  Lock,
  ListTodo,
  Printer
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { TWELVE_STEPS_BOOK_DATA, BookStepData, InventoryItem, AmendsItem } from '../data/twelveStepsBookData';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';
import { WorkbookPdfPreviewModal } from './WorkbookPdfPreviewModal';

export const Interactive12StepJournal: React.FC = () => {
  const {
    active12StepNumber,
    setActive12StepNumber,
    stepPromptAnswers,
    saveStepPromptAnswer,
    stepFreeformNotes,
    saveStepFreeformNote,
    stepCompletedMap,
    toggleStepCompleted,
    stepPrayerSpokenMap,
    togglePrayerSpoken,
    moralInventoryList,
    addMoralInventoryItem,
    deleteMoralInventoryItem,
    amendsLedger,
    addAmendsItem,
    updateAmendsStatus,
    deleteAmendsItem,
    soundEnabled,
    hapticsEnabled,
    setActiveTab,
    setCrisisModalOpen,
    cleanStartDate,
    getDaysInGrace
  } = useSacredStore();

  const [showPdfModal, setShowPdfModal] = useState(false);

  const currentStepData = TWELVE_STEPS_BOOK_DATA[active12StepNumber - 1] || TWELVE_STEPS_BOOK_DATA[0];
  const isCurrentStepCompleted = Boolean(stepCompletedMap[active12StepNumber]);
  const isCurrentPrayerSpoken = Boolean(stepPrayerSpokenMap[active12StepNumber]);

  // Inventory modal/form state (for Step 4)
  const [newInvCategory, setNewInvCategory] = useState<'asset' | 'defect' | 'fear' | 'resentment'>('asset');
  const [newInvTitle, setNewInvTitle] = useState('');
  const [newInvDetails, setNewInvDetails] = useState('');
  const [showInvForm, setShowInvForm] = useState(false);

  // Amends form state (for Steps 8 & 9)
  const [newAmendsPerson, setNewAmendsPerson] = useState('');
  const [newAmendsHarm, setNewAmendsHarm] = useState('');
  const [newAmendsPlan, setNewAmendsPlan] = useState('');
  const [showAmendsForm, setShowAmendsForm] = useState(false);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Completed steps calculation
  const totalCompleted = Object.values(stepCompletedMap).filter(Boolean).length;
  const progressPercent = Math.round((totalCompleted / 12) * 100);

  const handleStepSelect = (num: number) => {
    setActive12StepNumber(num);
  };

  const handleNextStep = () => {
    if (active12StepNumber < 12) {
      setActive12StepNumber(active12StepNumber + 1);
    }
  };

  const handlePrevStep = () => {
    if (active12StepNumber > 1) {
      setActive12StepNumber(active12StepNumber - 1);
    }
  };

  const handleSpeakPrayer = () => {
    sanctuaryAudio.speakScripture(`${currentStepData.prayer.title}. ${currentStepData.prayer.text}`);
  };

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvTitle.trim()) return;

    addMoralInventoryItem({
      category: newInvCategory,
      title: newInvTitle.trim(),
      details: newInvDetails.trim()
    });

    setNewInvTitle('');
    setNewInvDetails('');
    setShowInvForm(false);
    triggerNotification('Inventory entry recorded.');
  };

  const handleAddAmends = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmendsPerson.trim()) return;

    addAmendsItem({
      person: newAmendsPerson.trim(),
      harmDone: newAmendsHarm.trim(),
      amendsPlan: newAmendsPlan.trim(),
      status: 'willing'
    });

    setNewAmendsPerson('');
    setNewAmendsHarm('');
    setNewAmendsPlan('');
    setShowAmendsForm(false);
    triggerNotification('Amends entry added to ledger.');
  };

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleExportJournal = () => {
    const exportData = {
      book: "Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery by C. Lamont Patrick",
      exportedAt: new Date().toISOString(),
      completedStepsCount: totalCompleted,
      steps: TWELVE_STEPS_BOOK_DATA.map(step => ({
        stepNumber: step.stepNumber,
        title: step.traditionalTitle,
        subtitle: step.bookSubtitle,
        completed: Boolean(stepCompletedMap[step.stepNumber]),
        prayerSpoken: Boolean(stepPrayerSpokenMap[step.stepNumber]),
        answers: step.reflectionPrompts.map(p => ({
          prompt: p.question,
          answer: stepPromptAnswers[p.id] || ""
        })),
        notes: stepFreeformNotes[step.stepNumber] || ""
      })),
      moralInventory: moralInventoryList,
      amendsLedger: amendsLedger
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sacred-steps-12-step-journal-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification('12-Step Journal summary downloaded.');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6D5F0] ring-4 ring-[#E6D5F0]/40" />
            <h1 className="font-serif text-xl sm:text-2xl text-[#2D2421] font-semibold">
              Interactive 12-Step Journal
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowPdfModal(true);
                if (hapticsEnabled) triggerHaptic('soft');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title="Convert full 12-Step Workbook to PDF file before export or print"
            >
              <FileText className="w-3.5 h-3.5 text-[#FFD4C4]" />
              <span>Convert to PDF / Print</span>
            </button>

            <button
              onClick={handleExportJournal}
              className="p-1.5 rounded-xl bg-white border border-[#E8DED6] text-xs text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors shadow-2xs"
              title="Download raw JSON data export"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="font-sans text-xs sm:text-sm text-[#796B64] leading-relaxed">
          Based on <strong className="text-[#2D2421]">"Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery"</strong> by C. Lamont Patrick. 
          Weave biblical wisdom, mindful honesty, and the power of prayer into each transformative step.
        </p>

        {/* Overall Step Progress Meter */}
        <div className="mt-4 pt-3 border-t border-[#E8DED6] flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-[#796B64] mb-1 font-medium">
              <span>Overall 12-Step Journey</span>
              <span>{totalCompleted} of 12 Steps Completed ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-[#E8DED6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FFD4C4] via-[#E6D5F0] to-[#C8D5B9] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigator Tabs (Steps 1 through 12) */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1.5 min-w-max">
          {TWELVE_STEPS_BOOK_DATA.map((step) => {
            const isSelected = active12StepNumber === step.stepNumber;
            const isCompleted = Boolean(stepCompletedMap[step.stepNumber]);

            return (
              <button
                key={step.stepNumber}
                onClick={() => handleStepSelect(step.stepNumber)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#2D2421] text-[#FFF9F5] border-[#2D2421] shadow-xs'
                    : isCompleted
                    ? 'bg-[#FFF9F5] border-[#C8D5B9] text-[#243317]'
                    : 'bg-[#FFF9F5]/70 border-[#E8DED6] text-[#796B64] hover:bg-[#FFF9F5]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C8D5B9]' : 'text-[#3E5627]'}`} />
                ) : (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#E8DED6] text-[#2D2421]'
                  }`}>
                    {step.stepNumber}
                  </span>
                )}
                <span>Step {step.stepNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Detail Container */}
      <div className="space-y-5 sm:space-y-6">
        {/* Step Title & Theological Bridge */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm relative overflow-hidden">
          {/* Top Metadata & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-[#E6D5F0] text-[#3E2B52] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
                Step {currentStepData.stepNumber} · {currentStepData.theme}
              </span>
              {isCurrentStepCompleted && (
                <span className="px-2 py-0.5 rounded-full bg-[#C8D5B9] text-[#243317] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" /> Completed
                </span>
              )}
            </div>

            <button
              onClick={() => toggleStepCompleted(active12StepNumber)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all shadow-2xs ${
                isCurrentStepCompleted
                  ? 'bg-[#C8D5B9] text-[#243317] border-[#B8C8A7]'
                  : 'bg-[#FAF5F0] text-[#796B64] border-[#E8DED6] hover:bg-[#F5EFEB] hover:text-[#2D2421]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isCurrentStepCompleted ? 'Step Completed ✓' : 'Mark Step Complete'}</span>
            </button>
          </div>

          {/* Full-Width Step Title & Theological Bridge */}
          <div className="space-y-1.5 mb-3.5">
            <h2 className="font-serif text-base sm:text-xl md:text-2xl text-[#2D2421] font-bold leading-snug tracking-tight text-balance">
              "{currentStepData.traditionalTitle}"
            </h2>
            <p className="font-scripture italic text-sm sm:text-base text-[#796B64] leading-relaxed">
              {currentStepData.bookSubtitle}
            </p>
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#4A3E39] leading-relaxed pt-2.5 border-t border-[#E8DED6]">
            {currentStepData.chapterOverview}
          </p>
        </div>

        {/* C. Lamont Patrick's Step Prayer */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF9F5] to-[#F5EFEB] border border-[#E8DED6] shadow-sm relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD4C4]" />
              <h3 className="font-serif text-sm sm:text-base text-[#2D2421] font-semibold">
                {currentStepData.prayer.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakPrayer}
                className="p-1.5 rounded-lg text-[#796B64] hover:text-[#2D2421] hover:bg-[#FAF5F0] transition-colors"
                title="Listen to prayer aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => togglePrayerSpoken(active12StepNumber)}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                  isCurrentPrayerSpoken
                    ? 'bg-[#C8D5B9]/50 border-[#C8D5B9] text-[#243317] font-medium'
                    : 'bg-[#FFF9F5] border-[#E8DED6] text-[#796B64] hover:text-[#2D2421]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isCurrentPrayerSpoken ? 'Prayed Aloud' : 'Mark Prayed'}</span>
              </button>
            </div>
          </div>

          <p className="font-sans text-xs sm:text-sm md:text-base text-[#2D2421] leading-relaxed italic bg-[#FFF9F5]/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E8DED6] mb-3 text-balance">
            "{currentStepData.prayer.text}"
          </p>

          <p className="text-xs text-[#796B64] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#FFD4C4] fill-[#FFD4C4] shrink-0" />
            <span>{currentStepData.prayer.warmGuidance}</span>
          </p>
        </div>

        {/* Bible Verse & Spoken Affirmation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scripture Card */}
          <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#796B64]">
                  Scripture Anchor · {currentStepData.bibleVerse.translation}
                </span>
                <span className="font-sans text-xs font-bold text-[#2D2421]">
                  {currentStepData.bibleVerse.reference}
                </span>
              </div>
              <blockquote className="font-scripture italic text-lg sm:text-xl text-[#2D2421] leading-relaxed mb-3 pl-3 border-l-2 border-[#E6D5F0]">
                "{currentStepData.bibleVerse.text}"
              </blockquote>
            </div>
            <p className="font-sans text-xs text-[#4A3E39] pt-2 border-t border-[#E8DED6] leading-relaxed">
              {currentStepData.bibleVerse.reflection}
            </p>
          </div>

          {/* Affirmation Card */}
          <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#796B64]">
                  Spoken Affirmation
                </span>
                <button
                  onClick={() => sanctuaryAudio.speakScripture(currentStepData.affirmation.text)}
                  className="p-1 rounded text-[#796B64] hover:text-[#2D2421]"
                  title="Speak affirmation aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-serif italic text-base sm:text-lg text-[#2D2421] font-medium leading-relaxed mb-3 bg-[#FAF5F0] p-3 rounded-xl border border-[#E8DED6]">
                "{currentStepData.affirmation.text}"
              </p>
            </div>
            <p className="font-sans text-xs text-[#796B64] pt-2 border-t border-[#E8DED6]">
              {currentStepData.affirmation.context}
            </p>
          </div>
        </div>

        {/* Famous Aspirational Quote & Book Testimonial */}
        <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-[#FFD4C4] shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-serif italic text-sm sm:text-base text-[#2D2421]">
                "{currentStepData.aspirationalQuote.quote}"
              </p>
              <div className="flex items-center justify-between mt-1 text-xs text-[#796B64]">
                <span className="font-medium">— {currentStepData.aspirationalQuote.author}</span>
                <span className="text-[11px] italic">{currentStepData.aspirationalQuote.commentary}</span>
              </div>
            </div>
          </div>

          {currentStepData.testimonialSnippet && (
            <div className="mt-3 pt-3 border-t border-[#E8DED6] bg-[#FAF5F0]/60 p-3 rounded-xl flex items-start gap-2 text-xs text-[#4A3E39]">
              <Sparkles className="w-4 h-4 text-[#C8D5B9] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2D2421]">{currentStepData.testimonialSnippet.person}:</strong>{" "}
                <span>{currentStepData.testimonialSnippet.story}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step-Specific Special Interactive Tools */}
        {/* Step 4: Moral Inventory Tool */}
        {currentStepData.hasInventoryTool && (
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base sm:text-lg text-[#2D2421] font-semibold flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-[#796B64]" />
                  <span>Step 4 Mindful Inventory Builder</span>
                </h3>
                <p className="text-xs text-[#796B64] mt-0.5 leading-relaxed">
                  The book emphasizes acknowledging our strengths and dreams alongside defects so shame is jackhammered into submission.
                </p>
              </div>

              <button
                onClick={() => setShowInvForm(!showInvForm)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39] flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#FFD4C4]" />
                <span>Add Entry</span>
              </button>
            </div>

            {showInvForm && (
              <form onSubmit={handleAddInventory} className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] space-y-3 animate-in fade-in duration-200">
                <div className="flex gap-2">
                  {(['asset', 'defect', 'fear', 'resentment'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewInvCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs capitalize font-medium transition-all ${
                        newInvCategory === cat
                          ? 'bg-[#2D2421] text-[#FFF9F5]'
                          : 'bg-white border border-[#E8DED6] text-[#796B64]'
                      }`}
                    >
                      {cat === 'asset' ? 'Strength / Asset' : cat}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={newInvTitle}
                  onChange={(e) => setNewInvTitle(e.target.value)}
                  placeholder="Title (e.g. Tenacity in difficulty, Fear of rejection, Resentment toward coworker)"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E8DED6] text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0]"
                  required
                />

                <textarea
                  value={newInvDetails}
                  onChange={(e) => setNewInvDetails(e.target.value)}
                  placeholder="Notes, background, and how you invite God's healing light..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E8DED6] text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0] resize-none"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInvForm(false)}
                    className="px-3 py-1.5 text-xs text-[#796B64] hover:text-[#2D2421]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39]"
                  >
                    Save to Inventory
                  </button>
                </div>
              </form>
            )}

            {/* Inventory List */}
            <div className="space-y-2">
              {moralInventoryList.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#796B64] bg-[#FAF5F0] rounded-xl">
                  No inventory entries recorded yet. Begin by listing your assets and strengths.
                </div>
              ) : (
                moralInventoryList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#E8DED6] flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                          item.category === 'asset'
                            ? 'bg-[#C8D5B9]/60 text-[#243317]'
                            : item.category === 'fear'
                            ? 'bg-[#F4E4C1] text-[#59441B]'
                            : item.category === 'resentment'
                            ? 'bg-[#FFD4C4] text-[#7C3626]'
                            : 'bg-[#E6D5F0] text-[#3E2B52]'
                        }`}>
                          {item.category}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-[#2D2421]">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#4A3E39] leading-relaxed">
                        {item.details}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteMoralInventoryItem(item.id)}
                      className="p-1 text-[#A89B94] hover:text-[#9C3E32] transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Steps 8 & 9: Amends Ledger Tool */}
        {currentStepData.hasAmendsTool && (
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base sm:text-lg text-[#2D2421] font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#796B64]" />
                  <span>Amends & Reconciliation Ledger</span>
                </h3>
                <p className="text-xs text-[#796B64] mt-0.5 leading-relaxed">
                  Making amends is a tender, divine act of love that seeks genuine restitution without reopening harm.
                </p>
              </div>

              <button
                onClick={() => setShowAmendsForm(!showAmendsForm)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39] flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#FFD4C4]" />
                <span>Add Person</span>
              </button>
            </div>

            {showAmendsForm && (
              <form onSubmit={handleAddAmends} className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] space-y-3 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={newAmendsPerson}
                  onChange={(e) => setNewAmendsPerson(e.target.value)}
                  placeholder="Person or Organization harmed..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E8DED6] text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0]"
                  required
                />
                <input
                  type="text"
                  value={newAmendsHarm}
                  onChange={(e) => setNewAmendsHarm(e.target.value)}
                  placeholder="Nature of the harm caused..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E8DED6] text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0]"
                />
                <textarea
                  value={newAmendsPlan}
                  onChange={(e) => setNewAmendsPlan(e.target.value)}
                  placeholder="Restitution or living amends plan (with wisdom and prayer)..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E8DED6] text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAmendsForm(false)}
                    className="px-3 py-1.5 text-xs text-[#796B64] hover:text-[#2D2421]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39]"
                  >
                    Add to Ledger
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {amendsLedger.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#796B64] bg-[#FAF5F0] rounded-xl">
                  No amends entries created yet. Cultivate willingness by listing names.
                </div>
              ) : (
                amendsLedger.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#FFF9F5] border border-[#E8DED6] space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#2D2421]">
                          {item.person}
                        </h4>
                        <p className="text-xs text-[#796B64]">
                          <strong>Harm:</strong> {item.harmDone}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={item.status}
                          onChange={(e) => updateAmendsStatus(item.id, e.target.value as any)}
                          className="text-xs p-1 rounded-lg bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421]"
                        >
                          <option value="willing">Willing to Amend</option>
                          <option value="in_progress">In Progress</option>
                          <option value="made">Amends Made ✓</option>
                        </select>
                        <button
                          onClick={() => deleteAmendsItem(item.id)}
                          className="p-1 text-[#A89B94] hover:text-[#9C3E32]"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {item.amendsPlan && (
                      <div className="text-xs text-[#4A3E39] bg-[#FAF5F0] p-2.5 rounded-lg border border-[#E8DED6]/70">
                        <strong>Restitution Plan:</strong> {item.amendsPlan}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Guided Book Reflection Prompts */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
            <h3 className="font-serif text-base sm:text-lg text-[#2D2421] font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#796B64]" />
              <span>Step {currentStepData.stepNumber} Reflective Journal</span>
            </h3>
            <span className="text-[11px] text-[#796B64]">
              Study Guide & Essay Questions
            </span>
          </div>

          <div className="space-y-4">
            {currentStepData.reflectionPrompts.map((prompt) => {
              const currentVal = stepPromptAnswers[prompt.id] || '';

              return (
                <div key={prompt.id} className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-[#2D2421]">
                    {prompt.question}
                  </label>
                  <p className="text-[11px] text-[#796B64] italic">
                    {prompt.bookContext}
                  </p>
                  <textarea
                    value={currentVal}
                    onChange={(e) => saveStepPromptAnswer(prompt.id, e.target.value)}
                    placeholder={prompt.placeholder}
                    rows={3}
                    className="w-full p-3.5 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-xs sm:text-sm text-[#2D2421] placeholder-[#A89B94] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0] focus:border-transparent transition-all resize-none shadow-xs"
                  />
                </div>
              );
            })}

            {/* Freeform Step Reflection */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs sm:text-sm font-semibold text-[#2D2421]">
                Freeform Sacred Notes for Step {currentStepData.stepNumber}
              </label>
              <textarea
                value={stepFreeformNotes[active12StepNumber] || ''}
                onChange={(e) => saveStepFreeformNote(active12StepNumber, e.target.value)}
                placeholder="Write personal revelations, prayers of release, or conversations with your sponsor..."
                rows={4}
                className="w-full p-3.5 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-xs sm:text-sm text-[#2D2421] placeholder-[#A89B94] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0] resize-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation Between Steps */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrevStep}
            disabled={active12StepNumber === 1}
            className="px-4 py-2.5 rounded-xl border border-[#E8DED6] bg-[#FFF9F5] text-xs font-medium text-[#2D2421] hover:bg-[#FAF5F0] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Step {active12StepNumber > 1 ? active12StepNumber - 1 : 1}</span>
          </button>

          <span className="text-xs text-[#796B64] font-medium">
            Step {active12StepNumber} of 12
          </span>

          <button
            onClick={handleNextStep}
            disabled={active12StepNumber === 12}
            className="px-4 py-2.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Step {active12StepNumber < 12 ? active12StepNumber + 1 : 12}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {notificationMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 12-Step Workbook PDF Converter & Print Modal */}
      <WorkbookPdfPreviewModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        data={{
          cleanStartDate,
          daysInGrace: getDaysInGrace(),
          completedStepsCount: totalCompleted,
          stepPromptAnswers,
          stepFreeformNotes,
          stepCompletedMap,
          stepPrayerSpokenMap,
          moralInventoryList,
          amendsLedger
        }}
      />
    </div>
  );
};
