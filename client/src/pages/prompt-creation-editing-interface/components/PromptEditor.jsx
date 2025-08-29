import React, { useState, useRef, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PromptEditor = ({ 
  title, 
  onTitleChange, 
  content, 
  onContentChange, 
  onSave,
  isAutoSaving = false,
  lastSaved,
  className = '' 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (content) {
      setWordCount(content?.trim()?.split(/\s+/)?.filter(word => word?.length > 0)?.length);
      setCharCount(content?.length);
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [content]);

  const handleKeyDown = (e) => {
    // Handle Ctrl+S for save
    if ((e?.ctrlKey || e?.metaKey) && e?.key === 's') {
      e?.preventDefault();
      onSave();
    }

    // Handle Tab for indentation
    if (e?.key === 'Tab') {
      e?.preventDefault();
      const start = e?.target?.selectionStart;
      const end = e?.target?.selectionEnd;
      const value = e?.target?.value;
      const newValue = value?.substring(0, start) + '  ' + value?.substring(end);
      onContentChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const insertTemplate = (template) => {
    const textarea = textareaRef?.current;
    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const currentContent = content || '';
    
    const newContent = currentContent?.substring(0, start) + template + currentContent?.substring(end);
    onContentChange(newContent);
    
    // Set cursor position after template
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + template?.length;
      textarea?.focus();
    }, 0);
  };

  const templateSnippets = [
    { label: 'Role', template: 'You are a [ROLE] who [EXPERTISE].' },
    { label: 'Context', template: '\n\nContext: [BACKGROUND_INFORMATION]' },
    { label: 'Task', template: '\n\nTask: [SPECIFIC_REQUEST]' },
    { label: 'Format', template: '\n\nFormat: [OUTPUT_STRUCTURE]' },
    { label: 'Examples', template: '\n\nExamples:\n- [EXAMPLE_1]\n- [EXAMPLE_2]' },
    { label: 'Constraints', template: '\n\nConstraints:\n- [CONSTRAINT_1]\n- [CONSTRAINT_2]' }
  ];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`space-y-4 ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            Prompt Editor
          </h3>
          {isAutoSaving && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="RotateCcw" size={14} className="animate-spin" />
              <span className="text-xs">Auto-saving...</span>
            </div>
          )}
          {lastSaved && !isAutoSaving && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSaved}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName={isFullscreen ? 'Minimize2' : 'Maximize2'}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Save"
            onClick={onSave}
            title="Save (Ctrl+S)"
          >
            Save
          </Button>
        </div>
      </div>
      {/* Title Input */}
      <Input
        label="Prompt Title"
        type="text"
        placeholder="Enter a descriptive title for your prompt..."
        value={title}
        onChange={(e) => onTitleChange(e?.target?.value)}
        required
        className="w-full"
      />
      {/* Template Snippets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Quick templates:</span>
        {templateSnippets?.map((snippet) => (
          <Button
            key={snippet?.label}
            variant="ghost"
            size="xs"
            onClick={() => insertTemplate(snippet?.template)}
            className="text-xs"
          >
            {snippet?.label}
          </Button>
        ))}
      </div>
      {/* Content Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Prompt Content
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e?.target?.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your prompt here...\n\nTip: Use [VARIABLES] for dynamic content\nPress Tab for indentation\nCtrl+S to save"
            className={`w-full p-4 bg-background border border-border rounded-lg resize-none
                       focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                       font-mono text-sm leading-relaxed
                       ${isFullscreen ? 'h-[calc(100vh-300px)]' : 'h-64'}`}
            style={{ minHeight: isFullscreen ? 'calc(100vh - 300px)' : '256px' }}
          />
          
          {/* Line numbers overlay for better UX */}
          <div className="absolute top-4 left-2 text-xs text-muted-foreground pointer-events-none font-mono leading-relaxed">
            {content && content?.split('\n')?.map((_, index) => (
              <div key={index} className="h-5">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Editor Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span>{content ? content?.split('\n')?.length : 1} lines</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Ctrl+S to save</span>
          <span>Tab for indent</span>
        </div>
      </div>
      {/* Syntax Highlighting Hints */}
      <div className="p-3 bg-muted rounded-lg border border-border">
        <div className="text-sm font-medium text-foreground mb-2">
          Prompt Engineering Tips
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Use [VARIABLES] for dynamic content replacement</div>
          <div>• Structure prompts with clear role, context, task, and format sections</div>
          <div>• Include specific examples to guide AI behavior</div>
          <div>• Add constraints to prevent unwanted outputs</div>
          <div>• Test with different phrasings to optimize results</div>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;