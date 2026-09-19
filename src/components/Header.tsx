import React from 'react';
import { ShieldCheck, RefreshCw, Smartphone } from 'lucide-react';
import { HealthSignals } from '../types';

interface HeaderProps {
  healthSignals: HealthSignals;
  onOpenHealthConnect: () => void;
  onOpenAndroidCode: () => void;
  isSyncing: boolean;
  onSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  healthSignals,
  onOpenHealthConnect,
  onOpenAndroidCode,
  isSyncing,
  onSync,
}) => {
  return (
    <header
      id="app-main-header"
      className="sticky top-0 z-30 bg-[#06110C]/90 backdrop-blur-md border-b border-[#142E21] px-4 py-3 max-w-md mx-auto flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#0F261D] border border-[#1E4D37] flex items-center justify-center text-[#2FE4A6] font-bold text-xs shadow-inner">
          M
        </div>
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#2FE4A6] uppercase">
            MANOBAH-AI
          </span>
          <p className="text-[10px] text-[#8EA898] leading-none">Welfare Signal v1.0</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="btn-open-android-code"
          onClick={onOpenAndroidCode}
          title="Inspect Native Android Kotlin / Jetpack Compose Architecture"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0E2319] hover:bg-[#143224] border border-[#1B402E] text-[11px] font-medium text-[#D2E4D6] transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#2FE4A6]" />
          <span>Android</span>
        </button>

        {healthSignals.isConnected ? (
          <button
            id="btn-health-connect-status"
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D261B] hover:bg-[#123324] border border-[#1F543B] text-[11px] text-[#A6E8CA] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#2FE4A6] animate-pulse" />
            <RefreshCw className={`w-3 h-3 text-[#2FE4A6] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>HC Synced</span>
          </button>
        ) : (
          <button
            id="btn-health-connect-connect"
            onClick={onOpenHealthConnect}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18261E] hover:bg-[#203328] border border-[#2B4234] text-[11px] text-[#8EA898] transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-[#8EA898]" />
            <span>No data</span>
          </button>
        )}
      </div>
    </header>
  );
};
