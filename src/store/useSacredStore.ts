import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EncryptedPayload, encryptJournalEntry, verifyPassphrase } from '../utils/crypto';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';
import { DailyContent, getTodaysDailyAnchor } from '../data/dailyAnchorData';
import { InventoryItem, AmendsItem } from '../data/twelveStepsBookData';
import { BiometricAuthService, createEncryptedSponsorExport, decryptTextAES256 } from '../services/encryptionService';
import { AUDIO_SANCTUARY_TRACKS, AudioTrack } from '../data/audioSanctuaryData';
import { audioSanctuaryService } from '../services/audioPlayerService';

export interface DailyRitualState {
  date: string; // YYYY-MM-DD
  morningCompleted: boolean;
  morningIntention: string;
  morningLieToSurrender: string;
  morningTruthToEmbrace: string;
  morningCompletedAt?: string;

  eveningCompleted: boolean;
  eveningGodPresence: string;
  eveningGratitude: string;
  eveningReviewConfession: string;
  eveningPeaceBenediction: string;
  eveningCompletedAt?: string;
}

export interface NotificationScheduleSettings {
  morningEnabled: boolean;
  morningTime: string; // "07:00"
  morningPrompt: string;
  eveningEnabled: boolean;
  eveningTime: string; // "21:00"
  eveningPrompt: string;
  soundChimeEnabled: boolean;
  pwaPermissionGranted: boolean;
}

export interface StepBreakthrough {
  id: string;
  timestamp: string;
  triggerCategory?: string;
  userStruggle: string;
  scripture: {
    reference: string;
    text: string;
  };
  truth: {
    lie: string;
    statement: string;
  };
  embrace: {
    affirmation: string;
  };
  practice: {
    microStep: string;
  };
  closing: string;
}

export interface JournalItem {
  id: string;
  date: string;
  title: string;
  triggerTag?: string;
  moodRating?: number; // 1-5 scale (1: Heavy Valley, 5: Radiant Peace)
  stepNumber?: number; // 1-12
  stepPrompt?: string;
  sponsorShared?: boolean;
  updatedAt?: string;
  payload: EncryptedPayload;
  decryptedCache?: string; // transient in memory
}

export interface SponsorContact {
  name: string;
  phone: string;
  notes?: string;
}

export interface CravingLogEntry {
  id: string;
  timestamp: string;
  intensity: number; // 1-10 scale
  trigger: string;
  outcome: string; // e.g., '4-7-8 Breathwork', 'Called Sponsor', 'Scripture & Prayer', 'Grace prevailed'
  notes?: string;
}

interface SacredState {
  // Navigation & View
  activeTab: 'sanctuary' | 'anchor' | 'stepJournal' | 'guide' | 'journal' | 'milestones' | 'blueprint';
  deviceMockup: boolean;
  selectedPhoneModel: string;
  selectedPhoneColor: string;
  phoneOrientation: 'portrait' | 'landscape';
  phoneScale: number;
  crisisModalOpen: boolean;
  isVoiceModalOpen: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  preferredVoiceId: string;
  setPreferredVoiceId: (voiceId: string) => void;
  openVoiceModal: () => void;
  closeVoiceModal: () => void;

  // SOS "Calm in the Storm" Emergency Support System
  isSosOpen: boolean;
  sosActiveScreen: 'menu' | 'breathe' | 'ground' | 'connect' | 'craving' | 'lectio' | null;
  sponsorContact: SponsorContact;
  cravingLogs: CravingLogEntry[];

  // Daily Anchor & Grace Deck
  todaysAnchor: DailyContent;
  graceDeck: DailyContent[];

  // Interactive 12-Step Journal (From C. Lamont Patrick's Book)
  active12StepNumber: number; // 1 to 12
  stepPromptAnswers: Record<string, string>; // promptId -> text
  stepFreeformNotes: Record<number, string>; // stepNum -> text
  stepCompletedMap: Record<number, boolean>; // stepNum -> boolean
  stepPrayerSpokenMap: Record<number, boolean>; // stepNum -> boolean
  moralInventoryList: InventoryItem[];
  amendsLedger: AmendsItem[];

  // Recovery Journey
  cleanStartDate: string; // ISO string
  completedStepsCount: number;
  savedBreakthroughs: StepBreakthrough[];
  milestoneReflections: Record<string, { challenge?: string; proudMoment?: string; gratitude?: string; hope?: string }>;
  litCandlesMap: Record<string, boolean>;

  // Encrypted Journal & Security State
  hasCreatedPin: boolean;
  pinVerification: { salt: string; hash: string } | null;
  journalEntries: JournalItem[];
  activePassphrase: string | null; // In-memory session key ONLY, not persisted!
  biometricLockEnabled: boolean;
  optInAiPatterns: boolean;

  // Editor Modal State
  isEditorOpen: boolean;
  editorInitialStepNumber: number | null;
  editorInitialPrompt: string | null;
  editorEditingEntryId: string | null;

  // Legal & Privacy Modal State
  legalModal: 'privacy' | 'terms' | null;
  openLegalModal: (type: 'privacy' | 'terms') => void;
  closeLegalModal: () => void;

  // Sacred Morning & Evening Rituals (Liturgical Rhythm)
  dailyRitualsHistory: Record<string, DailyRitualState>;
  notificationSchedule: NotificationScheduleSettings;
  activeRitualModal: 'morning' | 'evening' | 'settings' | null;
  openRitualModal: (ritual: 'morning' | 'evening' | 'settings') => void;
  closeRitualModal: () => void;
  getTodaysRitual: () => DailyRitualState;
  saveMorningRitual: (intention: string, lieToSurrender: string, truthToEmbrace: string) => void;
  saveEveningRitual: (godPresence: string, gratitude: string, reviewConfession: string, peaceBenediction: string) => void;
  updateNotificationSchedule: (settings: Partial<NotificationScheduleSettings>) => void;
  testTriggerGentleBell: (type: 'morning' | 'evening') => void;

  // Actions
  setActiveTab: (tab: 'sanctuary' | 'anchor' | 'stepJournal' | 'guide' | 'journal' | 'milestones' | 'blueprint') => void;
  toggleDeviceMockup: () => void;
  setSelectedPhoneModel: (modelId: string) => void;
  setSelectedPhoneColor: (colorName: string) => void;
  togglePhoneOrientation: () => void;
  setPhoneScale: (scale: number) => void;
  setCrisisModalOpen: (open: boolean) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;

  // Daily Anchor Actions
  checkAndRefreshDailyAnchor: () => void;
  toggleSaveToGraceDeck: (card: DailyContent) => boolean;
  isSavedInGraceDeck: (id: string) => boolean;
  removeGraceDeckItem: (id: string) => void;

  // 12-Step Journal Actions
  setActive12StepNumber: (stepNum: number) => void;
  saveStepPromptAnswer: (promptId: string, answer: string) => void;
  saveStepFreeformNote: (stepNum: number, note: string) => void;
  toggleStepCompleted: (stepNum: number) => void;
  togglePrayerSpoken: (stepNum: number) => void;
  addMoralInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  deleteMoralInventoryItem: (id: string) => void;
  addAmendsItem: (item: Omit<AmendsItem, 'id'>) => void;
  updateAmendsStatus: (id: string, status: 'willing' | 'in_progress' | 'made') => void;
  deleteAmendsItem: (id: string) => void;

  // Recovery Actions
  getDaysInGrace: () => number;
  resetGraceCompassionately: (reason?: string) => void;
  setCustomStartDate: (dateIso: string) => void;
  recordStepCompleted: () => void;
  bookmarkBreakthrough: (breakthrough: Omit<StepBreakthrough, 'id' | 'timestamp'>) => void;
  removeBreakthrough: (id: string) => void;
  saveMilestoneReflection: (milestoneId: string, reflection: { challenge?: string; proudMoment?: string; gratitude?: string; hope?: string }) => void;
  toggleLightCandle: (milestoneId: string) => boolean;

  // SOS "Calm in the Storm" Actions
  openSos: (screen?: 'menu' | 'breathe' | 'ground' | 'connect' | 'craving' | 'lectio') => void;
  closeSos: () => void;
  setSosActiveScreen: (screen: 'menu' | 'breathe' | 'ground' | 'connect' | 'craving' | 'lectio' | null) => void;
  updateSponsorContact: (contact: Partial<SponsorContact>) => void;
  addCravingLog: (entry: Omit<CravingLogEntry, 'id' | 'timestamp'>) => void;
  deleteCravingLog: (id: string) => void;

  // E2E Encryption Journal Actions
  setupSanctuaryPin: (pin: string) => Promise<boolean>;
  unlockJournalWithPin: (pin: string) => Promise<boolean>;
  unlockJournalWithBiometrics: () => Promise<boolean>;
  lockJournal: () => void;
  toggleBiometricLock: (enabled: boolean) => void;
  toggleOptInAiPatterns: (enabled: boolean) => void;
  openJournalEditor: (options?: { stepNumber?: number; prompt?: string; entryId?: string }) => void;
  closeJournalEditor: () => void;
  addJournalEntry: (title: string, content: string, triggerTag?: string) => Promise<boolean>;
  saveJournalEntry: (data: {
    title: string;
    content: string;
    moodRating?: number;
    stepNumber?: number;
    stepPrompt?: string;
    triggerTag?: string;
    existingId?: string;
  }) => Promise<boolean>;
  deleteJournalEntry: (id: string) => void;
  importJournalBackup: (entries: JournalItem[]) => void;
  exportEncryptedSponsorFile: (sponsorPasscode: string, sponsorName?: string) => Promise<string>;
}

export const useSacredStore = create<SacredState>()(
  persist(
    (set, get) => ({
      // Defaults
      activeTab: 'sanctuary',
      deviceMockup: false,
      selectedPhoneModel: 'iphone-16-pro',
      selectedPhoneColor: 'Natural Titanium',
      phoneOrientation: 'portrait',
      phoneScale: 1.0,
      crisisModalOpen: false,
      isVoiceModalOpen: false,
      soundEnabled: true,
      hapticsEnabled: true,
      preferredVoiceId: 'en-US-wayne',
      openVoiceModal: () => set({ isVoiceModalOpen: true }),
      closeVoiceModal: () => set({ isVoiceModalOpen: false }),
      legalModal: null,
      openLegalModal: (type) => set({ legalModal: type }),
      closeLegalModal: () => set({ legalModal: null }),

      // Sacred Morning & Evening Rituals Defaults
      dailyRitualsHistory: {},
      notificationSchedule: {
        morningEnabled: true,
        morningTime: '07:00',
        morningPrompt: 'Take your breath. Grace is waiting for you.',
        eveningEnabled: true,
        eveningTime: '21:00',
        eveningPrompt: "The day is done. Lay down your burdens in God's peace.",
        soundChimeEnabled: true,
        pwaPermissionGranted: typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
      },
      activeRitualModal: null,
      openRitualModal: (ritual) => {
        const { soundEnabled } = get();
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        set({ activeRitualModal: ritual });
      },
      closeRitualModal: () => set({ activeRitualModal: null }),
      getTodaysRitual: () => {
        const todayStr = new Date().toISOString().slice(0, 10);
        const existing = get().dailyRitualsHistory[todayStr];
        if (existing) return existing;
        return {
          date: todayStr,
          morningCompleted: false,
          morningIntention: '',
          morningLieToSurrender: '',
          morningTruthToEmbrace: '',
          eveningCompleted: false,
          eveningGodPresence: '',
          eveningGratitude: '',
          eveningReviewConfession: '',
          eveningPeaceBenediction: ''
        };
      },
      saveMorningRitual: (intention, lieToSurrender, truthToEmbrace) => {
        const todayStr = new Date().toISOString().slice(0, 10);
        const current = get().getTodaysRitual();
        const updated: DailyRitualState = {
          ...current,
          morningCompleted: true,
          morningIntention: intention,
          morningLieToSurrender: lieToSurrender,
          morningTruthToEmbrace: truthToEmbrace,
          morningCompletedAt: new Date().toISOString()
        };
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
        set((state) => ({
          dailyRitualsHistory: {
            ...state.dailyRitualsHistory,
            [todayStr]: updated
          }
        }));
      },
      saveEveningRitual: (godPresence, gratitude, reviewConfession, peaceBenediction) => {
        const todayStr = new Date().toISOString().slice(0, 10);
        const current = get().getTodaysRitual();
        const updated: DailyRitualState = {
          ...current,
          eveningCompleted: true,
          eveningGodPresence: godPresence,
          eveningGratitude: gratitude,
          eveningReviewConfession: reviewConfession,
          eveningPeaceBenediction: peaceBenediction,
          eveningCompletedAt: new Date().toISOString()
        };
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
        set((state) => ({
          dailyRitualsHistory: {
            ...state.dailyRitualsHistory,
            [todayStr]: updated
          }
        }));
      },
      updateNotificationSchedule: (settings) => {
        set((state) => ({
          notificationSchedule: { ...state.notificationSchedule, ...settings }
        }));
      },
      testTriggerGentleBell: (type) => {
        const { soundEnabled, notificationSchedule } = get();
        if (soundEnabled && notificationSchedule.soundChimeEnabled) {
          sanctuaryAudio.playGraceChime(type === 'morning' ? 'breathIn' : 'breathHold');
        }
        const prompt = type === 'morning' ? notificationSchedule.morningPrompt : notificationSchedule.eveningPrompt;
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(type === 'morning' ? 'Sacred Morning: Dawn Offering' : 'Sacred Evening: Grace Review', {
              body: prompt,
              icon: '/icon.svg'
            });
          } catch {}
        }
      },

      // SOS Emergency Defaults
      isSosOpen: false,
      sosActiveScreen: null,
      sponsorContact: {
        name: 'Sarah M. (Sponsor)',
        phone: '555-019-2834',
        notes: 'Available 24/7 · 2 yrs in recovery fellowship'
      },
      cravingLogs: [
        {
          id: 'crav-1',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          intensity: 7,
          trigger: 'Late-night loneliness & work exhaustion',
          outcome: 'Completed 4-7-8 Breathwork & recited Psalm 46:10',
          notes: 'Felt the storm crest like a wave and fade in 7 minutes. God held me steady.'
        },
        {
          id: 'crav-2',
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
          intensity: 5,
          trigger: 'Walking past old triggering neighborhood',
          outcome: 'Called sponsor & recited affirmation',
          notes: 'Speaking it aloud took away the hidden shame immediately. Walked on with head high.'
        }
      ],

      // Daily Anchor Defaults
      todaysAnchor: getTodaysDailyAnchor(),
      graceDeck: [
        {
          id: 'anchor-ebook-ch1',
          date: '2026-09-27',
          prayer: {
            title: "Prayer of Holy Surrender",
            content: "Dear Heavenly Father, You're the firm hand that pulls me up when I'm scared, the soft voice that bids me follow hope. Please let me release my fears and know your unlimited love. Please guide me back to the path, help me find your presence, and let me know I am part of something bigger. As I acknowledge my impotence, I believe in your good grace and return my life to you. May I be strong in my weakness and a joyful space creator. Thank you for traveling with me, Lord. In Jesus' name, I pray. Amen!",
            source: "Sacred Steps to Redemption (Chapter 1)"
          },
          verse: {
            reference: "Matthew 11:28",
            text: "Come to me, all you who are weary and burdened, and I will give you rest.",
            translation: "NIV"
          },
          affirmation: {
            text: "I am worthy of healing and love, and with each mindful step, I grow closer to my true self and the divine light within me.",
            category: "Inherent Worth & Grace"
          }
        }
      ],

      // 12-Step Interactive Journal Initial State
      active12StepNumber: 1,
      stepPromptAnswers: {
        's1-q1': 'Trying to white-knuckle my cravings through pure willpower left me spiritually drained and isolated. I realized that my self-reliance was an illusion, and admitting I needed God’s strength was the first real moment of peace I felt in years.',
        's1-q2': 'Surrender felt like defeat at first, but C. Lamont Patrick’s insight that powerlessness is a doorway to divine empowerment completely flipped my perspective. Handing the wheel over to Christ made me feel safe for the first time.'
      },
      stepFreeformNotes: {
        1: 'Step 1 Reflection: I am learning that admitting my human limitations is not a shameful failure, but an act of radical honesty that invites God’s grace in.'
      },
      stepCompletedMap: {
        1: true,
        2: false,
        3: false
      },
      stepPrayerSpokenMap: {
        1: true
      },
      moralInventoryList: [
        {
          id: 'inv-1',
          category: 'asset',
          title: 'Resilience and Compassion',
          details: 'Even in dark seasons, I have a deep heart for hurting people and a tenacity to keep rising after stumbles.'
        },
        {
          id: 'inv-2',
          category: 'fear',
          title: 'Fear of Being Truly Seen',
          details: 'I often fear that if people knew the full extent of my struggles, they would reject me. God’s grace is dismantling this lie.'
        },
        {
          id: 'inv-3',
          category: 'resentment',
          title: 'Old Family Grievances',
          details: 'Holding onto past words spoken in anger. I am choosing to release these to God so bitterness does not poison my sobriety.'
        }
      ],
      amendsLedger: [
        {
          id: 'amend-1',
          person: 'My Sister (Elena)',
          harmDone: 'Broke commitments and borrowed money without repaying during active addiction.',
          amendsPlan: 'Full financial restitution plan and consistent, sober presence at family gatherings.',
          status: 'willing'
        },
        {
          id: 'amend-2',
          person: 'Former Business Partner (David)',
          harmDone: 'Lacked transparency and left projects unfinished during relapse.',
          amendsPlan: 'Write a sincere letter of ownership and restitution with zero defensive excuses.',
          status: 'willing'
        }
      ],

      // Initial clean date: 14 days ago for a welcoming initial state
      cleanStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      completedStepsCount: 7,
      savedBreakthroughs: [
        {
          id: 'initial-breakthrough-1',
          timestamp: new Date().toISOString(),
          triggerCategory: 'shame',
          userStruggle: 'I felt unworthy after a difficult week and started spiraling.',
          scripture: {
            reference: 'Romans 8:1',
            text: 'There is therefore now no condemnation for those who are in Christ Jesus.'
          },
          truth: {
            lie: 'Your past slip defines who you are and makes you unworthy of love.',
            statement: 'Your identity is anchored in God’s redemption, not in your hardest moments.'
          },
          embrace: {
            affirmation: 'I am forgiven, redeemed, and clothed in unshakeable dignity.'
          },
          practice: {
            microStep: 'Place your hand over your heart and whisper: "His grace is greater than my shame."'
          },
          closing: "I'm right here with you. Take the next step."
        }
      ],
      milestoneReflections: {
        '1-day': {
          challenge: 'Admitting I was powerless and throwing away hidden triggers.',
          proudMoment: 'Calling my sponsor instead of giving in late at night.',
          gratitude: 'God’s steadfast love being new every morning.',
          hope: 'Waking up clear-headed and alive in Christ.'
        },
        '7-days': {
          challenge: 'The emotional fog and restlessness on day 3.',
          proudMoment: 'Using the 4-7-8 breathwork when panic surged.',
          gratitude: 'The grace of people who believed in me.',
          hope: 'Reaching 30 days and letting deep roots take hold.'
        }
      },
      litCandlesMap: {
        '1-day': true,
        '7-days': true
      },

      // Encrypted Journal & Security State
      hasCreatedPin: false,
      pinVerification: null,
      journalEntries: [],
      activePassphrase: null,
      biometricLockEnabled: typeof window !== 'undefined' ? localStorage.getItem('sacred_biometric_enabled') === 'true' : false,
      optInAiPatterns: true, // Default opt-in with local-only guarantee

      // Editor Modal State
      isEditorOpen: false,
      editorInitialStepNumber: null,
      editorInitialPrompt: null,
      editorEditingEntryId: null,

      setActiveTab: (tab) => {
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('soft');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        set({ activeTab: tab });
      },

      toggleDeviceMockup: () => {
        set((state) => ({ deviceMockup: !state.deviceMockup }));
      },

      setSelectedPhoneModel: (modelId) => {
        set({ selectedPhoneModel: modelId });
      },

      setSelectedPhoneColor: (colorName) => {
        set({ selectedPhoneColor: colorName });
      },

      togglePhoneOrientation: () => {
        set((state) => ({
          phoneOrientation: state.phoneOrientation === 'portrait' ? 'landscape' : 'portrait'
        }));
      },

      setPhoneScale: (scale) => {
        set({ phoneScale: scale });
      },

      setCrisisModalOpen: (open) => {
        set({ crisisModalOpen: open });
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      setPreferredVoiceId: (voiceId) => {
        sanctuaryAudio.setDefaultVoiceId(voiceId);
        set({ preferredVoiceId: voiceId });
      },

      toggleHaptics: () => {
        set((state) => ({ hapticsEnabled: !state.hapticsEnabled }));
      },

      checkAndRefreshDailyAnchor: () => {
        const latest = getTodaysDailyAnchor();
        const current = get().todaysAnchor;
        if (!current || current.date !== latest.date) {
          set({ todaysAnchor: latest });
        }
      },

      toggleSaveToGraceDeck: (card: DailyContent) => {
        const { graceDeck, hapticsEnabled, soundEnabled } = get();
        const exists = graceDeck.some((c) => c.id === card.id || (c.date === card.date && c.prayer.title === card.prayer.title));

        if (exists) {
          set({
            graceDeck: graceDeck.filter((c) => c.id !== card.id && !(c.date === card.date && c.prayer.title === card.prayer.title))
          });
          if (hapticsEnabled) triggerHaptic('soft');
          return false;
        } else {
          set({
            graceDeck: [card, ...graceDeck]
          });
          if (hapticsEnabled) triggerHaptic('step');
          if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
          return true;
        }
      },

      isSavedInGraceDeck: (id: string) => {
        const { graceDeck, todaysAnchor } = get();
        return graceDeck.some((c) => c.id === id || (c.date === todaysAnchor.date && c.prayer.title === todaysAnchor.prayer.title));
      },

      removeGraceDeckItem: (id: string) => {
        set((state) => ({
          graceDeck: state.graceDeck.filter((c) => c.id !== id)
        }));
      },

      // 12-Step Journal Action Handlers
      setActive12StepNumber: (stepNum) => {
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('soft');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        set({ active12StepNumber: stepNum });
      },

      saveStepPromptAnswer: (promptId, answer) => {
        set((state) => ({
          stepPromptAnswers: {
            ...state.stepPromptAnswers,
            [promptId]: answer
          }
        }));
      },

      saveStepFreeformNote: (stepNum, note) => {
        set((state) => ({
          stepFreeformNotes: {
            ...state.stepFreeformNotes,
            [stepNum]: note
          }
        }));
      },

      toggleStepCompleted: (stepNum) => {
        const { stepCompletedMap, soundEnabled, hapticsEnabled } = get();
        const currentStatus = Boolean(stepCompletedMap[stepNum]);
        const next = !currentStatus;

        set((state) => ({
          stepCompletedMap: {
            ...state.stepCompletedMap,
            [stepNum]: next
          },
          completedStepsCount: next 
            ? Math.max(state.completedStepsCount, Object.values({ ...state.stepCompletedMap, [stepNum]: next }).filter(Boolean).length)
            : state.completedStepsCount
        }));

        if (next) {
          if (hapticsEnabled) triggerHaptic('step');
          if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
        }
      },

      togglePrayerSpoken: (stepNum) => {
        const { stepPrayerSpokenMap, soundEnabled, hapticsEnabled } = get();
        const next = !stepPrayerSpokenMap[stepNum];
        set((state) => ({
          stepPrayerSpokenMap: {
            ...state.stepPrayerSpokenMap,
            [stepNum]: next
          }
        }));
        if (next) {
          if (hapticsEnabled) triggerHaptic('soft');
          if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        }
      },

      addMoralInventoryItem: (item) => {
        const newItem: InventoryItem = {
          ...item,
          id: 'inv-' + Date.now()
        };
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        set((state) => ({
          moralInventoryList: [newItem, ...state.moralInventoryList]
        }));
      },

      deleteMoralInventoryItem: (id) => {
        set((state) => ({
          moralInventoryList: state.moralInventoryList.filter((i) => i.id !== id)
        }));
      },

      addAmendsItem: (item) => {
        const newItem: AmendsItem = {
          ...item,
          id: 'amend-' + Date.now()
        };
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        set((state) => ({
          amendsLedger: [newItem, ...state.amendsLedger]
        }));
      },

      updateAmendsStatus: (id, status) => {
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (status === 'made' && soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');

        set((state) => ({
          amendsLedger: state.amendsLedger.map((a) => a.id === id ? { ...a, status } : a)
        }));
      },

      deleteAmendsItem: (id) => {
        set((state) => ({
          amendsLedger: state.amendsLedger.filter((a) => a.id !== id)
        }));
      },

      getDaysInGrace: () => {
        const start = new Date(get().cleanStartDate).getTime();
        const now = Date.now();
        const diffDays = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
        return diffDays;
      },

      resetGraceCompassionately: () => {
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('pulse');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        set({
          cleanStartDate: new Date().toISOString(),
        });
      },

      setCustomStartDate: (dateIso) => {
        set({ cleanStartDate: dateIso });
      },

      recordStepCompleted: () => {
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
        set((state) => ({
          completedStepsCount: state.completedStepsCount + 1,
        }));
      },

      bookmarkBreakthrough: (item) => {
        const breakthrough: StepBreakthrough = {
          ...item,
          id: 'bt-' + Date.now(),
          timestamp: new Date().toISOString(),
        };
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        set((state) => ({
          savedBreakthroughs: [breakthrough, ...state.savedBreakthroughs],
        }));
      },

      removeBreakthrough: (id) => {
        set((state) => ({
          savedBreakthroughs: state.savedBreakthroughs.filter((b) => b.id !== id),
        }));
      },

      saveMilestoneReflection: (milestoneId, reflection) => {
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
        set((state) => ({
          milestoneReflections: {
            ...state.milestoneReflections,
            [milestoneId]: {
              ...state.milestoneReflections[milestoneId],
              ...reflection
            }
          }
        }));
      },

      toggleLightCandle: (milestoneId) => {
        const { litCandlesMap, soundEnabled, hapticsEnabled } = get();
        const current = Boolean(litCandlesMap[milestoneId]);
        const next = !current;
        if (next) {
          if (hapticsEnabled) triggerHaptic('pulse');
          if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
        } else {
          if (hapticsEnabled) triggerHaptic('soft');
        }
        set({
          litCandlesMap: {
            ...litCandlesMap,
            [milestoneId]: next
          }
        });
        return next;
      },

      // SOS "Calm in the Storm" Action Implementations
      openSos: (screen = 'menu') => {
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('pulse');
        if (soundEnabled) sanctuaryAudio.playGraceChime('sos');
        set({ isSosOpen: true, sosActiveScreen: screen });
      },

      closeSos: () => {
        sanctuaryAudio.cancelSpeech();
        set({ isSosOpen: false, sosActiveScreen: null });
      },

      setSosActiveScreen: (screen) => {
        const { hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('soft');
        sanctuaryAudio.cancelSpeech();
        set({ sosActiveScreen: screen, isSosOpen: true });
      },

      updateSponsorContact: (contact) => {
        set((state) => ({
          sponsorContact: { ...state.sponsorContact, ...contact }
        }));
      },

      addCravingLog: (entry) => {
        const { soundEnabled, hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('step');
        if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
        const newLog: CravingLogEntry = {
          id: 'crav-' + Date.now(),
          timestamp: new Date().toISOString(),
          ...entry
        };
        set((state) => ({
          cravingLogs: [newLog, ...state.cravingLogs]
        }));
      },

      deleteCravingLog: (id: string) => {
        set((state) => ({
          cravingLogs: state.cravingLogs.filter((c) => c.id !== id)
        }));
      },

      setupSanctuaryPin: async (pin: string) => {
        try {
          const enc = new TextEncoder();
          const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
          let saltBase64 = '';
          for (let i = 0; i < saltBytes.length; i++) {
            saltBase64 += String.fromCharCode(saltBytes[i]);
          }
          saltBase64 = btoa(saltBase64);

          const digest = await window.crypto.subtle.digest(
            'SHA-256',
            enc.encode(pin + saltBase64)
          );
          const hashBytes = new Uint8Array(digest);
          let hashBase64 = '';
          for (let i = 0; i < hashBytes.length; i++) {
            hashBase64 += String.fromCharCode(hashBytes[i]);
          }
          hashBase64 = btoa(hashBase64);

          set({
            hasCreatedPin: true,
            pinVerification: { salt: saltBase64, hash: hashBase64 },
            activePassphrase: pin,
          });

          const { soundEnabled, hapticsEnabled } = get();
          if (hapticsEnabled) triggerHaptic('step');
          if (soundEnabled) sanctuaryAudio.playGraceChime('unlock');
          return true;
        } catch (err) {
          console.error('Error setting up PIN:', err);
          return false;
        }
      },

      unlockJournalWithPin: async (pin: string) => {
        const { pinVerification, soundEnabled, hapticsEnabled } = get();
        if (!pinVerification) {
          return get().setupSanctuaryPin(pin);
        }

        const isValid = await verifyPassphrase(pin, pinVerification.salt, pinVerification.hash);
        if (isValid) {
          set({ activePassphrase: pin });
          if (hapticsEnabled) triggerHaptic('step');
          if (soundEnabled) sanctuaryAudio.playGraceChime('unlock');
          return true;
        } else {
          if (hapticsEnabled) triggerHaptic('heavy');
          return false;
        }
      },

      unlockJournalWithBiometrics: async () => {
        const { pinVerification, soundEnabled, hapticsEnabled } = get();
        if (!pinVerification) return false;

        const authenticated = await BiometricAuthService.authenticateBiometric();
        if (authenticated) {
          // If biometric token exists or authenticated, recover session
          // Note: Since activePassphrase cannot be stored in raw plaintext, we prompt or use cached PIN
          if (hapticsEnabled) triggerHaptic('step');
          if (soundEnabled) sanctuaryAudio.playGraceChime('unlock');
          return true;
        }
        return false;
      },

      lockJournal: () => {
        const { hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('soft');
        set({ activePassphrase: null, isEditorOpen: false });
      },

      toggleBiometricLock: (enabled: boolean) => {
        BiometricAuthService.setBiometricEnabled(enabled);
        set({ biometricLockEnabled: enabled });
        const { hapticsEnabled, soundEnabled } = get();
        if (hapticsEnabled) triggerHaptic('soft');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
      },

      toggleOptInAiPatterns: (enabled: boolean) => {
        set({ optInAiPatterns: enabled });
        const { hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('soft');
      },

      openJournalEditor: (options) => {
        const { hapticsEnabled, soundEnabled } = get();
        if (hapticsEnabled) triggerHaptic('soft');
        if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
        set({
          isEditorOpen: true,
          editorInitialStepNumber: options?.stepNumber ?? null,
          editorInitialPrompt: options?.prompt ?? null,
          editorEditingEntryId: options?.entryId ?? null
        });
      },

      closeJournalEditor: () => {
        set({
          isEditorOpen: false,
          editorInitialStepNumber: null,
          editorInitialPrompt: null,
          editorEditingEntryId: null
        });
      },

      addJournalEntry: async (title: string, content: string, triggerTag?: string) => {
        return get().saveJournalEntry({
          title,
          content,
          triggerTag
        });
      },

      saveJournalEntry: async ({ title, content, moodRating = 3, stepNumber, stepPrompt, triggerTag, existingId }) => {
        const { activePassphrase, soundEnabled, hapticsEnabled, journalEntries } = get();
        if (!activePassphrase) {
          return false;
        }

        try {
          const payload = await encryptJournalEntry(content, activePassphrase);

          if (existingId) {
            // Update existing entry
            const updated = journalEntries.map((e) => {
              if (e.id === existingId) {
                return {
                  ...e,
                  title: title || 'Sacred Reflection',
                  triggerTag,
                  moodRating,
                  stepNumber,
                  stepPrompt,
                  payload,
                  decryptedCache: content,
                  updatedAt: new Date().toISOString()
                };
              }
              return e;
            });
            set({ journalEntries: updated, isEditorOpen: false });
          } else {
            // New entry
            const newItem: JournalItem = {
              id: 'journal-' + Date.now(),
              date: new Date().toISOString(),
              title: title || 'Sacred Reflection',
              triggerTag,
              moodRating,
              stepNumber,
              stepPrompt,
              payload,
              decryptedCache: content,
            };

            set({
              journalEntries: [newItem, ...journalEntries],
              isEditorOpen: false
            });
          }

          if (hapticsEnabled) triggerHaptic('step');
          if (soundEnabled) sanctuaryAudio.playGraceChime('stepComplete');
          return true;
        } catch (err) {
          console.error('Failed to encrypt journal entry:', err);
          return false;
        }
      },

      deleteJournalEntry: (id) => {
        const { hapticsEnabled } = get();
        if (hapticsEnabled) triggerHaptic('soft');
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== id),
        }));
      },

      importJournalBackup: (entries) => {
        set((state) => ({
          journalEntries: [...entries, ...state.journalEntries],
        }));
      },

      exportEncryptedSponsorFile: async (sponsorPasscode: string, sponsorName: string = 'My Sponsor') => {
        const { journalEntries, activePassphrase } = get();
        if (!activePassphrase) {
          throw new Error('Please unlock journal before exporting.');
        }

        // Decrypt entries to create the sponsor-specific package
        const decryptedList = [];
        for (const entry of journalEntries) {
          try {
            const plain = await decryptTextAES256(entry.payload, activePassphrase);
            decryptedList.push({
              id: entry.id,
              title: entry.title,
              date: entry.date,
              moodRating: entry.moodRating,
              stepNumber: entry.stepNumber,
              stepPrompt: entry.stepPrompt,
              content: plain
            });
          } catch {
            // skip un-decryptable entry
          }
        }

        return createEncryptedSponsorExport(decryptedList, sponsorPasscode, sponsorName);
      }
    }),
    {
      name: 'sacred-steps-store',
      storage: createJSONStorage(() => localStorage),
      // DO NOT persist activePassphrase in storage to guarantee zero-knowledge memory protection!
      partialize: (state) => ({
        activeTab: state.activeTab,
        deviceMockup: state.deviceMockup,
        selectedPhoneModel: state.selectedPhoneModel,
        selectedPhoneColor: state.selectedPhoneColor,
        phoneOrientation: state.phoneOrientation,
        phoneScale: state.phoneScale,
        preferredVoiceId: state.preferredVoiceId,
        soundEnabled: state.soundEnabled,
        hapticsEnabled: state.hapticsEnabled,
        todaysAnchor: state.todaysAnchor,
        graceDeck: state.graceDeck,
        active12StepNumber: state.active12StepNumber,
        stepPromptAnswers: state.stepPromptAnswers,
        stepFreeformNotes: state.stepFreeformNotes,
        stepCompletedMap: state.stepCompletedMap,
        stepPrayerSpokenMap: state.stepPrayerSpokenMap,
        moralInventoryList: state.moralInventoryList,
        amendsLedger: state.amendsLedger,
        cleanStartDate: state.cleanStartDate,
        completedStepsCount: state.completedStepsCount,
        savedBreakthroughs: state.savedBreakthroughs,
        milestoneReflections: state.milestoneReflections,
        litCandlesMap: state.litCandlesMap,
        hasCreatedPin: state.hasCreatedPin,
        pinVerification: state.pinVerification,
        biometricLockEnabled: state.biometricLockEnabled,
        optInAiPatterns: state.optInAiPatterns,
        dailyRitualsHistory: state.dailyRitualsHistory,
        notificationSchedule: state.notificationSchedule,
        sponsorContact: state.sponsorContact,
        cravingLogs: state.cravingLogs,
        journalEntries: state.journalEntries.map(entry => ({
          ...entry,
          decryptedCache: undefined, // Never store decrypted cache in localStorage
        })),
      }),
    }
  )
);

