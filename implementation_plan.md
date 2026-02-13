Re:Search — Full Execution Plan
=============================

Current State
-------------

Documentation only. Zero source code, zero config files, zero dependencies. Everything must be built from scratch.

Plan Structure
--------------

The plan follows the 4-phase roadmap from ARCHITECTURE_REPORT.md, broken into discrete, implementable tasks with file targets, dependencies, and validation steps.
---
PHASE 0: Project Scaffolding & Toolchain Setup
----------------------------------------------

> Goal: A running Tauri + React app with all tooling configured. No features yet — just the skeleton.

Task 0.1 — Initialize Tauri 2.0 + React + Vite + TypeScript project

Files created:
- src-tauri/Cargo.toml — Rust dependencies (tauri, serde, serde_json, uuid, tokio)
- src-tauri/src/main.rs — Tauri entry point (minimal)
- src-tauri/src/lib.rs — Module root
- src-tauri/tauri.conf.json — App config (window title "Re:Search", dev server URL)
- src-tauri/capabilities/ — Tauri 2.0 permission capabilities
- package.json — Node dependencies
- vite.config.ts — Vite config with Tauri plugin
- tsconfig.json + tsconfig.node.json — TypeScript config
- index.html — Entry HTML
- src/main.tsx — React entry point
- src/App.tsx — Root component (placeholder)

Method: Use npm create tauri-app@latest with React+TS template, then verify.

Validation:
- npm run tauri dev launches a window with the React dev server
- No compilation errors in Rust or TypeScript

Dependencies: None (first task)
---
Task 0.2 — Configure Tailwind CSS

Files created/modified:
- tailwind.config.js — Content paths, dark mode config, typography plugin
- postcss.config.js — PostCSS pipeline
- src/index.css — Tailwind directives (@tailwind base/components/utilities)

Install: npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography

Validation:
- Tailwind utility classes render correctly in the browser
- Dark mode toggle works via class strategy

Dependencies: Task 0.1
---
Task 0.3 — Set up project structure (empty directories and barrel files)

Files created:
```text
src/
├── components/
│   ├── ui/              (Button.tsx, Input.tsx, Modal.tsx — stubs)
│   ├── canvas/
│   │   ├── nodes/
│   │   └── controls/
│   ├── editor/
│   │   └── extensions/
│   ├── dashboard/
│   └── agent/
├── stores/
├── layouts/
├── hooks/
├── routes/
├── lib/                 (utility functions, Tauri invoke wrappers)
│   └── tauri.ts         (typed invoke wrapper)
└── types/
    └── index.ts         (Node, Edge, NodeType TypeScript types)
```

For the Rust side:
```text
src-tauri/src/
├── main.rs
├── lib.rs
├── db/
│   └── mod.rs           (database module stub)
├── commands/
│   └── mod.rs           (Tauri command module stub)
├── scraper/
│   └── mod.rs           (web scraper module stub)
└── models/
    └── mod.rs           (Node, Edge structs)
```

Validation:
- Project compiles with no errors
- All modules are reachable from main.rs/lib.rs

Dependencies: Task 0.1
---
Task 0.4 — Add .gitignore

Files created:
- .gitignore — Ignore node_modules/, target/, dist/, .env, *.db

Dependencies: Task 0.1
---
Task 0.5 — Install core frontend dependencies

Install:
```text
npm install zustand reactflow @tiptap/react @tiptap/starter-kit @tiptap/pm
npm install react-router-dom
npm install -D @types/react @types/react-dom
```

Validation: npm run build succeeds with no errors

Dependencies: Task 0.1
---
Task 0.6 — Install core Rust dependencies

Modify: src-tauri/Cargo.toml

Add:
```toml
[dependencies]
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
uuid = { version = "1", features = ["v4"] }
rusqlite = { version = "0.31", features = ["bundled"] }
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
scraper = "0.18"
```

Validation: cargo build in src-tauri/ succeeds

Dependencies: Task 0.1
---
PHASE 1: The Foundation (MVP)
-----------------------------

> Goal: Create, edit, and persist Markdown notes. SQLite database with the Universal Node model. Basic CRUD through Tauri commands.

Task 1.1 — Define TypeScript types matching the data model

File: src/types/index.ts

Purpose: Define NodeType enum, Node interface, Edge interface, GraphPayload interface matching the Rust structs in DOCS_BACKEND.md (Section 2).

Validation: Types compile, no any types used

Dependencies: Task 0.3
---
Task 1.2 — Implement SQLite database initialization (Rust)

Files:
- src-tauri/src/db/mod.rs — Connection pool setup, migration runner
- src-tauri/src/db/migrations.rs — SQL schema from DOCS_BACKEND.md Section 3.1 (nodes table, edges table, indexes)

Purpose: On app startup, create library.db in the app data directory. Run migrations to create nodes, edges tables with all columns per spec (id, node_type, title, content_path, metadata, created_at, updated_at).

Validation:
- App launches and creates library.db
- Tables exist with correct schema (verify via sqlite3 CLI)
- Idempotent: re-running doesn't error

Dependencies: Task 0.6
---
Task 1.3 — Implement Node CRUD Tauri commands (Rust)

Files:
- src-tauri/src/models/mod.rs — Node and Edge structs with Serialize/Deserialize
- src-tauri/src/commands/nodes.rs — Four Tauri commands:
  - create_node(title, node_type) -> Node
  - get_node(id) -> Node
  - save_node_content(id, content) -> ()
  - delete_node(id) -> ()
- src-tauri/src/commands/mod.rs — Re-export commands
- src-tauri/src/main.rs — Register commands with .invoke_handler()

Purpose: Full CRUD for the Universal Node model. create_node generates a UUID, inserts into DB, and creates the file on disk if type is Artifact. save_node_content writes to the filesystem and updates updated_at.

Validation:
- Call each command from the browser devtools via window.__TAURI__.invoke()
- Verify DB rows are created/updated/deleted
- Verify .md files appear in workspace/artifacts/

Dependencies: Task 1.2
---
Task 1.4 — Implement file system workspace structure (Rust)

File: src-tauri/src/fs_manager.rs

Purpose: On first run, create the workspace directory structure per DOCS_BACKEND.md Section 4.1:
```text
~/.research_data/
  /artifacts
  /sources
  /assets
  library.db
```

Functions:
- ensure_workspace() — Creates dirs if missing
- read_artifact(path) -> String — Read .md file
- write_artifact(path, content) — Write .md file with YAML frontmatter
- delete_artifact(path) — Remove file

Validation:
- Directories are created on first launch
- Writing and reading a .md file round-trips correctly
- Frontmatter is correctly serialized/deserialized

Dependencies: Task 1.2
---
Task 1.5 — Create Tauri invoke wrapper (Frontend)

File: src/lib/tauri.ts

Purpose: Typed wrapper around @tauri-apps/api/core's invoke(). One function per Tauri command with proper TypeScript signatures. Centralizes all IPC in one place.
```ts
export async function createNode(title: string, nodeType: NodeType): Promise<Node> { ... }
export async function getNode(id: string): Promise<Node> { ... }
export async function saveNodeContent(id: string, content: string): Promise<void> { ... }
export async function deleteNode(id: string): Promise<void> { ... }
```

Validation: Calling createNode("Test", "artifact") from a component works end-to-end

Dependencies: Task 1.1, Task 1.3
---
Task 1.6 — Implement Zustand EditorStore
File: src/stores/useEditorStore.ts
Purpose: Per DOCS_FRONTEND.md Section 3 — manages:
- activeNode: Node | null
- content: string
- isDirty: boolean
- mode: 'edit' | 'preview'
- Actions: openArtifact(id), saveContent(), setMode()
openArtifact calls the Tauri backend to load content. saveContent calls saveNodeContent.
Validation:
- Opening a node loads its content
- Editing sets isDirty = true
- Saving clears dirty state and persists to disk
Dependencies: Task 1.5
---
Task 1.7 — Implement Tiptap Artifact Editor
Files:
- src/components/editor/ArtifactEditor.tsx — Main editor component using Tiptap
- src/components/editor/Toolbar.tsx — Formatting toolbar (Bold, Italic, Headings, Lists, Code)
- src/components/editor/extensions/ — Custom extension configs
Install: npm install @tiptap/extension-placeholder @tiptap/extension-typography @tiptap/extension-code-block-lowlight lowlight
Purpose: Per DOCS_FRONTEND.md Section 5:
- Headless Tiptap editor with StarterKit
- Placeholder extension ("Type '/' for commands...")
- Markdown serialization (content stored as Markdown, not HTML)
- Floating bubble menu for formatting
- Connects to useEditorStore for loading/saving
Validation:
- Editor renders and accepts input
- Bold/Italic/Heading formatting works
- Content serializes to Markdown
- Saving persists to disk via Tauri backend
- Re-opening the same node restores content exactly
Dependencies: Task 0.5, Task 1.6
---
Task 1.8 — Build Dashboard & MainLayout
Files:
- src/layouts/MainLayout.tsx — Split-pane layout (sidebar + main area)
- src/components/ui/Sidebar.tsx — Navigation sidebar (Home, Projects, Search, Settings icons)
- src/components/dashboard/HeroInput.tsx — Large input: "What do you want to research today?" (initially disabled or just logs to console)
- src/components/dashboard/RecentProjects.tsx — Placeholder grid
- src/routes/DashboardPage.tsx — Compose HeroInput + RecentProjects
Purpose: Per DOCS_FRONTEND.md Section 8 — the Dashboard is the entry point. Even if "Deep Research" isn't ready, the UI should be there.
Validation:
- App launches to the Dashboard
- Sidebar renders and collapses
- Navigation items are clickable
- HeroInput renders
Dependencies: Task 0.2
---
Task 1.9 — Set up React Router
Files:
- src/routes/DashboardPage.tsx — Placeholder
- src/routes/ProjectView.tsx — Placeholder (will host Canvas + Editor)
- src/routes/SettingsPage.tsx — Placeholder
- src/App.tsx — Modify to include <BrowserRouter> and <Routes>
Purpose: Per DOCS_FRONTEND.md Section 9 — routing between Dashboard, Project, and Settings views.
Validation:
- URL / renders DashboardPage
- URL /project/:id renders ProjectView
- URL /settings renders SettingsPage
- Sidebar links navigate correctly
Dependencies: Task 1.8
---
Task 1.10 — Implement Zustand AppStore
File: src/stores/useAppStore.ts
Purpose: Per DOCS_FRONTEND.md Section 3 — manages:
- theme: 'light' | 'dark'
- sidebarOpen: boolean
- modalState: { type: string, data: any } | null
- Actions: toggleTheme(), toggleSidebar(), openModal(), closeModal()
Validation:
- Theme toggle switches between light/dark (Tailwind dark: classes)
- Sidebar state is correctly reflected in MainLayout
Dependencies: Task 0.5
---
PHASE 1 CHECKPOINT
------------------

Validate the entire phase:
1. npm run tauri dev launches the app
2. User can create a new note from the UI
3. Tiptap editor loads, user can write Markdown
4. Saving writes a .md file with YAML frontmatter to ~/.research_data/artifacts/
5. Re-opening the note restores the content
6. SQLite DB has the correct row in nodes
7. Dark mode toggle works
---
PHASE 2: The Visualizer (Crazy Board)
------------------------------------

> Goal: Infinite canvas with React Flow. Nodes are visual cards representing DB nodes. Users can create connections.

Task 2.1 — Implement Zustand CanvasStore
File: src/stores/useCanvasStore.ts
Purpose: Per DOCS_FRONTEND.md Section 3:
- nodes: ReactFlowNode[]
- edges: ReactFlowEdge[]
- viewport: { x, y, zoom }
- Actions: addNode(), connectNodes(), updateNodePosition(), onNodesChange(), onEdgesChange(), loadGraph()
loadGraph() calls a Tauri command to fetch all nodes/edges and maps them to React Flow format.
Validation:
- Store initializes with empty arrays
- Adding/removing nodes updates state correctly
Dependencies: Task 0.5, Task 1.1
---
Task 2.2 — Implement Graph Tauri commands (Rust)
Files:
- src-tauri/src/commands/graph.rs:
  - connect_nodes(source, target, label) -> () — Insert into edges table
  - get_graph_data() -> GraphPayload — Returns all nodes + edges
  - update_node_position(id, x, y) -> () — Store canvas position in node metadata JSON
  - disconnect_nodes(source, target) -> () — Delete from edges table
Register in main.rs.
Validation:
- Creating an edge persists to DB
- get_graph_data returns correct structure
- Position updates are persisted in metadata
Dependencies: Task 1.3
---
Task 2.3 — Build custom React Flow node types
Files:
- src/components/canvas/nodes/DocumentNode.tsx — Shows title + content snippet, icon. Double-click to open editor.
- src/components/canvas/nodes/SourceNode.tsx — Shows favicon + domain name for web sources.
- src/components/canvas/nodes/ConceptNode.tsx — Simple label (sticky note style).
- src/components/canvas/nodes/ImageNode.tsx — Thumbnail preview.
Purpose: Per DOCS_FRONTEND.md Section 4 — each node type has distinct visual treatment with connection handles (top/bottom or left/right).
Validation:
- Each node type renders distinctly
- Handles are visible and functional
- Double-clicking DocumentNode triggers openArtifact()
Dependencies: Task 0.5
---
Task 2.4 — Build the CrazyBoard component
File: src/components/canvas/CrazyBoard.tsx
Purpose: Main React Flow wrapper per DOCS_FRONTEND.md Section 4:
- Registers custom node types
- Dotted background pattern
- MiniMap + Controls
- fitView on initial load
- Context menu (right-click): "Add Note", "Paste Link"
- Drag-to-connect creates edges (calls connect_nodes)
- Node drag updates position (calls update_node_position)
- Connects to useCanvasStore
Validation:
- Canvas renders with dotted background
- Existing DB nodes appear as cards
- Dragging a connection between two nodes creates an edge (persisted)
- Right-click context menu appears
- MiniMap shows overview
Dependencies: Task 2.1, Task 2.2, Task 2.3
---
Task 2.5 — Integrate CrazyBoard into ProjectView
File: src/routes/ProjectView.tsx
Purpose: ProjectView becomes a split view:
- Left: CrazyBoard (Canvas)
- Right: ArtifactEditor (opens when a node is double-clicked)
- Resizable split pane (consider react-resizable-panels)
Install: npm install react-resizable-panels
Validation:
- /project/:id shows canvas on left, editor on right
- Double-clicking a node on canvas opens it in editor
- Split pane resizes smoothly
Dependencies: Task 2.4, Task 1.7
---
PHASE 2 CHECKPOINT
------------------

1. Navigate to a project — canvas shows all nodes
2. Right-click canvas → "Add Note" → new node appears
3. Double-click node → editor opens on the right
4. Drag connection between two nodes → edge is created
5. Refresh the app → all positions and edges persist
6. MiniMap accurately reflects the graph
---
PHASE 3: The Researcher (Search + Ingestion + RAG)
-------------------------------------------------

> Goal: Ingest web content, embed it, search semantically, and chat with the knowledge base.

Task 3.1 — Integrate sqlite-vec extension (Rust)
Files:
- src-tauri/src/db/vec.rs — Load sqlite-vec extension at runtime, create nodes_vec virtual table
- Modify src-tauri/src/db/migrations.rs — Add FTS5 virtual table (nodes_fts) and vector table creation
Purpose: Per DOCS_BACKEND.md Section 3.2 — enable hybrid search (keyword via FTS5 + semantic via sqlite-vec).
Bundle: Include the sqlite-vec shared library (.dll/.so/.dylib) in src-tauri/resources/.
Validation:
- nodes_fts and nodes_vec tables are created on startup
- Insert a test embedding — similarity search returns it
- FTS5 keyword search returns results
Dependencies: Task 1.2
---
Task 3.2 — Build the Web Scraper (Rust)
Files:
- src-tauri/src/scraper/mod.rs — Orchestrator
- src-tauri/src/scraper/fetcher.rs — HTTP fetch with reqwest, user-agent, rate limiting
- src-tauri/src/scraper/parser.rs — HTML parsing with scraper crate, readability extraction
- src-tauri/src/scraper/chunker.rs — Text chunking (split into ~500-token semantic chunks)
Purpose: Per DOCS_AI_CORE.md Section 4 — given a URL:

1. Fetch HTML
2. Extract clean text (readability algorithm)
3. Chunk into passages
4. Return chunks for embedding
Validation:
- Scrape a known URL (e.g., a Wikipedia article) and verify clean text extraction
- Chunker produces chunks of ~500 tokens
- Rate limiting respects delays between requests
Dependencies: Task 0.6
---
Task 3.3 — Implement Embedding pipeline
Files:
- src-tauri/src/ai/mod.rs — AI module root
- src-tauri/src/ai/embeddings.rs — Embedding generation:
  - Support Ollama local embeddings (HTTP call to localhost:11434)
  - Support OpenAI embeddings API (optional, if API key configured)
  - Function: embed_text(text: &str) -> Vec<f32>
Validation:
- With Ollama running locally, embedding a sentence returns a vector of correct dimension
- Fallback to OpenAI works if configured
- Error handling for when no embedding provider is available
Dependencies: Task 0.6
---
Task 3.4 — Build the Ingestion Pipeline Tauri command
Files:
- src-tauri/src/commands/ingest.rs:
  - ingest_url(url: String) -> Node — Orchestrates: Fetch → Parse → Chunk → Embed → Store
  - Creates a Source node in DB
  - Stores raw HTML in ~/.research_data/sources/
  - Inserts chunks into nodes_fts and embeddings into nodes_vec
Register in main.rs.
Validation:
- ingest_url("https://en.wikipedia.org/wiki/Battery") creates:
  - A Source node in nodes table
  - FTS entries in nodes_fts
  - Vector entries in nodes_vec
  - Raw content file in /sources/
- Semantic search for "battery chemistry" returns the ingested content
Dependencies: Task 3.1, Task 3.2, Task 3.3
---
Task 3.5 — Implement Search Tauri command
File: src-tauri/src/commands/search.rs:
- search_nodes(query, mode) -> Vec<SearchResult>:
  - mode: "fuzzy" → FTS5 query
  - mode: "semantic" → Embed query → sqlite-vec similarity search
  - mode: "hybrid" → Both, merged and re-ranked
Validation:
- Fuzzy search finds nodes by keyword
- Semantic search finds conceptually similar content (not just keyword match)
- Hybrid combines both result sets
Dependencies: Task 3.1, Task 3.3
---
Task 3.6 — Build Search UI component
Files:
- src/components/ui/SearchDialog.tsx — Global search modal (Cmd+K to open)
- src/hooks/useSearch.ts — Hook wrapping the search Tauri command with debounce
- src/hooks/useKeyboardShortcuts.ts — Keyboard shortcut manager
Purpose: Search across all nodes. Toggle between fuzzy/semantic/hybrid modes. Results show as a list with node type icons, titles, and snippets. Clicking a result navigates to the node.
Validation:
- Cmd+K opens search dialog
- Typing a query shows results within 200ms
- Mode toggle changes search behavior
- Clicking a result opens the node
Dependencies: Task 3.5, Task 1.5
---
Task 3.7 — Implement "Chat with Knowledge Base" (RAG)
Files:
- src-tauri/src/ai/chat.rs:
  - chat_with_kb(question: String, history: Vec<Message>) -> String
  - Pipeline: Embed question → Retrieve top-k chunks → Construct prompt with context → Call LLM → Return answer
- src-tauri/src/ai/llm.rs:
  - call_llm(prompt: String, model: String) -> String
  - Supports Ollama (local) and OpenAI (cloud)
- src-tauri/src/commands/chat.rs:
  - chat(question, history) -> ChatResponse — Tauri command
Validation:
- After ingesting a source, asking a question about its content returns a grounded answer
- Answers cite which chunks were used
- Works with Ollama locally
Dependencies: Task 3.4, Task 3.5
---
Task 3.8 — Build Chat UI component
Files:
- src/components/chat/ChatPanel.tsx — Sliding panel with message history
- src/components/chat/ChatMessage.tsx — Individual message (user/assistant/system)
- src/components/chat/SourceCitation.tsx — Clickable citation linking to source nodes
- src/stores/useChatStore.ts — Zustand store for chat history
Purpose: Chat panel slides in from the right. User types a question, gets a RAG-grounded answer with citations. Citations link back to source nodes on the canvas.
Validation:
- Chat panel opens/closes
- User messages appear immediately
- AI response streams in (or appears after loading)
- Citations are clickable and navigate to source nodes
Dependencies: Task 3.7
---
PHASE 3 CHECKPOINT
------------------

1. Paste a URL → system ingests, scrapes, chunks, embeds, and creates a Source node
2. Source node appears on the canvas
3. Cmd+K search finds content by keyword and by semantic meaning
4. Open chat panel → ask a question → get a grounded answer with citations
5. Click citation → navigates to the source node
---
PHASE 4: The Agent (Autonomous Researcher)
-----------------------------------------

> Goal: LangGraph-powered research agent that can plan, search, scrape, and synthesize autonomously.

Task 4.1 — Set up Python sidecar for LangGraph
Files:
- src-tauri/python/ — Python sidecar directory
- src-tauri/python/requirements.txt — langgraph, langchain, httpx
- src-tauri/python/agent.py — Entry point (HTTP server on localhost, Tauri spawns it)
- src-tauri/python/researcher/ — Agent module
  - graph.py — LangGraph state machine definition
  - tools.py — Tool definitions (search_web, read_page, save_note)
  - state.py — Agent state schema
Tauri side:
- src-tauri/src/ai/sidecar.rs — Spawn and manage the Python process, communicate via HTTP/JSON
Purpose: Per DOCS_AI_CORE.md Section 2 — the Researcher Agent is a stateful LangGraph graph:
Plan → Search → Evaluate → Scrape → Synthesize → (loop or complete)
Validation:
- cargo build bundles the Python sidecar
- Sidecar starts on app launch (or on-demand)
- HTTP endpoint /run accepts a goal and streams progress events
- Agent can execute a simple multi-step research task
Dependencies: Phase 3 complete
---
Task 4.2 — Define Agent tools (bridge to Rust backend)
File: src-tauri/python/researcher/tools.py
Tools the agent can use (calling back into Rust via HTTP):
1. search_web(query) — Uses the Rust scraper to search
2. read_page(url) — Fetches and parses a URL via Rust scraper
3. save_note(title, content) — Creates an Artifact node via Rust command
4. search_knowledge_base(query) — Semantic search via Rust command
5. create_connection(source_id, target_id, label) — Links nodes
Validation:
- Each tool successfully calls the Rust backend and returns results
- Error handling works (bad URLs, timeouts)
Dependencies: Task 4.1
---
Task 4.3 — Implement Agent streaming events
Files:
- src-tauri/src/commands/agent.rs:
  - run_research_agent(goal) -> () — Starts agent, emits Tauri events for progress
  - Uses Tauri's event system (app.emit()) to stream: agent:status, agent:log, agent:source_found, agent:phase_change, agent:complete
- src-tauri/src/ai/sidecar.rs — Parse SSE/streaming responses from Python sidecar and re-emit as Tauri events
Validation:
- Frontend receives real-time events during agent execution
- Events contain structured data (phase, message, source URL, etc.)
Dependencies: Task 4.1, Task 4.2
---
Task 4.4 — Build Mission Configuration modal
Files:
- src/components/dashboard/MissionConfig.tsx — Modal with:
  - Goal text input (with LLM auto-suggestion)
  - Depth selector: "Quick Overview" / "Deep Dive"
  - Output format: "New Project" / "Summary Doc" / "Append to Existing"
  - "Start Mission" button
Purpose: Per DOCS_FRONTEND.md Section 8.B — appears when user enters a research prompt.
Validation:
- Modal opens from Dashboard HeroInput
- All form fields work
- "Start Mission" calls run_research_agent and transitions to Agent HUD
Dependencies: Task 1.9
---
Task 4.5 — Build the Agent HUD (Heads-Up Display)
Files:
- src/components/agent/AgentHUD.tsx — Main container for agent progress UI
- src/components/agent/StatusTicker.tsx — Current action text ("Searching for...")
- src/components/agent/LiveLog.tsx — Scrolling terminal-like log of actions
- src/components/agent/ResourceStream.tsx — Horizontal card stream of found sources
- src/components/agent/PlanStepper.tsx — Phase visualization (Planning → Exploration → Synthesis → Report)
- src/stores/useAgentStore.ts — Zustand store for agent state, listens to Tauri events
Purpose: Per DOCS_FRONTEND.md Section 8.C — transparency UI showing the agent's thought process in real-time.
Validation:
- HUD appears when agent is running
- StatusTicker updates in real-time
- LiveLog scrolls and shows all actions
- ResourceStream shows cards as sources are found
- PlanStepper advances through phases
- On completion, user can view the generated artifact
Dependencies: Task 4.3, Task 4.4
---
Task 4.6 — Integrate Agent into Dashboard (Connect Functionality)
Files:
- src/routes/DashboardPage.tsx — Enable the "Mission Config" functionality
- src/components/dashboard/HeroInput.tsx — Connect "Enter" key to Mission Config modal
- Ensure RecentProjects.tsx loads data from DB (Task 1.3)
Purpose: Connect the Dashboard UI (built in Task 1.8) to the backend Agent logic (built in Task 4.3).
Validation:
- Typing in HeroInput triggers the Mission Config modal
- "Start Mission" launches the Agent HUD
- Recent projects show actual saved data
Dependencies: Task 1.8, Task 4.4, Task 4.5
---
Task 4.7 — Build Settings page
File: src/routes/SettingsPage.tsx
Sections:
- LLM Provider selection (Ollama / OpenAI / Anthropic)
- API key input (stored securely)
- Local model selection (list from Ollama)
- Theme toggle
- Workspace path configuration
Validation:
- Settings persist across app restarts (stored in DB or config file)
- Changing LLM provider affects subsequent AI operations
Dependencies: Task 1.9
---
PHASE 4 CHECKPOINT
------------------

1. Enter a research goal on the Dashboard
2. Configure mission depth and output format
3. Agent HUD shows real-time progress
4. Agent searches the web, scrapes pages, and synthesizes findings
5. Final artifact appears as a new node on the project canvas
6. All sources are linked as edges to the artifact
---
PHASE 5: Polish & Production Readiness
-------------------------------------

Task 5.1 — Error handling & loading states
- Add error boundaries to React components
- Loading skeletons for canvas/editor
- Toast notifications for errors (scraping failures, DB errors)
- Install: npm install sonner (toast library) or react-hot-toast
Validation:
- Errors are caught and displayed gracefully (no white screens)
- Loading states appear while data fetches
Dependencies: Phase 4 complete
---
Task 5.2 — Keyboard shortcuts
- Cmd+K — Search
- Cmd+S — Save current editor
- Cmd+N — New note
- Escape — Close modals/panels
- Cmd+B — Toggle sidebar
File: src/hooks/useKeyboardShortcuts.ts (extend from Task 3.6)
Validation:
- All shortcuts work on both Mac (Cmd) and Windows (Ctrl)
- Shortcuts don't conflict with browser/OS defaults
Dependencies: Phase 4 complete
---
Task 5.3 — App packaging & distribution
Configure for production builds:
- tauri.conf.json — App icon, window dimensions, title, identifier
- Bundle sqlite-vec extension per platform (.dll for Windows, .so for Linux, .dylib for macOS)
- Bundle Python sidecar as a standalone executable (PyInstaller) or make it a separate install step
- Configure Tauri's resource bundling for all platform-specific binaries
Files:
- src-tauri/tauri.conf.json — Update build/bundle configuration
- src-tauri/icons/ — App icons in required formats
Validation:
- npm run tauri build produces installable binaries for the target platform
- App launches from the built binary without a dev server
- sqlite-vec loads correctly from bundled resources
- Python sidecar starts correctly from bundled binary
Dependencies: Phase 4 complete
---
Task 5.4 — Testing strategy
Rust unit tests:
- src-tauri/src/db/tests.rs — DB initialization, CRUD, FTS5 queries, vector queries
- src-tauri/src/scraper/tests.rs — HTML parsing, chunking, rate limiting
- src-tauri/src/models/tests.rs — Serialization/deserialization round-trips
- Run with: cargo test in src-tauri/
Frontend component tests:
- Install: npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
- src/stores/__tests__/ — Zustand store unit tests
- src/components/__tests__/ — Component render tests
- Run with: npx vitest
Integration tests:
- Full flow: create note → edit → save → reopen → verify content
- Full flow: ingest URL → search → verify results
- Full flow: start agent mission → verify events → verify output
Validation:
- cargo test passes with zero failures
- npx vitest passes with zero failures
- All integration flows succeed end-to-end
Dependencies: Phase 4 complete
---
DEPENDENCY GRAPH (Summary)
-------------------------

```text
Phase 0 (Scaffolding)
  ├── 0.1 Tauri+React init
  │     ├── 0.2 Tailwind
  │     ├── 0.3 Directory structure
  │     ├── 0.4 .gitignore
  │     ├── 0.5 Frontend deps
  │     └── 0.6 Rust deps
  │
Phase 1 (Foundation)          ← depends on Phase 0
  ├── 1.1 TypeScript types    ← 0.3
  ├── 1.2 SQLite init         ← 0.6
  ├── 1.3 Node CRUD           ← 1.2
  ├── 1.4 FS workspace        ← 1.2
  ├── 1.5 Tauri invoke wrapper← 1.1, 1.3
  ├── 1.6 EditorStore         ← 1.5
  ├── 1.7 Tiptap Editor       ← 0.5, 1.6
  ├── 1.8 MainLayout          ← 0.2
  ├── 1.9 React Router        ← 1.8
  └── 1.10 AppStore           ← 0.5
  │
Phase 2 (Visualizer)          ← depends on Phase 1
  ├── 2.1 CanvasStore         ← 0.5, 1.1
  ├── 2.2 Graph commands      ← 1.3
  ├── 2.3 Custom nodes        ← 0.5
  ├── 2.4 CrazyBoard          ← 2.1, 2.2, 2.3
  └── 2.5 ProjectView         ← 2.4, 1.7
  │
Phase 3 (Researcher)          ← depends on Phase 2
  ├── 3.1 sqlite-vec          ← 1.2
  ├── 3.2 Web Scraper         ← 0.6
  ├── 3.3 Embeddings          ← 0.6
  ├── 3.4 Ingestion pipeline  ← 3.1, 3.2, 3.3
  ├── 3.5 Search command      ← 3.1, 3.3
  ├── 3.6 Search UI           ← 3.5, 1.5
  ├── 3.7 RAG Chat backend    ← 3.4, 3.5
  └── 3.8 Chat UI             ← 3.7
  │
Phase 4 (Agent)               ← depends on Phase 3
  ├── 4.1 Python sidecar      ← Phase 3
  ├── 4.2 Agent tools         ← 4.1
  ├── 4.3 Streaming events    ← 4.1, 4.2
  ├── 4.4 Mission Config      ← 1.9
  ├── 4.5 Agent HUD           ← 4.3, 4.4
  ├── 4.6 Dashboard           ← 1.9, 4.4
  └── 4.7 Settings            ← 1.9
  │
Phase 5 (Polish)              ← depends on Phase 4
  ├── 5.1 Error handling
  ├── 5.2 Keyboard shortcuts
  ├── 5.3 App packaging
  └── 5.4 Testing
```
---
KEY RISK NOTES
-------------

| Risk | Mitigation |
| :--- | :--- |
| sqlite-vec bundling — Platform-specific shared library must be bundled correctly | Test on Windows/Mac/Linux early. Add to tauri.conf.json resources. |
| Python sidecar distribution — Bundling Python with Tauri is non-trivial | Consider PyInstaller to create a single executable, or make it a separate install step. Alternative: port agent logic to Rust using llm-chain crate. |
| Ollama dependency — Users must install Ollama separately | Add a first-run wizard that checks for Ollama and guides installation. Degrade gracefully if unavailable. |
| Scraping reliability — Sites may block, return JS-rendered content | Start with static HTML scraping. Consider headless browser (Playwright) as a future enhancement. |
| FTS5/sqlite-vec conflicts — Two extensions on one SQLite connection | Test thoroughly. May need separate connections or careful loading order. |
| Tiptap Markdown serialization — Lossy conversion between ProseMirror JSON and Markdown | Use @tiptap/pm and tiptap-markdown. Test round-trip fidelity early with complex documents. |
| Large graph performance — React Flow with 1000+ nodes may lag | Implement virtualization, lazy-load node content, batch position updates with debouncing. |
---
TOTAL TASK COUNT: ~33 discrete tasks across 6 phases (0-5)
ESTIMATED CRITICAL PATH: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
PARALLELIZABLE WORK WITHIN PHASES:
- Phase 0: Tasks 0.2-0.6 can all run in parallel after 0.1
- Phase 1: Tasks 1.1, 1.2, 1.8, 1.10 can start in parallel; 1.3-1.7 are sequential
- Phase 2: Tasks 2.1, 2.2, 2.3 can run in parallel; 2.4-2.5 are sequential
- Phase 3: Tasks 3.1, 3.2, 3.3 can run in parallel; 3.4+ are sequential
- Phase 4: Tasks 4.1-4.3 (backend) and 4.4-4.6 (frontend) can be developed in parallel