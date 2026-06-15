#!/usr/bin/env python3
"""
Drift Baseline Capture for Umania Labs Web Design.

Captures comprehensive SEO/UX baseline for change monitoring.
Stores in SQLite for later comparison.

Usage:
  python3 drift_baseline.py https://example.com
  python3 drift_baseline.py https://example.com --json
  python3 drift_baseline.py https://example.com --output baseline_2026-06-15.db

Output:
  Stores in: ~/.config/umania-labs/drift-baselines/{domain}.db
  Or: stdout if --json flag
"""

import json
import sqlite3
import sys
import os
from datetime import datetime
from urllib.parse import urlparse
import hashlib
import subprocess
import re

def validate_url(url):
    """Validate URL format and safety."""
    try:
        result = urlparse(url)
        if not result.scheme:
            url = f"https://{url}"
        if not result.netloc and not result.path:
            raise ValueError("Invalid URL")
        return url
    except Exception as e:
        print(f"ERROR: Invalid URL: {e}", file=sys.stderr)
        sys.exit(1)

def fetch_page(url):
    """Fetch page content using curl."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-H", "User-Agent: Mozilla/5.0 (X11; Linux x86_64)", url],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout
    except Exception as e:
        print(f"ERROR: Failed to fetch {url}: {e}", file=sys.stderr)
        return None

def extract_metadata(html):
    """Extract SEO-relevant metadata from HTML."""
    data = {}
    
    # Title
    title_match = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
    data['title'] = title_match.group(1) if title_match else None
    
    # Meta description
    desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', html, re.IGNORECASE)
    data['meta_description'] = desc_match.group(1) if desc_match else None
    
    # h1 tags
    h1_matches = re.findall(r'<h1[^>]*>([^<]+)</h1>', html, re.IGNORECASE)
    data['h1_tags'] = h1_matches if h1_matches else []
    
    # Canonical
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]*)"', html, re.IGNORECASE)
    data['canonical'] = canonical_match.group(1) if canonical_match else None
    
    # Open Graph
    og_image = re.search(r'<meta\s+property="og:image"\s+content="([^"]*)"', html, re.IGNORECASE)
    og_title = re.search(r'<meta\s+property="og:title"\s+content="([^"]*)"', html, re.IGNORECASE)
    data['og_image'] = og_image.group(1) if og_image else None
    data['og_title'] = og_title.group(1) if og_title else None
    
    # Images count
    img_count = len(re.findall(r'<img[^>]*>', html, re.IGNORECASE))
    data['image_count'] = img_count
    
    # Videos count
    video_count = len(re.findall(r'<video[^>]*>|<iframe[^>]*youtube|<iframe[^>]*vimeo', html, re.IGNORECASE))
    data['video_count'] = video_count
    
    # CTAs count
    cta_count = len(re.findall(r'calendly|wa\.me|whatsapp|contact|call-to-action', html, re.IGNORECASE))
    data['cta_count'] = cta_count
    
    # Schema.org
    schema_types = re.findall(r'"@type":\s*"([^"]+)"', html)
    data['schema_types'] = list(set(schema_types)) if schema_types else []
    
    # JSON-LD count
    jsonld_count = len(re.findall(r'<script\s+type="application/ld\+json"', html, re.IGNORECASE))
    data['jsonld_count'] = jsonld_count
    
    # Word count
    text = re.sub(r'<[^>]+>', '', html)
    word_count = len(text.split())
    data['word_count'] = word_count
    
    # HTML hash (for deep change detection)
    data['html_hash'] = hashlib.sha256(html.encode()).hexdigest()
    
    return data

def create_database(db_path):
    """Create SQLite database with schema."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS baselines (
            id INTEGER PRIMARY KEY,
            domain TEXT,
            url TEXT,
            timestamp TEXT,
            title TEXT,
            meta_description TEXT,
            h1_tags TEXT,
            canonical TEXT,
            og_image TEXT,
            og_title TEXT,
            image_count INTEGER,
            video_count INTEGER,
            cta_count INTEGER,
            schema_types TEXT,
            jsonld_count INTEGER,
            word_count INTEGER,
            html_hash TEXT
        )
    ''')
    
    conn.commit()
    return conn

def save_baseline(db_path, domain, url, metadata):
    """Save baseline to database."""
    conn = create_database(db_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO baselines (
            domain, url, timestamp, title, meta_description, h1_tags, canonical,
            og_image, og_title, image_count, video_count, cta_count, schema_types,
            jsonld_count, word_count, html_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        domain,
        url,
        datetime.now().isoformat(),
        metadata['title'],
        metadata['meta_description'],
        json.dumps(metadata['h1_tags']),
        metadata['canonical'],
        metadata['og_image'],
        metadata['og_title'],
        metadata['image_count'],
        metadata['video_count'],
        metadata['cta_count'],
        json.dumps(metadata['schema_types']),
        metadata['jsonld_count'],
        metadata['word_count'],
        metadata['html_hash']
    ))
    
    conn.commit()
    conn.close()

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 drift_baseline.py <url> [--json]", file=sys.stderr)
        sys.exit(1)
    
    url = validate_url(sys.argv[1])
    json_mode = "--json" in sys.argv
    
    # Parse domain for db storage
    parsed = urlparse(url)
    domain = parsed.netloc
    
    # Fetch page
    print(f"[*] Fetching {url}...", file=sys.stderr)
    html = fetch_page(url)
    if not html:
        sys.exit(1)
    
    # Extract metadata
    print(f"[*] Extracting metadata...", file=sys.stderr)
    metadata = extract_metadata(html)
    
    # Create config directory
    config_dir = os.path.expanduser("~/.config/umania-labs")
    os.makedirs(config_dir, exist_ok=True)
    
    db_path = os.path.join(config_dir, f"{domain}-baseline.db")
    
    # Save to database
    print(f"[*] Saving baseline to {db_path}...", file=sys.stderr)
    save_baseline(db_path, domain, url, metadata)
    
    # Output
    output = {
        "url": url,
        "domain": domain,
        "timestamp": datetime.now().isoformat(),
        "database": db_path,
        "baseline": metadata
    }
    
    if json_mode:
        print(json.dumps(output, indent=2))
    else:
        print(f"[✓] Baseline captured for {domain}")
        print(f"[✓] Database: {db_path}")
        print(f"[✓] Title: {metadata['title']}")
        print(f"[✓] Meta description: {metadata['meta_description']}")
        print(f"[✓] h1 tags: {len(metadata['h1_tags'])} found")
        print(f"[✓] Images: {metadata['image_count']}")
        print(f"[✓] Videos: {metadata['video_count']}")
        print(f"[✓] CTAs: {metadata['cta_count']}")
        print(f"[✓] Schema types: {', '.join(metadata['schema_types']) if metadata['schema_types'] else 'None'}")
        print(f"[✓] JSON-LD blocks: {metadata['jsonld_count']}")

if __name__ == "__main__":
    main()
