# Agent Workflow Missions

This file defines the sequential "Missions" for building Re:Search.
Each mission is a self-contained unit of work for an autonomous agent.
**Usage:** "Spawn agent for Mission X".

---

## 🚀 Phase 0: Ignition

### Mission 0.1: Project Genesis
**Goal:** Initialize the raw Tauri + React + Tailwind project.
**Tasks:**
- [x] **Task 0.1**: Run `npm create tauri-app` (React/TS).
- [x] **Task 0.4**: Add `.gitignore`.
- [x] **Task 0.2**: Configure Tailwind CSS & PostCSS.
**Output:** A running Tauri app with Tailwind styles (`npm run tauri dev` works).

### Mission 0.2: Skeleton & Dependencies
**Goal:** scaffolding the directory structure and installing core libraries.
**Tasks:**
- [x] **Task 0.3**: Create full folder structure (Frontend `src/` & Backend `src-tauri/src/`).
- [x] **Task 0.5**: Install frontend deps (Zustand, ReactFlow, Tiptap).
- [x] **Task 0.6**: Install Rust deps (Rusqlite, Tokio, Serde).
**Output:** Project compiles (both Rust & JS side). All folders exist.

---

## 🏗️ Phase 1: The Foundation (CRUD & Editor)

### Mission 1.1: Data Layer (Rust)
**Goal:** Implement the SQLite database and basic Node operations.
**Tasks:**
- [x] **Task 1.2**: DB Init & Migrations (Tables: `nodes`, `edges`).
- [x] **Task 1.3**: Implement Node CRUD Commands (`create_node`, `get_node`, etc.).
- [x] **Task 1.4**: Implement FS Workspace Manager (Handle `.md` files).
**Output:** Rust backend compiles. Database `library.db` is created on run.

### Mission 1.2: State & Transport (Frontend)
**Goal:** Connect Frontend to Backend via strongly typed invokes and stores.
**Tasks:**
- [x] **Task 1.1**: Define TypeScript types (Node, Edge).
- [x] **Task 1.5**: Create `lib/tauri.ts` wrapper.
- [x] **Task 1.6**: Implement `useEditorStore` (Zustand).
- [x] **Task 1.10**: Implement `useAppStore` (Theme/Sidebar).
**Output:** Frontend can theoretically call backend (verify via console).

### Mission 1.3: The Editor
**Goal:** Build the Markdown editor UI and connect it to the file system.
**Tasks:**
- [x] **Task 1.7**: Build Tiptap `ArtifactEditor` & `Toolbar`.
- [x] **Task 1.8**: Build `MainLayout` & `Sidebar`.
- [x] **Task 1.9**: Setup React Router routes.
**Output:** User can create, edit, and save a Markdown note in the UI.

---

## 🕸️ Phase 2: The Visualizer (Graph)

### Mission 2.1: Graph Logic
**Goal:** Implement the graph data structure and backend commands.
**Tasks:**
- [x] **Task 2.2**: Implement Graph Commands (`connect_nodes`, `get_graph`).
- [x] **Task 2.1**: Implement `useCanvasStore`.
**Output:** Backend can store/retrieve edges. Store handles graph state.

### Mission 2.2: CrazyBoard UI
**Goal:** Build the React Flow canvas with custom nodes.
**Tasks:**
- [x] **Task 2.3**: Build Custom Nodes (`DocumentNode`, `SourceNode`, etc.).
- [x] **Task 2.4**: Build `CrazyBoard` component (DnD, Controls).
- [x] **Task 2.5**: Integrate into `ProjectView` (Split pane: Canvas + Editor).
**Output:** Drag-and-drop graph interface works. Double-click opens editor.

---

## 🧠 Phase 3: The Researcher (AI & Search)

### Mission 3.1: Ingestion Engine (Rust)
**Goal:** Build the scraping and vector database infrastructure.
**Tasks:**
- [x] **Task 3.1**: Integrate `sqlite-vec` & FTS5.
- [x] **Task 3.2**: Build Web Scraper (Fetcher + Readability + Chunker).
- [x] **Task 3.3**: Implement Embedding Pipeline (Ollama support).
**Output:** Backend can scrape a URL and vector-embed the content.

### Mission 3.2: Search & Chat
**Goal:** Implement semantic search and RAG chat.
**Tasks:**
- [x] **Task 3.4**: Implement `ingest_url` command.
- [x] **Task 3.5**: Implement `search_nodes` command (Hybrid search).
- [x] **Task 3.6**: Build `SearchDialog` UI.
- [x] **Task 3.7**: Implement RAG `chat` command.
- [x] **Task 3.8**: Build `ChatPanel` UI.
**Output:** User can search workspace (Cmd+K) and chat with sources.

---

## 🤖 Phase 4: The Agent (Autonomy)

### Mission 4.1: Agent Brain (Python)
**Goal:** Set up the LangGraph sidecar and basic tools.
**Tasks:**
- [x] **Task 4.1**: Setup Python environment & `agent.py` server.
- [x] **Task 4.2**: Define Agent Tools (Search, Read, Save).
- [x] **Task 4.3**: Implement Streaming Events (SSE -> Tauri Events).
**Output:** Python agent runs alongside Tauri and can execute tools.

### Mission 4.2: Agent UI (HUD)
**Goal:** Build the frontend interface for controlling the agent.
**Tasks:**
- [x] **Task 4.4**: Build `MissionConfig` modal.
- [x] **Task 4.5**: Build `AgentHUD` (Live logs, progress steps).
- [x] **Task 4.6**: Integrate into Dashboard.
- [x] **Task 4.7**: Build `SettingsPage` (LLM Config).
**Output:** Full "Deep Research" loop is functional from the UI.

---

## 💎 Phase 5: Polish

### Mission 5.1: Production Ready
**Goal:** Final cleanup, packaging, and testing.
**Tasks:**
- [ ] **Task 5.1**: Error Handling & Loading States.
- [ ] **Task 5.2**: Keyboard Shortcuts.
- [ ] **Task 5.3**: App Packaging (Bundle Python/SQLite extensions).
- [ ] **Task 5.4**: Run full test suite.
**Output:** Ship it.
