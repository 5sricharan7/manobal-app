export type ThemePreference = 'system' | 'light' | 'dark';
export type ActiveTheme = 'light' | 'dark';

export interface ThemeColors {
  canvas: string;
  background: string;
  container: string;
  surface: string;
  surfaceElevated: string;
  surfaceSunken: string;
  surfaceHover: string;
  inputBg: string;
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
  mutedText: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  accentText: string;
  accentContrast: string;
  border: string;
  borderSubtle: string;
  borderHighlight: string;
  headerBg: string;
  navBg: string;
  modalOverlay: string;
  modalSurface: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  chartTrack: string;
  chartBarHover: string;
}

export const DARK_THEME_COLORS: ThemeColors = {
  canvas: '#07090B',
  background: '#07090B',
  container: '#0B0E11',
  surface: '#13171B',
  surfaceElevated: '#181E24',
  surfaceSunken: '#0C0F12',
  surfaceHover: '#1A2027',
  inputBg: '#0B0E11',
  primaryText: '#F4F6F7',
  secondaryText: '#8A95A0',
  tertiaryText: '#6B7783',
  mutedText: '#55606C',
  accent: '#2FE4A6',
  accentHover: '#3bf5b3',
  accentSoft: 'rgba(47, 228, 166, 0.12)',
  accentText: '#2FE4A6',
  accentContrast: '#0B0E11',
  border: '#21272E',
  borderSubtle: '#1B2228',
  borderHighlight: '#2B3540',
  headerBg: 'rgba(11, 14, 17, 0.92)',
  navBg: 'rgba(18, 22, 26, 0.96)',
  modalOverlay: 'rgba(0, 0, 0, 0.82)',
  modalSurface: '#13171B',
  success: '#2FE4A6',
  successSoft: 'rgba(47, 228, 166, 0.15)',
  warning: '#E8AE52',
  warningSoft: 'rgba(232, 174, 82, 0.15)',
  error: '#F28B82',
  errorSoft: 'rgba(242, 139, 130, 0.15)',
  chartTrack: '#1E252D',
  chartBarHover: '#28323C',
};

export const LIGHT_THEME_COLORS: ThemeColors = {
  canvas: '#E2E8E4',
  background: '#EAEFEA',
  container: '#F7F9F8',
  surface: '#FFFFFF',
  surfaceElevated: '#F2F6F4',
  surfaceSunken: '#EEF3F0',
  surfaceHover: '#F4F8F6',
  inputBg: '#F1F5F3',
  primaryText: '#111A15',
  secondaryText: '#4E6156',
  tertiaryText: '#6F8277',
  mutedText: '#8C9D93',
  accent: '#0D9F6E',
  accentHover: '#0A8A5F',
  accentSoft: 'rgba(13, 159, 110, 0.10)',
  accentText: '#0D9F6E',
  accentContrast: '#FFFFFF',
  border: '#DFE6E1',
  borderSubtle: '#EAF0EB',
  borderHighlight: '#CDD8D1',
  headerBg: 'rgba(247, 249, 248, 0.94)',
  navBg: 'rgba(255, 255, 255, 0.96)',
  modalOverlay: 'rgba(17, 26, 21, 0.65)',
  modalSurface: '#FFFFFF',
  success: '#0D9F6E',
  successSoft: 'rgba(13, 159, 110, 0.12)',
  warning: '#C26E05',
  warningSoft: 'rgba(194, 110, 5, 0.12)',
  error: '#D64545',
  errorSoft: 'rgba(214, 69, 69, 0.12)',
  chartTrack: '#DFE8E3',
  chartBarHover: '#CFDDD5',
};

export const ManobalTheme = {
  dark: DARK_THEME_COLORS,
  light: LIGHT_THEME_COLORS,
};

export const ManobahTheme = ManobalTheme;
