import React, { useState, useCallback } from 'react';
import { NavigationTab, HealthSignals, GameSession, CheckInRecord, ProductFeedback } from './types';
import {
  loadHealthSignals,
  saveHealthSignals,
  loadGameSessions,
  saveGameSession,
  loadCheckIns,
  saveCheckIn,
  saveFeedback,
  isOnboarded,
  setOnboarded,
  clearAllLocalData,
  INITIAL_BASELINE,
  DEMO_7DAY_DATA,
  DEMO_HEALTH_SIGNALS,
  EMPTY_HEALTH_SIGNALS,
} from './utils/storage';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { WellnessScreen } from './components/WellnessScreen';
import { GamesScreen } from './components/GamesScreen';
import { CheckInScreen } from './components/CheckInScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PrivacyScreen } from './components/PrivacyScreen';
import { TermsScreen } from './components/TermsScreen';

import { OnboardingModal } from './components/OnboardingModal';
import { HealthConnectModal } from './components/HealthConnectModal';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { FeedbackModal } from './components/FeedbackModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [activeSubView, setActiveSubView] = useState<'privacy' | 'terms' | null>(null);

  // Health and activity states (persisted via local storage)
  const [healthSignals, setHealthSignals] = useState<HealthSignals>(() => loadHealthSignals());
  const [gameSessions, setGameSessions] = useState<GameSession[]>(() => loadGameSessions());
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(() => loadCheckIns());
  const [useDemoData, setUseDemoData] = useState<boolean>(() => healthSignals.isConnected);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => !isOnboarded());
  const [showHealthConnectModal, setShowHealthConnectModal] = useState<boolean>(false);
  const [showAndroidCodeModal, setShowAndroidCodeModal] = useState<boolean>(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    source: 'game' | 'checkin' | 'general';
    metadata: string;
  }>({
    isOpen: false,
    source: 'general',
    metadata: '',
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  }, []);

  const handleSaveGameSession = (session: GameSession) => {
    saveGameSession(session);
    setGameSessions(loadGameSessions());
    showToast(`Exercise completed: ${session.accuracy}% accuracy`);
  };

  const handleSaveCheckIn = (record: CheckInRecord) => {
    saveCheckIn(record);
    setCheckIns(loadCheckIns());
    showToast('Daily reflection saved locally.');
  };

  const handleSaveFeedback = (feedbackInput: Omit<ProductFeedback, 'id' | 'timestamp'>) => {
    const fullFeedback: ProductFeedback = {
      ...feedbackInput,
      id: `fb_${Date.now()}`,
      timestamp: Date.now(),
    };
    saveFeedback(fullFeedback);
    setFeedbackModal({ isOpen: false, source: 'general', metadata: '' });
    showToast('Thank you for helping us refine Manobah.');
  };

  const handleToggleDemoData = () => {
    if (useDemoData) {
      // Switch to empty state
      setHealthSignals(EMPTY_HEALTH_SIGNALS);
      saveHealthSignals(EMPTY_HEALTH_SIGNALS);
      setUseDemoData(false);
      showToast('Switched to live Health Connect mode (No sample data)');
    } else {
      // Load sample dataset
      setHealthSignals(DEMO_HEALTH_SIGNALS);
      saveHealthSignals(DEMO_HEALTH_SIGNALS);
      setUseDemoData(true);
      showToast('Populated simulated wearable signals for UI evaluation');
    }
  };

  const handleSyncHealth = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      if (healthSignals.isConnected) {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const updated: HealthSignals = {
          ...healthSignals,
          heartRate: (healthSignals.heartRate || 64) + delta,
          lastSyncTimestamp: Date.now(),
        };
        setHealthSignals(updated);
        saveHealthSignals(updated);
        showToast('Health Connect synced successfully.');
      } else {
        showToast('No Health Connect permissions active.');
      }
    }, 900);
  };

  const handleUpdatePermissions = (
    newPermissions: HealthSignals['permissionsGranted'],
    isConnected: boolean
  ) => {
    const anyGranted = Object.values(newPermissions).some(Boolean);
    const updated: HealthSignals = {
      ...healthSignals,
      isConnected: isConnected && anyGranted,
      permissionsGranted: newPermissions,
      heartRate: anyGranted ? healthSignals.heartRate || 64 : null,
      restingHeartRate: anyGranted ? healthSignals.restingHeartRate || 58 : null,
      hrv: anyGranted ? healthSignals.hrv || 49 : null,
      sleepDurationMinutes: anyGranted ? healthSignals.sleepDurationMinutes || 372 : null,
      stepsToday: anyGranted ? healthSignals.stepsToday || 6480 : null,
      lastSyncTimestamp: Date.now(),
    };
    setHealthSignals(updated);
    saveHealthSignals(updated);
    setShowHealthConnectModal(false);
    showToast(anyGranted ? 'Health Connect permissions updated.' : 'All permissions revoked.');
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to erase all local data from this device?')) {
      clearAllLocalData();
      setHealthSignals(EMPTY_HEALTH_SIGNALS);
      setGameSessions([]);
      setCheckIns([]);
      setUseDemoData(false);
      showToast('All local on-device signals erased.');
    }
  };

  const handleResetPermissions = () => {
    const revoked: HealthSignals = {
      ...EMPTY_HEALTH_SIGNALS,
      isConnected: false,
    };
    setHealthSignals(revoked);
    saveHealthSignals(revoked);
    showToast('Health Connect permissions reset to initial revoked state.');
  };

  const handleCloseOnboarding = () => {
    setOnboarded(true);
    setShowOnboarding(false);
  };

  const handleOpenFeedback = (source: 'game' | 'checkin' | 'general', metadata: string) => {
    setFeedbackModal({
      isOpen: true,
      source,
      metadata,
    });
  };

  const handleTabSelect = (tab: NavigationTab) => {
    setActiveSubView(null);
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#050D09] text-[#F4F7F4] flex flex-col font-sans selection:bg-[#2FE4A6]/20 selection:text-[#2FE4A6]">
      {/* Centered Mobile App Container */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#06110C] relative shadow-2xl border-x border-[#122A1E]">
        {/* Sticky Mobile App Bar */}
        <Header
          healthSignals={healthSignals}
          onOpenHealthConnect={() => setShowHealthConnectModal(true)}
          onOpenAndroidCode={() => setShowAndroidCodeModal(true)}
          isSyncing={isSyncing}
          onSync={handleSyncHealth}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#0E281C] border border-[#23583C] text-xs text-[#2FE4A6] shadow-xl animate-fadeIn flex items-center gap-2 max-w-[90%]">
            <span className="w-2 h-2 rounded-full bg-[#2FE4A6]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main View Area */}
        <main className="flex-1 px-4 pt-3 pb-6 overflow-y-auto">
          {activeSubView === 'privacy' ? (
            <PrivacyScreen
              onBack={() => setActiveSubView(null)}
              onOpenHealthConnect={() => setShowHealthConnectModal(true)}
              onClearData={handleClearAllData}
            />
          ) : activeSubView === 'terms' ? (
            <TermsScreen onBack={() => setActiveSubView(null)} />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeScreen
                  healthSignals={healthSignals}
                  recentGameSessions={gameSessions}
                  recentCheckIns={checkIns}
                  baseline={INITIAL_BASELINE}
                  onNavigate={handleTabSelect}
                  onOpenHealthConnect={() => setShowHealthConnectModal(true)}
                  onSyncHealth={handleSyncHealth}
                  isSyncing={isSyncing}
                />
              )}

              {currentTab === 'wellness' && (
                <WellnessScreen
                  healthSignals={healthSignals}
                  history7Days={DEMO_7DAY_DATA}
                  baseline={INITIAL_BASELINE}
                  onOpenHealthConnect={() => setShowHealthConnectModal(true)}
                  onSyncHealth={handleSyncHealth}
                  isSyncing={isSyncing}
                  useDemoData={useDemoData}
                  onToggleDemoData={handleToggleDemoData}
                />
              )}

              {currentTab === 'games' && (
                <GamesScreen
                  recentGameSessions={gameSessions}
                  onSaveGameSession={handleSaveGameSession}
                  onRequestFeedback={handleOpenFeedback}
                />
              )}

              {currentTab === 'checkin' && (
                <CheckInScreen
                  checkIns={checkIns}
                  onSaveCheckIn={handleSaveCheckIn}
                  onRequestFeedback={handleOpenFeedback}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileScreen
                  healthSignals={healthSignals}
                  onOpenHealthConnect={() => setShowHealthConnectModal(true)}
                  onNavigatePrivacy={() => setActiveSubView('privacy')}
                  onNavigateTerms={() => setActiveSubView('terms')}
                  onOpenAndroidCode={() => setShowAndroidCodeModal(true)}
                  onClearLocalData={handleClearAllData}
                  onResetPermissions={handleResetPermissions}
                />
              )}
            </>
          )}
        </main>

        {/* Fixed Mobile Bottom Navigation */}
        <Navigation currentTab={currentTab} onSelectTab={handleTabSelect} />
      </div>

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={showOnboarding}
        onSkip={handleCloseOnboarding}
        onConnectHealth={() => {
          handleCloseOnboarding();
          setShowHealthConnectModal(true);
        }}
      />

      {/* Health Connect Configuration Modal */}
      <HealthConnectModal
        isOpen={showHealthConnectModal}
        onClose={() => setShowHealthConnectModal(false)}
        healthSignals={healthSignals}
        onUpdatePermissions={handleUpdatePermissions}
        onSync={handleSyncHealth}
        isSyncing={isSyncing}
      />

      {/* Android Kotlin Code & Architecture Modal */}
      <AndroidCodeModal
        isOpen={showAndroidCodeModal}
        onClose={() => setShowAndroidCodeModal(false)}
      />

      {/* Product Experience Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false, source: 'general', metadata: '' })}
        onSubmit={handleSaveFeedback}
        source={feedbackModal.source}
        metadata={feedbackModal.metadata}
      />
    </div>
  );
}
