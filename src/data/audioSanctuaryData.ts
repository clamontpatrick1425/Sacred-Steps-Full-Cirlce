/**
 * SacredSteps: Audio Sanctuary Content & Transcripts
 * Inspired directly by "Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery"
 * by C. Lamont Patrick
 */

export type AudioCategory = 
  | 'all'
  | 'guided-meditation'
  | 'scripture-reading'
  | 'breathwork'
  | 'prayer-walk'
  | 'sleep-story';

export interface TranscriptCue {
  timestamp: number; // in seconds
  speaker: string;
  text: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  category: AudioCategory;
  categoryLabel: string;
  durationSeconds: number;
  durationFormatted: string;
  speaker: string;
  eBookSource: string;
  accentColor: 'lavender' | 'sage' | 'peach' | 'gold';
  description: string;
  ambientSoundType: 'binaural-peace' | 'gentle-rain' | 'still-waters' | 'temple-bowl' | 'morning-birds';
  keyVerse?: {
    reference: string;
    text: string;
  };
  transcript: TranscriptCue[];
}

export const AUDIO_SANCTUARY_TRACKS: AudioTrack[] = [
  {
    id: 'track-peace-in-storm',
    title: 'Finding Peace in the Storm',
    category: 'guided-meditation',
    categoryLabel: 'Guided Meditation',
    durationSeconds: 600, // 10 min
    durationFormatted: '10 min',
    speaker: 'The Guide',
    eBookSource: 'Inspired by Sarah’s mindfulness journey (Chapters 1 & 4)',
    accentColor: 'lavender',
    ambientSoundType: 'still-waters',
    description: 'Learn to step out of the swirling gale of anxiety and cravings, resting in the quiet eye of Christ’s calm.',
    keyVerse: {
      reference: 'Mark 4:39',
      text: 'And He awoke and rebuked the wind and said to the sea, "Peace! Be still!" And the wind ceased, and there was a great calm.'
    },
    transcript: [
      { timestamp: 0, speaker: 'The Guide', text: 'Welcome to your sanctuary of quiet waters. Sit comfortably, unclamp your jaw, and let your hands rest gently in your lap.' },
      { timestamp: 35, speaker: 'The Guide', text: 'In Chapter 1, Sarah writes of feeling that her cravings were a category-5 hurricane that would tear her soul apart. But in the center of every storm, there is a holy stillness.' },
      { timestamp: 80, speaker: 'The Guide', text: 'Take a deep breath in through your nose... and let it fall out like a soft sigh. You do not have to fight the storm with clenched fists. You are seated with Christ in the boat.' },
      { timestamp: 140, speaker: 'The Guide', text: 'Notice where tension is hiding. In your temples, behind your eyes, between your shoulders. Give each muscle permission to surrender.' },
      { timestamp: 210, speaker: 'The Guide', text: 'Christ spoke three words over the churning waves: "Peace, be still." Speak them silently into the center of your chest right now: Peace. Be still.' },
      { timestamp: 290, speaker: 'The Guide', text: 'The urge you feel is only water. It cannot drown a soul that is anchored to the Lord. Feel the water growing quiet around you.' },
      { timestamp: 380, speaker: 'The Guide', text: 'Rest here for a moment in silence, breathing in His mercy, breathing out all exhaustion.' },
      { timestamp: 470, speaker: 'The Guide', text: 'As we prepare to return to your day, carry this quiet eye with you. God’s peace does not depend on the weather outside.' },
      { timestamp: 550, speaker: 'The Guide', text: 'I am right here with you. Take the next step in grace. Amen.' }
    ]
  },
  {
    id: 'track-body-scan-release',
    title: 'Body Scan for Release',
    category: 'guided-meditation',
    categoryLabel: 'Guided Meditation',
    durationSeconds: 900, // 15 min
    durationFormatted: '15 min',
    speaker: 'The Guide',
    eBookSource: 'Based on Chapter 6: Humbly Asking for Removal of Defects',
    accentColor: 'sage',
    ambientSoundType: 'temple-bowl',
    description: 'A contemplative somatic journey releasing physical tension, old resentments, and hidden fears stored in the body.',
    keyVerse: {
      reference: '1 Corinthians 6:19-20',
      text: 'Do you not know that your body is a temple of the Holy Spirit within you, whom you have from God? ... Therefore honor God with your body.'
    },
    transcript: [
      { timestamp: 0, speaker: 'The Guide', text: 'Your body is not your enemy. In active addiction, we often dissociated from our physical frame. Today, in Chapter 6, we return with gentleness.' },
      { timestamp: 45, speaker: 'The Guide', text: 'Begin by bringing gentle awareness to the crown of your head and your forehead. Release any furrowed thoughts.' },
      { timestamp: 110, speaker: 'The Guide', text: 'Soften the muscles around your eyes. Unclench the hinge of your jaw, letting your tongue rest naturally.' },
      { timestamp: 190, speaker: 'The Guide', text: 'Bring your awareness down to your throat and chest. Notice your heartbeat—God’s rhythm of life sustaining you without your striving.' },
      { timestamp: 290, speaker: 'The Guide', text: 'Notice your stomach and belly. We often hold fear and defensive vigilance here. Soften your belly completely. God is your shield.' },
      { timestamp: 420, speaker: 'The Guide', text: 'Send warmth into your lower back, your hips, and your legs. These legs have carried you through dark valleys, and today they stand in grace.' },
      { timestamp: 580, speaker: 'The Guide', text: 'Feel your feet grounded on the earth. You are whole, you are clean, and the Holy Spirit inhabits this vessel.' },
      { timestamp: 750, speaker: 'The Guide', text: 'Whisper this prayer: "Lord, take every clenched fist in my soul and open it into an altar of praise."' },
      { timestamp: 850, speaker: 'The Guide', text: 'Rest in this sovereign release. Take the next step.' }
    ]
  },
  {
    id: 'track-verses-for-hope',
    title: 'Verses for Hope',
    category: 'scripture-reading',
    categoryLabel: 'Scripture Reading',
    durationSeconds: 180, // 3 min
    durationFormatted: '3 min',
    speaker: 'The Guide',
    eBookSource: 'Inspired by Mark’s scripture lifeline (Romans 8 & Isaiah 40)',
    accentColor: 'gold',
    ambientSoundType: 'binaural-peace',
    description: 'Crisp, holy scripture spoken aloud to dismantle despair, shame, and feelings of worthlessness.',
    keyVerse: {
      reference: 'Romans 8:38-39',
      text: 'For I am convinced that neither death nor life, nor angels nor principalities, nor things present nor things to come... shall be able to separate us from the love of God.'
    },
    transcript: [
      { timestamp: 0, speaker: 'The Guide', text: 'Listen to the unchanging Word of God when your thoughts feel uncertain.' },
      { timestamp: 25, speaker: 'The Guide', text: 'Jeremiah 29:11: "For I know the plans I have for you, declares the Lord, plans for wholeness and not for evil, to give you a future and a hope."' },
      { timestamp: 65, speaker: 'The Guide', text: 'Isaiah 40:31: "They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint."' },
      { timestamp: 110, speaker: 'The Guide', text: 'Romans 8:1: "There is therefore now no condemnation for those who are in Christ Jesus."' },
      { timestamp: 145, speaker: 'The Guide', text: 'You are loved with an everlasting love. Anchor your soul here today.' }
    ]
  },
  {
    id: 'track-478-calming-breath',
    title: '4-7-8 Calming Breath',
    category: 'breathwork',
    categoryLabel: 'Breathwork Exercise',
    durationSeconds: 300, // 5 min
    durationFormatted: '5 min',
    speaker: 'The Guide',
    eBookSource: 'From Chapter 3: The Spirit of Surrender',
    accentColor: 'sage',
    ambientSoundType: 'still-waters',
    description: 'Paced breathwork using the sacred 4-7-8 technique to activate the vagus nerve and dissolve acute panic.',
    keyVerse: {
      reference: 'Genesis 2:7',
      text: 'Then the Lord God formed the man of dust from the ground and breathed into his nostrils the breath of life, and the man became a living creature.'
    },
    transcript: [
      { timestamp: 0, speaker: 'The Guide', text: 'In scripture, God’s Holy Spirit is Ruach—the holy breath of life. Together we practice the 4-7-8 rhythm.' },
      { timestamp: 30, speaker: 'The Guide', text: 'Empty your lungs completely. Now inhale gently through your nose for 4 seconds... 1, 2, 3, 4.' },
      { timestamp: 50, speaker: 'The Guide', text: 'Hold your breath in stillness for 7 seconds... 1, 2, 3, 4, 5, 6, 7.' },
      { timestamp: 75, speaker: 'The Guide', text: 'Exhale slowly through your mouth with a gentle whoosh for 8 seconds... 1, 2, 3, 4, 5, 6, 7, 8.' },
      { timestamp: 110, speaker: 'The Guide', text: 'Inhale peace... 2, 3, 4. Hold in trust... 2, 3, 4, 5, 6, 7. Exhale fear... 2, 3, 4, 5, 6, 7, 8.' },
      { timestamp: 180, speaker: 'The Guide', text: 'Feel your pulse slowing. The craving center of your brain is quieting.' },
      { timestamp: 260, speaker: 'The Guide', text: 'Return to natural breathing, filled with gratitude. You are safe.' }
    ]
  },
  {
    id: 'track-prayer-walk-grace',
    title: 'Grace Over Shame Walk',
    category: 'prayer-walk',
    categoryLabel: 'Prayer Walk',
    durationSeconds: 900, // 15 min
    durationFormatted: '15 min',
    speaker: 'The Guide',
    eBookSource: 'Chapter 5: Stepping into the Light of Day',
    accentColor: 'peach',
    ambientSoundType: 'morning-birds',
    description: 'An outdoor audio prayer companion synchronizing your footsteps with breath and the Serenity Prayer.',
    keyVerse: {
      reference: 'Micah 6:8',
      text: 'He has told you, O man, what is good; and what does the Lord require of you but to do justice, and to love kindness, and to walk humbly with your God?'
    },
    transcript: [
      { timestamp: 0, speaker: 'The Guide', text: 'Step outside or begin walking at an easy, natural pace. Feel the air against your face.' },
      { timestamp: 40, speaker: 'The Guide', text: 'Match your steps to this prayer: Right foot—God grant me the serenity. Left foot—to accept the things I cannot change.' },
      { timestamp: 120, speaker: 'The Guide', text: 'Look at the trees, the sky, the pavement beneath your soles. You are moving forward. Every step is distance from your active addiction.' },
      { timestamp: 240, speaker: 'The Guide', text: 'When old memories or guilt rise with your footsteps, whisper: "That was where I was. This is where God has brought me."' },
      { timestamp: 420, speaker: 'The Guide', text: 'Courage to change the things I can... and wisdom to know the difference.' },
      { timestamp: 650, speaker: 'The Guide', text: 'Notice three living things around you. God sustains every sparrow, and He is sustaining your sobriety.' },
      { timestamp: 820, speaker: 'The Guide', text: 'Walk homeward with your head held high in dignity and peace.' }
    ]
  },
  {
    id: 'track-sleep-story-still-waters',
    title: 'Night of Still Waters',
    category: 'sleep-story',
    categoryLabel: 'Sleep Story',
    durationSeconds: 1200, // 20 min
    durationFormatted: '20 min',
    speaker: 'The Guide',
    eBookSource: 'Psalm 23 Nocturnal Devotional (Chapter 11)',
    accentColor: 'lavender',
    ambientSoundType: 'gentle-rain',
    description: 'A soothing twilight meditation journey down green pastures and quiet streams, easing racing thoughts into deep restorative sleep.',
    keyVerse: {
      reference: 'Psalm 4:8',
      text: 'In peace I will both lie down and sleep; for You alone, O Lord, make me dwell in safety.'
    },
    transcript: [
      { timestamp: 0, speaker: 'The Guide', text: 'The day is finished. The work of today is placed into God’s faithful hands. Close your eyes.' },
      { timestamp: 60, speaker: 'The Guide', text: 'Picture a gentle valley bathed in the soft lavender light of dusk. The air is warm and sweet with wildflowers.' },
      { timestamp: 180, speaker: 'The Guide', text: 'A slow, crystal stream meanders through the emerald grass. The water whispers over smooth river stones.' },
      { timestamp: 340, speaker: 'The Guide', text: '"He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."' },
      { timestamp: 520, speaker: 'The Guide', text: 'There is nothing you need to accomplish tonight. No arguments to win. No cravings to wrestle. You are safe.' },
      { timestamp: 750, speaker: 'The Guide', text: 'Feel the blanket of God’s protective presence tucking around your heart. Your mind is quiet.' },
      { timestamp: 980, speaker: 'The Guide', text: 'Sleep in peace, beloved child of God. The Good Shepherd watches while you rest.' },
      { timestamp: 1150, speaker: 'The Guide', text: 'Rest in His everlasting arms... Amen.' }
    ]
  }
];
