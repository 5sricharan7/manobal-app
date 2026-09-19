import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Activity,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { HealthSignals, HealthDayData, PersonalBaseline } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface WellnessScreenProps {
  healthSignals: HealthSignals;
  history7Days: HealthDayData[];
  baseline: PersonalBaseline;
  onOpenHealthConnect: () => void;
  onSyncHealth: () => void;
  isSyncing: boolean;
  useDemoData: boolean;
  onToggleDemoData: () => void;
}

type TimeHorizon = 'today' | '7days';
type SignalMetric = 'heartRate' | 'sleep' | 'steps' | 'hrv';

export const WellnessScreen: React.FC<WellnessScreenProps> = ({
  healthSignals,
  history7Days,
  baseline,
  onOpenHealthConnect,
  onSyncHealth,
  isSyncing,
  useDemoData,
  onToggleDemoData,
}) => {
  const { colors, isDark } = useTheme();
  const [horizon, setHorizon] = useState<TimeHorizon>('today');
  const [activeMetric, setActiveMetric] = useState<SignalMetric>('heartRate');

  const hasData = healthSignals.isConnected && healthSignals.heartRate !== null;

  // Chart data for 7-day sparkline
  const chartData = history7Days.map((d) => {
    switch (activeMetric) {
      case 'heartRate':
        return { label: d.day, value: d.heartRate ?? 68, unit: 'bpm' };
      case 'sleep':
        return { label: d.day, value: d.sleepHours ?? 7.2, unit: 'h' };
      case 'steps':
        return { label: d.day, value: d.steps ?? 6400, unit: 'steps' };
      case 'hrv':
        return { label: d.day, value: d.hrv ?? 50, unit: 'ms' };
    }
  });

  const maxChartVal = Math.max(...chartData.map((d) => d.value), 1);
  const minChartVal = Math.min(...chartData.map((d) => d.value));

  // Current metric value & unit
  const getMetricDisplay = () => {
    switch (activeMetric) {
      case 'heartRate':
        return {
          title: 'Heart rate',
          value: healthSignals.heartRate ?? 72,
          unit: 'bpm',
          trend: '↗',
          sub: `Resting: ${healthSignals.restingHeartRate ?? 58} bpm`,
          icon: <Heart className="w-4 h-4 text-[#F28B82]" />,
        };
      case 'sleep':
        return {
          title: 'Sleep duration',
          value: healthSignals.sleepDurationMinutes
            ? (healthSignals.sleepDurationMinutes / 60).toFixed(1)
            : '6.7',
          unit: 'hrs',
          trend: '↘',
          sub: `Deep: ${healthSignals.sleepStages?.deepMinutes ?? 78}m`,
          icon: <Moon className="w-4 h-4 text-[#60A5FA]" />,
        };
      case 'steps':
        return {
          title: 'Daily steps',
          value: healthSignals.stepsToday
            ? healthSignals.stepsToday.toLocaleString()
            : '6,480',
          unit: 'steps',
          trend: '↗',
          sub: `Target: ${baseline.steps.toLocaleString()}`,
          icon: <Activity className="w-4 h-4" style={{ color: colors.accentText }} />,
        };
      case 'hrv':
        return {
          title: 'HRV (RMSSD)',
          value: healthSignals.hrv ?? 44,
          unit: 'ms',
          trend: '→',
          sub: `Baseline: ${baseline.hrv} ms`,
          icon: <Zap className="w-4 h-4 text-[#F59E0B]" />,
        };
    }
  };

  const currentDisplay = getMetricDisplay();

  return (
    <div className="space-y-4 pb-20 pt-1 animate-fadeIn max-w-sm mx-auto theme-fade-transition">
      {/* Screen Title */}
      <section className="pt-1">
        <span
          className="text-[10px] uppercase font-bold tracking-widest block"
          style={{ color: colors.tertiaryText }}
        >
          WELLNESS
        </span>
        <h1 className="text-2xl font-normal mt-0.5" style={{ color: colors.primaryText }}>
          Your body signals
        </h1>
      </section>

      {/* Segmented Control: TODAY | 7 DAYS */}
      <div
        className="flex rounded-xl p-1 border theme-fade-transition"
        style={{
          backgroundColor: colors.surfaceSunken,
          borderColor: colors.borderSubtle,
        }}
      >
        <button
          id="tab-horizon-today"
          onClick={() => setHorizon('today')}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            backgroundColor: horizon === 'today' ? colors.surface : 'transparent',
            color: horizon === 'today' ? colors.primaryText : colors.secondaryText,
            boxShadow: horizon === 'today' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          TODAY
        </button>
        <button
          id="tab-horizon-7days"
          onClick={() => setHorizon('7days')}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            backgroundColor: horizon === '7days' ? colors.surface : 'transparent',
            color: horizon === '7days' ? colors.primaryText : colors.secondaryText,
            boxShadow: horizon === '7days' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          7 DAYS
        </button>
      </div>

      {/* Compact Visual Trend Area */}
      <section
        className="p-4 rounded-2xl border space-y-3 shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'heartRate', label: 'Heart rate' },
            { id: 'sleep', label: 'Sleep' },
            { id: 'steps', label: 'Steps' },
            { id: 'hrv', label: 'HRV' },
          ].map((m) => {
            const isSel = activeMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id as SignalMetric)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap border"
                style={{
                  backgroundColor: isSel ? colors.accentSoft : colors.surfaceSunken,
                  borderColor: isSel ? colors.accent : colors.borderSubtle,
                  color: isSel ? colors.accentText : colors.secondaryText,
                  fontWeight: isSel ? 600 : 500,
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Selected Metric Header & Large Number */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: colors.secondaryText }}>
              {currentDisplay.icon}
              <span>{currentDisplay.title}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-3xl font-bold font-mono tracking-tight"
                style={{ color: colors.primaryText }}
              >
                {currentDisplay.value}
              </span>
              <span className="text-xs font-mono" style={{ color: colors.tertiaryText }}>
                {currentDisplay.unit}
              </span>
              <span
                className="text-xs font-mono font-semibold ml-1"
                style={{ color: colors.accentText }}
              >
                {currentDisplay.trend}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono pb-1" style={{ color: colors.tertiaryText }}>
            {currentDisplay.sub}
          </span>
        </div>

        {/* Small Elegant Chart / Sparkline */}
        <div className="pt-2 border-t" style={{ borderColor: colors.borderSubtle }}>
          <div className="h-24 w-full flex items-end justify-between gap-2 px-1 pt-3 pb-1">
            {chartData.map((item, idx) => {
              const isLatest = idx === chartData.length - 1;
              const range = maxChartVal - minChartVal || 1;
              const percent = Math.max(((item.value - minChartVal) / range) * 75 + 20, 16);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div
                    style={{
                      height: `${percent}%`,
                      backgroundColor: isLatest ? colors.accent : colors.chartTrack,
                    }}
                    className="w-full max-w-[20px] rounded-t-md transition-all duration-300 group-hover:opacity-85"
                  />
                  <span
                    className="text-[9px] font-mono tracking-tighter"
                    style={{
                      color: isLatest ? colors.accentText : colors.tertiaryText,
                      fontWeight: isLatest ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Horizontal Signal Row */}
      <section
        className="p-3 rounded-2xl border shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="grid grid-cols-3 divide-x text-center" style={{ borderColor: colors.borderSubtle }}>
          {/* Sleep */}
          <div className="px-2">
            <span className="text-[10px] block mb-0.5" style={{ color: colors.tertiaryText }}>
              Sleep
            </span>
            <span className="text-sm font-bold font-mono" style={{ color: colors.primaryText }}>
              {healthSignals.sleepDurationMinutes
                ? `${Math.floor(healthSignals.sleepDurationMinutes / 60)}h ${healthSignals.sleepDurationMinutes % 60}m`
                : '6h 42m'}
            </span>
          </div>

          {/* Steps */}
          <div className="px-2">
            <span className="text-[10px] block mb-0.5" style={{ color: colors.tertiaryText }}>
              Steps
            </span>
            <span className="text-sm font-bold font-mono" style={{ color: colors.primaryText }}>
              {healthSignals.stepsToday
                ? `${(healthSignals.stepsToday / 1000).toFixed(1)}k`
                : '6.2k'}
            </span>
          </div>

          {/* HRV */}
          <div className="px-2">
            <span className="text-[10px] block mb-0.5" style={{ color: colors.tertiaryText }}>
              HRV
            </span>
            <span className="text-sm font-bold font-mono" style={{ color: colors.primaryText }}>
              {healthSignals.hrv ? `${healthSignals.hrv}ms` : '44ms'}
            </span>
          </div>
        </div>
      </section>

      {/* Bottom Health Connect Status & Sync Section */}
      <section
        className="p-3.5 rounded-2xl border flex items-center justify-between shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: hasData ? colors.accent : colors.mutedText,
            }}
          />
          <div>
            <p className="text-xs font-medium" style={{ color: colors.primaryText }}>
              Connected through Health Connect
            </p>
            <p className="text-[10px]" style={{ color: colors.secondaryText }}>
              {hasData ? 'Background signal sync ready' : 'Local permission needed'}
            </p>
          </div>
        </div>

        <button
          id="btn-wellness-sync"
          onClick={hasData ? onSyncHealth : onOpenHealthConnect}
          disabled={isSyncing}
          className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-[0.97] flex items-center gap-1.5"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.accentText,
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{hasData ? 'SYNC' : 'CONNECT'}</span>
        </button>
      </section>

      {/* Subtle Wearable Simulation Toggle */}
      <div className="flex items-center justify-between px-2 pt-1 text-[10px]">
        <span style={{ color: colors.tertiaryText }}>Simulated Wearable Testing</span>
        <button
          onClick={onToggleDemoData}
          className="font-mono hover:underline font-medium"
          style={{ color: colors.accentText }}
        >
          {useDemoData ? 'Active (Tap to clear)' : 'Load sample data'}
        </button>
      </div>
    </div>
  );
};
