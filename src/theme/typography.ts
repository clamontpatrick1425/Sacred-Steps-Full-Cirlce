/**
 * SacredSteps: Daily Grace Typography System
 * - Playfair Display (serif headings)
 * - Inter (body text)
 * - Cormorant Garamond (italic scripture)
 */

export const typography = {
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    scripture: "'Cormorant Garamond', Georgia, serif",
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  styles: {
    h1: "font-serif text-2xl md:text-3xl font-medium tracking-tight text-[#2D2421]",
    h2: "font-serif text-xl md:text-2xl font-medium text-[#2D2421]",
    h3: "font-serif text-lg font-medium text-[#2D2421]",
    scriptureQuote: "font-scripture italic text-xl md:text-2xl leading-relaxed text-[#2D2421]",
    scriptureRef: "font-sans text-xs tracking-wider uppercase text-[#796B64] font-medium",
    body: "font-sans text-sm md:text-base leading-relaxed text-[#4A3E39]",
    caption: "font-sans text-xs text-[#796B64]",
    stepLabel: "font-sans text-xs font-semibold tracking-widest uppercase text-[#796B64]",
  },
};
