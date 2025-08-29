import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MonitoringDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const refreshOptions = [
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' }
  ];

  // Mock performance data
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, requests: 120, errors: 2 },
    { time: '01:00', cpu: 52, memory: 65, requests: 98, errors: 1 },
    { time: '02:00', cpu: 48, memory: 68, requests: 156, errors: 3 },
    { time: '03:00', cpu: 41, memory: 64, requests: 89, errors: 0 },
    { time: '04:00', cpu: 38, memory: 61, requests: 67, errors: 1 },
    { time: '05:00', cpu: 44, memory: 66, requests: 134, errors: 2 }
  ];

  const userActivityData = [
    { time: '00:00', active: 12, logins: 3, logouts: 8 },
    { time: '01:00', active: 8, logins: 2, logouts: 6 },
    { time: '02:00', active: 24, logins: 18, logouts: 2 },
    { time: '03:00', active: 31, logins: 12, logouts: 5 },
    { time: '04:00', active: 28, logins: 8, logouts: 11 },
    { time: '05:00', active: 19, logins: 4, logouts: 13 }
  ];

  const storageData = [
    { name: 'Database', value: 2400, color: '#2563EB' },
    { name: 'File Uploads', value: 1800, color: '#0EA5E9' },
    { name: 'Backups', value: 3200, color: '#059669' },
    { name: 'Logs', value: 800, color: '#D97706' },
    { name: 'Cache', value: 400, color: '#DC2626' }
  ];

  const errorRateData = [
    { time: '00:00', rate: 0.2 },
    { time: '01:00', rate: 0.1 },
    { time: '02:00', rate: 0.3 },
    { time: '03:00', rate: 0.0 },
    { time: '04:00', rate: 0.1 },
    { time: '05:00', rate: 0.2 }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High Memory Usage',
      message: 'System memory usage has exceeded 65% threshold',
      timestamp: '2025-08-28 02:20:00',
      acknowledged: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Backup Completed',
      message: 'Scheduled backup completed successfully',
      timestamp: '2025-08-28 02:00:00',
      acknowledged: true
    },
    {
      id: 3,
      type: 'error',
      title: 'API Connection Failed',
      message: 'Failed to connect to Midjourney API endpoint',
      timestamp: '2025-08-27 18:30:00',
      acknowledged: false
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertBg = (type) => {
    switch (type) {
      case 'error': return 'bg-error/10';
      case 'warning': return 'bg-warning/10';
      case 'info': return 'bg-accent/10';
      default: return 'bg-muted/10';
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleAcknowledgeAlert = (alertId) => {
    console.log(`Acknowledging alert ${alertId}`);
    // Alert acknowledgment implementation
  };

  const handleRefreshData = () => {
    setLastUpdated(new Date());
    console.log('Refreshing monitoring data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">System Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Real-time system performance and health monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              className="w-32"
            />
            <Select
              options={refreshOptions}
              value={refreshInterval}
              onChange={setRefreshInterval}
              className="w-32"
            />
          </div>
          <Button 
            variant="outline" 
            iconName="RefreshCw" 
            iconPosition="left"
            onClick={handleRefreshData}
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Last Updated Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon name="Clock" size={14} />
        <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span>Live</span>
      </div>
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Cpu" size={20} className="text-primary" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">48%</div>
              <div className="text-xs text-success">+2% from last hour</div>
            </div>
          </div>
          <div className="text-sm font-medium text-foreground mb-1">CPU Usage</div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '48%' }} />
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="MemoryStick" size={20} className="text-warning" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">68%</div>
              <div className="text-xs text-warning">+5% from last hour</div>
            </div>
          </div>
          <div className="text-sm font-medium text-foreground mb-1">Memory Usage</div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-warning h-2 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-success" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">156</div>
              <div className="text-xs text-success">+12 from last hour</div>
            </div>
          </div>
          <div className="text-sm font-medium text-foreground mb-1">Requests/Hour</div>
          <div className="text-xs text-muted-foreground">Average response: 245ms</div>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">0.2%</div>
              <div className="text-xs text-success">-0.1% from last hour</div>
            </div>
          </div>
          <div className="text-sm font-medium text-foreground mb-1">Error Rate</div>
          <div className="text-xs text-muted-foreground">3 errors in last hour</div>
        </div>
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Performance Metrics</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-xs text-muted-foreground">CPU</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-warning rounded-full" />
                <span className="text-xs text-muted-foreground">Memory</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="cpu" stroke="var(--color-primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="memory" stroke="var(--color-warning)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">User Activity</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span className="text-xs text-muted-foreground">Logins</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="active" stackId="1" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="logins" stackId="2" stroke="var(--color-success)" fill="var(--color-success)" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Utilization */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h4 className="text-lg font-semibold text-foreground mb-4">Storage Utilization</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storageData?.map((entry, index) => (
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
            {storageData?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item?.color }} />
                <span className="text-xs text-muted-foreground">{item?.name}</span>
                <span className="text-xs font-medium text-foreground ml-auto">{item?.value} MB</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Rate Trend */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h4 className="text-lg font-semibold text-foreground mb-4">Error Rate Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="rate" fill="var(--color-error)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* System Alerts */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">System Alerts</h4>
          <Button variant="outline" iconName="Settings" iconPosition="left">
            Alert Settings
          </Button>
        </div>
        
        <div className="space-y-3">
          {systemAlerts?.map((alert) => (
            <div key={alert?.id} className={`p-4 rounded-lg border ${alert?.acknowledged ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAlertBg(alert?.type)}`}>
                  <Icon name={getAlertIcon(alert?.type)} size={16} className={getAlertColor(alert?.type)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-foreground">{alert?.title}</h5>
                    <span className="text-xs text-muted-foreground">{alert?.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert?.message}</p>
                  {!alert?.acknowledged && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAcknowledgeAlert(alert?.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;