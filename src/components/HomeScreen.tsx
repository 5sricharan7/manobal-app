import React from 'react';
import {
  Heart,
  Moon,
  Activity,
  Brain,
  MessageSquareHeart,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { HealthSignals, GameSession, CheckInRecord, PersonalBaseline, NavigationTab } from '../types';
import { useTheme } from '../theme/ThemeContext';

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
}) => {
  const { colors, isDark } = useTheme();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  // Calculate average reaction time from recent sessions
  const avgReactionTime =
    recentGameSessions.length > 0
      ? Math.round(
          recentGameSessions.reduce((acc, s) => acc + s.reactionTime, 0) / recentGameSessions.length
        )
      : null;

  const hasWearableData = healthSignals.isConnected && healthSignals.heartRate !== null;

  // Format steps display
  const formattedSteps = healthSignals.stepsToday
    ? healthSignals.stepsToday >= 1000
      ? `${(healthSignals.stepsToday / 1000).toFixed(1)}k`
      : `${healthSignals.stepsToday}`
    : '—';

  // Format sleep duration
  const sleepDisplay = healthSignals.sleepDurationMinutes
    ? `${Math.floor(healthSignals.sleepDurationMinutes / 60)}h ${healthSignals.sleepDurationMinutes % 60}m`
    : '—';

  // Pattern assessment
  const isCloseToBaseline =
    hasWearableData &&
    healthSignals.heartRate &&
    Math.abs(healthSignals.heartRate - baseline.heartRate) <= 6;

  return (
    <div className="space-y-4 pb-20 pt-1 animate-fadeIn max-w-sm mx-auto theme-fade-transition">
      {/* Top Editorial Greeting */}
      <section className="pt-1">
        <p className="text-xs font-medium tracking-wide" style={{ color: colors.secondaryText }}>
          {getGreeting()}
        </p>
        <h1
          className="text-2xl sm:text-[26px] font-normal leading-[1.2] mt-0.5"
          style={{ color: colors.primaryText }}
        >
          Your signals,{' '}
          <span className="font-editorial italic" style={{ color: colors.accentText }}>
            at a glance.
          </span>
        </h1>
      </section>

      {/* Compact "TODAY" 2x2 Signals Area */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span
            className="text-[10px] uppercase font-bold tracking-widest"
            style={{ color: colors.tertiaryText }}
          >
            TODAY
          </span>
          <button
            onClick={() => onNavigate('wellness')}
            className="text-[11px] hover:underline flex items-center gap-0.5 font-medium transition-colors"
            style={{ color: colors.accentText }}
          >
            <span>All signals</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Heart Rate */}
          <div
            onClick={() => onNavigate('wellness')}
            className="p-3.5 rounded-2xl border transition-all cursor-pointer group shadow-sm active:scale-[0.99]"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-1.5" style={{ color: colors.secondaryText }}>
              <span className="text-xs font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#F28B82]" />
                <span>Heart rate</span>
              </span>
              {hasWearableData && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-bold font-mono tracking-tight"
                style={{ color: colors.primaryText }}
              >
                {healthSignals.heartRate ?? '—'}
              </span>
              <span className="text-[11px] font-mono" style={{ color: colors.tertiaryText }}>
                bpm
              </span>
            </div>
            <p className="text-[10px] mt-1 truncate" style={{ color: colors.secondaryText }}>
              {hasWearableData ? `Resting: ${healthSignals.restingHeartRate ?? 58} bpm` : 'No sync data'}
            </p>
          </div>

          {/* Sleep */}
          <div
            onClick={() => onNavigate('wellness')}
            className="p-3.5 rounded-2xl border transition-all cursor-pointer group shadow-sm active:scale-[0.99]"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-1.5" style={{ color: colors.secondaryText }}>
              <span className="text-xs font-medium flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Sleep</span>
              </span>
              {healthSignals.sleepDurationMinutes && (
                <span className="text-[9px] font-mono" style={{ color: colors.tertiaryText }}>
                  Last night
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-bold font-mono tracking-tight"
                style={{ color: colors.primaryText }}
              >
                {sleepDisplay}
              </span>
            </div>
            <p className="text-[10px] mt-1 truncate" style={{ color: colors.secondaryText }}>
              {healthSignals.sleepDurationMinutes
                ? `Deep: ${healthSignals.sleepStages?.deepMinutes ?? 78}m`
                : 'Connect Health'}
            </p>
          </div>

          {/* Steps */}
          <div
            onClick={() => onNavigate('wellness')}
            className="p-3.5 rounded-2xl border transition-all cursor-pointer group shadow-sm active:scale-[0.99]"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-1.5" style={{ color: colors.secondaryText }}>
              <span className="text-xs font-medium flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" style={{ color: colors.accentText }} />
                <span>Steps</span>
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-bold font-mono tracking-tight"
                style={{ color: colors.primaryText }}
              >
                {formattedSteps}
              </span>
            </div>
            <p className="text-[10px] mt-1 truncate" style={{ color: colors.secondaryText }}>
              {healthSignals.stepsToday ? `Active: ~${healthSignals.activeCalories ?? 380} kcal` : 'Goal: 8.0k'}
            </p>
          </div>

          {/* Cognitive Reaction */}
          <div
            onClick={() => onNavigate('games')}
            className="p-3.5 rounded-2xl border transition-all cursor-pointer group shadow-sm active:scale-[0.99]"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-1.5" style={{ color: colors.secondaryText }}>
              <span className="text-xs font-medium flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Reaction</span>
              </span>
              {avgReactionTime && (
                <span className="text-[9px] font-mono" style={{ color: colors.accentText }}>
                  Active
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-2xl font-bold font-mono tracking-tight"
                style={{ color: colors.primaryText }}
              >
                {avgReactionTime ? avgReactionTime : '318'}
              </span>
              <span className="text-[11px] font-mono" style={{ color: colors.tertiaryText }}>
                ms
              </span>
            </div>
            <p className="text-[10px] mt-1 truncate" style={{ color: colors.secondaryText }}>
              {avgReactionTime ? 'Mean latency today' : 'Tap to test latency'}
            </p>
          </div>
        </div>
      </section>

      {/* Central Insight Card */}
      <section
        className="p-4 rounded-2xl border relative overflow-hidden shadow-sm theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
            <span
              className="text-[10px] uppercase font-bold tracking-widest"
              style={{ color: colors.tertiaryText }}
            >
              YOUR RECENT PATTERN
            </span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
            7-day trend
          </span>
        </div>

        <div className="space-y-1 mt-2">
          <h3 className="text-sm font-semibold leading-snug" style={{ color: colors.primaryText }}>
            {isCloseToBaseline || (!hasWearableData && recentGameSessions.length === 0)
              ? 'Signals are close to your usual baseline.'
              : 'Some recent signals differ from your usual pattern.'}
          </h3>
          <p className="text-[11px] leading-relaxed" style={{ color: colors.secondaryText }}>
            {hasWearableData
              ? 'Autonomic recovery and motor latency align steadily with your baseline rhythm.'
              : 'Keep logging daily check-ins and exercises to calibrate your personal baseline.'}
          </p>
        </div>

        {/* Small Visual Trend Indicator */}
        <div
          className="mt-3 pt-2.5 border-t flex items-center justify-between text-[10px]"
          style={{
            borderColor: colors.borderSubtle,
            color: colors.secondaryText,
          }}
        >
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: colors.accentText }} />
            <span>Motor stability: Steady</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: colors.accentText }} />
            <span>Private & Local</span>
          </div>
        </div>
      </section>

      {/* Prominent Quick Actions */}
      <section className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          id="btn-quick-play-game"
          onClick={() => onNavigate('games')}
          className="py-3 px-4 rounded-2xl font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          style={{
            backgroundColor: colors.accent,
            color: colors.accentContrast,
          }}
        >
          <Brain className="w-4 h-4 fill-current" />
          <span>PLAY A GAME</span>
        </button>

        <button
          id="btn-quick-check-in"
          onClick={() => onNavigate('checkin')}
          className="py-3 px-4 rounded-2xl border font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.primaryText,
          }}
        >
          <MessageSquareHeart className="w-4 h-4" style={{ color: colors.accentText }} />
          <span>CHECK IN</span>
        </button>
      </section>

      {/* Non-Diagnostic Subdued Footnote */}
      <p
        className="text-[10px] text-center pt-2 leading-relaxed px-2"
        style={{ color: colors.mutedText }}
      >
        Manobal is a personal cognitive and wellness monitoring companion. Non-diagnostic.
      </p>
    </div>
  );
};
