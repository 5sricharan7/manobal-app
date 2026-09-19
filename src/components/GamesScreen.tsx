import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Play,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { GameType, GameSession } from '../types';
import { GoNoGoGame } from './games/GoNoGoGame';
import { ReactionDotGame } from './games/ReactionDotGame';
import { MemorySequenceGame } from './games/MemorySequenceGame';
import { useTheme } from '../theme/ThemeContext';

interface GamesScreenProps {
  recentGameSessions: GameSession[];
  onSaveGameSession: (session: GameSession) => void;
  onRequestFeedback: (source: 'game', metadata: string) => void;
  onGameActiveChange?: (active: boolean) => void;
}

export const GamesScreen: React.FC<GamesScreenProps> = ({
  recentGameSessions,
  onSaveGameSession,
  onRequestFeedback,
  onGameActiveChange,
}) => {
  const { colors, isDark } = useTheme();
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

  // Check completion status for today
  const isCompletedToday = (type: GameType) => {
    return recentGameSessions.some((s) => s.gameType === type && s.completionStatus === 'completed');
  };

  const completedCount = ['gonogo', 'reaction_dot', 'memory_sequence'].filter((t) =>
    isCompletedToday(t as GameType)
  ).length;

  const handleStartGame = (type: GameType) => {
    setActiveGame(type);
    onGameActiveChange?.(true);
  };

  const handleBackFromGame = () => {
    setActiveGame(null);
    onGameActiveChange?.(false);
  };

  const handleGameComplete = (session: GameSession) => {
    onSaveGameSession(session);
    onRequestFeedback('game', session.gameType);
  };

  // Dedicated distraction-free game views
  if (activeGame === 'gonogo') {
    return (
      <div
        className="fixed inset-0 z-50 p-4 flex flex-col justify-between animate-fadeIn max-w-md mx-auto theme-fade-transition"
        style={{ backgroundColor: colors.container }}
      >
        <GoNoGoGame onComplete={handleGameComplete} onBack={handleBackFromGame} />
      </div>
    );
  }

  if (activeGame === 'reaction_dot') {
    return (
      <div
        className="fixed inset-0 z-50 p-4 flex flex-col justify-between animate-fadeIn max-w-md mx-auto theme-fade-transition"
        style={{ backgroundColor: colors.container }}
      >
        <ReactionDotGame onComplete={handleGameComplete} onBack={handleBackFromGame} />
      </div>
    );
  }

  if (activeGame === 'memory_sequence') {
    return (
      <div
        className="fixed inset-0 z-50 p-4 flex flex-col justify-between animate-fadeIn max-w-md mx-auto theme-fade-transition"
        style={{ backgroundColor: colors.container }}
      >
        <MemorySequenceGame onComplete={handleGameComplete} onBack={handleBackFromGame} />
      </div>
    );
  }

  const games = [
    {
      id: 'gonogo' as GameType,
      title: 'GO / NO-GO',
      subtitle: 'Attention & inhibition',
      desc: 'Tap rapidly on green signals. Withhold on infrequent distractor triggers.',
      duration: '90 sec',
      completed: isCompletedToday('gonogo'),
      visual: (
        <div className="w-28 h-28 mx-auto relative flex items-center justify-center my-2">
          {/* Concentric pulsing rings */}
          <div
            className="absolute inset-0 rounded-full border animate-ping opacity-25"
            style={{ borderColor: colors.accent }}
          />
          <div
            className="absolute inset-2 rounded-full border animate-pulse"
            style={{ borderColor: colors.accent, opacity: 0.4 }}
          />
          <div
            className="w-16 h-16 rounded-full border flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.accent,
            }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: colors.accent,
                boxShadow: `0 0 8px ${colors.accent}`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'reaction_dot' as GameType,
      title: 'REACTION DOT',
      subtitle: 'Reaction speed',
      desc: 'Tap visual stimuli the exact millisecond they manifest on screen.',
      duration: '90 sec',
      completed: isCompletedToday('reaction_dot'),
      visual: (
        <div className="w-28 h-28 mx-auto relative flex items-center justify-center my-2">
          {/* Orbiting dot track */}
          <div
            className="w-20 h-20 rounded-full border border-dashed animate-[spin_8s_linear_infinite] relative flex items-center justify-center"
            style={{ borderColor: colors.accent, opacity: 0.5 }}
          >
            <span
              className="absolute -top-1.5 w-3 h-3 rounded-full"
              style={{
                backgroundColor: colors.accent,
                boxShadow: `0 0 8px ${colors.accent}`,
              }}
            />
          </div>
          <div
            className="absolute w-8 h-8 rounded-full border flex items-center justify-center"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.border,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
          </div>
        </div>
      ),
    },
    {
      id: 'memory_sequence' as GameType,
      title: 'MEMORY SEQUENCE',
      subtitle: 'Working memory',
      desc: 'Observe illuminated spatial sequence and reproduce chronological order.',
      duration: '90 sec',
      completed: isCompletedToday('memory_sequence'),
      visual: (
        <div className="w-28 h-28 mx-auto flex items-center justify-center my-2">
          {/* 3x3 illuminated grid pattern */}
          <div
            className="grid grid-cols-3 gap-1.5 p-2 rounded-xl border"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.border,
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-md transition-all duration-500"
                style={{
                  backgroundColor:
                    i === 1 || i === 4 || i === 6 ? colors.accent : colors.surfaceElevated,
                  boxShadow:
                    i === 1 || i === 4 || i === 6 ? `0 0 8px ${colors.accentSoft}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentGame = games[currentCardIndex];

  return (
    <div className="space-y-4 pb-20 pt-1 animate-fadeIn max-w-sm mx-auto theme-fade-transition">
      {/* Header & Title */}
      <section className="pt-1 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-normal" style={{ color: colors.primaryText }}>
            Train your signals.
          </h1>
          <p className="text-xs mt-0.5" style={{ color: colors.secondaryText }}>
            Short cognitive exercises.
          </p>
        </div>

        {/* Compact Session Progress Pill */}
        <div
          className="px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[10px] font-mono"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.secondaryText,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
          <span className="font-semibold" style={{ color: colors.primaryText }}>
            {completedCount} / 3
          </span>
          <span>Done</span>
        </div>
      </section>

      {/* Horizontal Carousel Game Deck */}
      <section className="relative">
        <div
          className="p-5 rounded-3xl border flex flex-col justify-between min-h-[340px] shadow-sm relative overflow-hidden transition-all duration-300 theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          {/* Card Top Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] uppercase font-bold tracking-widest"
                style={{ color: colors.accentText }}
              >
                {currentGame.subtitle}
              </span>
              {currentGame.completed && (
                <span
                  className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accent,
                    color: colors.accentText,
                  }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Done</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
              <Clock className="w-3 h-3" />
              <span>{currentGame.duration}</span>
            </div>
          </div>

          {/* Abstract Visual Asset */}
          <div className="py-2">{currentGame.visual}</div>

          {/* Title & Description */}
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold tracking-tight" style={{ color: colors.primaryText }}>
              {currentGame.title}
            </h3>
            <p
              className="text-xs leading-relaxed max-w-[260px] mx-auto"
              style={{ color: colors.secondaryText }}
            >
              {currentGame.desc}
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4">
            <button
              id={`btn-launch-${currentGame.id}`}
              onClick={() => handleStartGame(currentGame.id)}
              className="w-full py-3 rounded-2xl font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentContrast,
              }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentGame.completed ? 'PLAY AGAIN' : 'PLAY'}</span>
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => setCurrentCardIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1))}
          className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-95"
          style={{
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            color: colors.secondaryText,
          }}
          aria-label="Previous Game"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCurrentCardIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1))}
          className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-95"
          style={{
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            color: colors.secondaryText,
          }}
          aria-label="Next Game"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {games.map((g, idx) => (
          <button
            key={g.id}
            onClick={() => setCurrentCardIndex(idx)}
            className="transition-all duration-200"
            style={{
              width: currentCardIndex === idx ? '20px' : '6px',
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: currentCardIndex === idx ? colors.accent : colors.borderHighlight,
            }}
            aria-label={`Jump to ${g.title}`}
          />
        ))}
      </div>

      {/* Discrete Footnote */}
      <div
        className="p-3 rounded-2xl border flex items-center gap-2 text-[10px] theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.secondaryText,
        }}
      >
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accentText }} />
        <span>Cognitive timings are analyzed entirely on-device to build your personal baseline.</span>
      </div>
    </div>
  );
};
