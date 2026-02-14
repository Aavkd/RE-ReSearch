import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { StickyNote } from 'lucide-react';

const ConceptNode = ({ id, data }: NodeProps) => {
  return (
    <div className="px-4 py-4 shadow-lg rounded-md bg-yellow-100 border border-yellow-300 w-48 min-h-[100px] flex flex-col justify-center items-center text-center">
      <Handle type="target" position={Position.Top} className="!bg-yellow-500 w-2 h-2 rounded-full" />
      
      <StickyNote className="text-yellow-600 mb-2 opacity-50" size={24} />
      
      <div className="text-sm font-semibold text-yellow-900 leading-tight">
        {data.label || "New Concept"}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-yellow-500 w-2 h-2 rounded-full" />
    </div>
  );
};

export default memo(ConceptNode);
