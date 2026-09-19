import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, CheckCircle2, Grid, Layers } from 'lucide-react';
import { GameSession } from '../../types';

interface MemorySequenceGameProps {
  onComplete: (session: GameSession) => void;
  onBack: () => void;
}

type Phase = 'intro' | 'showing' | 'recalling' | 'round_feedback' | 'results';

export const MemorySequenceGame: React.FC<MemorySequenceGameProps> = ({ onComplete, onBack }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [sequenceLength, setSequenceLength] = useState<number>(3);
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [highlightedCell, setHighlightedCell] = useState<number | null>(null);
  const [roundFeedback, setRoundFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const totalRounds = 7; // or 90s duration

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
    isRunningRef.current = true;
    setRoundNumber(1);
    setSequenceLength(3);

    startNewRound(1, 3);
  };

  const startNewRound = (round: number, length: number) => {
    setRoundNumber(round);
    setUserSequence([]);
    setRoundFeedback(null);
    setHighlightedCell(null);
    setPhase('showing');

    // Generate random non-repeating or consecutive sequence from 0 to 8
    const newSeq: number[] = [];
    while (newSeq.length < length) {
      const nextCell = Math.floor(Math.random() * 9);
      if (newSeq.length === 0 || newSeq[newSeq.length - 1] !== nextCell) {
        newSeq.push(nextCell);
      }
    }
    setCurrentSequence(newSeq);

    // Playback sequence flashes
    newSeq.forEach((cell, index) => {
      // flash on
      const onTime = 800 + index * 700;
      const tOn = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        setHighlightedCell(cell);
      }, onTime);
      timeoutRefs.current.push(tOn);

      // flash off
      const offTime = onTime + 450;
      const tOff = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        setHighlightedCell(null);
      }, offTime);
      timeoutRefs.current.push(tOff);
    });

    // After playback finishes, switch to recall phase
    const totalPlaybackTime = 800 + length * 700 + 400;
    const tRecall = window.setTimeout(() => {
      if (!isRunningRef.current) return;
      setPhase('recalling');
      recallStartTimeRef.current = Date.now();
    }, totalPlaybackTime);
    timeoutRefs.current.push(tRecall);
  };

  const handleCellClick = (cellIndex: number) => {
    if (phase !== 'recalling' || !isRunningRef.current) return;

    // Flash tapped cell briefly
    setHighlightedCell(cellIndex);
    setTimeout(() => setHighlightedCell(null), 180);

    const nextUserSeq = [...userSequence, cellIndex];
    setUserSequence(nextUserSeq);

    // Check if the tap matches the sequence so far
    const currentIndex = nextUserSeq.length - 1;
    if (currentSequence[currentIndex] !== cellIndex) {
      // Immediate mistake on this trial!
      handleRoundOutcome(false);
      return;
    }

    // If reached end of sequence
    if (nextUserSeq.length === currentSequence.length) {
      handleRoundOutcome(true);
    }
  };

  const handleRoundOutcome = (isCorrect: boolean) => {
    const elapsed = Date.now() - recallStartTimeRef.current;
    responseTimesRef.current.push(elapsed);

    if (isCorrect) {
      correctCountRef.current += 1;
      maxSuccessfulLengthRef.current = Math.max(maxSuccessfulLengthRef.current, sequenceLength);
      setRoundFeedback('correct');
    } else {
      incorrectCountRef.current += 1;
      setRoundFeedback('incorrect');
    }

    setPhase('round_feedback');

    const tNext = window.setTimeout(() => {
      if (!isRunningRef.current) return;
      if (roundNumber >= totalRounds) {
        finishGame();
      } else {
        // Adapt sequence length: increment on correct, hold or decrement slightly on incorrect
        const nextLen = isCorrect ? Math.min(sequenceLength + 1, 7) : Math.max(sequenceLength - 1, 3);
        setSequenceLength(nextLen);
        startNewRound(roundNumber + 1, nextLen);
      }
    }, 1200);
    timeoutRefs.current.push(tNext);
  };

  const finishGame = () => {
    isRunningRef.current = false;
    clearAllTimeouts();

    const total = correctCountRef.current + incorrectCountRef.current;
    const accuracy = total > 0 ? Math.round((correctCountRef.current / total) * 100) : 100;
    const avgRt =
      responseTimesRef.current.length > 0
        ? Math.round(
            responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length
          )
        : 0;

    const gameResults = {
      maxSequenceLength: maxSuccessfulLengthRef.current,
      correctSequences: correctCountRef.current,
      incorrectSequences: incorrectCountRef.current,
      accuracy,
      avgResponseTime: avgRt,
    };

    setResults(gameResults);
    setPhase('results');

    const session: GameSession = {
      sessionId: `memorysequence_${Date.now()}`,
      gameType: 'memory_sequence',
      startTime: Date.now() - 90000,
      endTime: Date.now(),
      durationSeconds: 90,
      trialCount: total,
      accuracy,
      reactionTime: avgRt,
      reactionTimeVariability: 0,
      errors: incorrectCountRef.current,
      completionStatus: 'completed',
      maxSequenceLength: maxSuccessfulLengthRef.current,
      correctSequences: correctCountRef.current,
      incorrectSequences: incorrectCountRef.current,
    };

    onComplete(session);
  };

  return (
    <div className="flex flex-col min-h-[580px] bg-[#06110C] text-[#F4F7F4] rounded-3xl p-4 border border-[#173F2D] relative overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#143224]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#8EA898] hover:text-[#F4F7F4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </button>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#2FE4A6] bg-[#0F281C] px-2.5 py-0.5 rounded-full border border-[#1E4D36]">
          Memory Sequence
        </span>
      </div>

      {/* Intro Phase */}
      {phase === 'intro' && (
        <div className="flex-1 flex flex-col justify-between py-6 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#2FE4A6] font-semibold">
              Working Memory Exercise
            </span>
            <h2 className="text-2xl font-editorial italic text-[#F4F7F4] mt-1 mb-2">
              Working Memory Capacity
            </h2>
            <p className="text-xs text-[#8EA898] leading-relaxed mb-6">
              Observes short-term spatial sequence encoding and ordered reproduction fidelity.
            </p>

            <div className="p-4 rounded-2xl bg-[#0D2319] border border-[#1A4430] mb-6 flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2FE4A6]/20 border border-[#2FE4A6] flex items-center justify-center text-[#2FE4A6] shrink-0 mt-0.5">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F4F7F4]">How it works</h4>
                <p className="text-[11px] text-[#8EA898] leading-relaxed mt-1">
                  Watch the 3x3 matrix. Grid cells will illuminate in a specific order. Once the sequence finishes, tap the cells in the exact same order.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#071710] border border-[#143625] text-[10px] text-[#7E9A89]">
              Non-diagnostic exercise. Sequence length progressively scales with successful reproductions.
            </div>
          </div>

          <button
            id="btn-start-memorysequence"
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl bg-[#2FE4A6] text-[#06110C] font-semibold text-xs hover:bg-[#4EF2BB] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#2FE4A6]/10"
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
            <span className="text-[#8EA898]">
              Round: <strong className="text-[#F4F7F4] font-mono">{roundNumber} / {totalRounds}</strong>
            </span>
            <span className="text-[#8EA898]">
              Target Length: <strong className="text-[#2FE4A6] font-mono">{sequenceLength}</strong>
            </span>
          </div>

          {/* Status banner */}
          <div className="text-center py-1">
            {phase === 'showing' && (
              <span className="text-xs text-[#2FE4A6] font-medium animate-pulse flex items-center justify-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Memorize the sequence...
              </span>
            )}
            {phase === 'recalling' && (
              <span className="text-xs text-[#F4F7F4] font-medium flex items-center justify-center gap-1">
                Reproduce sequence ({userSequence.length} of {currentSequence.length})
              </span>
            )}
            {phase === 'round_feedback' && (
              <span
                className={`text-xs font-semibold ${
                  roundFeedback === 'correct' ? 'text-[#2FE4A6]' : 'text-[#F28B82]'
                }`}
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
                  className={`rounded-2xl border transition-all duration-200 aspect-square flex items-center justify-center relative ${
                    isLit
                      ? 'bg-[#2FE4A6] border-[#4EF2BB] shadow-[0_0_24px_rgba(47,228,166,0.7)] scale-95'
                      : phase === 'recalling'
                      ? 'bg-[#0D241A] border-[#1C4633] hover:border-[#2FE4A6] active:scale-95 cursor-pointer'
                      : 'bg-[#091A12] border-[#143224]'
                  }`}
                  aria-label={`Grid cell ${cellIdx + 1}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isLit ? 'bg-[#06110C]' : isUserTapped ? 'bg-[#2FE4A6]/60' : 'bg-[#183928]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={finishGame}
            className="text-[11px] text-[#698875] hover:text-[#A6C4B1] self-center transition-colors"
          >
            End session early & see results
          </button>
        </div>
      )}

      {/* Results Phase */}
      {phase === 'results' && results && (
        <div className="flex-1 flex flex-col justify-between py-3 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#2FE4A6]" />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#2FE4A6]">
                Exercise Completed
              </span>
            </div>
            <h3 className="text-xl font-editorial italic text-[#F4F7F4] mb-1">
              Working Memory Summary
            </h3>
            <p className="text-xs text-[#8EA898] mb-4">
              Local evaluation of spatial sequence retention.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Max Span Length</span>
                <span className="text-xl font-bold font-mono text-[#2FE4A6]">
                  {results.maxSequenceLength} <span className="text-xs font-normal text-[#8EA898]">cells</span>
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Peak working span
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Sequence Accuracy</span>
                <span className="text-xl font-bold font-mono text-[#F4F7F4]">
                  {results.accuracy}%
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  {results.correctSequences} correct / {results.incorrectSequences} missed
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Correct Reproductions</span>
                <span className="text-base font-bold font-mono text-[#2FE4A6]">
                  {results.correctSequences}
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Successful trials
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Mean Recall Latency</span>
                <span className="text-base font-bold font-mono text-[#E4EDE7]">
                  {results.avgResponseTime} <span className="text-xs font-normal text-[#8EA898]">ms</span>
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Response latency
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#07160F] border border-[#153826] text-xs text-[#8EA898] leading-relaxed">
              <strong className="text-[#D8E6DD] block mb-0.5">Personal Pattern Note:</strong>
              {results.maxSequenceLength >= 5
                ? 'Your spatial sequence retention reached high capacity across trials.'
                : 'Working memory reproduction was stable within standard baseline bounds.'}
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              onClick={() => setPhase('intro')}
              className="flex-1 py-3 rounded-2xl border border-[#19412F] text-xs font-semibold text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#0E271B] transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              id="btn-done-memorysequence"
              onClick={onBack}
              className="flex-1 py-3 rounded-2xl bg-[#2FE4A6] text-[#06110C] text-xs font-semibold hover:bg-[#4EF2BB] transition-colors"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
