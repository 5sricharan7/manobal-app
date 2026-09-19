import React, { useState } from 'react';
import { Star, X, Check } from 'lucide-react';
import { ProductFeedback } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: Omit<ProductFeedback, 'id' | 'timestamp'>) => void;
  source: 'game' | 'checkin' | 'general';
  metadata?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  source,
  metadata,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [improvementText, setImprovementText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      improvementText: improvementText.trim() || undefined,
      source,
      metadata,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        id="product-feedback-dialog"
        className="w-full max-w-sm rounded-3xl bg-[#0C1E16] border border-[#1C4230] p-6 shadow-2xl relative text-[#F4F7F4]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#142D21] transition-colors"
          aria-label="Close feedback dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#1A4532] border border-[#2FE4A6] flex items-center justify-center text-[#2FE4A6] mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-semibold text-[#F4F7F4]">Thank You</h4>
            <p className="text-xs text-[#8EA898] mt-1 max-w-xs">
              Your feedback helps shape the Manobah-AI mobile experience.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#2FE4A6] block mb-1">
                Product Experience Feedback
              </span>
              <h3 className="text-lg font-medium text-[#F4F7F4] font-editorial italic">
                How was this experience?
              </h3>
              <p className="text-xs text-[#8EA898] mt-1">
                This rating evaluates usability and flow. It is kept separate from your wellness scores.
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating !== null ? star <= hoverRating : star <= rating)
                        ? 'text-[#2FE4A6] fill-[#2FE4A6]'
                        : 'text-[#1C4230] fill-transparent'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            {/* Improvement Input */}
            <div>
              <label htmlFor="feedback-improvement" className="block text-xs font-medium text-[#8EA898] mb-1">
                What could we improve? (Optional)
              </label>
              <textarea
                id="feedback-improvement"
                rows={3}
                value={improvementText}
                onChange={(e) => setImprovementText(e.target.value)}
                placeholder="Share thoughts on interaction speed, clarity, or comfort..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#07150F] border border-[#1A382A] text-[#F4F7F4] placeholder-[#597564] focus:outline-none focus:border-[#2FE4A6] transition-colors resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#1A382A] text-xs font-medium text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#11271C] transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#2FE4A6] text-[#06110C] text-xs font-semibold hover:bg-[#4EF2BB] transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
