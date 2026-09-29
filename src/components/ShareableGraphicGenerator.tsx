import React, { useState, useRef } from 'react';
import { 
  Download, Copy, Share2, Check, X, Sparkles, 
  Palette, ShieldCheck, Heart 
} from 'lucide-react';
import { MilestoneItem } from '../data/milestoneData';
import { triggerHaptic } from '../utils/haptics';

interface ShareableGraphicGeneratorProps {
  milestone: MilestoneItem;
  daysInGrace: number;
  onClose: () => void;
}

type ColorTheme = 'gold' | 'rose' | 'sage' | 'lavender';

export const ShareableGraphicGenerator: React.FC<ShareableGraphicGeneratorProps> = ({
  milestone,
  daysInGrace,
  onClose,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>('gold');
  const [copiedText, setCopiedText] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const previewCardRef = useRef<HTMLDivElement>(null);

  // Theme configuration
  const themeStyles = {
    gold: {
      bg: 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E0] to-[#F4E4C1]',
      border: 'border-[#D4AF37]',
      accentBg: 'bg-[#D4AF37]/20',
      accentText: 'text-[#8A6708]',
      pill: 'bg-[#D4AF37] text-white',
      canvasBgStart: '#FFFDF9',
      canvasBgMid: '#FAF3E0',
      canvasBgEnd: '#F4E4C1',
      canvasAccent: '#D4AF37',
      canvasTextDark: '#2D2421',
    },
    rose: {
      bg: 'bg-gradient-to-br from-[#FFF9F5] via-[#FFEBE6] to-[#FFCAD4]',
      border: 'border-[#FFAAA6]',
      accentBg: 'bg-[#FFCAD4]/30',
      accentText: 'text-[#8B261D]',
      pill: 'bg-[#E64C3C] text-white',
      canvasBgStart: '#FFF9F5',
      canvasBgMid: '#FFEBE6',
      canvasBgEnd: '#FFCAD4',
      canvasAccent: '#E64C3C',
      canvasTextDark: '#2D2421',
    },
    sage: {
      bg: 'bg-gradient-to-br from-[#FAFBF8] via-[#EFF4EB] to-[#C8D5B9]',
      border: 'border-[#A3B891]',
      accentBg: 'bg-[#C8D5B9]/30',
      accentText: 'text-[#3E5232]',
      pill: 'bg-[#5A6E4B] text-white',
      canvasBgStart: '#FAFBF8',
      canvasBgMid: '#EFF4EB',
      canvasBgEnd: '#C8D5B9',
      canvasAccent: '#5A6E4B',
      canvasTextDark: '#2D2421',
    },
    lavender: {
      bg: 'bg-gradient-to-br from-[#FCFBFD] via-[#F4EEF8] to-[#E6D5F0]',
      border: 'border-[#C8B2D6]',
      accentBg: 'bg-[#E6D5F0]/30',
      accentText: 'text-[#533966]',
      pill: 'bg-[#6F5284] text-white',
      canvasBgStart: '#FCFBFD',
      canvasBgMid: '#F4EEF8',
      canvasBgEnd: '#E6D5F0',
      canvasAccent: '#6F5284',
      canvasTextDark: '#2D2421',
    },
  };

  const currentTheme = themeStyles[selectedTheme];

  // Copy social caption text
  const handleCopyCaption = () => {
    const text = `🎉 Celebrating ${milestone.days} Days in Grace with SacredSteps!\n\n"${milestone.affirmation}"\n\n📖 Scripture: "${milestone.bibleVerse.text}" — ${milestone.bibleVerse.reference}\n\n"A Path to Recovery, A Life in Grace."\n#SacredSteps #RecoveryInGrace #Sobriety #OneDayAtATime #GraceOverShame`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      triggerHaptic('step');
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  // Generate and download high-resolution PNG card using HTML5 Canvas
  const handleDownloadImage = () => {
    setIsGenerating(true);
    triggerHaptic('pulse');

    try {
      const canvas = document.createElement('canvas');
      const size = 1080;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw rich background gradient
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, currentTheme.canvasBgStart);
      grad.addColorStop(0.5, currentTheme.canvasBgMid);
      grad.addColorStop(1, currentTheme.canvasBgEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Draw outer luxury double border
      ctx.strokeStyle = currentTheme.canvasAccent;
      ctx.lineWidth = 12;
      ctx.strokeRect(36, 36, size - 72, size - 72);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 4;
      ctx.strokeRect(52, 52, size - 104, size - 104);

      // Top Tagline
      ctx.textAlign = 'center';
      ctx.fillStyle = '#796B64';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText('SACRED STEPS TO REDEMPTION', size / 2, 130);

      ctx.fillStyle = '#A89B94';
      ctx.font = 'italic 20px Georgia, serif';
      ctx.fillText('A Prayerful Path to Addiction Recovery', size / 2, 165);

      // Center Milestone Emblem
      ctx.font = '96px serif';
      ctx.fillText(milestone.symbol, size / 2, 290);

      // Days Count Banner
      ctx.fillStyle = '#2D2421';
      ctx.font = 'bold 74px "Playfair Display", Georgia, serif';
      ctx.fillText(`${milestone.days} DAYS IN GRACE`, size / 2, 385);

      // Badge Subtitle
      ctx.fillStyle = currentTheme.canvasAccent;
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText(milestone.badgeName.toUpperCase(), size / 2, 435);

      // Decorative divider
      ctx.strokeStyle = currentTheme.canvasAccent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(size / 2 - 140, 475);
      ctx.lineTo(size / 2 + 140, 475);
      ctx.stroke();

      // Affirmation Quote Box
      ctx.fillStyle = '#2D2421';
      ctx.font = 'italic bold 32px "Playfair Display", Georgia, serif';
      wrapText(ctx, `“${milestone.affirmation}”`, size / 2, 545, 840, 46);

      // Scripture Verse Box
      ctx.fillStyle = '#4A3E39';
      ctx.font = 'italic 26px "Cormorant Garamond", Georgia, serif';
      wrapText(ctx, `“${milestone.bibleVerse.text}”`, size / 2, 730, 800, 38);

      ctx.fillStyle = currentTheme.canvasAccent;
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText(`— ${milestone.bibleVerse.reference}`, size / 2, 850);

      // Watermark Footer
      ctx.fillStyle = '#796B64';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('SacredSteps · Daily Grace · Grounded in Scripture', size / 2, 980);

      // Convert to downloadable data URL
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SacredSteps-${milestone.days}Days-Milestone.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  };

  // Canvas text wrapping helper
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  // Native share if supported
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${milestone.days} Days in Grace - SacredSteps`,
          text: `Celebrating ${milestone.days} Days in Grace!\n"${milestone.affirmation}" — ${milestone.bibleVerse.reference}`,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyCaption();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DED6] mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#F4E4C1] text-[#7A5B0B]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#2D2421]">
                Shareable Milestone Art
              </h3>
              <p className="text-[10px] text-[#796B64]">
                Export aesthetic card for social media or messages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#F5EFEB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center justify-between mb-4 bg-[#FAF5F0] p-2 rounded-2xl border border-[#E8DED6]">
          <span className="text-xs font-semibold text-[#796B64] flex items-center gap-1.5 pl-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Aesthetic Theme:</span>
          </span>

          <div className="flex items-center gap-1.5">
            {(['gold', 'rose', 'sage', 'lavender'] as ColorTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  setSelectedTheme(theme);
                  triggerHaptic('soft');
                }}
                className={`w-7 h-7 rounded-xl border text-[10px] font-bold uppercase transition-all flex items-center justify-center ${
                  selectedTheme === theme
                    ? 'ring-2 ring-[#2D2421] scale-105 shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                } ${
                  theme === 'gold'
                    ? 'bg-[#F4E4C1] border-[#D4AF37] text-[#7A5B0B]'
                    : theme === 'rose'
                    ? 'bg-[#FFCAD4] border-[#FFAAA6] text-[#8B261D]'
                    : theme === 'sage'
                    ? 'bg-[#C8D5B9] border-[#A3B891] text-[#3E5232]'
                    : 'bg-[#E6D5F0] border-[#C8B2D6] text-[#533966]'
                }`}
                title={`Theme ${theme}`}
              >
                {theme[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Live Visual Card Preview */}
        <div
          ref={previewCardRef}
          className={`aspect-square w-full rounded-3xl p-6 sm:p-7 border-4 shadow-lg flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300 ${currentTheme.bg} ${currentTheme.border}`}
        >
          {/* Subtle Outer Inset Border */}
          <div className="absolute inset-2 rounded-2xl border border-white/60 pointer-events-none" />

          {/* Top Label */}
          <div className="relative z-10 space-y-0.5">
            <span className="text-[9px] font-sans font-black tracking-widest text-[#796B64] uppercase block">
              Sacred Steps to Redemption
            </span>
            <span className="text-[8px] font-sans text-[#A89B94] uppercase tracking-wider block">
              A Prayerful Path to Addiction Recovery
            </span>
          </div>

          {/* Centerpiece Badge */}
          <div className="relative z-10 space-y-1.5 my-auto">
            <span className="text-4xl sm:text-5xl block animate-bounce duration-1000">
              {milestone.symbol}
            </span>

            <h4 className="font-serif text-2xl sm:text-3xl font-black text-[#2D2421] tracking-tight">
              {milestone.days} DAYS IN GRACE
            </h4>

            <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentTheme.pill}`}>
              {milestone.badgeName}
            </span>

            <p className="font-serif italic text-xs sm:text-sm font-semibold text-[#2D2421] max-w-xs mx-auto leading-snug pt-2">
              "{milestone.affirmation}"
            </p>
          </div>

          {/* Bottom Scripture & Brand Watermark */}
          <div className="relative z-10 pt-2 border-t border-black/10 w-full space-y-1">
            <p className="font-scripture italic text-[11px] sm:text-xs text-[#4A3E39] line-clamp-2">
              "{milestone.bibleVerse.text}"
            </p>
            <span className={`text-[9px] font-bold block ${currentTheme.accentText}`}>
              — {milestone.bibleVerse.reference}
            </span>
            <span className="text-[8px] text-[#796B64] uppercase tracking-widest block pt-0.5">
              SacredSteps · A Life in Grace
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="py-3 px-3 rounded-2xl bg-[#2D2421] text-[#FFF9F5] font-semibold text-xs hover:bg-[#4A3E39] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#FFD4C4]" />
                <span>Download Card</span>
              </>
            )}
          </button>

          <button
            onClick={handleNativeShare}
            className="py-3 px-3 rounded-2xl bg-[#FAF5F0] border border-[#E8DED6] text-[#2D2421] font-semibold text-xs hover:bg-[#F5EFEB] transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#796B64]" />
            <span>Share Art</span>
          </button>
        </div>

        {/* Copy Caption Button */}
        <button
          onClick={handleCopyCaption}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-white border border-[#E8DED6] text-[11px] text-[#796B64] hover:text-[#2D2421] hover:bg-[#FAF5F0] transition-colors flex items-center justify-center gap-1.5"
        >
          {copiedText ? (
            <>
              <Check className="w-3 h-3 text-[#5A6E4B]" />
              <span className="text-[#5A6E4B] font-semibold">Social Caption Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Social Caption with Scripture & Hashtags</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
