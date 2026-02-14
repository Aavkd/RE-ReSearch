use tauri::{command, State};
use crate::ai::embeddings::{embed_text, EmbeddingProvider};
use crate::db::DbState;
use crate::models::Node;
use crate::fs_manager::Workspace;
use reqwest::Client;
use scraper::{Html, Selector};
use uuid::Uuid;
use serde_json::json;
use chrono::Utc;

// Simple chunking function (split by paragraphs or fixed size)
fn chunk_text(text: &str, chunk_size: usize) -> Vec<String> {
    let mut chunks = Vec::new();
    let mut current_chunk = String::new();

    for paragraph in text.split("\n\n") {
        if current_chunk.len() + paragraph.len() > chunk_size {
            chunks.push(current_chunk.clone());
            current_chunk.clear();
        }
        current_chunk.push_str(paragraph);
        current_chunk.push_str("\n\n");
    }
    if !current_chunk.is_empty() {
        chunks.push(current_chunk);
    }
    chunks
}

#[command]
pub async fn ingest_url(
    state: State<'_, DbState>,
    url: String,
    provider: String, // "ollama" or "gemini"
    api_key: Option<String>,
) -> Result<Node, String> {
    let client = Client::new();
    let resp = client.get(&url).send().await.map_err(|e| e.to_string())?;
    let html_content = resp.text().await.map_err(|e| e.to_string())?;

    let document = Html::parse_document(&html_content);
    
    // Extract title
    let title_selector = Selector::parse("title").unwrap();
    let title = document.select(&title_selector).next().map(|e| e.text().collect::<String>()).unwrap_or("Untitled".to_string());

    // Extract body text
    let p_selector = Selector::parse("p").unwrap(); 
    let mut text_content = String::new();
    for element in document.select(&p_selector) {
        text_content.push_str(&element.text().collect::<Vec<_>>().join(" "));
        text_content.push_str("\n\n");
    }

    // Determine embedding provider
    let embedding_provider = match provider.as_str() {
        "ollama" => EmbeddingProvider::Ollama {
            model: "nomic-embed-text".to_string(), // Default embedding model
        },
        "gemini" => EmbeddingProvider::Gemini {
            api_key: api_key.ok_or("API key required for Gemini")?.to_string(),
        },
        _ => return Err("Invalid provider".to_string()),
    };

    let chunks = chunk_text(&text_content, 1000); // 1000 char chunks

    let conn = state.get_connection().map_err(|e| e.to_string())?;

    // 1. Create Source Node
    let node_id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    let node_type = "source".to_string();

    // Save content to file (optional, but good for retrieval)
    let ws = Workspace::new().map_err(|e| e.to_string())?;
    let filename = format!("{}.md", node_id);
    ws.write_artifact(&filename, text_content.as_bytes()).map_err(|e| e.to_string())?;

    let metadata = json!({
        "url": url,
        "chunk_count": chunks.len(),
        "provider": provider
    });

    conn.execute(
        "INSERT INTO nodes (id, node_type, title, content_path, metadata, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![node_id, node_type, title, filename, metadata.to_string(), now, now],
    ).map_err(|e| e.to_string())?;

    // 2. Process Chunks
    for (i, chunk) in chunks.iter().enumerate() {
        // Embed chunk
        let embedding = embed_text(chunk, &embedding_provider).await?;

        // Index chunk (Vector + FTS)
        // We use a composite ID for chunks or just index them associated with the node
        // The `nodes_vec` table schema is (id, node_id, embedding). 
        // We also need FTS. `nodes_fts` is (id, title, content).
        // For FTS, we might want to index the whole document under the node_id, 
        // or index chunks individually. The schema suggests `nodes_fts` uses `id` which is `UNINDEXED` but likely correlates to `nodes.id`.
        // If we want chunk-level search, we might need a separate table or a way to store chunk ID.
        // For now, let's index the *whole document* content into FTS once, and vectors for chunks.
        
        // Vector Insert
        // Serialize embedding to JSON string for sqlite-vec compatibility
        let embedding_json = serde_json::to_string(&embedding).map_err(|e| e.to_string())?;

        conn.execute(
            "INSERT INTO nodes_vec (node_id, embedding) VALUES (?1, ?2)",
            rusqlite::params![node_id, embedding_json], 
        ).map_err(|e| e.to_string())?;
    }

    // Index full text for FTS
    conn.execute(
        "INSERT INTO nodes_fts (id, title, content) VALUES (?1, ?2, ?3)",
        rusqlite::params![node_id, title, text_content],
    ).map_err(|e| e.to_string())?;

    Ok(Node {
        id: node_id,
        node_type,
        title,
        content_path: Some(filename),
        metadata: Some(metadata),
        created_at: now.clone(),
        updated_at: now,
    })
}
