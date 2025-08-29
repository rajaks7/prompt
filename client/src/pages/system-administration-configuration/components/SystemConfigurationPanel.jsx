import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SystemConfigurationPanel = () => {
  const [backupSchedule, setBackupSchedule] = useState('daily');
  const [retentionDays, setRetentionDays] = useState('30');
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const backupOptions = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily at 2:00 AM' },
    { value: 'weekly', label: 'Weekly on Sunday' },
    { value: 'monthly', label: 'Monthly on 1st' }
  ];

  const retentionOptions = [
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '90 Days' },
    { value: '365', label: '1 Year' }
  ];

  const systemMetrics = [
    {
      label: 'Database Size',
      value: '2.4 GB',
      status: 'healthy',
      icon: 'Database',
      description: 'Current database storage usage'
    },
    {
      label: 'Memory Usage',
      value: '68%',
      status: 'warning',
      icon: 'Cpu',
      description: 'System memory utilization'
    },
    {
      label: 'Disk Space',
      value: '45%',
      status: 'healthy',
      icon: 'HardDrive',
      description: 'Available storage space'
    },
    {
      label: 'Active Sessions',
      value: '24',
      status: 'healthy',
      icon: 'Users',
      description: 'Currently logged in users'
    }
  ];

  const recentBackups = [
    {
      id: 1,
      timestamp: '2025-08-28 02:00:00',
      size: '2.4 GB',
      status: 'completed',
      type: 'automatic'
    },
    {
      id: 2,
      timestamp: '2025-08-27 02:00:00',
      size: '2.3 GB',
      status: 'completed',
      type: 'automatic'
    },
    {
      id: 3,
      timestamp: '2025-08-26 14:30:00',
      size: '2.3 GB',
      status: 'completed',
      type: 'manual'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-error/10';
      default: return 'bg-muted/10';
    }
  };

  const handleRunBackup = () => {
    console.log('Running manual backup...');
    // Manual backup implementation
  };

  const handleOptimizeDatabase = () => {
    console.log('Optimizing database...');
    // Database optimization implementation
  };

  const handleClearCache = () => {
    console.log('Clearing system cache...');
    // Cache clearing implementation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">System Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Manage system settings, backups, and performance optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            iconName="Download" 
            iconPosition="left"
            onClick={handleRunBackup}
          >
            Run Backup
          </Button>
          <Button 
            variant="default" 
            iconName="Settings" 
            iconPosition="left"
          >
            Advanced Settings
          </Button>
        </div>
      </div>
      {/* System Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics?.map((metric, index) => (
          <div key={index} className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBg(metric?.status)}`}>
                <Icon name={metric?.icon} size={20} className={getStatusColor(metric?.status)} />
              </div>
              <div className={`w-2 h-2 rounded-full ${metric?.status === 'healthy' ? 'bg-success' : metric?.status === 'warning' ? 'bg-warning' : 'bg-error'}`} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
            <div className="text-sm font-medium text-foreground mb-1">{metric?.label}</div>
            <div className="text-xs text-muted-foreground">{metric?.description}</div>
          </div>
        ))}
      </div>
      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Configuration */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Archive" size={16} className="text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Backup Settings</h4>
          </div>
          
          <div className="space-y-4">
            <Select
              label="Backup Schedule"
              options={backupOptions}
              value={backupSchedule}
              onChange={setBackupSchedule}
            />
            
            <Select
              label="Retention Period"
              options={retentionOptions}
              value={retentionDays}
              onChange={setRetentionDays}
            />
            
            <Checkbox
              label="Enable automatic optimization"
              description="Optimize database during backup process"
              checked={autoOptimization}
              onChange={(e) => setAutoOptimization(e?.target?.checked)}
            />
            
            <div className="pt-4 border-t border-border">
              <h5 className="font-medium text-foreground mb-3">Recent Backups</h5>
              <div className="space-y-2">
                {recentBackups?.map((backup) => (
                  <div key={backup?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {new Date(backup.timestamp)?.toLocaleDateString()} {new Date(backup.timestamp)?.toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {backup?.size} • {backup?.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs bg-success text-success-foreground rounded-md">
                        {backup?.status}
                      </span>
                      <Button variant="ghost" size="sm" iconName="Download" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-accent" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Performance Settings</h4>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Max Concurrent Users"
              type="number"
              value="100"
              description="Maximum number of simultaneous users"
            />
            
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value="30"
              description="Automatic logout after inactivity"
            />
            
            <Checkbox
              label="Enable maintenance mode"
              description="Temporarily disable user access for maintenance"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e?.target?.checked)}
            />
            
            <div className="pt-4 border-t border-border">
              <h5 className="font-medium text-foreground mb-3">System Actions</h5>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  fullWidth 
                  iconName="Database" 
                  iconPosition="left"
                  onClick={handleOptimizeDatabase}
                >
                  Optimize Database
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  iconName="Trash2" 
                  iconPosition="left"
                  onClick={handleClearCache}
                >
                  Clear System Cache
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  iconName="RotateCcw" 
                  iconPosition="left"
                >
                  Restart Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* System Logs */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={16} className="text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">System Logs</h4>
          </div>
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export Logs
          </Button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { time: '2025-08-28 02:26:00', level: 'info', message: 'Automatic backup completed successfully' },
            { time: '2025-08-28 02:25:45', level: 'info', message: 'Database optimization started' },
            { time: '2025-08-28 02:20:00', level: 'warning', message: 'High memory usage detected (68%)' },
            { time: '2025-08-28 02:15:30', level: 'info', message: 'User session cleanup completed' },
            { time: '2025-08-28 02:10:00', level: 'error', message: 'Failed to connect to external API endpoint' }
          ]?.map((log, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                log?.level === 'error' ? 'bg-error' : 
                log?.level === 'warning' ? 'bg-warning' : 'bg-success'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">{log?.time}</span>
                  <span className={`px-1.5 py-0.5 text-xs rounded-md ${
                    log?.level === 'error' ? 'bg-error text-error-foreground' :
                    log?.level === 'warning' ? 'bg-warning text-warning-foreground' :
                    'bg-success text-success-foreground'
                  }`}>
                    {log?.level?.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-foreground">{log?.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurationPanel;