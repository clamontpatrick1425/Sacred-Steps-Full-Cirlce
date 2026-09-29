/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — 12-Step Workbook PDF Preview & Converter Modal
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  Sparkles, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  Eye, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { generateWorkbookPdf, WorkbookPdfData } from '../utils/workbookPdfGenerator';
import { sanctuaryAudio, triggerHaptic } from '../utils/haptics';

interface WorkbookPdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WorkbookPdfData;
}

export const WorkbookPdfPreviewModal: React.FC<WorkbookPdfPreviewModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
      return;
    }

    setIsGenerating(true);
    try {
      const doc = generateWorkbookPdf(data);
      const pages = doc.getNumberOfPages();
      setPageCount(pages);

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    triggerHaptic('step');
    try {
      const doc = generateWorkbookPdf(data);
      const filename = `Sacred-Steps-12-Step-Workbook-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  const handlePrintPdf = () => {
    triggerHaptic('soft');
    if (pdfBlobUrl) {
      // Create hidden iframe to trigger PDF print dialog
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = pdfBlobUrl;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.print();
        }
      };
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFF9F5] border border-[#E8DED6] rounded-[32px] max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-[#2D2421]">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8DED6] bg-[#FAF5F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#FFF1BD] flex items-center justify-center text-[#5A3816] shadow-xs">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D2421] leading-tight">
                12-Step Workbook PDF Converter
              </h3>
              <p className="text-[11px] text-[#796B64]">
                Converted to PDF Document before Export or Print
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="py-1.5 px-3 rounded-xl bg-white border border-[#E8DED6] hover:bg-[#F5EFEB] text-xs font-semibold text-[#2D2421] flex items-center gap-1.5 transition shadow-2xs"
              title="Print PDF Document"
            >
              <Printer className="w-3.5 h-3.5 text-[#796B64]" />
              <span className="hidden sm:inline">Print PDF</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="py-1.5 px-3.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C8D5B9]" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#FFD4C4]" />
                  <span>Download .PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#796B64] hover:text-[#2D2421] hover:bg-[#E8DED6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workbook Summary Stats Ribbon */}
        <div className="py-2.5 px-4 bg-[#FFFDF9] border-b border-[#E8DED6] flex flex-wrap items-center justify-between text-xs text-[#796B64] gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#2D2421] font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-[#7A5B0B]" />
              <span>Full 12-Step Workbook</span>
            </span>
            <span>•</span>
            <span>{data.completedStepsCount} of 12 Steps Done</span>
            <span>•</span>
            <span className="font-mono bg-[#FAF5F0] px-2 py-0.5 rounded border border-[#E8DED6]">
              {pageCount} PDF {pageCount === 1 ? 'Page' : 'Pages'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#5A6E4B] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Client Converted</span>
          </div>
        </div>

        {/* Main Body: Embedded PDF Document Preview */}
        <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-[#EDE5DE] flex flex-col items-center justify-center relative">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-12">
              <div className="w-10 h-10 border-3 border-[#2D2421] border-t-transparent rounded-full animate-spin" />
              <p className="font-serif text-xs font-semibold text-[#2D2421]">
                Converting 12-Step Workbook to PDF document...
              </p>
            </div>
          ) : pdfBlobUrl ? (
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-md border border-[#D5C7BD] bg-white flex flex-col">
              <iframe
                src={`${pdfBlobUrl}#toolbar=0&navpanes=0`}
                title="12-Step Workbook PDF Preview"
                className="w-full h-full flex-1 border-0"
              />
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <p className="text-xs text-[#8B261D]">
                Unable to display preview. Please use the button below to download the PDF directly.
              </p>
              <button
                onClick={handleDownloadPdf}
                className="py-2 px-4 rounded-xl bg-[#2D2421] text-white text-xs font-semibold"
              >
                Download PDF File
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-3.5 border-t border-[#E8DED6] bg-[#FAF5F0] flex items-center justify-between text-xs shrink-0">
          <p className="text-[11px] text-[#796B64] italic">
            "Sacred Steps to Redemption: A Prayerful Path to Addiction Recovery" · C. Lamont Patrick
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E8DED6] hover:bg-[#FAF5F0] font-semibold text-[#2D2421] flex items-center gap-1 text-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#796B64]" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-1.5 rounded-xl bg-[#2D2421] text-[#FFF9F5] hover:bg-[#4A3E39] font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#FFD4C4]" />
              <span>Save PDF File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
