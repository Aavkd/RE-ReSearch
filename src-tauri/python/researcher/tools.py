import os
import httpx
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
import html2text

# Ensure artifacts directory exists
ARTIFACTS_DIR = os.path.expanduser("~/.research_data/artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

@tool
def search_web(query: str) -> str:
    """Searches the web for the given query using DuckDuckGo."""
    search = DuckDuckGoSearchRun()
    return search.run(query)

@tool
def read_page(url: str) -> str:
    """Fetches a URL and returns its content as simplified markdown."""
    try:
        response = httpx.get(url, timeout=10, follow_redirects=True)
        response.raise_for_status()
        
        h = html2text.HTML2Text()
        h.ignore_links = True
        h.ignore_images = True
        return h.handle(response.text)
    except Exception as e:
        return f"Error reading page: {str(e)}"

@tool
def save_note(title: str, content: str) -> str:
    """Saves a research note to the local file system."""
    filename = f"{title.replace(' ', '_').lower()}.md"
    path = os.path.join(ARTIFACTS_DIR, filename)
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Note saved successfully to {path}"
    except Exception as e:
        return f"Error saving note: {str(e)}"
