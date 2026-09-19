import React, { useState } from 'react';
import { ShieldCheck, Heart, Activity, Moon, Zap, Check, AlertCircle, X, RefreshCw } from 'lucide-react';
import { HealthSignals } from '../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="health-connect-permission-sheet"
        className="w-full max-w-sm rounded-3xl bg-[#0B1E16] border border-[#1B4331] p-5 shadow-2xl relative text-[#F4F7F4] max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#142F22] transition-colors"
          aria-label="Close Health Connect sheet"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#113123] border border-[#21533C] flex items-center justify-center text-[#2FE4A6]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#2FE4A6]">
              Android Health Connect
            </span>
            <h3 className="text-base font-semibold text-[#F4F7F4]">Permission Access</h3>
          </div>
        </div>

        <p className="text-xs text-[#8EA898] leading-relaxed mb-4">
          Manobah reads physiological signals locally to observe your personal baselines. Data remains strictly on your device and is not transmitted to external cloud servers.
        </p>

        {/* System Status Pill */}
        <div className="p-3 rounded-2xl bg-[#06140D] border border-[#153424] mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                healthSignals.isConnected ? 'bg-[#2FE4A6] shadow-[0_0_8px_#2FE4A6]' : 'bg-[#597564]'
              }`}
            />
            <div>
              <p className="text-xs font-medium text-[#E4EDE7]">
                {healthSignals.isConnected ? 'Connected & Active' : 'Disconnected / Empty Data'}
              </p>
              <p className="text-[10px] text-[#8EA898]">
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
              className="p-1.5 rounded-lg bg-[#112F21] hover:bg-[#18402D] text-[#2FE4A6] transition-colors"
              title="Sync now"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Permission Item Toggles */}
        <div className="space-y-2 mb-4">
          <label className="text-[11px] font-semibold text-[#A8C4B3] uppercase tracking-wider block">
            Requested Data Permissions
          </label>

          {/* Heart Rate */}
          <div
            onClick={() => togglePermission('heartRate')}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0F261C] hover:bg-[#133023] border border-[#1C4633] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-[#2FE4A6]" />
              <div>
                <p className="text-xs font-medium text-[#F4F7F4]">Heart Rate & Resting HR</p>
                <p className="text-[10px] text-[#8EA898]">Reads sample heart rate records</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                permissions.heartRate
                  ? 'bg-[#2FE4A6] border-[#2FE4A6] text-[#06110C]'
                  : 'border-[#26533D] bg-transparent'
              }`}
            >
              {permissions.heartRate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* HRV */}
          <div
            onClick={() => togglePermission('hrv')}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0F261C] hover:bg-[#133023] border border-[#1C4633] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#2FE4A6]" />
              <div>
                <p className="text-xs font-medium text-[#F4F7F4]">Heart-Rate Variability (HRV)</p>
                <p className="text-[10px] text-[#8EA898]">RMSSD autonomic nervous system index</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                permissions.hrv
                  ? 'bg-[#2FE4A6] border-[#2FE4A6] text-[#06110C]'
                  : 'border-[#26533D] bg-transparent'
              }`}
            >
              {permissions.hrv && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Sleep */}
          <div
            onClick={() => togglePermission('sleep')}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0F261C] hover:bg-[#133023] border border-[#1C4633] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-[#2FE4A6]" />
              <div>
                <p className="text-xs font-medium text-[#F4F7F4]">Sleep Sessions & Stages</p>
                <p className="text-[10px] text-[#8EA898]">Night duration and sleep regularity</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                permissions.sleep
                  ? 'bg-[#2FE4A6] border-[#2FE4A6] text-[#06110C]'
                  : 'border-[#26533D] bg-transparent'
              }`}
            >
              {permissions.sleep && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Steps / Activity */}
          <div
            onClick={() => togglePermission('steps')}
            className="flex items-center justify-between p-3 rounded-xl bg-[#0F261C] hover:bg-[#133023] border border-[#1C4633] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-[#2FE4A6]" />
              <div>
                <p className="text-xs font-medium text-[#F4F7F4]">Daily Steps & Activity</p>
                <p className="text-[10px] text-[#8EA898]">Aggregated step counts & cadence</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                permissions.steps
                  ? 'bg-[#2FE4A6] border-[#2FE4A6] text-[#06110C]'
                  : 'border-[#26533D] bg-transparent'
              }`}
            >
              {permissions.steps && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Privacy badge */}
        <div className="p-2.5 rounded-xl bg-[#071710] border border-[#163826] text-[11px] text-[#8EA898] flex items-start gap-2 mb-4">
          <AlertCircle className="w-3.5 h-3.5 text-[#2FE4A6] shrink-0 mt-0.5" />
          <span>
            Protected by design. You can modify or revoke these permissions at any time via Android system settings.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleGrantAll}
            className="w-full py-2.5 rounded-xl bg-[#2FE4A6] text-[#06110C] font-semibold text-xs hover:bg-[#4EF2BB] transition-colors"
          >
            Grant All Requested Permissions
          </button>

          <div className="flex gap-2">
            {healthSignals.isConnected && (
              <button
                onClick={handleDisconnect}
                className="flex-1 py-2.5 rounded-xl border border-[#381B1B] text-xs font-medium text-[#F28B82] hover:bg-[#210D0D] transition-colors"
              >
                Disconnect / Clear
              </button>
            )}
            <button
              onClick={handleApplyChanges}
              className="flex-1 py-2.5 rounded-xl border border-[#1D4A35] text-xs font-medium text-[#D0E2D5] hover:bg-[#133224] transition-colors"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
