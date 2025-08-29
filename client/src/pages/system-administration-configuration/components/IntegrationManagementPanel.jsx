import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';

const IntegrationManagementPanel = () => {
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showApiModal, setShowApiModal] = useState(false);

  const integrations = [
    {
      id: 1,
      name: 'OpenAI GPT-4',
      type: 'AI Model',
      status: 'connected',
      lastSync: '2025-08-28 02:20:00',
      requests: 1247,
      rateLimit: '3000/hour',
      endpoint: 'https://api.openai.com/v1',
      icon: 'Brain',
      description: 'Primary language model for prompt generation'
    },
    {
      id: 2,
      name: 'Claude API',
      type: 'AI Model',
      status: 'connected',
      lastSync: '2025-08-28 02:15:00',
      requests: 892,
      rateLimit: '2000/hour',
      endpoint: 'https://api.anthropic.com/v1',
      icon: 'MessageSquare',
      description: 'Alternative language model for content creation'
    },
    {
      id: 3,
      name: 'Midjourney',
      type: 'Image Generation',
      status: 'error',
      lastSync: '2025-08-27 18:30:00',
      requests: 156,
      rateLimit: '500/day',
      endpoint: 'https://api.midjourney.com/v1',
      icon: 'Image',
      description: 'AI image generation service'
    },
    {
      id: 4,
      name: 'Google Drive',
      type: 'Storage',
      status: 'connected',
      lastSync: '2025-08-28 01:45:00',
      requests: 234,
      rateLimit: '10000/day',
      endpoint: 'https://www.googleapis.com/drive/v3',
      icon: 'Cloud',
      description: 'Cloud storage for prompt backups'
    },
    {
      id: 5,
      name: 'Slack Notifications',
      type: 'Communication',
      status: 'disconnected',
      lastSync: '2025-08-25 14:20:00',
      requests: 45,
      rateLimit: '1000/hour',
      endpoint: 'https://hooks.slack.com/services',
      icon: 'MessageCircle',
      description: 'Team notifications and alerts'
    }
  ];

  const apiKeys = [
    {
      id: 1,
      name: 'OpenAI Production',
      service: 'OpenAI GPT-4',
      created: '2025-07-15',
      lastUsed: '2025-08-28 02:20:00',
      status: 'active',
      permissions: ['read', 'write']
    },
    {
      id: 2,
      name: 'Claude Development',
      service: 'Claude API',
      created: '2025-07-20',
      lastUsed: '2025-08-28 02:15:00',
      status: 'active',
      permissions: ['read']
    },
    {
      id: 3,
      name: 'Midjourney Beta',
      service: 'Midjourney',
      created: '2025-08-01',
      lastUsed: '2025-08-27 18:30:00',
      status: 'expired',
      permissions: ['read', 'write']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-success text-success-foreground';
      case 'error': return 'bg-error text-error-foreground';
      case 'disconnected': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'error': return 'XCircle';
      case 'disconnected': return 'Circle';
      default: return 'Circle';
    }
  };

  const handleTestConnection = (integration) => {
    console.log(`Testing connection for ${integration?.name}...`);
    // Connection test implementation
  };

  const handleConfigureIntegration = (integration) => {
    setSelectedIntegration(integration);
    setShowApiModal(true);
  };

  const handleToggleIntegration = (integrationId) => {
    console.log(`Toggling integration ${integrationId}`);
    // Toggle integration implementation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Integration Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage API connections, rate limits, and external service integrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" iconName="RefreshCw" iconPosition="left">
            Sync All
          </Button>
          <Button variant="default" iconName="Plus" iconPosition="left">
            Add Integration
          </Button>
        </div>
      </div>
      {/* Integration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {integrations?.filter(i => i?.status === 'connected')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="XCircle" size={20} className="text-error" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {integrations?.filter(i => i?.status === 'error')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {integrations?.reduce((sum, i) => sum + i?.requests, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {integrations?.filter(i => {
                  const lastSync = new Date(i.lastSync);
                  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
                  return lastSync > hourAgo;
                })?.length}
              </div>
              <div className="text-sm text-muted-foreground">Recent Syncs</div>
            </div>
          </div>
        </div>
      </div>
      {/* Integrations List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold text-foreground">Active Integrations</h4>
        </div>
        <div className="divide-y divide-border">
          {integrations?.map((integration) => (
            <div key={integration?.id} className="p-4 hover:bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                    <Icon name={integration?.icon} size={24} className="text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h5 className="font-medium text-foreground">{integration?.name}</h5>
                      <span className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(integration?.status)}`}>
                        <Icon name={getStatusIcon(integration?.status)} size={12} className="inline mr-1" />
                        {integration?.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{integration?.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Type: {integration?.type}</span>
                      <span>Requests: {integration?.requests}</span>
                      <span>Rate Limit: {integration?.rateLimit}</span>
                      <span>Last Sync: {new Date(integration.lastSync)?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="TestTube"
                    onClick={() => handleTestConnection(integration)}
                  >
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Settings"
                    onClick={() => handleConfigureIntegration(integration)}
                  >
                    Configure
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreHorizontal"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* API Keys Management */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h4 className="font-semibold text-foreground">API Keys</h4>
          <Button variant="outline" iconName="Key" iconPosition="left">
            Add API Key
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Name</th>
                <th className="text-left p-4 font-medium text-foreground">Service</th>
                <th className="text-left p-4 font-medium text-foreground">Created</th>
                <th className="text-left p-4 font-medium text-foreground">Last Used</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Permissions</th>
                <th className="text-right p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys?.map((key) => (
                <tr key={key?.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Key" size={16} className="text-muted-foreground" />
                      <span className="font-medium text-foreground">{key?.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{key?.service}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(key.created)?.toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(key.lastUsed)?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                      key?.status === 'active' ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'
                    }`}>
                      {key?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {key?.permissions?.map((permission) => (
                        <span 
                          key={permission}
                          className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" iconName="Edit" />
                      <Button variant="ghost" size="sm" iconName="Trash2" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Rate Limiting Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Gauge" size={16} className="text-warning" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Rate Limiting</h4>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Global Rate Limit (requests/hour)"
              type="number"
              value="5000"
              description="Maximum requests across all integrations"
            />
            
            <Input
              label="Per-User Rate Limit (requests/hour)"
              type="number"
              value="100"
              description="Maximum requests per individual user"
            />
            
            <Checkbox
              label="Enable rate limit notifications"
              description="Send alerts when approaching limits"
              checked
            />
            
            <Checkbox
              label="Auto-throttle on limit approach"
              description="Automatically reduce request frequency"
             
            />
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={16} className="text-accent" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Security Settings</h4>
          </div>
          
          <div className="space-y-4">
            <Input
              label="API Timeout (seconds)"
              type="number"
              value="30"
              description="Request timeout for external APIs"
            />
            
            <Input
              label="Retry Attempts"
              type="number"
              value="3"
              description="Number of retry attempts for failed requests"
            />
            
            <Checkbox
              label="Enable request logging"
              description="Log all API requests for audit purposes"
              checked
            />
            
            <Checkbox
              label="Validate SSL certificates"
              description="Enforce SSL certificate validation"
              checked
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationManagementPanel;