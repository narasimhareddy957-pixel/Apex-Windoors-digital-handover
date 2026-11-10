import React, { useState } from 'react';
import { HandoverRecord } from '../types/handover';
import {
  FolderArchive,
  Search,
  Plus,
  Eye,
  Copy,
  Trash2,
  Download,
  Upload,
  Calendar,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { exportRecordsAsJSON } from '../utils/storage';

interface RecordsArchiveProps {
  records: HandoverRecord[];
  activeRecordId: string;
  onSelectRecord: (record: HandoverRecord) => void;
  onCreateNewRecord: () => void;
  onDuplicateRecord: (record: HandoverRecord) => void;
  onDeleteRecord: (id: string) => void;
  onImportRecords: (records: HandoverRecord[]) => void;
}

export const RecordsArchive: React.FC<RecordsArchiveProps> = ({
  records,
  activeRecordId,
  onSelectRecord,
  onCreateNewRecord,
  onDuplicateRecord,
  onDeleteRecord,
  onImportRecords,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Certified' | 'Draft'>('All');

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.projectDetails.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.projectDetails.siteAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.projectDetails.poNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.certificateNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' ? true : rec.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportRecords(parsed);
          alert(`Successfully imported ${parsed.length} handover record(s).`);
        } else {
          alert('Invalid JSON file format.');
        }
      } catch (err) {
        console.error('Failed to import JSON', err);
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-sky-600" />
            Handover Certificate Records & Archive
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View, search, print, or duplicate previously completed installation certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={() => exportRecordsAsJSON(records)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
          <button
            type="button"
            onClick={onCreateNewRecord}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Handover</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, location, or PO..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:border-sky-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 p-1 rounded-lg">
          {(['All', 'Certified', 'Draft'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterStatus === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-3 px-3">Certificate Ref</th>
              <th className="py-3 px-3 min-w-[180px]">Project / Client</th>
              <th className="py-3 px-3 min-w-[160px]">Site Location</th>
              <th className="py-3 px-3 text-center">PO #</th>
              <th className="py-3 px-3 text-center">Completion</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredRecords.map((rec) => {
              const isSelected = rec.id === activeRecordId;
              return (
                <tr
                  key={rec.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-sky-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-sky-800">
                    <div className="flex items-center gap-1.5">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>}
                      <span>{rec.certificateNo}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.projectDetails.projectName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Client: {rec.projectDetails.clientName}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {rec.projectDetails.siteAddress}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                    {rec.projectDetails.poNo}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{rec.projectDetails.completionDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                        rec.status === 'Certified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {rec.status === 'Certified' && <CheckCircle2 className="w-3 h-3" />}
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectRecord(rec)}
                        title="Open this certificate in form/view"
                        className="p-1.5 text-sky-700 hover:bg-sky-100 rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateRecord(rec)}
                        title="Duplicate as new template"
                        className="p-1.5 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {records.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete certificate ${rec.certificateNo}?`)) {
                              onDeleteRecord(rec.id);
                            }
                          }}
                          title="Delete record"
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-8 text-xs text-slate-500">
          No handover records matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};
