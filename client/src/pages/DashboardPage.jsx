import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Star, Zap, Brain } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, bgColor, change }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm flex items-start justify-between border border-gray-200 hover:shadow-lg transition-shadow duration-300">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      {change && <p className="text-xs text-green-500 mt-1">{change}</p>}
    </div>
    <div className={`p-2 rounded-lg ${bgColor}`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats');
        setStats(response.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div className="p-8 text-center">Loading Dashboard...</div>;

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-gray-500">Here's a snapshot of your prompt library's performance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Prompts" value={stats.totalPrompts} icon={FileText} color="text-blue-600" bgColor="bg-blue-100" change="+5 this week" />
        <StatCard title="Average Rating" value={`${stats.avgRating} ★`} icon={Star} color="text-yellow-600" bgColor="bg-yellow-100" change="+0.1 from last week" />
        <StatCard title="Top Tool" value={stats.toolDistribution[0]?.name || 'N/A'} icon={Zap} color="text-indigo-600" bgColor="bg-indigo-100" />
        <StatCard title="Top Category" value={stats.categoryDistribution[0]?.name || 'N/A'} icon={Brain} color="text-green-600" bgColor="bg-green-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Tool Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.toolDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false}/>
              <Tooltip cursor={{fill: 'rgba(79, 70, 229, 0.05)'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}/>
              <Bar dataKey="count" name="Prompts" radius={[4, 4, 0, 0]}>
                {stats.toolDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.categoryDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5}>
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}/>
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;