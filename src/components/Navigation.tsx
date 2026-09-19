import React from 'react';
import { Home, Activity, Brain, MessageSquareHeart } from 'lucide-react';
import { NavigationTab } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isHidden?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab, isHidden }) => {
  const { colors, isDark } = useTheme();

  if (isHidden) return null;

  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'wellness', label: 'Wellness', icon: <Activity className="w-4 h-4" /> },
    { id: 'games', label: 'Games', icon: <Brain className="w-4 h-4" /> },
    { id: 'checkin', label: 'Check-in', icon: <MessageSquareHeart className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
      <nav
        id="bottom-navigation-bar"
        className="pointer-events-auto w-full max-w-[360px] backdrop-blur-xl border rounded-2xl px-2 py-1.5 flex items-center justify-between theme-fade-transition"
        style={{
          backgroundColor: colors.navBg,
          borderColor: colors.border,
          boxShadow: isDark
            ? '0 12px 32px rgba(0,0,0,0.6)'
            : '0 10px 28px rgba(0,30,15,0.10)',
        }}
        aria-label="Bottom Navigation"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: isActive ? colors.accentSoft : 'transparent',
                color: isActive ? colors.accentText : colors.secondaryText,
              }}
            >
              <div className="relative flex items-center justify-center">
                {tab.icon}
                {isActive && (
                  <span
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: colors.accent,
                      boxShadow: `0 0 6px ${colors.accent}`,
                    }}
                  />
                )}
              </div>
              <span
                className="text-[10px] mt-1 tracking-tight font-medium"
                style={{
                  color: isActive ? colors.primaryText : colors.tertiaryText,
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
