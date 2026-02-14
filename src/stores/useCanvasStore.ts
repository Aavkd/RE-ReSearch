import { create } from 'zustand';
import {
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
} from 'reactflow';
import { getGraphData, connectNodes, updateNodePosition } from '../lib/tauri';
import { Node as AppNode, Edge as AppEdge } from '../types';

interface CanvasState {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  loadGraph: () => Promise<void>;
  connectNodes: (connection: Connection) => Promise<void>;
  updateNodePosition: (id: string, x: number, y: number) => Promise<void>;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  loadGraph: async () => {
    // Guard: Ensure we are in a Tauri environment
    if (typeof window === 'undefined' || !('__TAURI__' in window)) {
        console.warn('loadGraph skipped: Not in Tauri environment');
        return;
    }

    try {
      const payload = await getGraphData();
      
      const nodes: ReactFlowNode[] = payload.nodes.map((node) => ({
        id: node.id,
        type: node.type || 'document', // Use the type from backend, default to document
        position: { 
          x: node.metadata?.x || Math.random() * 500, 
          y: node.metadata?.y || Math.random() * 500 
        },
        data: { label: node.title, ...node },
      }));

      const edges: ReactFlowEdge[] = payload.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      }));

      set({ nodes, edges });
    } catch (error) {
      console.error('Failed to load graph:', error);
    }
  },
  connectNodes: async (connection) => {
    if (!connection.source || !connection.target) return;
    
    try {
      await connectNodes(connection.source, connection.target, 'related');
      
      // Update local state immediately for responsiveness
      set({
        edges: addEdge(connection, get().edges),
      });
      
      // Optionally reload graph to get the real edge ID from backend
      // await get().loadGraph();
    } catch (error) {
      console.error('Failed to connect nodes:', error);
    }
  },
  updateNodePosition: async (id, x, y) => {
    try {
      await updateNodePosition(id, x, y);
    } catch (error) {
      console.error('Failed to update node position:', error);
    }
  },
}));
