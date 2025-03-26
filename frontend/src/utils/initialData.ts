
import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    data: { label: 'Start Workflow', description: 'Beginning of the workflow' },
    position: { x: 250, y: 50 },
  },
  {
    id: 'process-1',
    type: 'process',
    data: { 
      label: 'Process Data', 
      description: 'Process incoming information',
      action: 'Transform data from source format'
    },
    position: { x: 250, y: 200 },
  },
  {
    id: 'decision-1',
    type: 'decision',
    data: { 
      label: 'Validate Result', 
      description: 'Check if data is valid',
      yesPath: 'Data is valid',
      noPath: 'Data is invalid'
    },
    position: { x: 250, y: 350 },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'edge-start-process',
    source: 'start-1',
    target: 'process-1',
    animated: true,
  },
  {
    id: 'edge-process-decision',
    source: 'process-1',
    target: 'decision-1',
  },
];
