import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import Header from '../../components/ui/Header';
import UserManagementPanel from './components/UserManagementPanel';
import SystemConfigurationPanel from './components/SystemConfigurationPanel';
import IntegrationManagementPanel from './components/IntegrationManagementPanel';
import SecurityPoliciesPanel from './components/SecurityPoliciesPanel';
import MonitoringDashboard from './components/MonitoringDashboard';

const SystemAdministrationConfiguration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock current user with admin role
  const currentUser = {
    role: 'admin',
    name: 'System Administrator',
    email: 'admin@company.com'
  };

  const adminTabs = [
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      description: 'Manage user accounts, roles, and permissions',
      component: UserManagementPanel
    },
    {
      id: 'system',
      label: 'System Configuration',
      icon: 'Settings',
      description: 'Configure system settings and performance',
      component: SystemConfigurationPanel
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'Plug',
      description: 'Manage API connections and external services',
      component: IntegrationManagementPanel
    },
    {
      id: 'security',
      label: 'Security Policies',
      icon: 'Shield',
      description: 'Configure security settings and audit trails',
      component: SecurityPoliciesPanel
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: 'Activity',
      description: 'System performance and health monitoring',
      component: MonitoringDashboard
    }
  ];

  const handleSearch = (query) => {
    console.log('Searching administration:', query);
    // Search implementation
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleKeyboardShortcut = (e) => {
    if (e?.ctrlKey || e?.metaKey) {
      switch (e?.key) {
        case '1':
          e?.preventDefault();
          setActiveTab('users');
          break;
        case '2':
          e?.preventDefault();
          setActiveTab('system');
          break;
        case '3':
          e?.preventDefault();
          setActiveTab('integrations');
          break;
        case '4':
          e?.preventDefault();
          setActiveTab('security');
          break;
        case '5':
          e?.preventDefault();
          setActiveTab('monitoring');
          break;
        default:
          break;
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  // Check if user has admin role
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={32} className="text-error" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need administrator privileges to access this section.
          </p>
          <Button onClick={() => navigate('/prompt-library-dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const ActiveComponent = adminTabs?.find(tab => tab?.id === activeTab)?.component || UserManagementPanel;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="flex">
        <SidebarNavigation
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentUser={currentUser}
        />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Header
            currentUser={currentUser}
            onSearch={handleSearch}
            showSearch={true}
          />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">System Administration</h1>
                    <p className="text-muted-foreground">
                      Comprehensive administrative control center for system management
                    </p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-3 mt-4">
                  <Button variant="outline" iconName="Download" iconPosition="left">
                    Export System Report
                  </Button>
                  <Button variant="outline" iconName="RefreshCw" iconPosition="left">
                    Refresh All Data
                  </Button>
                  <Button variant="default" iconName="Settings" iconPosition="left">
                    System Settings
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="border-b border-border">
                  <nav className="flex space-x-8 overflow-x-auto">
                    {adminTabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => handleTabChange(tab?.id)}
                        className={`
                          flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                          transition-colors duration-150
                          ${activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                          }
                        `}
                      >
                        <Icon name={tab?.icon} size={16} />
                        {tab?.label}
                        <span className="hidden lg:inline text-xs text-muted-foreground ml-1">
                          (⌘{adminTabs?.indexOf(tab) + 1})
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
                
                {/* Tab Description */}
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {adminTabs?.find(tab => tab?.id === activeTab)?.description}
                  </p>
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-card border border-border rounded-lg p-6">
                <ActiveComponent />
              </div>

              {/* Emergency Actions */}
              <div className="mt-8 p-6 bg-error/5 border border-error/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
                    <Icon name="AlertTriangle" size={16} className="text-error" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Emergency Actions</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Critical system operations that require immediate attention or emergency response.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="destructive" iconName="Power" iconPosition="left">
                    Emergency Shutdown
                  </Button>
                  <Button variant="outline" iconName="RotateCcw" iconPosition="left">
                    System Restart
                  </Button>
                  <Button variant="outline" iconName="Database" iconPosition="left">
                    Force Backup
                  </Button>
                  <Button variant="outline" iconName="Users" iconPosition="left">
                    Logout All Users
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SystemAdministrationConfiguration;