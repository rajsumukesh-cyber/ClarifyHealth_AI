import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Activity,
  UploadCloud,
  FileText,
  BookOpen,
  Sun,
  Moon,
  LogOut,
  User,
  Sparkles,
  Menu,
  X,
  Shield,
  GitCompare,
} from 'lucide-react';

interface NavbarProps {
  onOpenGlossary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGlossary }) => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleDemoClick = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', authRequired: true },
    { label: 'Upload Report', path: '/upload', authRequired: true },
    { label: 'Compare Over Time', path: '/compare', authRequired: true },
    { label: 'History', path: '/history', authRequired: true },
    { label: 'Privacy & Security', path: '/privacy', authRequired: false },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-sm group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
              Clarify<span className="text-sky-600 dark:text-sky-400">Health</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                AI
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks
            .filter((link) => !link.authRequired || isAuthenticated)
            .map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

          {/* Quick Glossary Button */}
          <button
            onClick={onOpenGlossary}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Medical Glossary</span>
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                  {user?.full_name || user?.email}
                </span>
                {user?.is_demo_user && (
                  <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">
                    Demo
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDemoClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 text-white text-xs font-semibold hover:opacity-95 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Demo</span>
              </button>
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-1 text-sm">
          {navLinks
            .filter((link) => !link.authRequired || isAuthenticated)
            .map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                {link.label}
              </Link>
            ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenGlossary();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Medical Glossary</span>
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDemoClick();
              }}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch 1-Click Demo</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
