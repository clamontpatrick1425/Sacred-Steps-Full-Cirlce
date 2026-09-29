import React, { useState } from 'react';
import { 
  RefreshCw, Volume2, Bookmark, Check, ArrowLeft, 
  Sparkles, Compass, Eye, Hand, Ear, Wind, Heart
} from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface GroundingItem {
  id: string;
  reference: string;
  verse: string;
  affirmation: string;
  lieDismantled: string;
  microPractice: string;
}

const CURATED_GROUNDING_LIST: GroundingItem[] = [
  {
    id: 'psalm-46-10',
    reference: 'Psalm 46:10',
    verse: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.',
    affirmation: 'In this stillness, I surrender my panic to God’s calm. I do not have to fight this storm alone.',
    lieDismantled: 'The lie that you must handle everything yourself or you will lose control.',
    microPractice: 'Drop your shoulders away from your ears, unclamp your jaw, and whisper: "God is here."'
  },
  {
    id: 'phil-4-13',
    reference: 'Philippians 4:13',
    verse: 'I can do all things through Christ who gives me strength.',
    affirmation: 'God’s strength is made perfect in my weakness. This craving will pass, and I will remain standing.',
    lieDismantled: 'The lie that you are too fragile to resist this urge.',
    microPractice: 'Plant both feet flat on the floor and feel the solid ground holding you up.'
  },
  {
    id: 'isaiah-41-10',
    reference: 'Isaiah 41:10',
    verse: 'Fear not, for I am with you; be not dismayed, for I am your God. I will strengthen you, yes, I will help you, I will uphold you with My righteous right hand.',
    affirmation: 'I am upheld by God’s righteous right hand. Fear has no authority over my breath or my spirit.',
    lieDismantled: 'The lie that you are alone in this dark hour.',
    microPractice: 'Place your hand over your heart and feel your chest rise and fall three times.'
  },
  {
    id: 'matt-11-28',
    reference: 'Matthew 11:28',
    verse: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    affirmation: 'I am worthy of rest without escape. Right here, in this breath, I accept Christ’s restorative peace.',
    lieDismantled: 'The lie that you must numb your pain to find relief.',
    microPractice: 'Exhale fully with an audible sigh and release the tension in your fists.'
  },
  {
    id: '2tim-1-7',
    reference: '2 Timothy 1:7',
    verse: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.',
    affirmation: 'My mind is sound, my heart is guarded by love, and this urge does not define who I am.',
    lieDismantled: 'The lie that panic and relapse are inevitable.',
    microPractice: 'Look around the room and name three blue objects you see.'
  },
  {
    id: 'psalm-34-18',
    reference: 'Psalm 34:18',
    verse: 'The Lord is near to the brokenhearted and saves the crushed in spirit.',
    affirmation: 'Even in the ache of this craving, God is closer than my next breath. I am held and I am safe.',
    lieDismantled: 'The lie that your brokenness separates you from God.',
    microPractice: 'Take a sip of cool water and notice the sensation going down your throat.'
  },
  {
    id: 'john-14-27',
    reference: 'John 14:27',
    verse: 'Peace I leave with you; My peace I give to you. Not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid.',
    affirmation: 'Christ’s peace is settling like deep quiet water over my restlessness.',
    lieDismantled: 'The lie that temporary pleasures can provide lasting safety.',
    microPractice: 'Speak aloud: "Peace is my inheritance. Fear has to leave."'
  }
];

export const GroundingScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { toggleSaveToGraceDeck, isSavedInGraceDeck, soundEnabled, hapticsEnabled, setSosActiveScreen } = useSacredStore();

  const [currentIndex, setCurrentIndex] = useState<number>(() => Math.floor(Math.random() * CURATED_GROUNDING_LIST.length));
  const [activeTab, setActiveTab] = useState<'scripture' | 'senses'>('scripture');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const item = CURATED_GROUNDING_LIST[currentIndex];

  const handleRefresh = () => {
    if (hapticsEnabled) triggerHaptic('soft');
    if (soundEnabled) sanctuaryAudio.playGraceChime('gentle');
    sanctuaryAudio.cancelSpeech();
    setIsSpeaking(false);
    
    // Pick next index, avoiding duplicate
    let nextIdx = Math.floor(Math.random() * CURATED_GROUNDING_LIST.length);
    if (nextIdx === currentIndex) {
      nextIdx = (nextIdx + 1) % CURATED_GROUNDING_LIST.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      sanctuaryAudio.cancelSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const speechText = `${item.reference}. ${item.verse}. Affirmation: ${item.affirmation}`;
    sanctuaryAudio.speakScripture(speechText);

    setTimeout(() => {
      setIsSpeaking(false);
    }, 12000);
  };

  const handleSaveDeck = () => {
    toggleSaveToGraceDeck({
      id: `grounding-${item.id}`,
      date: new Date().toISOString().split('T')[0],
      prayer: {
        title: `Grounding in ${item.reference}`,
        content: `Lord, when the storm shakes me, anchor me in this truth: ${item.verse}. Amen.`,
        source: "SacredSteps Emergency Sanctuary"
      },
      verse: {
        reference: item.reference,
        text: item.verse,
        translation: "Scripture"
      },
      affirmation: {
        text: item.affirmation,
        category: "Emergency Grounding"
      }
    });
  };

  const isSaved = isSavedInGraceDeck(`grounding-${item.id}`);

  return (
    <div className="flex flex-col h-full text-[#2D2421]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED6]">
        <button
          onClick={() => {
            sanctuaryAudio.cancelSpeech();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#796B64] hover:text-[#2D2421] p-1.5 rounded-lg hover:bg-[#F5EFEB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SOS Menu</span>
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-[#F5EFEB] border border-[#E8DED6]">
          <button
            onClick={() => setActiveTab('scripture')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'scripture'
                ? 'bg-white text-[#2D2421] shadow-xs'
                : 'text-[#796B64] hover:text-[#2D2421]'
            }`}
          >
            Scripture
          </button>
          <button
            onClick={() => setActiveTab('senses')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'senses'
                ? 'bg-white text-[#2D2421] shadow-xs'
                : 'text-[#796B64] hover:text-[#2D2421]'
            }`}
          >
            5-4-3-2-1
          </button>
        </div>

        <button
          onClick={handleRefresh}
          className="p-2 rounded-xl bg-[#FAF5F0] border border-[#E8DED6] text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB] transition-colors flex items-center gap-1 text-xs font-medium"
          title="Draw another scripture anchor"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Verse</span>
        </button>
      </div>

      {/* Main Grounding Content Area */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {activeTab === 'scripture' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Scripture Anchor Card */}
            <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFD4C4]/25 rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#5A6E4B] bg-[#C8D5B9]/30 px-3 py-1 rounded-full border border-[#C8D5B9]/50">
                  {item.reference}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSpeak}
                    className={`p-2 rounded-xl transition-colors ${
                      isSpeaking ? 'bg-[#FFD4C4] text-[#2D2421]' : 'text-[#796B64] hover:bg-[#F5EFEB]'
                    }`}
                    title="Listen aloud with gentle voice"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveDeck}
                    className={`p-2 rounded-xl transition-colors ${
                      isSaved ? 'text-[#5A6E4B] bg-[#C8D5B9]/30' : 'text-[#796B64] hover:bg-[#F5EFEB]'
                    }`}
                    title={isSaved ? 'Saved in Grace Deck' : 'Save to Grace Deck'}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* The Holy Scripture */}
              <p className="font-scripture italic text-xl sm:text-2xl leading-relaxed text-[#2D2421] mb-5">
                "{item.verse}"
              </p>

              {/* Grounding Affirmation */}
              <div className="bg-[#FAF5F0] rounded-2xl p-4 border border-[#E8DED6] mb-4">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#796B64] block mb-1">
                  Grounding Affirmation (Speak Aloud)
                </span>
                <p className="font-serif text-sm font-semibold text-[#2D2421] leading-relaxed">
                  "{item.affirmation}"
                </p>
              </div>

              {/* Lie Dismantled (S.T.E.P. Truth) */}
              <div className="bg-[#E6D5F0]/25 rounded-2xl p-3.5 border border-[#E6D5F0]/60 text-xs leading-relaxed text-[#4A3E39] mb-4">
                <strong className="text-[#2D2421] block mb-0.5">Dismantling the Lie:</strong>
                {item.lieDismantled} God’s grace is your fortress.
              </div>

              {/* Micro-Practice */}
              <div className="flex items-start gap-2.5 text-xs text-[#5A6E4B] bg-[#C8D5B9]/20 p-3 rounded-2xl border border-[#C8D5B9]/50">
                <Compass className="w-4 h-4 shrink-0 mt-0.5 text-[#5A6E4B]" />
                <div>
                  <strong className="text-[#2D2421] block">Instant Somatic Micro-Step:</strong>
                  {item.microPractice}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 5-4-3-2-1 Sensory Grounding for Acute Panic */
          <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl p-5 space-y-4 animate-in fade-in duration-300">
            <div className="text-center space-y-1 mb-2">
              <h3 className="font-serif text-base font-bold text-[#2D2421]">
                5-4-3-2-1 Sensory Harbor
              </h3>
              <p className="text-xs text-[#796B64]">
                Bring your brain out of future fear and anchor into God's present reality.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#FFD4C4]/50 text-[#8B261D] font-bold text-xs flex items-center justify-center shrink-0">
                  5
                </span>
                <div className="text-xs">
                  <span className="font-semibold text-[#2D2421] block flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#796B64]" />
                    Notice 5 things you can SEE
                  </span>
                  <span className="text-[#796B64]">A beam of light, the grain of wood, shoes, sky, a Bible.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#E6D5F0]/60 text-[#543864] font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <div className="text-xs">
                  <span className="font-semibold text-[#2D2421] block flex items-center gap-1.5">
                    <Hand className="w-3.5 h-3.5 text-[#796B64]" />
                    Feel 4 things you can TOUCH
                  </span>
                  <span className="text-[#796B64]">The fabric of your shirt, the cool phone screen, the chair.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#C8D5B9]/60 text-[#3F5234] font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="text-xs">
                  <span className="font-semibold text-[#2D2421] block flex items-center gap-1.5">
                    <Ear className="w-3.5 h-3.5 text-[#796B64]" />
                    Listen for 3 sounds you can HEAR
                  </span>
                  <span className="text-[#796B64]">Distant cars, the hum of air, your own rhythmic breath.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#F4E4C1] text-[#695427] font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="text-xs">
                  <span className="font-semibold text-[#2D2421] block flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-[#796B64]" />
                    Identify 2 scents you can SMELL
                  </span>
                  <span className="text-[#796B64]">Fresh air, coffee, clean soap, or quiet neutrality.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#FFCAD4] text-[#8B261D] font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="text-xs">
                  <span className="font-semibold text-[#2D2421] block flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#8B261D]" />
                    Acknowledge 1 blessing of GOD’S GRACE
                  </span>
                  <span className="text-[#796B64]">You are alive, right here, right now, completely forgiven.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-[#E8DED6] flex items-center gap-2">
        <button
          onClick={handleRefresh}
          className="flex-1 py-3 px-4 rounded-2xl bg-[#2D2421] text-[#FFF9F5] font-semibold text-xs hover:bg-[#4A3E39] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#FFD4C4]" />
          <span>Draw Another Promise</span>
        </button>

        <button
          onClick={() => {
            sanctuaryAudio.cancelSpeech();
            setSosActiveScreen('breathe');
          }}
          className="py-3 px-4 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] font-semibold text-xs hover:bg-[#F5EFEB] transition-colors flex items-center gap-1.5"
        >
          <Wind className="w-3.5 h-3.5 text-[#5A6E4B]" />
          <span>Breathe (4-7-8)</span>
        </button>
      </div>
    </div>
  );
};
