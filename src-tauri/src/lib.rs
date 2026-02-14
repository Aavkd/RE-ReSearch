use tauri::Manager;

pub mod commands;
pub mod db;
pub mod fs_manager;
pub mod models;

use commands::nodes::{create_node, get_node, save_node_content, delete_node};
use commands::graph::{connect_nodes, disconnect_nodes, get_graph_data, update_node_position};
use commands::ingest::ingest_url;
use commands::search::search_nodes;
use commands::chat::chat;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            match db::init(app.handle()) {
                Ok(state) => {
                    app.manage(state);
                    Ok(())
                },
                Err(e) => {
                    eprintln!("Error initializing database: {}", e);
                    Err(Box::new(e))
                }
            }
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_node,
            get_node,
            save_node_content,
            delete_node,
            connect_nodes,
            disconnect_nodes,
            get_graph_data,
            update_node_position,
            ingest_url,
            search_nodes,
            chat
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
