import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VersionControl = ({ 
  versions = [], 
  currentVersion, 
  onVersionSelect, 
  onCreateVersion,
  onDeleteVersion,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDiff, setShowDiff] = useState(null);

  // Mock version data if none provided
  const mockVersions = versions?.length > 0 ? versions : [
    {
      id: 'v1',
      version: '1.0',
      title: 'Initial prompt creation',
      content: `You are a helpful AI assistant. Please help the user with their request.\n\nProvide clear and concise responses.`,
      createdAt: new Date(Date.now() - 86400000 * 3)?.toISOString(),
      author: 'Current User',
      changes: 'Initial version',
      isCurrent: false
    },
    {
      id: 'v2',
      version: '1.1',
      title: 'Added context and examples',
      content: `You are a helpful AI assistant with expertise in problem-solving. Please help the user with their request.\n\nContext: The user may need detailed explanations.\n\nProvide clear and concise responses with examples when helpful.`,
      createdAt: new Date(Date.now() - 86400000 * 2)?.toISOString(),
      author: 'Current User',
      changes: 'Added context section and example requirement',
      isCurrent: false
    },
    {
      id: 'v3',
      version: '1.2',
      title: 'Enhanced with role definition',
      content: `You are a helpful AI assistant with expertise in problem-solving and clear communication. Please help the user with their request.\n\nContext: The user may need detailed explanations and step-by-step guidance.\n\nTask: Provide clear and concise responses with examples when helpful.\n\nFormat: Use bullet points for lists and numbered steps for procedures.`,
      createdAt: new Date(Date.now() - 86400000)?.toISOString(),
      author: 'Current User',
      changes: 'Enhanced role definition, added task and format sections',
      isCurrent: true
    }
  ];

  const sortedVersions = mockVersions?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const currentVersionData = sortedVersions?.find(v => v?.isCurrent) || sortedVersions?.[0];

  const handleCreateNewVersion = () => {
    const newVersion = {
      id: `v${Date.now()}`,
      version: `1.${sortedVersions?.length}`,
      title: 'New version',
      content: currentVersionData?.content || '',
      createdAt: new Date()?.toISOString(),
      author: 'Current User',
      changes: 'Manual version creation',
      isCurrent: false
    };
    
    if (onCreateVersion) {
      onCreateVersion(newVersion);
    }
  };

  const generateDiff = (oldContent, newContent) => {
    const oldLines = oldContent?.split('\n');
    const newLines = newContent?.split('\n');
    const diff = [];
    
    const maxLines = Math.max(oldLines?.length, newLines?.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines?.[i] || '';
      const newLine = newLines?.[i] || '';
      
      if (oldLine === newLine) {
        diff?.push({ type: 'unchanged', content: oldLine, lineNumber: i + 1 });
      } else if (oldLine && !newLine) {
        diff?.push({ type: 'removed', content: oldLine, lineNumber: i + 1 });
      } else if (!oldLine && newLine) {
        diff?.push({ type: 'added', content: newLine, lineNumber: i + 1 });
      } else {
        diff?.push({ type: 'removed', content: oldLine, lineNumber: i + 1 });
        diff?.push({ type: 'added', content: newLine, lineNumber: i + 1 });
      }
    }
    
    return diff;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">
            Version History
          </h3>
          <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
            {currentVersionData?.version}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            onClick={handleCreateNewVersion}
          >
            New Version
          </Button>
        </div>
      </div>
      {/* Current Version Info */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="GitBranch" size={16} className="text-primary" />
            <span className="font-medium text-foreground">
              Current: {currentVersionData?.title}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(currentVersionData?.createdAt)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentVersionData?.changes}
        </div>
      </div>
      {/* Version List */}
      {isExpanded && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">
            All Versions ({sortedVersions?.length})
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedVersions?.map((version, index) => (
              <div
                key={version?.id}
                className={`p-3 border rounded-lg transition-all duration-200
                           ${version?.isCurrent 
                             ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
                           }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                                   ${version?.isCurrent 
                                     ? 'bg-primary text-primary-foreground' 
                                     : 'bg-muted text-muted-foreground'
                                   }`}>
                      {version?.version}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {version?.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by {version?.author} • {formatDate(version?.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!version?.isCurrent && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="GitCompare"
                          onClick={() => setShowDiff(showDiff === version?.id ? null : version?.id)}
                          title="Show diff"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="RotateCcw"
                          onClick={() => onVersionSelect && onVersionSelect(version)}
                          title="Restore this version"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={() => onDeleteVersion && onDeleteVersion(version?.id)}
                          className="text-error hover:text-error"
                          title="Delete version"
                        />
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mb-2">
                  {version?.changes}
                </div>
                
                {/* Diff View */}
                {showDiff === version?.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs font-medium text-foreground mb-2">
                      Changes from current version:
                    </div>
                    <div className="bg-muted rounded-lg p-3 max-h-48 overflow-y-auto">
                      <div className="font-mono text-xs space-y-1">
                        {generateDiff(version?.content, currentVersionData?.content || '')?.map((line, idx) => (
                          <div
                            key={idx}
                            className={`px-2 py-1 rounded ${
                              line?.type === 'added' ? 'bg-success/20 text-success' :
                              line?.type === 'removed'? 'bg-error/20 text-error' : 'text-muted-foreground'
                            }`}
                          >
                            <span className="inline-block w-8 text-right mr-2 opacity-50">
                              {line?.lineNumber}
                            </span>
                            <span className="mr-2">
                              {line?.type === 'added' ? '+' : line?.type === 'removed' ? '-' : ' '}
                            </span>
                            {line?.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Version Control Tips */}
      <div className="p-3 bg-muted rounded-lg border border-border">
        <div className="text-sm font-medium text-foreground mb-2">
          Version Control Tips
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Create versions before major changes to track progress</div>
          <div>• Use descriptive titles to identify version purposes</div>
          <div>• Compare versions to see what changes improved results</div>
          <div>• Restore previous versions if new changes don't work well</div>
        </div>
      </div>
    </div>
  );
};

export default VersionControl;