import React from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface TermsScreenProps {
  onBack: () => void;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();

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
          MVP Prototype
        </span>
      </div>

      {/* Editorial Title */}
      <section>
        <h1 className="text-2xl font-normal mb-1" style={{ color: colors.primaryText }}>
          Terms & Conditions
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: colors.secondaryText }}>
          Operational terms for the Manobal Mobile rapid hackathon and research prototype.
        </p>
      </section>

      {/* Primary Health & Safety Disclaimer Box */}
      <section
        className="p-4 rounded-3xl border space-y-2 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: isDark ? '#1D1B15' : '#FEF3C7',
          borderColor: isDark ? '#3E3523' : '#FDE68A',
        }}
      >
        <div
          className="flex items-center gap-2 text-xs font-semibold"
          style={{ color: isDark ? '#E8AE52' : '#B45309' }}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Mandatory Health Disclaimer</span>
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: isDark ? '#D2D8DE' : '#78350F' }}
        >
          "Manobal provides wellness and cognitive insights based on user-provided and device-derived signals. It is not a medical device and does not diagnose, treat, or prevent any medical condition."
        </p>
      </section>

      {/* Terms Sections */}
      <div className="space-y-3 text-xs leading-relaxed">
        {/* 1. Purpose */}
        <div
          className="p-4 rounded-3xl border space-y-1.5 shadow-sm theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
            1. Purpose of the Application
          </h3>
          <p style={{ color: colors.secondaryText }}>
            Manobal Mobile is a personal welfare intelligence research prototype designed for self-monitoring and cognitive signal tracking. It provides personal baseline visualization combining Android Health Connect metrics and standardized cognitive reaction tasks.
          </p>
        </div>

        {/* 2. No Medical Diagnosis or Clinical Service */}
        <div
          className="p-4 rounded-3xl border space-y-1.5 shadow-sm theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
            2. No Medical Diagnosis
          </h3>
          <p style={{ color: colors.secondaryText }}>
            The software does not provide medical diagnoses, psychological evaluations, or clinical advice. Do not use this application to detect, monitor, or manage any medical illness or psychiatric disorder. Always seek advice from a licensed physician for health concerns.
          </p>
        </div>

        {/* 3. Not an Emergency Service */}
        <div
          className="p-4 rounded-3xl border space-y-1.5 shadow-sm theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
            3. No Emergency Services
          </h3>
          <p style={{ color: colors.secondaryText }}>
            Manobal Mobile is not an emergency response system. If you are experiencing physical or mental health distress, acute pain, or a medical crisis, please contact your local emergency response services immediately.
          </p>
        </div>

        {/* 4. User Responsibilities */}
        <div
          className="p-4 rounded-3xl border space-y-1.5 shadow-sm theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
            4. User Responsibilities
          </h3>
          <p style={{ color: colors.secondaryText }}>
            Users are responsible for the physical security of their Android devices, maintaining appropriate privacy when participating in cognitive exercises, and determining whether resting and moving routines align with their comfort.
          </p>
        </div>

        {/* 5. Health Connect Third-Party Integration */}
        <div
          className="p-4 rounded-3xl border space-y-1.5 shadow-sm theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
            5. Third-Party Health Connect Integration
          </h3>
          <p style={{ color: colors.secondaryText }}>
            The application accesses sensor records stored in Google's Android Health Connect client only when granted permission by the user. Manobal has no control over third-party wearable sensor accuracy or manufacturer firmware updates.
          </p>
        </div>

        {/* 6. Application Limitations & Prototype Notice */}
        <div
          className="p-4 rounded-3xl border space-y-1.5 shadow-sm theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
            6. Prototype Limitations & Warranty
          </h3>
          <p style={{ color: colors.secondaryText }}>
            This application is provided "as-is" without warranty of any kind as part of a rapid hackathon demonstration. Features and local data models are subject to research iteration and updates.
          </p>
        </div>

        {/* 7. Contact Placeholder */}
        <div
          className="p-4 rounded-3xl border space-y-1.5 shadow-sm theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
            7. Project Contact Information
          </h3>
          <p style={{ color: colors.secondaryText }}>
            For inquiries regarding the Manobal-AI Welfare Signal Project, please consult the project repository at{' '}
            <code
              className="px-1.5 py-0.5 rounded-lg border font-mono text-[11px]"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.border,
                color: colors.accentText,
              }}
            >
              github.com/manobal-ai/welfare-signal
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
