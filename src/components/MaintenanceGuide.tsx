import React from 'react';
import { Shield, Wrench, Droplets, Key, Sparkles, AlertCircle, Phone, Mail } from 'lucide-react';

interface MaintenanceGuideProps {
  keysHandedOverCount?: number;
  contractorPhone?: string;
}

export const MaintenanceGuide: React.FC<MaintenanceGuideProps> = ({
  keysHandedOverCount = 8,
  contractorPhone = '+91 98450 45678',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-600" />
            Client Operation & Maintenance Guidelines
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential care recommendations handed over to ensure smooth operation and maintain 10-year warranty coverage.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">
          <Key className="w-4 h-4 text-sky-700" />
          <span className="text-xs font-bold text-sky-900">
            {keysHandedOverCount} Keys Handed Over
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guide 1 */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>1. Profile & Glass Cleaning</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clean uPVC/Aluminium frames using lukewarm water with mild liquid soap and a soft microfiber cloth.
            <strong className="text-slate-800"> Never use abrasive scrubbers, acetone, thinners, or hydrochloric acid</strong> which damages the UV coating and silicone seals.
          </p>
        </div>

        {/* Guide 2 */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Wrench className="w-4 h-4 text-emerald-600" />
            <span>2. Track & Roller Care</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vacuum the bottom sliding tracks once every 3–4 months to remove dust, construction sand, or grit. Periodic removal of grit prevents excessive friction and extends nylon/brass roller lifespan.
          </p>
        </div>

        {/* Guide 3 */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>3. Hardware & Multi-point Lock Lubrication</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Apply light silicone spray or sewing machine oil to locking transmission gearboxes (espagnolettes) and friction stay sliding hinges once every 6–12 months. Do not force handles if sashes are not aligned.
          </p>
        </div>

        {/* Guide 4 */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-indigo-600" />
            <span>4. Drainage & Weather Protection</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ensure exterior weep hole caps and drainage slots remain open before monsoon seasons. In high-wind rains, close sashes and engage multi-point locks completely to compress weatherstripping gaskets.
          </p>
        </div>
      </div>

      {/* Support & Contact Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-0.5">
            Apex Windoors Quality Desk
          </span>
          <h3 className="text-sm font-bold">Need Service, Re-alignment, or Warranty Assistance?</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Our authorized technicians provide scheduled tune-ups and hardware warranty claims across Bengaluru.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`tel:${contractorPhone}`}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-sky-600" />
            <span>Call Support</span>
          </a>
          <a
            href="mailto:support@apexwindoors.in"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
};
