import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  BarChart3, 
  GitCompare, 
  History, 
  Compass, 
  Bot, 
  User, 
  LogOut, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export const Navbar = ({ onOpenAssistant }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workspace', path: '/workspace', icon: Code2 },
    { name: 'Comparison', path: '/comparison', icon: GitCompare },
    { name: 'Benchmarks', path: '/benchmarks', icon: BarChart3 },
    { name: 'DSA Curated', path: '/recommendations', icon: Compass },
    { name: 'History', path: '/history', icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d] px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              CodeSense <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono -mt-1">Analysis & Optimization Engine</span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262d]/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Assistant Toggle Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 transition-all text-xs font-medium active:scale-95 shadow-sm"
            title="Open AI Coding & Debugging Assistant"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>

          {/* User profile / auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-700">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-7 h-7 rounded-full bg-[#21262d] border border-gray-600 flex items-center justify-center text-indigo-400 font-semibold uppercase">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <span className="hidden xl:inline font-medium max-w-[100px] truncate">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md text-gray-400 hover:text-rose-400 hover:bg-[#21262d] transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
