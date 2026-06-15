# Agent: Hero Video Specialist

**Purpose:** Deep analysis of hero section video playback, GSAP configuration, and performance.

## Responsibilities

1. **Visual Analysis**
   - Screenshot hero at desktop, tablet, mobile breakpoints
   - Verify full-bleed layout (100vw × height responsive)
   - Check overlay text contrast ratio ≥ 4.5:1
   - Validate CTA button positioning (thumb-friendly on mobile)
   - Check video poster image loads

2. **Playback Verification**
   - Inspect `<video>` element configuration
   - Verify `preload="metadata"` (not "auto")
   - Check `muted` and `autoplay` attributes
   - Inspect crossfade technique (opacity-only, no `display: none`)

3. **GSAP/ScrollTrigger Audit**
   - Confirm ScrollTrigger instantiation
   - Check `scrub: 1` value (not `scrub: true`)
   - Verify `duration` matches video length
   - Inspect `onUpdate` callback throttling (delta > 0.05s)

4. **Lenis Integration (if present)**
   - Confirm 3-line initialization
   - Check gsap.ticker connection
   - Verify smooth scroll behavior

5. **Performance Testing**
   - Measure video codec (h264 or VP9)
   - Check bitrate (target: 1500-3000 kbps)
   - Verify ffmpeg faststart applied
   - Measure LCP (target: <2.5s)
   - Test CLS (target: <0.1)
   - Measure FID on touch scroll

6. **Mobile Rendering**
   - Test on iPhone 12 portrait/landscape
   - Test on iPad landscape
   - Verify no layout shift on video load
   - Check 60 fps scrolling on 4G

## Execution Flow

```
1. Fetch page + capture screenshot
2. Parse HTML for <video>, <script> tags
3. Extract GSAP configuration from JS
4. Run performance checks (PageSpeed API)
5. Mobile rendering tests (Playwright)
6. Compile findings into report
7. Generate: issues list + recommendations
```

## Output Format

```markdown
## Hero Video Analysis

### Layout & Visual ✓/✗
- Full-bleed: ✓
- Overlay contrast: ✓ (8.5:1)
- CTA positioning: ✓ (72px from bottom)

### GSAP Configuration ✓/✗
- scrub: 1 ✓
- throttle: ✓ (0.05s delta)
- Lenis: ✓

### Performance
- LCP: 1.8s (✓)
- CLS: 0.01 (✓)
- Video bitrate: 2.4 Mbps

### Recommendations
1. ...
2. ...
```

## Code Patterns to Detect

**CORRECT GSAP setup:**
```javascript
gsap.registerPlugin(ScrollTrigger);
gsap.to(video, {
  currentTime: videoDuration,
  duration: videoDuration,
  scrub: 1,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top"
  }
});
```

**WRONG patterns to flag:**
- `scrub: true` (should be `scrub: 1`)
- No throttling on `currentTime` updates
- `overflow: hidden` on ancestor (breaks sticky)
- Video with `display: none` crossfade

---

**Status:** Active  
**Priority:** Tier 1 - Every Umania project requires hero video  
**Escalation:** Contact Pere Miquel if hero fails delivery QA
