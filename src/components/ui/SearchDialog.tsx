import { useEffect, useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useEditorStore } from '../../stores/useEditorStore';
import { Search, Loader2, FileText, X } from 'lucide-react';
import clsx from 'clsx';

interface SearchResult {
  id: string;
  title: string;
  score: number;
  snippet: string;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const openArtifact = useEditorStore(state => state.openArtifact);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle on Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const res = await invoke<SearchResult[]>('search_nodes', { query, mode: 'hybrid' });
        setResults(res);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id: string) => {
    openArtifact(id);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[60vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
            placeholder="Search knowledge base..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {results.length === 0 && query && !loading && (
            <div className="text-center py-8 text-zinc-500">No results found.</div>
          )}
          
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result.id)}
              className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg group transition-colors flex items-start gap-3"
            >
              <div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {result.title}
                </div>
                {result.snippet && (
                  <div 
                    className="text-sm text-zinc-500 line-clamp-2 mt-1"
                    dangerouslySetInnerHTML={{ __html: result.snippet }} 
                  />
                )}
              </div>
            </button>
          ))}
          
          {results.length === 0 && !query && (
            <div className="text-center py-8 text-zinc-400 text-sm">
              Type to search across all your documents...
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex justify-between">
          <span>Search mode: Hybrid (Fuzzy + Semantic)</span>
          <div className="flex gap-2">
            <span className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Esc</span> to close
            <span className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Cmd K</span> to open
          </div>
        </div>
      </div>
    </div>
  );
}
