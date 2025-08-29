import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CategoryManager = ({ 
  selectedCategories = [], 
  onCategoriesChange, 
  customTags = [], 
  onCustomTagsChange,
  className = '' 
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const predefinedCategories = [
    { value: 'video', label: 'Video Content', description: 'Video scripts, storyboards, and production' },
    { value: 'audio', label: 'Audio Content', description: 'Podcasts, voiceovers, and sound design' },
    { value: 'app', label: 'Mobile App', description: 'App descriptions, features, and user flows' },
    { value: 'pwa', label: 'Progressive Web App', description: 'PWA specifications and functionality' },
    { value: 'website', label: 'Website', description: 'Web content, copy, and user experience' },
    { value: 'marketing', label: 'Marketing', description: 'Campaigns, ads, and promotional content' },
    { value: 'technical', label: 'Technical', description: 'Documentation, code, and specifications' },
    { value: 'creative', label: 'Creative', description: 'Art, design, and creative writing' },
    { value: 'business', label: 'Business', description: 'Strategy, analysis, and operations' },
    { value: 'education', label: 'Education', description: 'Learning materials and curriculum' }
  ];

  const handleAddCustomTag = () => {
    if (newTagName?.trim() && !customTags?.some(tag => tag?.name?.toLowerCase() === newTagName?.toLowerCase())) {
      const newTag = {
        id: Date.now()?.toString(),
        name: newTagName?.trim(),
        color: getRandomTagColor(),
        createdAt: new Date()?.toISOString()
      };
      onCustomTagsChange([...customTags, newTag]);
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveCustomTag = (tagId) => {
    onCustomTagsChange(customTags?.filter(tag => tag?.id !== tagId));
    // Also remove from selected categories if it was selected
    onCategoriesChange(selectedCategories?.filter(cat => cat !== `custom-${tagId}`));
  };

  const getRandomTagColor = () => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-orange-100 text-orange-800'
    ];
    return colors?.[Math.floor(Math.random() * colors?.length)];
  };

  const allCategoryOptions = [
    ...predefinedCategories,
    ...customTags?.map(tag => ({
      value: `custom-${tag?.id}`,
      label: tag?.name,
      description: 'Custom tag'
    }))
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Content Categories
        </label>
        <Select
          options={allCategoryOptions}
          value={selectedCategories}
          onChange={onCategoriesChange}
          placeholder="Select categories..."
          multiple
          searchable
          clearable
          className="w-full"
        />
      </div>
      {/* Selected Categories Display */}
      {selectedCategories?.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Selected Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedCategories?.map((categoryValue) => {
              const category = allCategoryOptions?.find(opt => opt?.value === categoryValue);
              const isCustom = categoryValue?.startsWith('custom-');
              const customTag = isCustom ? customTags?.find(tag => `custom-${tag?.id}` === categoryValue) : null;
              
              return (
                <div
                  key={categoryValue}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                             ${isCustom && customTag ? customTag?.color : 'bg-primary/10 text-primary'}`}
                >
                  <Icon 
                    name={isCustom ? 'Tag' : getCategoryIcon(categoryValue)} 
                    size={12} 
                    className="mr-1"
                  />
                  {category?.label}
                  <button
                    onClick={() => onCategoriesChange(selectedCategories?.filter(cat => cat !== categoryValue))}
                    className="ml-2 hover:text-error transition-colors"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Custom Tags Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Custom Tags
          </label>
          <Button
            variant="ghost"
            size="sm"
            iconName="Plus"
            onClick={() => setIsAddingTag(true)}
            disabled={isAddingTag}
          >
            Add Tag
          </Button>
        </div>

        {/* Add New Tag Form */}
        {isAddingTag && (
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg border border-border">
            <Input
              type="text"
              placeholder="Enter tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e?.target?.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e?.key === 'Enter') {
                  e?.preventDefault();
                  handleAddCustomTag();
                } else if (e?.key === 'Escape') {
                  setIsAddingTag(false);
                  setNewTagName('');
                }
              }}
              autoFocus
            />
            <Button
              variant="default"
              size="sm"
              iconName="Check"
              onClick={handleAddCustomTag}
              disabled={!newTagName?.trim()}
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => {
                setIsAddingTag(false);
                setNewTagName('');
              }}
            />
          </div>
        )}

        {/* Custom Tags List */}
        {customTags?.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Your custom tags ({customTags?.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {customTags?.map((tag) => (
                <div
                  key={tag?.id}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tag?.color}`}
                >
                  <Icon name="Tag" size={12} className="mr-1" />
                  {tag?.name}
                  <button
                    onClick={() => handleRemoveCustomTag(tag?.id)}
                    className="ml-2 hover:text-error transition-colors"
                    title="Remove custom tag"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Category Guidelines */}
      <div className="p-3 bg-muted rounded-lg border border-border">
        <div className="text-sm font-medium text-foreground mb-2">
          Category Guidelines
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Select multiple categories to improve discoverability</div>
          <div>• Use specific categories over general ones when possible</div>
          <div>• Create custom tags for project-specific organization</div>
          <div>• Categories help with filtering and search functionality</div>
        </div>
      </div>
    </div>
  );
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'video':
      return 'Video';
    case 'audio':
      return 'Headphones';
    case 'app':
      return 'Smartphone';
    case 'pwa':
      return 'Globe';
    case 'website':
      return 'Monitor';
    case 'marketing':
      return 'Megaphone';
    case 'technical':
      return 'Code';
    case 'creative':
      return 'Palette';
    case 'business':
      return 'Briefcase';
    case 'education':
      return 'GraduationCap';
    default:
      return 'Tag';
  }
};

export default CategoryManager;