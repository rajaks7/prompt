import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SearchAnalytics = ({ isOpen, onClose }) => {
  // Mock analytics data
  const popularQueries = [
    { query: 'ChatGPT creative writing', count: 156, trend: '+12%' },
    { query: 'code generation prompts', count: 134, trend: '+8%' },
    { query: 'marketing copy templates', count: 98, trend: '+15%' },
    { query: 'image generation styles', count: 87, trend: '+5%' },
    { query: 'data analysis prompts', count: 76, trend: '+22%' },
    { query: 'content creation ideas', count: 65, trend: '-3%' },
    { query: 'technical documentation', count: 54, trend: '+7%' },
    { query: 'social media posts', count: 43, trend: '+18%' }
  ];

  const searchTrends = [
    { month: 'Jan', searches: 1240 },
    { month: 'Feb', searches: 1456 },
    { month: 'Mar', searches: 1789 },
    { month: 'Apr', searches: 2134 },
    { month: 'May', searches: 2456 },
    { month: 'Jun', searches: 2789 },
    { month: 'Jul', searches: 3012 },
    { month: 'Aug', searches: 3234 }
  ];

  const filterUsage = [
    { name: 'AI Tools', value: 45, color: '#2563EB' },
    { name: 'Content Types', value: 32, color: '#0EA5E9' },
    { name: 'Date Range', value: 28, color: '#059669' },
    { name: 'Tags', value: 22, color: '#D97706' },
    { name: 'Creators', value: 18, color: '#DC2626' },
    { name: 'Performance', value: 12, color: '#7C3AED' }
  ];

  const searchPatterns = [
    { pattern: 'Single keyword', percentage: 34, description: 'Users search with one term' },
    { pattern: 'Phrase search', percentage: 28, description: 'Quoted exact phrases' },
    { pattern: 'Multiple keywords', percentage: 22, description: '2-3 related terms' },
    { pattern: 'Advanced queries', percentage: 16, description: 'Boolean operators, regex' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-modal border border-border w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="BarChart3" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Search Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Insights into search patterns and optimization opportunities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Trends Chart */}
            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-4 flex items-center">
                <Icon name="TrendingUp" size={18} className="mr-2 text-primary" />
                Search Volume Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={searchTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--color-popover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="searches" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Filter Usage Distribution */}
            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-4 flex items-center">
                <Icon name="PieChart" size={18} className="mr-2 text-primary" />
                Filter Usage Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filterUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {filterUsage?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry?.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--color-popover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {filterUsage?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item?.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item?.name} ({item?.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Queries */}
            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-4 flex items-center">
                <Icon name="Search" size={18} className="mr-2 text-primary" />
                Most Popular Queries
              </h3>
              <div className="space-y-3">
                {popularQueries?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <span className="text-sm text-foreground font-mono truncate">
                          {item?.query}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-sm font-medium text-foreground">
                        {item?.count}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item?.trend?.startsWith('+') 
                          ? 'bg-success/10 text-success' :'bg-error/10 text-error'
                      }`}>
                        {item?.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Patterns */}
            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-4 flex items-center">
                <Icon name="Target" size={18} className="mr-2 text-primary" />
                Search Patterns
              </h3>
              <div className="space-y-4">
                {searchPatterns?.map((pattern, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {pattern?.pattern}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {pattern?.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pattern?.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pattern?.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="mt-6 bg-accent/10 rounded-lg p-4 border border-accent/20">
            <h3 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Lightbulb" size={18} className="mr-2 text-accent" />
              Optimization Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Search Experience</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Add auto-complete for top 20 queries</li>
                  <li>• Implement typo tolerance for common misspellings</li>
                  <li>• Create search templates for complex queries</li>
                  <li>• Add semantic search for better relevance</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Filter Optimization</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Promote AI Tools filter (most used)</li>
                  <li>• Add quick filter presets for common combinations</li>
                  <li>• Implement smart filter suggestions</li>
                  <li>• Add filter usage analytics tracking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">3,234</div>
              <div className="text-xs text-muted-foreground">Total Searches</div>
              <div className="text-xs text-success mt-1">+18% this month</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">2.4</div>
              <div className="text-xs text-muted-foreground">Avg. Searches/User</div>
              <div className="text-xs text-success mt-1">+5% this month</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">78%</div>
              <div className="text-xs text-muted-foreground">Search Success Rate</div>
              <div className="text-xs text-warning mt-1">-2% this month</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">1.8s</div>
              <div className="text-xs text-muted-foreground">Avg. Response Time</div>
              <div className="text-xs text-success mt-1">-0.2s improvement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAnalytics;