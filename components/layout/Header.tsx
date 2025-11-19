import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../hooks/useAppContext";
import { HomeIcon, UsersIcon, BookOpenIcon, CalendarIcon, SettingsIcon, LogOutIcon } from "../icons";

export const Header: React.FC = () => {
  const { user, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    path: string;
  }> = ({ icon, label, path }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium text-sm ${
        isActive(path)
          ? "bg-primary-100 text-primary-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Navigation */}
        <div className="flex items-center gap-1">
          <NavButton
            icon={<HomeIcon className="h-4 w-4" />}
            label="Dashboard"
            path="/"
          />
          <NavButton
            icon={<UsersIcon className="h-4 w-4" />}
            label="Students"
            path="/students"
          />
          <NavButton
            icon={<CalendarIcon className="h-4 w-4" />}
            label="Calendar"
            path="/calendar"
          />
          <NavButton
            icon={<BookOpenIcon className="h-4 w-4" />}
            label="Reports"
            path="/reports"
          />
        </div>

        {/* Right: Time & User Info */}
        <div className="flex items-center gap-4">
          {currentTime && (
            <div className="text-sm text-slate-500">{currentTime}</div>
          )}
          <div className="relative" data-user-menu>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">Tutor</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer">
                {user?.name.charAt(0)}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-600">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/reports');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    <span>Reports & Analytics</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
