# Agent: Drift Monitoring & Baseline Comparison

**Purpose:** Monitor for unintended changes post-deployment.

## Responsibilities

1. **Baseline Capture**
   - Run `drift_baseline.py` before launch
   - Store SQLite database with page snapshot
   - Record: title, meta, h1, canonical, schema, CTAs, word count

2. **Change Detection**
   - Run `drift_compare.py` after deployment
   - Detect 17 change rules across 3 severity levels
   - Generate diff report

3. **Severity Classification**

   **CRITICAL (deploy blocker):**
   - Canonical tag changed/removed
   - Primary CTA link broken
   - h1 removed
   - Meta description removed
   - Hero video missing

   **HIGH (needs review):**
   - CTA position moved >100px
   - Schema changed
   - Page speed regression >50ms LCP
   - Mobile rendering changed

   **MEDIUM (informational):**
   - Image count changed
   - Content length changed >500 words
   - h1 count changed
   - Minor CSS changes

4. **Reporting**
   - Generate change timeline
   - Highlight what changed and why
   - Recommend rollback if critical

## Execution Flow

```
BEFORE LAUNCH:
1. Run: drift_baseline.py https://example.com
2. Store in: ~/.config/umania-labs/example.com-baseline.db
3. Commit to git (note baseline captured)

AFTER DEPLOYMENT:
1. Run: drift_compare.py https://example.com
2. Review report
3. If CRITICAL issues: rollback deploy
4. If HIGH: coordinate with dev
5. Archive report in project docs
```

## Workflow for Clients

```
Send to client weekly:
"Your site monitored this week:
✓ No changes detected
✓ All systems stable
→ View full report [link]"

After client update:
"⚠ Your site changed in 2 areas:
🔴 Page speed regression (LCP +200ms)
🟠 CTA link updated (intentional?)
→ Review report and confirm [link]"
```

---

**Status:** Active  
**Critical for:** Post-launch SLA  
**Database location:** ~/.config/umania-labs/[domain]-baseline.db
