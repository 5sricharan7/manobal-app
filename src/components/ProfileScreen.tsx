import React from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  Smartphone,
  RotateCcw,
  Trash2,
  ChevronRight,
  ExternalLink,
  Info,
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';
import { HealthSignals } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { ThemePreference } from '../theme/tokens';

interface ProfileScreenProps {
  healthSignals: HealthSignals;
  onOpenHealthConnect: () => void;
  onNavigatePrivacy: () => void;
  onNavigateTerms: () => void;
  onOpenAndroidCode: () => void;
  onClearLocalData: () => void;
  onResetPermissions: () => void;
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  healthSignals,
  onOpenHealthConnect,
  onNavigatePrivacy,
  onNavigateTerms,
  onOpenAndroidCode,
  onClearLocalData,
  onResetPermissions,
  onBack,
}) => {
  const { preference, activeTheme, isDark, colors, setPreference, toggleTheme } = useTheme();

  const themeOptions: {
    id: ThemePreference;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'system',
      label: 'System default',
      description: 'Match your device light or dark mode automatically',
      icon: <Monitor className="w-4 h-4" />,
    },
    {
      id: 'light',
      label: 'Light',
      description: 'Calm, warm off-white surface with high-contrast text',
      icon: <Sun className="w-4 h-4" />,
    },
    {
      id: 'dark',
      label: 'Dark',
      description: 'Deep charcoal canvas with Manobal mint accents',
      icon: <Moon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-1 animate-fadeIn max-w-sm mx-auto theme-fade-transition">
      {/* Top Header with Optional Back Button */}
      <div className="flex items-center justify-between pt-1">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs transition-colors py-1 px-2 -ml-2 rounded-xl"
            style={{ color: colors.secondaryText }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <span
            className="text-[10px] uppercase font-bold tracking-widest"
            style={{ color: colors.accentText }}
          >
            ACCOUNT & SETTINGS
          </span>
        )}
        <span
          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.tertiaryText,
          }}
        >
          On-Device
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-normal" style={{ color: colors.primaryText }}>
          Settings & Identity
        </h1>
        <p className="text-xs mt-0.5" style={{ color: colors.secondaryText }}>
          Appearance preferences, health data sources, and privacy safeguards.
        </p>
      </div>

      {/* User Identity Card */}
      <section
        className="p-4 rounded-3xl border flex items-center gap-3.5 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl border flex items-center justify-center font-bold text-base"
          style={{
            backgroundColor: colors.accentSoft,
            borderColor: colors.accent,
            color: colors.accentText,
          }}
        >
          M
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: colors.primaryText }}>
            Local Personnel Profile
          </h3>
          <p className="text-xs mt-0.5 truncate" style={{ color: colors.secondaryText }}>
            Manobal-AI Welfare Signal Companion
          </p>
        </div>
      </section>

      {/* Global Appearance Settings */}
      <section
        id="settings-appearance"
        className="rounded-3xl border p-4 space-y-3.5 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-[10px] uppercase font-bold tracking-widest block"
              style={{ color: colors.tertiaryText }}
            >
              APPEARANCE
            </span>
            <h3 className="text-xs font-semibold mt-0.5" style={{ color: colors.primaryText }}>
              Global Color Theme
            </h3>
          </div>

          {/* Compact Quick Switch Button */}
          <button
            type="button"
            id="btn-quick-theme-toggle"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.border,
              color: colors.primaryText,
            }}
            title="Switch light / dark"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#E8AE52]" />
                <span className="text-[11px]">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" style={{ color: colors.accentText }} />
                <span className="text-[11px]">Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Appearance Mode Radio Choices */}
        <div className="space-y-2 pt-0.5">
          {themeOptions.map((opt) => {
            const isSelected = preference === opt.id;
            return (
              <button
                type="button"
                key={opt.id}
                id={`btn-theme-${opt.id}`}
                onClick={() => setPreference(opt.id)}
                className="w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all active:scale-[0.99]"
                style={{
                  backgroundColor: isSelected ? colors.surfaceElevated : colors.surfaceSunken,
                  borderColor: isSelected ? colors.accent : colors.borderSubtle,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isSelected ? colors.accentSoft : 'transparent',
                      borderColor: isSelected ? colors.accent : colors.border,
                      color: isSelected ? colors.accentText : colors.secondaryText,
                    }}
                  >
                    {opt.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: colors.primaryText }}
                      >
                        {opt.label}
                      </span>
                      {opt.id === 'system' && (
                        <span
                          className="text-[9px] font-mono px-1.5 py-0.2 rounded border"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.tertiaryText,
                          }}
                        >
                          Auto: {activeTheme}
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] leading-tight mt-0.5" style={{ color: colors.secondaryText }}>
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div
                  className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                  style={{
                    borderColor: isSelected ? colors.accent : colors.borderHighlight,
                    backgroundColor: isSelected ? colors.accent : 'transparent',
                  }}
                >
                  {isSelected && (
                    <Check
                      className="w-3 h-3 stroke-[3]"
                      style={{ color: colors.accentContrast }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Native Android Project Inspector Banner */}
      <section
        className="p-3.5 rounded-3xl border flex items-center justify-between shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
              color: colors.accentText,
            }}
          >
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
              Native Android Code
            </h3>
            <p className="text-[10px]" style={{ color: colors.secondaryText }}>
              Jetpack Compose • Health Connect
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAndroidCode}
          className="px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.primaryText,
          }}
        >
          <span>Source</span>
          <ExternalLink className="w-3 h-3" style={{ color: colors.accentText }} />
        </button>
      </section>

      {/* Connected Health Sources */}
      <section
        className="rounded-3xl border p-4 space-y-3 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase font-bold tracking-widest"
            style={{ color: colors.tertiaryText }}
          >
            DATA SOURCES
          </span>
          <span className="text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
            Android Health Connect
          </span>
        </div>

        <div
          className="p-3 rounded-2xl border flex items-center justify-between"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.borderSubtle,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: colors.accentSoft,
                color: colors.accentText,
              }}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: colors.primaryText }}>
                Health Connect
              </p>
              <p className="text-[10px]" style={{ color: colors.secondaryText }}>
                {healthSignals.isConnected ? 'Connected & Permissions Active' : 'Disconnected / Revoked'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenHealthConnect}
            className="px-3 py-1 rounded-xl text-xs font-medium transition-colors border"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
              color: colors.accentText,
            }}
          >
            Configure
          </button>
        </div>

        {/* Active Permission Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Heart Rate', granted: healthSignals.permissionsGranted.heartRate },
            { label: 'Sleep Stages', granted: healthSignals.permissionsGranted.sleep },
            { label: 'Steps', granted: healthSignals.permissionsGranted.steps },
            { label: 'HRV RMSSD', granted: healthSignals.permissionsGranted.hrv },
          ].map((item) => (
            <div
              key={item.label}
              className="p-2.5 rounded-xl border flex items-center justify-between"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.borderSubtle,
              }}
            >
              <span style={{ color: colors.secondaryText }}>{item.label}</span>
              <span
                className="text-[10px] font-mono font-medium"
                style={{ color: item.granted ? colors.accentText : colors.mutedText }}
              >
                {item.granted ? 'Granted' : 'Revoked'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Options: Privacy, Terms, About */}
      <section
        className="rounded-3xl border divide-y overflow-hidden shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <button
          onClick={onNavigatePrivacy}
          className="w-full p-3.5 flex items-center justify-between transition-colors text-left"
          style={{ borderColor: colors.borderSubtle }}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4" style={{ color: colors.accentText }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: colors.primaryText }}>
                Privacy Policy & Safeguards
              </p>
              <p className="text-[10px]" style={{ color: colors.secondaryText }}>
                Your data. Your choice. Local-only architecture.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: colors.tertiaryText }} />
        </button>

        <button
          onClick={onNavigateTerms}
          className="w-full p-3.5 flex items-center justify-between transition-colors text-left"
          style={{ borderColor: colors.borderSubtle }}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4" style={{ color: colors.accentText }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: colors.primaryText }}>
                Terms & Conditions
              </p>
              <p className="text-[10px]" style={{ color: colors.secondaryText }}>
                MVP research prototype disclaimer and limitations.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: colors.tertiaryText }} />
        </button>

        <div className="p-3.5 flex items-start gap-3">
          <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: colors.accentText }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: colors.primaryText }}>
              About Manobal-AI
            </p>
            <p className="text-[10px] leading-relaxed mt-0.5" style={{ color: colors.secondaryText }}>
              Part of the Welfare Signal project. Explores non-invasive cognitive and physiological telemetry for proactive welfare monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Danger Zone: Erase Data & Reset Permissions */}
      <section
        className="p-4 rounded-3xl border space-y-2.5 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <h3 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
          Data Management & Reset
        </h3>

        <div className="flex gap-2">
          <button
            onClick={onResetPermissions}
            className="flex-1 py-2.5 rounded-xl border text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.border,
              color: colors.secondaryText,
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Permissions</span>
          </button>

          <button
            onClick={onClearLocalData}
            className="flex-1 py-2.5 rounded-xl border text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: isDark ? '#2A171A' : '#FFF0F0',
              borderColor: isDark ? '#3E2125' : '#FCDAD7',
              color: colors.error,
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Local Data</span>
          </button>
        </div>
      </section>

      {/* Health Disclaimer Footer */}
      <div
        className="p-3 rounded-2xl border text-[10px] leading-relaxed theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.borderSubtle,
          color: colors.secondaryText,
        }}
      >
        <strong className="block mb-0.5" style={{ color: colors.primaryText }}>
          Health Disclaimer:
        </strong>
        Manobal provides wellness and cognitive insights based on user-provided and device-derived signals. It is not a medical device and does not diagnose, treat, or prevent any medical condition.
      </div>
    </div>
  );
};
