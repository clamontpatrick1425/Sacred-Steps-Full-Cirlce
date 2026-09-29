export interface Devotional {
  id: string;
  period: 'morning' | 'evening';
  title: string;
  verseRef: string;
  verseText: string;
  reflection: string;
  graceAnchor: string;
}

export const DAILY_DEVOTIONALS: Devotional[] = [
  {
    id: 'dawn-1',
    period: 'morning',
    title: 'New Mercies at Sunrise',
    verseRef: 'Lamentations 3:22-23',
    verseText: 'The steadfast love of the Lord never ceases; His mercies never come to an end; they are new every morning; great is Your faithfulness.',
    reflection: 'Today does not begin with yesterday’s tally or tomorrow’s anxiety. You are handed a clean slate woven with unending grace. Breathe in the morning air knowing that God’s compassion has already met you here.',
    graceAnchor: 'Today, I receive God’s fresh mercy and release all striving.'
  },
  {
    id: 'dusk-1',
    period: 'evening',
    title: 'Resting in His Safe Haven',
    verseRef: 'Psalm 4:8',
    verseText: 'In peace I will lie down and sleep, for You alone, Lord, make me dwell in safety.',
    reflection: 'The day’s battles are surrendered now. Every step taken, whether steady or trembling, is wrapped in divine redemption. Lay down your armor; you are held, known, and deeply protected.',
    graceAnchor: 'I lay down my worries and rest in the sheltering peace of Christ.'
  },
  {
    id: 'dawn-2',
    period: 'morning',
    title: 'Sufficient Grace for Weakness',
    verseRef: '2 Corinthians 12:9',
    verseText: 'My grace is sufficient for you, for My power is made perfect in weakness.',
    reflection: 'Recovery is not about proving your strength; it is about trusting the sufficiency of God’s grace. When you feel fragile, remember that Christ’s power finds its most sacred canvas in human weakness.',
    graceAnchor: 'My vulnerability is where God’s divine strength meets me.'
  },
  {
    id: 'dusk-2',
    period: 'evening',
    title: 'The Shepherd Who Restores',
    verseRef: 'Psalm 23:2-3',
    verseText: 'He makes me lie down in green pastures, He leads me beside quiet waters, He restores my soul.',
    reflection: 'Let the clamor of the day soften into stillness. The Good Shepherd does not drive us with shame; He gently guides us to quiet waters where the soul can be healed and restored.',
    graceAnchor: 'My soul is restored by the gentle hand of my Shepherd.'
  }
];

export interface TriggerItem {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  defaultPrompt: string;
}

export const RECOVERY_TRIGGERS: TriggerItem[] = [
  {
    id: 'craving',
    name: 'Craving & Physical Urge',
    subtitle: 'Wave of intensity',
    color: '#FFD4C4',
    defaultPrompt: 'I feel a sudden physical urge or craving rising up, and I need help grounding myself right now.'
  },
  {
    id: 'shame',
    name: 'Shame & Guilt Spiral',
    subtitle: 'Lies of unworthiness',
    color: '#E6D5F0',
    defaultPrompt: 'I am spiraling in shame and regret over my past or a recent struggle. The lie is telling me I am damaged goods.'
  },
  {
    id: 'anxiety',
    name: 'Overwhelm & Panic',
    subtitle: 'Loss of peace & control',
    color: '#F4E4C1',
    defaultPrompt: 'My chest feels tight and my mind is racing with anxiety about the future.'
  },
  {
    id: 'loneliness',
    name: 'Isolation & Loneliness',
    subtitle: 'Nobody understands',
    color: '#C8D5B9',
    defaultPrompt: 'I feel totally isolated and disconnected from others, tempted to isolate further.'
  },
  {
    id: 'relapse_fear',
    name: 'Fear of Relapse',
    subtitle: 'Doubt in long-term recovery',
    color: '#FFD4C4',
    defaultPrompt: 'Fear is whispering that I cannot sustain this freedom and that I am bound to fail eventually.'
  },
  {
    id: 'resentment',
    name: 'Resentment & Bitterness',
    subtitle: 'Carrying a heavy grievance',
    color: '#E6D5F0',
    defaultPrompt: 'I am trapped in anger and resentment toward someone who hurt me, and it is eating away at my peace.'
  }
];

export const RECOVERY_MILESTONES = [
  { days: 1, title: 'First Breath of Grace', desc: 'Surrendering to the truth that one step is enough.' },
  { days: 3, title: 'Still Waters', desc: 'Finding quiet footing in the morning mercies.' },
  { days: 7, title: 'Seven Days of Manna', desc: 'Fed day by day with sufficient grace.' },
  { days: 14, title: 'Fortress of Peace', desc: 'Dismantling old triggers with the S.T.E.P. method.' },
  { days: 30, title: 'Rooted in Redemption', desc: 'A month of walking forward in new identity.' },
  { days: 60, title: 'Unshakeable Hope', desc: 'Lies losing their grip as God’s truth takes deep root.' },
  { days: 90, title: 'Living Sanctuary', desc: 'Your recovery is becoming a lighthouse for others.' },
];
