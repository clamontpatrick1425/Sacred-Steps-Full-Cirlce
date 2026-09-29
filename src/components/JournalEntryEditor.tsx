import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Mic, 
  MicOff, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  Compass,
  Smile,
  CloudRain,
  Sun,
  Flame,
  Sunrise,
  RotateCcw
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { TWELVE_STEP_GUIDED_PROMPTS, StepGuidedPrompt } from '../data/twelveStepPrompts';
import { decryptJournalEntry } from '../utils/crypto';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface JournalEntryEditorProps {
  onClose?: () => void;
}

export const JournalEntryEditor: React.FC<JournalEntryEditorProps> = ({ onClose }) => {
  const { 
    activePassphrase, 
    journalEntries, 
    editorInitialStepNumber, 
    editorInitialPrompt, 
    editorEditingEntryId, 
    saveJournalEntry, 
    closeJournalEditor,
    soundEnabled,
    hapticsEnabled 
  } = useSacredStore();

  const [selectedStep, setSelectedStep] = useState<number>(editorInitialStepNumber || 1);
  const [selectedPrompt, setSelectedPrompt] = useState<string>(editorInitialPrompt || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodRating, setMoodRating] = useState<number>(3);
  const [triggerTag, setTriggerTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Voice-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Load existing entry if editing
  useEffect(() => {
    if (editorEditingEntryId && activePassphrase) {
      const entry = journalEntries.find(e => e.id === editorEditingEntryId);
      if (entry) {
        setTitle(entry.title || '');
        if (entry.stepNumber) setSelectedStep(entry.stepNumber);
        if (entry.stepPrompt) setSelectedPrompt(entry.stepPrompt);
        if (entry.moodRating) setMoodRating(entry.moodRating);
        if (entry.triggerTag) setTriggerTag(entry.triggerTag);

        // Decrypt content
        decryptJournalEntry(entry.payload, activePassphrase)
          .then(decrypted => setContent(decrypted))
          .catch(() => setErrorMsg('Could not decrypt existing entry content.'));
      }
    } else {
      // Default to initial prompt if passed
      if (editorInitialPrompt) {
        setSelectedPrompt(editorInitialPrompt);
        setTitle(`Step ${editorInitialStepNumber || 1} Sacred Reflection`);
      } else {
        // Select first prompt of selected step
        const defaultPrompt = TWELVE_STEP_GUIDED_PROMPTS.find(p => p.stepNumber === selectedStep);
        if (defaultPrompt) {
          setSelectedPrompt(defaultPrompt.question);
          setTitle(`Step ${selectedStep}: ${defaultPrompt.tag} Reflection`);
        }
      }
    }
  }, [editorEditingEntryId, editorInitialStepNumber, editorInitialPrompt, activePassphrase, journalEntries]);

  // Setup Web Speech API Voice-to-Text
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setContent(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!voiceSupported || !recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (hapticsEnabled) triggerHaptic('soft');
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
      } catch (err) {
        console.warn('Could not start voice-to-text:', err);
        setIsRecording(false);
      }
    }
  };

  const handleStepChange = (stepNum: number) => {
    setSelectedStep(stepNum);
    const promptsForStep = TWELVE_STEP_GUIDED_PROMPTS.filter(p => p.stepNumber === stepNum);
    if (promptsForStep.length > 0) {
      setSelectedPrompt(promptsForStep[0].question);
      setTitle(`Step ${stepNum}: ${promptsForStep[0].tag} Reflection`);
    } else {
      setSelectedPrompt('');
      setTitle(`Step ${stepNum} Reflection`);
    }
    if (hapticsEnabled) triggerHaptic('soft');
  };

  const handlePromptSelect = (prompt: StepGuidedPrompt) => {
    setSelectedPrompt(prompt.question);
    setTitle(`Step ${prompt.stepNumber}: ${prompt.tag} Reflection`);
    if (!content.trim() && prompt.sampleStarter) {
      setContent(prompt.sampleStarter + ' ');
    }
    if (hapticsEnabled) triggerHaptic('soft');
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setErrorMsg('Please write or speak a few words of reflection before saving.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const ok = await saveJournalEntry({
        title: title.trim() || `Step ${selectedStep} Reflection`,
        content: content.trim(),
        moodRating,
        stepNumber: selectedStep,
        stepPrompt: selectedPrompt,
        triggerTag: triggerTag.trim() || undefined,
        existingId: editorEditingEntryId || undefined
      });

      if (ok) {
        if (onClose) onClose();
        else closeJournalEditor();
      } else {
        setErrorMsg('Encryption error. Please ensure your Sanctuary Vault is unlocked.');
      }
    } catch (err) {
      setErrorMsg('Unable to encrypt and save entry.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeGuidedPrompt = TWELVE_STEP_GUIDED_PROMPTS.find(p => p.question === selectedPrompt && p.stepNumber === selectedStep) 
    || TWELVE_STEP_GUIDED_PROMPTS.find(p => p.stepNumber === selectedStep);

  const moodOptions = [
    { value: 1, label: 'Heavy Valley', desc: 'Overwhelmed, exhausted, or in acute pain', icon: CloudRain, color: '#E8DED6', dot: 'bg-stone-400' },
    { value: 2, label: 'Seeking Grace', desc: 'Struggling, but reaching for God’s hand', icon: Compass, color: '#E6D5F0', dot: 'bg-[#C4A9D8]' },
    { value: 3, label: 'Grounded', desc: 'Steady, mindful, and surrendered', icon: Smile, color: '#C8D5B9', dot: 'bg-[#9DB88B]' },
    { value: 4, label: 'Rising Hope', desc: 'Renewed clarity, rising from the fog', icon: Sunrise, color: '#FFD4C4', dot: 'bg-[#F9A88F]' },
    { value: 5, label: 'Radiant Peace', desc: 'Joyful, restored, in deep communion', icon: Sun, color: '#F4E4C1', dot: 'bg-[#E3C985]' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D2421] pb-24 font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-[#E8DED6] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            if (onClose) onClose();
            else closeJournalEditor();
          }}
          className="flex items-center gap-1.5 text-xs text-[#796B64] hover:text-[#2D2421] p-1.5 rounded-lg hover:bg-[#E8DED6]/40 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sanctuary Vault</span>
        </button>

        <div className="flex items-center gap-1.5 bg-[#C8D5B9]/20 border border-[#C8D5B9]/40 px-2.5 py-1 rounded-full text-[10px] font-medium text-[#445237]">
          <Lock className="w-3 h-3 text-[#5A6E4B]" />
          <span>AES-256 On-Device</span>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#2D2421] text-[#FFF9F5] hover:bg-[#433632] px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
        >
          {isSaving ? (
            <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
          )}
          <span>{editorEditingEntryId ? 'Update' : 'Save'}</span>
        </button>
      </header>

      {/* Editor Body */}
      <div className="flex-1 max-w-xl mx-auto w-full px-4 pt-4 space-y-5">
        
        {/* Step Selector Horizontal Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#796B64]">
              Select 12-Step Focus
            </span>
            <span className="text-[11px] text-[#5A6E4B] font-medium">
              Step {selectedStep} of 12
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
              const isCurrent = selectedStep === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleStepChange(num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-[#2D2421] text-[#FFF9F5] shadow-sm scale-105'
                      : 'bg-white border border-[#E8DED6] text-[#796B64] hover:border-[#C8D5B9]'
                  }`}
                >
                  Step {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guided Prompts Picker for this Step */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2D2421]">
            <BookOpen className="w-4 h-4 text-[#C4A9D8]" />
            <span>Guided Prompts from *Sacred Steps to Redemption*</span>
          </div>

          <div className="space-y-2">
            {TWELVE_STEP_GUIDED_PROMPTS.filter(p => p.stepNumber === selectedStep).map((p) => {
              const isSelected = selectedPrompt === p.question;
              return (
                <div
                  key={p.id}
                  onClick={() => handlePromptSelect(p)}
                  className={`p-3 rounded-xl cursor-pointer text-xs transition border text-left ${
                    isSelected
                      ? 'bg-[#FFD4C4]/20 border-[#FFD4C4] text-[#2D2421] ring-1 ring-[#FFD4C4]'
                      : 'bg-[#FFF9F5]/60 border-[#E8DED6] text-[#796B64] hover:bg-[#FFF9F5] hover:border-[#C8D5B9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#5A6E4B]">
                      {p.tag}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-[#2D2421] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#5A6E4B]" /> Active Prompt
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-[13px] leading-snug text-[#2D2421]">
                    "{p.question}"
                  </p>
                  <p className="text-[10px] text-[#796B64] mt-1 italic">
                    {p.guidance}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Scripture Anchor Snippet */}
          {activeGuidedPrompt && (
            <div className="bg-[#FFF9F5] rounded-xl p-2.5 border border-[#E8DED6]/80 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#D8B4E2] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#554742]">
                <span className="font-serif italic font-medium">"{activeGuidedPrompt.scriptureAnchor.text}"</span>
                <span className="block text-[10px] text-[#796B64] mt-0.5 font-sans font-semibold">
                  — {activeGuidedPrompt.scriptureAnchor.reference}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mood Rating Scale */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2D2421] flex items-center gap-1.5">
              <span>Inner Weather & Mood Rating</span>
            </span>
            <span className="text-xs font-bold text-[#5A6E4B]">
              {moodOptions.find(m => m.value === moodRating)?.label}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {moodOptions.map((opt) => {
              const isSelected = moodRating === opt.value;
              const IconComp = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setMoodRating(opt.value);
                    if (hapticsEnabled) triggerHaptic('soft');
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-[#2D2421] text-[#FFF9F5] shadow scale-105'
                      : 'bg-[#FFF9F5] border border-[#E8DED6] text-[#796B64] hover:border-[#FFD4C4]'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#FFD4C4]' : 'text-[#796B64]'}`} />
                  <span className="text-[10px] font-medium leading-none">{opt.value}</span>
                  <span className="text-[8px] leading-tight text-center line-clamp-1">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[#796B64] text-center italic">
            {moodOptions.find(m => m.value === moodRating)?.desc}
          </p>
        </div>

        {/* Reflection Title & Text Editor */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DED6] shadow-sm space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#796B64]">
              Reflection Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Step 1: Breaking the Illusion of Control"
              className="w-full px-3 py-2 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl text-sm font-serif focus:outline-none focus:border-[#C8D5B9] text-[#2D2421]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#796B64]">
                Your Sacred Words
              </label>

              {/* Voice-to-Text Button */}
              {voiceSupported ? (
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                    isRecording
                      ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                      : 'bg-[#FFF9F5] text-[#796B64] border border-[#E8DED6] hover:text-[#2D2421] hover:border-[#C8D5B9]'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                      <span>Listening... Tap to Stop</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-[#5A6E4B]" />
                      <span>Voice-to-Text</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="text-[10px] text-[#796B64] italic">
                  Voice-to-text available in supported browsers
                </span>
              )}
            </div>

            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Breathe deeply. Write with complete honesty. You are held in God's grace..."
              className="w-full p-3.5 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl text-sm font-sans leading-relaxed focus:outline-none focus:border-[#C8D5B9] text-[#2D2421] placeholder:text-[#9E8E87] resize-y"
            />
          </div>

          {/* Quick Phrase Starters */}
          {!content.trim() && (
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#796B64] uppercase font-semibold">
                Quick Starters:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Lord, I admit that I cannot do this alone...",
                  "The fear that has been speaking loudest to me is...",
                  "When I felt powerless, I noticed...",
                  "I am ready to release this resentment toward..."
                ].map((starter, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setContent(starter + ' ');
                      if (hapticsEnabled) triggerHaptic('soft');
                    }}
                    className="text-[11px] bg-[#FFF9F5] border border-[#E8DED6] px-2.5 py-1 rounded-lg text-[#554742] hover:bg-[#FFD4C4]/20 hover:border-[#FFD4C4] transition text-left"
                  >
                    "{starter}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trigger Tag (Optional) */}
          <div className="space-y-1 pt-1 border-t border-[#E8DED6]/60">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#796B64]">
                Trigger Tag (Optional)
              </label>
              <span className="text-[10px] text-[#796B64]">e.g., Cravings, Shame, Old Friend, Fatigue</span>
            </div>
            <input
              type="text"
              value={triggerTag}
              onChange={(e) => setTriggerTag(e.target.value)}
              placeholder="Add a trigger tag to help track patterns..."
              className="w-full px-3 py-1.5 bg-[#FFF9F5] border border-[#E8DED6] rounded-xl text-xs font-sans focus:outline-none focus:border-[#C8D5B9] text-[#2D2421]"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Word Count & Encryption Status */}
          <div className="flex items-center justify-between text-[11px] text-[#796B64] pt-2">
            <span>
              {content.trim() ? content.trim().split(/\s+/).length : 0} words
            </span>
            <span className="flex items-center gap-1 text-[#5A6E4B]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Encrypted with Sanctuary PIN</span>
            </span>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3.5 bg-[#2D2421] text-[#FFF9F5] rounded-2xl font-serif text-base tracking-wide flex items-center justify-center gap-2 shadow-md hover:bg-[#433632] transition disabled:opacity-50"
          >
            {isSaving ? (
              <span>Encrypting and Anchoring...</span>
            ) : (
              <>
                <Check className="w-4 h-4 text-[#C8D5B9]" />
                <span>Save to Encrypted Vault</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
