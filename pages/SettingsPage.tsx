
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
    const { user } = useAppContext();
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input type="text" defaultValue={user?.name} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input type="email" defaultValue={user?.email} disabled className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50" />
            </div>
            <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Current Password</label>
                <input type="password" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">New Password</label>
                <input type="password" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
            </div>
            <Button>Update Password</Button>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-slate-600 mb-4">Export all your student data to CSV.</p>
            <Button variant="secondary">Export All Data</Button>
        </CardContent>
      </Card>
    </div>
  );
};
