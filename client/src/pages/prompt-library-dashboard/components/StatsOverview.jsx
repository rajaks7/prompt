import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ stats = {} }) => {
  const mockStats = {
    totalPrompts: 1247,
    activePrompts: 1089,
    totalUsage: 15678,
    avgRating: 4.6,
    topPerformers: 234,
    recentActivity: 89,
    sharedPrompts: 456,
    myPrompts: 234,
    weeklyGrowth: 12.5,
    monthlyUsage: 3456,
    topTools: [
      { name: 'ChatGPT', count: 456, percentage: 36.6 },
      { name: 'Claude', count: 234, percentage: 18.8 },
      { name: 'Midjourney', count: 189, percentage: 15.2 },
      { name: 'Copilot', count: 156, percentage: 12.5 },
      { name: 'Gemini', count: 212, percentage: 17.0 }
    ],
    categoryDistribution: [
      { name: 'Content Creation', count: 345, percentage: 27.7 },
      { name: 'Code Generation', count: 289, percentage: 23.2 },
      { name: 'Data Analysis', count: 178, percentage: 14.3 },
      { name: 'Creative Writing', count: 234, percentage: 18.8 },
      { name: 'Research', count: 201, percentage: 16.1 }
    ]
  };

  const currentStats = { ...mockStats, ...stats };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend, 
    trendValue, 
    color = 'text-primary',
    bgColor = 'bg-primary/10' 
  }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon name={icon} size={20} className={color} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-xs
                         ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground'}`}>
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={12} 
            />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? value?.toLocaleString() : value}
        </div>
        <div className="text-sm text-muted-foreground">
          {title}
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, total, color = 'bg-primary' }) => {
    const percentage = (value / total) * 100;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground font-medium">{label}</span>
          <span className="text-muted-foreground">{value}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Prompts"
          value={currentStats?.totalPrompts}
          icon="FileText"
          trend="up"
          trendValue="+12.5%"
          color="text-primary"
          bgColor="bg-primary/10"
        />
        
        <StatCard
          title="Active Prompts"
          value={currentStats?.activePrompts}
          icon="Activity"
          trend="up"
          trendValue="+8.3%"
          color="text-success"
          bgColor="bg-success/10"
        />
        
        <StatCard
          title="Total Usage"
          value={currentStats?.totalUsage}
          icon="BarChart3"
          trend="up"
          trendValue="+15.7%"
          color="text-accent"
          bgColor="bg-accent/10"
        />
        
        <StatCard
          title="Average Rating"
          value={currentStats?.avgRating}
          icon="Star"
          trend="up"
          trendValue="+0.2"
          color="text-warning"
          bgColor="bg-warning/10"
        />
      </div>
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Top Performers"
          value={currentStats?.topPerformers}
          icon="Trophy"
          trend={null}
          trendValue={null}
          color="text-warning"
          bgColor="bg-warning/10"
        />
        
        <StatCard
          title="Recent Activity"
          value={currentStats?.recentActivity}
          icon="Clock"
          trend={null}
          trendValue={null}
          color="text-accent"
          bgColor="bg-accent/10"
        />
        
        <StatCard
          title="Shared Prompts"
          value={currentStats?.sharedPrompts}
          icon="Users"
          trend={null}
          trendValue={null}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        
        <StatCard
          title="My Prompts"
          value={currentStats?.myPrompts}
          icon="User"
          trend={null}
          trendValue={null}
          color="text-secondary"
          bgColor="bg-secondary/10"
        />
      </div>
      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Tool Distribution</h3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {currentStats?.topTools?.map((tool, index) => (
              <ProgressBar
                key={tool?.name}
                label={tool?.name}
                value={tool?.count}
                total={currentStats?.totalPrompts}
                color={[
                  'bg-green-500',
                  'bg-orange-500', 
                  'bg-purple-500',
                  'bg-blue-500',
                  'bg-indigo-500'
                ]?.[index]}
              />
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Category Distribution</h3>
            <Icon name="BarChart" size={20} className="text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {currentStats?.categoryDistribution?.map((category, index) => (
              <ProgressBar
                key={category?.name}
                label={category?.name}
                value={category?.count}
                total={currentStats?.totalPrompts}
                color={[
                  'bg-primary',
                  'bg-accent',
                  'bg-success',
                  'bg-warning',
                  'bg-secondary'
                ]?.[index]}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Quick Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <div>
              <div className="text-sm font-medium text-foreground">Growing Usage</div>
              <div className="text-xs text-muted-foreground">
                +{currentStats?.weeklyGrowth}% this week
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
            <Icon name="Users" size={16} className="text-primary" />
            <div>
              <div className="text-sm font-medium text-foreground">Team Collaboration</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((currentStats?.sharedPrompts / currentStats?.totalPrompts) * 100)}% prompts shared
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-warning/10 rounded-lg">
            <Icon name="Star" size={16} className="text-warning" />
            <div>
              <div className="text-sm font-medium text-foreground">Quality Score</div>
              <div className="text-xs text-muted-foreground">
                {currentStats?.avgRating}/5.0 average rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;