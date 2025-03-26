/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { 
  Node, 
  Edge, 
  NodeChange, 
  EdgeChange, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  Connection 
} from '@xyflow/react';
import { toast } from 'sonner';
import { saveWorkflow, loadWorkflow } from '../services/api';
import { initialNodes, initialEdges } from '../utils/initialData';

// Define the action types
type ActionType =
  | { type: 'SET_NODES'; payload: Node[] }
  | { type: 'SET_EDGES'; payload: Edge[] }
  | { type: 'ADD_NODE'; payload: Node }
  | { type: 'UPDATE_NODE'; payload: { id: string; data: any } }
  | { type: 'REMOVE_NODE'; payload: string }
  | { type: 'APPLY_NODE_CHANGES'; payload: NodeChange[] }
  | { type: 'APPLY_EDGE_CHANGES'; payload: EdgeChange[] }
  | { type: 'ADD_EDGE'; payload: Connection }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }
  | { type: 'SAVE_WORKFLOW' }
  | { type: 'LOAD_WORKFLOW' }
  | { type: 'CLEAR_WORKFLOW' };

// Define the state type
interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  isLoading: boolean;
}

// Define the context type
interface WorkflowContextType extends WorkflowState {
  addNode: (node: Node) => void;
  updateNode: (id: string, data: any) => void;
  removeNode: (id: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (nodeId: string | null) => void;
  saveWorkflow: () => Promise<void>;
  loadWorkflow: () => Promise<void>;
  clearWorkflow: () => void;
}

// Initial state
const initialState: WorkflowState = {
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  isLoading: false,
};

// Create context
const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Create reducer
function workflowReducer(state: WorkflowState, action: ActionType): WorkflowState {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload };
    case 'SET_EDGES':
      return { ...state, edges: action.payload };
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.payload] };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.id
            ? { ...node, data: { ...node.data, ...action.payload.data } }
            : node
        ),
      };
    case 'REMOVE_NODE':
      return {
        ...state,
        selectedNodeId: state.selectedNodeId === action.payload ? null : state.selectedNodeId,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
        edges: state.edges.filter(
          (edge) => edge.source !== action.payload && edge.target !== action.payload
        ),
      };
    case 'APPLY_NODE_CHANGES':
      return { ...state, nodes: applyNodeChanges(action.payload, state.nodes) };
    case 'APPLY_EDGE_CHANGES':
      return { ...state, edges: applyEdgeChanges(action.payload, state.edges) };
    case 'ADD_EDGE':
      return { ...state, edges: addEdge(action.payload, state.edges) };
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNodeId: action.payload };
    case 'SAVE_WORKFLOW':
    case 'LOAD_WORKFLOW':
      return { ...state, isLoading: true };
    case 'CLEAR_WORKFLOW':
      return { ...state, nodes: [], edges: [], selectedNodeId: null };
    default:
      return state;
  }
}

// Create provider
export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  const addNode = useCallback((node: Node) => {
    dispatch({ type: 'ADD_NODE', payload: node });
  }, []);

  const updateNode = useCallback((id: string, data: any) => {
    dispatch({ type: 'UPDATE_NODE', payload: { id, data } });
  }, []);

  const removeNode = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NODE', payload: id });
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    dispatch({ type: 'APPLY_NODE_CHANGES', payload: changes });
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    dispatch({ type: 'APPLY_EDGE_CHANGES', payload: changes });
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    dispatch({ type: 'ADD_EDGE', payload: connection });
  }, []);

  const setSelectedNode = useCallback((nodeId: string | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: nodeId });
  }, []);

  const saveWorkflowAction = useCallback(async () => {
    try {
      dispatch({ type: 'SAVE_WORKFLOW' });
      await saveWorkflow({ nodes: state.nodes, edges: state.edges });
      toast.success('Workflow saved successfully!');
    } catch (error) {
      toast.error('Failed to save workflow');
      console.error('Error saving workflow:', error);
    }
  }, [state.nodes, state.edges]);

  const loadWorkflowAction = useCallback(async () => {
    try {
      dispatch({ type: 'LOAD_WORKFLOW' });
      const { nodes, edges } = await loadWorkflow();
      dispatch({ type: 'SET_NODES', payload: nodes });
      dispatch({ type: 'SET_EDGES', payload: edges });
      toast.success('Workflow loaded successfully!');
    } catch (error) {
      toast.error('Failed to load workflow');
      console.error('Error loading workflow:', error);
    }
  }, []);

  const clearWorkflow = useCallback(() => {
    dispatch({ type: 'CLEAR_WORKFLOW' });
    toast.info('Workflow cleared');
  }, []);

  const value = {
    ...state,
    addNode,
    updateNode,
    removeNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    saveWorkflow: saveWorkflowAction,
    loadWorkflow: loadWorkflowAction,
    clearWorkflow,
  };

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

// Create hook
export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
