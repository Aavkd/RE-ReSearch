use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

pub async fn complete(prompt: String, model: Option<String>) -> Result<String, String> {
    // Default to Ollama locally for now, could be configured via env or settings
    let ollama_url = "http://localhost:11434/api/generate";
    let client = Client::new();
    
    let model_name = model.unwrap_or_else(|| "llama3".to_string()); // Default model

    let body = serde_json::json!({
        "model": model_name,
        "prompt": prompt,
        "stream": false
    });

    match client.post(ollama_url)
        .json(&body)
        .send()
        .await {
            Ok(resp) => {
                if resp.status().is_success() {
                    let json: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
                    if let Some(response_text) = json["response"].as_str() {
                        Ok(response_text.to_string())
                    } else {
                        Err("Invalid response format from Ollama".to_string())
                    }
                } else {
                     Err(format!("Ollama API error: {}", resp.status()))
                }
            },
            Err(e) => Err(format!("Failed to call Ollama: {}", e))
        }
}

pub async fn chat(messages: Vec<ChatMessage>, model: Option<String>) -> Result<String, String> {
    // Basic chat implementation for Ollama /api/chat
    let ollama_url = "http://localhost:11434/api/chat";
    let client = Client::new();
    
    let model_name = model.unwrap_or_else(|| "llama3".to_string());

    let body = serde_json::json!({
        "model": model_name,
        "messages": messages,
        "stream": false
    });

    match client.post(ollama_url)
        .json(&body)
        .send()
        .await {
            Ok(resp) => {
                if resp.status().is_success() {
                    let json: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
                    // Deeply nested: message -> content
                    if let Some(content) = json["message"]["content"].as_str() {
                        Ok(content.to_string())
                    } else {
                        Err("Invalid response format from Ollama".to_string())
                    }
                } else {
                     Err(format!("Ollama API error: {}", resp.status()))
                }
            },
            Err(e) => Err(format!("Failed to call Ollama: {}", e))
        }
}
