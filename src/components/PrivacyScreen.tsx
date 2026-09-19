import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface PrivacyScreenProps {
  onBack: () => void;
  onOpenHealthConnect: () => void;
  onClearData: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  onBack,
  onOpenHealthConnect,
  onClearData,
}) => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#8EA898] hover:text-[#F4F7F4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#2FE4A6] bg-[#0E2319] px-2.5 py-0.5 rounded-full border border-[#1B4330]">
          Privacy First
        </span>
      </div>

      {/* Editorial Title */}
      <section>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6] block mb-1">
          PRIVACY BY DESIGN
        </span>
        <h1 className="text-3xl font-editorial italic text-[#F4F7F4] mb-2">
          Your data. Your choice.
        </h1>
        <p className="text-xs text-[#8EA898] leading-relaxed">
          Health data is deeply personal. Manobah is architected around on-device local computation, zero unconsented telemetry, and complete user sovereignty.
        </p>
      </section>

      {/* What We Don't Do (The Negative Boundaries) */}
      <section className="rounded-3xl bg-[#0B2016] border border-[#1A4430] p-5 space-y-3">
        <h3 className="text-sm font-semibold text-[#F4F7F4] flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-[#2FE4A6]" />
          <span>Explicit Technical Boundaries</span>
        </h3>
        <p className="text-xs text-[#8EA898]">
          To protect your identity and mental autonomy, Manobah enforces strict prohibitions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-3 rounded-2xl bg-[#081810] border border-[#143525] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2FE4A6] shrink-0" />
            <span className="text-[#D8E6DD]">No camera required</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#081810] border border-[#143525] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2FE4A6] shrink-0" />
            <span className="text-[#D8E6DD]">No microphone required</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#081810] border border-[#143525] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2FE4A6] shrink-0" />
            <span className="text-[#D8E6DD]">No facial recognition</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#081810] border border-[#143525] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#2FE4A6] shrink-0" />
            <span className="text-[#D8E6DD]">No location tracking</span>
          </div>
        </div>
      </section>

      {/* Four Discrete Data Categories */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#19402E] p-5 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
            DATA ARCHITECTURE
          </span>
          <h3 className="text-base font-semibold text-[#F4F7F4] mt-0.5">
            Four Segregated Data Streams
          </h3>
        </div>

        <div className="space-y-3">
          {/* Stream 1 */}
          <div className="p-3.5 rounded-2xl bg-[#081A12] border border-[#163B29]">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-semibold text-[#2FE4A6]">1. Health Connect Data</h4>
              <span className="text-[10px] text-[#8EA898] font-mono">Local Only</span>
            </div>
            <p className="text-[11px] text-[#8EA898] leading-relaxed">
              Heart rate, resting HR, HRV, sleep, and steps read exclusively via Android Health Connect API. Stored in local app sandbox memory. Never transmitted to remote servers in this MVP.
            </p>
          </div>

          {/* Stream 2 */}
          <div className="p-3.5 rounded-2xl bg-[#081A12] border border-[#163B29]">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-semibold text-[#2FE4A6]">2. Cognitive Game Telemetry</h4>
              <span className="text-[10px] text-[#8EA898] font-mono">Anonymized Local</span>
            </div>
            <p className="text-[11px] text-[#8EA898] leading-relaxed">
              Millisecond reaction timestamps, accuracy rates, and error tallies. Minimal raw metrics needed to calculate latency variability. Kept strictly on-device.
            </p>
          </div>

          {/* Stream 3 */}
          <div className="p-3.5 rounded-2xl bg-[#081A12] border border-[#163B29]">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-semibold text-[#2FE4A6]">3. Wellness Check-In Data</h4>
              <span className="text-[10px] text-[#8EA898] font-mono">User Authored</span>
            </div>
            <p className="text-[11px] text-[#8EA898] leading-relaxed">
              1-to-5 ratings and optional textual reflections. Saved locally in encrypted app storage. You can delete or edit any entry at any time.
            </p>
          </div>

          {/* Stream 4 */}
          <div className="p-3.5 rounded-2xl bg-[#081A12] border border-[#163B29]">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-semibold text-[#2FE4A6]">4. Product Feedback</h4>
              <span className="text-[10px] text-[#8EA898] font-mono">App Usability</span>
            </div>
            <p className="text-[11px] text-[#8EA898] leading-relaxed">
              Star ratings and suggestions about app flow. Strictly segregated from your health signals and cognitive scores.
            </p>
          </div>
        </div>
      </section>

      {/* User Controls */}
      <section className="rounded-3xl bg-[#0B2016] border border-[#1A4430] p-5 space-y-3">
        <h3 className="text-sm font-semibold text-[#F4F7F4]">Your Privacy Controls</h3>
        <p className="text-xs text-[#8EA898]">
          You maintain full authority over all permissions and stored signals.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={onOpenHealthConnect}
            className="w-full py-2.5 rounded-xl bg-[#143526] hover:bg-[#1A4430] text-[#2FE4A6] text-xs font-medium transition-colors text-center"
          >
            Manage Health Connect Permissions
          </button>

          <button
            onClick={onClearData}
            className="w-full py-2.5 rounded-xl border border-[#3C1C1C] text-[#F28B82] hover:bg-[#200D0D] text-xs font-medium transition-colors text-center"
          >
            Erase All Local Data on Device
          </button>
        </div>
      </section>
    </div>
  );
};
