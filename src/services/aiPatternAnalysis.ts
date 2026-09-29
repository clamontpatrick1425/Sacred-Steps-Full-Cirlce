/**
 * Local AI Pattern Analysis Service
 * 
 * 100% Client-Side / On-Device Pattern Recognition Engine
 * Zero Server Calls • Strict Privacy Opt-In Required
 * 
 * Identifies emotional trajectories, recurring triggers, spiritual themes,
 * and growth markers from the user's decrypted 12-Step journal entries,
 * grounded in C. Lamont Patrick's "Sacred Steps to Redemption".
 */

export interface DecryptedEntryForAnalysis {
  id: string;
  date: string;
  title: string;
  content: string;
  moodRating?: number; // 1-5
  stepNumber?: number; // 1-12
  stepPrompt?: string;
  triggerTag?: string;
}

export interface PatternTheme {
  theme: string;
  count: number;
  description: string;
  category: 'growth' | 'trigger' | 'spiritual';
  scriptureAnchor?: string;
}

export interface PatternAnalysisResult {
  totalAnalyzed: number;
  optInConfirmed: boolean;
  generatedAt: string;
  
  // Mood metrics
  moodMetrics: {
    averageScore: number;
    trend: 'rising' | 'steady' | 'valley';
    trendSummary: string;
    distribution: {
      heavyValley: number;     // 1
      seekingGrace: number;    // 2
      grounded: number;        // 3
      risingHope: number;      // 4
      radiantPeace: number;    // 5
    };
  };

  // Top thematic patterns
  topThemes: PatternTheme[];

  // Recurring triggers identified
  recurringTriggers: {
    name: string;
    frequency: number;
    guidance: string;
  }[];

  // Grace breakthrough markers
  breakthroughMarkers: string[];

  // Recommended next step from C. Lamont Patrick's book
  recommendedNextStep: {
    stepNumber: number;
    stepTitle: string;
    reason: string;
    encouragement: string;
    actionableMicroStep: string;
  };

  // Affirmation for this recovery phase
  curatedAffirmation: string;
}

const THEME_DICTIONARY: Record<string, { keywords: string[]; category: 'growth' | 'trigger' | 'spiritual'; description: string; scriptureAnchor: string }> = {
  'Surrender & Release': {
    keywords: ['surrender', 'let go', 'powerless', 'handed over', 'control', 'relinquish', 'gave it to god', 'white knuckl'],
    category: 'spiritual',
    description: 'Recognizing that yielding human control opens the doorway to divine peace.',
    scriptureAnchor: 'Matthew 11:28'
  },
  'Dismantling Shame': {
    keywords: ['shame', 'guilt', 'unworthy', 'disgrace', 'dirty', 'hide', 'hiding', 'exposed', 'not good enough'],
    category: 'trigger',
    description: 'Confronting the toxic lie that your past failures define your worth before God.',
    scriptureAnchor: 'Romans 8:1'
  },
  'Releasing Resentment': {
    keywords: ['resent', 'anger', 'bitter', 'unfair', 'hurt me', 'blame', 'betrayed', 'grudge', 'forgive'],
    category: 'trigger',
    description: 'Untying emotional knots by choosing forgiveness over self-poisoning bitterness.',
    scriptureAnchor: '2 Corinthians 5:17'
  },
  'Rising Hope & Renewal': {
    keywords: ['hope', 'light', 'renew', 'healing', 'grateful', 'thankful', 'restored', 'clarity', 'peaceful'],
    category: 'growth',
    description: 'Evidence of God’s restoring presence lifting the cloud of exhaustion.',
    scriptureAnchor: 'Hebrews 11:1'
  },
  'Radical Honesty & Light': {
    keywords: ['truth', 'honest', 'confess', 'spoke up', 'shared with', 'sponsor', 'admitted', 'realized'],
    category: 'growth',
    description: 'Stepping into the light by speaking previously hidden truths.',
    scriptureAnchor: 'James 5:16'
  },
  'Humility & Willingness': {
    keywords: ['humble', 'willing', 'listen', 'patient', 'gentle', 'soften', 'teachable', 'character defect'],
    category: 'spiritual',
    description: 'A softening heart that embraces steady progress rather than ego-driven perfection.',
    scriptureAnchor: 'Micah 6:8'
  },
  'Living Amends & Restoration': {
    keywords: ['amends', 'apologize', 'repair', 'restitution', 'reconcile', 'make it right', 'changed behavior'],
    category: 'growth',
    description: 'Transforming regret into active, humble restoration of relationships.',
    scriptureAnchor: 'Luke 6:31'
  },
  'Quiet Meditation & Stillness': {
    keywords: ['still', 'breathe', 'meditate', 'prayed', 'quiet', 'whisper', 'presence', 'solitude'],
    category: 'spiritual',
    description: 'Pausing daily to replenish spiritual reserves in God’s quiet presence.',
    scriptureAnchor: 'Psalm 46:10'
  }
};

const TRIGGER_PATTERNS = [
  {
    name: 'Emotional Isolation',
    keywords: ['alone', 'isolated', 'lonely', 'withdrew', 'pulling away', 'nobody understands'],
    guidance: 'Isolation is fertile ground for relapse. Make a commitment to reach out to a fellowship friend or sponsor within the next 2 hours.'
  },
  {
    name: 'Exhaustion & Depletion (HALT)',
    keywords: ['tired', 'exhausted', 'drained', 'overwhelmed', 'burnout', 'no sleep', 'running on empty'],
    guidance: 'Spiritual willpower drops when the physical body is exhausted. Schedule a 20-minute rest pause and quiet prayer.'
  },
  {
    name: 'Perfectionism & Self-Pressure',
    keywords: ['must be perfect', 'failed', 'should have', 'not doing enough', 'falling behind', 'imposter'],
    guidance: 'Recovery is about spiritual progress, not human perfection. Remember C. Lamont Patrick’s motto: grace meets you where you are.'
  },
  {
    name: 'Interpersonal Conflict',
    keywords: ['argument', 'fight', 'yelled', 'misunderstood', 'defensive', 'criticized', 'tension'],
    guidance: 'Pause before reacting. Use Step 10 awareness: take 3 deep breaths and ask God for the gift of a pause.'
  }
];

/**
 * Execute local AI pattern analysis on decrypted entries
 */
export function analyzeJournalPatternsLocally(
  entries: DecryptedEntryForAnalysis[],
  optIn: boolean
): PatternAnalysisResult | null {
  if (!optIn || entries.length === 0) {
    return null;
  }

  // 1. Calculate Mood Metrics
  const ratings = entries
    .map(e => e.moodRating)
    .filter((r): r is number => typeof r === 'number' && r >= 1 && r <= 5);

  const distribution = {
    heavyValley: 0,
    seekingGrace: 0,
    grounded: 0,
    risingHope: 0,
    radiantPeace: 0
  };

  ratings.forEach(r => {
    if (r === 1) distribution.heavyValley++;
    else if (r === 2) distribution.seekingGrace++;
    else if (r === 3) distribution.grounded++;
    else if (r === 4) distribution.risingHope++;
    else if (r === 5) distribution.radiantPeace++;
  });

  const averageScore = ratings.length > 0 
    ? Number((ratings.reduce((sum, val) => sum + val, 0) / ratings.length).toFixed(1))
    : 3.0;

  // Determine trend: compare earlier half vs recent half
  let trend: 'rising' | 'steady' | 'valley' = 'steady';
  let trendSummary = 'Your reflections show an anchored, steady rhythm in God’s care.';

  if (ratings.length >= 3) {
    const recentScores = ratings.slice(0, Math.ceil(ratings.length / 2));
    const olderScores = ratings.slice(Math.ceil(ratings.length / 2));
    const recentAvg = recentScores.reduce((s, v) => s + v, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((s, v) => s + v, 0) / olderScores.length;

    if (recentAvg - olderAvg > 0.4) {
      trend = 'rising';
      trendSummary = 'Upward trajectory: Your entries reflect growing hope, emotional stability, and gratitude.';
    } else if (olderAvg - recentAvg > 0.4) {
      trend = 'valley';
      trendSummary = 'Tender season: Your writings reflect elevated weight and strain. Lean into holy rest and sponsor connection.';
    }
  }

  // 2. Identify Themes across entries text
  const aggregatedText = entries
    .map(e => `${e.title} ${e.content} ${e.triggerTag || ''}`)
    .join(' ')
    .toLowerCase();

  const themesFound: PatternTheme[] = [];

  Object.entries(THEME_DICTIONARY).forEach(([themeName, config]) => {
    let count = 0;
    config.keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}`, 'gi');
      const matches = aggregatedText.match(regex);
      if (matches) count += matches.length;
    });

    if (count > 0) {
      themesFound.push({
        theme: themeName,
        count,
        description: config.description,
        category: config.category,
        scriptureAnchor: config.scriptureAnchor
      });
    }
  });

  themesFound.sort((a, b) => b.count - a.count);
  const topThemes = themesFound.slice(0, 4);

  // 3. Scan for Recurring Triggers
  const detectedTriggers: { name: string; frequency: number; guidance: string }[] = [];

  TRIGGER_PATTERNS.forEach(trig => {
    let freq = 0;
    trig.keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}`, 'gi');
      const matches = aggregatedText.match(regex);
      if (matches) freq += matches.length;
    });

    if (freq > 0) {
      detectedTriggers.push({
        name: trig.name,
        frequency: freq,
        guidance: trig.guidance
      });
    }
  });

  detectedTriggers.sort((a, b) => b.frequency - a.frequency);

  // 4. Grace Breakthrough Markers
  const breakthroughMarkers: string[] = [];
  if (aggregatedText.includes('surrender') || aggregatedText.includes('powerless')) {
    breakthroughMarkers.push('Acknowledge Powerlessness: You are letting go of sheer willpower and inviting God in.');
  }
  if (aggregatedText.includes('forgive') || aggregatedText.includes('amends')) {
    breakthroughMarkers.push('Heart of Reconciliation: Willingness to mend broken bonds and release bitter grudges.');
  }
  if (aggregatedText.includes('grateful') || aggregatedText.includes('thankful')) {
    breakthroughMarkers.push('Gratitude Anchor: Cultivating mindful thankfulness amidst life’s uncertainties.');
  }
  if (aggregatedText.includes('honest') || aggregatedText.includes('truth')) {
    breakthroughMarkers.push('Radical Transparency: Breaking isolation by bringing hidden shadows into the light.');
  }

  if (breakthroughMarkers.length === 0) {
    breakthroughMarkers.push('Faithful Showing Up: Taking the time to write honestly in your encrypted sanctuary.');
  }

  // 5. Recommended Next Step from C. Lamont Patrick's book
  let recommendedStepNumber = 1;
  let recommendedReason = 'Rooting yourself in Step 1 powerlessness brings fresh relief.';
  let stepTitle = 'Step 1: Powerlessness & Radical Honesty';
  let stepEncouragement = 'Remember that surrendering is not defeat; it is admitting human limitations so God’s strength can sustain you.';
  let microStep = 'Read Matthew 11:28 and take 3 deep, mindful breaths.';

  if (detectedTriggers.some(t => t.name === 'Emotional Isolation')) {
    recommendedStepNumber = 5;
    stepTitle = 'Step 5: Confession & Stepping into the Light';
    recommendedReason = 'Your reflections mention feeling isolated. Sharing your truth with a trusted human companion brings immediate healing.';
    stepEncouragement = 'Addiction thrives in darkness; grace flourishes when we step into mutual fellowship.';
    microStep = 'Send a brief message to your sponsor or prayer partner today.';
  } else if (topThemes.some(t => t.theme === 'Releasing Resentment')) {
    recommendedStepNumber = 4;
    stepTitle = 'Step 4: Mindful Moral Inventory';
    recommendedReason = 'Resentment surfaced in your notes. An honest inventory helps locate the root fear and release the grievance.';
    stepEncouragement = 'Taking an inventory is not about self-condemnation; it is about freeing your heart from toxic grudges.';
    microStep = 'Write down the name of one person you resent and offer a simple prayer for their peace.';
  } else if (averageScore >= 3.8) {
    recommendedStepNumber = 11;
    stepTitle = 'Step 11: Prayer & Conscious Contact';
    recommendedReason = 'Your spirit is steady and rising. Now is a wonderful time to deepen quiet meditation with God.';
    stepEncouragement = 'Build on this grounded clarity by listening to the gentle whisper of the Holy Spirit.';
    microStep = 'Spend 5 minutes in silent gratitude without asking for anything.';
  }

  const curatedAffirmation = averageScore < 2.5
    ? 'I am worthy of God’s endless grace, even on the days I stumble. I do not have to carry this alone.'
    : averageScore < 3.8
    ? 'With each mindful step, I release what I cannot control and rest safely in God’s gentle guidance.'
    : 'God is restoring my sanity, my joy, and my purpose. I am walking as a new creation in His light.';

  return {
    totalAnalyzed: entries.length,
    optInConfirmed: true,
    generatedAt: new Date().toISOString(),
    moodMetrics: {
      averageScore,
      trend,
      trendSummary,
      distribution
    },
    topThemes,
    recurringTriggers: detectedTriggers.slice(0, 3),
    breakthroughMarkers,
    recommendedNextStep: {
      stepNumber: recommendedStepNumber,
      stepTitle,
      reason: recommendedReason,
      encouragement: stepEncouragement,
      actionableMicroStep: microStep
    },
    curatedAffirmation
  };
}
