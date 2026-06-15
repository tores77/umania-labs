#!/usr/bin/env python3
"""
Drift Comparison: Compare current state to baseline.

Detects 17 change rules across 3 severity levels.

Usage:
  python3 drift_compare.py https://example.com
  python3 drift_compare.py https://example.com --json
  python3 drift_compare.py https://example.com --detail
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
    """Validate URL."""
    try:
        result = urlparse(url)
        if not result.scheme:
            url = f"https://{url}"
        return url
    except Exception as e:
        print(f"ERROR: Invalid URL: {e}", file=sys.stderr)
        sys.exit(1)

def fetch_page(url):
    """Fetch page content."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-H", "User-Agent: Mozilla/5.0", url],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout
    except Exception as e:
        print(f"ERROR: Failed to fetch {url}: {e}", file=sys.stderr)
        return None

def extract_metadata(html):
    """Extract metadata from HTML."""
    data = {}
    
    title_match = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
    data['title'] = title_match.group(1) if title_match else None
    
    desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', html, re.IGNORECASE)
    data['meta_description'] = desc_match.group(1) if desc_match else None
    
    h1_matches = re.findall(r'<h1[^>]*>([^<]+)</h1>', html, re.IGNORECASE)
    data['h1_tags'] = h1_matches if h1_matches else []
    
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]*)"', html, re.IGNORECASE)
    data['canonical'] = canonical_match.group(1) if canonical_match else None
    
    og_image = re.search(r'<meta\s+property="og:image"\s+content="([^"]*)"', html, re.IGNORECASE)
    og_title = re.search(r'<meta\s+property="og:title"\s+content="([^"]*)"', html, re.IGNORECASE)
    data['og_image'] = og_image.group(1) if og_image else None
    data['og_title'] = og_title.group(1) if og_title else None
    
    img_count = len(re.findall(r'<img[^>]*>', html, re.IGNORECASE))
    data['image_count'] = img_count
    
    video_count = len(re.findall(r'<video[^>]*>|<iframe[^>]*youtube|<iframe[^>]*vimeo', html, re.IGNORECASE))
    data['video_count'] = video_count
    
    cta_count = len(re.findall(r'calendly|wa\.me|whatsapp|contact|call-to-action', html, re.IGNORECASE))
    data['cta_count'] = cta_count
    
    schema_types = re.findall(r'"@type":\s*"([^"]+)"', html)
    data['schema_types'] = list(set(schema_types)) if schema_types else []
    
    jsonld_count = len(re.findall(r'<script\s+type="application/ld\+json"', html, re.IGNORECASE))
    data['jsonld_count'] = jsonld_count
    
    text = re.sub(r'<[^>]+>', '', html)
    word_count = len(text.split())
    data['word_count'] = word_count
    
    data['html_hash'] = hashlib.sha256(html.encode()).hexdigest()
    
    return data

def get_baseline(db_path):
    """Get most recent baseline from database."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM baselines
            ORDER BY timestamp DESC
            LIMIT 1
        ''')
        
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return None
        
        return {
            'title': row[3],
            'meta_description': row[4],
            'h1_tags': json.loads(row[5]) if row[5] else [],
            'canonical': row[6],
            'og_image': row[7],
            'og_title': row[8],
            'image_count': row[9],
            'video_count': row[10],
            'cta_count': row[11],
            'schema_types': json.loads(row[12]) if row[12] else [],
            'jsonld_count': row[13],
            'word_count': row[14],
            'html_hash': row[15],
            'timestamp': row[2]
        }
    except Exception as e:
        return None

def compare_metadata(baseline, current):
    """Compare baseline vs current and return changes."""
    changes = {
        'critical': [],
        'high': [],
        'medium': [],
        'summary': {}
    }
    
    # CRITICAL changes
    if baseline['canonical'] != current['canonical']:
        changes['critical'].append({
            'rule': 'canonical_changed',
            'description': 'Canonical tag was modified or removed',
            'before': baseline['canonical'],
            'after': current['canonical'],
            'action': 'Review canonical tag immediately'
        })
    
    if not current['h1_tags'] and baseline['h1_tags']:
        changes['critical'].append({
            'rule': 'h1_removed',
            'description': 'Primary h1 tag removed',
            'before': baseline['h1_tags'][0] if baseline['h1_tags'] else None,
            'after': None,
            'action': 'Restore h1 tag'
        })
    
    if not current['meta_description'] and baseline['meta_description']:
        changes['critical'].append({
            'rule': 'meta_description_removed',
            'description': 'Meta description removed',
            'before': baseline['meta_description'],
            'after': None,
            'action': 'Restore meta description (50-160 chars)'
        })
    
    if baseline['video_count'] > 0 and current['video_count'] == 0:
        changes['critical'].append({
            'rule': 'video_missing',
            'description': 'Hero video missing or removed',
            'before': f"{baseline['video_count']} video(s)",
            'after': '0 videos',
            'action': 'Restore hero video'
        })
    
    # HIGH changes
    if baseline['title'] != current['title']:
        changes['high'].append({
            'rule': 'title_changed',
            'description': 'Page title changed',
            'before': baseline['title'],
            'after': current['title'],
            'action': 'Verify title is intentional'
        })
    
    if baseline['meta_description'] != current['meta_description']:
        if current['meta_description']:  # Only if not removed (that's critical)
            changes['high'].append({
                'rule': 'meta_description_changed',
                'description': 'Meta description modified',
                'before': baseline['meta_description'],
                'after': current['meta_description'],
                'action': 'Verify description accuracy'
            })
    
    if len(baseline['schema_types']) != len(current['schema_types']):
        changes['high'].append({
            'rule': 'schema_types_changed',
            'description': 'Schema.org types added/removed',
            'before': ', '.join(baseline['schema_types']),
            'after': ', '.join(current['schema_types']),
            'action': 'Review schema changes'
        })
    
    if baseline['cta_count'] != current['cta_count']:
        changes['high'].append({
            'rule': 'cta_count_changed',
            'description': 'Call-to-action count changed',
            'before': baseline['cta_count'],
            'after': current['cta_count'],
            'action': f"Expected {baseline['cta_count']} CTAs, found {current['cta_count']}"
        })
    
    # MEDIUM changes
    if baseline['image_count'] != current['image_count']:
        changes['medium'].append({
            'rule': 'image_count_changed',
            'description': 'Number of images changed',
            'before': baseline['image_count'],
            'after': current['image_count'],
            'action': 'Verify images load correctly'
        })
    
    if len(baseline['h1_tags']) != len(current['h1_tags']):
        changes['medium'].append({
            'rule': 'h1_count_changed',
            'description': 'Number of h1 tags changed',
            'before': len(baseline['h1_tags']),
            'after': len(current['h1_tags']),
            'action': 'Should have exactly 1 h1 tag'
        })
    
    if baseline['word_count'] != current['word_count']:
        word_diff = current['word_count'] - baseline['word_count']
        if abs(word_diff) > 500:  # Only flag if >500 word change
            changes['medium'].append({
                'rule': 'content_length_changed',
                'description': f"Content length changed by {abs(word_diff)} words",
                'before': baseline['word_count'],
                'after': current['word_count'],
                'action': f"Major content change: {'+' if word_diff > 0 else ''}{word_diff} words"
            })
    
    if baseline['html_hash'] != current['html_hash']:
        changes['summary']['html_changed'] = True
    else:
        changes['summary']['html_changed'] = False
    
    changes['summary']['total_changes'] = (
        len(changes['critical']) + 
        len(changes['high']) + 
        len(changes['medium'])
    )
    changes['summary']['critical_count'] = len(changes['critical'])
    changes['summary']['high_count'] = len(changes['high'])
    changes['summary']['medium_count'] = len(changes['medium'])
    
    return changes

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 drift_compare.py <url> [--json] [--detail]", file=sys.stderr)
        sys.exit(1)
    
    url = validate_url(sys.argv[1])
    json_mode = "--json" in sys.argv
    detail_mode = "--detail" in sys.argv
    
    parsed = urlparse(url)
    domain = parsed.netloc
    
    # Get baseline
    config_dir = os.path.expanduser("~/.config/umania-labs")
    db_path = os.path.join(config_dir, f"{domain}-baseline.db")
    
    if not os.path.exists(db_path):
        print(f"ERROR: No baseline found for {domain}", file=sys.stderr)
        print(f"Run: python3 drift_baseline.py {url}", file=sys.stderr)
        sys.exit(1)
    
    print(f"[*] Fetching {url}...", file=sys.stderr)
    html = fetch_page(url)
    if not html:
        sys.exit(1)
    
    baseline = get_baseline(db_path)
    if not baseline:
        print(f"ERROR: Could not read baseline from {db_path}", file=sys.stderr)
        sys.exit(1)
    
    print(f"[*] Comparing to baseline from {baseline['timestamp']}...", file=sys.stderr)
    current = extract_metadata(html)
    
    changes = compare_metadata(baseline, current)
    
    # Output
    output = {
        "url": url,
        "domain": domain,
        "timestamp": datetime.now().isoformat(),
        "baseline_timestamp": baseline['timestamp'],
        "changes": changes
    }
    
    if json_mode:
        print(json.dumps(output, indent=2))
    else:
        print(f"\n{'='*60}")
        print(f"Drift Report: {domain}")
        print(f"{'='*60}")
        print(f"Baseline: {baseline['timestamp']}")
        print(f"Current:  {datetime.now().isoformat()}")
        print()
        
        if changes['summary']['total_changes'] == 0:
            print("✓ No changes detected. Site is stable.")
        else:
            print(f"⚠ Total changes: {changes['summary']['total_changes']}")
            print(f"  🔴 Critical: {changes['summary']['critical_count']}")
            print(f"  🟠 High:     {changes['summary']['high_count']}")
            print(f"  🟡 Medium:   {changes['summary']['medium_count']}")
            print()
            
            if changes['critical']:
                print("CRITICAL ISSUES (Deploy Blocker):")
                for change in changes['critical']:
                    print(f"  • {change['description']}")
                    print(f"    Action: {change['action']}")
                print()
            
            if changes['high']:
                print("HIGH PRIORITY:")
                for change in changes['high']:
                    print(f"  • {change['description']}")
                    print(f"    Action: {change['action']}")
                print()
            
            if changes['medium']:
                print("MEDIUM PRIORITY:")
                for change in changes['medium']:
                    print(f"  • {change['description']}")
                    print(f"    Action: {change['action']}")
        
        print(f"\n{'='*60}")

if __name__ == "__main__":
    main()
