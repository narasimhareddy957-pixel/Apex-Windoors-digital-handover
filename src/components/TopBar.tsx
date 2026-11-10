import React from 'react';
import { Printer, ShieldCheck, Layers, Camera, BookOpen, FolderArchive } from 'lucide-react';

export type NavTab = 'form' | 'certificate' | 'schedule' | 'snags' | 'guide' | 'records';

interface TopBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onTriggerPrint: () => void;
  certificateNo: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  onTriggerPrint,
  certificateNo,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-sm tracking-widest shadow-xs">
            AW
          </div>
          <button
            type="button"
            onClick={() => onTabChange('form')}
            className="text-left group cursor-pointer"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block">
              Apex Windoors
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600 overflow-x-auto py-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onTabChange('form')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer ${
              currentTab === 'form'
                ? 'border-sky-600 text-sky-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Handover Form
          </button>
          <button
            type="button"
            onClick={() => onTabChange('certificate')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'certificate'
                ? 'border-sky-600 text-sky-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            Certificate View
          </button>
          <button
            type="button"
            onClick={() => onTabChange('schedule')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'schedule'
                ? 'border-sky-600 text-sky-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-slate-500" />
            Openings Schedule
          </button>
          <button
            type="button"
            onClick={() => onTabChange('snags')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'snags'
                ? 'border-sky-600 text-sky-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-slate-500" />
            Site Photos & Snags
          </button>
          <button
            type="button"
            onClick={() => onTabChange('guide')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'guide'
                ? 'border-sky-600 text-sky-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            Care Guide
          </button>
          <button
            type="button"
            onClick={() => onTabChange('records')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'records'
                ? 'border-sky-600 text-sky-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FolderArchive className="w-4 h-4 text-slate-500" />
            Archive
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onTriggerPrint}
            title={`Print Certificate ${certificateNo}`}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>
    </header>
  );
};
