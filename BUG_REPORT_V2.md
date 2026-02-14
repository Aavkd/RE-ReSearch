# Bug Audit Report - V2

## 1. Executive Summary

The application is suffering from a critical frontend crash due to an uninitialized Tauri API client (`invoke` is undefined) and backend concurrency issues causing "File Lock" timeouts. The search functionality is failing due to improper error handling in the `ingest` command and likely network request failures.

## 2. Findings

### 2.1 Frontend Runtime Errors
*   **Critical Crash**: `TypeError: Cannot read properties of undefined (reading 'invoke')` in `useCanvasStore.ts`.
    *   **Cause**: The `invoke` function from `@tauri-apps/api/core` is likely being called before the Tauri environment is fully ready or there is a mismatch in the import/bundler configuration. In the provided logs, `CrazyBoard` calls `loadGraph` which calls `getGraphData` which calls `invoke`.
    *   **Location**: `src/lib/tauri.ts` (implied) and `src/stores/useCanvasStore.ts`.
*   **React Flow Warning**: `CrazyBoard.tsx` re-creates `nodeTypes` on every render.
    *   **Impact**: Performance degradation, but not a crasher.
*   **Search Failure**: `TypeError: Failed to fetch` in `MissionConfig.tsx`.
    *   **Cause**: The backend `ingest_url` or `chat` command is failing (likely panicking or returning a raw error string) and the frontend isn't handling it gracefully.

### 2.2 Backend/Rust Issues
*   **Concurrency/Async Safety**: The compiler output shows `future cannot be sent between threads safely` errors in `src-tauri/src/commands/chat.rs`.
    *   **Cause**: `rusqlite::Connection` and `rusqlite::Statement` are not thread-safe (`!Sync` and `!Send`). They are being held across `.await` points in async functions. Tauri commands are executed on separate threads, so all state and variables held across await points must be `Send`.
    *   **Specifics**:
        *   `let mut stmt = conn.prepare(...)` is held while `llm_chat(...).await` is called.
        *   `conn` (RefCell) is not thread-safe.
*   **"File Lock" on Build**: The `Blocking waiting for file lock on build directory` message suggests multiple `cargo` instances or a zombie process holding the lock. This is often a development environment artifact but can halt the server start.
*   **Ingest Command**:
    *   `src-tauri/src/commands/ingest.rs`:
        *   Uses `reqwest` which is good, but `resp.text().await` reads the whole body into memory.
        *   Does not handle `robots.txt` or user-agent blocking (common cause of 403s).
        *   `unwrap()` on title selector selector parsing is risky if HTML is malformed.
        *   **CRITICAL**: `rusqlite` interaction inside `ingest_url` might also suffer from the same `!Send` issue if `conn` is held across the `embed_text` await call. (Checked code: `conn` is obtained *before* the loop, but `embed_text` is awaited inside the loop. If `conn` is held, it will panic or fail to compile if `state` management isn't thread-safe). *Correction*: `embed_text` is awaited, and `conn` is used in `conn.execute`. If `conn` is a `MutexGuard` or similar from `DbState`, holding it across `await` is a deadlock risk or `!Send` error.

## 3. Action Plan

### 3.1 Fix Backend Async Safety (High Priority)
*   **Refactor `chat` command**:
    *   Do not hold `rusqlite::Statement` or `Connection` across `.await` points.
    *   Gather all data needed from the DB *synchronously* or in a block that doesn't await, *then* call the LLM.
    *   Example: Fetch context strings into a `Vec<String>`, drop the DB lock/connection, *then* call `llm_chat`.
*   **Refactor `ingest_url` command**:
    *   Ensure `embed_text` (async) is not called while holding a synchronous DB lock.
    *   Batch embeddings generation first, *then* insert into DB in a single synchronous transaction.

### 3.2 Fix Frontend Initialization
*   **Verify Tauri Import**: Ensure `src/lib/tauri.ts` imports `invoke` correctly.
    *   Current: `import { invoke } from '@tauri-apps/api/core';`
    *   Action: Verify `@tauri-apps/api` version matches `tauri.conf.json`.
*   **Safety Check**: Add a check in `useCanvasStore` or `CrazyBoard` to ensure `window.__TAURI__` is defined before making calls, or wrap in try/catch to show a "Not connected to backend" message.

### 3.3 Infrastructure
*   **Kill Zombie Processes**: User needs to run `taskkill /F /IM cargo.exe` (Windows) or `pkill cargo` to clear file locks.
*   **Database Locking**: Switch to a connection pool (like `r2d2_sqlite`) or `tauri_plugin_sql` if raw `rusqlite` proves too difficult to manage with async Tauri commands. For now, scoping the lock usage is the fastest fix.

## 4. Recommended Code Fixes

### Fix `chat.rs` (Move DB logic before await)
```rust
// ... inside chat function
// 1. Get Context (Synchronous block)
let context_str = {
    let conn = state.get_connection().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("...")...;
    // ... execute query and collect string results ...
    results.join("\n")
}; // conn and stmt are dropped here

// 2. Call LLM (Async, no DB lock held)
llm_chat(..., context_str).await
```

### Fix `ingest.rs`
*   Move `embed_text` calls outside the loop if possible, or release DB lock between iterations (inefficient).
*   Better: Generate all embeddings first (if memory allows) or batch them.
*   Then open DB connection and insert.

### Fix `CrazyBoard.tsx`
*   Move `nodeTypes` definition *outside* the component function or wrap in `useMemo`.
