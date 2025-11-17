
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { HomeIcon, UsersIcon, BookOpenIcon } from '../icons';

export const Header: React.FC = () => {
    const { user } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState<string>('');

    // Update time every minute
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

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
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
            {icon}
            {label}
        </button>
    );

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
                        icon={<BookOpenIcon className="h-4 w-4" />}
                        label="Reports"
                        path="/reports"
                    />
                </div>

                {/* Right: Time & User Info */}
                <div className="flex items-center gap-4">
                    {currentTime && (
                        <div className="text-sm text-slate-500">
                            {currentTime}
                        </div>
                    )}
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-800">
                                {user?.name}
                            </p>
                            <p className="text-xs text-slate-500">Tutor</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user?.name.charAt(0)}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
