import React, { useState } from 'react';
import {
  ShieldAlert,
  Target,
  Grid,
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GameType, GameSession } from '../types';
import { GoNoGoGame } from './games/GoNoGoGame';
import { ReactionDotGame } from './games/ReactionDotGame';
import { MemorySequenceGame } from './games/MemorySequenceGame';

interface GamesScreenProps {
  recentGameSessions: GameSession[];
  onSaveGameSession: (session: GameSession) => void;
  onRequestFeedback: (source: 'game', metadata: string) => void;
}

export const GamesScreen: React.FC<GamesScreenProps> = ({
  recentGameSessions,
  onSaveGameSession,
  onRequestFeedback,
}) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  // Check completion status for today
  const isCompletedToday = (type: GameType) => {
    return recentGameSessions.some((s) => s.gameType === type && s.completionStatus === 'completed');
  };

  const completedCount = ['gonogo', 'reaction_dot', 'memory_sequence'].filter((t) =>
    isCompletedToday(t as GameType)
  ).length;

  const handleGameComplete = (session: GameSession) => {
    onSaveGameSession(session);
    // Trigger product feedback modal
    onRequestFeedback('game', session.gameType);
  };

  // If a game is active, render the dedicated game view
  if (activeGame === 'gonogo') {
    return (
      <div className="pt-2 pb-20 animate-fadeIn">
        <GoNoGoGame
          onComplete={handleGameComplete}
          onBack={() => setActiveGame(null)}
        />
      </div>
    );
  }

  if (activeGame === 'reaction_dot') {
    return (
      <div className="pt-2 pb-20 animate-fadeIn">
        <ReactionDotGame
          onComplete={handleGameComplete}
          onBack={() => setActiveGame(null)}
        />
      </div>
    );
  }

  if (activeGame === 'memory_sequence') {
    return (
      <div className="pt-2 pb-20 animate-fadeIn">
        <MemorySequenceGame
          onComplete={handleGameComplete}
          onBack={() => setActiveGame(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Editorial Title */}
      <section className="pt-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6] block mb-1">
          COGNITIVE EXERCISES
        </span>
        <h1 className="text-2xl font-editorial italic text-[#F4F7F4] mb-1">
          Train your signals.
        </h1>
        <p className="text-xs text-[#8EA898] leading-relaxed">
          Short cognitive exercises designed to observe changes in attention, inhibition and reaction.
        </p>
      </section>

      {/* "Today's session" Progress Card */}
      <section className="p-4 rounded-3xl bg-[#0C2218] border border-[#19432F] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#F4F7F4]">Today's Session</span>
            <span className="text-[10px] text-[#2FE4A6] bg-[#07160F] px-2 py-0.5 rounded-full font-mono">
              {completedCount} / 3 Completed
            </span>
          </div>
          <p className="text-[11px] text-[#8EA898]">
            {completedCount === 3
              ? 'All daily cognitive signal tasks completed.'
              : 'Complete all 3 mini-exercises for full daily mapping.'}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full border-2 border-[#1E4D37] flex items-center justify-center relative bg-[#07170F]">
          <span className="text-xs font-bold font-mono text-[#2FE4A6]">
            {Math.round((completedCount / 3) * 100)}%
          </span>
        </div>
      </section>

      {/* GAME 1 CARD: GO / NO-GO */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#1A4430] p-5 relative overflow-hidden group hover:border-[#2FE4A6]/50 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#143625] border border-[#205139] flex items-center justify-center text-[#2FE4A6] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#F4F7F4]">GO / NO-GO</h3>
                {isCompletedToday('gonogo') && (
                  <span className="flex items-center gap-1 text-[10px] text-[#2FE4A6] bg-[#0A1D13] px-2 py-0.5 rounded-full border border-[#19402C]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Done today</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#2FE4A6] font-editorial italic">
                Inhibition & attention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#8EA898] bg-[#081810] px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-[#8EA898]" />
            <span>~90 sec</span>
          </div>
        </div>

        <p className="text-xs text-[#8EA898] leading-relaxed mb-4">
          Respond rapidly to standard stimuli while withholding responses to infrequent target distractor signals. Measures motor inhibition and response latency.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-[#143526]">
          <span className="text-[11px] text-[#7A9886]">
            Records: RT, Go/No-Go accuracy, commission errors
          </span>

          <button
            id="btn-launch-gonogo"
            onClick={() => setActiveGame('gonogo')}
            className="px-4 py-2 rounded-xl bg-[#2FE4A6] hover:bg-[#4EF2BB] text-[#06110C] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isCompletedToday('gonogo') ? 'Play Again' : 'Start Game'}</span>
          </button>
        </div>
      </section>

      {/* GAME 2 CARD: REACTION DOT */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#1A4430] p-5 relative overflow-hidden group hover:border-[#2FE4A6]/50 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#143625] border border-[#205139] flex items-center justify-center text-[#2FE4A6] shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#F4F7F4]">REACTION DOT</h3>
                {isCompletedToday('reaction_dot') && (
                  <span className="flex items-center gap-1 text-[10px] text-[#2FE4A6] bg-[#0A1D13] px-2 py-0.5 rounded-full border border-[#19402C]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Done today</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#2FE4A6] font-editorial italic">
                Reaction speed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#8EA898] bg-[#081810] px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-[#8EA898]" />
            <span>~90 sec</span>
          </div>
        </div>

        <p className="text-xs text-[#8EA898] leading-relaxed mb-4">
          A touch target appears at randomized coordinates with variable inter-trial intervals. Tap instantly upon perception to evaluate visual orientation and motor speed.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-[#143526]">
          <span className="text-[11px] text-[#7A9886]">
            Records: Avg RT, median RT, variability, misses
          </span>

          <button
            id="btn-launch-reactiondot"
            onClick={() => setActiveGame('reaction_dot')}
            className="px-4 py-2 rounded-xl bg-[#2FE4A6] hover:bg-[#4EF2BB] text-[#06110C] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isCompletedToday('reaction_dot') ? 'Play Again' : 'Start Game'}</span>
          </button>
        </div>
      </section>

      {/* GAME 3 CARD: MEMORY SEQUENCE */}
      <section className="rounded-3xl bg-[#0D2319] border border-[#1A4430] p-5 relative overflow-hidden group hover:border-[#2FE4A6]/50 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#143625] border border-[#205139] flex items-center justify-center text-[#2FE4A6] shrink-0">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#F4F7F4]">MEMORY SEQUENCE</h3>
                {isCompletedToday('memory_sequence') && (
                  <span className="flex items-center gap-1 text-[10px] text-[#2FE4A6] bg-[#0A1D13] px-2 py-0.5 rounded-full border border-[#19402C]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Done today</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#2FE4A6] font-editorial italic">
                Working memory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#8EA898] bg-[#081810] px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-[#8EA898]" />
            <span>~90 sec</span>
          </div>
        </div>

        <p className="text-xs text-[#8EA898] leading-relaxed mb-4">
          A spatial sequence of matrix cells briefly illuminates. Reproduce the pattern in chronological order as sequence complexity progressively escalates.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-[#143526]">
          <span className="text-[11px] text-[#7A9886]">
            Records: Max span, sequence accuracy, recall time
          </span>

          <button
            id="btn-launch-memorysequence"
            onClick={() => setActiveGame('memory_sequence')}
            className="px-4 py-2 rounded-xl bg-[#2FE4A6] hover:bg-[#4EF2BB] text-[#06110C] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isCompletedToday('memory_sequence') ? 'Play Again' : 'Start Game'}</span>
          </button>
        </div>
      </section>

      {/* Non Diagnostic Disclaimer Note */}
      <div className="p-4 rounded-2xl bg-[#06130D] border border-[#133022] text-[11px] text-[#789682] leading-relaxed">
        <strong className="text-[#A4C2AF] block mb-0.5">Objective Signal Observation:</strong>
        Manobah cognitive tasks are calibrated to observe day-to-day autonomic performance stability. They are not psychological diagnostic tests or IQ evaluators.
      </div>
    </div>
  );
};
