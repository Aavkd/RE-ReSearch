PS C:\Users\speee\.openclaw\workspace\RE_ReSearch> npm run tauri dev  

> temp_tauri_init@0.1.0 tauri
> tauri dev

     Running BeforeDevCommand (`npm run dev`)

> temp_tauri_init@0.1.0 dev
> vite


  VITE v7.3.1  ready in 526 ms

  ➜  Local:   http://localhost:1420/
     Running DevCommand (`cargo  run --no-default-features --color always --`)
        Info Watching C:\Users\speee\.openclaw\workspace\RE_ReSearch\src-tauri for changes...
   Compiling temp_tauri_init v0.1.0 (C:\Users\speee\.openclaw\workspace\RE_ReSearch\src-tauri)
error[E0432]: unresolved import `crate::ai::llm`
 --> src\commands\chat.rs:4:16
  |
4 | use crate::ai::llm::{chat as llm_chat, ChatMessage};
  |                ^^^ could not find `llm` in `ai`

warning: unused imports: `AppHandle` and `Runtime`
 --> src\commands\nodes.rs:1:13
  |
1 | use tauri::{AppHandle, State, Runtime};
  |             ^^^^^^^^^         ^^^^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

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

warning: unused variable: `i`
  --> src\commands\ingest.rs:94:10
   |
94 |     for (i, chunk) in chunks.iter().enumerate() {
   |          ^ help: if this is intentional, prefix it with an underscore: `_i`
   |
   = note: `#[warn(unused_variables)]` on by default

error[E0277]: the size for values of type `dyn StdError` cannot be known at compilation time
  --> src\lib.rs:26:25
   |
26 |                     Err(Box::new(e))
   |                         ^^^^^^^^^^^ doesn't have a size known at compile-time
   |
   = help: the trait `Sized` is not implemented for `dyn StdError`
   = help: the trait `StdError` is implemented for `Box<E>`
   = note: required for `Box<dyn StdError>` to implement `StdError`
   = note: required for the cast from `Box<Box<dyn StdError>>` to `Box<dyn StdError>`

error: future cannot be sent between threads safely
   --> src\commands\ingest.rs:31:1
    |
 31 |   #[command]
    |   ^^^^^^^^^^ future returned by `ingest_url` is not `Send`
    |
   ::: src\lib.rs:31:25
    |
 31 |           .invoke_handler(tauri::generate_handler![
    |  _________________________-
 32 | |             create_node,
 33 | |             get_node,
 34 | |             save_node_content,
...   |
 42 | |             chat
 43 | |         ])
    | |_________- in this macro invocation
    |
    = help: within `tendril::tendril::NonAtomic`, the trait `Sync` is not implemented for `std::cell::Cell<usize>`
    = note: if you want to do aliasing and mutation between multiple threads, use `std::sync::RwLock` or `std::sync::atomic::AtomicUsize` instead
note: future is not `Send` as this value is used across an await
   --> src\commands\ingest.rs:96:64
    |
 42 |     let document = Html::parse_document(&html_content);
    |         -------- has type `scraper::Html` which is not `Send`
...
 96 |         let embedding = embed_text(chunk, &embedding_provider).await?;
    |                                                                ^^^^^ await occurs here, with `document` maybe used later
note: required by a bound in `ResultFutureTag::future`
   --> C:\Users\speee\.cargo\registry\src\index.crates.io-1949cf8c6b5b557f\tauri-2.10.2\src\ipc\command.rs:314:42
    |
310 |     pub async fn future<T, E, F>(self, value: F) -> Result<InvokeResponseBody, InvokeError>
    |                  ------ required by a bound in this associated function
...
314 |       F: Future<Output = Result<T, E>> + Send,
    |                                          ^^^^ required by this bound in `ResultFutureTag::future`
    = note: this error originates in the macro `__cmd__ingest_url` which comes from the expansion of the macro `tauri::generate_handler` (in Nightly builds, run with -Z macro-backtrace for more info)

Some errors have detailed explanations: E0277, E0432.       
For more information about an error, try `rustc --explain E0277`.
warning: `temp_tauri_init` (lib) generated 4 warnings       
error: could not compile `temp_tauri_init` (lib) due to 4 previous errors; 4 warnings emitted