import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Users, Star, Clock, Download, Filter, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AnalyticsModal = ({ isOpen, onClose, stats }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'tools', label: 'AI Tools', icon: Users },
    { id: 'categories', label: 'Categories', icon: Filter },
    { id: 'performance', label: 'Performance', icon: Star }
  ];

  const performanceData = [
    { rating: '5 Stars', count: 234, percentage: 32 },
    { rating: '4 Stars', count: 187, percentage: 25 },
    { rating: '3 Stars', count: 145, percentage: 20 },
    { rating: '2 Stars', count: 98, percentage: 13 },
    { rating: '1 Star', count: 78, percentage: 10 }
  ];

  const usageOverTime = [
    { month: 'Jan', prompts: 145, usage: 320 },
    { month: 'Feb', prompts: 167, usage: 389 },
    { month: 'Mar', prompts: 189, usage: 445 },
    { month: 'Apr', prompts: 234, usage: 567 },
    { month: 'May', prompts: 278, usage: 678 },
    { month: 'Jun', prompts: 312, usage: 789 }
  ];

  const topPerformers = [
    { name: 'Blog Content Generator', rating: 4.9, usage: 245 },
    { name: 'Code Review Assistant', rating: 4.8, usage: 198 },
    { name: 'Marketing Copy Creator', rating: 4.7, usage: 167 },
    { name: 'Data Analysis Helper', rating: 4.6, usage: 134 },
    { name: 'Creative Writing Prompt', rating: 4.5, usage: 112 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Advanced Analytics</h2>
            <p className="text-blue-100 mt-1">Deep insights into your prompt library performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <Download size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Tabs */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Usage Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={usageOverTime}>
                        <defs>
                          <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="usage" stroke="#3B82F6" fillOpacity={1} fill="url(#usageGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Performing Prompts</h3>
                    <div className="space-y-3">
                      {topPerformers.map((prompt, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{prompt.name}</p>
                            <p className="text-sm text-gray-500">{prompt.usage} uses</p>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Star size={16} fill="currentColor" />
                            <span className="font-medium">{prompt.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">AI Tools Analysis</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold mb-4">Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats?.toolDistribution || []}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={40}
                        >
                          {stats?.toolDistribution?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold mb-4">Usage Statistics</h4>
                    <div className="space-y-4">
                      {stats?.toolDistribution?.map((tool, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: tool.color }}
                            ></div>
                            <span className="font-medium">{tool.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{tool.count}</p>
                            <p className="text-xs text-gray-500">
                              {((tool.count / (stats?.totalPrompts || 1)) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Category Analysis</h3>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats?.categoryDistribution || []}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {stats?.categoryDistribution?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Performance Metrics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold mb-4">Rating Distribution</h4>
                    <div className="space-y-3">
                      {performanceData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.rating}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold mb-4">Quality Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-800">High Quality (4+ stars)</span>
                        <span className="font-bold text-green-600">57%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-800">Average Quality (3-4 stars)</span>
                        <span className="font-bold text-blue-600">33%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="font-medium text-red-800">Needs Improvement (&lt;3 stars)</span>
                        <span className="font-bold text-red-600">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;