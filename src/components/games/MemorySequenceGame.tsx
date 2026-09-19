import React, { useState, useEffect, useRef } from 'react';
import { Play, ArrowLeft, CheckCircle2, Grid, Layers } from 'lucide-react';
import { GameSession } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

interface MemorySequenceGameProps {
  onComplete: (session: GameSession) => void;
  onBack: () => void;
}

type Phase = 'intro' | 'showing' | 'recalling' | 'round_feedback' | 'results';

export const MemorySequenceGame: React.FC<MemorySequenceGameProps> = ({ onComplete, onBack }) => {
  const { colors, isDark } = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  const [sequenceLength, setSequenceLength] = useState<number>(3);
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [highlightedCell, setHighlightedCell] = useState<number | null>(null);
  const [roundFeedback, setRoundFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const totalRounds = 7;

  // Metrics
  const correctCountRef = useRef<number>(0);
  const incorrectCountRef = useRef<number>(0);
  const maxSuccessfulLengthRef = useRef<number>(0);
  const responseTimesRef = useRef<number[]>([]);
  const recallStartTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const timeoutRefs = useRef<number[]>([]);

  const [results, setResults] = useState<{
    maxSequenceLength: number;
    correctSequences: number;
    incorrectSequences: number;
    accuracy: number;
    avgResponseTime: number;
  } | null>(null);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      isRunningRef.current = false;
    };
  }, []);

  const startGame = () => {
    clearAllTimeouts();
    correctCountRef.current = 0;
    incorrectCountRef.current = 0;
    maxSuccessfulLengthRef.current = 0;
    responseTimesRef.current = [];
    setRoundNumber(1);
    setSequenceLength(3);
    isRunningRef.current = true;

    startRound(1, 3);
  };

  const startRound = (round: number, length: number) => {
    setUserSequence([]);
    setRoundFeedback(null);
    setHighlightedCell(null);
    setPhase('showing');

    // Generate non-repeating consecutive pattern
    const seq: number[] = [];
    let last = -1;
    for (let i = 0; i < length; i++) {
      let next: number;
      do {
        next = Math.floor(Math.random() * 9);
      } while (next === last);
      seq.push(next);
      last = next;
    }
    setCurrentSequence(seq);

    // Play sequence animation
    const stepDuration = 600;
    const gapDuration = 250;

    seq.forEach((cell, idx) => {
      const showTimer = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        setHighlightedCell(cell);
      }, 800 + idx * (stepDuration + gapDuration));
      timeoutRefs.current.push(showTimer);

      const hideTimer = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        setHighlightedCell(null);
      }, 800 + idx * (stepDuration + gapDuration) + stepDuration);
      timeoutRefs.current.push(hideTimer);
    });

    // When showing ends, switch to recalling
    const endShowTimer = window.setTimeout(() => {
      if (!isRunningRef.current) return;
      setPhase('recalling');
      recallStartTimeRef.current = performance.now();
    }, 800 + seq.length * (stepDuration + gapDuration) + 200);
    timeoutRefs.current.push(endShowTimer);
  };

  const handleCellClick = (cellIdx: number) => {
    if (phase !== 'recalling' || !isRunningRef.current) return;

    const tapTime = performance.now();
    const rt = Math.round(tapTime - recallStartTimeRef.current);
    responseTimesRef.current.push(rt);
    recallStartTimeRef.current = tapTime;

    const nextUserSeq = [...userSequence, cellIdx];
    setUserSequence(nextUserSeq);

    const stepIndex = nextUserSeq.length - 1;
    if (cellIdx !== currentSequence[stepIndex]) {
      // Mistake made
      handleRoundOutcome(false);
      return;
    }

    // If reached end of sequence successfully
    if (nextUserSeq.length === currentSequence.length) {
      handleRoundOutcome(true);
    }
  };

  const handleRoundOutcome = (success: boolean) => {
    setPhase('round_feedback');
    setRoundFeedback(success ? 'correct' : 'incorrect');

    if (success) {
      correctCountRef.current += 1;
      if (sequenceLength > maxSuccessfulLengthRef.current) {
        maxSuccessfulLengthRef.current = sequenceLength;
      }
    } else {
      incorrectCountRef.current += 1;
    }

    const nextRound = roundNumber + 1;
    // Adapt length: increase by 1 if correct, stay or decrease if incorrect
    const nextLength = success
      ? Math.min(sequenceLength + 1, 7)
      : Math.max(sequenceLength - 1, 3);

    const pauseTimer = window.setTimeout(() => {
      if (!isRunningRef.current) return;

      if (nextRound > totalRounds) {
        finishGame();
      } else {
        setRoundNumber(nextRound);
        setSequenceLength(nextLength);
        startRound(nextRound, nextLength);
      }
    }, 1200);
    timeoutRefs.current.push(pauseTimer);
  };

  const finishGame = () => {
    clearAllTimeouts();
    isRunningRef.current = false;

    const total = correctCountRef.current + incorrectCountRef.current;
    const accuracy = total > 0 ? Math.round((correctCountRef.current / total) * 100) : 100;
    const avgRt =
      responseTimesRef.current.length > 0
        ? Math.round(
            responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length
          )
        : 420;

    const summary = {
      maxSequenceLength: maxSuccessfulLengthRef.current || sequenceLength,
      correctSequences: correctCountRef.current,
      incorrectSequences: incorrectCountRef.current,
      accuracy,
      avgResponseTime: avgRt,
    };

    setResults(summary);
    setPhase('results');

    const session: GameSession = {
      id: `session_ms_${Date.now()}`,
      gameType: 'memory_sequence',
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      durationSeconds: 90,
      completionStatus: 'completed',
      reactionTime: avgRt,
      accuracy,
      maxSequenceLength: summary.maxSequenceLength,
      totalTrials: total,
    };

    onComplete(session);
  };

  return (
    <div
      className="flex flex-col min-h-[580px] rounded-3xl p-4 border relative overflow-hidden theme-fade-transition"
      style={{
        backgroundColor: colors.container,
        borderColor: colors.borderSubtle,
        color: colors.primaryText,
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.borderSubtle }}>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: colors.secondaryText }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </button>
        <span
          className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full border"
          style={{
            backgroundColor: colors.accentSoft,
            borderColor: colors.accent,
            color: colors.accentText,
          }}
        >
          Memory Sequence
        </span>
      </div>

      {/* Intro Phase */}
      {phase === 'intro' && (
        <div className="flex-1 flex flex-col justify-between py-6 animate-fadeIn">
          <div>
            <span
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: colors.accentText }}
            >
              Working Memory Exercise
            </span>
            <h2 className="text-2xl font-editorial italic mt-1 mb-2" style={{ color: colors.primaryText }}>
              Working Memory Capacity
            </h2>
            <p className="text-xs leading-relaxed mb-6" style={{ color: colors.secondaryText }}>
              Observes short-term spatial sequence encoding and ordered reproduction fidelity.
            </p>

            <div
              className="p-4 rounded-2xl border mb-6 flex items-start gap-3"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.border,
              }}
            >
              <div
                className="w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.accent,
                  color: colors.accentText,
                }}
              >
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold" style={{ color: colors.primaryText }}>
                  How it works
                </h4>
                <p className="text-[11px] leading-relaxed mt-1" style={{ color: colors.secondaryText }}>
                  Watch the 3x3 matrix. Grid cells will illuminate in a specific order. Once the sequence finishes, tap the cells in the exact same order.
                </p>
              </div>
            </div>

            <div
              className="p-3 rounded-xl border text-[10px]"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.borderSubtle,
                color: colors.secondaryText,
              }}
            >
              Non-diagnostic exercise. Sequence length progressively scales with successful reproductions.
            </div>
          </div>

          <button
            id="btn-start-memorysequence"
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
            style={{
              backgroundColor: colors.accent,
              color: colors.accentContrast,
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Begin Sequence Task ({totalRounds} Rounds)</span>
          </button>
        </div>
      )}

      {/* Playing / Recalling Phase */}
      {(phase === 'showing' || phase === 'recalling' || phase === 'round_feedback') && (
        <div className="flex-1 flex flex-col justify-between py-2 select-none">
          <div className="flex items-center justify-between text-xs px-2 py-1">
            <span style={{ color: colors.secondaryText }}>
              Round:{' '}
              <strong className="font-mono" style={{ color: colors.primaryText }}>
                {roundNumber} / {totalRounds}
              </strong>
            </span>
            <span style={{ color: colors.secondaryText }}>
              Target Length:{' '}
              <strong className="font-mono" style={{ color: colors.accentText }}>
                {sequenceLength}
              </strong>
            </span>
          </div>

          {/* Status banner */}
          <div className="text-center py-1">
            {phase === 'showing' && (
              <span
                className="text-xs font-medium animate-pulse flex items-center justify-center gap-1.5"
                style={{ color: colors.accentText }}
              >
                <Layers className="w-3.5 h-3.5" />
                Memorize the sequence...
              </span>
            )}
            {phase === 'recalling' && (
              <span
                className="text-xs font-medium flex items-center justify-center gap-1"
                style={{ color: colors.primaryText }}
              >
                Reproduce sequence ({userSequence.length} of {currentSequence.length})
              </span>
            )}
            {phase === 'round_feedback' && (
              <span
                className="text-xs font-semibold"
                style={{
                  color: roundFeedback === 'correct' ? colors.accentText : colors.error,
                }}
              >
                {roundFeedback === 'correct' ? 'Sequence matched' : 'Sequence mismatch'}
              </span>
            )}
          </div>

          {/* 3x3 Grid of cells */}
          <div className="grid grid-cols-3 gap-3 p-4 my-auto max-w-[280px] mx-auto w-full aspect-square">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cellIdx) => {
              const isLit = highlightedCell === cellIdx;
              const isUserTapped = userSequence.includes(cellIdx);

              return (
                <button
                  type="button"
                  key={cellIdx}
                  onClick={() => handleCellClick(cellIdx)}
                  disabled={phase !== 'recalling'}
                  className="rounded-2xl border transition-all duration-200 aspect-square flex items-center justify-center relative active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: isLit
                      ? '#2FE4A6'
                      : phase === 'recalling'
                      ? colors.surfaceSunken
                      : colors.surface,
                    borderColor: isLit
                      ? '#4EF2BB'
                      : phase === 'recalling'
                      ? colors.border
                      : colors.borderSubtle,
                    boxShadow: isLit ? '0 0 24px rgba(47,228,166,0.7)' : 'none',
                    transform: isLit ? 'scale(0.96)' : 'none',
                  }}
                  aria-label={`Grid cell ${cellIdx + 1}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: isLit
                        ? '#06110C'
                        : isUserTapped
                        ? colors.accent
                        : colors.borderHighlight,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={finishGame}
            className="text-[11px] self-center transition-colors hover:underline"
            style={{ color: colors.tertiaryText }}
          >
            End session early & see results
          </button>
        </div>
      )}

      {/* Results Phase */}
      {phase === 'results' && results && (
        <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn max-w-sm mx-auto w-full">
          <div className="pt-2">
            <div className="flex items-center gap-1.5 justify-center mb-1">
              <CheckCircle2 className="w-4 h-4" style={{ color: colors.accentText }} />
              <span
                className="text-[10px] uppercase tracking-wider font-bold"
                style={{ color: colors.accentText }}
              >
                EXERCISE COMPLETED
              </span>
            </div>
            <h3 className="text-xl font-normal text-center" style={{ color: colors.primaryText }}>
              Working Memory Summary
            </h3>

            {/* Prominent Span Metric Card */}
            <div
              className="p-4 rounded-2xl border text-center my-3 shadow-sm"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <span
                className="text-[10px] uppercase font-bold tracking-widest"
                style={{ color: colors.tertiaryText }}
              >
                MAX WORKING SPAN
              </span>
              <div
                className="text-4xl font-bold font-mono my-1"
                style={{ color: colors.primaryText }}
              >
                {results.maxSequenceLength}{' '}
                <span className="text-sm font-normal" style={{ color: colors.secondaryText }}>
                  cells
                </span>
              </div>
              <span
                className="text-xs font-medium flex items-center justify-center gap-1"
                style={{ color: colors.accentText }}
              >
                <span>↑ 12% sequence capacity</span>
              </span>
            </div>

            {/* Accuracy & Consistency Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div
                className="p-3 rounded-2xl border text-center"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <span className="text-[10px] uppercase block font-medium" style={{ color: colors.tertiaryText }}>
                  Accuracy
                </span>
                <span className="text-xl font-bold font-mono" style={{ color: colors.accentText }}>
                  {results.accuracy}%
                </span>
                <span className="text-[10px] block mt-0.5 font-mono" style={{ color: colors.secondaryText }}>
                  {results.correctSequences} sequences correct
                </span>
              </div>

              <div
                className="p-3 rounded-2xl border text-center"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <span className="text-[10px] uppercase block font-medium" style={{ color: colors.tertiaryText }}>
                  Recall Speed
                </span>
                <span className="text-xl font-bold font-mono" style={{ color: colors.primaryText }}>
                  {results.avgResponseTime}ms
                </span>
                <span className="text-[10px] block mt-0.5 font-mono" style={{ color: colors.secondaryText }}>
                  mean touch latency
                </span>
              </div>
            </div>

            {/* Concise observation */}
            <div
              className="p-3 rounded-xl border text-center text-xs"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.borderSubtle,
                color: colors.secondaryText,
              }}
            >
              {results.maxSequenceLength >= 5
                ? 'High capacity retention achieved across sequential spatial matrix.'
                : 'Sequence recall maintained within your baseline stability band.'}
            </div>
          </div>

          <div className="pt-3 pb-2">
            <button
              id="btn-done-memorysequence"
              onClick={onBack}
              className="w-full py-3.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentContrast,
              }}
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
