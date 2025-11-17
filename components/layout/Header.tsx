
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';

export const Header: React.FC = () => {
    const { user } = useAppContext();
    return (
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
            <div>
                {/* Could add breadcrumbs or page title here */}
            </div>
            <div className="flex items-center">
                <span className="text-sm font-medium text-slate-700 mr-3">Welcome, {user?.name}</span>
                <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name.charAt(0)}
                </div>
            </div>
        </header>
    );
}
