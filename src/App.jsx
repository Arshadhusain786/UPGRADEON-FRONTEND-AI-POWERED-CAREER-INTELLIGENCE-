import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import Loader from './components/Loader';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import SkillGap from './pages/SkillGap';
import ResumeScore from './pages/ResumeScore';
import Credits from './pages/Credits';
import Referrals from './pages/Referrals';
import Settings from './pages/Settings';
import Opportunities from './pages/Opportunities';
import MyOpportunities from './pages/MyOpportunities';
import MySentRequests from './pages/MySentRequests';
import { Toaster } from 'react-hot-toast';

const AppLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  if (loading) return <Loader fullScreen />;

  // If user is logged in, show sidebar layout for protected pages
  if (user && !isPublicPage) {
    return (
      <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-8 py-10">
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#10b981',
                color: '#fff',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
            style: {
              borderRadius: '20px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
              fontSize: '14px',
            }
          }}
        />
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute>
                    <Roadmap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skill-gap"
                element={
                  <ProtectedRoute>
                    <SkillGap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume-score"
                element={
                  <ProtectedRoute>
                    <ResumeScore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/credits"
                element={
                  <ProtectedRoute>
                    <Credits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/referrals"
                element={
                  <ProtectedRoute>
                    <Referrals />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/opportunities"
                element={
                  <ProtectedRoute>
                    <Opportunities />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-opportunities"
                element={
                  <ProtectedRoute>
                    <MyOpportunities />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sent-requests"
                element={
                  <ProtectedRoute>
                    <MySentRequests />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
