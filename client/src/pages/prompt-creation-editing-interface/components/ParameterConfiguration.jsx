import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ParameterConfiguration = ({ 
  selectedTool, 
  parameters = {}, 
  onParametersChange,
  className = '' 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getToolParameters = (tool) => {
    switch (tool) {
      case 'chatgpt':
        return {
          temperature: { type: 'range', min: 0, max: 2, step: 0.1, default: 0.7, label: 'Temperature', description: 'Controls randomness in responses' },
          max_tokens: { type: 'number', min: 1, max: 4096, default: 1000, label: 'Max Tokens', description: 'Maximum response length' },
          top_p: { type: 'range', min: 0, max: 1, step: 0.1, default: 1, label: 'Top P', description: 'Nucleus sampling parameter' },
          frequency_penalty: { type: 'range', min: -2, max: 2, step: 0.1, default: 0, label: 'Frequency Penalty', description: 'Reduces repetition' },
          presence_penalty: { type: 'range', min: -2, max: 2, step: 0.1, default: 0, label: 'Presence Penalty', description: 'Encourages new topics' },
          system_message: { type: 'textarea', default: '', label: 'System Message', description: 'Instructions for the AI assistant' }
        };
      
      case 'claude':
        return {
          temperature: { type: 'range', min: 0, max: 1, step: 0.1, default: 0.7, label: 'Temperature', description: 'Controls response creativity' },
          max_tokens: { type: 'number', min: 1, max: 8192, default: 1000, label: 'Max Tokens', description: 'Maximum response length' },
          top_p: { type: 'range', min: 0, max: 1, step: 0.1, default: 1, label: 'Top P', description: 'Nucleus sampling' },
          top_k: { type: 'number', min: 1, max: 100, default: 40, label: 'Top K', description: 'Limits token selection' }
        };
      
      case 'midjourney':
        return {
          aspect_ratio: { type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '2:3', '3:2'], default: '1:1', label: 'Aspect Ratio', description: 'Image dimensions' },
          quality: { type: 'select', options: ['0.25', '0.5', '1', '2'], default: '1', label: 'Quality', description: 'Rendering quality and cost' },
          stylize: { type: 'range', min: 0, max: 1000, step: 50, default: 100, label: 'Stylize', description: 'Artistic interpretation strength' },
          chaos: { type: 'range', min: 0, max: 100, step: 10, default: 0, label: 'Chaos', description: 'Variation in results' },
          seed: { type: 'number', min: 0, max: 4294967295, default: '', label: 'Seed', description: 'Reproducible results' },
          model: { type: 'select', options: ['v6', 'v5.2', 'v5.1', 'v5', 'niji'], default: 'v6', label: 'Model Version', description: 'AI model to use' }
        };
      
      case 'dalle':
        return {
          size: { type: 'select', options: ['256x256', '512x512', '1024x1024'], default: '1024x1024', label: 'Image Size', description: 'Output dimensions' },
          quality: { type: 'select', options: ['standard', 'hd'], default: 'standard', label: 'Quality', description: 'Image quality level' },
          style: { type: 'select', options: ['vivid', 'natural'], default: 'vivid', label: 'Style', description: 'Image style preference' },
          n: { type: 'number', min: 1, max: 4, default: 1, label: 'Number of Images', description: 'How many images to generate' }
        };
      
      case 'stable-diffusion':
        return {
          steps: { type: 'range', min: 10, max: 150, step: 5, default: 50, label: 'Steps', description: 'Inference steps' },
          cfg_scale: { type: 'range', min: 1, max: 30, step: 0.5, default: 7, label: 'CFG Scale', description: 'Prompt adherence' },
          width: { type: 'select', options: ['512', '768', '1024'], default: '512', label: 'Width', description: 'Image width' },
          height: { type: 'select', options: ['512', '768', '1024'], default: '512', label: 'Height', description: 'Image height' },
          sampler: { type: 'select', options: ['Euler', 'Euler a', 'DPM++ 2M', 'DDIM'], default: 'Euler', label: 'Sampler', description: 'Sampling method' },
          seed: { type: 'number', min: -1, max: 4294967295, default: -1, label: 'Seed', description: 'Random seed (-1 for random)' }
        };
      
      default:
        return {};
    }
  };

  const toolParameters = getToolParameters(selectedTool);
  const basicParams = Object.keys(toolParameters)?.slice(0, 3);
  const advancedParams = Object.keys(toolParameters)?.slice(3);

  const handleParameterChange = (paramName, value) => {
    onParametersChange({
      ...parameters,
      [paramName]: value
    });
  };

  const resetToDefaults = () => {
    const defaults = {};
    Object.entries(toolParameters)?.forEach(([key, config]) => {
      defaults[key] = config?.default;
    });
    onParametersChange(defaults);
  };

  const renderParameter = (paramName, config) => {
    const currentValue = parameters?.[paramName] !== undefined ? parameters?.[paramName] : config?.default;

    switch (config?.type) {
      case 'range':
        return (
          <div key={paramName} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {config?.label}
              </label>
              <span className="text-sm text-muted-foreground">
                {currentValue}
              </span>
            </div>
            <input
              type="range"
              min={config?.min}
              max={config?.max}
              step={config?.step}
              value={currentValue}
              onChange={(e) => handleParameterChange(paramName, parseFloat(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider:bg-primary slider:rounded-lg"
            />
            <div className="text-xs text-muted-foreground">
              {config?.description}
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={paramName}>
            <Input
              label={config?.label}
              type="number"
              min={config?.min}
              max={config?.max}
              value={currentValue}
              onChange={(e) => handleParameterChange(paramName, parseInt(e?.target?.value) || config?.default)}
              description={config?.description}
            />
          </div>
        );

      case 'select':
        return (
          <div key={paramName}>
            <Select
              label={config?.label}
              options={config?.options?.map(opt => ({ value: opt, label: opt }))}
              value={currentValue}
              onChange={(value) => handleParameterChange(paramName, value)}
              description={config?.description}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={paramName} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {config?.label}
            </label>
            <textarea
              value={currentValue}
              onChange={(e) => handleParameterChange(paramName, e?.target?.value)}
              placeholder={`Enter ${config?.label?.toLowerCase()}...`}
              className="w-full p-3 bg-background border border-border rounded-lg resize-none
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                         text-sm"
              rows={3}
            />
            <div className="text-xs text-muted-foreground">
              {config?.description}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={paramName}>
            <Checkbox
              label={config?.label}
              description={config?.description}
              checked={currentValue}
              onChange={(e) => handleParameterChange(paramName, e?.target?.checked)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!selectedTool || Object.keys(toolParameters)?.length === 0) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="Settings" size={24} className="text-muted-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">
          Select an AI tool to configure parameters
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Parameter Configuration
          </h3>
          <p className="text-sm text-muted-foreground">
            Fine-tune {selectedTool} settings for optimal results
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="RotateCcw"
          onClick={resetToDefaults}
        >
          Reset
        </Button>
      </div>
      {/* Basic Parameters */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-foreground">
          Basic Settings
        </div>
        {basicParams?.map(paramName => renderParameter(paramName, toolParameters?.[paramName]))}
      </div>
      {/* Advanced Parameters */}
      {advancedParams?.length > 0 && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            iconName={showAdvanced ? 'ChevronUp' : 'ChevronDown'}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full justify-between"
          >
            Advanced Settings
            <span className="text-xs text-muted-foreground">
              {advancedParams?.length} options
            </span>
          </Button>
          
          {showAdvanced && (
            <div className="space-y-4 pl-4 border-l-2 border-border">
              {advancedParams?.map(paramName => renderParameter(paramName, toolParameters?.[paramName]))}
            </div>
          )}
        </div>
      )}
      {/* Parameter Presets */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-foreground">
          Quick Presets
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const creativePreset = { ...parameters };
              if (selectedTool === 'chatgpt' || selectedTool === 'claude') {
                creativePreset.temperature = 1.2;
                creativePreset.top_p = 0.9;
              }
              onParametersChange(creativePreset);
            }}
          >
            Creative
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const balancedPreset = { ...parameters };
              if (selectedTool === 'chatgpt' || selectedTool === 'claude') {
                balancedPreset.temperature = 0.7;
                balancedPreset.top_p = 1.0;
              }
              onParametersChange(balancedPreset);
            }}
          >
            Balanced
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const precisePreset = { ...parameters };
              if (selectedTool === 'chatgpt' || selectedTool === 'claude') {
                precisePreset.temperature = 0.2;
                precisePreset.top_p = 0.8;
              }
              onParametersChange(precisePreset);
            }}
          >
            Precise
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const experimentalPreset = { ...parameters };
              if (selectedTool === 'chatgpt' || selectedTool === 'claude') {
                experimentalPreset.temperature = 1.8;
                experimentalPreset.top_p = 0.7;
              }
              onParametersChange(experimentalPreset);
            }}
          >
            Experimental
          </Button>
        </div>
      </div>
      {/* Parameter Info */}
      <div className="p-3 bg-muted rounded-lg border border-border">
        <div className="text-sm font-medium text-foreground mb-2">
          Parameter Tips
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          {selectedTool === 'chatgpt' && (
            <>
              <div>• Higher temperature = more creative, lower = more focused</div>
              <div>• Adjust penalties to reduce repetition and encourage variety</div>
              <div>• System messages set the AI's role and behavior</div>
            </>
          )}
          {selectedTool === 'midjourney' && (
            <>
              <div>• Higher stylize values create more artistic interpretations</div>
              <div>• Use chaos for more varied results from the same prompt</div>
              <div>• Seeds allow you to reproduce specific images</div>
            </>
          )}
          {selectedTool === 'stable-diffusion' && (
            <>
              <div>• More steps generally improve quality but take longer</div>
              <div>• CFG scale controls how closely the image follows your prompt</div>
              <div>• Different samplers can produce varying artistic styles</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParameterConfiguration;