use scraper::{Html, Selector};

/// Parse HTML and extract readable text
pub fn parse_html(html: &str) -> String {
    let document = Html::parse_document(html);
    let selector = Selector::parse("body p, body h1, body h2, body h3, body h4, body h5, body h6, body li, body article").unwrap();

    let mut text = String::new();
    for element in document.select(&selector) {
        let element_text = element.text().collect::<Vec<_>>().join(" ");
        if !element_text.trim().is_empty() {
            text.push_str(&element_text);
            text.push('\n');
        }
    }
    
    // Fallback: If no structured content found, try body text directly (but avoid script/style)
    if text.trim().is_empty() {
         let body_selector = Selector::parse("body").unwrap();
         if let Some(body) = document.select(&body_selector).next() {
             text = body.text().collect::<Vec<_>>().join(" ");
         }
    }

    text
}
