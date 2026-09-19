import React from 'react';
import { ShieldCheck, RefreshCw, Smartphone, User } from 'lucide-react';
import { HealthSignals } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface HeaderProps {
  healthSignals: HealthSignals;
  onOpenHealthConnect: () => void;
  onOpenAndroidCode: () => void;
  onOpenProfile: () => void;
  isSyncing: boolean;
  onSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  healthSignals,
  onOpenHealthConnect,
  onOpenAndroidCode,
  onOpenProfile,
  isSyncing,
  onSync,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <header
      id="app-main-header"
      className="sticky top-0 z-30 backdrop-blur-xl px-4 py-2.5 max-w-md mx-auto flex items-center justify-between border-b theme-fade-transition"
      style={{
        backgroundColor: colors.headerBg,
        borderColor: colors.border,
      }}
    >
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shadow-inner"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.accentText,
          }}
        >
          M
        </div>
        <div className="flex flex-col">
          <span
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: colors.primaryText }}
          >
            MANOBAL
          </span>
          <span
            className="text-[9px] -mt-0.5 tracking-tight font-mono"
            style={{ color: colors.secondaryText }}
          >
            Welfare Signal
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5">
        {/* Android Architecture Inspector */}
        <button
          id="btn-open-android-code"
          onClick={onOpenAndroidCode}
          title="Inspect Native Android Kotlin / Jetpack Compose Architecture"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.secondaryText,
          }}
        >
          <Smartphone className="w-3 h-3" style={{ color: colors.accentText }} />
          <span className="text-[10px]">Android</span>
        </button>

        {/* Health Connect Status Pill */}
        {healthSignals.isConnected ? (
          <button
            id="btn-health-connect-status"
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] transition-colors font-medium"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
              color: colors.accentText,
            }}
            title="Health Connect Active • Click to Sync"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accent }}
            />
            <RefreshCw
              className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`}
              style={{ color: colors.accentText }}
            />
            <span>Synced</span>
          </button>
        ) : (
          <button
            id="btn-health-connect-connect"
            onClick={onOpenHealthConnect}
            className="flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] transition-colors"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.border,
              color: colors.secondaryText,
            }}
          >
            <ShieldCheck className="w-3 h-3" style={{ color: colors.secondaryText }} />
            <span>Connect</span>
          </button>
        )}

        {/* Profile / Settings Trigger */}
        <button
          id="btn-open-profile"
          onClick={onOpenProfile}
          title="Settings, Appearance & Profile"
          className="w-7 h-7 rounded-full border flex items-center justify-center transition-all ml-0.5"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.secondaryText,
          }}
          aria-label="Profile and Settings"
        >
          <User className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
