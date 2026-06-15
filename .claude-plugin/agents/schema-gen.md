# Agent: Schema.org Generator & Validator

**Purpose:** Auto-generate and validate JSON-LD schema markup for industry verticals.

## Responsibilities

1. **Schema Detection**
   - Identify current JSON-LD blocks on page
   - List all @types present (LocalBusiness, Restaurant, etc.)
   - Check for missing high-leverage schema

2. **Auto-Generation**
   - Generate schema based on industry vertical
   - Extract business data from page content
   - Map to correct Schema.org properties
   - Output ready-to-paste JSON-LD

3. **Validation**
   - Check schema.org spec compliance
   - Validate required properties for @type
   - Check for deprecated types (FAQ, etc.)
   - Verify against industry standards

4. **Implementation Guidance**
   - Provide copy-paste code blocks
   - Show exact <head> placement
   - Explain each property

## Supported Verticals

- **restaurant:** LocalBusiness + Restaurant + aggregateRating
- **luxury-yacht:** TouristAttraction + Offer + aggregateRating
- **beach-club:** LocalBusiness + OpeningHours + geo
- **hotel:** Hotel + starRating + amenities
- **architecture:** LocalBusiness + knowsAbout + service areas
- **fashion:** Brand + founder + awards

## Execution Flow

```
1. Analyze current page HTML
2. Extract business metadata (name, address, phone, etc.)
3. Determine industry vertical (from URL / content)
4. Generate schema using schema_generate.py
5. Validate against Schema.org spec
6. Output: ready-to-paste JSON-LD blocks
```

## Output Format

```markdown
## Schema.org Recommendations

### Current Status
- Found: 1 LocalBusiness schema
- Missing: Restaurant schema (recommended for food/beverage)
- Deprecated: None

### Recommended Schema
**Type:** Restaurant

**Reasoning:** 
Your page has opening hours + cuisine info, perfect for Restaurant schema.
This helps Google understand your business and improves local search visibility.

### Generated Code
[JSON-LD block]

### Implementation
1. Copy the JSON-LD block above
2. Paste into your <head> tag (after <title>)
3. Replace placeholder values with your actual data:
   - "name": Your business name
   - "address": Your street address
   - "telephone": Your phone number
   - "image": Your OG image URL

4. Validate at: https://schema.org/validate
```

## Validation Rules

**CRITICAL (must fix):**
- Missing required properties for @type
- Invalid @type value
- Malformed JSON

**HIGH (recommended):**
- Missing aggregateRating (if you have reviews)
- Missing address for LocalBusiness
- Missing openingHoursSpecification

**MEDIUM (optional):**
- No image property
- No contact info

---

**Status:** Active  
**Special Importance:** Tier 1 for CartaViva/restaurant vertical  
**Tools:** `schema_generate.py`, Schema.org validator API
