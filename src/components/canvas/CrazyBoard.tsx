import React, { useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  NodeTypes,
  Panel,
  ReactFlowProvider,
  Node,
  OnNodeDrag
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useCanvasStore } from '../../stores/useCanvasStore';
import DocumentNode from './nodes/DocumentNode';
import SourceNode from './nodes/SourceNode';
import ConceptNode from './nodes/ConceptNode';

const nodeTypes: NodeTypes = {
  document: DocumentNode,
  source: SourceNode,
  concept: ConceptNode,
};

const CrazyBoardInner = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    loadGraph, 
    updateNodePosition 
  } = useCanvasStore();

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const onNodeDragStop: OnNodeDrag = useCallback(
    (_, node) => {
      updateNodePosition(node.id, node.position.x, node.position.y);
    },
    [updateNodePosition]
  );

  return (
    <div className="w-full h-full bg-stone-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={16} size={1} color="#e5e5e4" />
        <Controls position="bottom-right" />
        <MiniMap 
          nodeStrokeColor={(n: Node) => {
            if (n.type === 'document') return '#a8a29e';
            if (n.type === 'source') return '#60a5fa';
            if (n.type === 'concept') return '#facc15';
            return '#eee';
          }}
          nodeColor={(n: Node) => {
            if (n.type === 'document') return '#fff';
            if (n.type === 'source') return '#eff6ff';
            if (n.type === 'concept') return '#fef9c3';
            return '#fff';
          }}
          style={{ height: 120 }} 
          zoomable 
          pannable 
        />
        <Panel position="top-left" className="bg-white/80 backdrop-blur p-2 rounded shadow text-xs font-mono text-stone-500">
          CrazyBoard v0.1
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default function CrazyBoard() {
  return (
    <ReactFlowProvider>
      <CrazyBoardInner />
    </ReactFlowProvider>
  );
}
