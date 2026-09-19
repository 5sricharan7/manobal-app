import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, CheckCircle2, Target } from 'lucide-react';
import { GameSession } from '../../types';

interface ReactionDotGameProps {
  onComplete: (session: GameSession) => void;
  onBack: () => void;
}

type Phase = 'intro' | 'playing' | 'results';

interface DotTrial {
  x: number; // percentage (10 to 90)
  y: number; // percentage (10 to 90)
  spawnTime: number;
  tapTime?: number;
  reactionTime?: number;
  hit: boolean;
}

export const ReactionDotGame: React.FC<ReactionDotGameProps> = ({ onComplete, onBack }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [sessionDuration, setSessionDuration] = useState<number>(90);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [activeDot, setActiveDot] = useState<{ x: number; y: number } | null>(null);

  const trialsRef = useRef<DotTrial[]>([]);
  const dotSpawnTimeRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const timerIntervalRef = useRef<number | null>(null);
  const spawnTimeoutRef = useRef<number | null>(null);
  const expirationTimeoutRef = useRef<number | null>(null);

  const [results, setResults] = useState<{
    avgRt: number;
    medianRt: number;
    rtVariability: number;
    successfulTaps: number;
    missedTrials: number;
    totalTrials: number;
    accuracy: number;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      if (expirationTimeoutRef.current) clearTimeout(expirationTimeoutRef.current);
      isRunningRef.current = false;
    };
  }, []);

  const startGame = (duration: number) => {
    trialsRef.current = [];
    setSessionDuration(duration);
    setTimeLeft(duration);
    setPhase('playing');
    setActiveDot(null);
    isRunningRef.current = true;

    // Countdown interval
    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Schedule initial dot
    scheduleNextDot(1000);
  };

  const scheduleNextDot = (delayMs: number) => {
    if (!isRunningRef.current) return;
    setActiveDot(null);

    spawnTimeoutRef.current = window.setTimeout(() => {
      if (!isRunningRef.current) return;

      // Safe coordinate bounds (15% to 85% to stay well inside the touch container)
      const x = 15 + Math.floor(Math.random() * 70);
      const y = 15 + Math.floor(Math.random() * 70);

      dotSpawnTimeRef.current = Date.now();
      setActiveDot({ x, y });

      // Dot stays visible for up to 1300ms before expiring as missed
      expirationTimeoutRef.current = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        // If still active, record as missed
        trialsRef.current.push({
          x,
          y,
          spawnTime: dotSpawnTimeRef.current,
          hit: false,
        });
        setActiveDot(null);

        // Next dot after random jitter (600ms - 1600ms)
        const nextDelay = 600 + Math.floor(Math.random() * 1000);
        scheduleNextDot(nextDelay);
      }, 1300);
    }, delayMs);
  };

  const handleDotTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeDot || !isRunningRef.current) return;

    if (expirationTimeoutRef.current) clearTimeout(expirationTimeoutRef.current);

    const now = Date.now();
    const rt = now - dotSpawnTimeRef.current;

    trialsRef.current.push({
      x: activeDot.x,
      y: activeDot.y,
      spawnTime: dotSpawnTimeRef.current,
      tapTime: now,
      reactionTime: rt,
      hit: true,
    });

    setActiveDot(null);

    // Schedule next dot with random jitter
    const nextDelay = 500 + Math.floor(Math.random() * 900);
    scheduleNextDot(nextDelay);
  };

  const finishGame = () => {
    isRunningRef.current = false;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    if (expirationTimeoutRef.current) clearTimeout(expirationTimeoutRef.current);

    const allTrials = trialsRef.current;
    const successful = allTrials.filter((t) => t.hit && t.reactionTime !== undefined);
    const missed = allTrials.filter((t) => !t.hit);

    const rts = successful.map((t) => t.reactionTime!).sort((a, b) => a - b);
    const avgRt = rts.length > 0 ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : 0;

    let medianRt = 0;
    if (rts.length > 0) {
      const mid = Math.floor(rts.length / 2);
      medianRt = rts.length % 2 !== 0 ? rts[mid] : Math.round((rts[mid - 1] + rts[mid]) / 2);
    }

    // Reaction Time Variability (SD)
    const variance =
      rts.length > 1
        ? rts.reduce((acc, val) => acc + Math.pow(val - avgRt, 2), 0) / rts.length
        : 0;
    const rtVariability = Math.round(Math.sqrt(variance));

    const accuracy =
      allTrials.length > 0 ? Math.round((successful.length / allTrials.length) * 100) : 100;

    const gameResults = {
      avgRt,
      medianRt,
      rtVariability,
      successfulTaps: successful.length,
      missedTrials: missed.length,
      totalTrials: allTrials.length,
      accuracy,
    };

    setResults(gameResults);
    setPhase('results');

    const session: GameSession = {
      sessionId: `reactiondot_${Date.now()}`,
      gameType: 'reaction_dot',
      startTime: Date.now() - sessionDuration * 1000,
      endTime: Date.now(),
      durationSeconds: sessionDuration,
      trialCount: allTrials.length,
      accuracy,
      reactionTime: avgRt,
      reactionTimeVariability: rtVariability,
      errors: missed.length,
      completionStatus: 'completed',
      medianReactionTime: medianRt,
      successfulTaps: successful.length,
      missedTrials: missed.length,
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
          Reaction Dot
        </span>
      </div>

      {/* Intro Phase */}
      {phase === 'intro' && (
        <div className="flex-1 flex flex-col justify-between py-6 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#2FE4A6] font-semibold">
              Cognitive Speed Exercise
            </span>
            <h2 className="text-2xl font-editorial italic text-[#F4F7F4] mt-1 mb-2">
              Visual Reaction Speed
            </h2>
            <p className="text-xs text-[#8EA898] leading-relaxed mb-6">
              Measures visual-spatial orientation latency and motor response speed.
            </p>

            <div className="p-4 rounded-2xl bg-[#0D2319] border border-[#1A4430] mb-6 flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2FE4A6]/20 border border-[#2FE4A6] flex items-center justify-center text-[#2FE4A6] shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F4F7F4]">How to play</h4>
                <p className="text-[11px] text-[#8EA898] leading-relaxed mt-1">
                  A mint dot will appear at unpredictable locations and intervals across the field. Tap each dot the instant you register it.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#071710] border border-[#143625] text-[10px] text-[#7E9A89]">
              Non-diagnostic exercise. High variability often corresponds to natural circadian or attentional shifts.
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <button
              id="btn-start-reactiondot-full"
              onClick={() => startGame(90)}
              className="w-full py-3.5 rounded-2xl bg-[#2FE4A6] text-[#06110C] font-semibold text-xs hover:bg-[#4EF2BB] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#2FE4A6]/10"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Standard Session (90s)</span>
            </button>
            <button
              id="btn-start-reactiondot-quick"
              onClick={() => startGame(30)}
              className="w-full py-2.5 rounded-2xl border border-[#1B4633] text-xs font-medium text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#102B1E] transition-colors"
            >
              Quick Test Mode (30s)
            </button>
          </div>
        </div>
      )}

      {/* Playing Phase */}
      {phase === 'playing' && (
        <div className="flex-1 flex flex-col justify-between py-2 select-none">
          <div className="flex items-center justify-between text-xs px-2 py-1">
            <span className="text-[#8EA898]">
              Time remaining: <strong className="text-[#F4F7F4] font-mono">{timeLeft}s</strong>
            </span>
            <span className="text-[#8EA898]">
              Hits: <strong className="text-[#2FE4A6] font-mono">{trialsRef.current.filter((t) => t.hit).length}</strong>
            </span>
          </div>

          {/* Interactive Arena */}
          <div
            id="reaction-dot-arena"
            className="flex-1 my-3 rounded-3xl bg-[#0A1F15] border-2 border-[#194431] relative overflow-hidden touch-none"
          >
            {/* Grid texture for spatial orientation */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2FE4A6_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* The Target Dot */}
            {activeDot && (
              <button
                type="button"
                onClick={handleDotTap}
                style={{
                  top: `${activeDot.y}%`,
                  left: `${activeDot.x}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute w-14 h-14 rounded-full bg-[#2FE4A6] shadow-[0_0_24px_rgba(47,228,166,0.8)] flex items-center justify-center animate-pingOnce active:scale-95 transition-transform"
                aria-label="Tap target dot"
              >
                <span className="w-5 h-5 rounded-full bg-[#06110C]" />
              </button>
            )}

            {!activeDot && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] text-[#4F735E] font-mono">Observe field...</span>
              </div>
            )}
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
              Reaction Speed Summary
            </h3>
            <p className="text-xs text-[#8EA898] mb-4">
              Local telemetry logged across {results.totalTrials} spatial trials.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Average Reaction Time</span>
                <span className="text-xl font-bold font-mono text-[#F4F7F4]">
                  {results.avgRt} <span className="text-xs font-normal text-[#8EA898]">ms</span>
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Median: {results.medianRt} ms
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">RT Variability (SD)</span>
                <span className="text-xl font-bold font-mono text-[#2FE4A6]">
                  ±{results.rtVariability} <span className="text-xs font-normal text-[#8EA898]">ms</span>
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Consistency index
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Successful Taps</span>
                <span className="text-base font-bold font-mono text-[#2FE4A6]">
                  {results.successfulTaps}
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Acc: {results.accuracy}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Missed / Late Trials</span>
                <span className="text-base font-bold font-mono text-[#F28B82]">
                  {results.missedTrials}
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Timeouts (&gt;1300ms)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#07160F] border border-[#153826] text-xs text-[#8EA898] leading-relaxed">
              <strong className="text-[#D8E6DD] block mb-0.5">Personal Pattern Note:</strong>
              {results.rtVariability < 45
                ? 'Your visual-motor latency was notably stable across spatial coordinates.'
                : 'Reaction variance remained within typical baseline boundaries.'}
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
              id="btn-done-reactiondot"
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
