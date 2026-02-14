use tauri::{State, command};
use crate::models::{Node, Edge};
use serde::{Serialize, Deserialize};
use serde_json::json;
use crate::db::DbState;

#[derive(Serialize, Deserialize)]
pub struct GraphPayload {
    pub nodes: Vec<Node>,
    pub edges: Vec<Edge>,
}

#[command]
pub fn connect_nodes(
    state: State<'_, DbState>,
    source_id: String,
    target_id: String,
    label: Option<String>
) -> Result<(), String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;
    
    // Check if edge already exists to prevent duplicates
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM edges WHERE source = ?1 AND target = ?2",
        [&source_id, &target_id],
        |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    if count > 0 {
        return Ok(()); // Already connected
    }

    let edge_id = uuid::Uuid::new_v4().to_string();
    let edge_label = label.unwrap_or_else(|| "related".to_string());
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO edges (id, source, target, label, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        (edge_id, source_id, target_id, edge_label, now),
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
pub fn disconnect_nodes(
    state: State<'_, DbState>,
    source_id: String,
    target_id: String
) -> Result<(), String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;
    
    conn.execute(
        "DELETE FROM edges WHERE source = ?1 AND target = ?2",
        [&source_id, &target_id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
pub fn get_graph_data(state: State<'_, DbState>) -> Result<GraphPayload, String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;
    
    // Fetch Nodes
    let mut stmt_nodes = conn.prepare("SELECT id, type, title, content_path, metadata, created_at, updated_at FROM nodes").map_err(|e| e.to_string())?;
    let nodes_iter = stmt_nodes.query_map([], |row| {
        let metadata_str: Option<String> = row.get(4)?;
        let metadata = metadata_str.and_then(|s| serde_json::from_str(&s).ok());

        Ok(Node {
            id: row.get(0)?,
            node_type: row.get(1)?,
            title: row.get(2)?,
            content_path: row.get(3)?,
            metadata,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    }).map_err(|e| e.to_string())?;

    let nodes: Vec<Node> = nodes_iter.filter_map(Result::ok).collect();

    // Fetch Edges
    let mut stmt_edges = conn.prepare("SELECT id, source, target, label, created_at FROM edges").map_err(|e| e.to_string())?;
    let edges_iter = stmt_edges.query_map([], |row| {
        Ok(Edge {
            id: row.get(0)?,
            source: row.get(1)?,
            target: row.get(2)?,
            label: row.get(3)?,
            created_at: row.get(4)?,
        })
    }).map_err(|e| e.to_string())?;

    let edges: Vec<Edge> = edges_iter.filter_map(Result::ok).collect();

    Ok(GraphPayload { nodes, edges })
}

#[command]
pub fn update_node_position(
    state: State<'_, DbState>,
    id: String,
    x: f32,
    y: f32
) -> Result<(), String> {
    let conn = state.get_connection().map_err(|e| e.to_string())?;

    // First, get existing metadata to preserve other fields if any
    let current_metadata: Option<String> = conn.query_row(
        "SELECT metadata FROM nodes WHERE id = ?1",
        [&id],
        |row| row.get(0),
    ).map_err(|e| e.to_string())?;

    let mut metadata_json: serde_json::Value = match current_metadata {
        Some(m) => serde_json::from_str(&m).unwrap_or(json!({})),
        None => json!({}),
    };

    // Update position
    metadata_json["x"] = json!(x);
    metadata_json["y"] = json!(y);

    let new_metadata = metadata_json.to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE nodes SET metadata = ?1, updated_at = ?2 WHERE id = ?3",
        (&new_metadata, &now, &id),
    ).map_err(|e| e.to_string())?;

    Ok(())
}
