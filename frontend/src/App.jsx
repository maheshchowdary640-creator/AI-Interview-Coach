import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import InterviewSetup from './components/InterviewSetup';
import MockInterview from './components/MockInterview';
import ResultsPage from './components/ResultsPage';
import { Mail, User, X, Loader2, Sparkles } from 'lucide-react';

// Protected Route wrapper to prevent unauthenticated access
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-2" />
        <p className="text-sm">Restoring session...</p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent = () => {
  const { user, loginUser, loading, error, setError } = useContext(UserContext);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Auth Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await loginUser(name, email);
      setAuthModalOpen(false);
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Onboarding failed:', err);
    }
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-navy-950 font-sans">
        
        {/* Navigation */}
        <Navbar onOpenAuthModal={() => {
          setError(null);
          setAuthModalOpen(true);
        }} />

        {/* Auth Onboarding Modal */}
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md glass-card rounded-3xl border border-white/10 p-6 sm:p-8 relative shadow-2xl">
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-950 border border-brand-900 text-brand-400 mb-3">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Create Onboarding Profile</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your details to track your interview sessions and scores.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-brand-500 text-slate-200 rounded-xl py-2 px-10 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane.doe@example.com"
                      className="w-full bg-slate-950 border border-slate-900 focus:border-brand-500 text-slate-200 rounded-xl py-2 px-10 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Onboard Profile</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage onOpenAuthModal={() => setAuthModalOpen(true)} />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/setup" 
              element={
                <ProtectedRoute>
                  <InterviewSetup />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/interview/:id" 
              element={
                <ProtectedRoute>
                  <MockInterview />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/results/:id" 
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
