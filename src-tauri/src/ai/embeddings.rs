use serde::{Deserialize, Serialize};
use reqwest::Client;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EmbeddingProvider {
    Ollama { model: String },
    Gemini { api_key: String },
}

#[derive(Serialize)]
struct OllamaRequest<'a> {
    model: &'a str,
    prompt: &'a str,
}

#[derive(Deserialize)]
struct OllamaResponse {
    embedding: Vec<f32>,
}

#[derive(Serialize)]
struct GeminiRequest<'a> {
    model: &'a str,
    content: GeminiContent<'a>,
}

#[derive(Serialize)]
struct GeminiContent<'a> {
    parts: Vec<GeminiPart<'a>>,
}

#[derive(Serialize)]
struct GeminiPart<'a> {
    text: &'a str,
}

#[derive(Deserialize)]
struct GeminiResponse {
    embedding: GeminiEmbedding,
}

#[derive(Deserialize)]
struct GeminiEmbedding {
    values: Vec<f32>,
}

pub async fn embed_text(text: &str, provider: &EmbeddingProvider) -> Result<Vec<f32>, String> {
    let client = Client::new();

    match provider {
        EmbeddingProvider::Ollama { model } => {
            let request = OllamaRequest {
                model,
                prompt: text,
            };

            let res = client
                .post("http://localhost:11434/api/embeddings")
                .json(&request)
                .send()
                .await
                .map_err(|e| e.to_string())?;

            if !res.status().is_success() {
                return Err(format!("Ollama API error: {}", res.status()));
            }

            let response: OllamaResponse = res.json().await.map_err(|e| e.to_string())?;
            Ok(response.embedding)
        }
        EmbeddingProvider::Gemini { api_key } => {
            let url = format!(
                "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key={}",
                api_key
            );

            // Gemini expects "content" object structure
            let request = GeminiRequest {
                model: "models/embedding-001",
                content: GeminiContent {
                    parts: vec![GeminiPart { text }],
                },
            };

            let res = client
                .post(&url)
                .json(&request)
                .send()
                .await
                .map_err(|e| e.to_string())?;

            if !res.status().is_success() {
                 let error_text = res.text().await.unwrap_or_default();
                 return Err(format!("Gemini API error: {}", error_text));
            }

            let response: GeminiResponse = res.json().await.map_err(|e| e.to_string())?;
            Ok(response.embedding.values)
        }
    }
}
