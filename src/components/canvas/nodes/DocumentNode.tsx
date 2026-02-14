import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';
import { useEditorStore } from '../../../stores/useEditorStore';

const DocumentNode = ({ id, data }: NodeProps) => {
  const openArtifact = useEditorStore((state) => state.openArtifact);

  const handleDoubleClick = () => {
    openArtifact(id);
  };

  return (
    <div 
      className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 w-64"
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} className="w-16 !bg-stone-500" />
      
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-stone-100 mr-3">
          <FileText className="text-stone-600" size={20} />
        </div>
        <div>
          <div className="text-sm font-bold text-stone-900">{data.label}</div>
          <div className="text-xs text-stone-500">{data.snippet || data.metadata?.snippet || "No snippet available"}</div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-stone-500" />
    </div>
  );
};

export default memo(DocumentNode);
