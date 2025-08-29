import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userManager from '../utils/userManager';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FileText, Star, Zap, Brain, TrendingUp, Users, Award, ChevronUp, ChevronDown, X } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, gradient, trend, trendValue, subtitle }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${gradient}`}>
    <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
      <Icon size={80} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <Icon size={24} className="opacity-90" />
        {trend && (
          <div className="flex items-center space-x-1">
            {trend === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm opacity-90">{title}</p>
      {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
  >
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} mb-3 group-hover:scale-110 transition-transform duration-200`}>
      <Icon size={20} className="text-white" />
    </div>
    <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const ActivityItem = ({ type, title, time, user, avatar, tool_name, tool_color }) => (
  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white ${avatar}`}>
      {user?.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center space-x-2 mb-1">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        {tool_name && (
          <span 
            className="px-2 py-1 text-xs rounded-full text-white font-medium"
            style={{ backgroundColor: tool_color || '#6B7280' }}
          >
            {tool_name}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">{type} by {user}</span>
        <span className="text-xs text-gray-400">•</span>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
    </div>
  </div>
);

const AnalyticsModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Advanced Analytics</h2>
            <p className="text-blue-100 mt-1">Deep insights into your prompt library</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Prompts</p>
                  <p className="text-2xl font-bold">{stats?.totalPrompts || 0}</p>
                </div>
                <TrendingUp size={24} className="opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Avg. Rating</p>
                  <p className="text-2xl font-bold">{stats?.avgRating || 0}★</p>
                </div>
                <Star size={24} className="opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Usage</p>
                  <p className="text-2xl font-bold">{stats?.totalUsage || 0}</p>
                </div>
                <Users size={24} className="opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Favorites</p>
                  <p className="text-2xl font-bold">{stats?.favoriteCount || 0}</p>
                </div>
                <Star size={24} className="opacity-80" />
              </div>
            </div>
          </div>

          {stats?.toolDistribution?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">AI Tools Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.toolDistribution}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={30}
                      >
                        {stats.toolDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {stats.toolDistribution.map((tool, index) => (
                    <div key={index} className="flex items-center justify-between p-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tool.color }}
                        ></div>
                        <span className="text-sm font-medium">{tool.name}</span>
                      </div>
                      <span className="text-sm font-bold">{tool.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('7d');
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching stats from API...');
        
        // Get current users from userManager and log them
        const currentUsers = userManager.getAllUsers();
        console.log('Current users from userManager:', currentUsers);
        
        const response = await axios.get('http://localhost:5000/api/stats', {
          headers: {
            'x-users': JSON.stringify(currentUsers),
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Stats fetched successfully:', response.data);
        setStats(response.data);
      } catch (err) { 
        console.error('Error fetching stats:', err);
        
        // Use actual users even in fallback
        const currentUsers = userManager.getAllUsers();
        
        setStats({
          totalPrompts: 0,
          avgRating: 0,
          ratedPromptsCount: 0,
          myPrompts: 0,
          sourcedPrompts: 0,
          totalUsage: 0,
          favoriteCount: 0,
          weekPrompts: 0,
          monthPrompts: 0,
          toolDistribution: [],
          categoryDistribution: [],
          weeklyActivity: Array.from({length: 7}, (_, i) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            prompts: 0,
            usage: 0
          })),
          recentActivity: []  // Empty if no data, will use real users when prompts exist
        });
      }
      finally { 
        setLoading(false); 
      }
    };
    fetchStats();
  }, [timeFilter]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const weeklyGrowth = stats.weekPrompts > 0 ? Math.round((stats.weekPrompts / stats.totalPrompts) * 100) : 0;
  const totalUsageFormatted = stats.totalUsage > 999 ? `${(stats.totalUsage / 1000).toFixed(1)}k` : stats.totalUsage;
  const avgRatingFormatted = stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Prompts" 
            value={stats.totalPrompts.toLocaleString()} 
            icon={FileText} 
            gradient="bg-gradient-to-r from-blue-600 to-blue-700"
            trend={stats.weekPrompts > 0 ? "up" : "neutral"}
            trendValue={stats.weekPrompts > 0 ? `+${weeklyGrowth}%` : "No change"}
            subtitle={`${stats.weekPrompts} added this week`}
          />
          <StatCard 
            title="Average Rating" 
            value={`${avgRatingFormatted} ★`} 
            icon={Star} 
            gradient="bg-gradient-to-r from-amber-500 to-orange-600"
            trend={stats.avgRating >= 4 ? "up" : stats.avgRating >= 3 ? "neutral" : "down"}
            trendValue={stats.avgRating >= 4 ? "Excellent" : stats.avgRating >= 3 ? "Good" : "Needs work"}
            subtitle={`Based on ${stats.ratedPromptsCount} ratings`}
          />
          <StatCard 
            title="My Prompts" 
            value={stats.myPrompts.toLocaleString()} 
            icon={Brain} 
            gradient="bg-gradient-to-r from-purple-600 to-purple-700"
            trend={stats.myPrompts > stats.sourcedPrompts ? "up" : "neutral"}
            trendValue={`vs ${stats.sourcedPrompts} sourced`}
            subtitle="Created by you"
          />
          <StatCard 
            title="Total Usage" 
            value={totalUsageFormatted} 
            icon={TrendingUp} 
            gradient="bg-gradient-to-r from-green-600 to-green-700"
            trend="up"
            trendValue={`${stats.favoriteCount} favorites`}
            subtitle="Total copies made"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickActionCard 
              title="Create Prompt"
              description="Start building a new prompt"
              icon={FileText}
              color="bg-blue-500"
              onClick={() => window.location.href = '/create'}
            />
            <QuickActionCard 
              title="Browse Library"
              description="Explore existing prompts"
              icon={Zap}
              color="bg-purple-500"
              onClick={() => window.location.href = '/library'}
            />
            <QuickActionCard 
              title="View Analytics"
              description="See detailed insights"
              icon={Award}
              color="bg-green-500"
              onClick={() => setShowAnalytics(true)}
            />
            <QuickActionCard 
              title="Manage Tools"
              description="Configure AI tools"
              icon={Users}
              color="bg-orange-500"
              onClick={() => window.location.href = '/admin/tools'}
            />
          </div>
        </div>

        {/* Charts */}
        {stats.totalPrompts > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Prompts Created</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Usage Count</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={stats.weeklyActivity}>
                  <defs>
                    <linearGradient id="promptsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Area type="monotone" dataKey="prompts" stroke="#3B82F6" fillOpacity={1} fill="url(#promptsGradient)" strokeWidth={3} />
                  <Area type="monotone" dataKey="usage" stroke="#8B5CF6" fillOpacity={1} fill="url(#usageGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {stats.toolDistribution.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Tools</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats.toolDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={2}
                    >
                      {stats.toolDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {stats.toolDistribution.slice(0, 3).map((tool, index) => (
                    <div key={tool.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tool.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{tool.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{tool.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {stats.categoryDistribution.length > 0 && (
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.categoryDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {stats.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
            </div>
            {stats.totalPrompts > 0 ? (
              <div className="space-y-1">
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.slice(0, 4).map((activity, index) => (
                    <ActivityItem key={activity.id || index} {...activity} />
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No recent activity found</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No prompts yet</h4>
                <p className="text-gray-500 mb-4">Start by creating your first prompt to see activity here.</p>
                <button 
                  onClick={() => window.location.href = '/create'}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  Create First Prompt
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {stats.totalPrompts === 0 && (
          <div className="mt-12 text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain size={32} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Prompt Manager!</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Your prompt library is empty. Start building your collection by creating your first prompt, 
              or explore the admin section to set up AI tools and categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/create'}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FileText size={20} className="mr-2" />
                Create Your First Prompt
              </button>
              <button 
                onClick={() => window.location.href = '/admin/tools'}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Users size={20} className="mr-2" />
                Setup AI Tools
              </button>
            </div>
          </div>
        )}
      </div>

      <AnalyticsModal 
        isOpen={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
        stats={stats} 
      />
    </div>
  );
};

export default DashboardPage;