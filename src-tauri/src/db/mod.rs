use rusqlite::{Connection, Result};
use std::path::PathBuf;
use std::fs;
use tauri::{AppHandle, Manager};

pub mod migrations;
pub mod vec;

pub struct DbState {
    pub db_path: PathBuf,
}

impl DbState {
    pub fn get_connection(&self) -> Result<Connection, rusqlite::Error> {
        Connection::open(&self.db_path)
    }
}

pub fn init(app_handle: &AppHandle) -> Result<DbState, Box<dyn std::error::Error>> {
    let app_dir = app_handle.path().app_data_dir()?;
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir)?;
    }
    
    let db_path = app_dir.join("research.db");
    
    // Load sqlite-vec extension
    unsafe {
        let _ = rusqlite::ffi::sqlite3_auto_extension(Some(std::mem::transmute(
            sqlite_vec::sqlite3_vec_init as *const (),
        )));
    }

    // Connect to run migrations
    let conn = Connection::open(&db_path)?;
    migrations::run_migrations(&conn)?;
    
    Ok(DbState { db_path })
}
