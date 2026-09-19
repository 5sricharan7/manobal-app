import React from 'react';
import { ShieldCheck, Activity, Brain, HeartHandshake, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onConnectHealth: () => void;
  onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onConnectHealth,
  onSkip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        id="onboarding-welcome-dialog"
        className="w-full max-w-sm rounded-3xl bg-[#081912] border border-[#183F2E] p-6 shadow-2xl relative text-[#F4F7F4] max-h-[92vh] overflow-y-auto"
      >
        {/* Brand Accent */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6]">
            MANOBAH-AI
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2FE4A6]" />
          <span className="text-[10px] text-[#8EA898]">MOBILE ONBOARDING</span>
        </div>

        {/* Editorial Heading */}
        <h1 className="text-2xl font-normal leading-tight text-[#F4F7F4] mb-2 font-editorial">
          Personal<br />
          <span className="italic font-normal text-[#2FE4A6]">Welfare</span><br />
          Intelligence.
        </h1>

        <p className="text-xs text-[#8EA898] leading-relaxed mb-5">
          Manobah brings together everyday wellness signals and short cognitive exercises to help you understand your personal patterns.
        </p>

        {/* Feature Grid */}
        <div className="space-y-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#0D241A] border border-[#1A422F] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#143527] flex items-center justify-center text-[#2FE4A6] shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F4F7F4]">Health Data</h4>
              <p className="text-[11px] text-[#8EA898] leading-tight mt-0.5">
                Seamless local reads via Android Health Connect for HR, sleep, steps, and HRV.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0D241A] border border-[#1A422F] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#143527] flex items-center justify-center text-[#2FE4A6] shrink-0 mt-0.5">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F4F7F4]">Cognitive Mini-Games</h4>
              <p className="text-[11px] text-[#8EA898] leading-tight mt-0.5">
                90-second objective tasks observing attention, working memory, and inhibition.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0D241A] border border-[#1A422F] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#143527] flex items-center justify-center text-[#2FE4A6] shrink-0 mt-0.5">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F4F7F4]">Daily Check-Ins</h4>
              <p className="text-[11px] text-[#8EA898] leading-tight mt-0.5">
                Gentle self-reflection scales to align your internal state with sensor signals.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0D241A] border border-[#1A422F] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#143527] flex items-center justify-center text-[#2FE4A6] shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#F4F7F4]">Protected by Design</h4>
              <p className="text-[11px] text-[#8EA898] leading-tight mt-0.5">
                Zero cloud health uploads in this MVP. No microphone, camera, or facial recognition.
              </p>
            </div>
          </div>
        </div>

        {/* Health Disclaimer */}
        <div className="p-3 rounded-xl bg-[#06130D] border border-[#173827] text-[10px] text-[#7A9684] leading-relaxed mb-5">
          <strong className="text-[#A4C2B0] block mb-0.5">Health Disclaimer:</strong>
          Manobah provides wellness and cognitive insights based on user-provided and device-derived signals. It is not a medical device and does not diagnose, treat, or prevent any medical condition.
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            id="btn-onboarding-connect-health"
            onClick={onConnectHealth}
            className="w-full py-3 rounded-2xl bg-[#2FE4A6] hover:bg-[#4EF2BB] text-[#06110C] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#2FE4A6]/10"
          >
            <span>Connect Health Data</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-onboarding-skip"
            onClick={onSkip}
            className="w-full py-2.5 rounded-2xl border border-[#193F2D] text-xs font-medium text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#0D251B] transition-colors"
          >
            Skip for now & use Games / Check-in
          </button>
        </div>
      </div>
    </div>
  );
};
