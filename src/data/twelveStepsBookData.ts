/**
 * 12-Step Data based directly on:
 * "Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery"
 * by C. Lamont Patrick (Kya Daisy Publishing, 2025)
 */

export interface StepPrompt {
  id: string;
  question: string;
  bookContext: string;
  placeholder: string;
}

export interface InventoryItem {
  id: string;
  category: 'asset' | 'defect' | 'fear' | 'resentment';
  title: string;
  details: string;
}

export interface AmendsItem {
  id: string;
  person: string;
  harmDone: string;
  amendsPlan: string;
  status: 'willing' | 'in_progress' | 'made';
}

export interface BookStepData {
  stepNumber: number;
  traditionalTitle: string;
  bookSubtitle: string;
  theme: string;
  chapterOverview: string;
  prayer: {
    title: string;
    text: string;
    warmGuidance: string;
  };
  bibleVerse: {
    reference: string;
    text: string;
    translation: string;
    reflection: string;
  };
  affirmation: {
    text: string;
    context: string;
  };
  aspirationalQuote: {
    quote: string;
    author: string;
    commentary: string;
  };
  testimonialSnippet?: {
    person: string;
    story: string;
  };
  reflectionPrompts: StepPrompt[];
  hasInventoryTool?: boolean;
  hasAmendsTool?: boolean;
}

export const TWELVE_STEPS_BOOK_DATA: BookStepData[] = [
  {
    stepNumber: 1,
    traditionalTitle: "We admitted we were powerless over our addiction — that our lives had become unmanageable.",
    bookSubtitle: "Surrendering to Empowerment & Radical Honesty",
    theme: "Honesty & Surrender",
    chapterOverview: "Admitting powerlessness in Step One is presented as a courageous act of self-honesty, not defeat. In releasing the illusion of control, we make room for change and healing, and open the door to a higher power.",
    prayer: {
      title: "Prayer of Holy Surrender",
      text: "Dear Heavenly Father, You’re the firm hand that pulls me up when I’m scared, the soft voice that bids me follow hope. Please let me release my fears and know your unlimited love. Please guide me back to the path, help me find your presence, and let me know I am part of something bigger. As I acknowledge my impotence, I believe in your good grace and return my life to you. May I be strong in my weakness and a joyful space creator. Thank you for traveling with me, Lord. In Jesus' name, I pray. Amen!",
      warmGuidance: "Close your eyes and wrap this prayer around you like a warm blanket. Just leaning into divine support and finding peace through surrender is the cornerstone of this step."
    },
    bibleVerse: {
      reference: "Matthew 11:28",
      text: "Come to me, all you who are weary and burdened, and I will give you rest.",
      translation: "NIV",
      reflection: "Jesus invites us to lay down our struggles—addiction, shame, exhaustion—and find rest in His love. For someone in recovery, it’s a reminder that you don't have to carry the weight alone."
    },
    affirmation: {
      text: "I am worthy of healing and love, and with each mindful step, I grow closer to my true self and the divine light within me.",
      context: "Plant this seed of hope in your heart every morning. You are declaring that powerlessness over addiction is the beginning of God's empowerment."
    },
    aspirationalQuote: {
      quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela",
      commentary: "Every step forward, even after a stumble, is a victory worth celebrating. It is not about being perfect, but about getting back up with courage and grace."
    },
    testimonialSnippet: {
      person: "Mark's Journey (p. 26)",
      story: "Mark found that when he stopped fighting on his own and obsessively read scripture about hope and redemption, those verses became a lifeline through the storms."
    },
    reflectionPrompts: [
      {
        id: "s1-q1",
        question: "In what ways has attempting to control addiction through sheer willpower caused exhaustion?",
        bookContext: "C. Lamont Patrick emphasizes that admitting powerlessness is an admission that says 'yes' to our shared humanity.",
        placeholder: "Write honestly about where your self-reliance broke down..."
      },
      {
        id: "s1-q2",
        question: "How does it feel to view surrender as an act of courage and empowerment rather than failure?",
        bookContext: "In the book, surrender is the threshold where divine light penetrates the darkness of despair.",
        placeholder: "Describe how surrendering control brings relief..."
      }
    ]
  },
  {
    stepNumber: 2,
    traditionalTitle: "Came to believe that a Power greater than ourselves could restore us to sanity.",
    bookSubtitle: "A Beacon of Hope and Spiritual Awakening",
    theme: "Hope & Awakening",
    chapterOverview: "Recognizing that we are not alone in this battle is a game-changer. Step Two introduces a Higher Power as a message of encouragement, allowing the possibility of healing to enter our lives.",
    prayer: {
      title: "Prayer for Hope & Believing",
      text: "Dear Heavenly Father, You are the light that cuts through the fog of my doubts. Today I open my spirit to believe that You are greater than the urges and sorrow that have weighed me down. Restore my clarity. Soften my mind to receive Your wisdom, and help me feel that I am safe in Your hands. Thank You for never giving up on me. In Jesus' name, Amen.",
      warmGuidance: "This prayer is an invitation to let hope breathe again. You don't have to understand everything today; just open a small window of faith."
    },
    bibleVerse: {
      reference: "Hebrews 11:1",
      text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
      translation: "NIV",
      reflection: "Even when recovery feels uncertain, faith assures us that God is actively restoring our fractured pieces into a life of purpose."
    },
    affirmation: {
      text: "I open my heart to divine restoration; peace and sanity are returning to my mind.",
      context: "Acknowledge that sanity is being rebuilt day by day through connection with God."
    },
    aspirationalQuote: {
      quote: "Faith is taking the first step even when you don’t see the whole staircase.",
      author: "Martin Luther King Jr.",
      commentary: "Dr. King reminds us that we do not need all the answers to begin; we only need the courage to trust the Next Step."
    },
    reflectionPrompts: [
      {
        id: "s2-q1",
        question: "What does the 'God of your understanding' look like to you when you need comfort most?",
        bookContext: "The book explains that understanding a Higher Power is personal, calling us to explore divine love without religious rigidity.",
        placeholder: "Reflect on how God meets you in quiet moments..."
      },
      {
        id: "s2-q2",
        question: "What 'insanity' or distorted thoughts from addiction are you asking God to restore to clarity?",
        bookContext: "Restoration is about bringing us home to our true selves and emotional balance.",
        placeholder: "Name the anxious loops, lies, or habits you desire sanity from..."
      }
    ]
  },
  {
    stepNumber: 3,
    traditionalTitle: "Made a decision to turn our will and our lives over to the care of God as we understood Him.",
    bookSubtitle: "Surrender, Trust, and Daily Willingness",
    theme: "Trust & Willingness",
    chapterOverview: "Step Three asks us to let go and trust—a proposition that can seem simultaneously terrifying and freeing. Yielding control is a leap of faith that unlocks transformation within.",
    prayer: {
      title: "Prayer of Surrender and Trust",
      text: "Dear Heavenly Father, You are the one who steadies me when I am afraid, who whispers to me gently and calls me toward hope. Today, I beg for the courage to set aside my fears and place my faith in your endless love. Please help me on this road to recovery, to sense your presence, and to realize that I am part of something bigger. Grant peace to my heart, as I make this admission, believe in your grace, and hand my life over to you. In Jesus' name, I pray. Amen!",
      warmGuidance: "Like sitting down for a warm cup of coffee with a faithful friend, speak this prayer knowing that handing over the wheel brings true safety."
    },
    bibleVerse: {
      reference: "Proverbs 3:5-6",
      text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      translation: "NIV",
      reflection: "This verse is a roadmap for Step Three! When we relinquish our little ego, God aligns our footsteps toward freedom."
    },
    affirmation: {
      text: "I surrender to divine love and feel its tender support guiding me each step I take on my journey of healing and peace.",
      context: "A bright burst of sunshine to repeat during moments of doubt or grasping for control."
    },
    aspirationalQuote: {
      quote: "You don’t have to see the whole staircase, just take the first step.",
      author: "Martin Luther King Jr.",
      commentary: "Nowhere in Step work are we asked to be armed with all the answers, but instead to find the courage to hand our lives to God."
    },
    reflectionPrompts: [
      {
        id: "s3-q1",
        question: "What specific area of your life (relationships, finances, cravings) is hardest to hand over to God?",
        bookContext: "Turning our will over is an everyday practice of releasing the steering wheel.",
        placeholder: "Identify what you are gripping tightly..."
      },
      {
        id: "s3-q2",
        question: "What daily ceremony or quiet moment can you commit to each morning to renew this surrender?",
        bookContext: "The author speaks of morning affirmations, quiet prayer, and mindful breathing as anchors.",
        placeholder: "Describe your personal morning surrender ritual..."
      }
    ]
  },
  {
    stepNumber: 4,
    traditionalTitle: "Made a searching and fearless moral inventory of ourselves.",
    bookSubtitle: "Mindful Self-Discovery: Balancing Assets & Shortcomings",
    theme: "Bravery & Balanced Inventory",
    chapterOverview: "Taking a moral inventory is not a self-condemnation exercise; it is an honest appraisal that balances shortcomings with recognized assets, dreams, and acts of bravery so that shame is jackhammered into submission.",
    prayer: {
      title: "Prayer for Honest Self-Examination",
      text: "Dear Heavenly Father, The tender guide who walks me through the shadows and up into your light. I am here with an open heart today, seeking the courage to meet my truths, the power to share my stories, and the grace to release what is holding me back. Fill me with Your peace and mercy. Open my eyes to my true value and to the healing path You’ve laid out. Thank You for Your unfailing love. In Jesus' name, Amen!",
      warmGuidance: "Breathe deeply before writing. You are safe in God's love. Nothing you uncover can separate you from His mercy."
    },
    bibleVerse: {
      reference: "2 Corinthians 5:17",
      text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
      translation: "NIV",
      reflection: "This verse is a promise that transformation is real! An inventory proves that who you were in addiction is not who you are in grace."
    },
    affirmation: {
      text: "I am fearlessly honest with myself, cutting loose from anything no longer serving me, and surrendering to divine love.",
      context: "Whisper this affirmation to give you courage as you write your assets and areas needing growth."
    },
    aspirationalQuote: {
      quote: "We’re not going to change anything until we own it. Condemnation does not set free – it imprisons.",
      author: "Carl Gustav Jung",
      commentary: "Jung's words are a gentle push toward accepting our truth rather than condemning it. Candor liberates the spirit."
    },
    hasInventoryTool: true,
    reflectionPrompts: [
      {
        id: "s4-q1",
        question: "List 3 strengths, gifts, or moments of courage that addiction tried to hide.",
        bookContext: "The book insists our inventory MUST acknowledge our assets and dreams to defeat toxic shame.",
        placeholder: "My strengths, talents, and acts of resilience are..."
      },
      {
        id: "s4-q2",
        question: "What resentments, fears, or character patterns surfaced during active struggle?",
        bookContext: "Notice these without harsh self-judgment, treating them as wounds ready for God's healing light.",
        placeholder: "I observe these patterns and release them..."
      }
    ]
  },
  {
    stepNumber: 5,
    traditionalTitle: "Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.",
    bookSubtitle: "Stepping Out of Isolation into Community Light",
    theme: "Confession & Vulnerability",
    chapterOverview: "Step Five is an invitation to disclose our secrets. When we articulate our experience to a trusted person, we step out of isolation into the sunlight of community, and our story becomes woven into a fabric of compassion.",
    prayer: {
      title: "Prayer for Vulnerability & Light",
      text: "Dear Heavenly Father, Break the chains of secrecy that have kept me hiding in shame. Give me a spirit of transparency and guide me to a wise, compassionate person who can listen with grace. As I speak my truth, let Your light flood every dark corner of my memory. Thank You that confession brings liberation and true belonging. In Jesus' name, Amen.",
      warmGuidance: "Speaking the truth unburdens the soul. Vulnerability creates a holy space where empathy and redemption thrive."
    },
    bibleVerse: {
      reference: "James 5:16",
      text: "Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective.",
      translation: "NIV",
      reflection: "Healing is tied to shared vulnerability. In a safe spiritual fellowship, mutual confession dissolves guilt and opens the flow of grace."
    },
    affirmation: {
      text: "I shed the heaviness of secrets; stepping into the light of community sets my spirit free.",
      context: "Repeat this when preparing to share your inventory with a sponsor, spiritual director, or trusted counselor."
    },
    aspirationalQuote: {
      quote: "The wound is the place where the Light enters you.",
      author: "Rumi",
      commentary: "Your past pain is not just a liability; it is the sacred portal through which divine light and profound empathy enter."
    },
    reflectionPrompts: [
      {
        id: "s5-q1",
        question: "Who is the trusted, spiritually grounded person you feel safe sharing your story with?",
        bookContext: "The book describes this disclosure as a sacred reciprocity that builds deep bonds.",
        placeholder: "Name your mentor, sponsor, or spiritual companion..."
      },
      {
        id: "s5-q2",
        question: "What secret or fear are you most relieved to unburden before God today?",
        bookContext: "Confession is the antidote to the suffocating fog of isolation.",
        placeholder: "Pour out the truth you are ready to let go of..."
      }
    ]
  },
  {
    stepNumber: 6,
    traditionalTitle: "Were entirely ready to have God remove all these defects of character.",
    bookSubtitle: "Dropping the Negatives & Opening to Divine Grace",
    theme: "Readiness & Humility",
    chapterOverview: "Step Six asks us to surrender our character defects, old defense mechanisms, and habits that no longer work. We identify our imperfections without making them our permanent identity.",
    prayer: {
      title: "Prayer for Readiness to Let Go",
      text: "Dear Heavenly Father, You know the old coping habits and defense walls I built to survive. Today, I become willing to let You dismantle them. Replace my pride with humility, my impatience with peace, and my fear with trust. I open my hands and heart to Your transformative grace. In Jesus' name, Amen.",
      warmGuidance: "Letting go is a form of quiet meditation. As you drop your baggage, you discover gifts that were long buried."
    },
    bibleVerse: {
      reference: "Psalm 51:10",
      text: "Create in me a pure heart, O God, and renew a steadfast spirit within me.",
      translation: "NIV",
      reflection: "God does not merely patch up the old; He creates a clean, renewed spirit rooted in steadfast love."
    },
    affirmation: {
      text: "I am ready for divine grace to transform my shortcomings into seeds of spiritual strength.",
      context: "Affirm your willingness to be reshaped by God's loving hands."
    },
    aspirationalQuote: {
      quote: "The best way out is always through.",
      author: "Robert Frost",
      commentary: "When you face your character defects directly, with diligence and faith, you find true transformation."
    },
    reflectionPrompts: [
      {
        id: "s6-q1",
        question: "Which old survival habits (defensiveness, dishonesty, avoidance) are you truly ready to release?",
        bookContext: "Discomfort is a natural part of outgrowing the old self.",
        placeholder: "Identify the defect you are ready to lay at God's altar..."
      },
      {
        id: "s6-q2",
        question: "How can observing cravings with mindfulness keep them from defining who you are?",
        bookContext: "Mindfulness enables us to view flaws without shame, opening space for gentle growth.",
        placeholder: "Reflect on observing an urge without judgment..."
      }
    ]
  },
  {
    stepNumber: 7,
    traditionalTitle: "Humbly asked Him to remove our shortcomings.",
    bookSubtitle: "Humility and the Healing Power of Service",
    theme: "Humility & Service",
    chapterOverview: "Humility is not weakness; it is an honest acknowledgment of our limitations that makes room for divine wholeness. As humility deepens, service work shifts our focus from self-absorption to blessing others.",
    prayer: {
      title: "Prayer for Holy Humility",
      text: "Dear Heavenly Father, You are the grace that makes me humble, the love that makes me gentle, the strength that makes me stand, and the goodness that makes me want to serve. Today, I pray for your wisdom to take humility and courage to make amends and walk in integrity. Join me in my healing as I pour into others, address past hurts, and get in step with your divine plan. In Jesus' name, Amen!",
      warmGuidance: "This prayer celebrates the life-changing power of humility, service, and integrity."
    },
    bibleVerse: {
      reference: "Micah 6:8",
      text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
      translation: "NIV",
      reflection: "A spiritual lighthouse! Step Seven brings us into alignment with God’s three great desires: justice, mercy, and humility."
    },
    affirmation: {
      text: "I lead with humility, I serve with love, I live with integrity, trusting that God's loving guidance restores all I am meant to be.",
      context: "Say it with heart—it is an injection of courage to keep growing on this holy journey."
    },
    aspirationalQuote: {
      quote: "Our deepest fear is not that we are inadequate. Our deepest fear is that we are powerful beyond measure.",
      author: "Marianne Williamson",
      commentary: "In recovery, stepping into humility allows the creative power of the Holy Spirit to overflow into service."
    },
    reflectionPrompts: [
      {
        id: "s7-q1",
        question: "How does shifting focus toward helping someone else quiet your own anxiety or craving?",
        bookContext: "Service takes the focus off our selfish wounds and brings purpose to our recovery.",
        placeholder: "Describe an act of service or encouragement you can offer today..."
      },
      {
        id: "s7-q2",
        question: "In what way is true humility an invitation to authentic connection with others?",
        bookContext: "Shedding pride makes room for empathy and mutual understanding.",
        placeholder: "Reflect on standing alongside fellow travelers with honesty..."
      }
    ]
  },
  {
    stepNumber: 8,
    traditionalTitle: "Made a list of all persons we had harmed, and became willing to make amends to them all.",
    bookSubtitle: "Making Amends, Living with Integrity, and Healing Relationships",
    theme: "Reconciliation & Willingness",
    chapterOverview: "Restitution is not about 'checking off apologies.' It is a tender, divine act of love that seeks genuine repair. We acknowledge the ripple effects of past addiction and prepare our hearts for reconciliation.",
    prayer: {
      title: "Prayer for a Reconciling Heart",
      text: "Dear Heavenly Father, Soften my heart toward every relationship fractured by my past. Remove my fear of rejection and defensiveness. Grant me the willingness to see the hurt I have caused through their eyes. Give me wisdom, timing, and genuine love as I prepare to make amends. Heal both my spirit and theirs. In Jesus' name, Amen.",
      warmGuidance: "Making a list is an act of love. You are not executing the amends yet; you are cultivating the willingness to bring peace."
    },
    bibleVerse: {
      reference: "Colossians 3:12-13",
      text: "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
      translation: "NIV",
      reflection: "Reconciliation flows from the boundless forgiveness we have already received from God."
    },
    affirmation: {
      text: "I am willing to make amends and bring peace; God is healing the relationships of my past.",
      context: "Speak this to steady your heart against anxiety when contemplating past harms."
    },
    aspirationalQuote: {
      quote: "We are here not to see through each other, but to see each other through.",
      author: "Ella Wheeler Wilcox",
      commentary: "A tender reminder that we are in recovery to support, uplift, and heal one another."
    },
    hasAmendsTool: true,
    reflectionPrompts: [
      {
        id: "s8-q1",
        question: "Who are the key people whose trust was damaged during your struggle?",
        bookContext: "Approaching this step with humility turns amends into a spiritual gateway to freedom.",
        placeholder: "List names and the nature of the harm caused..."
      },
      {
        id: "s8-q2",
        question: "Is there any resentment holding you back from becoming willing to make amends?",
        bookContext: "The book teaches that holding onto grievances is as toxic as the substance itself.",
        placeholder: "Surrender any lingering bitterness to God..."
      }
    ]
  },
  {
    stepNumber: 9,
    traditionalTitle: "Made direct amends to such people wherever possible, except when to do so would injure them or others.",
    bookSubtitle: "Restitution, Restored Dignity, and Living with Integrity",
    theme: "Integrity & Restitution",
    chapterOverview: "Step Nine translates willingness into action. Making amends with wisdom and spiritual guidance ensures that our actions heal rather than reopen wounds. Living with integrity means doing what is right even when no one is watching.",
    prayer: {
      title: "Prayer for Courage in Restitution",
      text: "Dear Heavenly Father, Walk beside me as I seek to right the wrongs of my past. Give me clarity to speak with humility, listening without excuses or rationalizations. Where direct amends would cause harm, show me living amends through a life of honesty, love, and sobriety. Let Your peace govern every conversation. In Jesus' name, Amen.",
      warmGuidance: "Ground yourself in prayer before every amends conversation. Let your motive be their healing, not just relieving your guilt."
    },
    bibleVerse: {
      reference: "Luke 19:8",
      text: "Zacchaeus stood up and said to the Lord, 'Look, Lord! Here and now I give half of my possessions to the poor, and if I have cheated anybody out of anything, I will pay back four times the amount.'",
      translation: "NIV",
      reflection: "Zacchaeus' encounter with Jesus shows that true spiritual transformation immediately bears the fruit of authentic restitution."
    },
    affirmation: {
      text: "I walk in integrity, repairing what was broken and honoring God through changed actions.",
      context: "A declaration that your new life is evidenced by trustworthy, accountable behavior."
    },
    aspirationalQuote: {
      quote: "Integrity is what you do when no one is looking.",
      author: "C.S. Lewis",
      commentary: "Lewis hits the nail on the head: any honest step forward in character and restitution is a victory in recovery."
    },
    hasAmendsTool: true,
    reflectionPrompts: [
      {
        id: "s9-q1",
        question: "What amends can you make this week where the path is clear and safe for all involved?",
        bookContext: "Direct amends require preparation, prayer, and genuine respect for the other person's boundaries.",
        placeholder: "Describe the specific amends and your approach..."
      },
      {
        id: "s9-q2",
        question: "What does 'living amends' look like for loved ones who need time to see consistent change?",
        bookContext: "Living amends means our daily sobriety and dependable love become our ongoing testimony.",
        placeholder: "Write your commitment to daily consistency..."
      }
    ]
  },
  {
    stepNumber: 10,
    traditionalTitle: "Continued to take personal inventory and when we were wrong promptly admitted it.",
    bookSubtitle: "Nightly Mindful Reflection & Keeping Accounts Clean",
    theme: "Daily Mindfulness & Vigilance",
    chapterOverview: "Step Ten proposes a regular personal inventory that keeps our recovery simple and grounded. Each night, as we come to a stop, we expose ourselves to the transformative energy of reflection, observing thoughts without judgment.",
    prayer: {
      title: "Evening Inventory Prayer",
      text: "Dear Heavenly Father, As the shadows lengthen, I pause in Your presence to review my day. Where I stumbled in anger, fear, or self-will, forgive me and give me the grace to make it right promptly. Where You carried me in peace and kindness, I praise You. Keep my heart pure and uncluttered tonight. In Jesus' name, Amen.",
      warmGuidance: "Nightly reflection reorients us from temporary behavior back to our core spiritual values."
    },
    bibleVerse: {
      reference: "Psalm 139:23-24",
      text: "Search me, God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting.",
      translation: "NIV",
      reflection: "Inviting God to search our hearts removes fear from self-examination. His correction is always rooted in loving restoration."
    },
    affirmation: {
      text: "I grow through daily reflection, admitting missteps quickly and resting in evening grace.",
      context: "Whisper this before sleep to release any tension accumulated during the day."
    },
    aspirationalQuote: {
      quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
      author: "Thich Nhat Hanh",
      commentary: "Mindful presence helps us catch triggers early and live in harmony with our spiritual aspirations."
    },
    reflectionPrompts: [
      {
        id: "s10-q1",
        question: "Spot-check today: Was there any moment of dishonesty, resentment, or fear that needs prompt attention?",
        bookContext: "Prompt admission prevents small resentments from festering into dangerous relapse triggers.",
        placeholder: "Review your day with gentle honesty..."
      },
      {
        id: "s10-q2",
        question: "What moments of grace, sobriety, and kindness did you experience today?",
        bookContext: "The author reminds us to register our daily advancements with thanksgiving.",
        placeholder: "Record 3 blessings from today..."
      }
    ]
  },
  {
    stepNumber: 11,
    traditionalTitle: "Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.",
    bookSubtitle: "Deepening Conscious Contact Through Sacred Stillness",
    theme: "Contemplative Prayer & Meditation",
    chapterOverview: "Step Eleven is an invitation to deepen your spiritual life. Meditation provides a sacred space of silence in which we quiet our chattering minds, acting like a gentle observer to our thoughts, while prayer expresses our deep need for divine guidance.",
    prayer: {
      title: "Prayer for Conscious Contact",
      text: "Dear Heavenly Father, You are the rhythmic pulse of recovery, light that guides, and peace that steadies my soul. In this sacred silence, I quiet my mind and listen for Your gentle whisper. I do not ask for my own selfish desires, but only for the wisdom to know Your will and the strength to live it out today. Walk with me in every breath. In Jesus' name, Amen.",
      warmGuidance: "Wrap this prayer around you. Spend 5 minutes in focused breathing afterward, feeling God's presence in your lungs."
    },
    bibleVerse: {
      reference: "Colossians 4:2",
      text: "Devote yourselves to prayer, being watchful and thankful.",
      translation: "NIV",
      reflection: "A gentle call to cultivate prayerful watchfulness. Prayer and gratitude become the twin pillars of a resilient recovery."
    },
    affirmation: {
      text: "I am connected to divine wisdom in stillness, breathing in God's peace and breathing out all striving.",
      context: "Use during breathwork or morning meditation to center your spirit."
    },
    aspirationalQuote: {
      quote: "What you are looking for is looking for you.",
      author: "Rumi",
      commentary: "A gentle whisper of warmth: the divine wisdom and peace you long for are already drawing near to you."
    },
    reflectionPrompts: [
      {
        id: "s11-q1",
        question: "How does 5 to 10 minutes of silent breath meditation alter your nervous system and cravings?",
        bookContext: "Mindfulness and focused breathing manage stress and anchor the body as a temple of the Spirit.",
        placeholder: "Describe how silence and contemplative prayer affect you..."
      },
      {
        id: "s11-q2",
        question: "What is God whispering to your heart today about His purpose for your recovery?",
        bookContext: "Listening is the forgotten half of prayer.",
        placeholder: "Write down the impressions of peace or direction you receive..."
      }
    ]
  },
  {
    stepNumber: 12,
    traditionalTitle: "Having had a spiritual awakening as the result of these steps, we tried to carry this message to alcoholics, and to practice these principles in all our affairs.",
    bookSubtitle: "Carrying the Message: Awakening, Lighthouse, and Living Grace",
    theme: "Awakening & Service",
    chapterOverview: "Healing is not solely about ourselves. Step Twelve calls us to share our hope and hard-won wisdom with the one who still suffers, ensuring that the lamp lit for us is never extinguished. In giving, we receive the fullness of life.",
    prayer: {
      title: "The Step Twelve Dedication Prayer",
      text: "Dear Heavenly Father, You are the endless flame that lights my heart, the unconditional love that carries me through. Continue to watch over me as I recover each day, take inventory of my life, and grow closer to You as I share Your healing message. Fill my heart with courage, wrap me in Your love, and give me the beauty of Your story in my story. Make my life a beacon of hope for another weary soul. Thank You for never leaving me. In Jesus' name, Amen!",
      warmGuidance: "You have walked a sacred road from darkness into marvelous light. You are now equipped to be a conduit of hope."
    },
    bibleVerse: {
      reference: "Psalm 9:1",
      text: "I will give thanks to you, Lord, with all my heart; I will tell of all your wonderful deeds.",
      translation: "NIV",
      reflection: "A song of thanksgiving! Telling your story of redemption gives others permission to believe that freedom is possible."
    },
    affirmation: {
      text: "I am a vessel of divine light, sharing hope with others and living out these sacred principles in all my affairs.",
      context: "A final, triumphant declaration of your new identity in Christ."
    },
    aspirationalQuote: {
      quote: "The best way to find yourself is to lose yourself in the service of others.",
      author: "Mahatma Gandhi",
      commentary: "Service to others increases our spiritual consciousness and completes the sacred cycle of transformation."
    },
    testimonialSnippet: {
      person: "Sarah's Legacy (p. 26, 49)",
      story: "Sarah's 10-year battle transformed into a sacred ceremony of mindfulness and service. She discovered her purpose in life was to light the way for newcomers."
    },
    reflectionPrompts: [
      {
        id: "s12-q1",
        question: "How can your story of struggle and grace offer hope to someone who is currently trapped in despair?",
        bookContext: "The author writes that each story told and tear shed becomes a thread in the fabric of community hope.",
        placeholder: "What would you say to someone taking their very first step today?..."
      },
      {
        id: "s12-q2",
        question: "How will you practice these spiritual principles in everyday situations (family, work, conflicts)?",
        bookContext: "Recovery is not an endpoint; it is a lifelong dance of faith, integrity, and love.",
        placeholder: "Write your covenant for walking in daily grace..."
      }
    ]
  }
];
