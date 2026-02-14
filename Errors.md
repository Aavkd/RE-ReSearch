
reactflow.js?v=6ab10537:3538 [React Flow]: It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them. Help: https://reactflow.dev/error#002
useCanvasStore.ts:61 Failed to load graph: TypeError: Cannot read properties of undefined (reading 'invoke')
    at getGraphData (tauri.ts:25:16)
    at loadGraph (useCanvasStore.ts:40:29)
    at CrazyBoard.tsx:37:5

useCanvasStore.ts:61 Failed to load graph: TypeError: Cannot read properties of undefined (reading 'invoke')
    at getGraphData (tauri.ts:25:16)
    at loadGraph (useCanvasStore.ts:40:29)
    at CrazyBoard.tsx:37:5
2
reactflow.js?v=6ab10537:3538 [React Flow]: It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them. Help: https://reactflow.dev/error#002
useCanvasStore.ts:61 Failed to load graph: TypeError: Cannot read properties of undefined (reading 'invoke')
    at getGraphData (tauri.ts:25:16)
    at loadGraph (useCanvasStore.ts:40:29)
    at CrazyBoard.tsx:37:5
useCanvasStore.ts:61 Failed to load graph: TypeError: Cannot read properties of undefined (reading 'invoke')
    at getGraphData (tauri.ts:25:16)
    at loadGraph (useCanvasStore.ts:40:29)
    at CrazyBoard.tsx:37:5
general.js:992 Loading plugin $g
general.js:1742 Creating InlineText component
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:1730 Setting virtual anchor to 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:1730 Setting virtual anchor to 
Object
general.js:992 Getting variation 
Object
general.js:1730 Setting virtual anchor to 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
2
reactflow.js?v=6ab10537:3538 [React Flow]: It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them. Help: https://reactflow.dev/error#002
useCanvasStore.ts:61 Failed to load graph: TypeError: Cannot read properties of undefined (reading 'invoke')
    at getGraphData (tauri.ts:25:16)
    at loadGraph (useCanvasStore.ts:40:29)
    at CrazyBoard.tsx:37:5
useCanvasStore.ts:61 Failed to load graph: TypeError: Cannot read properties of undefined (reading 'invoke')
    at getGraphData (tauri.ts:25:16)
    at loadGraph (useCanvasStore.ts:40:29)
    at CrazyBoard.tsx:37:5
2
reactflow.js?v=6ab10537:3538 [React Flow]: It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them. Help: https://reactflow.dev/error#002
useCanvasStore.ts:61 Failed to load graph: TypeError: Cannot read properties of undefined (reading 'invoke')
    at getGraphData (tauri.ts:25:16)
    at loadGraph (useCanvasStore.ts:40:29)
    at CrazyBoard.tsx:37:5
useCanvasStore.ts:61 Failed to load graph: TypeError: Cannot read properties of undefined (reading 'invoke')
    at getGraphData (tauri.ts:25:16)
    at loadGraph (useCanvasStore.ts:40:29)
    at CrazyBoard.tsx:37:5
general.js:992 Loading plugin $g
general.js:1742 Creating InlineText component
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:1730 Setting virtual anchor to 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:1730 Setting virtual anchor to 
Object
general.js:992 Getting variation 
Object
general.js:1730 Setting virtual anchor to 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
general.js:1730 Setting virtual anchor to 
Object
general.js:992 Getting variation 
Object
general.js:992 Getting variation 
Object
:8000/run:1 
 Failed to load resource: net::ERR_CONNECTION_REFUSED
MissionConfig.tsx:56 Error starting mission: TypeError: Failed to fetch
    at handleStart (MissionConfig.tsx:27:30)
PS C:\Users\speee\.openclaw\workspace\RE_ReSearch> npm run tauri dev

> temp_tauri_init@0.1.0 tauri
> tauri dev

     Running BeforeDevCommand (`npm run dev`)

> temp_tauri_init@0.1.0 dev
> vite


  VITE v7.3.1  ready in 522 ms

  ➜  Local:   http://localhost:1420/
     Running DevCommand (`cargo  run --no-default-features --color always --`)
        Info Watching C:\Users\speee\.openclaw\workspace\RE_ReSearch\src-tauri for changes...
   Compiling temp_tauri_init v0.1.0 (C:\Users\speee\.openclaw\workspace\RE_ReSearch\src-tauri)
error[E0433]: failed to resolve: could not find `ai` in the crate root
 --> src\commands\ingest.rs:2:12
  |
2 | use crate::ai::embeddings::{embed_text, EmbeddingProvider};
  |            ^^ could not find `ai` in the crate root

error[E0433]: failed to resolve: could not find `ai` in the crate root
 --> src\commands\search.rs:3:12
  |
3 | use crate::ai::embeddings::{embed_text, EmbeddingProvider};
  |            ^^ could not find `ai` in the crate root

error[E0433]: failed to resolve: could not find `ai` in the crate root
 --> src\commands\chat.rs:3:12
  |
3 | use crate::ai::embeddings::{embed_text, EmbeddingProvider};
  |            ^^ could not find `ai` in the crate root

error[E0433]: failed to resolve: could not find `ai` in the crate root
 --> src\commands\chat.rs:4:12
  |
4 | use crate::ai::llm::{chat as llm_chat, ChatMessage};
  |            ^^ could not find `ai` in the crate root

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

error[E0616]: field `0` of struct `tauri::State` is private 
  --> src\commands\ingest.rs:69:22
   |
69 |     let conn = state.0.lock().unwrap();
   |                      ^ private field

warning: this function depends on never type fallback being `()`
   --> src\commands\ingest.rs:32:1
    |
 32 | / pub async fn ingest_url(
 33 | |     state: State<'_, DbState>,
 34 | |     url: String,
 35 | |     provider: String, // "ollama" or "gemini"
 36 | |     api_key: Option<String>,
 37 | | ) -> Result<Node, String> {
    | |_________________________^
    |
    = warning: this was previously accepted by the compiler but is being phased out; it will become a hard error in Rust 2024 and in a future release in all editions!
    = note: for more information, see <https://doc.rust-lang.org/edition-guide/rust-2024/never-type-fallback.html>
    = help: specify the types explicitly
note: in edition 2024, the requirement `!: Serialize` will fail
   --> src\commands\ingest.rs:109:52
    |
109 |         let embedding_json = serde_json::to_string(&embedding).map_err(|e| e.to_string())?;
    |                                                    ^^^^^^^^^^
    = note: `#[warn(dependency_on_unit_never_type_fallback)]` on by default
help: use `()` annotations to avoid fallback changes
    |
 96 |         let embedding: () = embed_text(chunk, &embedding_provider).await?;
    |                      ++++

warning: this function depends on never type fallback being `()`
  --> src\commands\search.rs:17:1
   |
17 | / pub async fn search_nodes(
18 | |     state: tauri::State<'_, DbState>,
19 | |     query: String,
20 | |     mode: String, // "fuzzy", "semantic", "hybrid"
21 | | ) -> Result<Vec<SearchResult>, String> {
   | |______________________________________^
   |
   = warning: this was previously accepted by the compiler but is being phased out; it will become a hard error in Rust 2024 and in a future release in all editions!
   = note: for more information, see <https://doc.rust-lang.org/edition-guide/rust-2024/never-type-fallback.html>
   = help: specify the types explicitly
note: in edition 2024, the requirement `!: Serialize` will fail
  --> src\commands\search.rs:59:52
   |
59 |         let embedding_json = serde_json::to_string(&embedding).map_err(|e| e.to_string())?;
   |                                                    ^^^^^^^^^^
help: use `()` annotations to avoid fallback changes
   |
58 |         let embedding: () = embed_text(&query, &provider).await?;
   |                      ++++

warning: this function depends on never type fallback being `()`
  --> src\commands\chat.rs:15:1
   |
15 | / pub async fn chat(
16 | |     state: tauri::State<'_, DbState>,
17 | |     message: String,
18 | |     history: Vec<ChatMessage>,
19 | | ) -> Result<String, String> {
   | |___________________________^
   |
   = warning: this was previously accepted by the compiler but is being phased out; it will become a hard error in Rust 2024 and in a future release in all editions!
   = note: for more information, see <https://doc.rust-lang.org/edition-guide/rust-2024/never-type-fallback.html>
   = help: specify the types explicitly
note: in edition 2024, the requirement `!: Serialize` will fail
  --> src\commands\chat.rs:23:48
   |
23 |     let embedding_json = serde_json::to_string(&embedding).map_err(|e| e.to_string())?;
   |                                                ^^^^^^^^^^
help: use `()` annotations to avoid fallback changes
   |
22 |     let embedding: () = embed_text(&message, &provider).await?;
   |                  ++++

error[E0277]: the trait bound `[f32]: ToSql` is not satisfied
   --> src\db\vec.rs:56:19
    |
 54 |     conn.execute(
    |          ------- required by a bound introduced by this call
 55 |         "INSERT INTO nodes_vec (node_id, embedding) VALUES (?1, ?2)",
 56 |         (node_id, embedding), // rusqlite might need a specific wrapper for float arrays depending on the extension binding      
    |                   ^^^^^^^^^ the trait `ToSql` is not implemented for `[f32]`
    |
    = help: the following other types implement trait `ToSql`:
              [u8; N]
              [u8]
    = note: required for `&[f32]` to implement `ToSql`
    = note: required for `(&str, &[f32])` to implement `Params`
note: required by a bound in `Connection::execute`
   --> C:\Users\speee\.cargo\registry\src\index.crates.io-1949cf8c6b5b557f\rusqlite-0.31.0\src\lib.rs:620:23
    |
620 |     pub fn execute<P: Params>(&self, sql: &str, params: P) -> Result<usize> {
    |                       ^^^^^^ required by this bound in `Connection::execute`

error[E0277]: the size for values of type `dyn StdError` cannot be known at compilation time
  --> src\lib.rs:25:25
   |
25 |                     Err(Box::new(e))
   |                         ^^^^^^^^^^^ doesn't have a size known at compile-time
   |
   = help: the trait `Sized` is not implemented for `dyn StdError`
   = help: the trait `StdError` is implemented for `Box<E>`
   = note: required for `Box<dyn StdError>` to implement `StdError`
   = note: required for the cast from `Box<Box<dyn StdError>>` to `Box<dyn StdError>`

Some errors have detailed explanations: E0277, E0433, E0616.
For more information about an error, try `rustc --explain E0277`.
warning: `temp_tauri_init` (lib) generated 6 warnings       
error: could not compile `temp_tauri_init` (lib) due to 7 previous errors; 9 warnings emitted
