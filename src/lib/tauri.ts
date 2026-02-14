import { invoke } from '@tauri-apps/api/core';
import { Node, Edge, NodeType } from '../types';

export const createNode = async (title: string, type: NodeType): Promise<Node> => {
  return await invoke<Node>('create_node', { title, type });
};

export const getNode = async (id: string): Promise<Node> => {
  return await invoke<Node>('get_node', { id });
};

export const saveNodeContent = async (id: string, content: string): Promise<void> => {
  await invoke('save_node_content', { id, content });
};

export const connectNodes = async (sourceId: string, targetId: string, label?: string): Promise<void> => {
  await invoke('connect_nodes', { sourceId, targetId, label });
};

export const disconnectNodes = async (sourceId: string, targetId: string): Promise<void> => {
  await invoke('disconnect_nodes', { sourceId, targetId });
};

export const getGraphData = async (): Promise<{ nodes: Node[], edges: Edge[] }> => {
  return await invoke('get_graph_data');
};

export const updateNodePosition = async (id: string, x: number, y: number): Promise<void> => {
  await invoke('update_node_position', { id, x, y });
};
