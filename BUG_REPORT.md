# Bug Report: RE_ReSearch Project Audit

## 1. Critical Blockers (Must Fix)

### Backend Compilation Failure (Rust)
The Rust backend fails to compile, preventing the Tauri application from launching correctly. This is the root cause of the "invoke is undefined" error in the frontend.

**Errors:**
*   `error[E0433]: failed to resolve: could not find 'ai' in the crate root`
*   `error[E0616]: field '0' of struct 'tauri::State' is private`
*   `error[E0277]: the trait bound '[f32]: ToSql' is not satisfied`

**Root Causes:**
1.  **Missing Module Declaration**: `src-tauri/src/lib.rs` is missing `pub mod ai;`, so the `ai` module is not compiled.
2.  **Private Field Access**: `src-tauri/src/commands/ingest.rs` tries to access `state.0` on `tauri::State`, but `DbState` is not a tuple struct and `tauri::State` wraps it opaquely.
3.  **Type Mismatch in SQL**: `src-tauri/src/db/vec.rs` tries to insert a raw `&[f32]` slice into SQLite, but `rusqlite` requires a compatible type (like `Vec<u8>` or a JSON string for `sqlite-vec`).

**Proposed Fixes:**

1.  **`src-tauri/src/lib.rs`**: Add `pub mod ai;`.
2.  **`src-tauri/src/commands/ingest.rs`**:
    *   Change `let conn = state.0.lock().unwrap();` to `let conn = state.get_connection().map_err(|e| e.to_string())?;`.
    *   Ensure `DbState` in `src-tauri/src/db/mod.rs` exposes `get_connection`.
3.  **`src-tauri/src/db/vec.rs`**:
    *   In `index_node`, serialize `embedding` to a JSON string or raw bytes before insertion, depending on the `sqlite-vec` version. Since `commands/ingest.rs` already serializes to JSON, `db/vec.rs` should likely do the same or accept the JSON string.
    *   Update `index_node` signature or implementation to handle serialization.

### Frontend Runtime Errors
*   **`TypeError: Cannot read properties of undefined (reading 'invoke')`**: Caused by the backend failing to start (due to compilation errors above). Once the backend is fixed, this should resolve if running in the Tauri window.
*   **`Failed to fetch`**: Connection refused to `:8000/run`. This indicates the sidecar or external API server is not running.

## 2. Warnings & Non-Critical Issues

*   **React Flow**: `nodeTypes` or `edgeTypes` defined inside component. Move them outside or use `useMemo`.
*   **Unused Imports**: Several unused imports in Rust files (`AppHandle`, `Runtime`, `serde_json::json`).

## 3. Action Plan

1.  Fix `src-tauri/src/lib.rs` (add `pub mod ai;`).
2.  Fix `src-tauri/src/commands/ingest.rs` (fix state access).
3.  Fix `src-tauri/src/db/vec.rs` (fix embedding insertion).
4.  Re-run `npm run tauri dev` to verify compilation.
