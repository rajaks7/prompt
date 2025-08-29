import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PreviewPanel = ({ 
  prompt = '', 
  selectedTool = '', 
  parameters = {},
  onTest,
  testResults = [],
  isLoading = false,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedResult, setSelectedResult] = useState(null);

  // Mock test results if none provided
  const mockResults = testResults?.length > 0 ? testResults : [
    {
      id: 'test1',
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      tool: 'chatgpt',
      parameters: { temperature: 0.7, max_tokens: 1000 },
      input: 'Write a brief introduction to artificial intelligence.',
      output: `Artificial Intelligence (AI) represents one of the most transformative technologies of our time. At its core, AI refers to computer systems designed to perform tasks that typically require human intelligence, such as learning, reasoning, problem-solving, and decision-making.\n\nModern AI encompasses various approaches, from machine learning algorithms that improve through experience to neural networks that mimic the human brain's structure. These systems can process vast amounts of data, recognize patterns, and make predictions with remarkable accuracy.\n\nToday, AI powers everything from recommendation systems and virtual assistants to autonomous vehicles and medical diagnosis tools, fundamentally changing how we work, communicate, and solve complex problems.`,
      metrics: {
        responseTime: 2.3,
        tokenCount: 156,
        cost: 0.0023
      },
      rating: 4
    },
    {
      id: 'test2',
      timestamp: new Date(Date.now() - 600000)?.toISOString(),
      tool: 'claude',
      parameters: { temperature: 0.5, max_tokens: 800 },
      input: 'Write a brief introduction to artificial intelligence.',
      output: `Artificial Intelligence (AI) is a rapidly evolving field of computer science focused on creating systems that can perform tasks requiring human-like intelligence. These tasks include learning from data, recognizing patterns, making decisions, and solving complex problems.\n\nAI systems range from narrow applications designed for specific tasks—like image recognition or language translation—to more general systems that can adapt to various challenges. Machine learning, a subset of AI, enables these systems to improve their performance through experience without explicit programming.\n\nThe impact of AI is already visible across industries, from healthcare and finance to transportation and entertainment, promising to reshape how we approach both everyday tasks and grand challenges.`,
      metrics: {
        responseTime: 1.8,
        tokenCount: 142,
        cost: 0.0019
      },
      rating: 5
    }
  ];

  const tabs = [
    { id: 'preview', label: 'Preview', icon: 'Eye' },
    { id: 'test', label: 'Test Results', icon: 'Play' },
    { id: 'metrics', label: 'Performance', icon: 'BarChart3' }
  ];

  const handleTest = () => {
    if (onTest) {
      onTest({
        prompt,
        tool: selectedTool,
        parameters
      });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString() + ' • ' + date?.toLocaleDateString();
  };

  const renderPreview = () => (
    <div className="space-y-4">
      {/* Prompt Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Prompt Preview
          </label>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>{prompt?.length} characters</span>
            <span>•</span>
            <span>{prompt?.split(' ')?.length} words</span>
          </div>
        </div>
        <div className="p-4 bg-muted rounded-lg border border-border min-h-32 max-h-64 overflow-y-auto">
          {prompt ? (
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {prompt}
            </pre>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              No prompt content to preview
            </div>
          )}
        </div>
      </div>

      {/* Tool & Parameters Summary */}
      {selectedTool && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Configuration Summary
          </label>
          <div className="p-3 bg-card border border-border rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Bot" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground capitalize">
                {selectedTool}
              </span>
            </div>
            {Object.keys(parameters)?.length > 0 && (
              <div className="space-y-1">
                {Object.entries(parameters)?.map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">
                      {key?.replace('_', ' ')}:
                    </span>
                    <span className="text-foreground font-mono">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="default"
          iconName="Play"
          onClick={handleTest}
          disabled={!prompt?.trim() || !selectedTool || isLoading}
          loading={isLoading}
          className="px-8"
        >
          {isLoading ? 'Testing...' : 'Test Prompt'}
        </Button>
      </div>
    </div>
  );

  const renderTestResults = () => (
    <div className="space-y-4">
      {mockResults?.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Play" size={24} className="text-muted-foreground" />
          </div>
          <div className="text-sm text-muted-foreground">
            No test results yet. Run a test to see outputs.
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-foreground">
              Test Results ({mockResults?.length})
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              onClick={() => setSelectedResult(null)}
            >
              Clear Selection
            </Button>
          </div>

          <div className="space-y-3">
            {mockResults?.map((result) => (
              <div
                key={result?.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200
                           ${selectedResult === result?.id 
                             ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
                           }`}
                onClick={() => setSelectedResult(selectedResult === result?.id ? null : result?.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Bot" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground capitalize">
                      {result?.tool}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={12}
                          className={i < result?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(result?.timestamp)}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  {result?.metrics?.responseTime}s • {result?.metrics?.tokenCount} tokens • ${result?.metrics?.cost?.toFixed(4)}
                </div>

                {selectedResult === result?.id && (
                  <div className="space-y-3 pt-3 border-t border-border">
                    <div>
                      <div className="text-xs font-medium text-foreground mb-1">Input:</div>
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        {result?.input}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-foreground mb-1">Output:</div>
                      <div className="text-xs text-foreground bg-background p-3 rounded border max-h-48 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{result?.output}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-4">
      {mockResults?.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="BarChart3" size={24} className="text-muted-foreground" />
          </div>
          <div className="text-sm text-muted-foreground">
            No performance data available yet.
          </div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Avg Response Time</div>
              <div className="text-lg font-semibold text-foreground">
                {(mockResults?.reduce((acc, r) => acc + r?.metrics?.responseTime, 0) / mockResults?.length)?.toFixed(1)}s
              </div>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Avg Rating</div>
              <div className="text-lg font-semibold text-foreground">
                {(mockResults?.reduce((acc, r) => acc + r?.rating, 0) / mockResults?.length)?.toFixed(1)}/5
              </div>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Total Cost</div>
              <div className="text-lg font-semibold text-foreground">
                ${mockResults?.reduce((acc, r) => acc + r?.metrics?.cost, 0)?.toFixed(4)}
              </div>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="text-xs text-muted-foreground">Total Tokens</div>
              <div className="text-lg font-semibold text-foreground">
                {mockResults?.reduce((acc, r) => acc + r?.metrics?.tokenCount, 0)?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Performance Comparison */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">
              Tool Comparison
            </div>
            {mockResults?.map((result) => (
              <div key={result?.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {result?.tool}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={10}
                        className={i < result?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {result?.metrics?.responseTime}s • ${result?.metrics?.cost?.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 border-b border-border mb-4">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg
                       transition-all duration-200 border-b-2
                       ${activeTab === tab?.id
                         ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                       }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'preview' && renderPreview()}
        {activeTab === 'test' && renderTestResults()}
        {activeTab === 'metrics' && renderMetrics()}
      </div>
    </div>
  );
};

export default PreviewPanel;