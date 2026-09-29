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
  EyeOff
} from 'lucide-react';
import { useSacredStore, JournalItem } from '../store/useSacredStore';
import { decryptJournalEntry } from '../utils/crypto';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

export const EncryptedJournalScreen: React.FC = () => {
  const { 
    hasCreatedPin, 
    activePassphrase, 
    journalEntries, 
    setupSanctuaryPin, 
    unlockJournalWithPin, 
    lockJournal, 
    addJournalEntry, 
    deleteJournalEntry,
    importJournalBackup,
    hapticsEnabled,
    soundEnabled
  } = useSacredStore();

  const [pinInput, setPinInput] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(!hasCreatedPin);

  // New entry form state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTriggerTag, setNewTriggerTag] = useState('');
  const [decryptedMap, setDecryptedMap] = useState<{ [id: string]: string }>({});

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
            // Decryption failed for this entry
          }
        }
      });
    } else {
      setDecryptedMap({});
    }
  }, [isUnlocked, activePassphrase, journalEntries]);

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

  const handleSaveEntry = async () => {
    if (!newContent.trim()) return;
    const ok = await addJournalEntry(
      newTitle.trim() || 'Grace Reflection',
      newContent.trim(),
      newTriggerTag || undefined
    );
    if (ok) {
      setNewTitle('');
      setNewContent('');
      setNewTriggerTag('');
      setIsCreating(false);
    }
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(journalEntries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sacred-steps-encrypted-journal-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          importJournalBackup(imported);
          alert('Encrypted entries imported successfully.');
        }
      } catch {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FFF9F5] via-[#FAF5F0] to-[#F5EFEB] border border-[#E8DED6] rounded-2xl p-5 sm:p-6 shadow-sm flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6D5F0] ring-4 ring-[#E6D5F0]/30" />
            <h1 className="font-serif text-xl sm:text-2xl text-[#2D2421] font-semibold">
              Encrypted Grace Journal
            </h1>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#796B64]">
            Zero-knowledge, client-side AES-256 GCM encrypted personal sanctuary.
          </p>
        </div>

        {isUnlocked && (
          <button
            onClick={lockJournal}
            className="px-3 py-1.5 rounded-lg bg-[#FAF5F0] border border-[#E8DED6] text-xs text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center gap-1.5"
            title="Lock Journal"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        )}
      </div>

      {!isUnlocked ? (
        /* Lock Screen / PIN Entry */
        <div className="max-w-md mx-auto p-6 sm:p-8 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E6D5F0]/50 border border-[#E6D5F0] text-[#4A3E39] flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-xl text-[#2D2421] font-semibold mb-1">
            {isSettingUp ? 'Set Your Sanctuary PIN' : 'Unlock Your Journal'}
          </h2>
          <p className="text-xs text-[#796B64] mb-6 leading-relaxed">
            {isSettingUp
              ? 'Choose a 4-6 digit passcode. This passcode derives your private encryption key. It is never transmitted or saved anywhere.'
              : 'Enter your Sanctuary PIN to decrypt your private reflections.'}
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN"
                className="w-48 text-center text-xl tracking-[0.5em] py-2.5 px-4 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] focus:ring-2 focus:ring-[#E6D5F0] focus:outline-none"
                autoFocus
              />
            </div>

            {isSettingUp && (
              <div>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  value={pinConfirm}
                  onChange={(e) => setPinConfirm(e.target.value)}
                  placeholder="Confirm PIN"
                  className="w-48 text-center text-xl tracking-[0.5em] py-2.5 px-4 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] focus:ring-2 focus:ring-[#E6D5F0] focus:outline-none"
                />
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-[#9C3E32] flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-[#2D2421] text-[#FFF9F5] font-medium text-sm hover:bg-[#4A3E39] transition-colors shadow-sm"
            >
              {isSettingUp ? 'Secure & Create Sanctuary' : 'Unlock Sanctuary'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E8DED6] text-[11px] text-[#796B64] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C8D5B9]" />
            <span>End-to-End Encrypted via Web Crypto Subtle API</span>
          </div>
        </div>
      ) : (
        /* Unlocked Journal View */
        <div className="space-y-6">
          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] transition-colors text-xs font-medium flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#FFD4C4]" />
              <span>New Sacred Reflection</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportBackup}
                disabled={journalEntries.length === 0}
                className="p-2 rounded-lg bg-[#FFF9F5] border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] transition-colors disabled:opacity-40"
                title="Export Encrypted Backup JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <label 
                className="p-2 rounded-lg bg-[#FFF9F5] border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] transition-colors cursor-pointer"
                title="Import Encrypted Backup JSON"
              >
                <Upload className="w-4 h-4" />
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportBackup} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* New Entry Modal/Drawer */}
          {isCreating && (
            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-[#2D2421] font-medium">
                  Compose Sacred Reflection
                </h3>
                <span className="text-[11px] text-[#796B64]">Encrypted in real-time</span>
              </div>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title (e.g. Surrendering the evening craving)"
                className="w-full p-3 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-sm text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0]"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTriggerTag}
                  onChange={(e) => setNewTriggerTag(e.target.value)}
                  placeholder="Tag (e.g. Urge, Loneliness, Psalm 34)"
                  className="w-full p-2.5 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-xs text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0]"
                />
              </div>

              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Pour out your heart honestly before God. What truth did you discover? What lie did you dismantle?"
                rows={6}
                className="w-full p-4 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-sm text-[#2D2421] focus:outline-none focus:ring-2 focus:ring-[#E6D5F0] resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#796B64] hover:text-[#2D2421] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEntry}
                  disabled={!newContent.trim()}
                  className="px-5 py-2 rounded-xl bg-[#2D2421] text-[#FFF9F5] text-xs font-medium hover:bg-[#4A3E39] disabled:opacity-40 transition-colors shadow-sm"
                >
                  Encrypt & Save
                </button>
              </div>
            </div>
          )}

          {/* List of Entries */}
          {journalEntries.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] text-[#796B64]">
              <FileText className="w-8 h-8 mx-auto mb-2 text-[#E6D5F0]" />
              <p className="font-serif text-base text-[#2D2421] mb-1">Your Journal is Quiet</p>
              <p className="text-xs">
                Reflect on your breakthroughs, capture answered prayers, or release a burden.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {journalEntries.map((entry) => {
                const plainText = decryptedMap[entry.id];
                const dateFormatted = new Date(entry.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#E8DED6] shadow-sm hover:border-[#D5C7BD] transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-serif text-base text-[#2D2421] font-semibold">
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-[#796B64] mt-0.5">
                          <span>{dateFormatted}</span>
                          {entry.triggerTag && (
                            <>
                              <span>·</span>
                              <span className="font-medium text-[#4A3E39]">{entry.triggerTag}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="p-1 rounded-md text-[#A89B94] hover:text-[#9C3E32] transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete reflection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 text-sm text-[#4A3E39] leading-relaxed whitespace-pre-wrap bg-[#FAF5F0]/60 p-3.5 rounded-xl border border-[#E8DED6]/70">
                      {plainText || (
                        <span className="font-mono text-xs text-[#A89B94]">
                          [Decrypted using session key]
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
