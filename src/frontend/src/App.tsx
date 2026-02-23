import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useGetCallerUserProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetup from './components/ProfileSetup';
import TestResultsDashboard from './components/TestResultsDashboard';
import TestExamReportPage from './components/TestExamReportPage';
import AdminTestResultsPage from './components/AdminTestResultsPage';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentView, setCurrentView] = useState<'dashboard' | 'report' | 'admin'>('dashboard');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showDashboard = isAuthenticated && userProfile !== null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onNavigate={setCurrentView} currentView={currentView} />
      
      <main className="flex-1 flex items-center justify-center">
        {!isAuthenticated && <LoginScreen />}
        {isAuthenticated && profileLoading && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading your profile...</p>
          </div>
        )}
        {showProfileSetup && <ProfileSetup />}
        {showDashboard && currentView === 'dashboard' && (
          <TestResultsDashboard onNavigateToReport={() => setCurrentView('report')} />
        )}
        {showDashboard && currentView === 'report' && (
          <TestExamReportPage onBack={() => setCurrentView('dashboard')} />
        )}
        {showDashboard && currentView === 'admin' && (
          <AdminTestResultsPage onBack={() => setCurrentView('dashboard')} />
        )}
      </main>

      <Footer />
    </div>
  );
}
