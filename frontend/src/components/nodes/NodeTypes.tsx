
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, Cog, MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib/utils';

// Base node component with explicit type definition
const BaseNode: React.FC<
  NodeProps & {
    data: {
      label: string;
      description?: string;
    };
    icon: React.ReactNode;
    className?: string;
  }
> = memo(({ id, data, selected, icon, className }) => {
  return (
    <div
      className={cn(
        'px-4 py-3 flex flex-col items-center min-w-[150px] transition-all duration-200',
        selected && 'scale-[1.02]',
        className
      )}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col items-center gap-2">
        <div className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
          {icon}
        </div>
        <div className="text-center">
          <div className="font-medium text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-muted-foreground mt-1">{data.description}</div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

// Start node with proper type casting
export const StartNode: React.FC<NodeProps> = memo((props) => (
  <BaseNode
    {...props}
    data={{ 
      label: props.data.label as string || 'Start', 
      description: props.data.description as string | undefined 
    }}
    icon={<Play className="w-5 h-5 text-blue-500" />}
    className="node-start"
  />
));

// Process node with proper type casting
export const ProcessNode: React.FC<NodeProps> = memo((props) => (
  <BaseNode
    {...props}
    data={{ 
      label: props.data.label as string || 'Process', 
      description: props.data.description as string | undefined 
    }}
    icon={<Cog className="w-5 h-5 text-gray-700" />}
    className="node-process"
  />
));

// Decision node with proper type casting
export const DecisionNode: React.FC<NodeProps> = memo((props) => {
  return (
    <div className="relative">
      <BaseNode
        {...props}
        data={{ 
          label: props.data.label as string || 'Decision', 
          description: props.data.description as string | undefined 
        }}
        icon={<MessageSquareQuote className="w-5 h-5 text-orange-500" />}
        className="node-decision"
      />
      <Handle type="source" position={Position.Left} id="yes" className="-left-1 top-1/2" />
      <Handle type="source" position={Position.Right} id="no" className="-right-1 top-1/2" />
    </div>
  );
});

export const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
};
