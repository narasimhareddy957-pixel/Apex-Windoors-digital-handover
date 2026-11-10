import React, { useState } from 'react';
import { HandoverRecord } from '../types/handover';
import { X, Check, Copy, MessageCircle, Mail, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: HandoverRecord;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const passedCount = record.checklist.filter((c) => c.status === 'Yes').length;
  const totalCount = record.checklist.length;

  const formattedWhatsAppText = `*Apex Windoors - Digital Handover Certificate*
━━━━━━━━━━━━━━━━━━━━━
*Project:* ${record.projectDetails.projectName}
*Location:* ${record.projectDetails.siteAddress}
*Certificate Ref:* ${record.certificateNo}
*PO / Quote No:* ${record.projectDetails.poNo}
*Completion Date:* ${record.projectDetails.completionDate}
*Quality Inspection:* ${passedCount} of ${totalCount} Items Passed (Level, Plumb, Silicone & Hardware verified)
*Contractor:* ${record.projectDetails.contractorName}
*Warranty Coverage:* ${record.warrantyPeriod}
*Keys Handed Over:* ${record.keysHandedOverCount || 8} Keys

*Client Sign-off:* Verified by ${record.clientSignerName || record.projectDetails.clientName}
*Feedback:* "${record.feedback.text}"

━━━━━━━━━━━━━━━━━━━━━
Apex Windoors · Basaveshwara Nagar, Bengaluru
Thank you for choosing Apex Windoors!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedWhatsAppText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    // If client has phone, sanitize for wa.me
    const rawPhone = record.projectDetails.clientPhone.replace(/[^0-9]/g, '');
    const phoneParam = rawPhone ? `phone=${rawPhone}&` : '';
    const url = `https://api.whatsapp.com/send?${phoneParam}text=${encodeURIComponent(formattedWhatsAppText)}`;
    window.open(url, '_blank');
  };

  const handleOpenEmail = () => {
    const subject = encodeURIComponent(`Apex Windoors Handover Certificate - ${record.projectDetails.projectName} (${record.certificateNo})`);
    const body = encodeURIComponent(formattedWhatsAppText.replace(/\*/g, ''));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Share Handover Certificate</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Share the certified handover summary with the client, site architect, or project manager via WhatsApp or Email.
          </p>

          <div className="relative">
            <textarea
              readOnly
              rows={9}
              value={formattedWhatsAppText}
              className="w-full text-xs font-mono p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none select-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send via WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleOpenEmail}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Or dispatch via email draft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
