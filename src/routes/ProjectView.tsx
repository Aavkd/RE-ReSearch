import React from 'react';
import { useParams } from 'react-router-dom';
import ArtifactEditor from '../components/editor/ArtifactEditor';
import { useEditorStore } from '../stores/useEditorStore';

const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openArtifact } = useEditorStore();

  React.useEffect(() => {
    if (id) {
      openArtifact(id);
    }
  }, [id, openArtifact]);

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 p-4 overflow-hidden">
        <h1 className="text-xl font-bold mb-4">Project: {id}</h1>
        <ArtifactEditor />
      </div>
    </div>
  );
};

export default ProjectView;
