import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Sparkles, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = ({ onOpenAuthModal }) => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-white/10 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg shadow-brand-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
              PrepAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            {user && (
              <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
            <Link 
              to={user ? "/setup" : "#"} 
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  onOpenAuthModal();
                }
              }}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Start Prep
            </Link>
          </div>

          {/* User Profile / Login */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 rounded-full bg-slate-900 border border-white/5 py-1 px-3">
                  <User className="h-4 w-4 text-brand-400" />
                  <span className="text-sm font-medium text-slate-300 max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 rounded-lg border border-slate-800 hover:border-red-900/30 hover:bg-red-950/20 hover:text-red-400 py-1.5 px-3 text-xs font-semibold text-slate-400 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 py-1.5 px-4 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-white/10 animate-fade-in">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Home
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Dashboard
              </Link>
            )}
            <Link
              to={user ? "/setup" : "#"}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (!user) {
                  e.preventDefault();
                  onOpenAuthModal();
                }
              }}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Start Prep
            </Link>
            <div className="mt-4 border-t border-slate-800 pt-4 pb-2 px-3">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-brand-400" />
                    <span className="text-base font-medium text-slate-200">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center space-x-2 rounded-md bg-red-950/20 border border-red-900/30 py-2 text-sm font-semibold text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="flex w-full items-center justify-center rounded-md bg-brand-600 py-2 text-base font-semibold text-white shadow-md"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
