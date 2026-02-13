use tauri::{AppHandle, State, Runtime};
use crate::db::DbState;
use crate::models::Node;
use crate::fs_manager::Workspace;
use rusqlite::params;
use serde_json::json;
use uuid::Uuid;

#[tauri::command]
pub fn create_node(
    state: State<DbState>,
    node_type: String,
    title: String,
    metadata: Option<String>,
) -> Result<Node, String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;
    
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();
    
    let content_path = None; // Start without content
    let meta_json = metadata.unwrap_or(json!({}).to_string());

    conn.execute(
        "INSERT INTO nodes (id, node_type, title, content_path, metadata, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![id, node_type, title, content_path, meta_json, now, now],
    ).map_err(|e| e.to_string())?;

    Ok(Node {
        id,
        node_type,
        title,
        content_path: content_path.map(|s: String| s),
        metadata: Some(meta_json),
        created_at: now.clone(),
        updated_at: now,
    })
}

#[tauri::command]
pub fn get_node(state: State<DbState>, id: String) -> Result<Option<Node>, String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT id, node_type, title, content_path, metadata, created_at, updated_at FROM nodes WHERE id = ?1"
    ).map_err(|e| e.to_string())?;
    
    let node = stmt.query_row(params![id], |row| {
        Ok(Node {
            id: row.get(0)?,
            node_type: row.get(1)?,
            title: row.get(2)?,
            content_path: row.get(3)?,
            metadata: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    }).map_err(|e| e.to_string());

    match node {
        Ok(n) => Ok(Some(n)),
        Err(e) if e.contains("Query returned no rows") => Ok(None), // rusqlite specific error handling needed usually, but string match works for simple
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub fn save_node_content(
    state: State<DbState>,
    id: String,
    content: String,
) -> Result<(), String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;
    
    let ws = Workspace::new().map_err(|e| e.to_string())?;
    let filename = format!("{}.md", id); // Use ID as filename for simplicity
    
    ws.write_artifact(&filename, content.as_bytes()).map_err(|e| e.to_string())?;
    
    // Update DB with content path
    conn.execute(
        "UPDATE nodes SET content_path = ?1, updated_at = ?2 WHERE id = ?3",
        params![filename, chrono::Utc::now().to_rfc3339(), id],
    ).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn delete_node(state: State<DbState>, id: String) -> Result<(), String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;
    
    // Get content path to delete file
    let path: Option<String> = conn.query_row(
        "SELECT content_path FROM nodes WHERE id = ?1",
        params![id],
        |row| row.get(0),
    ).unwrap_or(None);

    if let Some(p) = path {
        let ws = Workspace::new().map_err(|e| e.to_string())?;
        let _ = ws.delete_artifact(&p); // Ignore error if file doesn't exist
    }

    conn.execute("DELETE FROM nodes WHERE id = ?1", params![id]).map_err(|e| e.to_string())?;
    
    Ok(())
}
