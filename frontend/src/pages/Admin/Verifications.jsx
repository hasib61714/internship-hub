import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Check,
  X,
  Loader,
  FileText
} from 'lucide-react';

export default function AdminVerifications() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchVerifications();
  }, [isAdmin, navigate, filter]);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      
      const response = await api.get(`/admin/verifications?${params.toString()}`);
      setVerifications(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast.error('Failed to load verifications');
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, action) => {
    const actionText = action === 'approve' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${actionText} this verification?`)) {
      return;
    }

    setProcessing(userId);
    const verifyPromise = api.put(`/admin/users/${userId}/verify`, { action });
    
    toast.promise(
      verifyPromise,
      {
        loading: `${action === 'approve' ? 'Approving' : 'Rejecting'} verification...`,
        success: `Verification ${action === 'approve' ? 'approved' : 'rejected'} successfully!`,
        error: (err) => err.response?.data?.message || 'Failed to process verification'
      }
    ).then(() => {
      fetchVerifications();
      setProcessing(null);
    }).catch(() => {
      setProcessing(null);
    });
  };

  const stats = {
    total: verifications.length,
    pending: verifications.filter(v => !v.is_verified).length,
    approved: verifications.filter(v => v.is_verified).length,
    students: verifications.filter(v => v.role === 'student').length,
    companies: verifications.filter(v => v.role === 'company').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verifications...</p>
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
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Verifications</h1>
                <p className="text-gray-600 mt-1">Review and approve user verifications</p>
              </div>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {stats.pending} Pending
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">All</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`p-4 rounded-xl ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold mt-1">{stats.pending}</p>
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`p-4 rounded-xl ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Approved</p>
            <p className="text-2xl font-bold mt-1">{stats.approved}</p>
          </button>

          <button
            onClick={() => setFilter('students')}
            className={`p-4 rounded-xl ${filter === 'students' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Students</p>
            <p className="text-2xl font-bold mt-1">{stats.students}</p>
          </button>

          <button
            onClick={() => setFilter('companies')}
            className={`p-4 rounded-xl ${filter === 'companies' ? 'bg-purple-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Companies</p>
            <p className="text-2xl font-bold mt-1">{stats.companies}</p>
          </button>
        </div>

        {/* Verifications List */}
        {verifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending verifications at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification) => (
              <div key={verification.user_id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg mr-3 ${
                        verification.role === 'student' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {verification.role === 'student' ? (
                          <GraduationCap className={`w-6 h-6 ${
                            verification.role === 'student' ? 'text-blue-600' : 'text-purple-600'
                          }`} />
                        ) : (
                          <Building2 className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{verification.name}</h3>
                        <p className="text-sm text-gray-600">
                          {verification.role === 'student' ? 'Student' : 'Company'} • 
                          Applied {new Date(verification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {verification.email}
                      </div>
                      {verification.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {verification.phone}
                        </div>
                      )}
                      {verification.role === 'student' && verification.student?.university && (
                        <div className="flex items-center text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          {verification.student.university}
                        </div>
                      )}
                      {verification.role === 'company' && verification.company?.company_name && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="w-4 h-4 mr-2" />
                          {verification.company.company_name}
                        </div>
                      )}
                    </div>

                    {verification.is_verified ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending Review
                      </span>
                    )}
                  </div>

                  {!verification.is_verified && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleVerify(verification.user_id, 'approve')}
                        disabled={processing === verification.user_id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center"
                      >
                        {processing === verification.user_id ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleVerify(verification.user_id, 'reject')}
                        disabled={processing === verification.user_id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
