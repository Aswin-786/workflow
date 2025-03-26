
import { Node, Edge } from '@xyflow/react';

// Type for the workflow data
interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
}

// Mock API with localStorage persistence
export const saveWorkflow = async (data: WorkflowData): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate API delay
      setTimeout(() => {
        localStorage.setItem('workflow', JSON.stringify(data));
        console.log('Workflow saved:', data);
        resolve();
      }, 800);
    } catch (error) {
      console.error('Error saving workflow:', error);
      reject(error);
    }
  });
};

export const loadWorkflow = async (): Promise<WorkflowData> => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate API delay
      setTimeout(() => {
        const savedWorkflow = localStorage.getItem('workflow');
        
        if (savedWorkflow) {
          const parsedWorkflow = JSON.parse(savedWorkflow) as WorkflowData;
          console.log('Workflow loaded:', parsedWorkflow);
          resolve(parsedWorkflow);
        } else {
          reject(new Error('No saved workflow found'));
        }
      }, 800);
    } catch (error) {
      console.error('Error loading workflow:', error);
      reject(error);
    }
  });
};
