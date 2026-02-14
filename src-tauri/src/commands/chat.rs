use tauri::command;
use crate::db::DbState;
use crate::ai::embeddings::{embed_text, EmbeddingProvider};
use crate::ai::llm::{chat as llm_chat, ChatMessage};
use rusqlite::params;
use serde_json::json;

#[derive(serde::Deserialize)]
pub struct ChatRequest {
    pub message: String,
    pub history: Vec<ChatMessage>,
}

#[command]
pub async fn chat(
    state: tauri::State<'_, DbState>,
    message: String,
    history: Vec<ChatMessage>,
) -> Result<String, String> {
    // 1. Retrieve Context via Vector Search
    let provider = EmbeddingProvider::Ollama { model: "nomic-embed-text".to_string() };
    let embedding = embed_text(&message, &provider).await?;
    let embedding_json = serde_json::to_string(&embedding).map_err(|e| e.to_string())?;

    let context = {
        let conn = state.get_connection().map_err(|e| e.to_string())?;
        
        // Search for top 3 relevant chunks
        let mut stmt = conn.prepare(
            "SELECT n.title, n.content_path, fts.content, v.distance
             FROM nodes_vec v
             JOIN nodes n ON v.node_id = n.id
             JOIN nodes_fts fts ON n.id = fts.id
             WHERE v.embedding MATCH ?
             ORDER BY v.distance
             LIMIT 3"
        ).map_err(|e| e.to_string())?;

        let context_rows = stmt.query_map(params![embedding_json], |row| {
            let title: String = row.get(0)?;
            let content: String = row.get(2)?; 
            Ok(format!("Title: {}\nContent: {}\n", title, content))
        }).map_err(|e| e.to_string())?;

        let mut context_parts = Vec::new();
        for row in context_rows {
            if let Ok(c) = row {
                context_parts.push(c);
            }
        }

        context_parts.join("\n---\n")
    }; // conn is dropped here

    // 2. Construct System Prompt
    let system_prompt = format!(
        "You are a helpful research assistant. Answer the user's question based ONLY on the following context:\n\n{}\n\nIf the answer is not in the context, say so.",
        context
    );

    // 3. Prepare Messages
    let mut final_messages = Vec::new();
    final_messages.push(ChatMessage {
        role: "system".to_string(),
        content: system_prompt,
    });
    final_messages.extend(history);
    final_messages.push(ChatMessage {
        role: "user".to_string(),
        content: message,
    });

    // 4. Call LLM
    llm_chat(final_messages, Some("ministral-3:8b".to_string())).await
}
