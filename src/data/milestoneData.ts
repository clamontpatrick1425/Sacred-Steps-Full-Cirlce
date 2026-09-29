/**
 * Milestone Definitions and eBook Content
 * Based on "Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery"
 * by C. Lamont Patrick
 */

export interface MilestoneItem {
  id: string;
  days: number;
  symbol: string;
  badgeName: string;
  title: string;
  theme: string;
  description: string;
  eBookPrayer: {
    title: string;
    text: string;
    chapterRef: string;
  };
  bibleVerse: {
    reference: string;
    text: string;
    translation: string;
    reflection: string;
  };
  affirmation: string;
  reflectionPrompts: {
    challenge: string;
    proudMoment: string;
    gratitude: string;
    hope: string;
  };
}

export const SACRED_MILESTONES: MilestoneItem[] = [
  {
    id: '1-day',
    days: 1,
    symbol: '🌱',
    badgeName: 'Seed of Surrender',
    title: '1 Day: The First Sacred Step',
    theme: 'Radical Honesty & Surrender',
    description: 'Twenty-four hours of choosing honesty over avoidance. The greatest redwood begins as a quiet seed in the dark earth.',
    eBookPrayer: {
      title: 'Prayer of the First Dawn',
      text: "Lord, I survived my first 24 hours. My hands may shake, but my soul is held. Thank You for breaking the cycle of yesterday and granting me the courage to say, 'I need You.' Be my firm footing for the next hour.",
      chapterRef: 'Chapter 1: The Surrender of Self'
    },
    bibleVerse: {
      reference: 'Lamentations 3:22-23',
      text: 'The steadfast love of the Lord never ceases; His mercies never come to an end; they are new every morning; great is Your faithfulness.',
      translation: 'ESV',
      reflection: 'Every morning brings fresh, unspent grace. You are starting with a clean slate in the eyes of God.'
    },
    affirmation: 'I am worthy of a fresh beginning, and today I choose life in God’s grace.',
    reflectionPrompts: {
      challenge: 'What fear tried to convince you that Day 1 was impossible?',
      proudMoment: 'What courageous action did you take to protect these 24 hours?',
      gratitude: 'Name one person, place, or prayer that provided peace today.',
      hope: 'What do you hope tomorrow morning will feel like when you wake up sober?'
    }
  },
  {
    id: '7-days',
    days: 7,
    symbol: '🌿',
    badgeName: 'Sprout of Sabbath',
    title: '7 Days: One Week in Grace',
    theme: 'Physical & Spiritual Clearing',
    description: 'One full cycle of creation. You have weathered the initial physical fog and proven that urges crest and subside.',
    eBookPrayer: {
      title: 'Prayer for Weekly Restoration',
      text: "Heavenly Father, seven days have passed without the anesthetic of active addiction. My senses are waking up, and with them come emotions I used to silence. Hold me steady when the noise is loud. You are my Sabbath rest.",
      chapterRef: 'Chapter 3: Turning Over the Wheel'
    },
    bibleVerse: {
      reference: 'Psalm 23:3',
      text: 'He restores my soul. He leads me in paths of righteousness for His name’s sake.',
      translation: 'ESV',
      reflection: 'God is actively restoring what the locusts of addiction consumed. Restoration is a daily walk, not a sprint.'
    },
    affirmation: 'My nervous system is calming, and my soul is safe in Christ’s care.',
    reflectionPrompts: {
      challenge: 'Which evening was the most challenging this past week?',
      proudMoment: 'When did you use a healthy tool instead of reaching for an old escape?',
      gratitude: 'What simple pleasure (food, sleep, sunshine) did you rediscover?',
      hope: 'What truth will anchor you through the coming week?'
    }
  },
  {
    id: '30-days',
    days: 30,
    symbol: '🌳',
    badgeName: 'Deepening Roots',
    title: '30 Days: A Month in Light',
    theme: 'Awakening & Emotional Clarity',
    description: 'One complete month of spiritual rewiring. The emotional fog is lifting and new neuro-spiritual pathways are solidifying.',
    eBookPrayer: {
      title: 'Prayer of the One-Month Threshold',
      text: "Dear Heavenly Father, today I celebrate one month of choosing life, choosing You, and choosing the hard, holy work of healing. Thank You for being the anchor that held when cravings roared. Every breath of this month has been a gift of Your mercy. Keep me humble, keep me close, and teach me to live one day at a time in Your unending grace. In Jesus' name, Amen.",
      chapterRef: 'Chapter 9: The Daily Maintenance of Grace'
    },
    bibleVerse: {
      reference: 'Philippians 1:6',
      text: 'Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.',
      translation: 'NIV',
      reflection: 'God does not abandon projects halfway through. He who laid the cornerstone of your sobriety is finishing the sanctuary.'
    },
    affirmation: 'I am deeply rooted in divine love, and I am stepping into the fullness of who God created me to be.',
    reflectionPrompts: {
      challenge: 'What emotional storm did you face without numbing yourself?',
      proudMoment: 'How has your self-respect shifted over these 30 days?',
      gratitude: 'Who in your fellowship or life has walked alongside you with unconditional support?',
      hope: 'What is one promise of redemption you are actively seeing take root?'
    }
  },
  {
    id: '60-days',
    days: 60,
    symbol: '💫',
    badgeName: 'Radiant Renewal',
    title: '60 Days: Steadfast Renewal',
    theme: 'Habit Transformation & Healing',
    description: 'Two full months of clarity. Old habits are withering from disuse, while spiritual disciplines become joyful second nature.',
    eBookPrayer: {
      title: 'Prayer for Continued Vigilance',
      text: "Lord God, 60 days have passed. Guard me against the quiet whisper of overconfidence. Remind me that sobriety is maintained on a daily basis through spiritual fitness. Fill my idle moments with Your peace and purpose.",
      chapterRef: 'Chapter 10: Continual Inventory'
    },
    bibleVerse: {
      reference: 'Romans 12:2',
      text: 'Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God.',
      translation: 'ESV',
      reflection: 'Transformation is not merely avoiding the bad; it is cultivating a renewed mind that recognizes God’s good and perfect will.'
    },
    affirmation: 'My mind is renewed daily by truth, and I stand vigilant in humble gratitude.',
    reflectionPrompts: {
      challenge: 'How have you handled feelings of restlessness or boredom as the novelty fades?',
      proudMoment: 'What trigger did you recognize early and successfully deflect?',
      gratitude: 'What spiritual breakthrough or prayer brought peace this month?',
      hope: 'What part of your character is God refining right now?'
    }
  },
  {
    id: '90-days',
    days: 90,
    symbol: '⭐',
    badgeName: 'Morning Star',
    title: '90 Days: Season of Transformation',
    theme: 'Spiritual Awakening & Brotherhood',
    description: 'A traditional recovery cornerstone. Brain chemistry is significantly normalized and your spiritual compass is pointing true north.',
    eBookPrayer: {
      title: 'Prayer of the Spiritual Awakening',
      text: "Lord of Redemption, a whole season has turned while I walked in Your light. Where shame once dwelt, You have poured out mercy. Where deceit ruled, You have planted truth. Teach me now to reach out a hand to another who is shivering in the shadows.",
      chapterRef: 'Chapter 12: Carrying the Message'
    },
    bibleVerse: {
      reference: '2 Corinthians 5:17',
      text: 'Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.',
      translation: 'ESV',
      reflection: 'You are not merely an improved version of active addiction; in Christ, you are an entirely new creation with a fresh destiny.'
    },
    affirmation: 'The old lies have lost their power over me. I walk in freedom as a new creation.',
    reflectionPrompts: {
      challenge: 'What relationship or past regret requires continued grace and patience?',
      proudMoment: 'How have your physical health, energy, and sleep transformed over 90 days?',
      gratitude: 'What is the greatest gift of clarity you have received so far?',
      hope: 'How can your story bring hope to someone beginning their Day 1?'
    }
  },
  {
    id: '180-days',
    days: 180,
    symbol: '🌟',
    badgeName: 'Beacon of Light',
    title: '180 Days: Half a Year of Grace',
    theme: 'Steadfast Fruitfulness',
    description: 'Six months of waking up clean and purposeful. You have lived through holidays, seasons, and mood swings without returning to bondage.',
    eBookPrayer: {
      title: 'Prayer of the Half-Year Milestone',
      text: "Abba Father, six months ago I could not imagine living a single week without escape. Today, You have given me half a year of clarity. Thank You for every prayer whispered in the dark, every meeting attended, and every tear wiped away. Keep my foundation firm on Christ the solid rock.",
      chapterRef: 'Chapter 7: Humbly Asking for Freedom'
    },
    bibleVerse: {
      reference: 'Galatians 6:9',
      text: 'And let us not grow weary of doing good, for in due season we will reap, if we do not give up.',
      translation: 'ESV',
      reflection: 'The steady discipline of sobriety reaps an abundant harvest of self-respect, restored trust, and divine fellowship.'
    },
    affirmation: 'I do not grow weary in grace. I am bearing good fruit that endures.',
    reflectionPrompts: {
      challenge: 'What major life event or stressor did you navigate without escaping?',
      proudMoment: 'What amends or honest conversation brought deep relief?',
      gratitude: 'How has your communion with God deepened over these six months?',
      hope: 'What dreams for your life and service are beginning to re-emerge?'
    }
  },
  {
    id: '365-days',
    days: 365,
    symbol: '👑',
    badgeName: 'Crown of Perseverance',
    title: '1 Year: A Year of Jubilee',
    theme: 'Full Solar Cycle in God’s Care',
    description: 'Three hundred and sixty-five sunrises of living in the light. Every season, birthday, holiday, and anniversary has been reclaimed for redemption.',
    eBookPrayer: {
      title: 'The One-Year Jubilee Prayer',
      text: "Sovereign Lord, today marks 365 days of miracles. A full year of living awake, present, and free. You took the ashes of my broken life and made something sacred. With every fiber of my being, I thank You. Crown my life with Your lovingkindness and let my recovery always point back to Your glory.",
      chapterRef: 'Chapter 11: Conscious Contact with God'
    },
    bibleVerse: {
      reference: 'Psalm 103:2-4',
      text: 'Bless the Lord, O my soul, and forget not all His benefits, who forgives all your iniquity, who heals all your diseases, who redeems your life from the pit, who crowns you with steadfast love and mercy.',
      translation: 'ESV',
      reflection: 'Your life was redeemed directly from the pit. You wear God’s steadfast love as an unshakeable crown.'
    },
    affirmation: 'My life is a living testimony that God redeems what was once broken. I am free.',
    reflectionPrompts: {
      challenge: 'Looking back on the entire year, what was the darkest moment and how did God intervene?',
      proudMoment: 'What is the most profound way your heart has softened toward yourself and others?',
      gratitude: 'List five specific blessings that exist today solely because you chose sobriety.',
      hope: 'What is God calling you to build and nurture in Year Two?'
    }
  },
  {
    id: '730-days',
    days: 730,
    symbol: '💎',
    badgeName: 'Diamond Fellowship',
    title: '2 Years: Unshakeable Heritage',
    theme: 'Maturity, Mentorship & Stability',
    description: 'Seven hundred and thirty days of steadfast endurance. Under the heat and pressure of life, God has forged your character into a diamond of grace.',
    eBookPrayer: {
      title: 'Prayer for Mentorship & Humility',
      text: "Heavenly Father, two years in Your grace have taught me that recovery is not an event, but a lifelong posture of surrender. Use my scars to heal others. Keep me a willing servant in Your kingdom, gentle in spirit and steadfast in truth.",
      chapterRef: 'Chapter 12: Awakening and Service'
    },
    bibleVerse: {
      reference: 'Isaiah 61:3',
      text: 'To give them beauty for ashes, the oil of joy for mourning, the garment of praise for the spirit of heaviness; that they may be called oaks of righteousness, the planting of the Lord, that He may be glorified.',
      translation: 'NKJV',
      reflection: 'You are an oak of righteousness planted beside living waters. Your life displays the splendor of God.'
    },
    affirmation: 'I am an oak of righteousness, anchored in Christ and offering shade to those who still hurt.',
    reflectionPrompts: {
      challenge: 'How do you keep your recovery fresh and prevent spiritual complacency?',
      proudMoment: 'How have you mentored or supported another soul on their journey?',
      gratitude: 'What generational patterns of addiction have been broken in your family?',
      hope: 'What legacy of faith and integrity are you creating?'
    }
  },
  {
    id: '1825-days',
    days: 1825,
    symbol: '🏆',
    badgeName: 'Trophy of Sovereign Grace',
    title: '5 Years: Sovereign Freedom',
    theme: 'Lifelong Sanctuary of Hope',
    description: 'Half a decade of walking in the sunlight of the Spirit. You have proved that a life once defined by addiction can become a beacon of generational healing.',
    eBookPrayer: {
      title: 'Prayer of the Five-Year Golden Milestone',
      text: "Lord Almighty, five years ago I could not envision tomorrow. Today I stand as proof that no pit is deeper than Your grace. May every breath I take continue to be an offering of thanksgiving. To You alone be all the glory, honor, and praise forever. Amen.",
      chapterRef: 'Epilogue: Walking Forever in Grace'
    },
    bibleVerse: {
      reference: '2 Timothy 4:7',
      text: 'I have fought the good fight, I have finished the race, I have kept the faith.',
      translation: 'ESV',
      reflection: 'You are fighting the good fight daily with honor. Your steadfast faith inspires a cloud of witnesses.'
    },
    affirmation: 'I walk in sovereign freedom, forever grateful that God’s grace is greater than my past.',
    reflectionPrompts: {
      challenge: 'What wisdom would you impart to your Day-1 self if you could speak to them today?',
      proudMoment: 'How has your relationship with God and your loved ones been permanently redeemed?',
      gratitude: 'Who are the spiritual giants who helped carry you when you had no strength?',
      hope: 'How will you continue living out this testimony for the rest of your days?'
    }
  }
];
