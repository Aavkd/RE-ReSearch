use tauri::Manager;

pub mod commands;
pub mod db;
pub mod fs_manager;
pub mod models;

use commands::nodes::{create_node, get_node, save_node_content, delete_node};

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
            delete_node
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
