import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Crisis detection helper
const CRISIS_KEYWORDS = [
  'kill myself',
  'suicide',
  'end my life',
  'die',
  'slit my wrist',
  'cut myself',
  'overdose on purpose',
  'hurt myself',
  'harm myself',
  'not worth living',
  'better off dead',
  'want to die',
  'end it all'
];

const CRISIS_PROTOCOL_RESPONSE = {
  isCrisis: true,
  message: "I hear how much pain you are in, and you don't have to carry this alone right now. Please reach out to people who can help keep you safe: Call or text 988 (Suicide & Crisis Lifeline) or go to the nearest emergency room. I am here to pray with you when you are safe.",
  hotline: '988',
  scripture: {
    reference: 'Psalm 34:18',
    text: 'The Lord is near to the brokenhearted and saves the crushed in spirit.'
  },
  truth: {
    lie: 'You are completely alone in this darkness and there is no way forward.',
    statement: 'Your life has sacred, irreplaceable value, and God is drawing near to you in this very breath.'
  },
  embrace: {
    affirmation: 'I am not alone; I am worthy of safety and grace.'
  },
  practice: {
    microStep: 'Call or text 988 right now, or reach out to a trusted loved one who can be with you.'
  },
  closing: "I'm right here with you. Take the next step to safety."
};

// Curated library of authentic scripture-grounded S.T.E.P. fallbacks
const FALLBACK_STEPS: Record<string, {
  scripture: { reference: string; text: string };
  truth: { lie: string; statement: string };
  embrace: { affirmation: string };
  practice: { microStep: string };
  closing: string;
}> = {
  craving: {
    scripture: {
      reference: '1 Corinthians 10:13',
      text: 'God is faithful; He will not let you be tempted beyond what you can bear. But when you are tempted, He will also provide a way out so that you can endure it.'
    },
    truth: {
      lie: 'This physical urge will overpower you unless you give in right now.',
      statement: 'This urge is a passing wave that peaks and recedes, and God’s grace is sufficient for this exact sixty seconds.'
    },
    embrace: {
      affirmation: 'I am stronger than this passing urge, rooted in Christ’s enduring strength.'
    },
    practice: {
      microStep: 'Drink a cold glass of water, stand up, and take 3 deep 4-7-8 breaths.'
    },
    closing: "I'm right here with you. Take the next step."
  },
  shame: {
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
  },
  anxiety: {
    scripture: {
      reference: 'Philippians 4:6-7',
      text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.'
    },
    truth: {
      lie: 'Everything is falling apart and you must maintain total control to survive.',
      statement: 'God holds the future that you cannot see, and you are held in His peace right now.'
    },
    embrace: {
      affirmation: 'I am held in peace that surpasses human understanding.'
    },
    practice: {
      microStep: 'Open your palms upward on your lap, release your jaw, and exhale slowly.'
    },
    closing: "I'm right here with you. Take the next step."
  },
  loneliness: {
    scripture: {
      reference: 'Joshua 1:9',
      text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.'
    },
    truth: {
      lie: 'Nobody understands your pain, and you are walking this solitary road alone.',
      statement: 'The Holy Spirit is closer than your next breath, and your fellowship in grace is real.'
    },
    embrace: {
      affirmation: 'I am deeply seen, known, and accompanied by divine love.'
    },
    practice: {
      microStep: 'Send a simple encouragement text to a recovery brother/sister or sponsor.'
    },
    closing: "I'm right here with you. Take the next step."
  },
  relapse_fear: {
    scripture: {
      reference: '2 Timothy 1:7',
      text: 'For God has not given us a spirit of fear, but of power, of love, and of a sound mind.'
    },
    truth: {
      lie: 'You are doomed to repeat old patterns forever.',
      statement: 'Grace has broken the cycle of defeat; today is a brand new horizon with a sound mind.'
    },
    embrace: {
      affirmation: 'I am walking forward one day at a time, guided by divine power and peace.'
    },
    practice: {
      microStep: 'List 3 micro-victories you have achieved this week in your encrypted journal.'
    },
    closing: "I'm right here with you. Take the next step."
  },
  resentment: {
    scripture: {
      reference: 'Colossians 3:13',
      text: 'Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.'
    },
    truth: {
      lie: 'Holding onto this anger protects you and gives you justice.',
      statement: 'Holding resentment only poisons your own recovery; releasing it to God sets your soul free.'
    },
    embrace: {
      affirmation: 'I am choosing freedom and peace over the heavy burden of bitterness.'
    },
    practice: {
      microStep: 'Mentally release that person into God’s sovereign hands and say: "I surrender this burden to You."'
    },
    closing: "I'm right here with you. Take the next step."
  }
};

// S.T.E.P. Guide Endpoint
app.post('/api/step-guide', async (req: Request, res: Response) => {
  try {
    const { struggle, trigger, context } = req.body;

    if (!struggle && !trigger) {
      return res.status(400).json({ error: 'Please share your struggle or select a trigger.' });
    }

    const fullPromptText = `${struggle || ''} ${trigger || ''} ${context || ''}`.toLowerCase();

    // Check crisis keywords first
    const isCrisisDetected = CRISIS_KEYWORDS.some(kw => fullPromptText.includes(kw));
    if (isCrisisDetected) {
      return res.json(CRISIS_PROTOCOL_RESPONSE);
    }

    // Attempt Gemini Generation
    if (aiClient) {
      const systemInstruction = `You are "The Guide," an empathetic, grace-oriented spiritual companion for the Sacred Steps to Redemption app. Your purpose is to help users dismantle lies, shame, and fear in real-time using the Sacred S.T.E.P. Method™.

BRAND VOICE & TONE:
- Empathetic & Grounded: Compassionate without being overly clinical. Meet them exactly where they are.
- Reverent & Authoritative: Rooted in scripture. You are not a therapist; you are a spiritual guide pointing to God's truth.
- Encouraging & Clear: Simple, direct language. No Christian jargon or overly academic theology. Tagline: "A Path to Recovery, A Life in Grace."

STRICT GUARDRAILS (CRITICAL):
1. NEVER give clinical, medical, or psychological advice.
2. CRISIS PROTOCOL: If user expresses intent to harm themselves or others, or mentions severe crisis, IMMEDIATELY pause the S.T.E.P. method. Respond with the exact words: "I hear how much pain you are in, and you don't have to carry this alone right now. Please reach out to people who can help keep you safe: Call or text 988 (Suicide & Crisis Lifeline) or go to the nearest emergency room. I am here to pray with you when you are safe."
3. Do not preach, shame, or use toxic positivity.

THE SACRED S.T.E.P. METHOD™ (Your Core Logic):
When a user shares a struggle or selects a trigger, guide them through this exact 4-part framework:
1. (S) Scripture: Provide ONE specific biblical verse reference and quotation that anchors them in God's Word.
2. (T) Truth: Name the specific lie, fear, or shame their struggle is based on. Dismantle it with a single, clear sentence.
3. (E) Embrace: Give them a personal, first-person "I am" affirmation to speak out loud.
4. (P) Practice: Give them ONE micro-step to take right now (e.g., "Text a friend," "Take 3 deep breaths and say this verse").

FORMATTING:
Output valid JSON only with keys:
{
  "isCrisis": false,
  "scripture": {
    "reference": "e.g. 2 Corinthians 12:9",
    "text": "My grace is sufficient for you, for my power is made perfect in weakness."
  },
  "truth": {
    "lie": "The specific lie (e.g. You are too weak to resist this craving)",
    "statement": "The dismantling truth (e.g. Your weakness is the exact place where Christ's power rests upon you)."
  },
  "embrace": {
    "affirmation": "e.g. I am made strong in God's abundant grace today."
  },
  "practice": {
    "microStep": "e.g. Place your feet flat on the floor, take three steady breaths, and speak this affirmation aloud."
  },
  "closing": "I'm right here with you. Take the next step."
}`;

      const userMessage = `User's current struggle: "${struggle || ''}"
Trigger category: "${trigger || 'General Recovery Struggle'}"
Additional context: "${context || 'Seeking immediate real-time grace and grounding'}"`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const responseText = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          ...parsed,
          isCrisis: parsed.isCrisis || false,
          closing: parsed.closing || "I'm right here with you. Take the next step."
        });
      } catch (jsonErr) {
        console.warn('Failed to parse Gemini JSON, parsing manually or falling back:', jsonErr);
      }
    }

    // Fallback selection based on trigger or struggle words
    let matchedKey = 'craving';
    if (fullPromptText.includes('shame') || fullPromptText.includes('guilt') || fullPromptText.includes('failure')) {
      matchedKey = 'shame';
    } else if (fullPromptText.includes('anxiety') || fullPromptText.includes('panic') || fullPromptText.includes('worry') || fullPromptText.includes('fear')) {
      matchedKey = 'anxiety';
    } else if (fullPromptText.includes('lone') || fullPromptText.includes('isolated') || fullPromptText.includes('nobody')) {
      matchedKey = 'loneliness';
    } else if (fullPromptText.includes('relapse') || fullPromptText.includes('slip') || fullPromptText.includes('repeat')) {
      matchedKey = 'relapse_fear';
    } else if (fullPromptText.includes('angry') || fullPromptText.includes('resent') || fullPromptText.includes('hate') || fullPromptText.includes('mad')) {
      matchedKey = 'resentment';
    } else if (trigger && FALLBACK_STEPS[trigger]) {
      matchedKey = trigger;
    }

    const fallback = FALLBACK_STEPS[matchedKey] || FALLBACK_STEPS.craving;
    return res.json({
      isCrisis: false,
      ...fallback
    });
  } catch (err: any) {
    console.error('Error in /api/step-guide:', err);
    return res.json({
      isCrisis: false,
      ...FALLBACK_STEPS.craving
    });
  }
});

// ==========================================
// Murf AI Text-to-Speech Integration
// ==========================================
const murfApiKey = process.env.MURF_API_KEY || 'ap2_de06251f-5bb6-4e8d-befa-4f0cf61b0c39';

// Curated devotional & contemplative voices (Gen2 high fidelity models)
const SACRED_MURF_VOICES = [
  {
    voiceId: 'en-US-carter',
    displayName: 'Carter (Calm & Pastoral)',
    gender: 'Male',
    style: 'Calm',
    description: 'Warm, compassionate baritone with gentle, natural human cadence'
  },
  {
    voiceId: 'en-US-natalie',
    displayName: 'Natalie (Warm & Gentle)',
    gender: 'Female',
    style: 'Conversational',
    description: 'Soft, lifelike presence with natural breathing and empathy'
  },
  {
    voiceId: 'en-US-wayne',
    displayName: 'Wayne (Reverent & Grounded)',
    gender: 'Male',
    style: 'Calm',
    description: 'Deep, serene, contemplative tone for scripture and meditation'
  },
  {
    voiceId: 'en-US-terrell',
    displayName: 'Terrell (Inspirational)',
    gender: 'Male',
    style: 'Conversational',
    description: 'Expressive, encouraging spiritual guide with heartfelt warmth'
  },
  {
    voiceId: 'en-US-samantha',
    displayName: 'Samantha (Tender & Serene)',
    gender: 'Female',
    style: 'Conversational',
    description: 'Crystal-clear, emotionally comforting voice for daily devotionals'
  },
  {
    voiceId: 'en-US-marcus',
    displayName: 'Marcus (Reassuring Recovery Guide)',
    gender: 'Male',
    style: 'Conversational',
    description: 'Steady, grounded companion voice for 12-Step prayers and reflection'
  }
];

// Audio URL in-memory cache to save Murf character quota on repeated verses/prayers
const ttsCache = new Map<string, { audioUrl: string; length: number; expires: number }>();

function formatTextForNaturalHumanSpeech(raw: string): string {
  return raw
    // Strip markdown formatting
    .replace(/[*_#~`]/g, '')
    // Remove Bible version acronyms in parentheses: (NIV), (ESV), etc.
    .replace(/\s*\((?:NIV|ESV|KJV|NKJV|NLT|CSB|NASB|MSG|AMP)\)/gi, '')
    // Format scripture citations: "Psalm 34:18" -> "Psalm 34, verse 18"
    .replace(/(\b[1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)/g, '$1 $2, verse $3')
    // Convert harsh dashes to commas for gentle conversational pauses
    .replace(/[—–]/g, ', ')
    // Remove bracketed references
    .replace(/\[[^\]]*\]/g, '')
    // Clean redundant spaces
    .replace(/\s+/g, ' ')
    .trim();
}

app.get('/api/voice/status', (_req: Request, res: Response) => {
  return res.json({
    enabled: Boolean(murfApiKey),
    provider: 'murf-ai-gen2',
    voicesCount: SACRED_MURF_VOICES.length,
    defaultVoice: 'en-US-carter'
  });
});

app.get('/api/voice/voices', (_req: Request, res: Response) => {
  return res.json({
    voices: SACRED_MURF_VOICES
  });
});

app.post('/api/voice/speak', async (req: Request, res: Response) => {
  try {
    const { text, voiceId, style, rate, pitch } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for voice synthesis' });
    }

    // Clean text and add natural breath cadence
    const cleanText = formatTextForNaturalHumanSpeech(text);

    // Check if Murf API Key is configured
    if (!murfApiKey) {
      return res.json({
        success: false,
        fallback: true,
        message: 'Murf AI API key not configured on server'
      });
    }

    const selectedVoiceId = voiceId || 'en-US-carter';
    const voiceMeta = SACRED_MURF_VOICES.find(v => v.voiceId === selectedVoiceId);
    const selectedStyle = style || voiceMeta?.style || 'Calm';

    // Check cache
    const cacheKey = `${selectedVoiceId}:${selectedStyle}:${cleanText.slice(0, 200)}`;
    const cached = ttsCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return res.json({
        success: true,
        audioUrl: cached.audioUrl,
        audioLength: cached.length,
        cached: true,
        voiceId: selectedVoiceId,
        provider: 'murf-gen2'
      });
    }

    // Call Murf AI Gen2 Studio API endpoint
    const murfRes = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'api-key': murfApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        voiceId: selectedVoiceId,
        text: cleanText,
        style: selectedStyle,
        format: 'MP3',
        modelVersion: 'GEN2',
        sampleRate: 48000,
        channelType: 'STEREO',
        rate: typeof rate === 'number' ? rate : 0,
        pitch: typeof pitch === 'number' ? pitch : 0,
        encodeAsBase64: false
      })
    });

    if (!murfRes.ok) {
      const errText = await murfRes.text();
      console.warn('Murf AI API error:', murfRes.status, errText);
      return res.json({
        success: false,
        fallback: true,
        error: `Murf API responded with status ${murfRes.status}`
      });
    }

    const murfData = await murfRes.json();
    if (murfData.audioFile) {
      // Cache for 24 hours
      ttsCache.set(cacheKey, {
        audioUrl: murfData.audioFile,
        length: murfData.audioLengthInSeconds || 0,
        expires: Date.now() + 24 * 60 * 60 * 1000
      });

      return res.json({
        success: true,
        audioUrl: murfData.audioFile,
        audioLength: murfData.audioLengthInSeconds,
        remainingCharacters: murfData.remainingCharacterCount,
        voiceId: selectedVoiceId,
        provider: 'murf-gen2'
      });
    }

    return res.json({
      success: false,
      fallback: true,
      error: 'No audioFile returned from Murf AI'
    });
  } catch (err: any) {
    console.error('Error in /api/voice/speak:', err);
    return res.json({
      success: false,
      fallback: true,
      error: err.message || 'Internal server error during speech synthesis'
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SacredSteps: Daily Grace running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
