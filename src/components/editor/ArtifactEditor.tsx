import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEditorStore } from '../../stores/useEditorStore';
import Toolbar from './Toolbar';

const ArtifactEditor: React.FC = () => {
  const { content, setContent, mode } = useEditorStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    editable: mode === 'edit',
    onUpdate: ({ editor }) => {
      // Create HTML content
      const html = editor.getHTML();
      // Update store
      setContent(html);
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-4',
      },
    },
  });

  // Update editor content when store content changes (e.g. loaded from backend)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editable state when mode changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(mode === 'edit');
    }
  }, [mode, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      {mode === 'edit' && <Toolbar editor={editor} />}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default ArtifactEditor;
