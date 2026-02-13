use std::fs;
use std::path::PathBuf;
use std::io::{self, Write};
use tauri::ipc::Response;

pub struct Workspace {
    pub root: PathBuf,
    pub artifacts: PathBuf,
}

impl Workspace {
    pub fn new() -> io::Result<Self> {
        let home = dirs::home_dir().ok_or(io::Error::new(io::ErrorKind::NotFound, "Home directory not found"))?;
        let root = home.join(".research_data");
        let artifacts = root.join("artifacts");
        Ok(Self { root, artifacts })
    }

    pub fn ensure_workspace(&self) -> io::Result<()> {
        if !self.root.exists() {
            fs::create_dir_all(&self.root)?;
        }
        if !self.artifacts.exists() {
            fs::create_dir_all(&self.artifacts)?;
        }
        Ok(())
    }

    pub fn write_artifact(&self, filename: &str, content: &[u8]) -> io::Result<PathBuf> {
        self.ensure_workspace()?;
        let path = self.artifacts.join(filename);
        let mut file = fs::File::create(&path)?;
        file.write_all(content)?;
        Ok(path)
    }

    pub fn read_artifact(&self, filename: &str) -> io::Result<Vec<u8>> {
        let path = self.artifacts.join(filename);
        fs::read(path)
    }

    pub fn delete_artifact(&self, filename: &str) -> io::Result<()> {
        let path = self.artifacts.join(filename);
        if path.exists() {
            fs::remove_file(path)?;
        }
        Ok(())
    }
}
