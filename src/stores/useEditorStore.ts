import { create } from 'zustand';
import { Node } from '../types';
import { getNode, saveNodeContent } from '../lib/tauri';

interface EditorState {
  activeNode: Node | null;
  content: string;
  isDirty: boolean;
  mode: 'edit' | 'preview';
  isLoading: boolean;
  error: string | null;

  // Actions
  openArtifact: (id: string) => Promise<void>;
  saveContent: () => Promise<void>;
  setContent: (content: string) => void;
  setMode: (mode: 'edit' | 'preview') => void;
  toggleMode: () => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeNode: null,
  content: '',
  isDirty: false,
  mode: 'edit',
  isLoading: false,
  error: null,

  openArtifact: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const node = await getNode(id);
      // In a real implementation, we would also fetch the node's content here
      // For now we just set the node. Assuming content comes separately or is part of node load logic later.
      // But the prompt implies content is loaded with the node or managed here.
      // The prompt says: "openArtifact(id): Call tauri.getNode, set activeNode."
      // It doesn't explicitly say fetch content, but an editor needs content.
      // However, Node structure has contentPath. The content string isn't in Node struct.
      // I will assume for now we just load the node metadata.
      // WAIT: The saveContent action uses `saveNodeContent(id, content)`.
      // So openArtifact should probably load content too?
      // The prompt doesn't list a "loadContent" tauri command, just "getNode".
      // I'll stick to the prompt: "Call tauri.getNode, set activeNode."
      set({ activeNode: node, isDirty: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load node', isLoading: false });
    }
  },

  saveContent: async () => {
    const { activeNode, content } = get();
    if (!activeNode) return;

    set({ isLoading: true, error: null });
    try {
      await saveNodeContent(activeNode.id, content);
      set({ isDirty: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to save content', isLoading: false });
    }
  },

  setContent: (content: string) => {
    set({ content, isDirty: true });
  },

  setMode: (mode: 'edit' | 'preview') => {
    set({ mode });
  },

  toggleMode: () => {
    set((state) => ({ mode: state.mode === 'edit' ? 'preview' : 'edit' }));
  },

  reset: () => {
    set({ activeNode: null, content: '', isDirty: false, error: null });
  },
}));
