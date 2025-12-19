import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Code,
  Link as LinkIcon,
  Github,
  Linkedin,
  Edit,
  Save,
  X,
  CheckCircle,
  Loader
} from 'lucide-react';

export default function StudentProfile() {
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    date_of_birth: '',
    bio: '',
    university: '',
    major: '',
    graduation_year: '',
    education: '',
    skills: '',
    portfolio_url: '',
    github_url: '',
    linkedin_url: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isStudent) {
      navigate('/');
      return;
    }
    fetchProfile();
  }, [isStudent, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/me');
      const userData = response.data.data || response.data.user || response.data;
      const studentData = userData.student || {};
      
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: studentData.location || '',
        date_of_birth: studentData.date_of_birth || '',
        bio: studentData.bio || '',
        university: studentData.university || '',
        major: studentData.major || '',
        graduation_year: studentData.graduation_year || '',
        education: studentData.education || '',
        skills: studentData.skills || '',
        portfolio_url: studentData.portfolio_url || '',
        github_url: studentData.github_url || '',
        linkedin_url: studentData.linkedin_url || ''
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
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information</p>
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
                  <span className="text-white text-5xl font-bold">
                    {profile.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600 mt-1">{profile.major || 'Student'}</p>
                {user?.is_verified && (
                  <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
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
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={profile.date_of_birth}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!editing}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                    <input
                      type="text"
                      name="university"
                      value={profile.university}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g. Green University"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                    <input
                      type="text"
                      name="major"
                      value={profile.major}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                    <input
                      type="number"
                      name="graduation_year"
                      value={profile.graduation_year}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g. 2025"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education Details</label>
                  <textarea
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    disabled={!editing}
                    rows="3"
                    placeholder="Additional education information..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Skills</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Skills (comma separated)
                  </label>
                  <textarea
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    disabled={!editing}
                    rows="3"
                    placeholder="e.g. JavaScript, React, Node.js, Python"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Social Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                    <input
                      type="url"
                      name="portfolio_url"
                      value={profile.portfolio_url}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      name="github_url"
                      value={profile.github_url}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="https://github.com/yourusername"
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
                      placeholder="https://linkedin.com/in/yourusername"
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
