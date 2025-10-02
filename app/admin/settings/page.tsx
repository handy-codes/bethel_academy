"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Shield,
  Bell,
  Globe,
  Mail,
  Database,
  Key,
  Users,
  Clock,
  AlertTriangle
} from "lucide-react";

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    timezone: string;
    language: string;
  };
  exam: {
    defaultDuration: number;
    maxAttempts: number;
    autoSubmit: boolean;
    showResults: boolean;
    allowReview: boolean;
    passingScore: number;
  };
  notifications: {
    emailNotifications: boolean;
    examReminders: boolean;
    resultNotifications: boolean;
    systemAlerts: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    allowGoogleAuth: boolean;
  };
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    dataRetentionDays: number;
    backupFrequency: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    // Load real data from localStorage
    const loadSettings = () => {
      const savedSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}');

      // Default settings if none exist
      const defaultSettings = {
        general: {
          siteName: "Bethel Academy CBT System",
          siteDescription: "Computer-Based Testing Platform for Educational Excellence",
          contactEmail: "admin@bethelacademy.edu",
          timezone: "Africa/Lagos",
          language: "en",
        },
        exam: {
          defaultDuration: 120,
          maxAttempts: 3,
          autoSubmit: true,
          showResults: false,
          allowReview: true,
          passingScore: 50,
        },
        notifications: {
          emailNotifications: true,
          examReminders: true,
          resultNotifications: true,
          systemAlerts: true,
        },
        security: {
          sessionTimeout: 30,
          passwordMinLength: 8,
          requireTwoFactor: false,
          allowGoogleAuth: true,
        },
        system: {
          maintenanceMode: false,
          debugMode: false,
          dataRetentionDays: 365,
          backupFrequency: "daily",
        },
      };

      setSettings({ ...defaultSettings, ...savedSettings });
      setLoading(false);
    };

    loadSettings();

    // Set up real-time updates by checking localStorage periodically
    const interval = setInterval(loadSettings, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSave = async () => {
    setSaving(true);

    // Save to localStorage
    if (settings) {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
    }

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      // Show success message
      alert("Settings saved successfully!");
    }, 2000);
  };

  const updateSettings = (section: keyof Settings, field: string, value: any) => {
    if (!settings) return;

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const tabs = [
    { id: "general", name: "General", icon: Globe },
    { id: "exam", name: "Exam Settings", icon: Clock },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "system", name: "System", icon: Database },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure system preferences and behavior</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => updateSettings("general", "siteName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSettings("general", "contactEmail", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => updateSettings("general", "timezone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => updateSettings("general", "language", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSettings("general", "siteDescription", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Exam Settings */}
          {activeTab === "exam" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Exam Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.exam.defaultDuration}
                    onChange={(e) => updateSettings("exam", "defaultDuration", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Attempts per Exam
                  </label>
                  <input
                    type="number"
                    value={settings.exam.maxAttempts}
                    onChange={(e) => updateSettings("exam", "maxAttempts", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.exam.passingScore}
                    onChange={(e) => updateSettings("exam", "passingScore", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Auto-submit when time expires</h3>
                    <p className="text-sm text-gray-500">Automatically submit exams when the time limit is reached</p>
                  </div>
                  <button
                    onClick={() => updateSettings("exam", "autoSubmit", !settings.exam.autoSubmit)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.exam.autoSubmit ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.exam.autoSubmit ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Show results immediately</h3>
                    <p className="text-sm text-gray-500">Display exam results to students immediately after submission</p>
                  </div>
                  <button
                    onClick={() => updateSettings("exam", "showResults", !settings.exam.showResults)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.exam.showResults ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.exam.showResults ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Allow answer review</h3>
                    <p className="text-sm text-gray-500">Let students review their answers after exam completion</p>
                  </div>
                  <button
                    onClick={() => updateSettings("exam", "allowReview", !settings.exam.allowReview)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.exam.allowReview ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.exam.allowReview ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Send email notifications for important events</p>
                  </div>
                  <button
                    onClick={() => updateSettings("notifications", "emailNotifications", !settings.notifications.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.notifications.emailNotifications ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.notifications.emailNotifications ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Exam Reminders</h3>
                    <p className="text-sm text-gray-500">Send reminders about upcoming exams</p>
                  </div>
                  <button
                    onClick={() => updateSettings("notifications", "examReminders", !settings.notifications.examReminders)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.notifications.examReminders ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.notifications.examReminders ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Result Notifications</h3>
                    <p className="text-sm text-gray-500">Notify students when results are available</p>
                  </div>
                  <button
                    onClick={() => updateSettings("notifications", "resultNotifications", !settings.notifications.resultNotifications)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.notifications.resultNotifications ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.notifications.resultNotifications ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">System Alerts</h3>
                    <p className="text-sm text-gray-500">Receive notifications about system issues</p>
                  </div>
                  <button
                    onClick={() => updateSettings("notifications", "systemAlerts", !settings.notifications.systemAlerts)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.notifications.systemAlerts ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.notifications.systemAlerts ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings("security", "sessionTimeout", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSettings("security", "passwordMinLength", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Require Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <button
                    onClick={() => updateSettings("security", "requireTwoFactor", !settings.security.requireTwoFactor)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.security.requireTwoFactor ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.security.requireTwoFactor ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Allow Google Authentication</h3>
                    <p className="text-sm text-gray-500">Enable Google OAuth for user sign-in</p>
                  </div>
                  <button
                    onClick={() => updateSettings("security", "allowGoogleAuth", !settings.security.allowGoogleAuth)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.security.allowGoogleAuth ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.security.allowGoogleAuth ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Retention (days)
                  </label>
                  <input
                    type="number"
                    value={settings.system.dataRetentionDays}
                    onChange={(e) => updateSettings("system", "dataRetentionDays", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.system.backupFrequency}
                    onChange={(e) => updateSettings("system", "backupFrequency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                      <p className="text-sm text-gray-500">Temporarily disable access for system maintenance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings("system", "maintenanceMode", !settings.system.maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${settings.system.maintenanceMode ? "bg-yellow-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.system.maintenanceMode ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Debug Mode</h3>
                    <p className="text-sm text-gray-500">Enable detailed error logging (not recommended for production)</p>
                  </div>
                  <button
                    onClick={() => updateSettings("system", "debugMode", !settings.system.debugMode)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.system.debugMode ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.system.debugMode ? "translate-x-5" : "translate-x-0"
                      }`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
