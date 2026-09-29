/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — 12-Step Journal PDF Converter Engine
 * Converts the full interactive 12-step workbook into a professional, printable PDF document
 */

import { jsPDF } from 'jspdf';
import { TWELVE_STEPS_BOOK_DATA, InventoryItem, AmendsItem } from '../data/twelveStepsBookData';

export interface WorkbookPdfData {
  cleanStartDate: string;
  daysInGrace: number;
  completedStepsCount: number;
  stepPromptAnswers: Record<string, string>;
  stepFreeformNotes: Record<number, string>;
  stepCompletedMap: Record<number, boolean>;
  stepPrayerSpokenMap: Record<number, boolean>;
  moralInventoryList: InventoryItem[];
  amendsLedger: AmendsItem[];
}

export function generateWorkbookPdf(data: WorkbookPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 30) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(130, 120, 115);
    doc.text('Sacred Steps Daily Grace · 12-Step Workbook · C. Lamont Patrick', margin, 30);
    doc.setDrawColor(230, 220, 214);
    doc.line(margin, 35, pageWidth - margin, 35);
  };

  // ===================== COVER / TITLE BLOCK =====================
  // Warm decorative header bar
  doc.setFillColor(45, 36, 33); // Espresso
  doc.rect(margin, y, contentWidth, 54, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 249, 245);
  doc.text('SACRED STEPS TO REDEMPTION', margin + 14, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(244, 228, 193); // Gold
  doc.text('Interactive 12-Step Recovery Workbook & Spiritual Journal', margin + 14, y + 42);

  y += 72;

  // Book attribution and author note
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(74, 62, 57);
  doc.text('Based on the teachings of C. Lamont Patrick', margin, y);
  y += 15;
  doc.text('Author of "Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery"', margin, y);
  y += 22;

  // Journey Metadata Box
  doc.setFillColor(250, 245, 240); // Sand
  doc.setDrawColor(232, 222, 214);
  doc.roundedRect(margin, y, contentWidth, 42, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(45, 36, 33);
  doc.text(`Clean Date: ${new Date(data.cleanStartDate).toLocaleDateString()}`, margin + 12, y + 18);
  doc.text(`Sovereign Days: ${data.daysInGrace} Days in Grace`, margin + 170, y + 18);
  doc.text(`Steps Completed: ${data.completedStepsCount} of 12`, margin + 350, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(121, 107, 100);
  doc.text(`Document Export Date: ${new Date().toLocaleDateString()} · Zero-Knowledge Confidential Archive`, margin + 12, y + 32);

  y += 60;

  // ===================== 12 STEPS COMPILATION =====================
  TWELVE_STEPS_BOOK_DATA.forEach((step) => {
    checkPageBreak(90);

    const isCompleted = Boolean(data.stepCompletedMap[step.stepNumber]);
    const prayerSpoken = Boolean(data.stepPrayerSpokenMap[step.stepNumber]);

    // Step Header Card
    doc.setFillColor(255, 249, 245);
    doc.setDrawColor(220, 205, 195);
    doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(45, 36, 33);
    doc.text(`STEP ${step.stepNumber}: ${step.bookSubtitle.toUpperCase()}`, margin + 10, y + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(121, 107, 100);
    doc.text(`Traditional AA/CR: "${step.traditionalTitle}"`, margin + 10, y + 28);

    // Status Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (isCompleted) {
      doc.setTextColor(60, 100, 50);
      doc.text('[ COMPLETED IN GRACE ]', pageWidth - margin - 120, y + 16);
    } else {
      doc.setTextColor(140, 110, 40);
      doc.text('[ IN PROGRESS ]', pageWidth - margin - 85, y + 16);
    }

    y += 46;

    // Biblical Anchor
    checkPageBreak(40);
    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(122, 91, 11); // Warm gold
    doc.text(`Scripture Anchor: ${step.bibleVerse.reference}`, margin, y);
    y += 13;

    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(60, 50, 45);
    const verseLines = doc.splitTextToSize(`"${step.bibleVerse.text}"`, contentWidth - 10);
    doc.text(verseLines, margin + 8, y);
    y += verseLines.length * 12 + 6;

    // Step Prayer
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(139, 38, 29); // Rust red
    doc.text(`Step ${step.stepNumber} Prayer: "${step.prayer.title}" ${prayerSpoken ? '✓ (Spoken)' : ''}`, margin, y);
    y += 12;

    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(74, 62, 57);
    const prayerLines = doc.splitTextToSize(`"${step.prayer.text}"`, contentWidth - 10);
    doc.text(prayerLines, margin + 8, y);
    y += prayerLines.length * 11 + 10;

    // Reflection Prompts & User Answers
    step.reflectionPrompts.forEach((prompt, pIdx) => {
      checkPageBreak(50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(45, 36, 33);
      doc.text(`Reflection ${pIdx + 1}: ${prompt.question}`, margin, y);
      y += 12;

      const userAnswer = data.stepPromptAnswers[prompt.id]?.trim();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      if (userAnswer) {
        doc.setTextColor(30, 25, 22);
        const answerLines = doc.splitTextToSize(userAnswer, contentWidth - 16);
        checkPageBreak(answerLines.length * 11 + 8);
        doc.setFillColor(252, 250, 247);
        doc.setDrawColor(235, 225, 218);
        doc.roundedRect(margin + 4, y - 2, contentWidth - 8, answerLines.length * 11 + 6, 2, 2, 'FD');
        doc.text(answerLines, margin + 8, y + 8);
        y += answerLines.length * 11 + 14;
      } else {
        doc.setTextColor(150, 140, 135);
        doc.text('(No written entry recorded for this prompt yet)', margin + 8, y);
        y += 15;
      }
    });

    // Step Freeform Notes
    const freeformNote = data.stepFreeformNotes[step.stepNumber]?.trim();
    if (freeformNote) {
      checkPageBreak(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(84, 56, 100);
      doc.text(`Personal Notes & Breakthroughs for Step ${step.stepNumber}:`, margin, y);
      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 25, 22);
      const noteLines = doc.splitTextToSize(freeformNote, contentWidth - 16);
      checkPageBreak(noteLines.length * 11 + 8);
      doc.setFillColor(250, 247, 252);
      doc.setDrawColor(230, 218, 238);
      doc.roundedRect(margin + 4, y - 2, contentWidth - 8, noteLines.length * 11 + 6, 2, 2, 'FD');
      doc.text(noteLines, margin + 8, y + 8);
      y += noteLines.length * 11 + 16;
    }

    y += 12; // Gap before next step
  });

  // ===================== STEP 4 MORAL INVENTORY =====================
  if (data.moralInventoryList.length > 0) {
    checkPageBreak(70);
    doc.setFillColor(245, 240, 235);
    doc.rect(margin, y, contentWidth, 24, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(45, 36, 33);
    doc.text('APPENDIX I: STEP 4 MORAL INVENTORY LEDGER', margin + 8, y + 16);
    y += 34;

    data.moralInventoryList.forEach((inv, i) => {
      checkPageBreak(45);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(45, 36, 33);
      doc.text(`[${inv.category.toUpperCase()}] ${inv.title}`, margin, y);
      y += 11;

      if (inv.details) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(70, 60, 55);
        const detailLines = doc.splitTextToSize(inv.details, contentWidth - 12);
        doc.text(detailLines, margin + 8, y);
        y += detailLines.length * 10 + 6;
      }
      y += 6;
    });
  }

  // ===================== STEPS 8 & 9 AMENDS LEDGER =====================
  if (data.amendsLedger.length > 0) {
    checkPageBreak(70);
    doc.setFillColor(245, 240, 235);
    doc.rect(margin, y, contentWidth, 24, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(45, 36, 33);
    doc.text('APPENDIX II: STEPS 8 & 9 AMENDS LEDGER', margin + 8, y + 16);
    y += 34;

    data.amendsLedger.forEach((item) => {
      checkPageBreak(50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(45, 36, 33);
      doc.text(`Person: ${item.person} [Status: ${item.status.toUpperCase()}]`, margin, y);
      y += 11;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(70, 60, 55);
      if (item.harmDone) {
        const harmLines = doc.splitTextToSize(`Harm Done: ${item.harmDone}`, contentWidth - 12);
        doc.text(harmLines, margin + 8, y);
        y += harmLines.length * 10 + 4;
      }
      if (item.amendsPlan) {
        const planLines = doc.splitTextToSize(`Amends Plan: ${item.amendsPlan}`, contentWidth - 12);
        doc.text(planLines, margin + 8, y);
        y += planLines.length * 10 + 6;
      }
      y += 6;
    });
  }

  // ===================== CLOSING BENEDICTION =====================
  checkPageBreak(65);
  doc.setDrawColor(210, 195, 185);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(74, 62, 57);
  doc.text('"A Path to Recovery, A Life in Grace"', pageWidth / 2, y, { align: 'center' });
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(121, 107, 100);
  doc.text('God grant me the serenity to accept the things I cannot change,', pageWidth / 2, y, { align: 'center' });
  y += 11;
  doc.text('courage to change the things I can, and wisdom to know the difference.', pageWidth / 2, y, { align: 'center' });

  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 130, 125);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 20);
  }

  return doc;
}
