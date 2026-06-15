# Web Design Hero: Scroll-Scrubbed Video & GSAP Specialist

**Tier 2 Hero Video Analysis Skill.** Deep analysis of hero sections with scroll-driven video playback, GSAP/ScrollTrigger configuration, performance tuning, and mobile rendering.

## Commands

- `/web-design hero <url>` — Full hero video analysis
- `/web-design hero inspect <url>` — Code inspection (GSAP config, timings)
- `/web-design hero mobile <url>` — Mobile rendering test (phone, tablet)
- `/web-design hero performance <url>` — LCP, CLS, video metrics

## Analysis Checklist

### Layout & Visual
- [ ] Full-bleed video (100vw, 100vh)
- [ ] Hero height responsive (40vh mobile, 100vh desktop)
- [ ] Overlay text readable on video (contrast ratio ≥ 4.5:1)
- [ ] CTA button positioned for thumb-friendly tap on mobile
- [ ] Video poster image set (shows while loading)

### Video Playback
- [ ] `<video>` element using `<source>` tags (codec fallback)
- [ ] `preload="metadata"` (not `preload="auto"`)
- [ ] Muted + autoplay (browsers require muted for autoplay)
- [ ] Controls hidden on hero (custom GSAP/Lenis controls)
- [ ] Crossfade technique: opacity-only (no `display: none`)

### GSAP + ScrollTrigger Configuration
- [ ] ScrollTrigger created with `scroller: window` (or Lenis target)
- [ ] `scrub: 1` (not `scrub: true`)
- [ ] `duration` set to video duration in seconds
- [ ] `onUpdate` callback maps scroll progress to `currentTime`
- [ ] Throttle enabled: only update if `delta > 0.05s` (5% progress)

### Lenis Integration (if used)
Required 3 lines:
```javascript
const lenis = new Lenis();
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
```

### Performance
- [ ] Video codec: h264 or VP9 (broad browser support)
- [ ] Bitrate: 1500-3000 kbps (sweet spot: 2.5 MB for 60s at 24fps)
- [ ] ffmpeg faststart applied (`-movflags faststart`)
- [ ] `currentTime` updates throttled (delta > 0.05s or ~167ms)
- [ ] Lazy load: video doesn't fetch until IntersectionObserver fires
- [ ] LCP: video should load within 2.5s on 4G
- [ ] CLS: no layout shift when video appears

### Mobile Rendering
- [ ] Video plays at correct aspect ratio on phone (16:9, 9:16, 1:1)
- [ ] Hero height mobile < 100vh (leaves room for nav + footer hint)
- [ ] Touch scrolling doesn't jank (60 fps minimum on iPhone 12)
- [ ] Landscape mode: video scales to full width
- [ ] Portrait mode: video scales to full height (may crop sides)

### Accessibility
- [ ] Caption track: `<track kind="captions" src="captions.vtt">`
- [ ] Or: burnt-in captions if critical
- [ ] Keyboard accessible: Tab to play/pause button
- [ ] Screen reader: descriptive `aria-label` on video
- [ ] No autoplay sound (muted is OK)

### CSS Gotchas

**WRONG:**
```css
.hero-scroll { overflow: hidden; }
.element { position: sticky; } /* BREAKS sticky */
```

**RIGHT:**
```css
.hero-scroll { overflow: clip; } /* Does NOT create scroll container */
.element { position: sticky; } /* Works correctly */
```

**WRONG (border-radius clip):**
```css
.video-container {
  border-radius: 12px;
  overflow: clip;
}
/* First pixel of child video gets clipped */
```

**RIGHT:**
```css
.video-container {
  border-radius: 12px;
  overflow: clip;
  padding: 1px; /* Offset internal edges */
}
```

## Output Format

### Video Analysis Report
```markdown
## Hero Video Analysis: [URL]

### Layout ✓/✗
- Full-bleed: ✓ (100vw, 100vh)
- Overlay contrast: ✓ (8.5:1)
- CTA positioning: ✓ (72px from bottom)

### Playback ✓/✗
- Video codec: ✓ h264
- Autoplay + muted: ✓
- Poster image: ✓
- Faststart: ✓

### GSAP/ScrollTrigger ✓/✗
- ScrollTrigger registered: ✓
- scrub: ✓ (value: 1)
- currentTime throttle: ✓ (delta: 0.05)
- Lenis integration: ✓ (3 lines present)

### Performance
- Video bitrate: 2.4 Mbps (optimal)
- Duration: 30s (recommended: 15-45s)
- LCP: 1.8s (✓ < 2.5s)
- CLS: 0.01 (✓ < 0.1)
- FID: 45ms (✓ < 100ms)

### Mobile Rendering
- iPhone 12 portrait: ✓ 60 fps
- iPad landscape: ✓ Full width
- Android scroll jank: ✓ None detected

### Issues Found
None detected. Hero is production-ready.

### Recommendations
1. Consider caption track for SEO (AI Mode likes video captions)
2. Add `loading="lazy"` to below-fold videos
3. Monitor LCP on 4G (currently 1.8s; target: <1.2s for premium)
```

## Code Inspection Deep Dive

When user requests `/web-design hero inspect <url>`:

```javascript
// Check these exact patterns in devtools:

// 1. GSAP registration
if (!gsap.plugins.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// 2. ScrollTrigger config
const trigger = ScrollTrigger.create({
  trigger: ".hero",
  scroller: window, // or lenis if integrated
  start: "top top",
  end: "bottom top",
  scrub: 1, // ← must be 1 (not true)
  onUpdate: (self) => {
    video.currentTime = self.progress * videoDuration;
  }
});

// 3. Throttle check
let lastTime = 0;
const THROTTLE_DELTA = 0.05; // 5% progress

onUpdate: (self) => {
  const progress = self.progress;
  if (Math.abs(progress - lastTime) > THROTTLE_DELTA) {
    video.currentTime = progress * videoDuration;
    lastTime = progress;
  }
}

// 4. Lenis three-liner
const lenis = new Lenis();
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
```

## Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| `overflow: hidden` ancestor | Sticky CTA vanishes mid-scroll | Change ancestor to `overflow: clip` |
| `scrub: true` | Video jumps instead of smooth scroll | Change to `scrub: 1` |
| No throttle on `currentTime` | Janky on scroll, 100+ updates/sec | Add delta > 0.05s check |
| Missing Lenis line | `gsap.ticker.add()` doesn't run | Add all 3 required lines |
| Video crossfade with `display: none` | Black flash between videos | Use opacity-only transitions |
| No faststart | First 2s of video loading | Re-encode: `ffmpeg -movflags faststart` |

## Video Optimization Checklist

Before delivery:
```bash
# Check faststart
ffprobe -v error -select_streams v:0 -show_entries stream=index \
  -of default=noprint_wrappers=1 video.mp4 | grep mdat

# Correct output: mdat appears AFTER ftyp (= faststart applied)
# Wrong output: mdat appears BEFORE moov (= video not optimized)

# Apply faststart if missing
ffmpeg -i input.mp4 -c copy -movflags faststart output.mp4
```

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| LCP (hero video) | < 2.5s | Must pass |
| CLS | < 0.1 | Must pass |
| FID | < 100ms | Must pass |
| Video bitrate | 1500-3000 kbps | Advisory |
| Mobile 60 fps | On iPhone 12+ | Must pass |
| Scroll jank | None visible | Must pass |

---

**Version:** 1.0.0  
**Status:** Production-ready  
**Maintenance:** Umania Labs - Media Team
