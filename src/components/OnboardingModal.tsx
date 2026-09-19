import React from 'react';
import { ShieldCheck, Activity, Brain, HeartHandshake, ArrowRight } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onConnectHealth: () => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onConnectHealth,
  onSkip,
}) => {
  const { colors, isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(15,23,42,0.45)' }}
    >
      <div
        id="onboarding-welcome-dialog"
        className="w-full max-w-sm rounded-3xl border p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.primaryText,
        }}
      >
        {/* Brand Accent */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] uppercase font-bold tracking-widest"
            style={{ color: colors.accentText }}
          >
            MANOBAL-AI
          </span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
          <span className="text-[10px]" style={{ color: colors.tertiaryText }}>
            MOBILE ONBOARDING
          </span>
        </div>

        {/* Editorial Heading */}
        <h1 className="text-2xl font-normal leading-tight mb-2 font-editorial" style={{ color: colors.primaryText }}>
          Personal<br />
          <span className="italic font-normal" style={{ color: colors.accentText }}>
            Welfare
          </span><br />
          Intelligence.
        </h1>

        <p className="text-xs leading-relaxed mb-5" style={{ color: colors.secondaryText }}>
          Manobal brings together everyday wellness signals and short cognitive exercises to help you understand your personal patterns.
        </p>

        {/* Feature Grid */}
        <div className="space-y-2.5 mb-5">
          <div
            className="p-3 rounded-2xl border flex items-start gap-3"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
                color: colors.accentText,
              }}
            >
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
                Health Data
              </h4>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: colors.secondaryText }}>
                Seamless local reads via Android Health Connect for HR, sleep, steps, and HRV.
              </p>
            </div>
          </div>

          <div
            className="p-3 rounded-2xl border flex items-start gap-3"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
                color: colors.accentText,
              }}
            >
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
                Cognitive Mini-Games
              </h4>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: colors.secondaryText }}>
                90-second objective tasks observing attention, working memory, and inhibition.
              </p>
            </div>
          </div>

          <div
            className="p-3 rounded-2xl border flex items-start gap-3"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
                color: colors.accentText,
              }}
            >
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
                Daily Check-Ins
              </h4>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: colors.secondaryText }}>
                Gentle self-reflection scales to align your internal state with sensor signals.
              </p>
            </div>
          </div>

          <div
            className="p-3 rounded-2xl border flex items-start gap-3"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
                color: colors.accentText,
              }}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
                Protected by Design
              </h4>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: colors.secondaryText }}>
                Zero cloud health uploads in this MVP. No microphone, camera, or facial recognition.
              </p>
            </div>
          </div>
        </div>

        {/* Health Disclaimer */}
        <div
          className="p-3 rounded-2xl border text-[10px] leading-relaxed mb-5"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.borderSubtle,
            color: colors.secondaryText,
          }}
        >
          <strong className="block mb-0.5" style={{ color: colors.primaryText }}>
            Health Disclaimer:
          </strong>
          Manobal provides wellness and cognitive insights based on user-provided and device-derived signals. It is not a medical device and does not diagnose, treat, or prevent any medical condition.
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            id="btn-onboarding-connect-health"
            onClick={onConnectHealth}
            className="w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            style={{
              backgroundColor: colors.accent,
              color: colors.accentContrast,
            }}
          >
            <span>Connect Health Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-onboarding-skip"
            onClick={onSkip}
            className="w-full py-2.5 rounded-2xl border text-xs font-medium transition-colors hover:underline"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.border,
              color: colors.secondaryText,
            }}
          >
            Skip for now & use Games / Check-in
          </button>
        </div>
      </div>
    </div>
  );
};
