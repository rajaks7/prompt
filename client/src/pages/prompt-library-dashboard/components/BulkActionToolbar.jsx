import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionToolbar = ({ 
  selectedCount = 0,
  onBulkAction,
  onClearSelection,
  isVisible = false
}) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActions = [
    { value: '', label: 'Choose action...', disabled: true },
    { value: 'export', label: 'Export Selected', icon: 'Download' },
    { value: 'duplicate', label: 'Duplicate', icon: 'Copy' },
    { value: 'share', label: 'Share', icon: 'Share' },
    { value: 'move', label: 'Move to Folder', icon: 'FolderOpen' },
    { value: 'tag', label: 'Add Tags', icon: 'Tag' },
    { value: 'rate', label: 'Bulk Rate', icon: 'Star' },
    { value: 'archive', label: 'Archive', icon: 'Archive' },
    { value: 'delete', label: 'Delete', icon: 'Trash2' }
  ];

  const exportFormats = [
    { value: 'json', label: 'JSON Format' },
    { value: 'csv', label: 'CSV Format' },
    { value: 'pdf', label: 'PDF Report' },
    { value: 'markdown', label: 'Markdown' }
  ];

  const handleActionExecute = async () => {
    if (!selectedAction || selectedCount === 0) return;

    setIsProcessing(true);
    
    try {
      if (onBulkAction) {
        await onBulkAction(selectedAction, selectedCount);
      }
      
      // Reset action selection after execution
      setSelectedAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (action) => {
    const actionConfig = bulkActions?.find(a => a?.value === action);
    return actionConfig?.icon || 'Settings';
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'delete':
        return 'destructive';
      case 'archive':
        return 'warning';
      case 'export': case'share':
        return 'default';
      default:
        return 'default';
    }
  };

  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-[400px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="CheckSquare" size={16} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                {selectedCount} prompt{selectedCount !== 1 ? 's' : ''} selected
              </div>
              <div className="text-xs text-muted-foreground">
                Choose an action to apply to selected items
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearSelection}
            className="p-1 h-6 w-6"
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* Action Selector */}
          <div className="flex-1">
            <Select
              options={bulkActions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Choose action..."
              className="w-full"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => setSelectedAction('export')}
              disabled={isProcessing}
              title="Export Selected"
            />
            
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              onClick={() => setSelectedAction('duplicate')}
              disabled={isProcessing}
              title="Duplicate Selected"
            />
            
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
              onClick={() => setSelectedAction('share')}
              disabled={isProcessing}
              title="Share Selected"
            />
          </div>

          {/* Execute Button */}
          <Button
            variant={getActionColor(selectedAction)}
            size="sm"
            iconName={selectedAction ? getActionIcon(selectedAction) : 'Play'}
            onClick={handleActionExecute}
            disabled={!selectedAction || isProcessing}
            loading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Apply'}
          </Button>
        </div>

        {/* Action-specific Options */}
        {selectedAction === 'export' && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Export Format:</div>
            <div className="grid grid-cols-4 gap-2">
              {exportFormats?.map((format) => (
                <Button
                  key={format?.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionExecute()}
                  className="text-xs"
                >
                  {format?.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {selectedAction === 'delete' && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center space-x-2 text-xs text-error">
              <Icon name="AlertTriangle" size={12} />
              <span>This action cannot be undone. Selected prompts will be permanently deleted.</span>
            </div>
          </div>
        )}

        {selectedAction === 'move' && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Move to:</div>
            <Select
              options={[
                { value: 'content', label: 'Content Creation' },
                { value: 'code', label: 'Code Generation' },
                { value: 'analysis', label: 'Data Analysis' },
                { value: 'creative', label: 'Creative Writing' },
                { value: 'research', label: 'Research' }
              ]}
              placeholder="Select folder..."
              className="w-full"
            />
          </div>
        )}

        {selectedAction === 'tag' && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Add tags:</div>
            <input
              type="text"
              placeholder="Enter tags separated by commas..."
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        )}

        {/* Progress Indicator */}
        {isProcessing && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Processing {selectedCount} item{selectedCount !== 1 ? 's' : ''}...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActionToolbar;