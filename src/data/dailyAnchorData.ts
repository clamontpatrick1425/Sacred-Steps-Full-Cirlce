export interface DailyContent {
  id: string;
  date: string; // YYYY-MM-DD format
  prayer: {
    title: string;
    content: string;
    source: string;
  };
  verse: {
    reference: string;
    text: string;
    translation: string;
  };
  affirmation: {
    text: string;
    category: string;
  };
}

// Curated 7-day cyclical daily anchor deck + dynamic daily getter
export const DAILY_ANCHOR_LIBRARY: DailyContent[] = [
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
  },
  {
    id: 'anchor-day-1',
    date: '2026-09-28',
    prayer: {
      title: 'A Shield Against the Lie of Shame',
      content: 'Lord Jesus, when old accusations rise to tell me I am defined by past mistakes, be my loud defender. Cloak my heart with Your righteousness. Silence the voice of the adversary with the gentle whisper of Your cross. I step into this morning forgiven, cleansed, and deeply cherished by the Creator of the universe.',
      source: 'Prayers of Redemption'
    },
    verse: {
      reference: 'Romans 8:1-2',
      text: 'There is therefore now no condemnation for those who are in Christ Jesus. For the law of the Spirit of life has set you free in Christ Jesus from the law of sin and death.',
      translation: 'ESV'
    },
    affirmation: {
      text: 'I am completely free from condemnation; Christ has declared my identity sacred and secure.',
      category: 'Freedom from Shame'
    }
  },
  {
    id: 'anchor-day-2',
    date: '2026-09-29',
    prayer: {
      title: 'Strength in the Hour of Weakness',
      content: 'Faithful God, when the urge presses in and my resolve feels fragile, remind me that my weakness is where Your power finds its greatest glory. I do not have to conquer a lifetime today; I only need to trust You for this single breath. Provide the way out You promised, and keep my eyes fixed on Your face.',
      source: 'Covenant Recovery Prayers'
    },
    verse: {
      reference: '2 Corinthians 12:9',
      text: 'But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness." Therefore I will boast all the more gladly of my weaknesses, so that the power of Christ may rest upon me.',
      translation: 'NIV'
    },
    affirmation: {
      text: 'I do not rely on fragile willpower; I am anchored in Christ’s all-sufficient strength.',
      category: 'Perseverance'
    }
  },
  {
    id: 'anchor-day-3',
    date: '2026-09-30',
    prayer: {
      title: 'Peace in the Overwhelming Storm',
      content: 'Prince of Peace, calm the turbulent waters within my mind. When catastrophic thoughts whisper fear, breathe Your supernatural calm over my spirit. You hold tomorrow, and You hold me. I choose to lay down my anxious striving and rest under the shadow of Your wings.',
      source: 'Sanctuary Contemplations'
    },
    verse: {
      reference: 'Philippians 4:6-7',
      text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.',
      translation: 'ESV'
    },
    affirmation: {
      text: 'I trade my panic for God’s supernatural peace that guards my heart and mind.',
      category: 'Peace & Serenity'
    }
  },
  {
    id: 'anchor-day-4',
    date: '2026-10-01',
    prayer: {
      title: 'The Courage to Walk in Truth',
      content: 'Lord, give me eyes to see through every illusion of temptation. Give me courage to reach out when I feel like hiding, to speak honesty when deceit feels safer, and to remember that the light always overcomes the darkness. Thank You for walking ahead of me onto this day’s path.',
      source: 'Steps of Honesty'
    },
    verse: {
      reference: 'Joshua 1:9',
      text: 'Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.',
      translation: 'ESV'
    },
    affirmation: {
      text: 'I am courageous and steadfast because the Living God walks beside me in every step.',
      category: 'Courage'
    }
  },
  {
    id: 'anchor-day-5',
    date: '2026-10-02',
    prayer: {
      title: 'Surrender of Resentment and Bitterness',
      content: 'Gracious Father, soften any tight knots of grievance in my heart. Free me from the heavy poison of replaying past offenses. As You have poured boundless forgiveness onto my brokenness, give me the supernatural grace to release others into Your just and compassionate hands today.',
      source: 'Grace & Reconciliation'
    },
    verse: {
      reference: 'Colossians 3:12-13',
      text: 'Put on then, as God’s chosen ones, holy and beloved, compassionate hearts, kindness, humility, meekness, and patience, bearing with one another and, if one has a complaint against another, forgiving each other; as the Lord has forgiven you, so you also must forgive.',
      translation: 'ESV'
    },
    affirmation: {
      text: 'I release bitterness today; my heart is too sacred a vessel to hold grievances.',
      category: 'Release & Forgiveness'
    }
  },
  {
    id: 'anchor-day-6',
    date: '2026-10-03',
    prayer: {
      title: 'A Song of Grateful Restoration',
      content: 'O God of Restoration, thank You for another day of sobriety, clarity, and grace. Every sunrise is a testament to Your healing touch. Open my lips to praise You, open my eyes to notice beauty, and use my life as a gentle lighthouse of hope for another soul seeking freedom.',
      source: 'Sabbath Grace Reflections'
    },
    verse: {
      reference: 'Psalm 103:2-4',
      text: 'Bless the Lord, O my soul, and forget not all his benefits, who forgives all your iniquity, who heals all your diseases, who redeems your life from the pit, who crowns you with steadfast love and mercy.',
      translation: 'ESV'
    },
    affirmation: {
      text: 'My life has been redeemed from the pit; I am crowned with steadfast love and mercy.',
      category: 'Gratitude & Restoration'
    }
  }
];

/**
 * Returns today's anchor content based on calendar date.
 * Automatically refreshes at midnight by computing the day of the year / date string.
 */
export function getTodaysDailyAnchor(): DailyContent {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // Deterministic daily index based on day of epoch so it rotates every midnight
  const epochDays = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  const index = Math.abs(epochDays) % DAILY_ANCHOR_LIBRARY.length;
  
  const base = DAILY_ANCHOR_LIBRARY[index];
  return {
    ...base,
    date: todayStr,
  };
}
