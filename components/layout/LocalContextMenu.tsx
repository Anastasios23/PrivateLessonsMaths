import React from "react";
import { NavLink } from "react-router-dom";

export interface ContextMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface LocalContextMenuProps {
  title?: string;
  subtitle?: string;
  items: ContextMenuItem[];
}

export const LocalContextMenu: React.FC<LocalContextMenuProps> = ({
  title,
  subtitle,
  items,
}) => {
  return (
    <div className="border-b border-slate-200 bg-white">
      {/* Header Section */}
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-100">
          {title && (
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      {/* Menu Items */}
      <div className="flex gap-1 px-6 py-2 overflow-x-auto">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary-100 text-primary-700 border-b-2 border-primary-500"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {item.icon && <span className="h-4 w-4">{item.icon}</span>}
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default LocalContextMenu;
