import React from "react";

export interface ToolbarAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
}

interface ToolbarProps {
  title?: string;
  actions?: ToolbarAction[];
  children?: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  actions = [],
  children,
}) => {
  const getButtonClasses = (
    variant: "primary" | "secondary" | "danger" = "secondary"
  ) => {
    switch (variant) {
      case "primary":
        return "bg-primary-500 text-white hover:bg-primary-600";
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600";
      case "secondary":
      default:
        return "bg-slate-100 text-slate-900 hover:bg-slate-200";
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Title */}
        {title && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          </div>
        )}

        {/* Center: Custom children */}
        {children && (
          <div className="flex-1 flex items-center gap-3">{children}</div>
        )}

        {/* Right: Action Buttons */}
        {actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${getButtonClasses(
                  action.variant
                )}`}
              >
                {action.icon && <span className="h-4 w-4">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
