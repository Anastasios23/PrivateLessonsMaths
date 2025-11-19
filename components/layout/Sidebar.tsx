
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, SettingsIcon, LogOutIcon, BookOpenIcon, CalendarIcon } from '../icons';
import { useAppContext } from '../../hooks/useAppContext';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary-500 text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const { logout } = useAppContext();
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4">
      <div className="flex items-center mb-8 px-2">
        <BookOpenIcon className="h-8 w-8 text-primary-500" />
        <h1 className="text-2xl font-bold text-slate-800 ml-2">TutorTrack</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavItem to="/" icon={<HomeIcon className="h-5 w-5" />} label="Dashboard" />
        <NavItem to="/students" icon={<UsersIcon className="h-5 w-5" />} label="Students" />
        <NavItem to="/calendar" icon={<CalendarIcon className="h-5 w-5" />} label="Calendar" />
        <NavItem to="/homework" icon={<BookOpenIcon className="h-5 w-5" />} label="Homework" />
        <NavItem to="/settings" icon={<SettingsIcon className="h-5 w-5" />} label="Settings" />
      </nav>
      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOutIcon className="h-5 w-5 mr-3" />
          Log Out
        </button>
      </div>
    </aside>
  );
};
