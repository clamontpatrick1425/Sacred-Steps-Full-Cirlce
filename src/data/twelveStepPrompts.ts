/**
 * Guided Prompts for each of the 12 Steps
 * Based on "Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery"
 * by C. Lamont Patrick (Kya Daisy Publishing, 2025)
 */

export interface StepGuidedPrompt {
  id: string;
  stepNumber: number;
  stepTitle: string;
  question: string;
  bookChapter: string;
  scriptureAnchor: {
    reference: string;
    text: string;
  };
  guidance: string;
  sampleStarter: string;
  tag: string;
}

export const TWELVE_STEP_GUIDED_PROMPTS: StepGuidedPrompt[] = [
  // Step 1
  {
    id: 'prompt-step-1-control',
    stepNumber: 1,
    stepTitle: 'Powerlessness & Radical Honesty',
    question: "Describe a moment when you realized your addiction had more control than you did. What did that feel like?",
    bookChapter: "Chapter 1: The Gateway to Healing",
    scriptureAnchor: {
      reference: "Matthew 11:28",
      text: "Come to me, all you who are weary and burdened, and I will give you rest."
    },
    guidance: "C. Lamont Patrick teaches that acknowledging powerlessness is not defeat, but a courageous doorway to divine empowerment. Allow yourself to be vulnerable without self-judgment.",
    sampleStarter: "I realized I had lost control when...",
    tag: "Surrender"
  },
  {
    id: 'prompt-step-1-exhaustion',
    stepNumber: 1,
    stepTitle: 'Powerlessness & Radical Honesty',
    question: "In what ways has attempting to control addiction through sheer willpower caused spiritual exhaustion?",
    bookChapter: "Chapter 1: The Gateway to Healing",
    scriptureAnchor: {
      reference: "2 Corinthians 12:9",
      text: "My grace is sufficient for you, for my power is made perfect in weakness."
    },
    guidance: "White-knuckling is exhausting. Lay down the burden of trying to fix everything on your own today.",
    sampleStarter: "Trying to fight this on my own made me feel...",
    tag: "Honesty"
  },

  // Step 2
  {
    id: 'prompt-step-2-hope',
    stepNumber: 2,
    stepTitle: 'Hope & Restoration to Sanity',
    question: "What does the 'God of your understanding' look like to you when you need comfort and sanity most?",
    bookChapter: "Chapter 2: A Beacon of Hope",
    scriptureAnchor: {
      reference: "Hebrews 11:1",
      text: "Now faith is confidence in what we hope for and assurance about what we do not see."
    },
    guidance: "Sanity is clarity, peace, and emotional balance returning after chaotic cycles of obsession.",
    sampleStarter: "When I invite God into my brokenness, sanity feels like...",
    tag: "Hope"
  },
  {
    id: 'prompt-step-2-distorted',
    stepNumber: 2,
    stepTitle: 'Hope & Restoration to Sanity',
    question: "What repetitive, distorted thoughts or lies from addiction are you asking God to restore to truth?",
    bookChapter: "Chapter 2: A Beacon of Hope",
    scriptureAnchor: {
      reference: "Romans 12:2",
      text: "Be transformed by the renewing of your mind."
    },
    guidance: "Name the anxious loops, the voices of unworthiness, or the fear of being seen.",
    sampleStarter: "The distorted belief I want God to replace with truth is...",
    tag: "Sanity"
  },

  // Step 3
  {
    id: 'prompt-step-3-surrender',
    stepNumber: 3,
    stepTitle: 'Surrender, Trust & Daily Willingness',
    question: "What specific area of your life (relationships, finances, cravings, career) is hardest to hand over to God?",
    bookChapter: "Chapter 3: Surrender and Trust",
    scriptureAnchor: {
      reference: "Proverbs 3:5-6",
      text: "Trust in the Lord with all your heart and lean not on your own understanding."
    },
    guidance: "Yielding control is a leap of faith. Like handing over the keys to a trusted driver, release your grip.",
    sampleStarter: "The area of my life I am gripping tightly is...",
    tag: "Willingness"
  },

  // Step 4
  {
    id: 'prompt-step-4-resentments',
    stepNumber: 4,
    stepTitle: 'Searching & Fearless Moral Inventory',
    question: "List the people, institutions, or situations you resent. For each, describe: What happened? How did it affect you? What part of you was threatened?",
    bookChapter: "Chapter 4: Mindful Self-Discovery",
    scriptureAnchor: {
      reference: "2 Corinthians 5:17",
      text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!"
    },
    guidance: "Patrick emphasizes that taking an inventory is not self-flagellation; it is bringing dark secrets into God's radiant grace so bitterness loses its grip.",
    sampleStarter: "I resent [person/situation] because... This threatened my [security/pride/relationships] by...",
    tag: "Inventory"
  },
  {
    id: 'prompt-step-4-assets',
    stepNumber: 4,
    stepTitle: 'Searching & Fearless Moral Inventory',
    question: "What are your core spiritual assets, gifts, and acts of bravery that addiction tried to hide?",
    bookChapter: "Chapter 4: Mindful Self-Discovery",
    scriptureAnchor: {
      reference: "Psalm 139:14",
      text: "I praise you because I am fearfully and wonderfully made."
    },
    guidance: "A balanced inventory includes your courage, kindness, creativity, and dreams. Balance every defect with an asset.",
    sampleStarter: "Even at my lowest, God preserved these strengths in me: ...",
    tag: "Assets"
  },

  // Step 5
  {
    id: 'prompt-step-5-confession',
    stepNumber: 5,
    stepTitle: 'Admitting Wrongs to God and Another',
    question: "What hidden secret or shameful memory feels most frightening to speak aloud to another human being?",
    bookChapter: "Chapter 5: Stepping into the Light",
    scriptureAnchor: {
      reference: "James 5:16",
      text: "Confess your sins to each other and pray for each other so that you may be healed."
    },
    guidance: "Addiction thrives in secrecy. Speaking the truth into the light dismantles the power of toxic shame.",
    sampleStarter: "The truth I have kept hidden behind walls is...",
    tag: "Light"
  },

  // Step 6
  {
    id: 'prompt-step-6-readiness',
    stepNumber: 6,
    stepTitle: 'Readiness for Character Defects Removal',
    question: "Which defect of character (pride, anger, avoidance, people-pleasing) has acted as an emotional shield for you?",
    bookChapter: "Chapter 6: Becoming Entirely Ready",
    scriptureAnchor: {
      reference: "1 Peter 5:6-7",
      text: "Humble yourselves under God’s mighty hand, that he may lift you up in due time."
    },
    guidance: "Defects were often unhealthy survival strategies. Thank them for protecting you in the past, then ask God to replace them with love.",
    sampleStarter: "I hold on to [defect] because it made me feel protected from...",
    tag: "Readiness"
  },

  // Step 7
  {
    id: 'prompt-step-7-humility',
    stepNumber: 7,
    stepTitle: 'Humbly Asking God to Remove Shortcomings',
    question: "What does genuine humility look like in your daily interactions today, rather than self-deprecation?",
    bookChapter: "Chapter 7: The Beauty of Humility",
    scriptureAnchor: {
      reference: "Micah 6:8",
      text: "Act justly, love mercy, and walk humbly with your God."
    },
    guidance: "Humility is not thinking less of yourself; it is thinking of yourself less, rooted securely in God's love.",
    sampleStarter: "Today, walking humbly with God looks like...",
    tag: "Humility"
  },

  // Step 8
  {
    id: 'prompt-step-8-willingness',
    stepNumber: 8,
    stepTitle: 'Making a List of Persons Harmed',
    question: "Who was hurt in the wake of your addiction, and what prevents you from feeling willing to make amends?",
    bookChapter: "Chapter 8: The Path to Reconciliation",
    scriptureAnchor: {
      reference: "Luke 6:31",
      text: "Do to others as you would have them do to you."
    },
    guidance: "Step 8 is about willingness, not rushing into reckless contact. Ask God to soften any defensive posture.",
    sampleStarter: "When I think of [person], the hurt done was... I am praying for the willingness to...",
    tag: "Willingness"
  },

  // Step 9
  {
    id: 'prompt-step-9-amends',
    stepNumber: 9,
    stepTitle: 'Making Direct Amends',
    question: "What living amend (consistent changed behavior, honesty, restitution) can you make to rebuild broken trust?",
    bookChapter: "Chapter 9: Healing Through Action",
    scriptureAnchor: {
      reference: "Matthew 5:23-24",
      text: "First go and be reconciled to them; then come and offer your gift."
    },
    guidance: "Words are cheap without changed conduct. How does your daily sobriety serve as an enduring amend?",
    sampleStarter: "My living amend to those I love is shown by...",
    tag: "Reconciliation"
  },

  // Step 10
  {
    id: 'prompt-step-10-daily-inventory',
    stepNumber: 10,
    stepTitle: 'Continued Daily Personal Inventory',
    question: "Looking back at the last 24 hours: Where was I resentful, dishonest, or fearful? Where did I prompt love and peace?",
    bookChapter: "Chapter 10: The Rhythm of Daily Awareness",
    scriptureAnchor: {
      reference: "Lamentations 3:40",
      text: "Let us examine our ways and test them, and let us return to the Lord."
    },
    guidance: "Promptly admitting when we are wrong prevents small resentments from festering into cravings.",
    sampleStarter: "Today, I paused and caught myself when... I was able to return to grace by...",
    tag: "Awareness"
  },

  // Step 11
  {
    id: 'prompt-step-11-prayer-meditation',
    stepNumber: 11,
    stepTitle: 'Prayer, Meditation & Conscious Contact',
    question: "In your quiet moments of meditation today, what whisper or feeling of peace did you receive from God?",
    bookChapter: "Chapter 11: Deepening the Divine Connection",
    scriptureAnchor: {
      reference: "Psalm 46:10",
      text: "Be still, and know that I am God."
    },
    guidance: "Prayer is speaking to God; meditation is listening. Breathe slowly and listen to what the Spirit speaks.",
    sampleStarter: "In the stillness today, I felt God inviting me to...",
    tag: "Meditation"
  },

  // Step 12
  {
    id: 'prompt-step-12-service',
    stepNumber: 12,
    stepTitle: 'Spiritual Awakening & Carrying the Message',
    question: "How has your journey through addiction and grace prepared you to offer hope to someone else walking through darkness?",
    bookChapter: "Chapter 12: A Life Transformed",
    scriptureAnchor: {
      reference: "Galatians 6:2",
      text: "Carry each other’s burdens, and in this way you will fulfill the law of Christ."
    },
    guidance: "Your scars are now symbols of redemption. You can speak hope to someone who believes their life is ruined.",
    sampleStarter: "My story of recovery can comfort someone else because...",
    tag: "Service"
  }
];

export function getPromptById(id: string): StepGuidedPrompt | undefined {
  return TWELVE_STEP_GUIDED_PROMPTS.find(p => p.id === id);
}

export function getPromptsForStep(stepNumber: number): StepGuidedPrompt[] {
  return TWELVE_STEP_GUIDED_PROMPTS.filter(p => p.stepNumber === stepNumber);
}
