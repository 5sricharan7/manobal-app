import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { CheckInRecord } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface CheckInScreenProps {
  checkIns: CheckInRecord[];
  onSaveCheckIn: (record: CheckInRecord) => void;
  onRequestFeedback: (source: 'checkin', metadata: string) => void;
  onReturnHome?: () => void;
}

export const CheckInScreen: React.FC<CheckInScreenProps> = ({
  checkIns,
  onSaveCheckIn,
  onRequestFeedback,
  onReturnHome,
}) => {
  const { colors, isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [wellbeing, setWellbeing] = useState<number>(4);
  const [energy, setEnergy] = useState<number>(3);
  const [rested, setRested] = useState<number>(4);
  const [focus, setFocus] = useState<number>(4);
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newRecord: CheckInRecord = {
      id: `checkin_${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      wellbeing,
      rested,
      energy,
      focus,
      notes: notes.trim() || undefined,
    };

    onSaveCheckIn(newRecord);
    setSubmitted(true);

    setTimeout(() => {
      onRequestFeedback('checkin', 'daily_checkin');
    }, 400);
  };

  const render5PointSelector = (
    value: number,
    onChange: (val: number) => void,
    lowLabel: string,
    highLabel: string
  ) => {
    return (
      <div className="space-y-1.5 pt-1">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = value === num;
            return (
              <button
                type="button"
                key={num}
                onClick={() => onChange(num)}
                className="py-3 rounded-2xl font-mono text-sm font-semibold transition-all active:scale-95 border"
                style={{
                  backgroundColor: isSelected ? colors.accent : colors.surfaceSunken,
                  borderColor: isSelected ? colors.accent : colors.borderSubtle,
                  color: isSelected ? colors.accentContrast : colors.secondaryText,
                  boxShadow: isSelected ? '0 2px 10px rgba(47,228,166,0.25)' : 'none',
                  transform: isSelected ? 'scale(1.02)' : 'none',
                }}
              >
                {num}
              </button>
            );
          })}
        </div>
        <div
          className="flex items-center justify-between text-[10px] px-1 font-mono"
          style={{ color: colors.tertiaryText }}
        >
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    );
  };

  // Submitted Confirmation Screen
  if (submitted) {
    return (
      <div className="space-y-4 pb-20 pt-2 animate-fadeIn max-w-sm mx-auto theme-fade-transition">
        <div
          className="p-6 rounded-3xl border text-center space-y-4 shadow-sm"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <div
            className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
              color: colors.accentText,
            }}
          >
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span
              className="text-[10px] uppercase font-bold tracking-widest"
              style={{ color: colors.accentText }}
            >
              STATUS LOGGED
            </span>
            <h2 className="text-2xl font-normal" style={{ color: colors.primaryText }}>
              Signals synchronized.
            </h2>
            <p className="text-xs" style={{ color: colors.secondaryText }}>
              Subjective states logged on-device to correlate with biometric trends.
            </p>
          </div>

          {/* Summary Pill */}
          <div
            className="py-2.5 px-4 rounded-2xl border inline-flex items-center gap-2 text-xs font-mono"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
              color: colors.primaryText,
            }}
          >
            <span>
              Mood: <strong style={{ color: colors.accentText }}>{wellbeing}/5</strong>
            </span>
            <span style={{ color: colors.tertiaryText }}>·</span>
            <span>
              Energy: <strong style={{ color: colors.accentText }}>{energy}/5</strong>
            </span>
            <span style={{ color: colors.tertiaryText }}>·</span>
            <span>
              Clarity: <strong style={{ color: colors.accentText }}>{focus}/5</strong>
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <button
              id="btn-return-home-checkin"
              onClick={() => {
                if (onReturnHome) onReturnHome();
                else setSubmitted(false);
              }}
              className="w-full py-3.5 rounded-2xl font-semibold text-xs transition-all shadow-sm active:scale-[0.98]"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentContrast,
              }}
            >
              RETURN TO HOME
            </button>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full py-2.5 rounded-xl text-xs transition-colors hover:underline"
              style={{ color: colors.secondaryText }}
            >
              Log another entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 pt-1 animate-fadeIn max-w-sm mx-auto theme-fade-transition">
      {/* Title */}
      <section className="pt-1 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-normal" style={{ color: colors.primaryText }}>
            Self-check.
          </h1>
          <p className="text-xs mt-0.5" style={{ color: colors.secondaryText }}>
            Calibrate your subjective signals.
          </p>
        </div>

        {/* Step Indicator */}
        <div
          className="px-2.5 py-1 rounded-full border text-[10px] font-mono"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.border,
            color: colors.secondaryText,
          }}
        >
          Step{' '}
          <span className="font-semibold" style={{ color: colors.primaryText }}>
            {currentStep}
          </span>{' '}
          of 3
        </div>
      </section>

      {/* Progress Bars */}
      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: currentStep >= s ? colors.accent : colors.surfaceSunken,
            }}
          />
        ))}
      </div>

      {/* Step 1: Mood & Energy */}
      {currentStep === 1 && (
        <div
          className="p-5 rounded-3xl border space-y-5 shadow-sm animate-fadeIn theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <div>
            <span
              className="text-[10px] uppercase font-bold tracking-widest block mb-1"
              style={{ color: colors.accentText }}
            >
              STEP 1: MOOD & VITALITY
            </span>
            <h3 className="text-base font-semibold" style={{ color: colors.primaryText }}>
              Current Mood
            </h3>
            <p className="text-xs" style={{ color: colors.secondaryText }}>
              Sense of emotional equilibrium and mood tone.
            </p>
            {render5PointSelector(wellbeing, setWellbeing, '1: Heavy', '5: Elevated')}
          </div>

          <div className="pt-2 border-t" style={{ borderColor: colors.borderSubtle }}>
            <h3 className="text-base font-semibold" style={{ color: colors.primaryText }}>
              Current Energy
            </h3>
            <p className="text-xs" style={{ color: colors.secondaryText }}>
              Physical vitality and activation level.
            </p>
            {render5PointSelector(energy, setEnergy, '1: Depleted', '5: High Vitality')}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3.5 rounded-2xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentContrast,
              }}
            >
              <span>CONTINUE TO STEP 2</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Mental Fatigue & Cognitive Clarity */}
      {currentStep === 2 && (
        <div
          className="p-5 rounded-3xl border space-y-5 shadow-sm animate-fadeIn theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <div>
            <span
              className="text-[10px] uppercase font-bold tracking-widest block mb-1"
              style={{ color: colors.accentText }}
            >
              STEP 2: COGNITIVE STATE
            </span>
            <h3 className="text-base font-semibold" style={{ color: colors.primaryText }}>
              Mental Fatigue & Recovery
            </h3>
            <p className="text-xs" style={{ color: colors.secondaryText }}>
              Subjective restorative depth from rest.
            </p>
            {render5PointSelector(rested, setRested, '1: Exhausted', '5: Fully Restored')}
          </div>

          <div className="pt-2 border-t" style={{ borderColor: colors.borderSubtle }}>
            <h3 className="text-base font-semibold" style={{ color: colors.primaryText }}>
              Cognitive Clarity
            </h3>
            <p className="text-xs" style={{ color: colors.secondaryText }}>
              Mental sharpness and attentional presence.
            </p>
            {render5PointSelector(focus, setFocus, '1: Brain fog', '5: Razor Sharp')}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="py-3.5 px-4 rounded-2xl border text-xs font-medium transition-colors flex items-center justify-center active:scale-95"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.border,
                color: colors.secondaryText,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-3.5 rounded-2xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentContrast,
              }}
            >
              <span>CONTINUE TO STEP 3</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Quick Context & Notes */}
      {currentStep === 3 && (
        <div
          className="p-5 rounded-3xl border space-y-4 shadow-sm animate-fadeIn theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <div>
            <span
              className="text-[10px] uppercase font-bold tracking-widest block mb-1"
              style={{ color: colors.accentText }}
            >
              STEP 3: QUICK CONTEXT
            </span>
            <h3 className="text-base font-semibold" style={{ color: colors.primaryText }}>
              Contextual Notes (Optional)
            </h3>
            <p className="text-xs mb-2" style={{ color: colors.secondaryText }}>
              Add brief notes on workload, stressors, caffeine, or medications.
            </p>
            <textarea
              id="checkin-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Late flight yesterday, medium coffee morning, focused work sprint..."
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border transition-colors resize-none focus:outline-none"
              style={{
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.primaryText,
              }}
            />
          </div>

          {/* Quick Summary Pill preview */}
          <div
            className="p-3 rounded-2xl border text-center"
            style={{
              backgroundColor: colors.surfaceSunken,
              borderColor: colors.borderSubtle,
            }}
          >
            <span
              className="text-[10px] uppercase font-mono block mb-1"
              style={{ color: colors.tertiaryText }}
            >
              SUMMARY PREVIEW
            </span>
            <div
              className="flex items-center justify-center gap-2 text-xs font-mono"
              style={{ color: colors.primaryText }}
            >
              <span>
                Mood: <strong style={{ color: colors.accentText }}>{wellbeing}/5</strong>
              </span>
              <span style={{ color: colors.tertiaryText }}>·</span>
              <span>
                Energy: <strong style={{ color: colors.accentText }}>{energy}/5</strong>
              </span>
              <span style={{ color: colors.tertiaryText }}>·</span>
              <span>
                Clarity: <strong style={{ color: colors.accentText }}>{focus}/5</strong>
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="py-3.5 px-4 rounded-2xl border text-xs font-medium transition-colors flex items-center justify-center active:scale-95"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.border,
                color: colors.secondaryText,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="btn-submit-checkin"
              onClick={() => handleSubmit()}
              className="flex-1 py-3.5 rounded-2xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentContrast,
              }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>SYNC SIGNALS</span>
            </button>
          </div>
        </div>
      )}

      {/* Discrete Recent History section */}
      {checkIns.length > 0 && (
        <section
          className="rounded-2xl border p-4 space-y-2.5 shadow-sm theme-fade-transition"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[11px] font-semibold flex items-center gap-1.5"
              style={{ color: colors.secondaryText }}
            >
              <Calendar className="w-3 h-3" style={{ color: colors.accentText }} />
              <span>Recent Logs</span>
            </span>
            <span className="text-[10px] font-mono" style={{ color: colors.tertiaryText }}>
              {checkIns.length} recorded
            </span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {checkIns.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl border flex items-center justify-between text-xs"
                style={{
                  backgroundColor: colors.surfaceSunken,
                  borderColor: colors.borderSubtle,
                }}
              >
                <div>
                  <span className="text-[10px] block font-mono" style={{ color: colors.tertiaryText }}>
                    {log.dateStr}
                  </span>
                  <span className="text-[11px]" style={{ color: colors.primaryText }}>
                    Mood {log.wellbeing} · Energy {log.energy} · Clarity {log.focus}
                  </span>
                </div>
                <span
                  className="text-[11px] font-mono font-semibold"
                  style={{ color: colors.accentText }}
                >
                  {((log.wellbeing + log.rested + log.energy + log.focus) / 4).toFixed(1)}/5
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Discrete Footer Note */}
      <div
        className="p-3 rounded-2xl border flex items-center gap-2 text-[10px] theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.secondaryText,
        }}
      >
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: colors.accentText }} />
        <span>Self-reports are stored strictly on this device and are never shared without consent.</span>
      </div>
    </div>
  );
};
