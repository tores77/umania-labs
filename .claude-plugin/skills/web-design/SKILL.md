# Web Design: Premium Web Architecture Skill

**Tier 4 Web Design Skill for Umania Labs.** Orchestrates 5 sub-skills and 5 specialist agents across hero/video design, schema generation, conversion optimization, drift monitoring, and performance tuning. Entry point for full-site analysis, client delivery, and post-launch monitoring.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/web-design audit <url>` | Full site audit with parallel subagents (5 agents, ~5 min) |
| `/web-design hero <url>` | Hero + scroll-scrubbed video analysis |
| `/web-design schema <url>` | Schema.org detection, validation, generation |
| `/web-design conversion <url>` | CTA audit, funnel analysis, WhatsApp integration |
| `/web-design drift baseline <url>` | Capture SEO/UX baseline for change monitoring |
| `/web-design drift compare <url>` | Compare current state to stored baseline |
| `/web-design quality-gates <url>` | Pre-launch 15-point checklist |
| `/web-design performance <url>` | Video optimization, Core Web Vitals, LCP analysis |

## Architecture

```
web-design/
  SKILL.md                       # This file (orchestrator)
  references/
    design-principles.md         # Umania methodology (scroll video, hero wow effect)
    conversion-framework.md      # CTA + WhatsApp + Calendly integration
    video-optimization.md        # ffmpeg faststart, lazy loading, throttling
    
web-design-hero/SKILL.md        # Hero + GSAP + scroll video specialist
web-design-schema/SKILL.md      # JSON-LD generation + validation
web-design-conversion/SKILL.md  # Conversion funnel audit
web-design-drift/SKILL.md       # Baseline capture + monitoring
web-design-performance/SKILL.md # Video + Core Web Vitals

agents/
  hero-video.md                 # Analyze hero + scroll behavior
  schema-gen.md                 # Generate JSON-LD for industry vertical
  conversion-audit.md           # Audit CTAs + form conversions
  drift-monitor.md              # Compare baseline vs current
  quality-gates.md              # Run 15-point pre-launch checklist
```

## Using This Skill

### Full Site Audit (5 min parallel execution)

```
User: /web-design audit https://example.com

Process:
1. Fetch page + capture screenshot
2. Invoke 5 agents in parallel:
   - seo-hero (hero video analysis)
   - seo-schema (schema.org audit)
   - seo-conversion (CTA analysis)
   - seo-performance (video optimization)
   - seo-visual (mobile rendering)
3. Compile prioritized action plan
4. Output: Markdown report + JSON metrics
```

### Hero Video Deep Dive

```
User: /web-design hero https://studio.umanialabs.com

Analyze:
- Hero layout (full-bleed, overlay text, CTA placement)
- Video scroll behavior (GSAP + ScrollTrigger config)
- Video crossfade technique (opacity stacking)
- Intersection Observer for lazy-load
- Performance: currentTime throttling (delta > 0.05s)
- Mobile rendering (landscape, portrait, iPad)
- CLS impact (ensure video doesn't shift layout)
```

### Schema.org Generation for Industry Vertical

```
User: /web-design schema https://ikoya.es --type restaurant

Generate:
- LocalBusiness + geo coordinates
- Restaurant schema with cuisines
- AggregateRating from Google Reviews
- OpeningHoursSpecification
- Menu items (if applicable)
- Chef/team ProfilePage schema
- Reservation link + Action schema

Output: JSON-LD blocks ready for <head>
```

### Pre-Launch Quality Gates

```
User: /web-design quality-gates https://example.com

15-point checklist:
✓ No broken images (all <img> src resolve)
✓ No console errors (check DevTools)
✓ No mixed content (no http:// on https site)
✓ Mobile friendly (viewport meta, touch targets)
✓ Lighthouse score ≥ 80
✓ Core Web Vitals passing
✓ All CTAs clickable + functional
✓ WhatsApp link valid (wa.me/34...)
✓ Calendly embed or link working
✓ Video thumbnails load fast
✓ Canonical tags correct
✓ Meta descriptions 50-160 chars
✓ Alt text on meaningful images
✓ h1 present + unique
✓ Internal links not broken

Output: Green/Red card for client
```

### Drift Monitoring (Post-Launch)

```
User: /web-design drift baseline https://example.com
→ Captures: hero, CTAs, schema, meta tags, performance

(Client goes live)

User: /web-design drift compare https://example.com
→ Detects: moved CTAs, broken links, schema changes, speed regression
→ Output: "Web changed in X areas. See details →"
```

## Implementation Details

### Hero Video Analysis Rules

- Always check for `overflow: hidden` on ancestor (breaks `position: sticky`)
- Verify `overflow: clip` instead for scroll containers
- Confirm `scrub: 1` in ScrollTrigger (not `scrub: true`)
- Check Lenis connection (requires 3 specific GSAP lines)
- Video crossfade = opacity-only (never `display: none`)
- Performance: throttle `currentTime` updates (delta > 0.05s)
- Lazy load non-active videos

### Schema.org Generation Checklist

- LocalBusiness for premium niches (luxury yacht, beach club)
- Product schema for e-commerce
- Restaurant/BreadFastIngredients for F&B
- Reservation + OrderAction for bookings
- ProfilePage for team/staff
- QAPage for FAQ sections (NOT FAQPage; deprecated May 2026)
- Always validate with `npm run schema:validate`

### Conversion Funnel Gates

- CTA 1: "Ver 48h preview" → Calendly OR WhatsApp
- CTA 2: Form submission → Lead qualification agent
- CTA 3: Closer call → Stripe deposit link
- WhatsApp link: `wa.me/34676967465?text=Hola%20Pere...`
- Calendly: `calendly.com/pere-umania/30min`
- All CTAs must be mobile-clickable (44px minimum)

### Video Optimization Pipeline

```
Raw video → ffmpeg faststart → lazy preload → currentTime throttle → delivery
```

1. **Faststart:** `ffmpeg -i input.mp4 -c:v libx264 -movflags faststart output.mp4`
2. **Lazy load:** Don't play until `IntersectionObserver` detects viewport
3. **Throttle:** Only update `currentTime` if `delta > 0.05s`
4. **Mobile:** Adaptive bitrate (240p on <500kb/s, 720p on >5mb/s)

### Drift Comparison Rules (17 rules, 3 severity levels)

**CRITICAL (deploy blocker):**
- Canonical tag changed or removed
- Primary CTA link broken
- h1 removed or changed
- Meta description removed
- Video missing

**HIGH (needs review):**
- CTA position moved >100px
- Schema.org changed
- Page speed regression >50ms LCP
- Mobile rendering changed

**MEDIUM (informational):**
- Minor CSS changes
- New images added
- Copy changes
- Meta keywords adjusted

## References

- `design-principles.md` — Umania methodology
- `conversion-framework.md` — CTA + funnel architecture
- `video-optimization.md` — ffmpeg + GSAP techniques
- Claude SEO v2.2.0 AGENTS.md — Multi-platform portability
- Google's May 2026 QRG — AI search optimization

## Development Rules

- Keep SKILL.md files under 500 lines
- Reference files max 200 lines, focused scope
- All Python scripts must have `--json` output
- Test with `npm run build` before delivery
- Validate schema with `schema:validate` hook

## Security

- URL validation: All scripts call `url_safety.validate_url()` before API calls
- No credentials in code; use `~/.config/umania-labs/`
- SSRF protection: Block private IPs, loopback, GCP metadata
- Config location: User-space only (not in repo)

## Who This Is For

- **Umania Labs core team** — Client delivery + quality assurance
- **Closers** — Pre-launch checklist before handing to client
- **Clients** — Post-launch monitoring (sent weekly/monthly)
- **New hires** — Onboarding on Umania standards

---

**Version:** 1.0.0  
**Last Updated:** June 2026  
**Author:** Pere Miquel Obrador  
**Maintenance:** Umania Labs Development Team
