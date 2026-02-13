import { invoke } from '@tauri-apps/api/core';
import { Node, NodeType } from '../types';

export const createNode = async (title: string, type: NodeType): Promise<Node> => {
  return await invoke<Node>('create_node', { title, type });
};

export const getNode = async (id: string): Promise<Node> => {
  return await invoke<Node>('get_node', { id });
};

export const saveNodeContent = async (id: string, content: string): Promise<void> => {
  await invoke('save_node_content', { id, content });
};

export const deleteNode = async (id: string): Promise<void> => {
  await invoke('delete_node', { id });
};
