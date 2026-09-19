import React, { useState } from 'react';
import {
  MessageSquareHeart,
  Send,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { CheckInRecord } from '../types';

interface CheckInScreenProps {
  checkIns: CheckInRecord[];
  onSaveCheckIn: (record: CheckInRecord) => void;
  onRequestFeedback: (source: 'checkin', metadata: string) => void;
}

export const CheckInScreen: React.FC<CheckInScreenProps> = ({
  checkIns,
  onSaveCheckIn,
  onRequestFeedback,
}) => {
  const [wellbeing, setWellbeing] = useState<number>(4);
  const [rested, setRested] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [focus, setFocus] = useState<number>(4);
  const [notes, setNotes] = useState<string>('');
  const [submittedToday, setSubmittedToday] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    setSubmittedToday(true);

    // Request product feedback
    setTimeout(() => {
      onRequestFeedback('checkin', 'daily_checkin');
    }, 400);
  };

  const renderScale = (
    value: number,
    onChange: (val: number) => void,
    lowLabel: string,
    highLabel: string
  ) => {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = value === num;
            return (
              <button
                type="button"
                key={num}
                onClick={() => onChange(num)}
                className={`flex-1 py-2.5 rounded-xl font-mono text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#2FE4A6] text-[#06110C] shadow-[0_0_12px_rgba(47,228,166,0.3)] scale-105'
                    : 'bg-[#081911] border border-[#163827] text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#0D2319]'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#789682] px-1">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Editorial Header */}
      <section className="pt-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6] block mb-1">
          SELF-APPRAISAL
        </span>
        <h1 className="text-2xl font-editorial italic text-[#F4F7F4] mb-1">
          How are you doing?
        </h1>
        <p className="text-xs text-[#8EA898] leading-relaxed">
          Daily subjective reflections to cross-reference with your wearable physiological baselines.
        </p>
      </section>

      {/* Success Notification if just submitted */}
      {submittedToday && (
        <div className="p-4 rounded-2xl bg-[#0F281C] border border-[#20543A] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-[#2FE4A6]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Today's reflection has been saved locally.</span>
          </div>
          <button
            onClick={() => setSubmittedToday(false)}
            className="text-[11px] text-[#8EA898] hover:text-[#F4F7F4] underline"
          >
            Update
          </button>
        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question 1: Overall Wellbeing */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#1A4430] space-y-2">
          <label className="block text-xs font-semibold text-[#F4F7F4]">
            How would you rate your overall wellbeing today?
          </label>
          <p className="text-[11px] text-[#8EA898]">
            General sense of physical and mental equilibrium.
          </p>
          {renderScale(wellbeing, setWellbeing, '1: Unsettled', '5: Optimal')}
        </div>

        {/* Question 2: Rested */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#1A4430] space-y-2">
          <label className="block text-xs font-semibold text-[#F4F7F4]">
            How rested do you feel?
          </label>
          <p className="text-[11px] text-[#8EA898]">
            Subjective recovery from last night's rest.
          </p>
          {renderScale(rested, setRested, '1: Depleted', '5: Refreshed')}
        </div>

        {/* Question 3: Energy */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#1A4430] space-y-2">
          <label className="block text-xs font-semibold text-[#F4F7F4]">
            How would you describe your energy today?
          </label>
          <p className="text-[11px] text-[#8EA898]">
            Capacity for day-to-day tasks and movement.
          </p>
          {renderScale(energy, setEnergy, '1: Sluggish', '5: High Vitality')}
        </div>

        {/* Question 4: Focus */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#1A4430] space-y-2">
          <label className="block text-xs font-semibold text-[#F4F7F4]">
            How focused have you felt today?
          </label>
          <p className="text-[11px] text-[#8EA898]">
            Attentional clarity and presence.
          </p>
          {renderScale(focus, setFocus, '1: Scattered', '5: Sharp')}
        </div>

        {/* Optional text field */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#1A4430] space-y-2">
          <label htmlFor="checkin-notes" className="block text-xs font-semibold text-[#F4F7F4]">
            Would you like to tell us anything about today? (Optional)
          </label>
          <textarea
            id="checkin-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Workload, exercise notes, dietary notes, or environmental context..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-[#07160F] border border-[#173A29] text-[#F4F7F4] placeholder-[#557361] focus:outline-none focus:border-[#2FE4A6] transition-colors resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          id="btn-submit-checkin"
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#2FE4A6] hover:bg-[#4EF2BB] text-[#06110C] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#2FE4A6]/10"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Save Check-In</span>
        </button>
      </form>

      {/* History of Past Check-Ins */}
      {checkIns.length > 0 && (
        <section className="rounded-3xl bg-[#0A1F16] border border-[#173F2C] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#F4F7F4] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2FE4A6]" />
              <span>Recent Check-In History</span>
            </h3>
            <span className="text-[10px] text-[#8EA898]">{checkIns.length} logs</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {checkIns.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-[#07160F] border border-[#143323] text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-[#2FE4A6]">{log.dateStr}</span>
                  <span className="text-[10px] text-[#8EA898]">
                    Score: {((log.wellbeing + log.rested + log.energy + log.focus) / 4).toFixed(1)} / 5
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-[#8EA898]">
                  <span className="bg-[#0C2016] py-1 rounded-lg">Well: {log.wellbeing}</span>
                  <span className="bg-[#0C2016] py-1 rounded-lg">Rest: {log.rested}</span>
                  <span className="bg-[#0C2016] py-1 rounded-lg">Ener: {log.energy}</span>
                  <span className="bg-[#0C2016] py-1 rounded-lg">Foc: {log.focus}</span>
                </div>
                {log.notes && (
                  <p className="text-[11px] text-[#9CB4A5] italic mt-2 pt-1.5 border-t border-[#122A1E]">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Non-Diagnostic Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-[#06130D] border border-[#133022] text-[10px] text-[#789682] leading-relaxed">
        <strong className="text-[#A4C2AF] block mb-0.5">Non-Diagnostic Boundary:</strong>
        Check-in entries are self-reported markers to support personal reflection. They do not constitute a clinical psychiatric or psychological diagnostic survey.
      </div>
    </div>
  );
};
