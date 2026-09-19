import React, { useState } from 'react';
import { Star, X, Check } from 'lucide-react';
import { ProductFeedback } from '../types';
import { useTheme } from '../theme/ThemeContext';

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
  const { colors, isDark } = useTheme();
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(15,23,42,0.45)' }}
    >
      <div
        id="product-feedback-dialog"
        className="w-full max-w-sm rounded-3xl border p-6 shadow-2xl relative theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.primaryText,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
          style={{ color: colors.secondaryText }}
          aria-label="Close feedback dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div
              className="w-12 h-12 rounded-full border flex items-center justify-center mb-3"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
                color: colors.accentText,
              }}
            >
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold" style={{ color: colors.primaryText }}>
              Thank You
            </h4>
            <p className="text-xs mt-1 max-w-xs" style={{ color: colors.secondaryText }}>
              Your feedback helps shape the Manobal-AI mobile experience.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span
                className="text-[10px] uppercase font-mono tracking-wider block mb-1"
                style={{ color: colors.accentText }}
              >
                Product Experience
              </span>
              <h3 className="text-lg font-medium" style={{ color: colors.primaryText }}>
                How was this experience?
              </h3>
              <p className="text-xs mt-1" style={{ color: colors.secondaryText }}>
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
                    className="w-7 h-7 transition-colors"
                    style={{
                      color:
                        (hoverRating !== null ? star <= hoverRating : star <= rating)
                          ? colors.accent
                          : colors.borderHighlight,
                      fill:
                        (hoverRating !== null ? star <= hoverRating : star <= rating)
                          ? colors.accent
                          : 'transparent',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Suggestion Text */}
            <div className="space-y-1">
              <label
                htmlFor="feedback-comment"
                className="text-[10px] font-semibold uppercase tracking-wider block"
                style={{ color: colors.tertiaryText }}
              >
                Any thoughts or bugs? (Optional)
              </label>
              <textarea
                id="feedback-comment"
                rows={3}
                value={improvementText}
                onChange={(e) => setImprovementText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border transition-colors resize-none focus:outline-none"
                style={{
                  backgroundColor: colors.inputBg,
                  borderColor: colors.border,
                  color: colors.primaryText,
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors"
                style={{
                  backgroundColor: colors.surfaceSunken,
                  borderColor: colors.border,
                  color: colors.secondaryText,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-submit-feedback"
                className="px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-[0.98]"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentContrast,
                }}
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
