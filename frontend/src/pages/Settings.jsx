import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Shield,
  Loader
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [settings, setSettings] = useState({
    email_notifications: true,
    application_updates: true,
    job_recommendations: true,
    marketing_emails: false,
    profile_visibility: 'public',
    show_email: false,
    show_phone: false,
    theme: 'light',
    language: 'en',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully!');
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (settings.new_password !== settings.confirm_password) {
      toast.error('Passwords do not match!');
      return;
    }
    if (settings.new_password.length < 8) {
      toast.error('Password must be at least 8 characters!');
      return;
    }
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Password changed successfully!');
    setSettings(prev => ({
      ...prev,
      current_password: '',
      new_password: '',
      confirm_password: ''
    }));
    setSaving(false);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <SettingsIcon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'account' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" value={user?.name || ''} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                    <p className="text-sm text-gray-500 mt-1">Go to Profile to edit your name</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input type="text" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ''} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {[
                    { key: 'email_notifications', title: 'Email Notifications', desc: 'Receive email updates' },
                    { key: 'application_updates', title: 'Application Updates', desc: 'Get notified about application status' },
                    { key: 'job_recommendations', title: 'Job Recommendations', desc: 'Receive personalized job suggestions' },
                    { key: 'marketing_emails', title: 'Marketing Emails', desc: 'Promotional content and updates' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings[item.key]} onChange={(e) => handleChange(item.key, e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                  <button onClick={handleSave} disabled={saving} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center">
                    {saving ? <><Loader className="w-5 h-5 mr-2 animate-spin" />Saving...</> : <><Save className="w-5 h-5 mr-2" />Save Preferences</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select value={settings.profile_visibility} onChange={(e) => handleChange('profile_visibility', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="public">Public - Anyone can see</option>
                      <option value="private">Private - Only you</option>
                      <option value="registered">Registered users only</option>
                    </select>
                  </div>
                  <button onClick={handleSave} disabled={saving} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center">
                    {saving ? <><Loader className="w-5 h-5 mr-2 animate-spin" />Saving...</> : <><Save className="w-5 h-5 mr-2" />Save Settings</>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={settings.current_password} onChange={(e) => handleChange('current_password', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={settings.new_password} onChange={(e) => handleChange('new_password', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={settings.confirm_password} onChange={(e) => handleChange('confirm_password', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button onClick={handleChangePassword} disabled={saving || !settings.current_password || !settings.new_password || !settings.confirm_password} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center">
                    {saving ? <><Loader className="w-5 h-5 mr-2 animate-spin" />Changing Password...</> : <><Lock className="w-5 h-5 mr-2" />Change Password</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
