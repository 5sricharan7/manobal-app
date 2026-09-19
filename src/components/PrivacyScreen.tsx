import React from 'react';
import {
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

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
  const { colors } = useTheme();

  return (
    <div className="space-y-4 pb-20 pt-1 animate-fadeIn max-w-sm mx-auto theme-fade-transition">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs transition-colors py-1 px-2 -ml-2 rounded-xl"
          style={{ color: colors.secondaryText }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>
        <span
          className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full border"
          style={{
            backgroundColor: colors.accentSoft,
            borderColor: colors.accent,
            color: colors.accentText,
          }}
        >
          Privacy First
        </span>
      </div>

      {/* Editorial Title */}
      <section>
        <h1 className="text-2xl font-normal mb-1" style={{ color: colors.primaryText }}>
          Your data. Your choice.
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: colors.secondaryText }}>
          Health data is deeply personal. Manobal is architected around on-device local computation, zero unconsented telemetry, and complete user sovereignty.
        </p>
      </section>

      {/* What We Don't Do (The Negative Boundaries) */}
      <section
        className="rounded-3xl border p-4 space-y-3 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <h3 className="text-xs font-semibold flex items-center gap-2" style={{ color: colors.primaryText }}>
          <EyeOff className="w-4 h-4" style={{ color: colors.accentText }} />
          <span>Explicit Technical Boundaries</span>
        </h3>
        <p className="text-[11px]" style={{ color: colors.secondaryText }}>
          To protect your identity and mental autonomy, Manobal enforces strict prohibitions:
        </p>

        <div className="grid grid-cols-2 gap-2 pt-0.5 text-xs">
          <div
            className="p-2.5 rounded-2xl border flex items-center gap-2"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accentText }} />
            <span className="text-[11px]" style={{ color: colors.primaryText }}>No camera</span>
          </div>
          <div
            className="p-2.5 rounded-2xl border flex items-center gap-2"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accentText }} />
            <span className="text-[11px]" style={{ color: colors.primaryText }}>No microphone</span>
          </div>
          <div
            className="p-2.5 rounded-2xl border flex items-center gap-2"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accentText }} />
            <span className="text-[11px]" style={{ color: colors.primaryText }}>No face scan</span>
          </div>
          <div
            className="p-2.5 rounded-2xl border flex items-center gap-2"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accentText }} />
            <span className="text-[11px]" style={{ color: colors.primaryText }}>No GPS tracking</span>
          </div>
        </div>
      </section>

      {/* Four Discrete Data Categories */}
      <section
        className="rounded-3xl border p-4 space-y-3 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div>
          <span
            className="text-[10px] uppercase font-bold tracking-widest block"
            style={{ color: colors.tertiaryText }}
          >
            DATA ARCHITECTURE
          </span>
          <h3 className="text-sm font-semibold mt-0.5" style={{ color: colors.primaryText }}>
            Segregated Data Streams
          </h3>
        </div>

        <div className="space-y-2">
          {/* Stream 1 */}
          <div
            className="p-3 rounded-2xl border"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="text-xs font-semibold" style={{ color: colors.accentText }}>
                1. Health Connect Data
              </h4>
              <span className="text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
                Local Only
              </span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: colors.secondaryText }}>
              Heart rate, resting HR, HRV, sleep, and steps read exclusively via Android Health Connect API. Stored in local app sandbox memory.
            </p>
          </div>

          {/* Stream 2 */}
          <div
            className="p-3 rounded-2xl border"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="text-xs font-semibold" style={{ color: colors.accentText }}>
                2. Cognitive Game Telemetry
              </h4>
              <span className="text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
                Anonymized Local
              </span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: colors.secondaryText }}>
              Millisecond reaction timestamps, accuracy rates, and error tallies. Minimal raw metrics needed to calculate latency variability.
            </p>
          </div>

          {/* Stream 3 */}
          <div
            className="p-3 rounded-2xl border"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="text-xs font-semibold" style={{ color: colors.accentText }}>
                3. Wellness Check-In Data
              </h4>
              <span className="text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
                User Authored
              </span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: colors.secondaryText }}>
              1-to-5 ratings and optional textual reflections. Saved locally on device. You can delete entries at any time.
            </p>
          </div>

          {/* Stream 4 */}
          <div
            className="p-3 rounded-2xl border"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="text-xs font-semibold" style={{ color: colors.accentText }}>
                4. Product Feedback
              </h4>
              <span className="text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
                App Usability
              </span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: colors.secondaryText }}>
              Star ratings and suggestions about app flow. Strictly segregated from your biometric signals.
            </p>
          </div>
        </div>
      </section>

      {/* User Controls */}
      <section
        className="rounded-3xl border p-4 space-y-3 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
          Your Privacy Controls
        </h3>
        <p className="text-[11px]" style={{ color: colors.secondaryText }}>
          You maintain full authority over all permissions and stored signals.
        </p>

        <div className="flex flex-col gap-2 pt-0.5">
          <button
            onClick={onOpenHealthConnect}
            className="w-full py-2.5 rounded-xl text-xs font-medium transition-colors text-center border active:scale-[0.98]"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
              color: colors.accentText,
            }}
          >
            Manage Health Connect Permissions
          </button>

          <button
            onClick={onClearData}
            className="w-full py-2.5 rounded-xl border text-xs font-medium transition-colors text-center active:scale-[0.98]"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.error,
              color: colors.error,
            }}
          >
            Erase All Local Data on Device
          </button>
        </div>
      </section>
    </div>
  );
};
