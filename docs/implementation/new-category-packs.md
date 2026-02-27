# Feature: New Buzzword Category Packs

Three new buzzword category packs — Sales, Marketing, and Customer Support — to expand the game beyond engineering/corporate audiences.

---

## Feature Card 1: Sales Terms Pack

**Category ID**: `sales`
**Name**: Sales & Revenue
**Icon**: 📈
**Description**: Pipelines, quotas, and closing deals

**Words (40+)**:
`pipeline`, `quota`, `close the deal`, `cold call`, `warm lead`, `prospect`, `discovery call`, `objection handling`, `upsell`, `cross-sell`, `churn`, `renewal`, `ARR`, `MRR`, `ACV`, `deal flow`, `sales cycle`, `demo`, `proof of concept`, `champion`, `decision maker`, `buying signal`, `next steps`, `follow up`, `territory`, `book of business`, `forecast`, `commit`, `sandbagging`, `land and expand`, `value sell`, `solution selling`, `BANT`, `MEDDIC`, `competitive displacement`, `price objection`, `discount`, `negotiation`, `procurement`, `SOW`, `mutual action plan`, `multithreading`, `white space`, `net new`, `expansion revenue`, `logo`, `install base`

**Rationale**: Sales teams have meetings packed with jargon — pipeline reviews, forecast calls, deal strategy sessions. High engagement potential.

---

## Feature Card 2: Marketing Terms Pack

**Category ID**: `marketing`
**Name**: Marketing & Growth
**Icon**: 📣
**Description**: Funnels, campaigns, and brand awareness

**Words (40+)**:
`funnel`, `top of funnel`, `bottom of funnel`, `conversion rate`, `CTR`, `click-through rate`, `impressions`, `engagement`, `brand awareness`, `content strategy`, `SEO`, `SEM`, `organic`, `paid media`, `retargeting`, `attribution`, `campaign`, `A/B test`, `persona`, `ICP`, `go-to-market`, `launch`, `messaging`, `positioning`, `thought leadership`, `demand gen`, `lead gen`, `MQL`, `SQL`, `nurture`, `drip campaign`, `webinar`, `case study`, `social proof`, `influencer`, `earned media`, `share of voice`, `brand lift`, `creative`, `asset`, `CTA`, `landing page`, `bounce rate`, `cohort`, `viral`, `omnichannel`

**Rationale**: Marketing teams run frequent planning sessions and campaign reviews full of these terms. Natural fit for the game format.

---

## Feature Card 3: Customer Support Pack

**Category ID**: `support`
**Name**: Customer Support
**Icon**: 🎧
**Description**: Tickets, SLAs, and customer satisfaction

**Words (40+)**:
`ticket`, `queue`, `escalation`, `first response time`, `resolution time`, `SLA`, `CSAT`, `NPS`, `customer satisfaction`, `backlog`, `triage`, `severity`, `priority`, `workaround`, `root cause`, `known issue`, `regression`, `hotfix`, `patch`, `release notes`, `runbook`, `playbook`, `macro`, `canned response`, `self-service`, `knowledge base`, `FAQ`, `help center`, `onboarding`, `churn risk`, `health score`, `customer success`, `QBR`, `renewal`, `at-risk`, `voice of customer`, `feedback loop`, `sentiment`, `deflection`, `first contact resolution`, `handle time`, `agent`, `tier one`, `tier two`, `warm transfer`, `follow up`

**Rationale**: Support and CS teams hold standups, triage meetings, and QBRs where these terms are constant. Great audience overlap with existing corporate pack.

---

## Implementation Plan

### Step 1: Update `CategoryId` type
**File**: `src/types/index.ts`

Expand the union type to include the new IDs:

```typescript
export type CategoryId = 'agile' | 'corporate' | 'tech' | 'sales' | 'marketing' | 'support';
```

### Step 2: Add category data
**File**: `src/data/categories.ts`

Append three new entries to the `CATEGORIES` array following the existing pattern (id, name, description, icon, words array with 40+ entries each).

### Step 3: Update CategorySelect UI layout
**File**: `src/components/CategorySelect.tsx`

The component currently renders 3 category cards. With 6 categories, update the grid layout:
- Desktop: 3-column grid (2 rows of 3)
- Mobile: single-column stack (unchanged)

Verify the existing `CATEGORIES.map()` dynamically renders all entries — if so, no JSX changes needed, only the grid class (e.g., `grid-cols-3` is likely already set).

### Step 4: Verify no hardcoded category assumptions
Check these files for any logic that assumes exactly 3 categories or hardcodes `'agile' | 'corporate' | 'tech'`:
- `src/hooks/useGame.ts` — category selection logic
- `src/components/LandingPage.tsx` — any "3 categories" copy
- `src/lib/cardGenerator.ts` — category lookup

### Step 5: Test
- `pnpm typecheck` — ensure no type errors from expanded `CategoryId`
- `pnpm dev` — verify all 6 categories render on the selection screen
- Select each new category → confirm a valid 5x5 card is generated
- Say a few buzzwords from each pack → verify auto-detection works

---

## Files Modified

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `'sales' \| 'marketing' \| 'support'` to `CategoryId` |
| `src/data/categories.ts` | Add 3 new category objects (~120 lines) |
| `src/components/CategorySelect.tsx` | Grid layout adjustment if needed |

**Estimated scope**: Small — data and type changes only, no new components or hooks.
