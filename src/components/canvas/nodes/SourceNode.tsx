import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Globe } from 'lucide-react';

const SourceNode = ({ id, data }: NodeProps) => {
  return (
    <div className="px-2 py-2 shadow-sm rounded-full bg-white border border-blue-200 flex items-center min-w-[150px]">
      <Handle type="target" position={Position.Left} className="!bg-blue-500" />
      
      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-50 mr-2 flex-shrink-0">
        {data.favicon || data.metadata?.favicon ? (
          <img src={data.favicon || data.metadata?.favicon} alt="Favicon" className="w-4 h-4" />
        ) : (
          <Globe className="text-blue-500" size={16} />
        )}
      </div>
      
      <div className="text-xs font-medium text-blue-900 truncate max-w-[120px]">
        {data.label || data.domain || data.metadata?.domain || "Web Source"}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-blue-500" />
    </div>
  );
};

export default memo(SourceNode);
