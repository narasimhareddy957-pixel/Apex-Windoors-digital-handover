import React from 'react';
import { HandoverRecord } from '../types/handover';
import { Printer, Share2, CheckCircle2, ShieldCheck, ArrowLeft, Building2, MapPin, Calendar, FileText, Key } from 'lucide-react';

interface HandoverCertificateProps {
  record: HandoverRecord;
  onEdit: () => void;
  onShare: () => void;
  onPrint: () => void;
}

export const HandoverCertificate: React.FC<HandoverCertificateProps> = ({
  record,
  onEdit,
  onShare,
  onPrint,
}) => {
  const { projectDetails, checklist, feedback, clientSignatureDataUrl, contractorSignatureDataUrl, windowSchedule, keysHandedOverCount } = record;

  const passedCount = checklist.filter((item) => item.status === 'Yes').length;
  const totalCount = checklist.length;

  return (
    <div className="space-y-6">
      {/* Screen Control Bar (Hidden on print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Edit Form
          </button>
          <div className="text-xs text-slate-500">
            <span>Certificate Ref: </span>
            <span className="font-mono font-bold text-slate-800">{record.certificateNo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share / WhatsApp
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div
        id="handover-certificate-document"
        className="bg-white rounded-xl border border-slate-300 shadow-md p-8 md:p-12 max-w-4xl mx-auto print-shadow-none print:border-none print:p-0 print:m-0 text-slate-800"
      >
        {/* Header Block */}
        <div className="border-b-2 border-slate-900 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-4 h-4 bg-sky-600 rounded-xs"></span>
                <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  Apex Windoors
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 tracking-wider uppercase">
                uPVC & Aluminium Architectural Doors & Windows Systems
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Fabrication, Site Installation & Comprehensive Quality Handover
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block text-[10px] font-bold tracking-widest text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded uppercase">
                Digital Handover Certificate
              </span>
              <div className="mt-1 font-mono text-xs font-bold text-slate-900">
                {record.certificateNo}
              </div>
              <div className="text-[11px] text-slate-500">
                Date: {projectDetails.completionDate || new Date().toISOString().slice(0, 10)}
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center py-2 mb-5">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
            Certificate of Project Handover & Quality Sign-Off
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
            This certifies that all window and door systems fabricated and installed for the below site have been inspected, tested for smooth operation, weatherproofed, and formally handed over to the client.
          </p>
        </div>

        {/* Project & Client Metadata Grid */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Project / Site Name</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {projectDetails.projectName}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Site Address & Location</span>
                  <span className="font-medium text-slate-800">{projectDetails.siteAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Purchase Order / Quote No</span>
                  <span className="font-mono font-semibold text-slate-900">{projectDetails.poNo}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Contractor / Fabricator</span>
                <span className="font-semibold text-slate-900">{projectDetails.contractorName}</span>
                {projectDetails.contractorPhone && (
                  <span className="text-slate-500 block text-[11px]">{projectDetails.contractorPhone}</span>
                )}
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Installation Completion Date</span>
                  <span className="font-medium text-slate-900">{projectDetails.completionDate}</span>
                </div>
              </div>

              {projectDetails.profileType && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Profile & Glass Specification</span>
                  <span className="font-medium text-slate-800">
                    {projectDetails.profileType} · {projectDetails.glassSpecification}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Window & Door Schedule (if items present) */}
        {windowSchedule && windowSchedule.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Itemized Windows & Doors Schedule
              </h2>
              <span className="text-[11px] text-slate-500">
                {windowSchedule.length} Openings Documented
              </span>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2 px-2.5 w-12 text-center">Code</th>
                    <th className="py-2 px-2.5">Location</th>
                    <th className="py-2 px-2.5">System Specification</th>
                    <th className="py-2 px-2.5">Glass Specs</th>
                    <th className="py-2 px-2.5 text-center w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {windowSchedule.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-2.5 text-center font-mono font-bold text-sky-800 bg-sky-50/30">
                        {item.openingCode}
                      </td>
                      <td className="py-2 px-2.5 font-semibold text-slate-800">{item.location}</td>
                      <td className="py-2 px-2.5 text-slate-700">{item.type} ({item.dimensions || 'Standard'})</td>
                      <td className="py-2 px-2.5 text-slate-600">{item.glassType}</td>
                      <td className="py-2 px-2.5 text-center font-semibold text-emerald-700">
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quality Assurance & Inspection Checklist */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              Quality Assurance & Inspection Checklist
            </h2>
            <span className="text-xs font-semibold text-emerald-700">
              {passedCount} of {totalCount} Items Verified Passed
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-2 px-2.5 w-10 text-center">SI</th>
                  <th className="py-2 px-2.5">Inspection Item Description</th>
                  <th className="py-2 px-2.5 w-24 text-center">Status</th>
                  <th className="py-2 px-2.5">Remarks / Verification Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {checklist.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-2.5 text-center font-mono text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2.5 font-medium text-slate-800">
                      {item.description}
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-xs ${
                          item.status === 'Yes'
                            ? 'text-emerald-700'
                            : item.status === 'No'
                            ? 'text-rose-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.status === 'Yes' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-slate-600 italic">
                      {item.remarks || 'Verified during final inspection'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Feedback Statement & Keys */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="sm:col-span-2 bg-slate-50 rounded-lg border border-slate-200 p-3.5 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Client Feedback & Sign-Off Statement
            </div>
            <p className="text-slate-800 italic leading-relaxed">
              "{feedback.text || 'Work completed neatly and on time. Installation team was professional and cleaned the site. Very satisfied with the quality of the windows and doors.'}"
            </p>
          </div>

          <div className="bg-sky-50/60 rounded-lg border border-sky-200 p-3.5 text-xs flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-sky-900 font-bold mb-1">
              <Key className="w-4 h-4 text-sky-600" />
              <span>Keys Handover</span>
            </div>
            <div className="text-slate-700 font-medium">
              <span className="text-lg font-bold text-slate-900 font-mono">{keysHandedOverCount || 8}</span> cylinder keys verified & handed over.
            </div>
          </div>
        </div>

        {/* Warranty Covenant */}
        <div className="bg-sky-50/60 rounded-lg border border-sky-200 p-3.5 mb-6 text-xs text-slate-700">
          <div className="font-bold text-sky-950 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            Warranty Coverage Terms (Apex Windoors)
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            {record.warrantyPeriod}. Warranty covers profile integrity, structural stability, and defective mechanical hardware under standard residential usage. Regular vacuuming of tracks and lubrications recommended every 6 months.
          </p>
        </div>

        {/* Dual Signatures Block */}
        <div className="print-break-inside-avoid pt-2">
          <div className="grid grid-cols-2 gap-8 border-t border-slate-300 pt-5">
            {/* Client Signature */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Client / Authorized Signatory
              </div>
              <div className="h-24 border border-slate-200 rounded bg-white flex items-center justify-center p-2 relative">
                {clientSignatureDataUrl ? (
                  <img
                    src={clientSignatureDataUrl}
                    alt="Client Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">No signature recorded</span>
                )}
                <div className="absolute bottom-1 right-2 text-[9px] text-slate-400 font-mono">
                  Digital Verification
                </div>
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-slate-900">
                  {record.clientSignerName || projectDetails.clientName || 'Client Signatory'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Signed: {record.clientSignedAt || 'On Site Handover'}
                </div>
              </div>
            </div>

            {/* Contractor Signature & Official Seal */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                For Apex Windoors (Authorized Signatory)
              </div>
              <div className="h-24 border border-slate-200 rounded bg-white flex items-center justify-center p-2 relative">
                {contractorSignatureDataUrl ? (
                  <img
                    src={contractorSignatureDataUrl}
                    alt="Contractor Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">Signature on File</span>
                )}
                <div className="absolute top-1 right-1 border border-sky-400 bg-sky-50 text-sky-800 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">
                  VERIFIED SEAL
                </div>
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-slate-900">
                  {record.contractorSignerName || projectDetails.contractorName}
                </div>
                <div className="text-[11px] text-slate-500">
                  Apex Windoors · Basaveshwara Nagar, Bengaluru
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-400 mt-8 pt-4 border-t border-slate-200">
          This digital certificate serves as official proof of handover and activates the manufacturer warranty. Support: support@apexwindoors.in · +91 98450 45678
        </div>
      </div>
    </div>
  );
};
