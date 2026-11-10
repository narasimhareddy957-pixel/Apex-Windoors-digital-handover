/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HandoverRecord } from './types/handover';
import { INITIAL_RECORD } from './utils/sampleData';
import {
  loadStoredRecords,
  saveStoredRecords,
  getActiveRecordId,
  setActiveRecordId,
} from './utils/storage';
import { TopBar, NavTab } from './components/TopBar';
import { HandoverForm } from './components/HandoverForm';
import { HandoverCertificate } from './components/HandoverCertificate';
import { WindowScheduleManager } from './components/WindowScheduleManager';
import { SnagListManager } from './components/SnagListManager';
import { MaintenanceGuide } from './components/MaintenanceGuide';
import { RecordsArchive } from './components/RecordsArchive';
import { ShareModal } from './components/ShareModal';

export default function App() {
  const [records, setRecords] = useState<HandoverRecord[]>(() => loadStoredRecords());
  const [activeId, setActiveId] = useState<string>(() => getActiveRecordId());
  const [currentTab, setCurrentTab] = useState<NavTab>('form');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    saveStoredRecords(records);
  }, [records]);

  useEffect(() => {
    setActiveRecordId(activeId);
  }, [activeId]);

  // Current active record
  const currentRecord = records.find((r) => r.id === activeId) || records[0] || INITIAL_RECORD;

  const handleUpdateRecord = (updated: HandoverRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleSubmit = (submitted: HandoverRecord) => {
    handleUpdateRecord(submitted);
  };

  const handleTriggerPrint = () => {
    // If not on certificate tab, switch to it, then print
    if (currentTab !== 'certificate') {
      setCurrentTab('certificate');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  const handleResetDefault = () => {
    if (confirm('Reset this certificate back to the default Mr. Lokesh Residence details?')) {
      const reset = { ...INITIAL_RECORD, id: currentRecord.id };
      handleUpdateRecord(reset);
    }
  };

  const handleCreateNewRecord = () => {
    const nextPoNum = Math.floor(Math.random() * 80) + 30;
    const newId = `rec_${Date.now()}`;
    const newRecord: HandoverRecord = {
      id: newId,
      certificateNo: `APX-HO-${new Date().getFullYear()}-00${nextPoNum}`,
      createdAt: new Date().toISOString(),
      status: 'Draft',
      keysHandedOverCount: 6,
      projectDetails: {
        projectName: 'New Residence Project',
        siteAddress: 'Bengaluru, Karnataka',
        contractorName: 'Narasimha Reddy (Apex Windoors)',
        contractorPhone: '+91 98450 45678',
        clientName: 'Client Name',
        clientPhone: '',
        poNo: `${nextPoNum}`,
        completionDate: new Date().toISOString().slice(0, 10),
        profileType: 'uPVC 60mm Casement & 2.5-Track Sliding',
        glassSpecification: '5mm Toughened Clear',
        totalUnits: '10 Units',
        colorFinish: 'Architectural Pure White',
      },
      checklist: INITIAL_RECORD.checklist.map((item) => ({
        ...item,
        status: 'Yes',
        remarks: 'Inspected and verified',
      })),
      windowSchedule: [
        {
          id: `ws_${Date.now()}_1`,
          openingCode: 'W1',
          location: 'Master Bedroom',
          type: '2-Track Sliding Window',
          dimensions: '5\'0" x 4\'0"',
          glassType: '5mm Toughened Clear',
          status: 'Inspected & Passed',
          notes: 'Standard installation',
        },
      ],
      photos: [],
      feedback: {
        rating: 5,
        text: 'Work completed neatly and on time. Satisfied with window operation.',
        verifiedByClient: true,
      },
      clientSignatureDataUrl: '',
      clientSignerName: '',
      contractorSignatureDataUrl: INITIAL_RECORD.contractorSignatureDataUrl,
      contractorSignerName: 'Narasimha Reddy',
      contractorSignedAt: '',
      warrantyPeriod: '10-Year Profile Warranty against discoloration/cracking, 2-Year Hardware Warranty',
    };

    setRecords((prev) => [newRecord, ...prev]);
    setActiveId(newId);
    setCurrentTab('form');
  };

  const handleDuplicateRecord = (rec: HandoverRecord) => {
    const nextPoNum = Math.floor(Math.random() * 80) + 50;
    const newId = `rec_${Date.now()}`;
    const cloned: HandoverRecord = {
      ...rec,
      id: newId,
      certificateNo: `APX-HO-${new Date().getFullYear()}-00${nextPoNum}`,
      createdAt: new Date().toISOString(),
      status: 'Draft',
      projectDetails: {
        ...rec.projectDetails,
        poNo: `${nextPoNum}`,
        projectName: `${rec.projectDetails.projectName} (Copy)`,
      },
      clientSignatureDataUrl: '',
      clientSignedAt: '',
    };

    setRecords((prev) => [cloned, ...prev]);
    setActiveId(newId);
    setCurrentTab('form');
  };

  const handleDeleteRecord = (id: string) => {
    const remaining = records.filter((r) => r.id !== id);
    setRecords(remaining);
    if (activeId === id && remaining.length > 0) {
      setActiveId(remaining[0].id);
    }
  };

  const handleImportRecords = (newRecords: HandoverRecord[]) => {
    setRecords(newRecords);
    if (newRecords.length > 0) {
      setActiveId(newRecords[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <TopBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onTriggerPrint={handleTriggerPrint}
        certificateNo={currentRecord.certificateNo}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Form Mode */}
        {currentTab === 'form' && (
          <HandoverForm
            record={currentRecord}
            onUpdateRecord={handleUpdateRecord}
            onSubmit={handleSubmit}
            onViewCertificate={() => setCurrentTab('certificate')}
            onResetDefault={handleResetDefault}
          />
        )}

        {/* Certificate View & Print Mode */}
        {currentTab === 'certificate' && (
          <HandoverCertificate
            record={currentRecord}
            onEdit={() => setCurrentTab('form')}
            onShare={() => setIsShareModalOpen(true)}
            onPrint={handleTriggerPrint}
          />
        )}

        {/* Window & Door Schedule */}
        {currentTab === 'schedule' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <WindowScheduleManager
              schedule={currentRecord.windowSchedule || []}
              onChangeSchedule={(updated) =>
                handleUpdateRecord({ ...currentRecord, windowSchedule: updated })
              }
            />
          </div>
        )}

        {/* Site Photos & Snags */}
        {currentTab === 'snags' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <SnagListManager
              photos={currentRecord.photos}
              onChangePhotos={(updated) =>
                handleUpdateRecord({ ...currentRecord, photos: updated })
              }
            />
          </div>
        )}

        {/* Operation & Maintenance Guide */}
        {currentTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <MaintenanceGuide
              keysHandedOverCount={currentRecord.keysHandedOverCount}
              contractorPhone={currentRecord.projectDetails.contractorPhone}
            />
          </div>
        )}

        {/* Archive Records */}
        {currentTab === 'records' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <RecordsArchive
              records={records}
              activeRecordId={activeId}
              onSelectRecord={(rec) => {
                setActiveId(rec.id);
                setCurrentTab('certificate');
              }}
              onCreateNewRecord={handleCreateNewRecord}
              onDuplicateRecord={handleDuplicateRecord}
              onDeleteRecord={handleDeleteRecord}
              onImportRecords={handleImportRecords}
            />
          </div>
        )}
      </main>

      {/* WhatsApp & Email Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        record={currentRecord}
      />

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Apex Windoors</span>
            <span>·</span>
            <span>Digital Handover & Quality Assurance System</span>
          </div>
          <div>
            Bengaluru, Karnataka · Narasimha Reddy · support@apexwindoors.in
          </div>
        </div>
      </footer>
    </div>
  );
}
