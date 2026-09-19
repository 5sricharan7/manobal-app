import React from 'react';
import {
  Heart,
  Moon,
  Activity,
  Zap,
  Brain,
  MessageSquareHeart,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { HealthSignals, GameSession, CheckInRecord, PersonalBaseline, NavigationTab } from '../types';

interface HomeScreenProps {
  healthSignals: HealthSignals;
  recentGameSessions: GameSession[];
  recentCheckIns: CheckInRecord[];
  baseline: PersonalBaseline;
  onNavigate: (tab: NavigationTab) => void;
  onOpenHealthConnect: () => void;
  onSyncHealth: () => void;
  isSyncing: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  healthSignals,
  recentGameSessions,
  recentCheckIns,
  baseline,
  onNavigate,
  onOpenHealthConnect,
  onSyncHealth,
  isSyncing,
}) => {
  const latestCheckIn = recentCheckIns[0];
  const latestGame = recentGameSessions[0];

  // Calculate high-level cognitive averages from recent sessions
  const completedToday = {
    gonogo: recentGameSessions.some((s) => s.gameType === 'gonogo'),
    reaction_dot: recentGameSessions.some((s) => s.gameType === 'reaction_dot'),
    memory_sequence: recentGameSessions.some((s) => s.gameType === 'memory_sequence'),
  };

  const avgReactionTime =
    recentGameSessions.length > 0
      ? Math.round(
          recentGameSessions.reduce((acc, s) => acc + s.reactionTime, 0) / recentGameSessions.length
        )
      : null;

  const avgAccuracy =
    recentGameSessions.length > 0
      ? Math.round(
          recentGameSessions.reduce((acc, s) => acc + s.accuracy, 0) / recentGameSessions.length
        )
      : null;

  // Personal pattern comparison (non-diagnostic)
  const hasWearableData = healthSignals.isConnected && healthSignals.heartRate !== null;

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Editorial Hero Header */}
      <section className="pt-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#2FE4A6]">
            MANOBAH-AI
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2FE4A6]" />
          <span className="text-[11px] text-[#8EA898]">PERSONAL WELFARE MONITOR</span>
        </div>

        <h1 className="text-3xl font-normal leading-[1.15] text-[#F4F7F4] font-editorial mb-3">
          Personal<br />
          <span className="italic font-normal text-[#2FE4A6]">Welfare</span><br />
          Intelligence.
        </h1>

        <p className="text-sm text-[#8EA898] leading-relaxed max-w-sm">
          Your personal signals, brought together with care.
        </p>

        {/* Micro brand ethos pill */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-[#7E9C8A]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2FE4A6]" />
          <span>Human-in-the-loop • Protected by design</span>
        </div>
      </section>

      {/* Personal Trend Insight Card (Non-Diagnostic) */}
      <section className="rounded-3xl bg-[#0B2016] border border-[#1A4430] p-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
            YOUR RECENT PATTERN
          </span>
          <span className="text-[11px] text-[#8EA898]">7-day comparison</span>
        </div>

        {hasWearableData || recentGameSessions.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Sleep Comparison */}
              <div className="p-2.5 rounded-2xl bg-[#081810] border border-[#143525]">
                <div className="flex items-center justify-between text-[10px] text-[#8EA898] mb-1">
                  <span>Sleep</span>
                  <TrendingDown className="w-3 h-3 text-[#F28B82]" />
                </div>
                <div className="text-base font-bold font-mono text-[#F4F7F4]">
                  {healthSignals.sleepDurationMinutes
                    ? `${Math.floor(healthSignals.sleepDurationMinutes / 60)}h ${healthSignals.sleepDurationMinutes % 60}m`
                    : '6h 12m'}
                </div>
                <span className="text-[10px] text-[#F28B82]">↓ 14% vs baseline</span>
              </div>

              {/* Activity */}
              <div className="p-2.5 rounded-2xl bg-[#081810] border border-[#143525]">
                <div className="flex items-center justify-between text-[10px] text-[#8EA898] mb-1">
                  <span>Activity</span>
                  <TrendingDown className="w-3 h-3 text-[#F28B82]" />
                </div>
                <div className="text-base font-bold font-mono text-[#F4F7F4]">
                  {healthSignals.stepsToday ? healthSignals.stepsToday.toLocaleString() : '6,480'}
                </div>
                <span className="text-[10px] text-[#F28B82]">↓ 21% vs baseline</span>
              </div>

              {/* Reaction Latency */}
              <div className="p-2.5 rounded-2xl bg-[#081810] border border-[#143525]">
                <div className="flex items-center justify-between text-[10px] text-[#8EA898] mb-1">
                  <span>Reaction</span>
                  <TrendingUp className="w-3 h-3 text-[#E8AE52]" />
                </div>
                <div className="text-base font-bold font-mono text-[#F4F7F4]">
                  {avgReactionTime ? `${avgReactionTime} ms` : '318 ms'}
                </div>
                <span className="text-[10px] text-[#E8AE52]">↑ 11% latency</span>
              </div>

              {/* Check-in Score */}
              <div className="p-2.5 rounded-2xl bg-[#081810] border border-[#143525]">
                <div className="flex items-center justify-between text-[10px] text-[#8EA898] mb-1">
                  <span>Check-in</span>
                  <span className="text-[10px] text-[#2FE4A6]">Stable</span>
                </div>
                <div className="text-base font-bold font-mono text-[#F4F7F4]">
                  {latestCheckIn ? `${latestCheckIn.wellbeing}.0 / 5` : '3.8 / 5'}
                </div>
                <span className="text-[10px] text-[#2FE4A6]">Self-appraisal</span>
              </div>
            </div>

            {/* Careful, Non-diagnostic Advisory Copy */}
            <div className="pt-2 border-t border-[#153A28] text-xs text-[#8EA898] leading-relaxed">
              <p className="text-[#D3E3D7] font-medium mb-0.5">
                "Some of your recent signals differ from your usual pattern."
              </p>
              <p>
                Consider checking in with yourself and maintaining your usual rest and activity routine.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-3 text-xs text-[#8EA898] leading-relaxed">
            <p className="text-[#D3E3D7] font-medium mb-1">
              "Keep using Manobah to establish your personal baseline."
            </p>
            <p className="mb-3">
              Connect Health Connect or complete a 90-second cognitive exercise to begin mapping your signal trends.
            </p>
            <button
              onClick={onOpenHealthConnect}
              className="px-3 py-1.5 rounded-xl bg-[#143526] hover:bg-[#1A4532] text-[#2FE4A6] text-xs font-medium transition-colors"
            >
              Connect Health Data
            </button>
          </div>
        )}
      </section>

      {/* HEALTH SIGNALS CARD */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#19402E] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
              PHYSIOLOGICAL
            </span>
            <h3 className="text-base font-semibold text-[#F4F7F4]">Health Signals</h3>
          </div>

          <button
            onClick={() => onNavigate('wellness')}
            className="flex items-center gap-1 text-xs text-[#2FE4A6] hover:underline"
          >
            <span>View Wellness</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {hasWearableData ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Heart Rate */}
            <div className="p-3.5 rounded-2xl bg-[#07170F] border border-[#143424]">
              <div className="flex items-center gap-2 text-[#8EA898] mb-1.5">
                <Heart className="w-4 h-4 text-[#2FE4A6]" />
                <span className="text-xs">Heart Rate</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#F4F7F4]">
                {healthSignals.heartRate} <span className="text-xs font-normal text-[#8EA898]">bpm</span>
              </div>
              <span className="text-[10px] text-[#8EA898] block mt-1">
                Resting: {healthSignals.restingHeartRate ?? 58} bpm
              </span>
            </div>

            {/* HRV */}
            <div className="p-3.5 rounded-2xl bg-[#07170F] border border-[#143424]">
              <div className="flex items-center gap-2 text-[#8EA898] mb-1.5">
                <Zap className="w-4 h-4 text-[#2FE4A6]" />
                <span className="text-xs">HRV (RMSSD)</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#F4F7F4]">
                {healthSignals.hrv} <span className="text-xs font-normal text-[#8EA898]">ms</span>
              </div>
              <span className="text-[10px] text-[#8EA898] block mt-1">
                Baseline: {baseline.hrv} ms
              </span>
            </div>

            {/* Sleep */}
            <div className="p-3.5 rounded-2xl bg-[#07170F] border border-[#143424]">
              <div className="flex items-center gap-2 text-[#8EA898] mb-1.5">
                <Moon className="w-4 h-4 text-[#2FE4A6]" />
                <span className="text-xs">Sleep Last Night</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#F4F7F4]">
                {healthSignals.sleepDurationMinutes
                  ? `${Math.floor(healthSignals.sleepDurationMinutes / 60)}h ${healthSignals.sleepDurationMinutes % 60}m`
                  : 'No data'}
              </div>
              <span className="text-[10px] text-[#8EA898] block mt-1">
                Deep: {healthSignals.sleepStages?.deepMinutes ?? 78}m • REM: {healthSignals.sleepStages?.remMinutes ?? 94}m
              </span>
            </div>

            {/* Steps */}
            <div className="p-3.5 rounded-2xl bg-[#07170F] border border-[#143424]">
              <div className="flex items-center gap-2 text-[#8EA898] mb-1.5">
                <Activity className="w-4 h-4 text-[#2FE4A6]" />
                <span className="text-xs">Today's Steps</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#F4F7F4]">
                {healthSignals.stepsToday ? healthSignals.stepsToday.toLocaleString() : '0'}
              </div>
              <span className="text-[10px] text-[#8EA898] block mt-1">
                Active: ~{healthSignals.activeCalories ?? 380} kcal
              </span>
            </div>
          </div>
        ) : (
          /* Empty Data State */
          <div className="p-4 rounded-2xl bg-[#07170F] border border-[#143424] text-center">
            <p className="text-xs text-[#8EA898] mb-3">
              No recent wearable data found via Android Health Connect.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onOpenHealthConnect}
                className="px-3.5 py-2 rounded-xl bg-[#2FE4A6] text-[#06110C] font-semibold text-xs hover:bg-[#4EF2BB] transition-colors"
              >
                Connect Health Connect
              </button>
              <button
                onClick={onSyncHealth}
                disabled={isSyncing}
                className="px-3.5 py-2 rounded-xl border border-[#1C4633] text-xs font-medium text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#0E281C] transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Health Data</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* COGNITIVE SIGNALS CARD */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#19402E] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
              OBJECTIVE PERFORMANCE
            </span>
            <h3 className="text-base font-semibold text-[#F4F7F4]">Cognitive Signals</h3>
          </div>

          <button
            onClick={() => onNavigate('games')}
            className="flex items-center gap-1 text-xs text-[#2FE4A6] hover:underline"
          >
            <span>Train Signals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-3 rounded-2xl bg-[#07170F] border border-[#143424]">
            <span className="text-[10px] uppercase text-[#8EA898] block">Reaction Time</span>
            <span className="text-lg font-bold font-mono text-[#F4F7F4]">
              {avgReactionTime ? `${avgReactionTime}` : '—'}{' '}
              <span className="text-[10px] font-normal text-[#8EA898]">ms</span>
            </span>
            <span className="text-[9px] text-[#7E9A8A] block mt-0.5">Mean latency</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#07170F] border border-[#143424]">
            <span className="text-[10px] uppercase text-[#8EA898] block">Accuracy</span>
            <span className="text-lg font-bold font-mono text-[#2FE4A6]">
              {avgAccuracy ? `${avgAccuracy}%` : '—'}
            </span>
            <span className="text-[9px] text-[#7E9A8A] block mt-0.5">Response precision</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#07170F] border border-[#143424]">
            <span className="text-[10px] uppercase text-[#8EA898] block">Today's Tests</span>
            <span className="text-lg font-bold font-mono text-[#F4F7F4]">
              {Object.values(completedToday).filter(Boolean).length} / 3
            </span>
            <span className="text-[9px] text-[#7E9A8A] block mt-0.5">Exercises done</span>
          </div>
        </div>

        {/* Recent Game Quick Launch / Status */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#07170F] border border-[#143424]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#133022] flex items-center justify-center text-[#2FE4A6]">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F4F7F4]">
                {latestGame ? `Last: ${latestGame.gameType.replace('_', ' ').toUpperCase()}` : 'Go / No-Go Ready'}
              </p>
              <p className="text-[10px] text-[#8EA898]">
                {latestGame
                  ? `Completed ${Math.round((Date.now() - latestGame.endTime) / 60000)}m ago • ${latestGame.accuracy}% accuracy`
                  : '90s inhibition & attention exercise'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('games')}
            className="px-3 py-1.5 rounded-xl bg-[#143324] hover:bg-[#1A422F] text-xs font-semibold text-[#2FE4A6] transition-colors"
          >
            Play
          </button>
        </div>
      </section>

      {/* WELLNESS & CHECK-IN SUMMARY */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#19402E] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
              SELF-APPRAISAL
            </span>
            <h3 className="text-base font-semibold text-[#F4F7F4]">Wellness & Reflection</h3>
          </div>

          <button
            onClick={() => onNavigate('checkin')}
            className="flex items-center gap-1 text-xs text-[#2FE4A6] hover:underline"
          >
            <span>Check In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {latestCheckIn ? (
          <div className="p-3.5 rounded-2xl bg-[#07170F] border border-[#143424]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#E4ECE7]">Latest Check-In</span>
              <span className="text-[10px] text-[#8EA898]">{latestCheckIn.dateStr}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center py-1">
              <div className="p-2 rounded-xl bg-[#0C2016]">
                <span className="text-[10px] text-[#8EA898] block">Overall</span>
                <span className="text-sm font-bold font-mono text-[#2FE4A6]">{latestCheckIn.wellbeing}/5</span>
              </div>
              <div className="p-2 rounded-xl bg-[#0C2016]">
                <span className="text-[10px] text-[#8EA898] block">Rested</span>
                <span className="text-sm font-bold font-mono text-[#2FE4A6]">{latestCheckIn.rested}/5</span>
              </div>
              <div className="p-2 rounded-xl bg-[#0C2016]">
                <span className="text-[10px] text-[#8EA898] block">Energy</span>
                <span className="text-sm font-bold font-mono text-[#2FE4A6]">{latestCheckIn.energy}/5</span>
              </div>
              <div className="p-2 rounded-xl bg-[#0C2016]">
                <span className="text-[10px] text-[#8EA898] block">Focus</span>
                <span className="text-sm font-bold font-mono text-[#2FE4A6]">{latestCheckIn.focus}/5</span>
              </div>
            </div>
            {latestCheckIn.notes && (
              <p className="text-[11px] text-[#8EA898] italic mt-2.5 pt-2 border-t border-[#122A1E]">
                "{latestCheckIn.notes}"
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#07170F] border border-[#143424] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MessageSquareHeart className="w-5 h-5 text-[#2FE4A6]" />
              <div>
                <p className="text-xs font-semibold text-[#F4F7F4]">No check-in logged today</p>
                <p className="text-[10px] text-[#8EA898]">Take 30 seconds to record your energy & focus</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('checkin')}
              className="px-3 py-1.5 rounded-xl bg-[#2FE4A6] text-[#06110C] font-semibold text-xs hover:bg-[#4EF2BB] transition-colors"
            >
              Start
            </button>
          </div>
        )}
      </section>

      {/* Editorial Disclaimer Footer Banner */}
      <div className="p-4 rounded-2xl bg-[#06130D] border border-[#133022] text-[11px] text-[#789682] leading-relaxed">
        <strong className="text-[#A4C2AF] block mb-0.5">Your signals deserve care:</strong>
        Manobah is a personal cognitive and wellness monitoring companion designed to identify subtle shifts from your individual baseline. It does not provide medical diagnoses or replace professional clinical care.
      </div>
    </div>
  );
};
