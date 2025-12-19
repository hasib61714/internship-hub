import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  Home,
  Briefcase,
  FileText,
  Plus,
  Users,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  AlertCircle,
  Settings,
  Bookmark
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isStudent, isCompany, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
    }`;
  };

  const mobileNavLinkClass = (path) => {
    return `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive(path)
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
    }`;
  };

  // Student Navigation Links
  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs', label: 'Browse Jobs', icon: Briefcase },
    { path: '/student/applications', label: 'My Applications', icon: FileText },
    { path: '/student/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  ];

  // Company Navigation Links
  const companyLinks = [
    { path: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs/create', label: 'Post Job', icon: Plus },
    { path: '/company/jobs', label: 'My Jobs', icon: Briefcase },
  ];

  // Admin Navigation Links
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/pending-jobs', label: 'Pending Jobs', icon: AlertCircle },
    { path: '/jobs', label: 'All Jobs', icon: Briefcase },
  ];

  const getCurrentLinks = () => {
    if (isStudent) return studentLinks;
    if (isCompany) return companyLinks;
    if (isAdmin) return adminLinks;
    return [];
  };

  const links = getCurrentLinks();

  const handleProfileClick = () => {
    if (isStudent) {
      navigate('/student/profile');
    } else if (isCompany) {
      navigate('/company/profile');
    } else if (isAdmin) {
      navigate('/admin/profile');
    }
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Internship Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={navLinkClass(link.path)}
              >
                <link.icon className="w-4 h-4 mr-2" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="max-w-32 truncate">{user?.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setUserMenuOpen(false)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Navigation Links */}
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass(link.path)}
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.label}
              </Link>
            ))}

            {/* User Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-3 mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isStudent) {
                    navigate('/student/profile');
                  } else if (isCompany) {
                    navigate('/company/profile');
                  } else if (isAdmin) {
                    navigate('/admin/profile');
                  }
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <User className="w-5 h-5 mr-3" />
                My Profile
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}