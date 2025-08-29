import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ToolSelector = ({ selectedTool, onToolChange, className = '' }) => {
  const toolOptions = [
    { 
      value: 'chatgpt', 
      label: 'ChatGPT',
      description: 'OpenAI GPT-4 for conversational AI'
    },
    { 
      value: 'claude', 
      label: 'Claude',
      description: 'Anthropic Claude for analytical tasks'
    },
    { 
      value: 'midjourney', 
      label: 'Midjourney',
      description: 'AI image generation and art creation'
    },
    { 
      value: 'dalle', 
      label: 'DALL-E',
      description: 'OpenAI image generation'
    },
    { 
      value: 'stable-diffusion', 
      label: 'Stable Diffusion',
      description: 'Open-source image generation'
    },
    { 
      value: 'gemini', 
      label: 'Google Gemini',
      description: 'Google multimodal AI assistant'
    },
    { 
      value: 'copilot', 
      label: 'GitHub Copilot',
      description: 'AI-powered code completion'
    },
    { 
      value: 'custom', 
      label: 'Custom API',
      description: 'Custom AI tool integration'
    }
  ];

  const getToolIcon = (tool) => {
    switch (tool) {
      case 'chatgpt':
        return 'MessageSquare';
      case 'claude':
        return 'Brain';
      case 'midjourney': case'dalle': case'stable-diffusion':
        return 'Image';
      case 'gemini':
        return 'Sparkles';
      case 'copilot':
        return 'Code';
      case 'custom':
        return 'Settings';
      default:
        return 'Bot';
    }
  };

  const getToolStatus = (tool) => {
    // Mock API status for different tools
    const statusMap = {
      'chatgpt': 'operational',
      'claude': 'operational',
      'midjourney': 'degraded',
      'dalle': 'operational',
      'stable-diffusion': 'operational',
      'gemini': 'operational',
      'copilot': 'operational',
      'custom': 'unknown'
    };
    return statusMap?.[tool] || 'unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'degraded':
        return 'text-warning';
      case 'outage':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          AI Tool Selection
        </label>
        {selectedTool && (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              getToolStatus(selectedTool) === 'operational' ? 'bg-success' :
              getToolStatus(selectedTool) === 'degraded' ? 'bg-warning' : 'bg-error'
            }`} />
            <span className={`text-xs ${getStatusColor(getToolStatus(selectedTool))}`}>
              {getToolStatus(selectedTool)}
            </span>
          </div>
        )}
      </div>
      <Select
        options={toolOptions}
        value={selectedTool}
        onChange={onToolChange}
        placeholder="Select an AI tool..."
        searchable
        className="w-full"
      />
      {selectedTool && (
        <div className="p-3 bg-muted rounded-lg border border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon 
                name={getToolIcon(selectedTool)} 
                size={16} 
                className="text-primary"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">
                {toolOptions?.find(tool => tool?.value === selectedTool)?.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {toolOptions?.find(tool => tool?.value === selectedTool)?.description}
              </div>
            </div>
          </div>

          {/* Tool-specific configuration hints */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              {selectedTool === 'chatgpt' && 'Supports system messages, temperature control, and function calling'}
              {selectedTool === 'claude' && 'Optimized for analysis, reasoning, and long-form content'}
              {selectedTool === 'midjourney' && 'Use descriptive prompts with aspect ratios and style parameters'}
              {selectedTool === 'dalle' && 'Supports detailed image descriptions and style modifiers'}
              {selectedTool === 'stable-diffusion' && 'Open-source with custom model support'}
              {selectedTool === 'gemini' && 'Multimodal capabilities with text, image, and code understanding'}
              {selectedTool === 'copilot' && 'Context-aware code generation and completion'}
              {selectedTool === 'custom' && 'Configure API endpoints and authentication in settings'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolSelector;