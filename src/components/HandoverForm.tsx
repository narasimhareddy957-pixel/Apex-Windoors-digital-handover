import React, { useState } from 'react';
import { HandoverRecord, InspectionStatus } from '../types/handover';
import { SignaturePad } from './SignaturePad';
import {
  CheckCircle2,
  Building,
  MapPin,
  Calendar,
  FileCheck2,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  Eye,
  Send,
  Star,
} from 'lucide-react';

interface HandoverFormProps {
  record: HandoverRecord;
  onUpdateRecord: (updated: HandoverRecord) => void;
  onSubmit: (submitted: HandoverRecord) => void;
  onViewCertificate: () => void;
  onResetDefault: () => void;
}

export const HandoverForm: React.FC<HandoverFormProps> = ({
  record,
  onUpdateRecord,
  onSubmit,
  onViewCertificate,
  onResetDefault,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Field change handler for Project Details
  const handleProjectDetailChange = (field: keyof HandoverRecord['projectDetails'], value: string) => {
    onUpdateRecord({
      ...record,
      projectDetails: {
        ...record.projectDetails,
        [field]: value,
      },
    });
  };

  // Checklist status change handler
  const handleChecklistStatusChange = (id: number, status: InspectionStatus) => {
    const updated = record.checklist.map((item) => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    onUpdateRecord({ ...record, checklist: updated });
  };

  // Checklist remarks change handler
  const handleChecklistRemarksChange = (id: number, remarks: string) => {
    const updated = record.checklist.map((item) => {
      if (item.id === id) {
        return { ...item, remarks };
      }
      return item;
    });
    onUpdateRecord({ ...record, checklist: updated });
  };

  // Mark all checklist items as Yes
  const markAllYes = () => {
    const updated = record.checklist.map((item) => ({
      ...item,
      status: 'Yes' as InspectionStatus,
      remarks: item.remarks || 'Inspected and verified passed',
    }));
    onUpdateRecord({ ...record, checklist: updated });
  };

  // Add custom checklist item
  const addChecklistItem = () => {
    const nextId = Math.max(0, ...record.checklist.map((c) => c.id)) + 1;
    const newItem = {
      id: nextId,
      description: 'Custom inspection item (e.g. Fly mesh / glass cleanliness)',
      status: 'Yes' as InspectionStatus,
      remarks: 'Verified on site',
    };
    onUpdateRecord({ ...record, checklist: [...record.checklist, newItem] });
  };

  // Delete checklist item
  const removeChecklistItem = (id: number) => {
    if (record.checklist.length <= 1) return;
    const updated = record.checklist.filter((item) => item.id !== id);
    onUpdateRecord({ ...record, checklist: updated });
  };

  // Feedback change handler
  const handleFeedbackTextChange = (text: string) => {
    onUpdateRecord({
      ...record,
      feedback: {
        ...record.feedback,
        text,
      },
    });
  };

  const handleRatingChange = (rating: number) => {
    onUpdateRecord({
      ...record,
      feedback: {
        ...record.feedback,
        rating,
      },
    });
  };

  // Signature change
  const handleClientSignatureChange = (dataUrl: string) => {
    onUpdateRecord({
      ...record,
      clientSignatureDataUrl: dataUrl,
      clientSignedAt: dataUrl ? new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST' : '',
    });
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedSubmission: HandoverRecord = {
      ...record,
      status: 'Certified',
      createdAt: new Date().toISOString(),
      clientSignedAt: record.clientSignedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessBanner(true);
      onSubmit(updatedSubmission);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span className="text-xs font-bold text-sky-800 tracking-wider uppercase">
                Digital Handover Certificate
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Apex Windoors - Client Digital Handover Form
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Final installation inspection, quality assurance checklist, and client sign-off.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Reset form to default Mr. Lokesh Residence"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>
            <button
              type="button"
              onClick={onViewCertificate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              View Certificate
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Project Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" />
              Project Details
            </h2>
            <span className="text-xs font-mono text-slate-400">PO Ref: #{record.projectDetails.poNo}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Project/Site Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={record.projectDetails.projectName}
                onChange={(e) => handleProjectDetailChange('projectName', e.target.value)}
                placeholder="e.g. Mr. Lokesh Residence"
                required
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Site Address / Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={record.projectDetails.siteAddress}
                onChange={(e) => handleProjectDetailChange('siteAddress', e.target.value)}
                placeholder="e.g. Basaveshwara Nagar, Bengaluru"
                required
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Contractor / Vendor Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={record.projectDetails.contractorName}
                onChange={(e) => handleProjectDetailChange('contractorName', e.target.value)}
                placeholder="e.g. Narasimha Reddy (Apex Windoors)"
                required
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Purchase Order / Quote No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={record.projectDetails.poNo}
                onChange={(e) => handleProjectDetailChange('poNo', e.target.value)}
                placeholder="e.g. 25"
                required
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date of Installation Completion <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={record.projectDetails.completionDate}
                onChange={(e) => handleProjectDetailChange('completionDate', e.target.value)}
                required
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Profiles / Scope of Work
              </label>
              <input
                type="text"
                value={record.projectDetails.profileType}
                onChange={(e) => handleProjectDetailChange('profileType', e.target.value)}
                placeholder="e.g. uPVC 60mm Casement / 2.5-Track Sliding"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Profile Color / Finish
              </label>
              <input
                type="text"
                value={record.projectDetails.colorFinish || ''}
                onChange={(e) => handleProjectDetailChange('colorFinish', e.target.value)}
                placeholder="e.g. Architectural Pure White / Anthracite Grey / Golden Oak"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Keys Handed Over to Client (Quantity)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={record.keysHandedOverCount || 8}
                onChange={(e) =>
                  onUpdateRecord({
                    ...record,
                    keysHandedOverCount: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Quality Assurance & Inspection Checklist */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-sky-600" />
                Quality Assurance & Inspection Checklist
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify each structural and operational parameter before handing over to the client.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllYes}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Mark All Yes (Passed)
              </button>
              <button
                type="button"
                onClick={addChecklistItem}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-3 px-3 w-12 text-center">SI</th>
                  <th className="py-3 px-3 min-w-[260px]">Inspection Item Description</th>
                  <th className="py-3 px-3 w-32 text-center">Status</th>
                  <th className="py-3 px-3 min-w-[200px]">Remarks / Field Verification</th>
                  <th className="py-3 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {record.checklist.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 text-xs">
                        {item.description}
                      </div>
                      {item.category && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Category: {item.category}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <select
                        value={item.status}
                        onChange={(e) => handleChecklistStatusChange(item.id, e.target.value as InspectionStatus)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded border transition-all ${
                          item.status === 'Yes'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'No'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Yes">Yes (Pass)</option>
                        <option value="No">No (Fail)</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => handleChecklistRemarksChange(item.id, e.target.value)}
                        placeholder="Add inspection remark..."
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500 text-slate-800"
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      {record.checklist.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChecklistItem(item.id)}
                          title="Remove item"
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Feedback & Sign-Off */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Feedback & Sign-Off</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Record client satisfaction and capture official digital authorization.
            </p>
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Client Overall Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (record.feedback.rating || 5)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-slate-600 ml-2">
                {record.feedback.rating || 5} of 5 Stars
              </span>
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Feedback of work <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={record.feedback.text}
              onChange={(e) => handleFeedbackTextChange(e.target.value)}
              placeholder="Enter client feedback on window/door installation, finish, and team cleanliness..."
              required
              className="w-full text-sm p-3.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900"
            />
          </div>

          {/* Client Signer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Client Signer Full Name</label>
              <input
                type="text"
                value={record.clientSignerName || record.projectDetails.clientName}
                onChange={(e) =>
                  onUpdateRecord({
                    ...record,
                    clientSignerName: e.target.value,
                  })
                }
                placeholder="e.g. Mr. Lokesh Kumar"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Apex Windoors Authorized Representative
              </label>
              <input
                type="text"
                value={record.contractorSignerName}
                onChange={(e) =>
                  onUpdateRecord({
                    ...record,
                    contractorSignerName: e.target.value,
                  })
                }
                placeholder="e.g. Narasimha Reddy"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
              />
            </div>
          </div>

          {/* Interactive Signature Pad */}
          <SignaturePad
            initialDataUrl={record.clientSignatureDataUrl}
            onSaveSignature={handleClientSignatureChange}
            signerName={record.clientSignerName || record.projectDetails.clientName || 'Mr. Lokesh Kumar'}
            label="Client Signature (Draw below)"
          />
        </div>

        {/* SECTION 4: Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Synchronizing Handover Data...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Auto-Submit Handover Data</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Notification Banner */}
      {showSuccessBanner && (
        <div
          id="successMessage"
          className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-5 rounded-xl shadow-sm text-center space-y-3 transition-all"
        >
          <div className="flex items-center justify-center gap-2 font-bold text-base text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Handover submitted successfully! Data and signature synchronized with database.</span>
          </div>
          <p className="text-xs text-emerald-700 max-w-lg mx-auto">
            Certificate <span className="font-mono font-bold">{record.certificateNo}</span> is certified and ready for printing or sharing with the client.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={onViewCertificate}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              View Official Certificate
            </button>
            <button
              type="button"
              onClick={() => setShowSuccessBanner(false)}
              className="px-3 py-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
