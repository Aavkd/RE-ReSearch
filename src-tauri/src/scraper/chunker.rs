/// Chunk text into approximately N tokens
/// For now, we approximate 1 token ~= 0.75 words, so 500 tokens ~= 375 words.
/// We'll use a word-based chunker.
pub fn chunk_text(text: &str, target_token_count: usize) -> Vec<String> {
    let words: Vec<&str> = text.split_whitespace().collect();
    let words_per_chunk = (target_token_count as f32 * 0.75) as usize; // Approximation
    
    let mut chunks = Vec::new();
    let mut current_chunk = Vec::new();
    let mut current_count = 0;

    for word in words {
        current_chunk.push(word);
        current_count += 1;

        if current_count >= words_per_chunk {
            chunks.push(current_chunk.join(" "));
            current_chunk.clear();
            current_count = 0;
        }
    }

    if !current_chunk.is_empty() {
        chunks.push(current_chunk.join(" "));
    }

    chunks
}
