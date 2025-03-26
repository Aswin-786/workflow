import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowProvider } from '@/context/WorkflowContext';
import Canvas from './Canvas';
import NodePalette from './NodePalette';
import PropertiesPanel from './PropertiesPanel';

const WorkflowBuilder: React.FC = () => {
  return (
    <div className="workflow-builder h-screen overflow-hidden flex">
      <WorkflowProvider>
        <ReactFlowProvider>
          <NodePalette />
          <div className="flex-1 h-full">
            <Canvas />
            <PropertiesPanel />
          </div>
        </ReactFlowProvider>
      </WorkflowProvider>
    </div>
  );
};

export default WorkflowBuilder;