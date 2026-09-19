import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Activity,
  Zap,
  RefreshCw,
  ShieldCheck,
  Calendar,
  Clock,
  TrendingDown,
  Info,
} from 'lucide-react';
import { HealthSignals, HealthDayData, PersonalBaseline } from '../types';

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
  const [horizon, setHorizon] = useState<TimeHorizon>('today');
  const [selectedChartMetric, setSelectedChartMetric] = useState<SignalMetric>('heartRate');

  const hasData = healthSignals.isConnected && healthSignals.heartRate !== null;

  // Chart values
  const chartData = history7Days.map((d) => {
    switch (selectedChartMetric) {
      case 'heartRate':
        return { label: d.day, value: d.heartRate ?? 0, unit: 'bpm' };
      case 'sleep':
        return { label: d.day, value: d.sleepHours ?? 0, unit: 'h' };
      case 'steps':
        return { label: d.day, value: d.steps ?? 0, unit: 'steps' };
      case 'hrv':
        return { label: d.day, value: d.hrv ?? 0, unit: 'ms' };
    }
  });

  const maxVal = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Editorial Title */}
      <section className="pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
            HEALTH CONNECT SIGNALS
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSyncHealth}
              disabled={isSyncing}
              className="p-1.5 rounded-lg bg-[#0E2419] hover:bg-[#143525] border border-[#19432F] text-[#2FE4A6] transition-colors"
              title="Sync Health Connect Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-editorial italic text-[#F4F7F4] mb-1">
          Physiological Baseline
        </h1>
        <p className="text-xs text-[#8EA898]">
          Autonomic and sleep signals aggregated locally via Android Health Connect.
        </p>
      </section>

      {/* Dev / Isolated Simulation Notice Pill */}
      <div className="p-3 rounded-2xl bg-[#091C13] border border-[#173D2B] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2FE4A6]" />
          <span className="text-[11px] text-[#A2BEAD]">
            {hasData
              ? 'Local Health Connect synced'
              : 'No health signals available'}
          </span>
        </div>

        <button
          onClick={onToggleDemoData}
          className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-lg bg-[#112E20] hover:bg-[#18422E] text-[#2FE4A6] border border-[#1E4D37] transition-colors"
        >
          {useDemoData ? 'Dev Flag: Demo Data Active' : 'Dev Flag: Test With Demo'}
        </button>
      </div>

      {/* View Toggle: TODAY vs 7 DAYS */}
      <div className="flex rounded-2xl bg-[#081811] p-1 border border-[#143224]">
        <button
          id="tab-horizon-today"
          onClick={() => setHorizon('today')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
            horizon === 'today'
              ? 'bg-[#122E20] text-[#2FE4A6] shadow-sm font-semibold'
              : 'text-[#8EA898] hover:text-[#D5E5D9]'
          }`}
        >
          TODAY
        </button>
        <button
          id="tab-horizon-7days"
          onClick={() => setHorizon('7days')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
            horizon === '7days'
              ? 'bg-[#122E20] text-[#2FE4A6] shadow-sm font-semibold'
              : 'text-[#8EA898] hover:text-[#D5E5D9]'
          }`}
        >
          7 DAYS
        </button>
      </div>

      {/* TODAY's Primary Signal Cards */}
      {horizon === 'today' && (
        <div className="space-y-4">
          {hasData ? (
            <div className="grid grid-cols-2 gap-3">
              {/* HEART RATE */}
              <div className="p-4 rounded-3xl bg-[#0C2218] border border-[#1A4430] flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#8EA898]">
                    <Heart className="w-4 h-4 text-[#2FE4A6]" />
                    <span>Heart Rate</span>
                  </div>
                  <span className="text-[10px] text-[#2FE4A6] bg-[#07160F] px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <div className="my-2">
                  <div className="text-3xl font-bold font-mono text-[#F4F7F4]">
                    {healthSignals.heartRate}{' '}
                    <span className="text-xs font-normal text-[#8EA898]">bpm</span>
                  </div>
                  <p className="text-[11px] text-[#8EA898] mt-0.5">
                    Resting: {healthSignals.restingHeartRate ?? 58} bpm
                  </p>
                </div>
                <div className="text-[10px] text-[#7A9886] border-t border-[#143224] pt-2">
                  Within typical resting range (60–75)
                </div>
              </div>

              {/* HRV */}
              <div className="p-4 rounded-3xl bg-[#0C2218] border border-[#1A4430] flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#8EA898]">
                    <Zap className="w-4 h-4 text-[#2FE4A6]" />
                    <span>HRV (RMSSD)</span>
                  </div>
                  <span className="text-[10px] text-[#8EA898] bg-[#07160F] px-2 py-0.5 rounded-full">
                    Autonomic
                  </span>
                </div>
                <div className="my-2">
                  <div className="text-3xl font-bold font-mono text-[#F4F7F4]">
                    {healthSignals.hrv}{' '}
                    <span className="text-xs font-normal text-[#8EA898]">ms</span>
                  </div>
                  <p className="text-[11px] text-[#8EA898] mt-0.5">
                    Baseline: {baseline.hrv} ms
                  </p>
                </div>
                <div className="text-[10px] text-[#7A9886] border-t border-[#143224] pt-2">
                  RMSSD autonomic balance index
                </div>
              </div>

              {/* SLEEP */}
              <div className="p-4 rounded-3xl bg-[#0C2218] border border-[#1A4430] flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#8EA898]">
                    <Moon className="w-4 h-4 text-[#2FE4A6]" />
                    <span>Sleep Duration</span>
                  </div>
                  <span className="text-[10px] text-[#F28B82] bg-[#07160F] px-2 py-0.5 rounded-full">
                    -14%
                  </span>
                </div>
                <div className="my-2">
                  <div className="text-3xl font-bold font-mono text-[#F4F7F4]">
                    {healthSignals.sleepDurationMinutes
                      ? `${Math.floor(healthSignals.sleepDurationMinutes / 60)}h ${healthSignals.sleepDurationMinutes % 60}m`
                      : 'No data'}
                  </div>
                  <p className="text-[11px] text-[#8EA898] mt-0.5">
                    Baseline: {baseline.sleepHours}h
                  </p>
                </div>
                <div className="text-[10px] text-[#7A9886] border-t border-[#143224] pt-2">
                  Deep: {healthSignals.sleepStages?.deepMinutes ?? 78}m • REM: {healthSignals.sleepStages?.remMinutes ?? 94}m
                </div>
              </div>

              {/* ACTIVITY */}
              <div className="p-4 rounded-3xl bg-[#0C2218] border border-[#1A4430] flex flex-col justify-between min-h-[140px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#8EA898]">
                    <Activity className="w-4 h-4 text-[#2FE4A6]" />
                    <span>Today's Steps</span>
                  </div>
                  <span className="text-[10px] text-[#8EA898] bg-[#07160F] px-2 py-0.5 rounded-full">
                    Steps
                  </span>
                </div>
                <div className="my-2">
                  <div className="text-3xl font-bold font-mono text-[#F4F7F4]">
                    {healthSignals.stepsToday ? healthSignals.stepsToday.toLocaleString() : '0'}
                  </div>
                  <p className="text-[11px] text-[#8EA898] mt-0.5">
                    Active: ~{healthSignals.activeCalories ?? 380} kcal
                  </p>
                </div>
                <div className="text-[10px] text-[#7A9886] border-t border-[#143224] pt-2">
                  Target baseline: {baseline.steps.toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-8 rounded-3xl bg-[#0B2016] border border-[#183E2D] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#112E20] border border-[#1D4A35] flex items-center justify-center text-[#8EA898] mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#F4F7F4]">No recent data</h3>
              <p className="text-xs text-[#8EA898] max-w-xs mx-auto leading-relaxed">
                Connect Health Connect to read physiological metrics directly from your wearable device.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={onOpenHealthConnect}
                  className="px-4 py-2.5 rounded-xl bg-[#2FE4A6] text-[#06110C] font-semibold text-xs hover:bg-[#4EF2BB] transition-colors"
                >
                  Configure Health Connect
                </button>
                <button
                  onClick={onSyncHealth}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl border border-[#1C4633] text-xs font-medium text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#0F281C] transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync Health Data</span>
                </button>
              </div>
            </div>
          )}

          {/* Neutral Phrasing Advisory Card */}
          {hasData && (
            <div className="p-4 rounded-3xl bg-[#081A12] border border-[#163B29] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D2E2D6]">
                <TrendingDown className="w-4 h-4 text-[#E8AE52]" />
                <span>Signal Pattern Observation</span>
              </div>
              <p className="text-xs text-[#8EA898] leading-relaxed">
                "Your sleep has been below your recent baseline." Sleep duration was approximately 1 hour below your typical 7-day average. Heart rate recovery remained within normal limits.
              </p>
              <p className="text-[11px] text-[#71907D] italic">
                Non-diagnostic note: Manobah presents objective deviations from your established personal trend rather than clinical conclusions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 7 DAYS SECTION WITH CHARTS */}
      {(horizon === '7days' || hasData) && (
        <section className="rounded-3xl bg-[#0B2016] border border-[#1A4430] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
                7 DAY SIGNALS
              </span>
              <h3 className="text-base font-semibold text-[#F4F7F4]">Weekly Signal Trends</h3>
            </div>

            <span className="text-[11px] text-[#8EA898] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Past 7 Days</span>
            </span>
          </div>

          {/* Metric Selector Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[#07160F] border border-[#143425] text-xs">
            <button
              onClick={() => setSelectedChartMetric('heartRate')}
              className={`py-1.5 px-1 rounded-xl text-center transition-colors ${
                selectedChartMetric === 'heartRate'
                  ? 'bg-[#143525] text-[#2FE4A6] font-semibold'
                  : 'text-[#8EA898] hover:text-[#D5E5D9]'
              }`}
            >
              Heart Rate
            </button>
            <button
              onClick={() => setSelectedChartMetric('sleep')}
              className={`py-1.5 px-1 rounded-xl text-center transition-colors ${
                selectedChartMetric === 'sleep'
                  ? 'bg-[#143525] text-[#2FE4A6] font-semibold'
                  : 'text-[#8EA898] hover:text-[#D5E5D9]'
              }`}
            >
              Sleep
            </button>
            <button
              onClick={() => setSelectedChartMetric('steps')}
              className={`py-1.5 px-1 rounded-xl text-center transition-colors ${
                selectedChartMetric === 'steps'
                  ? 'bg-[#143525] text-[#2FE4A6] font-semibold'
                  : 'text-[#8EA898] hover:text-[#D5E5D9]'
              }`}
            >
              Steps
            </button>
            <button
              onClick={() => setSelectedChartMetric('hrv')}
              className={`py-1.5 px-1 rounded-xl text-center transition-colors ${
                selectedChartMetric === 'hrv'
                  ? 'bg-[#143525] text-[#2FE4A6] font-semibold'
                  : 'text-[#8EA898] hover:text-[#D5E5D9]'
              }`}
            >
              HRV
            </button>
          </div>

          {/* Custom SVG / Bar Signal Chart */}
          {history7Days.length > 0 ? (
            <div className="pt-2">
              <div className="h-44 w-full flex items-end justify-between gap-2 px-2 pb-2 border-b border-[#163826]">
                {chartData.map((item, idx) => {
                  const heightPercent = maxVal > 0 ? Math.max((item.value / maxVal) * 100, 12) : 10;
                  const isLatest = idx === chartData.length - 1;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      {/* Value Tooltip on hover */}
                      <span className="text-[10px] font-mono text-[#8EA898] opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.value}
                      </span>

                      {/* Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                          isLatest
                            ? 'bg-[#2FE4A6] shadow-[0_0_12px_rgba(47,228,166,0.3)]'
                            : 'bg-[#173D2C] group-hover:bg-[#1F543D]'
                        }`}
                      />

                      {/* Day Label */}
                      <span className={`text-[10px] font-mono ${isLatest ? 'text-[#2FE4A6] font-bold' : 'text-[#8EA898]'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Meta Footnote */}
              <div className="flex items-center justify-between text-[10px] text-[#7A9886] pt-2 px-1">
                <span>Metric: {selectedChartMetric.toUpperCase()} ({chartData[0]?.unit})</span>
                <span>Personal baseline: {
                  selectedChartMetric === 'heartRate' ? `${baseline.heartRate} bpm` :
                  selectedChartMetric === 'sleep' ? `${baseline.sleepHours} hrs` :
                  selectedChartMetric === 'steps' ? `${baseline.steps.toLocaleString()} steps` :
                  `${baseline.hrv} ms`
                }</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#8EA898]">
              No 7-day wearable history synchronized yet.
            </div>
          )}
        </section>
      )}

      {/* Non-Diagnostic Commitment Callout */}
      <div className="p-4 rounded-2xl bg-[#06130D] border border-[#133022] text-[11px] text-[#789682] leading-relaxed">
        <strong className="text-[#A4C2AF] block mb-0.5">Ethical Signal Reporting:</strong>
        Manobah does not label users as stressed, depressed, or fatigued based on wearable data. Signals represent raw physiological dynamics that should be evaluated in context with your lived experience.
      </div>
    </div>
  );
};
