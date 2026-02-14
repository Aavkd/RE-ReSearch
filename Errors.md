PS C:\Users\speee\.openclaw\workspace\RE_ReSearch> npm run tauri dev

> temp_tauri_init@0.1.0 tauri
> tauri dev

     Running BeforeDevCommand (`npm run dev`)

> temp_tauri_init@0.1.0 dev
> vite


  VITE v7.3.1  ready in 500 ms

  ➜  Local:   http://localhost:1420/
     Running DevCommand (`cargo  run --no-default-features --color always --`)
        Info Watching C:\Users\speee\.openclaw\workspace\RE_ReSearch\src-tauri for changes...
   Compiling temp_tauri_init v0.1.0 (C:\Users\speee\.openclaw\workspace\RE_ReSearch\src-tauri)
warning: unused import: `std::env`
 --> src\ai\llm.rs:3:5
  |
3 | use std::env;
  |     ^^^^^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

warning: unused imports: `AppHandle` and `Runtime`
 --> src\commands\nodes.rs:1:13
  |
1 | use tauri::{AppHandle, State, Runtime};
  |             ^^^^^^^^^         ^^^^^^^

warning: unused import: `serde_json::json`
 --> src\commands\chat.rs:6:5
  |
6 | use serde_json::json;
  |     ^^^^^^^^^^^^^^^^

warning: unused import: `tauri::ipc::Response`
 --> src\fs_manager.rs:4:5
  |
4 | use tauri::ipc::Response;
  |     ^^^^^^^^^^^^^^^^^^^^

warning: `temp_tauri_init` (lib) generated 4 warnings (run `cargo fix --lib -p temp_tauri_init` to apply 4 suggestions)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 29.93s
     Running `target\debug\temp_tauri_init.exe`
Error initializing database: no such module: vec0

thread 'main' panicked at C:\Users\speee\.cargo\registry\src\index.crates.io-1949cf8c6b5b557f\tauri-2.10.2\src\app.rs:1299:11:
Failed to setup app: error encountered during setup hook: no such module: vec0
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
[0214/180124.340:ERROR:ui\gfx\win\window_impl.cc:124] Failed to unregister class Chrome_WidgetWin_0. Error = 1412
error: process didn't exit successfully: `target\debug\temp_tauri_init.exe` (exit code: 101)