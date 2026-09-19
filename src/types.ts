export type NavigationTab = 'home' | 'wellness' | 'games' | 'checkin' | 'profile';

export type GameType = 'gonogo' | 'reaction_dot' | 'memory_sequence';

export interface HealthSignals {
  isConnected: boolean;
  isAvailable: boolean;
  lastSyncTimestamp: number | null;
  permissionsGranted: {
    heartRate: boolean;
    hrv: boolean;
    sleep: boolean;
    steps: boolean;
  };
  heartRate: number | null; // bpm
  restingHeartRate: number | null; // bpm
  hrv: number | null; // ms (RMSSD)
  sleepDurationMinutes: number | null; // e.g. 430 mins (7h 10m)
  sleepStages?: {
    deepMinutes: number;
    remMinutes: number;
    lightMinutes: number;
    awakeMinutes: number;
  };
  stepsToday: number | null;
  activeCalories?: number | null;
}

export interface HealthDayData {
  day: string; // "Mon", "Tue", etc.
  date: string; // "2026-09-18"
  heartRate: number | null;
  hrv: number | null;
  sleepHours: number | null;
  steps: number | null;
}

export interface GameSession {
  sessionId: string;
  gameType: GameType;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  trialCount: number;
  accuracy: number; // 0 to 100%
  reactionTime: number; // mean RT in ms
  reactionTimeVariability: number; // SD in ms
  errors: number;
  completionStatus: 'completed' | 'abandoned';
  // Game-specific metrics
  goAccuracy?: number;
  noGoAccuracy?: number;
  commissionErrors?: number; // pressed on no-go
  omissionErrors?: number; // didn't press on go
  medianReactionTime?: number;
  successfulTaps?: number;
  missedTrials?: number;
  maxSequenceLength?: number;
  correctSequences?: number;
  incorrectSequences?: number;
}

export interface CheckInRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  wellbeing: number; // 1 to 5
  rested: number; // 1 to 5
  energy: number; // 1 to 5
  focus: number; // 1 to 5
  notes?: string;
}

export interface ProductFeedback {
  id: string;
  timestamp: number;
  rating: number; // 1 to 5 stars
  improvementText?: string;
  source: 'game' | 'checkin' | 'general';
  metadata?: string;
}

export interface PersonalBaseline {
  heartRate: number; // e.g. 68 bpm
  hrv: number; // e.g. 52 ms
  sleepHours: number; // e.g. 7.4 hrs
  steps: number; // e.g. 8400
  reactionTime: number; // e.g. 285 ms
  accuracy: number; // e.g. 96%
  checkInScore: number; // e.g. 4.1 / 5
}
