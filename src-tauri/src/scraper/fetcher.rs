use reqwest::header::USER_AGENT;
use std::error::Error;

/// Fetch HTML content from a URL
pub async fn fetch_url(url: &str) -> Result<String, Box<dyn Error>> {
    let client = reqwest::Client::new();
    let res = client
        .get(url)
        .header(USER_AGENT, "Mozilla/5.0 (compatible; RE_ReSearch/1.0; +http://re-research.local)")
        .send()
        .await?;

    let text = res.text().await?;
    Ok(text)
}
