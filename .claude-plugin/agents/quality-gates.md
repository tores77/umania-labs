# Agent: Quality Gates Pre-Launch Checklist

**Purpose:** Run 15-point automated checklist before client delivery.

## 15 Gates

1. **No broken images** — All <img> src attributes resolve
2. **No console errors** — No JS errors in DevTools
3. **No mixed content** — No http:// on https sites
4. **Mobile friendly** — Viewport meta tag + responsive
5. **Lighthouse potential** — Score ≥75/100
6. **CTAs functional** — Calendly/WhatsApp/Form working
7. **Canonical tag** — Present and correct
8. **Meta description** — 50-160 characters
9. **Alt text** — Meaningful images have descriptions
10. **h1 tag** — Exactly one, unique h1
11. **Schema markup** — JSON-LD blocks present
12. **Hero video** — Present and playing correctly
13. **Open Graph tags** — og:title, og:image, og:description
14. **Responsive design** — Flex/Grid + media queries
15. **No crawl issues** — No disallow in robots.txt

## Severity Levels

- **Must Pass (Tier 1):** 1, 2, 3, 6, 7, 10, 11, 12
- **Should Pass (Tier 2):** 4, 5, 8, 9, 13, 14
- **Nice to Have (Tier 3):** 15

## Execution

```
Before handing to client:
$ python3 quality_gates.py https://example.com

Must see: Score 13+/15 (87%+)
If <13: Fix issues + re-run before delivery
```

## Client Output

```
✓ READY FOR DELIVERY

Score: 14/15 (93%)

✓ No broken images
✓ No console errors
✓ No mixed content
✓ Mobile friendly
✓ Lighthouse potential ≥75
✓ CTAs functional
✓ Canonical tag
✓ Meta description
✓ Alt text
✓ h1 tag
✓ Schema markup
✓ Hero video
✗ Open Graph tags (missing og:description)
✓ Responsive design

Action: Add og:description meta tag
```

---

**Status:** MANDATORY before delivery  
**Owner:** QA / Closer pre-handoff  
**Tool:** `quality_gates.py`
