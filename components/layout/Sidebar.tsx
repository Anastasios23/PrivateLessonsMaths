import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  PencilIcon,
} from "../icons";

const SectionTitle: React.FC<{ children: string }> = ({ children }) => (
  <div className="px-4 py-3 mt-4 first:mt-0">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
      {children}
    </p>
  </div>
);

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors mx-2 ${
        isActive
          ? "bg-primary-500 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`
    }
  >
    <span className="mr-3 flex-shrink-0">{icon}</span>
    <span className="truncate">{label}</span>
  </NavLink>
);

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden">
      {/* Logo */}
      <div className="flex items-center mb-6 px-4 pt-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
          T
        </div>
        <h1 className="text-xl font-bold text-slate-900 ml-2">TutorTrack</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2">
        {/* Main Navigation */}
        <SectionTitle>Navigation</SectionTitle>
        <NavItem
          to="/"
          icon={<HomeIcon className="h-5 w-5" />}
          label="Dashboard"
        />
        <NavItem
          to="/students"
          icon={<UsersIcon className="h-5 w-5" />}
          label="Students"
        />

        {/* Teaching */}
        <SectionTitle>Teaching</SectionTitle>
        <NavItem
          to="/calendar"
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Calendar"
        />
        <NavItem
          to="/homework"
          icon={<BookOpenIcon className="h-5 w-5" />}
          label="Homework"
        />
        <NavItem
          to="/grades"
          icon={<ClipboardCheckIcon className="h-5 w-5" />}
          label="Grades"
        />

        {/* Analytics */}
        <SectionTitle>Analytics</SectionTitle>
        <NavItem
          to="/reports"
          icon={<PencilIcon className="h-5 w-5" />}
          label="Reports"
        />
      </nav>

      {/* Footer Section - Empty for spacing */}
      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          v1.0.0 • TutorTrack
        </p>
      </div>
    </aside>
  );
};
