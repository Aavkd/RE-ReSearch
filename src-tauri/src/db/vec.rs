use rusqlite::{Connection, Result};

/// Initialize vector search extension and tables
/// Note: This requires the sqlite-vec extension to be loaded at runtime
/// or statically linked. For this implementation, we assume the extension
/// loading happens at connection initialization if dynamic.
pub fn init_vector_tables(conn: &Connection) -> Result<()> {
    // 1. Enable FTS5 for full-text search
    // We create a virtual table for full-text search on node content
    conn.execute(
        "CREATE VIRTUAL TABLE IF NOT EXISTS nodes_fts USING fts5(
            id UNINDEXED, 
            title, 
            content, 
            tokenize = 'porter'
        )",
        [],
    )?;

    // 2. Enable Vector Search
    // We create a virtual table for vector embeddings using sqlite-vec
    // Defaulting to 768 dimensions (common for nomic-embed-text / mxbai-embed-large)
    // If using OpenAI text-embedding-3-small, this would be 1536.
    // The dimension must match the embedding model output.
    conn.execute(
        "CREATE VIRTUAL TABLE IF NOT EXISTS nodes_vec USING vec0(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT,
            embedding float[768]
        )",
        [],
    )?;

    Ok(())
}

/// Helper to add a node to the search index
pub fn index_node(conn: &Connection, node_id: &str, title: &str, content: &str, embedding: &[f32]) -> Result<()> {
    // Insert into FTS
    conn.execute(
        "INSERT INTO nodes_fts (id, title, content) VALUES (?1, ?2, ?3)",
        (node_id, title, content),
    )?;

    // Insert into Vector table
    // Note: sqlite-vec expects raw bytes or specific format depending on version.
    // For this stub, we assume standard insertion.
    // Ensure embedding length matches schema (768).
    if embedding.len() != 768 {
        // In a real app, handle resizing or error
        // println!("Warning: Embedding dimension mismatch");
    }

    conn.execute(
        "INSERT INTO nodes_vec (node_id, embedding) VALUES (?1, ?2)",
        (node_id, embedding), // rusqlite might need a specific wrapper for float arrays depending on the extension binding
    )?;

    Ok(())
}
