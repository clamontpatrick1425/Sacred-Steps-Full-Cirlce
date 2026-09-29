/**
 * SacredSteps: Daily Grace Design System
 * Soft Dawn Sanctuary Color Palette
 */

export const dawnColors = {
  // Primary Dawn Palette
  peach: '#FFD4C4',       // Warm Peach - Compassion & Dawn Light
  lavender: '#E6D5F0',    // Gentle Lavender - Peace, Rest, & Grace
  gold: '#F4E4C1',        // Muted Gold - Divine Presence & Truth
  sage: '#C8D5B9',        // Sage Green - Healing, Growth & Renewal
  warmWhite: '#FFF9F5',   // Warm White - Purity & Digital Sanctuary Background
  sand: '#F5EFEB',        // Soft Sand / Parchment Card Background
  sandBorder: '#E8DED6',  // Subtle hairline border
  espresso: '#2D2421',    // Deep Charcoal / Espresso - Grounded body text
  muted: '#796B64',       // Warm Muted Umber - Secondary captions & metadata
  subtle: '#A89B94',      // Soft placeholder text

  // State & Accent
  crisisRed: '#D97768',   // Gentle Alert Coral
  safetyBlue: '#8EB6C8',  // Calming Haven Blue
  accentGlow: 'rgba(244, 228, 193, 0.4)', // Soft Gold Aura
};

export const themeConfig = {
  colors: dawnColors,
  radius: {
    sm: '8px',
    md: '14px',
    lg: '20px',
    xl: '28px',
    full: '9999px',
  },
  shadows: {
    subtle: '0 2px 12px -2px rgba(45, 36, 33, 0.04)',
    softCard: '0 4px 20px -2px rgba(45, 36, 33, 0.06)',
    warmGlow: '0 8px 30px -4px rgba(255, 212, 196, 0.35)',
    lavenderGlow: '0 8px 30px -4px rgba(230, 213, 240, 0.35)',
  },
  transitions: {
    slow: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
    breathe: 'transform 8000ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
