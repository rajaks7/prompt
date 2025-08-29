import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const AdvancedSearchBuilder = ({ 
  isOpen, 
  onClose, 
  onApplyQuery, 
  currentQuery = '' 
}) => {
  const [queryConditions, setQueryConditions] = useState([
    {
      id: 1,
      field: 'content',
      operator: 'contains',
      value: '',
      connector: 'AND'
    }
  ]);

  const fieldOptions = [
    { value: 'content', label: 'Prompt Content' },
    { value: 'title', label: 'Title' },
    { value: 'description', label: 'Description' },
    { value: 'tags', label: 'Tags' },
    { value: 'tool', label: 'AI Tool' },
    { value: 'creator', label: 'Creator' },
    { value: 'output', label: 'Output Content' },
    { value: 'category', label: 'Category' }
  ];

  const operatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'regex', label: 'Regex pattern' },
    { value: 'not_contains', label: 'Does not contain' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' }
  ];

  const connectorOptions = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
    { value: 'NOT', label: 'NOT' }
  ];

  const addCondition = () => {
    const newCondition = {
      id: Date.now(),
      field: 'content',
      operator: 'contains',
      value: '',
      connector: 'AND'
    };
    setQueryConditions([...queryConditions, newCondition]);
  };

  const removeCondition = (id) => {
    if (queryConditions?.length > 1) {
      setQueryConditions(queryConditions?.filter(condition => condition?.id !== id));
    }
  };

  const updateCondition = (id, field, value) => {
    setQueryConditions(queryConditions?.map(condition => 
      condition?.id === id ? { ...condition, [field]: value } : condition
    ));
  };

  const buildQuery = () => {
    return queryConditions?.map((condition, index) => {
      let query = '';
      
      if (index > 0) {
        query += ` ${condition?.connector} `;
      }
      
      switch (condition?.operator) {
        case 'contains':
          query += `${condition?.field}:"${condition?.value}"`;
          break;
        case 'equals':
          query += `${condition?.field}=${condition?.value}`;
          break;
        case 'starts_with':
          query += `${condition?.field}:${condition?.value}*`;
          break;
        case 'ends_with':
          query += `${condition?.field}:*${condition?.value}`;
          break;
        case 'regex':
          query += `${condition?.field}:/${condition?.value}/`;
          break;
        case 'not_contains':
          query += `NOT ${condition?.field}:"${condition?.value}"`;
          break;
        case 'is_empty':
          query += `${condition?.field}:""`;
          break;
        case 'is_not_empty':
          query += `NOT ${condition?.field}:""`;
          break;
        default:
          query += `${condition?.field}:"${condition?.value}"`;
      }
      
      return query;
    })?.join('');
  };

  const handleApply = () => {
    let query = buildQuery();
    onApplyQuery(query);
    onClose();
  };

  const loadPresetQuery = (preset) => {
    const presets = {
      'high-performance': [
        { id: 1, field: 'rating', operator: 'equals', value: '5', connector: 'AND' },
        { id: 2, field: 'usage_count', operator: 'contains', value: '10', connector: 'AND' }
      ],
      'recent-creative': [
        { id: 1, field: 'category', operator: 'equals', value: 'creative', connector: 'AND' },
        { id: 2, field: 'created_date', operator: 'contains', value: '2025', connector: 'AND' }
      ],
      'code-generation': [
        { id: 1, field: 'tool', operator: 'equals', value: 'ChatGPT', connector: 'OR' },
        { id: 2, field: 'tool', operator: 'equals', value: 'Claude', connector: 'AND' },
        { id: 3, field: 'tags', operator: 'contains', value: 'code', connector: 'AND' }
      ]
    };

    if (presets?.[preset]) {
      setQueryConditions(presets?.[preset]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-modal border border-border w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Search" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Advanced Search Builder</h2>
              <p className="text-sm text-muted-foreground">
                Create complex queries with boolean operators and field-specific searches
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="w-8 h-8 p-0"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Query Presets */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick Presets</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadPresetQuery('high-performance')}
              >
                High Performance Prompts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadPresetQuery('recent-creative')}
              >
                Recent Creative Content
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadPresetQuery('code-generation')}
              >
                Code Generation
              </Button>
            </div>
          </div>

          {/* Query Conditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Search Conditions</h3>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={addCondition}
              >
                Add Condition
              </Button>
            </div>

            {queryConditions?.map((condition, index) => (
              <div key={condition?.id} className="bg-muted/30 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-3 items-end">
                  {/* Connector (except for first condition) */}
                  {index > 0 && (
                    <div className="col-span-2">
                      <Select
                        options={connectorOptions}
                        value={condition?.connector}
                        onChange={(value) => updateCondition(condition?.id, 'connector', value)}
                        placeholder="Connector"
                      />
                    </div>
                  )}
                  
                  {/* Field */}
                  <div className={index === 0 ? "col-span-3" : "col-span-3"}>
                    <Select
                      label="Field"
                      options={fieldOptions}
                      value={condition?.field}
                      onChange={(value) => updateCondition(condition?.id, 'field', value)}
                    />
                  </div>

                  {/* Operator */}
                  <div className="col-span-3">
                    <Select
                      label="Operator"
                      options={operatorOptions}
                      value={condition?.operator}
                      onChange={(value) => updateCondition(condition?.id, 'operator', value)}
                    />
                  </div>

                  {/* Value */}
                  <div className="col-span-3">
                    <Input
                      label="Value"
                      type="text"
                      value={condition?.value}
                      onChange={(e) => updateCondition(condition?.id, 'value', e?.target?.value)}
                      placeholder="Search value"
                      disabled={['is_empty', 'is_not_empty']?.includes(condition?.operator)}
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => removeCondition(condition?.id)}
                      disabled={queryConditions?.length === 1}
                      className="w-8 h-8 p-0 text-error hover:text-error hover:bg-error/10"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Query Preview */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground mb-2">Query Preview</h3>
            <div className="bg-muted rounded-lg p-3 font-mono text-sm text-foreground">
              {buildQuery() || 'No conditions defined'}
            </div>
          </div>

          {/* Search Tips */}
          <div className="mt-6 bg-accent/10 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="Lightbulb" size={16} className="mr-2 text-accent" />
              Search Tips
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use quotes for exact phrase matching: "machine learning"</li>
              <li>• Regex patterns support advanced matching: /^prompt.*$/</li>
              <li>• Combine AND/OR operators for complex queries</li>
              <li>• Use NOT to exclude specific terms or conditions</li>
              <li>• Empty field checks help find incomplete prompts</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            {queryConditions?.length} condition{queryConditions?.length !== 1 ? 's' : ''} defined
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleApply}
              iconName="Search"
              iconPosition="left"
            >
              Apply Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchBuilder;