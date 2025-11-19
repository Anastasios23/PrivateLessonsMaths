import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsIcon, LogOutIcon } from "../icons";
import { useAppContext } from "../../hooks/useAppContext";

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Page title (to be set by pages) */}
        <h2 className="text-xl font-bold text-slate-900">
          Welcome to TutorTrack
        </h2>

        {/* Right: Time and Profile */}
        <div className="flex items-center gap-6">
          {/* Time Display */}
          {currentTime && (
            <div className="text-sm text-slate-500">{currentTime}</div>
          )}

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                {user?.name.charAt(0)}
              </div>
              <div className="flex flex-col items-start">
                <p className="text-xs font-semibold text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 w-48">
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors border-b border-slate-100"
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
