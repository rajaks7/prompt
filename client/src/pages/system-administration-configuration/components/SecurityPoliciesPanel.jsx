import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecurityPoliciesPanel = () => {
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [enableTwoFactor, setEnableTwoFactor] = useState(true);
  const [enableAuditLog, setEnableAuditLog] = useState(true);

  const passwordComplexityOptions = [
    { value: 'low', label: 'Low - Letters only' },
    { value: 'medium', label: 'Medium - Letters and numbers' },
    { value: 'high', label: 'High - Letters, numbers, and symbols' },
    { value: 'strict', label: 'Strict - All requirements + length' }
  ];

  const encryptionOptions = [
    { value: 'aes128', label: 'AES-128' },
    { value: 'aes256', label: 'AES-256' },
    { value: 'rsa2048', label: 'RSA-2048' },
    { value: 'rsa4096', label: 'RSA-4096' }
  ];

  const auditEvents = [
    {
      id: 1,
      timestamp: '2025-08-28 02:25:30',
      user: 'admin@company.com',
      action: 'User Role Changed',
      details: 'Changed user role from Editor to Manager for emily.rodriguez@company.com',
      severity: 'medium',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2025-08-28 02:20:15',
      user: 'sarah.johnson@company.com',
      action: 'Failed Login Attempt',
      details: 'Multiple failed login attempts detected',
      severity: 'high',
      ip: '203.0.113.45'
    },
    {
      id: 3,
      timestamp: '2025-08-28 02:15:00',
      user: 'system',
      action: 'Security Policy Updated',
      details: 'Password complexity requirements changed to High',
      severity: 'low',
      ip: 'localhost'
    },
    {
      id: 4,
      timestamp: '2025-08-28 02:10:45',
      user: 'michael.chen@company.com',
      action: 'Data Export',
      details: 'Exported user management report (CSV format)',
      severity: 'medium',
      ip: '192.168.1.105'
    },
    {
      id: 5,
      timestamp: '2025-08-28 02:05:20',
      user: 'admin@company.com',
      action: 'Integration Added',
      details: 'Added new API integration for Slack notifications',
      severity: 'low',
      ip: '192.168.1.100'
    }
  ];

  const securityMetrics = [
    {
      label: 'Active Sessions',
      value: '24',
      status: 'healthy',
      icon: 'Users',
      description: 'Currently logged in users'
    },
    {
      label: 'Failed Logins (24h)',
      value: '7',
      status: 'warning',
      icon: 'AlertTriangle',
      description: 'Failed authentication attempts'
    },
    {
      label: 'Security Violations',
      value: '2',
      status: 'error',
      icon: 'Shield',
      description: 'Policy violations detected'
    },
    {
      label: 'Audit Events',
      value: '156',
      status: 'healthy',
      icon: 'FileText',
      description: 'Events logged today'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-error text-error-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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

  const handleExportAuditLog = () => {
    console.log('Exporting audit log...');
    // Export audit log implementation
  };

  const handleRunSecurityScan = () => {
    console.log('Running security scan...');
    // Security scan implementation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Security Policies</h3>
          <p className="text-sm text-muted-foreground">
            Configure security settings, audit trails, and compliance policies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            iconName="Download" 
            iconPosition="left"
            onClick={handleExportAuditLog}
          >
            Export Audit Log
          </Button>
          <Button 
            variant="default" 
            iconName="Shield" 
            iconPosition="left"
            onClick={handleRunSecurityScan}
          >
            Security Scan
          </Button>
        </div>
      </div>
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics?.map((metric, index) => (
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
      {/* Security Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Policies */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Lock" size={16} className="text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Authentication Policies</h4>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Minimum Password Length"
              type="number"
              value={passwordMinLength}
              onChange={(e) => setPasswordMinLength(e?.target?.value)}
              description="Minimum number of characters required"
            />
            
            <Select
              label="Password Complexity"
              options={passwordComplexityOptions}
              value="high"
              onChange={() => {}}
            />
            
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e?.target?.value)}
              description="Automatic logout after inactivity"
            />
            
            <Input
              label="Max Login Attempts"
              type="number"
              value={maxLoginAttempts}
              onChange={(e) => setMaxLoginAttempts(e?.target?.value)}
              description="Account lockout after failed attempts"
            />
            
            <Checkbox
              label="Enable Two-Factor Authentication"
              description="Require 2FA for all user accounts"
              checked={enableTwoFactor}
              onChange={(e) => setEnableTwoFactor(e?.target?.checked)}
            />
            
            <Checkbox
              label="Force password reset on first login"
              description="Require users to change default passwords"
              checked
            />
          </div>
        </div>

        {/* Encryption & Data Protection */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Key" size={16} className="text-accent" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Encryption & Data Protection</h4>
          </div>
          
          <div className="space-y-4">
            <Select
              label="Data Encryption Standard"
              options={encryptionOptions}
              value="aes256"
              onChange={() => {}}
            />
            
            <Input
              label="Key Rotation Period (days)"
              type="number"
              value="90"
              description="Automatic encryption key rotation"
            />
            
            <Checkbox
              label="Encrypt data at rest"
              description="Encrypt all stored data in database"
              checked
            />
            
            <Checkbox
              label="Encrypt data in transit"
              description="Force HTTPS for all communications"
              checked
            />
            
            <Checkbox
              label="Enable data masking"
              description="Mask sensitive data in logs and exports"
              checked
            />
            
            <Checkbox
              label="Secure file uploads"
              description="Scan uploaded files for malware"
              checked
            />
          </div>
        </div>
      </div>
      {/* Audit Trail Configuration */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={16} className="text-warning" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Audit Trail Configuration</h4>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              label="Enable audit logging"
              checked={enableAuditLog}
              onChange={(e) => setEnableAuditLog(e?.target?.checked)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <Input
              label="Log Retention (days)"
              type="number"
              value="365"
              description="How long to keep audit logs"
            />
          </div>
          <div>
            <Select
              label="Log Level"
              options={[
                { value: 'all', label: 'All Events' },
                { value: 'security', label: 'Security Events Only' },
                { value: 'critical', label: 'Critical Events Only' }
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
          <div>
            <Checkbox
              label="Real-time alerts"
              description="Send immediate notifications for security events"
              checked
            />
          </div>
        </div>

        {/* Recent Audit Events */}
        <div>
          <h5 className="font-medium text-foreground mb-3">Recent Security Events</h5>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {auditEvents?.map((event) => (
              <div key={event?.id} className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  event?.severity === 'high' ? 'bg-error' : 
                  event?.severity === 'medium' ? 'bg-warning' : 'bg-success'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{event?.action}</span>
                      <span className={`px-1.5 py-0.5 text-xs rounded-md ${getSeverityColor(event?.severity)}`}>
                        {event?.severity?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{event?.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{event?.details}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>User: {event?.user}</span>
                    <span>IP: {event?.ip}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" iconName="ExternalLink" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Compliance & Reporting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Compliance Settings</h4>
          </div>
          
          <div className="space-y-4">
            <Checkbox
              label="GDPR Compliance"
              description="Enable GDPR data protection features"
              checked
            />
            
            <Checkbox
              label="SOC 2 Compliance"
              description="Enable SOC 2 security controls"
              checked
            />
            
            <Checkbox
              label="HIPAA Compliance"
              description="Enable healthcare data protection"
             
            />
            
            <Checkbox
              label="PCI DSS Compliance"
              description="Enable payment card data security"
             
            />
            
            <div className="pt-4 border-t border-border">
              <Button variant="outline" fullWidth iconName="FileText" iconPosition="left">
                Generate Compliance Report
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={16} className="text-error" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Security Alerts</h4>
          </div>
          
          <div className="space-y-4">
            <Checkbox
              label="Failed login notifications"
              description="Alert on multiple failed login attempts"
              checked
            />
            
            <Checkbox
              label="Privilege escalation alerts"
              description="Alert on role or permission changes"
              checked
            />
            
            <Checkbox
              label="Data export notifications"
              description="Alert on bulk data exports"
              checked
            />
            
            <Checkbox
              label="Unusual activity detection"
              description="Alert on anomalous user behavior"
             
            />
            
            <div className="pt-4 border-t border-border">
              <Input
                label="Alert Email Recipients"
                type="email"
                placeholder="security@company.com"
                description="Email addresses for security notifications"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPoliciesPanel;