use tauri::command;
use crate::db::DbState;
use crate::ai::embeddings::{embed_text, EmbeddingProvider};
use serde::{Serialize, Deserialize};
use rusqlite::params;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SearchResult {
    pub id: String,
    pub title: String,
    pub score: f32,
    pub snippet: String,
}

#[command]
pub async fn search_nodes(
    state: tauri::State<'_, DbState>,
    query: String,
    mode: String, // "fuzzy", "semantic", "hybrid"
) -> Result<Vec<SearchResult>, String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;

    let mut results: HashMap<String, SearchResult> = HashMap::new();

    // 1. Fuzzy Search (FTS5)
    if mode == "fuzzy" || mode == "hybrid" {
        let mut stmt = conn.prepare(
            "SELECT id, title, snippet(nodes_fts, 2, '<b>', '</b>', '...', 10) as snippet, rank 
             FROM nodes_fts 
             WHERE nodes_fts MATCH ? 
             ORDER BY rank 
             LIMIT 20"
        ).map_err(|e| e.to_string())?;
        
        let fuzzy_rows = stmt.query_map(params![query], |row| {
            Ok(SearchResult {
                id: row.get(0)?,
                title: row.get(1)?,
                score: row.get::<_, f64>(3)? as f32, // FTS rank is usually negative (lower is better) or positive depending on config. standard FTS5 bm25 is negative.
                snippet: row.get(2)?,
            })
        }).map_err(|e| e.to_string())?;

        for row in fuzzy_rows {
            if let Ok(r) = row {
                results.insert(r.id.clone(), r);
            }
        }
    }

    // 2. Semantic Search (Vector)
    if mode == "semantic" || mode == "hybrid" {
        // Embed query
        // Assume default provider (Ollama) for search query embedding if not specified?
        // Or re-use the same provider config? For now, hardcode Ollama default or use env.
        let provider = EmbeddingProvider::Ollama { model: "nomic-embed-text".to_string() };
        let embedding = embed_text(&query, &provider).await?;
        let embedding_json = serde_json::to_string(&embedding).map_err(|e| e.to_string())?;

        // Vector search query
        // Assuming `vec_distance_cosine` or `vec_top_k` depending on sqlite-vec usage.
        // Standard sqlite-vec usage:
        // SELECT rowid, distance FROM nodes_vec WHERE embedding MATCH ? ORDER BY distance LIMIT 20
        // We need to join with `nodes` to get title/content.
        // `nodes_vec` has `node_id` which links to `nodes.id`.
        
        let mut stmt = conn.prepare(
            "SELECT n.id, n.title, v.distance 
             FROM nodes_vec v
             JOIN nodes n ON v.node_id = n.id
             WHERE v.embedding MATCH ?
             ORDER BY v.distance
             LIMIT 20"
        ).map_err(|e| e.to_string())?;

        let vector_rows = stmt.query_map(params![embedding_json], |row| {
            Ok(SearchResult {
                id: row.get(0)?,
                title: row.get(1)?,
                score: 1.0 - (row.get::<_, f32>(2)?), // Convert distance to similarity score
                snippet: "".to_string(), // Vector search doesn't give snippets easily without retrieving content
            })
        }).map_err(|e| e.to_string())?;

        for row in vector_rows {
            if let Ok(mut r) = row {
                // If existing result from fuzzy, merge/boost?
                if let Some(existing) = results.get(&r.id) {
                    // Simple merge: average score or take max?
                    // FTS rank is weird, let's just favor vector score for sorting if hybrid
                    r.snippet = existing.snippet.clone(); 
                }
                results.insert(r.id.clone(), r);
            }
        }
    }

    let mut final_results: Vec<SearchResult> = results.into_values().collect();
    // Sort by score descending
    final_results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal));
    
    Ok(final_results)
}
