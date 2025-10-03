"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface LecturerSettings {
  notifications: boolean;
  autoApprove: boolean;
  defaultDuration: number;
}

export default function LecturerSettingsPage() {
  const { user, isLoaded } = useUser();
  const [settings, setSettings] = useState<LecturerSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const key = `lecturerSettings:${user?.id || 'anon'}`;

  useEffect(() => {
    if (!isLoaded) return;
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    const defaults: LecturerSettings = { notifications: true, autoApprove: false, defaultDuration: 60 };
    setSettings({ ...defaults, ...(saved || {}) });
  }, [isLoaded, key]);

  const handleSave = () => {
    if (!settings) return;
    setSaving(true);
    localStorage.setItem(key, JSON.stringify(settings));
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="pt-20 p-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      {!settings ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-600">Get notified on new submissions</div>
            </div>
            <input type="checkbox" checked={settings.notifications} onChange={e => setSettings({ ...settings!, notifications: e.target.checked })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto-approve Results</div>
              <div className="text-sm text-gray-600">Automatically approve high scores</div>
            </div>
            <input type="checkbox" checked={settings.autoApprove} onChange={e => setSettings({ ...settings!, autoApprove: e.target.checked })} />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-900">Default Exam Duration (mins)</label>
            <input type="number" className="border rounded px-3 py-1 w-28" value={settings.defaultDuration} onChange={e => setSettings({ ...settings!, defaultDuration: Number(e.target.value) || 0 })} />
          </div>
          <div>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">{saving ? 'Saving...' : 'Save Settings'}</button>
          </div>
        </div>
      )}
    </div>
  );
}


