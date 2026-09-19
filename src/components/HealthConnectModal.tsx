import React, { useState } from 'react';
import { ShieldCheck, Heart, Activity, Moon, Zap, Check, AlertCircle, X, RefreshCw } from 'lucide-react';
import { HealthSignals } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface HealthConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthSignals: HealthSignals;
  onUpdatePermissions: (permissions: HealthSignals['permissionsGranted'], isConnected: boolean) => void;
  onSync: () => void;
  isSyncing: boolean;
}

export const HealthConnectModal: React.FC<HealthConnectModalProps> = ({
  isOpen,
  onClose,
  healthSignals,
  onUpdatePermissions,
  onSync,
  isSyncing,
}) => {
  const { colors, isDark } = useTheme();
  const [permissions, setPermissions] = useState(healthSignals.permissionsGranted);

  if (!isOpen) return null;

  const togglePermission = (key: keyof HealthSignals['permissionsGranted']) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGrantAll = () => {
    const allGranted = {
      heartRate: true,
      hrv: true,
      sleep: true,
      steps: true,
    };
    setPermissions(allGranted);
    onUpdatePermissions(allGranted, true);
  };

  const handleApplyChanges = () => {
    const anyGranted = Object.values(permissions).some((v) => v);
    onUpdatePermissions(permissions, anyGranted);
    onClose();
  };

  const handleDisconnect = () => {
    const allRevoked = {
      heartRate: false,
      hrv: false,
      sleep: false,
      steps: false,
    };
    setPermissions(allRevoked);
    onUpdatePermissions(allRevoked, false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(15,23,42,0.45)' }}
    >
      <div
        id="health-connect-permission-sheet"
        className="w-full max-w-sm rounded-3xl border p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.primaryText,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
          style={{ color: colors.secondaryText }}
          aria-label="Close Health Connect sheet"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-2xl border flex items-center justify-center"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
              color: colors.accentText,
            }}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span
              className="text-[10px] uppercase font-semibold tracking-wider block"
              style={{ color: colors.accentText }}
            >
              Android Health Connect
            </span>
            <h3 className="text-base font-semibold" style={{ color: colors.primaryText }}>
              Permission Access
            </h3>
          </div>
        </div>

        <p className="text-xs leading-relaxed mb-4" style={{ color: colors.secondaryText }}>
          Manobal reads physiological signals locally to observe your personal baselines. Data remains strictly on your device and is not transmitted to external cloud servers.
        </p>

        {/* System Status Pill */}
        <div
          className="p-3 rounded-2xl border mb-4 flex items-center justify-between"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.borderSubtle,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: healthSignals.isConnected ? colors.accent : colors.mutedText,
              }}
            />
            <div>
              <p className="text-xs font-medium" style={{ color: colors.primaryText }}>
                {healthSignals.isConnected ? 'Connected & Active' : 'Disconnected / No Permissions'}
              </p>
              <p className="text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
                {healthSignals.lastSyncTimestamp
                  ? `Last sync: ${new Date(healthSignals.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'No sync history'}
              </p>
            </div>
          </div>

          {healthSignals.isConnected && (
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="p-1.5 rounded-lg transition-colors border"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
                color: colors.accentText,
              }}
              title="Sync now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Permission Item Toggles */}
        <div className="space-y-2 mb-4">
          <label
            className="text-[10px] font-semibold uppercase tracking-wider block"
            style={{ color: colors.tertiaryText }}
          >
            Requested Data Permissions
          </label>

          {/* Heart Rate */}
          <div
            onClick={() => togglePermission('heartRate')}
            className="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" style={{ color: colors.accentText }} />
              <div>
                <p className="text-xs font-medium" style={{ color: colors.primaryText }}>
                  Heart Rate & Resting HR
                </p>
                <p className="text-[10px]" style={{ color: colors.secondaryText }}>
                  Reads sample heart rate records
                </p>
              </div>
            </div>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center border transition-colors"
              style={{
                backgroundColor: permissions.heartRate ? colors.accent : 'transparent',
                borderColor: permissions.heartRate ? colors.accent : colors.border,
                color: colors.accentContrast,
              }}
            >
              {permissions.heartRate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* HRV */}
          <div
            onClick={() => togglePermission('hrv')}
            className="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <div>
                <p className="text-xs font-medium" style={{ color: colors.primaryText }}>
                  Heart-Rate Variability (HRV)
                </p>
                <p className="text-[10px]" style={{ color: colors.secondaryText }}>
                  RMSSD autonomic nervous system index
                </p>
              </div>
            </div>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center border transition-colors"
              style={{
                backgroundColor: permissions.hrv ? colors.accent : 'transparent',
                borderColor: permissions.hrv ? colors.accent : colors.border,
                color: colors.accentContrast,
              }}
            >
              {permissions.hrv && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Sleep */}
          <div
            onClick={() => togglePermission('sleep')}
            className="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-[#60A5FA]" />
              <div>
                <p className="text-xs font-medium" style={{ color: colors.primaryText }}>
                  Sleep Sessions & Stages
                </p>
                <p className="text-[10px]" style={{ color: colors.secondaryText }}>
                  Night duration and sleep regularity
                </p>
              </div>
            </div>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center border transition-colors"
              style={{
                backgroundColor: permissions.sleep ? colors.accent : 'transparent',
                borderColor: permissions.sleep ? colors.accent : colors.border,
                color: colors.accentContrast,
              }}
            >
              {permissions.sleep && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Steps / Activity */}
          <div
            onClick={() => togglePermission('steps')}
            className="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4" style={{ color: colors.accentText }} />
              <div>
                <p className="text-xs font-medium" style={{ color: colors.primaryText }}>
                  Daily Steps & Activity
                </p>
                <p className="text-[10px]" style={{ color: colors.secondaryText }}>
                  Aggregated step counts & cadence
                </p>
              </div>
            </div>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center border transition-colors"
              style={{
                backgroundColor: permissions.steps ? colors.accent : 'transparent',
                borderColor: permissions.steps ? colors.accent : colors.border,
                color: colors.accentContrast,
              }}
            >
              {permissions.steps && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Privacy badge */}
        <div
          className="p-2.5 rounded-xl border text-[10px] flex items-start gap-2 mb-4"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.borderSubtle,
            color: colors.secondaryText,
          }}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: colors.accentText }} />
          <span>
            Protected by design. You can modify or revoke these permissions at any time via Android system settings.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleGrantAll}
            className="w-full py-3 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-[0.98]"
            style={{
              backgroundColor: colors.accent,
              color: colors.accentContrast,
            }}
          >
            Grant All Requested Permissions
          </button>

          <div className="flex gap-2">
            {healthSignals.isConnected && (
              <button
                onClick={handleDisconnect}
                className="flex-1 py-2.5 rounded-xl border text-xs font-medium transition-colors"
                style={{
                  backgroundColor: colors.surfaceSunken,
                  borderColor: colors.error,
                  color: colors.error,
                }}
              >
                Disconnect / Clear
              </button>
            )}
            <button
              onClick={handleApplyChanges}
              className="flex-1 py-2.5 rounded-xl border text-xs font-medium transition-colors"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.border,
                color: colors.primaryText,
              }}
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
