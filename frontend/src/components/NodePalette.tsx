
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Play, Cog, MessageSquareQuote } from 'lucide-react';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define node template data
const nodeTemplates = [
  {
    type: 'start',
    label: 'Start',
    icon: <Play className="w-5 h-5 text-blue-500" />,
    description: 'Beginning of the workflow',
    className: 'bg-workflow-node-start',
  },
  {
    type: 'process',
    label: 'Process',
    icon: <Cog className="w-5 h-5 text-gray-700" />,
    description: 'Process or action step',
    className: 'bg-workflow-node-process',
  },
  {
    type: 'decision',
    label: 'Decision',
    icon: <MessageSquareQuote className="w-5 h-5 text-orange-500" />,
    description: 'Branch based on condition',
    className: 'bg-workflow-node-decision',
  },
];

const NodePalette: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const { addNode, saveWorkflow, loadWorkflow, clearWorkflow  } = useWorkflow();

  interface NodeData {
    label: string;
    description: string;
  }

  // Handle drag start event
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: NodeData) => {
    // Set the data to be transferred during drag
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      data: { ...nodeData },
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={cn(
      'node-palette',
      expanded ? 'w-64' : 'w-12', // Explicit width control
      'h-full transition-all duration-300' // Smooth transition for the container
    )}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="node-palette-toggle"
        aria-label={expanded ? 'Collapse palette' : 'Expand palette'}
      >
        {expanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
  
      <div className={cn(
        'node-palette-content',
        expanded ? 'block' : 'hidden', // Use hidden instead of opacity-0
        'p-4' // Add padding for content
      )}>
        <h3 className="text-sm font-medium mb-3">Node Types</h3>
        <div className="space-y-3">
          {nodeTemplates.map((template) => (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template.type, {
                label: template.label,
                description: template.description,
              })}
              className={cn('draggable-node flex items-center gap-3 transition-all hover:shadow', template.className)}
            >
              <div className="p-1.5 rounded-full bg-white/50 backdrop-blur-sm">
                {template.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{template.label}</p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Controls</h3>
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full justify-start"  onClick={() => saveWorkflow()}>
              Save Workflow
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => loadWorkflow()}>
              Load Workflow
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => clearWorkflow()}>
              Clear Canvas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
