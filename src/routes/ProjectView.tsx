import React from 'react';
import { useParams } from 'react-router-dom';
import ArtifactEditor from '../components/editor/ArtifactEditor';
import { useEditorStore } from '../stores/useEditorStore';
import CrazyBoard from '../components/canvas/CrazyBoard';

const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Project ID
  const { activeNode } = useEditorStore();

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Pane: CrazyBoard */}
      <div className={`flex-1 relative border-r border-stone-200 transition-all duration-300 ${activeNode ? 'w-1/2' : 'w-full'}`}>
        <CrazyBoard />
      </div>

      {/* Right Pane: ArtifactEditor (only if activeNode is set) */}
      {activeNode && (
        <div className="w-1/2 h-full bg-white shadow-xl z-10 flex flex-col">
          <div className="flex-1 overflow-hidden">
             <ArtifactEditor />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
