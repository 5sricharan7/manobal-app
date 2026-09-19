import { GameSession, CheckInRecord, ProductFeedback, HealthSignals, HealthDayData, PersonalBaseline } from '../types';

const STORAGE_KEYS = {
  HEALTH_SIGNALS: 'manobah_health_signals',
  HEALTH_7DAYS: 'manobah_health_7days',
  GAME_SESSIONS: 'manobah_game_sessions',
  CHECK_INS: 'manobah_check_ins',
  FEEDBACK: 'manobah_feedback',
  ONBOARDED: 'manobah_onboarded',
  USE_DEMO_DATA: 'manobah_dev_demo_flag',
};

export const INITIAL_BASELINE: PersonalBaseline = {
  heartRate: 66,
  hrv: 54,
  sleepHours: 7.2,
  steps: 8200,
  reactionTime: 290,
  accuracy: 95,
  checkInScore: 4.0,
};

export const EMPTY_HEALTH_SIGNALS: HealthSignals = {
  isConnected: false,
  isAvailable: true,
  lastSyncTimestamp: null,
  permissionsGranted: {
    heartRate: false,
    hrv: false,
    sleep: false,
    steps: false,
  },
  heartRate: null,
  restingHeartRate: null,
  hrv: null,
  sleepDurationMinutes: null,
  stepsToday: null,
};

// Isolated Dev/Demo dataset (strictly guarded by dev flag)
export const DEMO_HEALTH_SIGNALS: HealthSignals = {
  isConnected: true,
  isAvailable: true,
  lastSyncTimestamp: Date.now() - 1000 * 60 * 18, // 18 minutes ago
  permissionsGranted: {
    heartRate: true,
    hrv: true,
    sleep: true,
    steps: true,
  },
  heartRate: 64,
  restingHeartRate: 58,
  hrv: 49,
  sleepDurationMinutes: 372, // 6h 12m
  sleepStages: {
    deepMinutes: 78,
    remMinutes: 94,
    lightMinutes: 172,
    awakeMinutes: 28,
  },
  stepsToday: 6480,
  activeCalories: 380,
};

export const DEMO_7DAY_DATA: HealthDayData[] = [
  { day: 'Mon', date: '2026-09-13', heartRate: 63, hrv: 55, sleepHours: 7.4, steps: 8900 },
  { day: 'Tue', date: '2026-09-14', heartRate: 65, hrv: 52, sleepHours: 7.1, steps: 7600 },
  { day: 'Wed', date: '2026-09-15', heartRate: 62, hrv: 58, sleepHours: 7.8, steps: 9400 },
  { day: 'Thu', date: '2026-09-16', heartRate: 68, hrv: 48, sleepHours: 6.5, steps: 6100 },
  { day: 'Fri', date: '2026-09-17', heartRate: 67, hrv: 46, sleepHours: 6.2, steps: 6500 },
  { day: 'Sat', date: '2026-09-18', heartRate: 64, hrv: 50, sleepHours: 7.5, steps: 8300 },
  { day: 'Sun', date: '2026-09-19', heartRate: 64, hrv: 49, sleepHours: 6.2, steps: 6480 },
];

export function loadHealthSignals(): HealthSignals {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_SIGNALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return EMPTY_HEALTH_SIGNALS;
}

export function saveHealthSignals(signals: HealthSignals): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HEALTH_SIGNALS, JSON.stringify(signals));
  } catch (e) {
    console.warn('Storage write error:', e);
  }
}

export function load7DayData(): HealthDayData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_7DAYS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return [];
}

export function save7DayData(data: HealthDayData[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HEALTH_7DAYS, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage write error:', e);
  }
}

export function loadGameSessions(): GameSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return [];
}

export function saveGameSession(session: GameSession): void {
  try {
    const list = loadGameSessions();
    list.unshift(session);
    localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(list.slice(0, 100)));
  } catch (e) {
    console.warn('Storage write error:', e);
  }
}

export function loadCheckIns(): CheckInRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return [];
}

export function saveCheckIn(record: CheckInRecord): void {
  try {
    const list = loadCheckIns();
    list.unshift(record);
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.warn('Storage write error:', e);
  }
}

export function loadFeedback(): ProductFeedback[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read error:', e);
  }
  return [];
}

export function saveFeedback(fb: ProductFeedback): void {
  try {
    const list = loadFeedback();
    list.unshift(fb);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.warn('Storage write error:', e);
  }
}

export function isOnboarded(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
  } catch {
    return false;
  }
}

export function setOnboarded(val: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, val ? 'true' : 'false');
  } catch (e) {
    console.warn(e);
  }
}

export function clearAllLocalData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn(e);
  }
}
