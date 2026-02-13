use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Node {
    pub id: String,
    pub node_type: String,
    pub title: String,
    pub content_path: Option<String>,
    pub metadata: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Edge {
    pub id: String,
    pub source: String,
    pub target: String,
    pub label: String,
    pub created_at: String,
}
