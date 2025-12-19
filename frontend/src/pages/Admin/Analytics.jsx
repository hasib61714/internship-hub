import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/analytics?range=${timeRange}`);
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 md:w-1/4 mb-6 md:mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = analytics || {
    overview: {
      totalUsers: 0,
      totalJobs: 0,
      totalApplications: 0,
      activeJobs: 0,
      newUsersThisWeek: 0,
      newJobsThisWeek: 0,
      applicationRate: 0,
      verifiedCompanies: 0
    },
    userGrowth: [],
    jobStats: { byCategory: [], byType: [], byWorkMode: [] },
    applicationStats: { byStatus: [], avgResponseTime: 0 },
    topCompanies: [],
    topCategories: []
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Platform insights and statistics</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Key Metrics - Mobile Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <MetricCard
            title="Total Users"
            value={stats.overview.totalUsers}
            change={`+${stats.overview.newUsersThisWeek}`}
            changeLabel="this week"
            icon="👥"
            color="blue"
          />
          <MetricCard
            title="Active Jobs"
            value={stats.overview.activeJobs}
            change={`+${stats.overview.newJobsThisWeek}`}
            changeLabel="this week"
            icon="💼"
            color="green"
          />
          <MetricCard
            title="Total Applications"
            value={stats.overview.totalApplications}
            change={`${stats.overview.applicationRate}%`}
            changeLabel="acceptance rate"
            icon="📝"
            color="purple"
          />
          <MetricCard
            title="Verified Companies"
            value={stats.overview.verifiedCompanies}
            change={`${Math.round((stats.overview.verifiedCompanies / (stats.overview.totalUsers || 1)) * 100)}%`}
            changeLabel="of total"
            icon="✓"
            color="yellow"
          />
        </div>

        {/* Charts Row - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
            <div className="overflow-x-auto">
              <UserGrowthChart data={stats.userGrowth} />
            </div>
          </div>

          {/* Job Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Job Distribution</h2>
            <div className="overflow-x-auto">
              <JobDistributionChart data={stats.jobStats.byType} />
            </div>
          </div>
        </div>

        {/* Application Stats - Mobile Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Application Status</h2>
            <ApplicationStatusChart data={stats.applicationStats.byStatus} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Work Mode</h2>
            <WorkModeChart data={stats.jobStats.byWorkMode} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Avg Response Time</h2>
            <div className="flex items-center justify-center h-32 md:h-40">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">
                  {stats.applicationStats.avgResponseTime}
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-2">hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Lists - Mobile Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Top Companies */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Top Companies</h2>
            <div className="space-y-3 md:space-y-4">
              {stats.topCompanies.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No data available</p>
              ) : (
                stats.topCompanies.map((company, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs md:text-sm mr-2 md:mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 text-sm md:text-base truncate">{company.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{company.jobsPosted} jobs</div>
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="text-xs md:text-sm font-medium text-gray-900">{company.applications}</div>
                      <div className="text-xs text-gray-500">apps</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Popular Categories</h2>
            <div className="space-y-3 md:space-y-4">
              {stats.topCategories.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No data available</p>
              ) : (
                stats.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="text-xl md:text-2xl mr-2 md:mr-3 flex-shrink-0">{category.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 text-sm md:text-base truncate">{category.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{category.jobCount} jobs</div>
                      </div>
                    </div>
                    <div className="flex items-center ml-2 flex-shrink-0">
                      <div className="hidden sm:block w-20 md:w-32 bg-gray-200 rounded-full h-2 mr-2 md:mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(category.jobCount / (stats.overview.totalJobs || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-600">
                        {Math.round((category.jobCount / (stats.overview.totalJobs || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Insights - Mobile Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <InsightCard
            icon="📈"
            title="Growth Trend"
            value="Positive"
            description="User signups increased by 23% this month"
            color="green"
          />
          <InsightCard
            icon="⚡"
            title="Quick Hires"
            value="2.5 days"
            description="Average time from posting to first hire"
            color="blue"
          />
          <InsightCard
            icon="⭐"
            title="Success Rate"
            value="67%"
            description="Applications that lead to interviews"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}

// Metric Card Component - Mobile Responsive
function MetricCard({ title, value, change, changeLabel, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-xs md:text-sm font-medium text-gray-600">{title}</h3>
        <span className={`text-xl md:text-2xl ${colorClasses[color]} p-1.5 md:p-2 rounded-lg`}>
          {icon}
        </span>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
        {value.toLocaleString()}
      </div>
      <div className="flex items-center text-xs md:text-sm">
        <span className="text-green-600 font-medium">{change}</span>
        <span className="text-gray-500 ml-1">{changeLabel}</span>
      </div>
    </div>
  );
}

// Chart Components - Mobile Optimized
function UserGrowthChart({ data }) {
  const maxValue = Math.max(...(data.map(d => d.users) || [1]));
  
  return (
    <div className="space-y-2 md:space-y-3">
      {data.length === 0 ? (
        <div className="text-center py-6 md:py-8 text-sm md:text-base text-gray-500">No data available</div>
      ) : (
        data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-12 md:w-20 text-xs md:text-sm text-gray-600">{item.date}</div>
            <div className="flex-1 ml-2 md:ml-4">
              <div className="bg-gray-200 rounded-full h-6 md:h-8 relative">
                <div 
                  className="bg-blue-600 h-6 md:h-8 rounded-full flex items-center justify-end pr-2 md:pr-3 text-white text-xs md:text-sm font-medium transition-all duration-500"
                  style={{ width: `${Math.max((item.users / maxValue) * 100, 15)}%` }}
                >
                  {item.users}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function JobDistributionChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
  
  return (
    <div className="space-y-2 md:space-y-3">
      {data.length === 0 ? (
        <div className="text-center py-6 md:py-8 text-sm md:text-base text-gray-500">No data available</div>
      ) : (
        data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <span className="capitalize text-xs md:text-sm text-gray-700 w-16 md:w-24 flex-shrink-0">{item.type}</span>
              <div className="flex-1 mx-2 md:mx-4">
                <div className="bg-gray-200 rounded-full h-4 md:h-6">
                  <div 
                    className="bg-green-500 h-4 md:h-6 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-900 ml-2 flex-shrink-0">
              {item.count} ({Math.round((item.count / total) * 100)}%)
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function ApplicationStatusChart({ data }) {
  const statusColors = {
    pending: 'bg-yellow-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500',
    shortlisted: 'bg-blue-500'
  };

  return (
    <div className="space-y-2 md:space-y-3">
      {data.length === 0 ? (
        <div className="text-center py-6 md:py-8 text-sm md:text-base text-gray-500">No data available</div>
      ) : (
        data.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${statusColors[item.status]} mr-2`}></div>
              <span className="text-xs md:text-sm capitalize text-gray-700">{item.status}</span>
            </div>
            <span className="text-xs md:text-sm font-semibold text-gray-900">{item.count}</span>
          </div>
        ))
      )}
    </div>
  );
}

function WorkModeChart({ data }) {
  const modeColors = {
    remote: 'bg-green-500',
    'on-site': 'bg-blue-500',
    hybrid: 'bg-purple-500'
  };

  return (
    <div className="space-y-2 md:space-y-3">
      {data.length === 0 ? (
        <div className="text-center py-6 md:py-8 text-sm md:text-base text-gray-500">No data available</div>
      ) : (
        data.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${modeColors[item.mode]} mr-2`}></div>
              <span className="text-xs md:text-sm capitalize text-gray-700">{item.mode}</span>
            </div>
            <span className="text-xs md:text-sm font-semibold text-gray-900">{item.count}</span>
          </div>
        ))
      )}
    </div>
  );
}

function InsightCard({ icon, title, value, description, color }) {
  const colorClasses = {
    green: 'border-green-200 bg-green-50',
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50'
  };

  return (
    <div className={`border-2 ${colorClasses[color]} rounded-lg p-4 md:p-6`}>
      <div className="text-2xl md:text-3xl mb-2 md:mb-3">{icon}</div>
      <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{value}</div>
      <p className="text-xs md:text-sm text-gray-600">{description}</p>
    </div>
  );
}