import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

interface TermsScreenProps {
  onBack: () => void;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#8EA898] hover:text-[#F4F7F4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#2FE4A6] bg-[#0E2319] px-2.5 py-0.5 rounded-full border border-[#1B4330]">
          MVP Prototype
        </span>
      </div>

      {/* Editorial Title */}
      <section>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#2FE4A6] block mb-1">
          LEGAL & PROTOCOL
        </span>
        <h1 className="text-3xl font-editorial italic text-[#F4F7F4] mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#8EA898] leading-relaxed">
          Operational terms for the Manobah Mobile rapid hackathon and research prototype.
        </p>
      </section>

      {/* Primary Health & Safety Disclaimer Box */}
      <section className="p-4 rounded-3xl bg-[#162013] border border-[#2B4022] text-[#E5EFE7] space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E8AE52]">
          <AlertTriangle className="w-4 h-4" />
          <span>Mandatory Health Disclaimer</span>
        </div>
        <p className="text-xs leading-relaxed text-[#D2E2D5]">
          "Manobah provides wellness and cognitive insights based on user-provided and device-derived signals. It is not a medical device and does not diagnose, treat, or prevent any medical condition."
        </p>
      </section>

      {/* Terms Sections */}
      <div className="space-y-4 text-xs text-[#8EA898] leading-relaxed">
        {/* 1. Purpose */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#19402E] space-y-1.5">
          <h3 className="text-xs font-semibold text-[#F4F7F4]">1. Purpose of the Application</h3>
          <p>
            Manobah Mobile is a personal welfare intelligence research prototype designed for self-monitoring and cognitive signal tracking. It provides personal baseline visualization combining Android Health Connect metrics and standardized cognitive reaction tasks.
          </p>
        </div>

        {/* 2. No Medical Diagnosis or Clinical Service */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#19402E] space-y-1.5">
          <h3 className="text-xs font-semibold text-[#F4F7F4]">2. No Medical Diagnosis</h3>
          <p>
            The software does not provide medical diagnoses, psychological evaluations, or clinical advice. Do not use this application to detect, monitor, or manage any medical illness or psychiatric disorder. Always seek advice from a licensed physician for health concerns.
          </p>
        </div>

        {/* 3. Not an Emergency Service */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#19402E] space-y-1.5">
          <h3 className="text-xs font-semibold text-[#F4F7F4]">3. No Emergency Services</h3>
          <p>
            Manobah Mobile is not an emergency response system. If you are experiencing physical or mental health distress, acute pain, or a medical crisis, please contact your local emergency response services immediately.
          </p>
        </div>

        {/* 4. User Responsibilities */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#19402E] space-y-1.5">
          <h3 className="text-xs font-semibold text-[#F4F7F4]">4. User Responsibilities</h3>
          <p>
            Users are responsible for the physical security of their Android devices, maintaining appropriate privacy when participating in cognitive exercises, and determining whether resting and moving routines align with their comfort.
          </p>
        </div>

        {/* 5. Health Connect Third-Party Integration */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#19402E] space-y-1.5">
          <h3 className="text-xs font-semibold text-[#F4F7F4]">5. Third-Party Health Connect Integration</h3>
          <p>
            The application accesses sensor records stored in Google's Android Health Connect client only when granted permission by the user. Manobah has no control over third-party wearable sensor accuracy or manufacturer firmware updates.
          </p>
        </div>

        {/* 6. Application Limitations & Prototype Notice */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#19402E] space-y-1.5">
          <h3 className="text-xs font-semibold text-[#F4F7F4]">6. Prototype Limitations & Warranty</h3>
          <p>
            This application is provided "as-is" without warranty of any kind as part of a rapid hackathon demonstration. Features and local data models are subject to research iteration and updates.
          </p>
        </div>

        {/* 7. Contact Placeholder */}
        <div className="p-4 rounded-3xl bg-[#0D2319] border border-[#19402E] space-y-1.5">
          <h3 className="text-xs font-semibold text-[#F4F7F4]">7. Project Contact Information</h3>
          <p>
            For inquiries regarding the Manobah-AI Welfare Signal Project, please consult the project repository at <code className="text-[#2FE4A6]">github.com/manobah-ai/welfare-signal</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
