export type NodeType = 'document' | 'source' | 'concept' | 'image';

export interface NodeMetadata {
  [key: string]: any;
}

export interface Node {
  id: string;
  type: NodeType;
  title: string;
  contentPath: string;
  metadata: NodeMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
