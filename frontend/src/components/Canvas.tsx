import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  OnConnectStartParams,
  Connection,
  Edge,
  useReactFlow,
  BackgroundVariant,
} from "@xyflow/react";
import { nodeTypes } from "./nodes/NodeTypes";
import { useWorkflow } from "@/context/WorkflowContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Save, FileUp, Trash2 } from "lucide-react";

const Canvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    saveWorkflow,
    loadWorkflow,
    clearWorkflow,
  } = useWorkflow();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  // Handle node click to show properties
  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  // Handle drop event to add new node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (reactFlowWrapper.current) {
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();
        const nodeData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );

        // Get position from drop coordinates
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Create a new node
        const newNode = {
          id: `node_${Date.now()}`,
          type: nodeData.type,
          position,
          data: nodeData.data || { label: `${nodeData.type} node` },
        };

        // Add the new node to the workflow
        reactFlowInstance.addNodes(newNode);
      }
    },
    [reactFlowInstance]
  );

  // Allow dropping by preventing default
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Background pattern settings
  const backgroundPattern = {
    variant: BackgroundVariant.Dots as BackgroundVariant,
    gap: 20,
    size: 1,
  };

  return (
    <div ref={reactFlowWrapper} className="workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
        defaultEdgeOptions={{
          animated: true,
          type: "smoothstep",
        }}
      >
        <Background {...backgroundPattern} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "start":
                return "#E9F7FF";
              case "process":
                return "#F2F2F7";
              case "decision":
                return "#FFF4E4";
              default:
                return "#ffffff";
            }
          }}
          maskColor="rgba(240, 240, 240, 0.6)"
        />
        <Panel position="top-right" className="flex gap-4 flex-col">
          <Button
            size="sm"
            variant="secondary"
            className="bg-gray-200 backdrop-blur-sm shadow-sm flex gap-2"
            onClick={() => saveWorkflow()}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-gray-200 backdrop-blur-sm shadow-sm flex gap-2"
            onClick={() => loadWorkflow()}
          >
            <FileUp className="w-4 h-4" />
            <span className="hidden sm:inline">Load</span>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-gray-200 backdrop-blur-sm shadow-sm flex gap-2"
            onClick={() => clearWorkflow()}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Canvas;
