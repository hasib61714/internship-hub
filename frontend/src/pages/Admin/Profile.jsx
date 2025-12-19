import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  Settings,
  Key,
  Activity
} from 'lucide-react';

export default function AdminProfile() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    created_at: '',
    is_verified: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchProfile();
  }, [isAdmin, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/me');
      const userData = response.data.data || response.data.user || response.data;
      
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || '',
        created_at: userData.created_at || '',
        is_verified: userData.is_verified || false
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600 mt-1">System administrator account information</p>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <Shield className="w-4 h-4 mr-2" />
              Administrator
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Admin Avatar */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600 mt-1">System Administrator</p>
                {profile.is_verified && (
                  <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified Admin
                  </span>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 break-all">{profile.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Full System Access</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => alert('Change password feature coming soon!')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </button>
                <button
                  onClick={() => alert('Settings coming soon!')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profile.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profile.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <Shield className="w-4 h-4 mr-1" />
                      Administrator
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Administrator Permissions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">User Management</p>
                    <p className="text-sm text-gray-600">Full access to all users</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Job Moderation</p>
                    <p className="text-sm text-gray-600">Approve/reject jobs</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Verification Control</p>
                    <p className="text-sm text-gray-600">Verify students & companies</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">System Analytics</p>
                    <p className="text-sm text-gray-600">View all statistics</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Content Moderation</p>
                    <p className="text-sm text-gray-600">Manage platform content</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Report Handling</p>
                    <p className="text-sm text-gray-600">Handle user reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Security Notice</h4>
                  <p className="text-sm text-gray-700">
                    As an administrator, you have full access to the platform. Please ensure you:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc list-inside">
                    <li>Keep your password secure and change it regularly</li>
                    <li>Never share your admin credentials</li>
                    <li>Review all actions before confirming</li>
                    <li>Log out when not using the platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
