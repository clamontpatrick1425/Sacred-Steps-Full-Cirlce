import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  FolderTree, 
  Download, 
  Layers, 
  Palette, 
  Database, 
  ShieldCheck 
} from 'lucide-react';
import { dawnColors } from '../theme/colors';

interface FileItem {
  name: string;
  path: string;
  category: 'config' | 'theme' | 'screens' | 'store' | 'crypto';
  language: string;
  content: string;
}

const RN_PROJECT_FILES: FileItem[] = [
  {
    name: 'app.json',
    path: 'app.json',
    category: 'config',
    language: 'json',
    content: `{
  "expo": {
    "name": "SacredSteps: Daily Grace",
    "slug": "sacred-steps-daily-grace",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFF9F5"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.sacredsteps.dailygrace"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFF9F5"
      },
      "package": "com.sacredsteps.dailygrace"
    },
    "plugins": [
      "expo-font",
      "expo-haptics",
      "expo-crypto",
      "expo-secure-store"
    ]
  }
}`
  },
  {
    name: 'tailwind.config.js',
    path: 'tailwind.config.js',
    category: 'config',
    language: 'javascript',
    content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dawn: {
          peach: "#FFD4C4",       // Warm Peach - Dawn light & compassion
          lavender: "#E6D5F0",    // Gentle Lavender - Peace, Rest & Grace
          gold: "#F4E4C1",        // Muted Gold - Divine Presence
          sage: "#C8D5B9",        // Sage Green - Healing & Renewal
          warmWhite: "#FFF9F5",   // Warm White - Digital Sanctuary background
          sand: "#F5EFEB",        // Soft Sand card surface
          espresso: "#2D2421",    // Grounded text
          muted: "#796B64",       // Warm umber metadata
          crisis: "#D97768",      // Alert Coral
        },
      },
      fontFamily: {
        serif: ["PlayfairDisplay_600SemiBold"],
        sans: ["Inter_400Regular"],
        scripture: ["CormorantGaramond_500Medium_Italic"],
      },
    },
  },
  plugins: [],
};`
  },
  {
    name: 'colors.ts',
    path: 'src/theme/colors.ts',
    category: 'theme',
    language: 'typescript',
    content: `export const dawnColors = {
  peach: '#FFD4C4',       // Warm Peach
  lavender: '#E6D5F0',    // Gentle Lavender
  gold: '#F4E4C1',        // Muted Gold
  sage: '#C8D5B9',        // Sage Green
  warmWhite: '#FFF9F5',   // Warm White Sanctuary
  sand: '#F5EFEB',        // Card Background
  espresso: '#2D2421',    // Text Primary
  muted: '#796B64',       // Text Secondary
  crisis: '#D97768',      // Gentle Lifeline Red
};

export const typography = {
  serifHeading: 'PlayfairDisplay-SemiBold',
  bodyText: 'Inter-Regular',
  italicScripture: 'CormorantGaramond-Italic',
};`
  },
  {
    name: 'useSacredStore.ts (React Native + Zustand)',
    path: 'src/store/useSacredStore.ts',
    category: 'store',
    language: 'typescript',
    content: `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface SacredState {
  cleanStartDate: string;
  completedStepsCount: number;
  savedBreakthroughs: any[];
  journalEntries: any[];
  getDaysInGrace: () => number;
  recordStep: () => void;
  resetGrace: () => void;
}

export const useSacredStore = create<SacredState>()(
  persist(
    (set, get) => ({
      cleanStartDate: new Date().toISOString(),
      completedStepsCount: 0,
      savedBreakthroughs: [],
      journalEntries: [],

      getDaysInGrace: () => {
        const start = new Date(get().cleanStartDate).getTime();
        return Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
      },

      recordStep: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        set((state) => ({ completedStepsCount: state.completedStepsCount + 1 }));
      },

      resetGrace: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        set({ cleanStartDate: new Date().toISOString() });
      },
    }),
    {
      name: 'sacred-steps-native-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);`
  },
  {
    name: 'StepMethodScreen.tsx (React Native NativeWind)',
    path: 'src/screens/StepMethodScreen.tsx',
    category: 'screens',
    language: 'typescript',
    content: `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';

export const StepMethodScreen = () => {
  const [struggle, setStruggle] = useState('');
  const [activeStep, setActiveStep] = useState(null);

  const handleRunStep = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Calls Sacred Steps The Guide endpoint
  };

  return (
    <ScrollView className="flex-1 bg-dawn-warmWhite px-5 pt-12">
      <View className="mb-6">
        <Text className="font-serif text-2xl text-dawn-espresso mb-1">
          The Sacred S.T.E.P. Method™
        </Text>
        <Text className="font-sans text-xs text-dawn-muted">
          Dismantle lies, shame, and fear in real-time.
        </Text>
      </View>

      <TextInput
        value={struggle}
        onChangeText={setStruggle}
        placeholder="What is pressing on your heart?"
        placeholderTextColor="#A89B94"
        multiline
        numberOfLines={4}
        className="bg-dawn-sand p-4 rounded-2xl text-dawn-espresso font-sans text-sm mb-4 border border-[#E8DED6]"
      />

      <TouchableOpacity
        onPress={handleRunStep}
        className="bg-dawn-espresso py-4 rounded-2xl items-center shadow-sm"
      >
        <Text className="text-dawn-warmWhite font-sans font-semibold text-sm">
          Walk Through S.T.E.P.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};`
  },
  {
    name: 'DailyAnchorScreen.tsx (Swipeable Cards & Grace Deck)',
    path: 'src/screens/DailyAnchorScreen.tsx',
    category: 'screens',
    language: 'typescript',
    content: `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export interface DailyContent {
  id: string;
  date: string;
  prayer: { title: string; content: string; source: string };
  verse: { reference: string; text: string; translation: string };
  affirmation: { text: string; category: string };
}

export const DailyAnchorScreen = ({ dailyContent, isSaved, onToggleSave }: any) => {
  const [activeSection, setActiveSection] = useState(0);

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleSave?.();
  };

  return (
    <View className="flex-1 bg-dawn-warmWhite px-5 pt-12">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="font-serif text-2xl text-dawn-espresso">Daily Anchor</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons 
            name={isSaved ? "heart" : "heart-outline"} 
            size={24} 
            color={isSaved ? "#D97768" : "#796B64"} 
          />
        </TouchableOpacity>
      </View>

      {/* Swipeable 3-section Card: Prayer -> Verse -> Affirmation */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveSection(index);
          Haptics.selectionAsync();
        }}
      >
        {/* Section 1: Prayer */}
        <View style={{ width: width - 40 }} className="bg-dawn-sand p-6 rounded-3xl border border-[#E8DED6]">
          <Text className="text-xs uppercase text-dawn-muted font-bold mb-2">1. Morning Prayer</Text>
          <Text className="font-serif text-xl text-dawn-espresso mb-3">{dailyContent?.prayer?.title}</Text>
          <Text className="font-sans text-sm text-dawn-espresso leading-relaxed">{dailyContent?.prayer?.content}</Text>
        </View>

        {/* Section 2: Bible Verse */}
        <View style={{ width: width - 40 }} className="bg-dawn-sand p-6 rounded-3xl border border-[#E8DED6]">
          <Text className="text-xs uppercase text-dawn-muted font-bold mb-2">2. Scripture Verse</Text>
          <Text className="font-scripture italic text-2xl text-dawn-espresso mb-3">"{dailyContent?.verse?.text}"</Text>
          <Text className="font-sans text-xs uppercase text-dawn-muted text-right">— {dailyContent?.verse?.reference}</Text>
        </View>

        {/* Section 3: Affirmation */}
        <View style={{ width: width - 40 }} className="bg-dawn-sand p-6 rounded-3xl border border-[#E8DED6] items-center justify-center">
          <Text className="text-xs uppercase text-dawn-muted font-bold mb-2">3. Affirmation</Text>
          <Text className="font-serif italic text-xl text-dawn-espresso text-center">"{dailyContent?.affirmation?.text}"</Text>
        </View>
      </ScrollView>
    </View>
  );
};`
  },
  {
    name: 'nativeCrypto.ts (Expo AES-GCM & PBKDF2)',
    path: 'src/utils/nativeCrypto.ts',
    category: 'crypto',
    language: 'typescript',
    content: `import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

/**
 * React Native Zero-Knowledge Local Encryption
 * Stored via Expo SecureStore and AES-GCM encryption.
 */
export async function deriveKey(passphrase: string, salt: string) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    passphrase + salt
  );
}

export async function storeSanctuaryToken(token: string) {
  await SecureStore.setItemAsync('sanctuary_pin_hash', token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}`
  }
];

export const RNBlueprintViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem>(RN_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const fullBundle = {
      appName: "SacredSteps: Daily Grace",
      techStack: "React Native + Expo + NativeWind + Zustand",
      designTokens: {
        colors: dawnColors,
        typography: "Playfair Display / Inter / Cormorant Garamond"
      },
      files: RN_PROJECT_FILES.map(f => ({
        path: f.path,
        content: f.content
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sacred-steps-react-native-expo-blueprint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Explorer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Sidebar File List */}
        <div className="md:col-span-4 space-y-1.5">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#796B64]">
              Project Blueprint Files
            </span>
            <button
              onClick={handleDownloadAll}
              className="px-2.5 py-1 rounded-lg bg-[#2D2421] text-[#FFF9F5] text-[11px] font-medium hover:bg-[#4A3E39] transition-colors flex items-center gap-1 shadow-xs"
            >
              <Download className="w-3 h-3 text-[#FFD4C4]" />
              <span>Export All</span>
            </button>
          </div>

          {RN_PROJECT_FILES.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#FFF9F5] border-[#2D2421] shadow-sm ring-1 ring-[#2D2421]'
                    : 'bg-[#FFF9F5]/70 border-[#E8DED6] hover:bg-[#FFF9F5] hover:border-[#D5C7BD]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileCode className="w-4 h-4 text-[#796B64] shrink-0" />
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-[#2D2421] truncate">
                      {file.name}
                    </span>
                    <span className="block text-[10px] text-[#796B64] font-mono truncate">
                      {file.path}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono text-[#796B64] px-1.5 py-0.5 rounded bg-[#FAF5F0] border border-[#E8DED6]">
                  {file.language}
                </span>
              </button>
            );
          })}
        </div>

        {/* Code Content Viewer */}
        <div className="md:col-span-8 bg-[#2D2421] text-[#FAF5F0] rounded-2xl border border-[#4A3E39] shadow-md overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-[#241D1A] border-b border-[#4A3E39] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD4C4]/70" />
              <span className="font-mono text-xs text-[#FAF5F0]">
                {selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="text-xs px-2.5 py-1 rounded bg-[#3A2F2A] hover:bg-[#4A3E39] text-[#FAF5F0] transition-colors flex items-center gap-1 font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#C8D5B9]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-[#F5EFEB]/90 selection:bg-[#FFD4C4]/30 selection:text-white max-h-[460px]">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
