import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Shield,
  User,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Ban,
  Check,
  Trash2,
  MoreVertical,
  Loader
} from 'lucide-react';

export default function AdminUsers() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('verified', statusFilter === 'verified' ? '1' : '0');
      
      const response = await api.get(`/admin/users?${params.toString()}`);
      setUsers(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    setProcessing(userId);
    const verifyPromise = api.put(`/admin/users/${userId}/verify`);
    
    toast.promise(
      verifyPromise,
      {
        loading: 'Verifying user...',
        success: 'User verified successfully!',
        error: (err) => err.response?.data?.message || 'Failed to verify user'
      }
    ).then(() => {
      fetchUsers();
      setProcessing(null);
    }).catch(() => {
      setProcessing(null);
    });
  };

  const handleDeactivate = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    setProcessing(userId);
    const deactivatePromise = api.put(`/admin/users/${userId}/deactivate`);
    
    toast.promise(
      deactivatePromise,
      {
        loading: 'Deactivating user...',
        success: 'User deactivated successfully!',
        error: (err) => err.response?.data?.message || 'Failed to deactivate user'
      }
    ).then(() => {
      fetchUsers();
      setProcessing(null);
    }).catch(() => {
      setProcessing(null);
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    companies: users.filter(u => u.role === 'company').length,
    verified: users.filter(u => u.is_verified).length,
    pending: users.filter(u => !u.is_verified).length
  };

  const getRoleIcon = (role) => {
    if (role === 'student') return GraduationCap;
    if (role === 'company') return Building2;
    if (role === 'admin') return Shield;
    return User;
  };

  const getRoleColor = (role) => {
    if (role === 'student') return 'bg-blue-100 text-blue-800';
    if (role === 'company') return 'bg-purple-100 text-purple-800';
    if (role === 'admin') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Manage all platform users</p>
              </div>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {stats.total} Total Users
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setRoleFilter('all')}
            className={`p-4 rounded-xl ${roleFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">All Users</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </button>

          <button
            onClick={() => setRoleFilter('student')}
            className={`p-4 rounded-xl ${roleFilter === 'student' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Students</p>
            <p className="text-2xl font-bold mt-1">{stats.students}</p>
          </button>

          <button
            onClick={() => setRoleFilter('company')}
            className={`p-4 rounded-xl ${roleFilter === 'company' ? 'bg-purple-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Companies</p>
            <p className="text-2xl font-bold mt-1">{stats.companies}</p>
          </button>

          <button
            onClick={() => setStatusFilter('verified')}
            className={`p-4 rounded-xl ${statusFilter === 'verified' ? 'bg-green-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Verified</p>
            <p className="text-2xl font-bold mt-1">{stats.verified}</p>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-xl ${statusFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold mt-1">{stats.pending}</p>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => {
                setRoleFilter('all');
                setStatusFilter('all');
                setSearchTerm('');
                toast.success('Filters cleared');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.is_verified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {!user.is_verified && (
                              <button
                                onClick={() => handleVerify(user.user_id)}
                                disabled={processing === user.user_id}
                                className="text-green-600 hover:text-green-700 disabled:text-gray-400"
                                title="Verify User"
                              >
                                {processing === user.user_id ? (
                                  <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Check className="w-5 h-5" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeactivate(user.user_id)}
                              disabled={processing === user.user_id}
                              className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                              title="Deactivate User"
                            >
                              <Ban className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
