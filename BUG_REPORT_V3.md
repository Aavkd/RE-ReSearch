# Bug Report V3: Immediate App Crash (vec0 missing)

## 1. Investigation Findings
Analysis of `RE_ReSearch/Errors.md` reveals the following:

- **Error Message:** `Error initializing database: no such module: vec0`
- **Panic Location:** `tauri::app::setup` hook.
- **Exit Code:** `101` (Rust panic).
- **Root Cause:** The application attempts to initialize the SQLite database (likely creating tables using `vec0`) but the `sqlite-vec` extension is not loaded into the SQLite connection. The `vec0` module is missing at runtime.

## 2. Technical Details
- The crash occurs immediately after launch during the `setup` phase.
- The `db::init()` function (or equivalent) executes SQL that depends on `vec0`, but the extension has not been loaded via `load_extension` or statically linked correctly.
- This is likely a missing DLL issue or an incorrect loading path for the `sqlite-vec` extension.

## 3. Recommended Fix
1.  **Verify DLL Presence:** Ensure the `sqlite-vec` dynamic library (e.g., `vec0.dll` on Windows) is present in a location accessible to the application (e.g., `src-tauri/target/debug` or bundled resources).
2.  **Load Extension Explicitly:** In the database initialization code (Rust), ensure `load_extension` is called on the SQLite connection *before* any tables using `vec0` are created.
3.  **Check Path:** Verify the path provided to `load_extension` is correct and absolute if necessary, or relative to the executable.

## 4. Next Steps for Developer
- Locate the `db::init` function in `src-tauri/src/db.rs` (or similar).
- Add or verify the `load_extension` call.
- Ensure the `vec0` binary is correctly copied to the output directory or bundled with Tauri.
