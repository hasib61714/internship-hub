import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Users,
  Calendar,
  Globe,
  Link as LinkIcon,
  Linkedin,
  Facebook,
  Twitter,
  Edit,
  Save,
  X,
  CheckCircle,
  Loader
} from 'lucide-react';

export default function CompanyProfile() {
  const { user, isCompany } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    company_name: '',
    email: '',
    phone: '',
    industry: '',
    company_size: '',
    founded_year: '',
    location: '',
    address: '',
    description: '',
    website: '',
    linkedin_url: '',
    facebook_url: '',
    twitter_url: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isCompany) {
      navigate('/');
      return;
    }
    fetchProfile();
  }, [isCompany, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/me');
      const userData = response.data.data || response.data.user || response.data;
      const companyData = userData.company || {};
      
      setProfile({
        company_name: companyData.company_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        industry: companyData.industry || '',
        company_size: companyData.company_size || '',
        founded_year: companyData.founded_year || '',
        location: companyData.location || '',
        address: companyData.address || '',
        description: companyData.description || '',
        website: companyData.website || '',
        linkedin_url: companyData.linkedin_url || '',
        facebook_url: companyData.facebook_url || '',
        twitter_url: companyData.twitter_url || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const savePromise = api.put('/profile', profile);
    
    toast.promise(
      savePromise,
      {
        loading: 'Saving profile...',
        success: 'Profile updated successfully! 🎉',
        error: (err) => {
          if (err.response?.data?.errors) {
            setErrors(err.response.data.errors);
            return 'Please fix the errors in the form';
          }
          return err.response?.data?.message || 'Failed to update profile';
        }
      }
    ).then(() => {
      setEditing(false);
      fetchProfile();
      setSaving(false);
    }).catch(() => {
      setSaving(false);
    });
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
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
              <p className="text-gray-600 mt-1">Manage your company information</p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                    setErrors({});
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.company_name}</h2>
                <p className="text-gray-600 mt-1">{profile.industry || 'Company'}</p>
                {user?.is_verified && (
                  <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified Company
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="break-all">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Company Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      value={profile.company_name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                    {errors.company_name && <p className="text-red-600 text-sm mt-1">{errors.company_name[0]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={profile.industry}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g. Technology, Healthcare"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select
                      name="company_size"
                      value={profile.company_size}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                    <input
                      type="number"
                      name="founded_year"
                      value={profile.founded_year}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g. 2020"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="Full address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                  <textarea
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    disabled={!editing}
                    rows="4"
                    placeholder="Tell us about your company..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Online Presence */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Online Presence</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="https://yourcompany.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={profile.linkedin_url}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                    <input
                      type="url"
                      name="facebook_url"
                      value={profile.facebook_url}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="https://facebook.com/yourcompany"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                    <input
                      type="url"
                      name="twitter_url"
                      value={profile.twitter_url}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="https://twitter.com/yourcompany"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
