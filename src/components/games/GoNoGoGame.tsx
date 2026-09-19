import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { GameSession } from '../../types';

interface GoNoGoGameProps {
  onComplete: (session: GameSession) => void;
  onBack: () => void;
}

type Phase = 'intro' | 'playing' | 'results';
type Stimulus = 'GO' | 'NO_GO' | 'WAIT';

export const GoNoGoGame: React.FC<GoNoGoGameProps> = ({ onComplete, onBack }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [sessionDuration, setSessionDuration] = useState<number>(90); // 90s or 30s quick
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [stimulus, setStimulus] = useState<Stimulus>('WAIT');
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  // Metrics collection
  const trialsRef = useRef<{
    stimulus: 'GO' | 'NO_GO';
    responded: boolean;
    reactionTime: number; // ms
  }[]>([]);
  const stimulusStartTimeRef = useRef<number>(0);
  const respondedInCurrentTrialRef = useRef<boolean>(false);
  const timerIntervalRef = useRef<number | null>(null);
  const trialTimeoutRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);

  const [results, setResults] = useState<{
    meanRt: number;
    goAccuracy: number;
    noGoAccuracy: number;
    commissionErrors: number;
    omissionErrors: number;
    totalTrials: number;
    accuracy: number;
    rtVariability: number;
  } | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
      isRunningRef.current = false;
    };
  }, []);

  const startGame = (duration: number) => {
    trialsRef.current = [];
    setSessionDuration(duration);
    setTimeLeft(duration);
    setPhase('playing');
    setStimulus('WAIT');
    setLastFeedback(null);
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

    // Launch first trial
    scheduleNextTrial(1200);
  };

  const scheduleNextTrial = (delayMs: number) => {
    if (!isRunningRef.current) return;
    setStimulus('WAIT');

    trialTimeoutRef.current = window.setTimeout(() => {
      if (!isRunningRef.current) return;
      // 75% GO trials, 25% NO-GO trials (standard inhibition ratio)
      const nextStimulus: 'GO' | 'NO_GO' = Math.random() < 0.72 ? 'GO' : 'NO_GO';
      setStimulus(nextStimulus);
      stimulusStartTimeRef.current = Date.now();
      respondedInCurrentTrialRef.current = false;

      // Stimulus presentation window (850ms)
      trialTimeoutRef.current = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        // Trial finished without response if not responded
        if (!respondedInCurrentTrialRef.current) {
          if (nextStimulus === 'GO') {
            // Omission error (missed GO)
            trialsRef.current.push({ stimulus: 'GO', responded: false, reactionTime: 0 });
            setLastFeedback('missed');
          } else {
            // Correct inhibition!
            trialsRef.current.push({ stimulus: 'NO_GO', responded: false, reactionTime: 0 });
            setLastFeedback('held');
          }
        }

        setStimulus('WAIT');
        // Inter-stimulus jitter: 700ms - 1500ms
        const interTrialJitter = 700 + Math.floor(Math.random() * 800);
        scheduleNextTrial(interTrialJitter);
      }, 850);
    }, delayMs);
  };

  // User taps the response area
  const handleUserTap = () => {
    if (phase !== 'playing') return;
    if (stimulus === 'WAIT' || respondedInCurrentTrialRef.current) return;

    respondedInCurrentTrialRef.current = true;
    const rt = Date.now() - stimulusStartTimeRef.current;

    if (stimulus === 'GO') {
      trialsRef.current.push({ stimulus: 'GO', responded: true, reactionTime: rt });
      setLastFeedback('hit');
    } else if (stimulus === 'NO_GO') {
      // Commission error! (Tapped on NO-GO)
      trialsRef.current.push({ stimulus: 'NO_GO', responded: true, reactionTime: rt });
      setLastFeedback('commission');
    }
  };

  const finishGame = () => {
    isRunningRef.current = false;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);

    const allTrials = trialsRef.current;
    const goTrials = allTrials.filter((t) => t.stimulus === 'GO');
    const noGoTrials = allTrials.filter((t) => t.stimulus === 'NO_GO');

    const correctGo = goTrials.filter((t) => t.responded).length;
    const omissionErrors = goTrials.filter((t) => !t.responded).length;
    const commissionErrors = noGoTrials.filter((t) => t.responded).length;
    const correctNoGo = noGoTrials.filter((t) => !t.responded).length;

    const hitReactionTimes = goTrials.filter((t) => t.responded).map((t) => t.reactionTime);
    const meanRt =
      hitReactionTimes.length > 0
        ? Math.round(hitReactionTimes.reduce((a, b) => a + b, 0) / hitReactionTimes.length)
        : 0;

    // Variance / SD
    const variance =
      hitReactionTimes.length > 1
        ? hitReactionTimes.reduce((acc, val) => acc + Math.pow(val - meanRt, 2), 0) /
          hitReactionTimes.length
        : 0;
    const rtVariability = Math.round(Math.sqrt(variance));

    const goAccuracy = goTrials.length > 0 ? Math.round((correctGo / goTrials.length) * 100) : 100;
    const noGoAccuracy =
      noGoTrials.length > 0 ? Math.round((correctNoGo / noGoTrials.length) * 100) : 100;
    const totalCorrect = correctGo + correctNoGo;
    const accuracy =
      allTrials.length > 0 ? Math.round((totalCorrect / allTrials.length) * 100) : 100;

    const gameResults = {
      meanRt,
      goAccuracy,
      noGoAccuracy,
      commissionErrors,
      omissionErrors,
      totalTrials: allTrials.length,
      accuracy,
      rtVariability,
    };

    setResults(gameResults);
    setPhase('results');

    // Save session
    const session: GameSession = {
      sessionId: `gonogo_${Date.now()}`,
      gameType: 'gonogo',
      startTime: Date.now() - sessionDuration * 1000,
      endTime: Date.now(),
      durationSeconds: sessionDuration,
      trialCount: allTrials.length,
      accuracy,
      reactionTime: meanRt,
      reactionTimeVariability: rtVariability,
      errors: commissionErrors + omissionErrors,
      completionStatus: 'completed',
      goAccuracy,
      noGoAccuracy,
      commissionErrors,
      omissionErrors,
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
          Go / No-Go
        </span>
      </div>

      {/* Intro Phase */}
      {phase === 'intro' && (
        <div className="flex-1 flex flex-col justify-between py-6 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#2FE4A6] font-semibold">
              Cognitive Signal Exercise
            </span>
            <h2 className="text-2xl font-editorial italic text-[#F4F7F4] mt-1 mb-2">
              Inhibition & Attention
            </h2>
            <p className="text-xs text-[#8EA898] leading-relaxed mb-6">
              Observe your cognitive response latency and impulse inhibition.
            </p>

            {/* Stimulus visual rules */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0D2319] border border-[#1A4430]">
                <div className="w-12 h-12 rounded-2xl bg-[#2FE4A6]/20 border-2 border-[#2FE4A6] flex items-center justify-center text-[#2FE4A6] font-bold text-xs">
                  GO
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F4F7F4]">Tap on Mint Signal (GO)</h4>
                  <p className="text-[11px] text-[#8EA898]">
                    Tap anywhere on the large pad as fast and accurately as possible.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0D2319] border border-[#1A4430]">
                <div className="w-12 h-12 rounded-2xl bg-[#F28B82]/20 border-2 border-[#F28B82] flex items-center justify-center text-[#F28B82] font-bold text-xs">
                  NO-GO
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F4F7F4]">Hold on Coral Signal (NO-GO)</h4>
                  <p className="text-[11px] text-[#8EA898]">
                    Withhold your tap completely when the warning stimulus appears.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#071710] border border-[#143625] text-[10px] text-[#7E9A89]">
              Non-diagnostic exercise. Measures autonomic motor response latency and inhibition consistency.
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <button
              id="btn-start-gonogo-full"
              onClick={() => startGame(90)}
              className="w-full py-3.5 rounded-2xl bg-[#2FE4A6] text-[#06110C] font-semibold text-xs hover:bg-[#4EF2BB] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#2FE4A6]/10"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Standard Session (90s)</span>
            </button>
            <button
              id="btn-start-gonogo-quick"
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
          {/* Header row */}
          <div className="flex items-center justify-between text-xs px-2 py-1">
            <span className="text-[#8EA898]">
              Time remaining: <strong className="text-[#F4F7F4] font-mono">{timeLeft}s</strong>
            </span>
            <span className="text-[#8EA898]">
              Recorded: <strong className="text-[#2FE4A6] font-mono">{trialsRef.current.length}</strong>
            </span>
          </div>

          {/* Interactive Stimulus / Response Pad */}
          <div
            id="gonogo-touch-pad"
            onClick={handleUserTap}
            className="flex-1 my-3 rounded-3xl bg-[#0B2117] border-2 border-[#1C4734] active:border-[#2FE4A6] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden"
          >
            {/* Stimulus display */}
            {stimulus === 'WAIT' && (
              <div className="flex flex-col items-center gap-2 text-center p-4">
                <span className="w-4 h-4 rounded-full bg-[#183D2D] animate-ping" />
                <span className="text-xs text-[#5C7D6B] font-mono">Observe stimulus...</span>
              </div>
            )}

            {stimulus === 'GO' && (
              <div className="flex flex-col items-center animate-scaleUp">
                <div className="w-32 h-32 rounded-full bg-[#2FE4A6] text-[#06110C] flex items-center justify-center font-bold text-2xl shadow-[0_0_40px_rgba(47,228,166,0.4)]">
                  TAP
                </div>
                <span className="mt-3 text-xs font-semibold text-[#2FE4A6] uppercase tracking-wider">
                  GO SIGNAL
                </span>
              </div>
            )}

            {stimulus === 'NO_GO' && (
              <div className="flex flex-col items-center animate-scaleUp">
                <div className="w-32 h-32 rounded-3xl bg-[#F28B82] text-[#06110C] flex items-center justify-center font-bold text-2xl shadow-[0_0_40px_rgba(242,139,130,0.4)]">
                  HOLD
                </div>
                <span className="mt-3 text-xs font-semibold text-[#F28B82] uppercase tracking-wider">
                  NO-GO (DO NOT TAP)
                </span>
              </div>
            )}

            {/* Micro visual hint */}
            <div className="absolute bottom-3 text-[10px] text-[#719380] uppercase tracking-wider">
              Tap anywhere inside this box
            </div>
          </div>

          {/* Manual early finish */}
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
              Observed Performance
            </h3>
            <p className="text-xs text-[#8EA898] mb-4">
              Your cognitive latency and inhibition metrics have been recorded locally.
            </p>

            {/* Metrics Bento */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Mean Reaction Time</span>
                <span className="text-xl font-bold font-mono text-[#F4F7F4]">
                  {results.meanRt} <span className="text-xs font-normal text-[#8EA898]">ms</span>
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Variability: ±{results.rtVariability} ms
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Overall Accuracy</span>
                <span className="text-xl font-bold font-mono text-[#2FE4A6]">
                  {results.accuracy}%
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  {results.totalTrials} total stimuli
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">Go Accuracy</span>
                <span className="text-base font-bold font-mono text-[#E4EDE7]">
                  {results.goAccuracy}%
                </span>
                <span className="text-[10px] text-[#7E9A8A] block mt-0.5">
                  Omissions: {results.omissionErrors}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0D2218] border border-[#19402E]">
                <span className="text-[10px] uppercase text-[#8EA898] block">No-Go Accuracy</span>
                <span className="text-base font-bold font-mono text-[#E4EDE7]">
                  {results.noGoAccuracy}%
                </span>
                <span className="text-[10px] text-[#F28B82] block mt-0.5">
                  Commission: {results.commissionErrors}
                </span>
              </div>
            </div>

            {/* Non diagnostic observation */}
            <div className="p-3 rounded-2xl bg-[#07160F] border border-[#153826] text-xs text-[#8EA898] leading-relaxed">
              <strong className="text-[#D8E6DD] block mb-0.5">Personal Pattern Note:</strong>
              {results.commissionErrors === 0
                ? 'Your inhibitory control remained steady throughout the session.'
                : `Observed ${results.commissionErrors} commission error(s), reflecting typical attentional fluctuations during continuous stimulus streams.`}
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
              id="btn-done-gonogo"
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
