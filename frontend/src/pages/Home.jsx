import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Building, 
  TrendingUp, 
  Search,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  MapPin
} from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Web Development', icon: '💻', jobs: 245 },
    { name: 'Mobile Development', icon: '📱', jobs: 189 },
    { name: 'UI/UX Design', icon: '🎨', jobs: 156 },
    { name: 'Digital Marketing', icon: '📈', jobs: 234 },
    { name: 'Content Writing', icon: '✍️', jobs: 178 },
    { name: 'Data Entry', icon: '📊', jobs: 312 },
  ];

  const features = [
    {
      icon: Briefcase,
      title: 'Find Jobs & Internships',
      description: 'Browse thousands of opportunities from top companies across Bangladesh'
    },
    {
      icon: Users,
      title: 'Hire Top Talent',
      description: 'Connect with skilled students and professionals for your projects'
    },
    {
      icon: Clock,
      title: 'Flexible Work Options',
      description: 'Choose from hourly, project-based, part-time, or full-time positions'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Career',
      description: 'Gain experience, earn certificates, and build your professional portfolio'
    },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'React Developer Needed - 15 Hours',
      company: 'Tech Solutions Ltd',
      type: 'Hourly',
      rate: '800 BDT/hr',
      location: 'Remote',
      urgent: true,
    },
    {
      id: 2,
      title: 'UI/UX Designer Internship',
      company: 'Creative Studio BD',
      type: 'Internship',
      rate: '15,000 BDT/month',
      location: 'Dhaka',
      urgent: false,
    },
    {
      id: 3,
      title: 'Content Writer - Part Time',
      company: 'Digital Marketing Pro',
      type: 'Part-Time',
      rate: '20,000 BDT/month',
      location: 'Remote',
      urgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Dream Job or Hire Top Talent
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Bangladesh's premier platform for internships, freelance work, and permanent positions
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, skills, or companies..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <select className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>All Types</option>
                  <option>Hourly</option>
                  <option>Project</option>
                  <option>Part-Time</option>
                  <option>Full-Time</option>
                  <option>Internship</option>
                </select>
                <Link
                  to="/jobs"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Search
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold">500+</div>
                <div className="text-blue-100 mt-1">Active Jobs</div>
              </div>
              <div>
                <div className="text-4xl font-bold">1000+</div>
                <div className="text-blue-100 mt-1">Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold">200+</div>
                <div className="text-blue-100 mt-1">Companies</div>
              </div>
              <div>
                <div className="text-4xl font-bold">95%</div>
                <div className="text-blue-100 mt-1">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-gray-600">Find opportunities in your field of expertise</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/jobs?category=${category.name}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-center group"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">{category.jobs} jobs</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Jobs</h2>
              <p className="text-gray-600">Hand-picked opportunities for you</p>
            </div>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View All Jobs
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all">
                {job.urgent && (
                  <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Urgent
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-4 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {job.company}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full">
                    {job.type}
                  </span>
                  <span className="bg-green-50 text-green-600 text-sm px-3 py-1 rounded-full">
                    {job.rate}
                  </span>
                  <span className="text-gray-600 text-sm flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                </div>
                <Link
                  to={`/jobs/${job.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose InternshipHub?</h2>
          <p className="text-gray-600 text-lg">Everything you need to succeed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-gray-600">Sign up and complete your professional profile in minutes</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse & Apply</h3>
              <p className="text-gray-600">Find perfect opportunities and submit your proposals</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Hired</h3>
              <p className="text-gray-600">Start working and build your professional reputation</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of students and companies today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=student"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              I'm Looking for Work
            </Link>
            <Link
              to="/register?role=company"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              I'm Hiring
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold">InternshipHub</span>
          </div>
          <p className="text-gray-400 mb-4">Connecting talent with opportunity across Bangladesh</p>
          <p className="text-gray-500 text-sm">© 2025 InternshipHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
