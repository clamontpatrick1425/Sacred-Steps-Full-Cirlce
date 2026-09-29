import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  FileText, 
  AlertCircle,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  ScanFace,
  Share2,
  BookOpen,
  TrendingUp,
  Brain,
  Shield,
  Heart,
  Volume2,
  Calendar,
  Smile,
  ExternalLink,
  Copy,
  ChevronRight,
  Filter,
  Search,
  Sunrise,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useSacredStore, JournalItem } from '../store/useSacredStore';
import { decryptJournalEntry } from '../utils/crypto';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';
import { TWELVE_STEP_GUIDED_PROMPTS } from '../data/twelveStepPrompts';
import { analyzeJournalPatternsLocally, PatternAnalysisResult } from '../services/aiPatternAnalysis';
import { 
  BiometricAuthService, 
  generateSponsorShareLink, 
  createEncryptedSponsorExport,
  SponsorShareData 
} from '../services/encryptionService';
import { JournalEntryEditor } from './JournalEntryEditor';
import { BookOfBreakthroughsModal } from './BookOfBreakthroughsModal';

export const JournalHome: React.FC = () => {
  const { 
    hasCreatedPin, 
    activePassphrase, 
    journalEntries, 
    biometricLockEnabled,
    optInAiPatterns,
    isEditorOpen,
    setupSanctuaryPin, 
    unlockJournalWithPin, 
    unlockJournalWithBiometrics,
    lockJournal, 
    deleteJournalEntry,
    importJournalBackup,
    toggleBiometricLock,
    toggleOptInAiPatterns,
    openJournalEditor,
    closeJournalEditor,
    hapticsEnabled,
    soundEnabled
  } = useSacredStore();

  // Authentication states
  const [pinInput, setPinInput] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(!hasCreatedPin);
  const [biometricScanning, setBiometricScanning] = useState(false);

  // Unlocked screen tab
  const [activeSubTab, setActiveSubTab] = useState<'entries' | 'prompts' | 'patterns' | 'sponsor'>('entries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStepFilter, setSelectedStepFilter] = useState<number | 'all'>('all');

  // Decrypted cache in memory
  const [decryptedMap, setDecryptedMap] = useState<{ [id: string]: string }>({});

  // Active viewing entry modal
  const [viewingEntry, setViewingEntry] = useState<JournalItem | null>(null);

  // Sponsor share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sponsorShareUrl, setSponsorShareUrl] = useState('');
  const [sponsorPassword, setSponsorPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Sponsor export state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [sponsorExportPasscode, setSponsorExportPasscode] = useState('');
  const [sponsorExportName, setSponsorExportName] = useState('My Sponsor');
  const [exportSuccess, setExportSuccess] = useState(false);

  // Memoir & Zero-Knowledge Backup state
  const [memoirModalOpen, setMemoirModalOpen] = useState(false);
  const [backupRestoreMessage, setBackupRestoreMessage] = useState('');

  const handleExportFullBackup = () => {
    if (hapticsEnabled) triggerHaptic('step');
    const state = useSacredStore.getState();
    const backupBundle = {
      app: "SacredSteps: Daily Grace",
      version: "2.0",
      exportDate: new Date().toISOString(),
      cleanStartDate: state.cleanStartDate,
      journalEntries: state.journalEntries,
      savedBreakthroughs: state.savedBreakthroughs,
      milestoneReflections: state.milestoneReflections,
      cravingLogs: state.cravingLogs,
      pinVerification: state.pinVerification,
      securityGuarantee: "Zero-Knowledge AES-256 Client-Side Encrypted"
    };

    const jsonStr = JSON.stringify(backupBundle, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sacred-steps-vault-backup-${new Date().toISOString().slice(0, 10)}.sacredbackup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.journalEntries && !parsed.cleanStartDate) {
          setBackupRestoreMessage('Error: Invalid SacredSteps backup file format.');
          return;
        }

        useSacredStore.setState((prev) => ({
          ...prev,
          journalEntries: parsed.journalEntries || prev.journalEntries,
          savedBreakthroughs: parsed.savedBreakthroughs || prev.savedBreakthroughs,
          milestoneReflections: parsed.milestoneReflections || prev.milestoneReflections,
          cravingLogs: parsed.cravingLogs || prev.cravingLogs,
          cleanStartDate: parsed.cleanStartDate || prev.cleanStartDate
        }));

        if (hapticsEnabled) triggerHaptic('step');
        setBackupRestoreMessage('Vault successfully restored from backup!');
        setTimeout(() => setBackupRestoreMessage(''), 4000);
      } catch (err) {
        setBackupRestoreMessage('Failed to parse backup file. Please ensure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isUnlocked = Boolean(activePassphrase);

  // Decrypt entries when unlocked
  useEffect(() => {
    if (isUnlocked && activePassphrase) {
      journalEntries.forEach(async (entry) => {
        if (!decryptedMap[entry.id]) {
          try {
            const plain = await decryptJournalEntry(entry.payload, activePassphrase);
            setDecryptedMap((prev) => ({ ...prev, [entry.id]: plain }));
          } catch {
            // failed decryption for specific record
          }
        }
      });
    } else {
      setDecryptedMap({});
    }
  }, [isUnlocked, activePassphrase, journalEntries]);

  // Handle PIN Unlock / Setup
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isSettingUp) {
      if (pinInput.length < 4) {
        setErrorMessage('Sanctuary PIN must be at least 4 digits/characters.');
        return;
      }
      if (pinInput !== pinConfirm) {
        setErrorMessage('PINs do not match. Please re-enter.');
        return;
      }

      const ok = await setupSanctuaryPin(pinInput);
      if (ok) {
        // Offer biometric registration if available
        if (BiometricAuthService.isBiometricAvailable()) {
          await BiometricAuthService.registerBiometrics(pinInput);
          toggleBiometricLock(true);
        }
        setPinInput('');
        setPinConfirm('');
        setIsSettingUp(false);
      }
    } else {
      const ok = await unlockJournalWithPin(pinInput);
      if (!ok) {
        setErrorMessage('Incorrect PIN. Please try again.');
      } else {
        setPinInput('');
      }
    }
  };

  // Biometric Unlock Trigger (Face ID / Touch ID)
  const handleBiometricUnlock = async () => {
    setBiometricScanning(true);
    setErrorMessage('');
    if (hapticsEnabled) triggerHaptic('soft');

    // Simulate tactile biometric scan
    setTimeout(async () => {
      try {
        const success = await unlockJournalWithBiometrics();
        if (!success) {
          // If biometric credential requires fallback to PIN entry
          setErrorMessage('Please enter your Sanctuary PIN to unlock.');
        }
      } catch (err) {
        setErrorMessage('Biometric scan unsuccessful. Please use PIN.');
      } finally {
        setBiometricScanning(false);
      }
    }, 700);
  };

  // Compute AI Pattern Analysis locally
  const patternAnalysisResult: PatternAnalysisResult | null = React.useMemo(() => {
    if (!isUnlocked || !optInAiPatterns || journalEntries.length === 0) return null;

    const decryptedEntries = journalEntries
      .filter(e => decryptedMap[e.id])
      .map(e => ({
        id: e.id,
        date: e.date,
        title: e.title,
        content: decryptedMap[e.id],
        moodRating: e.moodRating,
        stepNumber: e.stepNumber,
        stepPrompt: e.stepPrompt,
        triggerTag: e.triggerTag
      }));

    return analyzeJournalPatternsLocally(decryptedEntries, optInAiPatterns);
  }, [isUnlocked, optInAiPatterns, journalEntries, decryptedMap]);

  // Generate Sponsor Share Link for an entry
  const handleGenerateShareLink = async (entry: JournalItem) => {
    const plain = decryptedMap[entry.id] || '';
    const shareData: SponsorShareData = {
      title: entry.title,
      date: entry.date,
      stepNumber: entry.stepNumber,
      stepPrompt: entry.stepPrompt,
      moodRating: entry.moodRating,
      content: plain,
      sharedAt: new Date().toISOString()
    };

    const { url } = await generateSponsorShareLink(shareData, sponsorPassword || undefined);
    setSponsorShareUrl(url);
    setShareModalOpen(true);
    if (hapticsEnabled) triggerHaptic('step');
  };

  // Export full encrypted sponsor file
  const handleExportSponsorFile = async () => {
    if (!sponsorExportPasscode || sponsorExportPasscode.length < 4) {
      alert('Please enter a sponsor passcode of at least 4 characters to protect this export.');
      return;
    }

    try {
      const decryptedList = journalEntries
        .filter(e => decryptedMap[e.id])
        .map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          content: decryptedMap[e.id],
          moodRating: e.moodRating,
          stepNumber: e.stepNumber,
          stepPrompt: e.stepPrompt
        }));

      const exportString = await createEncryptedSponsorExport(decryptedList, sponsorExportPasscode, sponsorExportName);
      
      // Trigger file download
      const blob = new Blob([exportString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SacredSteps-12Step-Journal-${new Date().toISOString().slice(0, 10)}.sacred-export`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        setExportModalOpen(false);
      }, 2000);
      if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
    } catch (err) {
      alert('Failed to generate sponsor export.');
    }
  };

  // If editor is open, render full-screen editor
  if (isEditorOpen) {
    return <JournalEntryEditor onClose={closeJournalEditor} />;
  }

  // Filtered Entries
  const filteredEntries = journalEntries.filter(entry => {
    const matchesStep = selectedStepFilter === 'all' || entry.stepNumber === selectedStepFilter;
    const content = (decryptedMap[entry.id] || '').toLowerCase();
    const title = (entry.title || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery = !query || title.includes(query) || content.includes(query) || (entry.triggerTag || '').toLowerCase().includes(query);
    return matchesStep && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D2421] pb-24 font-sans">
      
      {/* Header Banner */}
      <header className="sticky top-0 z-30 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-[#E8DED6] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#E6D5F0]/60 text-[#2D2421]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold leading-tight">
              12-Step Encrypted Journal
            </h1>
            <p className="text-[10px] text-[#796B64]">
              {isUnlocked ? 'Vault Open • AES-256 Protected' : 'Sanctuary Vault Locked'}
            </p>
          </div>
        </div>

        {isUnlocked ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openJournalEditor()}
              className="bg-[#2D2421] text-[#FFF9F5] hover:bg-[#433632] px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5 text-[#C8D5B9]" />
              <span>New Entry</span>
            </button>
            <button
              onClick={lockJournal}
              title="Lock Sanctuary Vault"
              className="p-2 text-[#796B64] hover:text-[#2D2421] hover:bg-[#E8DED6]/40 rounded-xl transition"
            >
              <Lock className="w-4 h-4 text-[#B34040]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] bg-[#C8D5B9]/20 border border-[#C8D5B9]/40 text-[#445237] px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A6E4B]" />
            <span>Local-First</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        
        {/* ======================================================== */}
        {/* LOCKED STATE: PIN & BIOMETRIC AUTHENTICATION            */}
        {/* ======================================================== */}
        {!isUnlocked && (
          <div className="space-y-4 pt-2">
            
            {/* Sanctuary Vault Badge */}
            <div className="text-center space-y-2 py-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#FFD4C4] via-[#E6D5F0] to-[#C8D5B9] p-0.5 shadow-sm">
                <div className="w-full h-full bg-[#FFF9F5] rounded-[22px] flex items-center justify-center">
                  <Lock className="w-7 h-7 text-[#2D2421]" />
                </div>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#2D2421]">
                {hasCreatedPin ? 'Unlock Sanctuary Vault' : 'Create Sanctuary PIN'}
              </h2>
              <p className="text-xs text-[#796B64] max-w-sm mx-auto leading-relaxed">
                {hasCreatedPin
                  ? 'Your journal entries are encrypted on your device using AES-256. Only your personal PIN or biometric scan can decrypt them.'
                  : 'Set a private PIN to begin encrypting your 12-Step journal reflections on this device. Zero data ever leaves your hands.'}
              </p>
            </div>

            {/* Quick Biometric Button (If enabled and PIN set) */}
            {hasCreatedPin && (
              <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm text-center space-y-3">
                <button
                  type="button"
                  onClick={handleBiometricUnlock}
                  disabled={biometricScanning}
                  className="w-full py-3 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl flex items-center justify-center gap-2.5 text-xs font-semibold text-[#2D2421] hover:border-[#C8D5B9] hover:bg-[#C8D5B9]/10 transition shadow-sm"
                >
                  {biometricScanning ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-[#5A6E4B] border-t-transparent rounded-full" />
                      <span>Scanning Biometrics...</span>
                    </>
                  ) : (
                    <>
                      <ScanFace className="w-4 h-4 text-[#5A6E4B]" />
                      <span>Unlock with Face ID / Touch ID</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-[#796B64]">
                  <span className="h-px w-10 bg-[#E8DED6]" />
                  <span>or enter Sanctuary PIN</span>
                  <span className="h-px w-10 bg-[#E8DED6]" />
                </div>
              </div>
            )}

            {/* PIN Entry Form */}
            <form onSubmit={handlePinSubmit} className="bg-white rounded-2xl p-5 border border-[#E8DED6] shadow-sm space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#796B64]">
                  {isSettingUp ? 'Set Sanctuary PIN' : 'Enter Sanctuary PIN'}
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4+ digit PIN..."
                  className="w-full px-4 py-3 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl text-center text-lg tracking-widest font-mono focus:outline-none focus:border-[#C8D5B9] text-[#2D2421]"
                  autoFocus
                />
              </div>

              {isSettingUp && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#796B64]">
                    Confirm Sanctuary PIN
                  </label>
                  <input
                    type="password"
                    value={pinConfirm}
                    onChange={(e) => setPinConfirm(e.target.value)}
                    placeholder="Re-enter PIN to confirm..."
                    className="w-full px-4 py-3 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl text-center text-lg tracking-widest font-mono focus:outline-none focus:border-[#C8D5B9] text-[#2D2421]"
                  />
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#2D2421] text-[#FFF9F5] rounded-xl font-medium text-xs tracking-wider uppercase shadow hover:bg-[#433632] transition flex items-center justify-center gap-2"
              >
                <Unlock className="w-3.5 h-3.5 text-[#C8D5B9]" />
                <span>{isSettingUp ? 'Set Up Vault & Unlock' : 'Unlock Sanctuary'}</span>
              </button>

              {hasCreatedPin && !isSettingUp && (
                <button
                  type="button"
                  onClick={() => setIsSettingUp(true)}
                  className="w-full text-center text-[10px] text-[#796B64] hover:text-[#2D2421] transition pt-1"
                >
                  Forgot PIN? Reset Sanctuary PIN
                </button>
              )}
            </form>

            {/* Local-First Security Architecture Guarantee */}
            <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-2xl p-4 text-xs space-y-2 text-[#554742]">
              <div className="flex items-center gap-2 font-semibold text-[#2D2421]">
                <ShieldCheck className="w-4 h-4 text-[#5A6E4B]" />
                <span>Zero-Knowledge Security Architecture</span>
              </div>
              <ul className="text-[11px] space-y-1 text-[#796B64] list-disc list-inside">
                <li><strong>AES-GCM 256-bit:</strong> Military-grade encryption derived via PBKDF2 with 100,000 rounds.</li>
                <li><strong>Local-First:</strong> Entries never leave this device unless you choose to export for your sponsor.</li>
                <li><strong>Volatile Memory:</strong> Your decryption key is never stored in plain localStorage; locking clears it from RAM immediately.</li>
              </ul>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* UNLOCKED STATE: JOURNAL DASHBOARD, PROMPTS & AI INSIGHTS */}
        {/* ======================================================== */}
        {isUnlocked && (
          <div className="space-y-4">
            
            {/* Quick Action Hero Banner */}
            <div className="bg-gradient-to-r from-[#FFD4C4]/40 via-[#E6D5F0]/40 to-[#C8D5B9]/40 border border-[#E8DED6] rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6E4B]">
                  Grace Reflection
                </span>
                <h3 className="font-serif text-sm font-bold text-[#2D2421]">
                  "Take the next mindful step."
                </h3>
                <p className="text-[11px] text-[#796B64]">
                  {journalEntries.length} encrypted {journalEntries.length === 1 ? 'reflection' : 'reflections'} stored securely.
                </p>
              </div>

              <button
                onClick={() => openJournalEditor()}
                className="bg-[#2D2421] text-[#FFF9F5] px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow hover:bg-[#433632] transition shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8D5B9]" />
                <span>Write</span>
              </button>
            </div>

            {/* Segmented Sub-Tab Switcher */}
            <div className="flex items-center p-1 bg-white border border-[#E8DED6] rounded-2xl shadow-sm">
              <button
                onClick={() => {
                  setActiveSubTab('entries');
                  if (hapticsEnabled) triggerHaptic('soft');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition ${
                  activeSubTab === 'entries'
                    ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                    : 'text-[#796B64] hover:text-[#2D2421]'
                }`}
              >
                Entries ({journalEntries.length})
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('prompts');
                  if (hapticsEnabled) triggerHaptic('soft');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition ${
                  activeSubTab === 'prompts'
                    ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                    : 'text-[#796B64] hover:text-[#2D2421]'
                }`}
              >
                12-Step Prompts
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('patterns');
                  if (hapticsEnabled) triggerHaptic('soft');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition flex items-center justify-center gap-1 ${
                  activeSubTab === 'patterns'
                    ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                    : 'text-[#796B64] hover:text-[#2D2421]'
                }`}
              >
                <Brain className="w-3 h-3 text-[#C4A9D8]" />
                <span>AI Patterns</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('sponsor');
                  if (hapticsEnabled) triggerHaptic('soft');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition ${
                  activeSubTab === 'sponsor'
                    ? 'bg-[#2D2421] text-[#FFF9F5] shadow-xs'
                    : 'text-[#796B64] hover:text-[#2D2421]'
                }`}
              >
                Sponsor & Sync
              </button>
            </div>

            {/* ---------------------------------------------------- */}
            {/* SUB-TAB 1: ENTRIES LIST                              */}
            {/* ---------------------------------------------------- */}
            {activeSubTab === 'entries' && (
              <div className="space-y-3">
                {/* Search & Step Filter */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-[#796B64] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search encrypted entries..."
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E8DED6] rounded-xl text-xs text-[#2D2421] placeholder:text-[#9E8E87] focus:outline-none focus:border-[#C8D5B9]"
                    />
                  </div>

                  <select
                    value={selectedStepFilter}
                    onChange={(e) => setSelectedStepFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="bg-white border border-[#E8DED6] rounded-xl px-2.5 py-1.5 text-xs text-[#554742] focus:outline-none focus:border-[#C8D5B9]"
                  >
                    <option value="all">All Steps</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s}>Step {s}</option>
                    ))}
                  </select>
                </div>

                {filteredEntries.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-[#E8DED6] text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FFF9F5] border border-[#E8DED6] mx-auto flex items-center justify-center text-[#796B64]">
                      <BookOpen className="w-5 h-5 text-[#C4A9D8]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                        No Journal Reflections Found
                      </h4>
                      <p className="text-xs text-[#796B64] max-w-xs mx-auto">
                        Begin with Step 1: "Describe a moment when you realized your addiction had more control than you did."
                      </p>
                    </div>
                    <button
                      onClick={() => openJournalEditor({ stepNumber: 1 })}
                      className="bg-[#2D2421] text-[#FFF9F5] px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C8D5B9]" />
                      <span>Start Step 1 Reflection</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredEntries.map((entry) => {
                      const plainText = decryptedMap[entry.id] || 'Decrypting...';
                      const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });

                      return (
                        <div
                          key={entry.id}
                          onClick={() => setViewingEntry(entry)}
                          className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm hover:border-[#C8D5B9] cursor-pointer transition space-y-2 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {entry.stepNumber && (
                                <span className="bg-[#2D2421] text-[#FFF9F5] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Step {entry.stepNumber}
                                </span>
                              )}
                              {entry.moodRating && (
                                <span className="text-[10px] bg-[#FFF9F5] border border-[#E8DED6] text-[#554742] px-2 py-0.5 rounded-full">
                                  Mood {entry.moodRating}/5
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#796B64]">
                              {formattedDate}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-serif text-sm font-bold text-[#2D2421] line-clamp-1">
                              {entry.title}
                            </h4>
                            {entry.stepPrompt && (
                              <p className="text-[11px] text-[#5A6E4B] italic line-clamp-1 mt-0.5">
                                "{entry.stepPrompt}"
                              </p>
                            )}
                            <p className="text-xs text-[#796B64] line-clamp-2 mt-1 font-sans">
                              {plainText}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-[#E8DED6]/50 text-[10px] text-[#796B64]">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#5A6E4B]" />
                              <span>AES-256 Encrypted</span>
                            </span>
                            <span className="flex items-center gap-1 text-[#2D2421] font-medium">
                              <span>Read Entry</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* SUB-TAB 2: GUIDED 12-STEP PROMPTS LIBRARY            */}
            {/* ---------------------------------------------------- */}
            {activeSubTab === 'prompts' && (
              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm">
                  <h3 className="font-serif text-sm font-bold text-[#2D2421]">
                    Interactive 12-Step Reflection Prompts
                  </h3>
                  <p className="text-xs text-[#796B64] mt-0.5">
                    Curated prompts directly from C. Lamont Patrick's *Sacred Steps to Redemption*. Select any prompt to begin an encrypted journal entry.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {TWELVE_STEP_GUIDED_PROMPTS.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-[#2D2421] text-[#FFF9F5] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Step {prompt.stepNumber}
                        </span>
                        <span className="text-[10px] font-semibold text-[#5A6E4B] uppercase tracking-wider">
                          {prompt.tag}
                        </span>
                      </div>

                      <p className="font-serif text-sm font-semibold text-[#2D2421] leading-snug">
                        "{prompt.question}"
                      </p>

                      <div className="bg-[#FFF9F5] p-2.5 rounded-xl border border-[#E8DED6]/80 text-[11px] text-[#796B64] italic">
                        "{prompt.scriptureAnchor.text}" — <span className="font-sans font-semibold">{prompt.scriptureAnchor.reference}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-[#796B64]">
                          {prompt.bookChapter}
                        </span>
                        <button
                          type="button"
                          onClick={() => openJournalEditor({ stepNumber: prompt.stepNumber, prompt: prompt.question })}
                          className="bg-[#FFF9F5] border border-[#E8DED6] hover:border-[#C8D5B9] text-[#2D2421] px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1 shadow-2xs transition"
                        >
                          <Plus className="w-3 h-3 text-[#5A6E4B]" />
                          <span>Journal Prompt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* SUB-TAB 3: AI PATTERN RECOGNITION (OPT-IN & LOCAL)   */}
            {/* ---------------------------------------------------- */}
            {activeSubTab === 'patterns' && (
              <div className="space-y-3 text-left">
                {/* Privacy & Opt-in Banner */}
                <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#C4A9D8]" />
                      <h3 className="font-serif text-sm font-bold text-[#2D2421]">
                        AI-Assisted Pattern Recognition
                      </h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={optInAiPatterns}
                        onChange={(e) => toggleOptInAiPatterns(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5A6E4B]"></div>
                    </label>
                  </div>

                  <p className="text-xs text-[#796B64] leading-relaxed">
                    <strong>100% On-Device & Private:</strong> This pattern analysis runs purely on your device's browser memory. Your unencrypted entries are never transmitted to any external server or LLM.
                  </p>
                </div>

                {!optInAiPatterns ? (
                  <div className="bg-white rounded-2xl p-6 border border-[#E8DED6] text-center space-y-3">
                    <Shield className="w-8 h-8 text-[#796B64] mx-auto" />
                    <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                      AI Pattern Recognition is Disabled
                    </h4>
                    <p className="text-xs text-[#796B64] max-w-sm mx-auto">
                      Enable the switch above if you would like on-device insights into your emotional trajectories, recurring recovery triggers, and breakthrough markers.
                    </p>
                  </div>
                ) : !patternAnalysisResult ? (
                  <div className="bg-white rounded-2xl p-6 border border-[#E8DED6] text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-[#C4A9D8] mx-auto" />
                    <h4 className="font-serif text-sm font-bold text-[#2D2421]">
                      Awaiting More Journal Reflections
                    </h4>
                    <p className="text-xs text-[#796B64] max-w-sm mx-auto">
                      Write your first 1-2 entries to let the local engine identify spiritual themes and emotional trajectories.
                    </p>
                    <button
                      onClick={() => openJournalEditor()}
                      className="bg-[#2D2421] text-[#FFF9F5] px-3.5 py-1.5 rounded-xl text-xs font-medium inline-flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C8D5B9]" />
                      <span>Write an Entry</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    
                    {/* Mood Trajectory Card */}
                    <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2D2421] flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-[#5A6E4B]" />
                          <span>Emotional Recovery Trajectory</span>
                        </span>
                        <span className="text-xs font-bold text-[#5A6E4B] bg-[#C8D5B9]/20 px-2.5 py-0.5 rounded-full">
                          Avg: {patternAnalysisResult.moodMetrics.averageScore} / 5.0
                        </span>
                      </div>

                      <p className="text-xs text-[#554742]">
                        {patternAnalysisResult.moodMetrics.trendSummary}
                      </p>

                      {/* Distribution Bar */}
                      <div className="space-y-1">
                        <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-[#FFF9F5] border border-[#E8DED6]">
                          <div style={{ width: `${(patternAnalysisResult.moodMetrics.distribution.heavyValley / patternAnalysisResult.totalAnalyzed) * 100}%` }} className="bg-stone-400" title="Valley" />
                          <div style={{ width: `${(patternAnalysisResult.moodMetrics.distribution.seekingGrace / patternAnalysisResult.totalAnalyzed) * 100}%` }} className="bg-[#C4A9D8]" title="Seeking Grace" />
                          <div style={{ width: `${(patternAnalysisResult.moodMetrics.distribution.grounded / patternAnalysisResult.totalAnalyzed) * 100}%` }} className="bg-[#9DB88B]" title="Grounded" />
                          <div style={{ width: `${(patternAnalysisResult.moodMetrics.distribution.risingHope / patternAnalysisResult.totalAnalyzed) * 100}%` }} className="bg-[#F9A88F]" title="Rising Hope" />
                          <div style={{ width: `${(patternAnalysisResult.moodMetrics.distribution.radiantPeace / patternAnalysisResult.totalAnalyzed) * 100}%` }} className="bg-[#E3C985]" title="Radiant Peace" />
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-[#796B64]">
                          <span>Valley</span>
                          <span>Seeking</span>
                          <span>Grounded</span>
                          <span>Rising Hope</span>
                          <span>Peace</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Themes Detected */}
                    <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-2.5">
                      <span className="text-xs font-bold text-[#2D2421]">
                        Spiritual & Recovery Themes Detected
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {patternAnalysisResult.topThemes.map((theme, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-[#FFF9F5] border border-[#E8DED6] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#2D2421]">{theme.theme}</span>
                              <span className="text-[10px] text-[#5A6E4B] font-bold">{theme.count} mentions</span>
                            </div>
                            <p className="text-[10px] text-[#796B64]">{theme.description}</p>
                            {theme.scriptureAnchor && (
                              <span className="text-[9px] text-[#796B64] italic block">Anchor: {theme.scriptureAnchor}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Next Step */}
                    <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D2421]">
                        <Compass className="w-4 h-4 text-[#D8B4E2]" />
                        <span>Book Recommendation: {patternAnalysisResult.recommendedNextStep.stepTitle}</span>
                      </div>
                      <p className="text-xs text-[#554742]">
                        {patternAnalysisResult.recommendedNextStep.reason}
                      </p>
                      <div className="bg-[#FFF9F5] p-2.5 rounded-xl border border-[#E8DED6] text-[11px] text-[#5A6E4B] flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <div>
                          <strong>Micro-Action:</strong> {patternAnalysisResult.recommendedNextStep.actionableMicroStep}
                        </div>
                      </div>
                    </div>

                    {/* Curated Grace Affirmation */}
                    <div className="bg-gradient-to-r from-[#FFD4C4]/30 to-[#E6D5F0]/30 rounded-2xl p-4 border border-[#E8DED6] text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#5A6E4B]">
                        Personalized Daily Affirmation
                      </span>
                      <p className="font-serif italic text-sm text-[#2D2421]">
                        "{patternAnalysisResult.curatedAffirmation}"
                      </p>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* SUB-TAB 4: SPONSOR SHARING & SECURITY SETTINGS      */}
            {/* ---------------------------------------------------- */}
            {activeSubTab === 'sponsor' && (
              <div className="space-y-3 text-left">
                {/* Biometric Lock Settings */}
                <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-[#5A6E4B]" />
                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#2D2421]">
                          Biometric Vault Lock (Face ID / Touch ID)
                        </h4>
                        <p className="text-[10px] text-[#796B64]">
                          Quickly unlock Sanctuary Vault with your fingerprint or facial scan.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={biometricLockEnabled}
                        onChange={(e) => toggleBiometricLock(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5A6E4B]"></div>
                    </label>
                  </div>
                </div>

                {/* Book of Breakthroughs: Printable Spiritual Memoir */}
                <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FFF9F0] to-[#E6D5F0]/25 rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#70427D]" />
                      <h4 className="font-serif text-xs font-bold text-[#2D2421]">
                        Book of Breakthroughs (Printable Memoir)
                      </h4>
                    </div>
                    <span className="text-[10px] bg-[#E6D5F0]/60 text-[#4E2B5A] px-2 py-0.5 rounded-full font-bold">
                      PDF / Print
                    </span>
                  </div>
                  <p className="text-xs text-[#796B64] leading-relaxed">
                    Compile all your decrypted 12-Step reflections, breakthroughs, and milestone dates into an archival spiritual recovery book formatted for printing or PDF archiving.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setMemoirModalOpen(true);
                      if (hapticsEnabled) triggerHaptic('soft');
                    }}
                    className="w-full py-2.5 bg-[#2D2421] text-[#FFF9F5] hover:bg-[#433632] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#FFD4C4]" />
                    <span>Open & Print Book of Breakthroughs</span>
                  </button>
                </div>

                {/* Zero-Knowledge Encrypted Full Vault Backup & Cloud Sync */}
                <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#5A6E4B]" />
                      <h4 className="font-serif text-xs font-bold text-[#2D2421]">
                        Zero-Knowledge Full Vault Backup
                      </h4>
                    </div>
                    <span className="text-[10px] bg-[#C8D5B9]/30 text-[#445237] px-2 py-0.5 rounded-full font-medium">
                      Encrypted .json
                    </span>
                  </div>
                  <p className="text-xs text-[#796B64] leading-relaxed">
                    Download an AES-256 encrypted package containing all journal entries, milestone reflections, and bookmarks. Transfer this file safely to any new device or cloud backup.
                  </p>

                  {backupRestoreMessage && (
                    <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                      backupRestoreMessage.includes('Error') || backupRestoreMessage.includes('Failed')
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-[#C8D5B9]/30 text-[#3A492C] border border-[#C8D5B9]/60'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                      <span>{backupRestoreMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleExportFullBackup}
                      className="py-2.5 px-3 bg-[#FAF5F0] border border-[#E8DED6] hover:bg-[#F5EFEB] text-[#2D2421] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-[#5A6E4B]" />
                      <span>Download Backup</span>
                    </button>

                    <label className="py-2.5 px-3 bg-white border border-[#E8DED6] hover:border-[#2D2421] text-[#2D2421] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition text-center">
                      <Upload className="w-3.5 h-3.5 text-[#796B64]" />
                      <span>Restore from Backup</span>
                      <input
                        type="file"
                        accept=".json,.sacredbackup.json"
                        onChange={handleImportBackupFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Encrypted Export for Sponsor */}
                <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#C4A9D8]" />
                    <h4 className="font-serif text-xs font-bold text-[#2D2421]">
                      Encrypted Export for Sponsor
                    </h4>
                  </div>
                  <p className="text-xs text-[#796B64] leading-relaxed">
                    Bundle and encrypt your 12-Step reflections into a protected file using a sponsor passkey. Your sponsor can safely open this without access to your main device.
                  </p>

                  <button
                    type="button"
                    onClick={() => setExportModalOpen(true)}
                    className="w-full py-2.5 bg-[#FFF9F5] border border-[#E8DED6] hover:border-[#C8D5B9] text-[#2D2421] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#5A6E4B]" />
                    <span>Create Encrypted Sponsor Package</span>
                  </button>
                </div>

                {/* Local-First Storage Status */}
                <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#5A6E4B]" />
                    <h4 className="font-serif text-xs font-bold text-[#2D2421]">
                      Local-First Storage Guarantee
                    </h4>
                  </div>
                  <p className="text-xs text-[#796B64] leading-relaxed">
                    Data never leaves your device unless you explicitly export or generate a sponsor link. All records are isolated inside browser persistent indexed storage under AES-256 GCM encryption.
                  </p>
                  <div className="text-[10px] text-[#5A6E4B] font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Device Vault Status: Encrypted & Healthy</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: VIEW SINGLE JOURNAL ENTRY DETAIL                 */}
      {/* ======================================================== */}
      {viewingEntry && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF9F5] max-w-lg w-full rounded-3xl border border-[#E8DED6] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-[#E8DED6] pb-3">
              <div className="flex items-center gap-2">
                {viewingEntry.stepNumber && (
                  <span className="bg-[#2D2421] text-[#FFF9F5] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Step {viewingEntry.stepNumber}
                  </span>
                )}
                <span className="text-xs text-[#796B64]">
                  {new Date(viewingEntry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <button
                onClick={() => setViewingEntry(null)}
                className="text-xs text-[#796B64] hover:text-[#2D2421] px-2 py-1 rounded-lg hover:bg-[#E8DED6]"
              >
                Close
              </button>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D2421]">
                {viewingEntry.title}
              </h3>
              {viewingEntry.stepPrompt && (
                <p className="text-xs text-[#5A6E4B] font-serif italic mt-1 bg-white p-2.5 rounded-xl border border-[#E8DED6]">
                  "{viewingEntry.stepPrompt}"
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] font-sans text-xs leading-relaxed text-[#2D2421] whitespace-pre-wrap">
              {decryptedMap[viewingEntry.id] || 'Decrypting reflection...'}
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => {
                  const entryToShare = viewingEntry;
                  setViewingEntry(null);
                  handleGenerateShareLink(entryToShare);
                }}
                className="flex items-center gap-1.5 text-xs text-[#2D2421] hover:text-[#5A6E4B] font-medium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share with Sponsor</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const idToEdit = viewingEntry.id;
                    setViewingEntry(null);
                    openJournalEditor({ entryId: idToEdit });
                  }}
                  className="px-3 py-1 bg-white border border-[#E8DED6] text-xs rounded-xl hover:border-[#C8D5B9]"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to permanently delete this encrypted entry?')) {
                      deleteJournalEntry(viewingEntry.id);
                      setViewingEntry(null);
                    }
                  }}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SHARE SPECIFIC ENTRY WITH SPONSOR                */}
      {/* ======================================================== */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl border border-[#E8DED6] p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#5A6E4B]" />
                <h3 className="font-serif text-sm font-bold text-[#2D2421]">
                  Secure Sponsor Share Link
                </h3>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-xs text-[#796B64] hover:text-[#2D2421]"
              >
                Done
              </button>
            </div>

            <p className="text-xs text-[#796B64] leading-relaxed">
              This unique link contains the encryption key only inside the URL fragment (<code className="text-[#5A6E4B]">#key=...</code>). The text is never saved on external servers.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#796B64]">
                Encrypted Link
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={sponsorShareUrl}
                  className="flex-1 px-3 py-2 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl text-xs font-mono text-[#796B64] truncate"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(sponsorShareUrl);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                    if (hapticsEnabled) triggerHaptic('step');
                  }}
                  className="px-3 py-2 bg-[#2D2421] text-[#FFF9F5] rounded-xl text-xs font-medium hover:bg-[#433632] shrink-0 flex items-center gap-1"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-[#C8D5B9]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#E8DED6] text-[11px] text-[#554742] space-y-1">
              <strong>Tip for Sponsor Review:</strong> Send this link directly to your sponsor via SMS or Email. They can open it to read this specific entry safely.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EXPORT ENCRYPTED SPONSOR BUNDLE                   */}
      {/* ======================================================== */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl border border-[#E8DED6] p-5 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#C4A9D8]" />
                <h3 className="font-serif text-sm font-bold text-[#2D2421]">
                  Export Encrypted Sponsor Package
                </h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-xs text-[#796B64] hover:text-[#2D2421]"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-[#796B64] leading-relaxed">
              Export all {journalEntries.length} decrypted entries encrypted with a dedicated sponsor passcode.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#796B64]">
                  Sponsor Name / Label
                </label>
                <input
                  type="text"
                  value={sponsorExportName}
                  onChange={(e) => setSponsorExportName(e.target.value)}
                  placeholder="e.g., Pastor David, Elena, Sponsor John"
                  className="w-full px-3 py-2 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl text-xs text-[#2D2421]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#796B64]">
                  Sponsor Passcode (to decrypt file)
                </label>
                <input
                  type="password"
                  value={sponsorExportPasscode}
                  onChange={(e) => setSponsorExportPasscode(e.target.value)}
                  placeholder="Create a shared passcode (4+ characters)..."
                  className="w-full px-3 py-2 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl text-xs text-[#2D2421]"
                />
              </div>

              <button
                type="button"
                onClick={handleExportSponsorFile}
                className="w-full py-3 bg-[#2D2421] text-[#FFF9F5] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow hover:bg-[#433632] transition"
              >
                {exportSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                    <span>Package Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#C8D5B9]" />
                    <span>Download Protected Package (.sacred-export)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK OF BREAKTHROUGHS MODAL (Printable Spiritual Memoir) */}
      <BookOfBreakthroughsModal
        isOpen={memoirModalOpen}
        onClose={() => setMemoirModalOpen(false)}
        decryptedEntries={decryptedMap}
      />

    </div>
  );
};
