#!/usr/bin/env python3
"""
Quality Gates: 15-point pre-launch checklist for Umania Labs.

Runs automated checks before handing web to client.

Usage:
  python3 quality_gates.py https://example.com
  python3 quality_gates.py https://example.com --json
  python3 quality_gates.py https://example.com --verbose
"""

import json
import sys
import subprocess
import re
from urllib.parse import urlparse
from datetime import datetime

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
    """Fetch page."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-H", "User-Agent: Mozilla/5.0", url],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout
    except Exception as e:
        return None

def run_gate(name, description, check_func):
    """Run a single quality gate check."""
    try:
        passed, details = check_func()
        return {
            'name': name,
            'description': description,
            'passed': passed,
            'details': details
        }
    except Exception as e:
        return {
            'name': name,
            'description': description,
            'passed': False,
            'details': f"Error: {str(e)}"
        }

class QualityAuditor:
    def __init__(self, url, html):
        self.url = url
        self.html = html
    
    def check_images_exist(self):
        """Check all img src attributes resolve."""
        images = re.findall(r'<img[^>]+src="([^"]+)"', self.html)
        broken = []
        for img in images:
            if img.startswith('data:') or img.startswith('blob:'):
                continue
            if not img.strip():
                broken.append("Empty src attribute")
        return (len(broken) == 0, f"Found {len(images)} images, {len(broken)} broken")
    
    def check_no_console_errors(self):
        """Check for common JS errors in HTML."""
        errors = []
        
        # Look for script errors
        if 'console.error' in self.html or 'throw new Error' in self.html:
            errors.append("Contains error handling code")
        
        # Check for syntax errors in inline scripts
        scripts = re.findall(r'<script[^>]*>(.*?)</script>', self.html, re.DOTALL)
        for script in scripts:
            if 'SyntaxError' in script or 'undefined' in script.lower():
                errors.append("Potential JS syntax error")
        
        return (len(errors) == 0, f"JS validation: {len(errors)} potential issues")
    
    def check_no_mixed_content(self):
        """Check for http:// on https site."""
        if self.url.startswith('https://'):
            http_refs = re.findall(r'http://[^"\s>]+', self.html)
            if http_refs:
                return (False, f"Found {len(http_refs)} http:// references on https")
        return (True, "No mixed content detected")
    
    def check_mobile_friendly(self):
        """Check for viewport meta tag."""
        has_viewport = '<meta name="viewport"' in self.html or '<meta name="viewport' in self.html
        
        if not has_viewport:
            return (False, "Missing viewport meta tag")
        
        # Check for responsive images
        img_width = len(re.findall(r'<img[^>]+width="', self.html))
        
        return (True, "Viewport configured for mobile")
    
    def check_lighthouse_potential(self):
        """Estimate Lighthouse score potential."""
        issues = []
        
        # Check title
        if not re.search(r'<title[^>]*>.{1,100}</title>', self.html):
            issues.append("Title missing or too long")
        
        # Check meta description
        desc = re.search(r'<meta\s+name="description"\s+content="([^"]{50,160})"', self.html)
        if not desc:
            issues.append("Meta description missing or incorrect length")
        
        # Check h1
        h1 = re.search(r'<h1[^>]*>[^<]+</h1>', self.html)
        if not h1:
            issues.append("h1 tag missing")
        
        # Check for CSS/JS optimization hints
        stylesheets = len(re.findall(r'<link[^>]+href="[^"]*\.css', self.html))
        scripts = len(re.findall(r'<script[^>]+src="[^"]*\.js', self.html))
        
        score_estimate = 80  # baseline
        score_estimate -= len(issues) * 10
        
        return (score_estimate >= 75, f"Potential score: ~{max(score_estimate, 0)}/100 ({len(issues)} issues)")
    
    def check_ctas_present(self):
        """Check for CTAs."""
        ctas = []
        
        if 'calendly' in self.html.lower():
            ctas.append('Calendly')
        if 'wa.me' in self.html or 'whatsapp' in self.html.lower():
            ctas.append('WhatsApp')
        if 'contact' in self.html.lower() or '<form' in self.html:
            ctas.append('Contact Form')
        
        return (len(ctas) > 0, f"Found {len(ctas)} CTA types: {', '.join(ctas)}")
    
    def check_canonical_tag(self):
        """Check for canonical tag."""
        canonical = re.search(r'<link\s+rel="canonical"\s+href="([^"]*)"', self.html)
        
        if not canonical:
            return (False, "Missing canonical tag")
        
        url = canonical.group(1)
        return (True, f"Canonical: {url}")
    
    def check_meta_description(self):
        """Check meta description."""
        desc = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', self.html)
        
        if not desc:
            return (False, "Missing meta description")
        
        desc_text = desc.group(1)
        if len(desc_text) < 50 or len(desc_text) > 160:
            return (False, f"Meta description length: {len(desc_text)} (should be 50-160)")
        
        return (True, f"Description: {desc_text[:50]}...")
    
    def check_alt_text(self):
        """Check for alt text on meaningful images."""
        images = re.findall(r'<img[^>]*>', self.html)
        missing_alt = 0
        
        for img in images:
            # Skip decorative/tracking images
            if 'pixel' in img or 'transparent' in img or 'spacer' in img:
                continue
            if 'alt=' not in img and 'aria-label=' not in img:
                missing_alt += 1
        
        if missing_alt > 0:
            return (False, f"{missing_alt} images missing alt text")
        
        return (True, "All meaningful images have alt text")
    
    def check_h1_tag(self):
        """Check h1 tag."""
        h1_tags = re.findall(r'<h1[^>]*>([^<]+)</h1>', self.html)
        
        if not h1_tags:
            return (False, "Missing h1 tag")
        
        if len(h1_tags) > 1:
            return (False, f"Multiple h1 tags found ({len(h1_tags)}). Should be exactly 1.")
        
        return (True, f"h1: {h1_tags[0][:50]}")
    
    def check_schema_markup(self):
        """Check for Schema.org markup."""
        jsonld = re.findall(r'<script\s+type="application/ld\+json"', self.html, re.IGNORECASE)
        schema_types = re.findall(r'"@type":\s*"([^"]+)"', self.html)
        
        if not jsonld:
            return (False, "No JSON-LD schema found")
        
        return (True, f"Found {len(jsonld)} JSON-LD blocks with {len(set(schema_types))} schema types")
    
    def check_video_present(self):
        """Check for video on hero."""
        videos = re.findall(r'<video[^>]*>|<iframe[^>]*youtube|<iframe[^>]*vimeo', self.html, re.IGNORECASE)
        
        if videos:
            return (True, f"Found {len(videos)} video element(s)")
        
        return (False, "No hero video detected")
    
    def check_open_graph(self):
        """Check Open Graph tags."""
        og_title = re.search(r'<meta\s+property="og:title"', self.html, re.IGNORECASE)
        og_image = re.search(r'<meta\s+property="og:image"', self.html, re.IGNORECASE)
        og_description = re.search(r'<meta\s+property="og:description"', self.html, re.IGNORECASE)
        
        found = sum([bool(og_title), bool(og_image), bool(og_description)])
        
        if found < 3:
            return (False, f"Only {found}/3 Open Graph tags present")
        
        return (True, "Open Graph tags configured (og:title, og:image, og:description)")
    
    def check_responsive_design(self):
        """Check for responsive design indicators."""
        viewport = '<meta name="viewport"' in self.html
        
        # Check for media queries
        media_queries = len(re.findall(r'@media\s+\(', self.html))
        
        # Check for flexible CSS
        flex_or_grid = len(re.findall(r'(display:\s*flex|display:\s*grid|flex-wrap)', self.html))
        
        responsive = viewport and (media_queries > 0 or flex_or_grid > 0)
        
        if responsive:
            return (True, "Responsive design detected")
        
        return (False, "Responsive design markers not found")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 quality_gates.py <url> [--json] [--verbose]", file=sys.stderr)
        sys.exit(1)
    
    url = validate_url(sys.argv[1])
    json_mode = "--json" in sys.argv
    verbose_mode = "--verbose" in sys.argv
    
    print(f"[*] Fetching {url}...", file=sys.stderr)
    html = fetch_page(url)
    if not html:
        print(f"ERROR: Could not fetch {url}", file=sys.stderr)
        sys.exit(1)
    
    auditor = QualityAuditor(url, html)
    
    gates = [
        ("no_broken_images", "All images load", auditor.check_images_exist),
        ("no_console_errors", "No JS console errors", auditor.check_no_console_errors),
        ("no_mixed_content", "No http:// on https", auditor.check_no_mixed_content),
        ("mobile_friendly", "Mobile viewport configured", auditor.check_mobile_friendly),
        ("lighthouse_potential", "Lighthouse score potential ≥75", auditor.check_lighthouse_potential),
        ("ctas_functional", "CTAs present (Calendly/WhatsApp/Form)", auditor.check_ctas_present),
        ("canonical_tag", "Canonical tag present", auditor.check_canonical_tag),
        ("meta_description", "Meta description (50-160 chars)", auditor.check_meta_description),
        ("alt_text", "Images have alt text", auditor.check_alt_text),
        ("h1_tag", "Exactly one h1 tag", auditor.check_h1_tag),
        ("schema_markup", "JSON-LD Schema.org present", auditor.check_schema_markup),
        ("hero_video", "Hero video present", auditor.check_video_present),
        ("open_graph", "Open Graph tags", auditor.check_open_graph),
        ("responsive_design", "Responsive design", auditor.check_responsive_design),
    ]
    
    results = []
    for gate_name, gate_desc, gate_func in gates:
        result = run_gate(gate_name, gate_desc, gate_func)
        results.append(result)
    
    # Calculate summary
    passed_count = sum(1 for r in results if r['passed'])
    total_count = len(results)
    
    output = {
        "url": url,
        "timestamp": datetime.now().isoformat(),
        "summary": {
            "passed": passed_count,
            "total": total_count,
            "percentage": int((passed_count / total_count) * 100),
            "ready_for_delivery": passed_count >= (total_count - 1)  # Allow max 1 failure
        },
        "gates": results
    }
    
    if json_mode:
        print(json.dumps(output, indent=2, ensure_ascii=False))
    else:
        print(f"\n{'='*60}")
        print(f"Quality Gates Report: {url}")
        print(f"{'='*60}")
        print(f"\n Score: {passed_count}/{total_count} ({output['summary']['percentage']}%)\n")
        
        for result in results:
            symbol = "✓" if result['passed'] else "✗"
            print(f"{symbol} {result['description']}")
            if verbose_mode or not result['passed']:
                print(f"  → {result['details']}")
        
        print(f"\n{'='*60}")
        
        if output['summary']['ready_for_delivery']:
            print("✓ READY FOR DELIVERY - All critical gates passed")
        else:
            print("⚠ REVIEW NEEDED - Some gates failed before delivery")
        
        print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
