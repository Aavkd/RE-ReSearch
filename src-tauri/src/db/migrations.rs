use rusqlite::{Connection, Result};

pub fn run_migrations(conn: &Connection) -> Result<()> {
    // Nodes table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS nodes (
            id TEXT PRIMARY KEY,
            node_type TEXT NOT NULL,
            title TEXT NOT NULL,
            content_path TEXT,
            metadata TEXT, -- JSON
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;

    // Edges table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS edges (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL,
            target TEXT NOT NULL,
            label TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(source) REFERENCES nodes(id) ON DELETE CASCADE,
            FOREIGN KEY(target) REFERENCES nodes(id) ON DELETE CASCADE
        )",
        [],
    )?;

    Ok(())
}
