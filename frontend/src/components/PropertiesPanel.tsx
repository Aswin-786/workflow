
import React from 'react';
import { X } from 'lucide-react';
import { useWorkflow } from '@/context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const PropertiesPanel: React.FC = () => {
  const { nodes, selectedNodeId, updateNode, removeNode, setSelectedNode } = useWorkflow();
  
  // Find the selected node
  const selectedNode = selectedNodeId 
    ? nodes.find(node => node.id === selectedNodeId) 
    : null;

  if (!selectedNode) {
    return null;
  }

  // Handle node property updates
  const handleChange = (field: string, value: string) => {
    updateNode(selectedNode.id, { 
      ...selectedNode.data,
      [field]: value 
    });
  };

  // Handle node deletion
  const handleDelete = () => {
    if (selectedNodeId) {
      removeNode(selectedNodeId);
    }
  };

  // Close the panel
  const closePanel = () => {
    setSelectedNode(null);
  };

  return (
    <div 
    className={cn(
      "properties-panel open animate-slide-in-right",
      "fixed sm:w-80 w-full h-full sm:h-full top-0  right-0 bg-white shadow-lg p-4 z-50",
      " overflow-y-auto"
    )}
  >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Node Properties</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={closePanel}
          className="h-8 w-8"
          aria-label="Close properties panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="nodeType">Type</Label>
          <div className="p-2 bg-muted/50 rounded-md text-sm mt-1" id="nodeType">
            {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
          </div>
        </div>

        <div>
          <Label htmlFor="nodeLabel">Label</Label>
          <Input
            id="nodeLabel"
            value={selectedNode.data.label as string || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="nodeDescription">Description</Label>
          <Textarea
            id="nodeDescription"
            value={selectedNode.data.description as string || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="mt-1 resize-none"
            rows={3}
          />
        </div>

        {selectedNode.type === 'decision' && (
          <div className="space-y-4 pt-3 border-t">
            <h4 className="text-sm font-medium">Decision Paths</h4>
            <div>
              <Label htmlFor="yesPath">Yes Path</Label>
              <Input
                id="yesPath"
                value={selectedNode.data.yesPath as string || ''}
                onChange={(e) => handleChange('yesPath', e.target.value)}
                className="mt-1"
                placeholder="E.g., If condition is true..."
              />
            </div>
            <div>
              <Label htmlFor="noPath">No Path</Label>
              <Input
                id="noPath"
                value={selectedNode.data.noPath as string || ''}
                onChange={(e) => handleChange('noPath', e.target.value)}
                className="mt-1"
                placeholder="E.g., If condition is false..."
              />
            </div>
          </div>
        )}

        {selectedNode.type === 'process' && (
          <div className="space-y-4 pt-3 border-t">
            <h4 className="text-sm font-medium">Process Details</h4>
            <div>
              <Label htmlFor="processAction">Action</Label>
              <Input
                id="processAction"
                value={selectedNode.data.action as string || ''}
                onChange={(e) => handleChange('action', e.target.value)}
                className="mt-1"
                placeholder="E.g., Send email, Update database..."
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t mt-4">
          <Button variant="destructive" size="sm" onClick={handleDelete} className="w-full">
            Delete Node
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
