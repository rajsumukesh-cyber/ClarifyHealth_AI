import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MedicalGlossaryModal } from './components/MedicalGlossaryModal';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ReportDetailsPage } from './pages/ReportDetailsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ComparePage } from './pages/ComparePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { Activity, BookOpen } from 'lucide-react';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Activity className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const MainApp: React.FC = () => {
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onOpenGlossary={() => setGlossaryOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/:id"
            element={
              <ProtectedRoute>
                <ReportDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <ComparePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Floating Glossary Trigger Button */}
      <button
        onClick={() => setGlossaryOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-3 sm:px-4 sm:py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-elevated transition-all flex items-center gap-2 hover:scale-105"
        title="Open Medical Glossary & Abbreviations Dictionary"
      >
        <BookOpen className="w-4 h-4" />
        <span className="hidden sm:inline">Medical Glossary</span>
      </button>

      {/* Floating Accessibility Toolbar */}
      <AccessibilityToolbar />

      {/* Medical Glossary Dictionary Modal */}
      <MedicalGlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainApp />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
