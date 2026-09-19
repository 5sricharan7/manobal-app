import React from 'react';
import { Home, Activity, Brain, MessageSquareHeart, User } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'wellness', label: 'Wellness', icon: <Activity className="w-5 h-5" /> },
    { id: 'games', label: 'Games', icon: <Brain className="w-5 h-5" /> },
    { id: 'checkin', label: 'Check-in', icon: <MessageSquareHeart className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#07150F]/95 backdrop-blur-md border-t border-[#163526] px-2 py-1 max-w-md mx-auto"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-all duration-200 relative ${
                isActive ? 'text-[#2FE4A6]' : 'text-[#8EA898] hover:text-[#D5E2D8]'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2FE4A6] shadow-[0_0_8px_#2FE4A6]" />
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium tracking-wide ${isActive ? 'text-[#F4F7F4]' : 'text-[#8EA898]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
