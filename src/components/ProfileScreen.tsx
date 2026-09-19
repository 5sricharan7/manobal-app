import React from 'react';
import {
  ShieldCheck,
  Smartphone,
  Lock,
  FileText,
  Trash2,
  RotateCcw,
  Activity,
  Heart,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { HealthSignals } from '../types';

interface ProfileScreenProps {
  healthSignals: HealthSignals;
  onOpenHealthConnect: () => void;
  onNavigatePrivacy: () => void;
  onNavigateTerms: () => void;
  onOpenAndroidCode: () => void;
  onClearLocalData: () => void;
  onResetPermissions: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  healthSignals,
  onOpenHealthConnect,
  onNavigatePrivacy,
  onNavigateTerms,
  onOpenAndroidCode,
  onClearLocalData,
  onResetPermissions,
}) => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Profile Header */}
      <section className="pt-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6] block mb-1">
          MANOBAH PROFILE
        </span>
        <h1 className="text-2xl font-editorial italic text-[#F4F7F4] mb-1">
          Settings & Identity
        </h1>
        <p className="text-xs text-[#8EA898]">
          Manage connected health sources, security settings, and device permissions.
        </p>
      </section>

      {/* User Identity Card */}
      <section className="p-4 rounded-3xl bg-[#0D2319] border border-[#19402E] flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#143625] border border-[#205139] flex items-center justify-center text-[#2FE4A6] font-bold text-lg">
          M
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#F4F7F4]">Local Personnel Profile</h3>
            <span className="text-[10px] font-mono text-[#2FE4A6] bg-[#071710] px-2 py-0.5 rounded-full border border-[#173826]">
              On-Device
            </span>
          </div>
          <p className="text-xs text-[#8EA898] mt-0.5">
            Manobah-AI Welfare Signal Companion
          </p>
        </div>
      </section>

      {/* Native Android Project Inspector Banner */}
      <section className="p-4 rounded-3xl bg-[#0C1F16] border-2 border-[#1E4D37] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#112E20] border border-[#1F5439] flex items-center justify-center text-[#2FE4A6]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#F4F7F4]">Native Android Architecture</h3>
            <p className="text-[11px] text-[#8EA898]">Jetpack Compose • Health Connect Client</p>
          </div>
        </div>

        <button
          onClick={onOpenAndroidCode}
          className="px-3 py-1.5 rounded-xl bg-[#2FE4A6] hover:bg-[#4EF2BB] text-[#06110C] font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
        >
          <span>View Source</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </section>

      {/* Connected Health Sources */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#19402E] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
            DATA SOURCES
          </span>
          <span className="text-[11px] text-[#8EA898]">Android Health Connect</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#081810] border border-[#143424] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#112F21] flex items-center justify-center text-[#2FE4A6]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F4F7F4]">Health Connect Status</p>
              <p className="text-[10px] text-[#8EA898]">
                {healthSignals.isConnected ? 'Connected & Permissions Active' : 'Disconnected / No Permissions'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenHealthConnect}
            className="px-3 py-1.5 rounded-xl bg-[#143425] hover:bg-[#1A4230] text-xs text-[#2FE4A6] font-medium transition-colors"
          >
            Configure
          </button>
        </div>

        {/* Active Permission Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-[#07170F] border border-[#133022] flex items-center justify-between">
            <span className="text-[#8EA898]">Heart Rate & HRV</span>
            <span className={`text-[10px] font-mono ${healthSignals.permissionsGranted.heartRate ? 'text-[#2FE4A6]' : 'text-[#6A8272]'}`}>
              {healthSignals.permissionsGranted.heartRate ? 'Granted' : 'Revoked'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#07170F] border border-[#133022] flex items-center justify-between">
            <span className="text-[#8EA898]">Sleep Sessions</span>
            <span className={`text-[10px] font-mono ${healthSignals.permissionsGranted.sleep ? 'text-[#2FE4A6]' : 'text-[#6A8272]'}`}>
              {healthSignals.permissionsGranted.sleep ? 'Granted' : 'Revoked'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#07170F] border border-[#133022] flex items-center justify-between">
            <span className="text-[#8EA898]">Steps & Cadence</span>
            <span className={`text-[10px] font-mono ${healthSignals.permissionsGranted.steps ? 'text-[#2FE4A6]' : 'text-[#6A8272]'}`}>
              {healthSignals.permissionsGranted.steps ? 'Granted' : 'Revoked'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#07170F] border border-[#133022] flex items-center justify-between">
            <span className="text-[#8EA898]">HRV RMSSD</span>
            <span className={`text-[10px] font-mono ${healthSignals.permissionsGranted.hrv ? 'text-[#2FE4A6]' : 'text-[#6A8272]'}`}>
              {healthSignals.permissionsGranted.hrv ? 'Granted' : 'Revoked'}
            </span>
          </div>
        </div>
      </section>

      {/* Navigation Options: Privacy, Terms, About */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#19402E] divide-y divide-[#153826] overflow-hidden">
        <button
          onClick={onNavigatePrivacy}
          className="w-full p-4 flex items-center justify-between hover:bg-[#102B1E] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-[#2FE4A6]" />
            <div>
              <p className="text-xs font-semibold text-[#F4F7F4]">Privacy Policy & Safeguards</p>
              <p className="text-[10px] text-[#8EA898]">Your data. Your choice. Local-only architecture.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8EA898]" />
        </button>

        <button
          onClick={onNavigateTerms}
          className="w-full p-4 flex items-center justify-between hover:bg-[#102B1E] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#2FE4A6]" />
            <div>
              <p className="text-xs font-semibold text-[#F4F7F4]">Terms & Conditions</p>
              <p className="text-[10px] text-[#8EA898]">MVP research prototype disclaimer and limitations.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8EA898]" />
        </button>

        <div className="p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#2FE4A6] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#F4F7F4]">About Manobah-AI</p>
            <p className="text-[11px] text-[#8EA898] leading-relaxed mt-0.5">
              Part of the Welfare Signal project. Explores non-invasive cognitive and physiological telemetry for proactive personnel welfare intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Danger Zone: Erase Data & Reset Permissions */}
      <section className="p-4 rounded-3xl bg-[#0A1A12] border border-[#231717] space-y-2">
        <h3 className="text-xs font-semibold text-[#F4F7F4]">Data Management & Reset</h3>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onResetPermissions}
            className="flex-1 py-2.5 rounded-xl border border-[#193F2D] text-[11px] font-medium text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#112A1E] transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Permissions</span>
          </button>

          <button
            onClick={onClearLocalData}
            className="flex-1 py-2.5 rounded-xl border border-[#401C1C] text-[11px] font-medium text-[#F28B82] hover:bg-[#260E0E] transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Local Data</span>
          </button>
        </div>
      </section>

      {/* Health Disclaimer Footer */}
      <div className="p-3.5 rounded-2xl bg-[#06130D] border border-[#133022] text-[10px] text-[#789682] leading-relaxed">
        <strong className="text-[#A4C2AF] block mb-0.5">Health Disclaimer:</strong>
        Manobah provides wellness and cognitive insights based on user-provided and device-derived signals. It is not a medical device and does not diagnose, treat, or prevent any medical condition.
      </div>
    </div>
  );
};
