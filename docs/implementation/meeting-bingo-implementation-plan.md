# Meeting Bingo — Implementation Plan

## Context

The project has detailed design docs (`docs/research/`) but zero application code. We need to build the full Meeting Bingo app from scratch in the project root (`/workspaces/agentic-workshop/`). The architecture doc contains pre-written code for ~8 files; the remaining ~25 files must be written fresh.

**Tech stack**: React 18 + TypeScript, Vite, Tailwind CSS, Web Speech API, canvas-confetti, localStorage, Vercel deploy. **Package manager**: pnpm.

---

## Phase 0: Project Scaffolding
**Goal**: Running Vite dev server with blank React page.

- `pnpm init` + install deps (react, react-dom, canvas-confetti, vite, tailwindcss, typescript, etc.)
- Create config files: `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`
- Create `index.html`, `src/main.tsx`, `src/index.css` (Tailwind directives), `.gitignore`, `public/favicon.svg`
- **Verify**: `pnpm dev` serves a page at localhost:3000

## Phase 1: Types, Data, and Pure Logic
**Goal**: All type definitions and utility functions compile cleanly.

- `src/types/index.ts` — from arch doc (CategoryId, BingoSquare, BingoCard, GameState, etc.)
- `src/data/categories.ts` — from arch doc (3 buzzword packs, 40+ words each)
- `src/lib/utils.ts` — `cn()` utility (simple `clsx`-like class joiner)
- `src/lib/cardGenerator.ts` — from arch doc (Fisher-Yates shuffle, 5x5 grid)
- `src/lib/bingoChecker.ts` — from arch doc (row/col/diagonal win detection)
- `src/lib/wordDetector.ts` — from arch doc (regex matching + alias support)
- `src/lib/shareUtils.ts` — new (format share text, clipboard/native share API)
- **Verify**: `pnpm typecheck` passes

## Phase 2: Hooks
**Goal**: All stateful logic ready to wire into components.

- `src/hooks/useLocalStorage.ts` — new (generic localStorage persistence hook)
- `src/hooks/useSpeechRecognition.ts` — from arch doc (Web Speech API wrapper, continuous mode, auto-restart)
- `src/hooks/useBingoDetection.ts` — new (watches card state, fires onBingo once per card)
- `src/hooks/useGame.ts` — new (central game state: startGame, toggleSquare, processTranscript, resetGame, newCard)
- **Verify**: `pnpm typecheck` passes

## Phase 3: UI Primitives
**Goal**: Shared atoms ready.

- `src/components/ui/Button.tsx` — primary/secondary/ghost variants
- `src/components/ui/Card.tsx` — container with border/shadow
- `src/components/ui/Toast.tsx` — auto-dismiss toast + ToastContainer
- `src/context/GameContext.tsx` — optional context wrapper (may skip for MVP prop-passing)
- **Verify**: `pnpm typecheck` passes

## Phase 4: Core Screen Components (Manual Play)
**Goal**: Full game loop works with manual square tapping. No speech yet.

- `src/components/LandingPage.tsx` — hero, CTA, privacy note, how-it-works
- `src/components/CategorySelect.tsx` — 3 category cards with previews
- `src/components/BingoSquare.tsx` — from arch doc (click-to-fill, state-based styling)
- `src/components/BingoCard.tsx` — new (5x5 grid, maps squares to BingoSquare)
- `src/components/TranscriptPanel.tsx` — from arch doc (live transcript + detected words)
- `src/components/GameControls.tsx` — new (listening toggle, new card, home buttons)
- `src/components/GameBoard.tsx` — new (wires card + controls + transcript panel)
- `src/App.tsx` — from arch doc (screen router: landing → category → game → win)
- **Verify**: `pnpm dev` — navigate landing → category → game, tap squares, get BINGO

## Phase 5: Win Screen + Confetti
**Goal**: Satisfying win celebration.

- `src/components/WinScreen.tsx` — new (confetti on mount, game stats, share/play again buttons)
- Uses `canvas-confetti` for particle effects
- **Verify**: Fill 5 in a row manually → confetti plays, stats shown, play again works

## Phase 6: Speech Recognition Wiring
**Goal**: Microphone auto-fills squares when buzzwords are spoken.

- Wire `useSpeechRecognition` into `GameBoard`
- `startListening(handleTranscript)` callback detects words and fills squares
- Use `filledWordSet` ref to prevent double-counting
- Handle: permission denied, unsupported browser (fallback to manual)
- **Verify**: Chrome, start listening, say category words → squares auto-fill

## Phase 7: localStorage Persistence
**Goal**: Game survives page refresh.

- Use `useLocalStorage` in `App.tsx` for game state
- Re-derive `filledWordSet` from restored card on mount
- **Verify**: Fill squares, refresh, state persists

## Phase 8: Polish + Deploy
**Goal**: Ship it.

- Responsive tweaks for small screens
- Accessibility: `aria-label` on toggle, `role="status"` on transcript
- `pnpm build` → `vercel --prod`
- **Verify**: Full game loop on mobile Chrome via Vercel URL

---

## File Creation Order

Files must be created in dependency order to avoid import resolution failures:

```
Layer 0 — Config (no imports):
  package.json, tsconfig.json, tsconfig.node.json, vite.config.ts,
  tailwind.config.js, postcss.config.js, index.html, .gitignore, public/favicon.svg

Layer 1 — Types (no imports):
  src/types/index.ts

Layer 2 — Data (imports types):
  src/data/categories.ts

Layer 3 — Pure Libs (imports types + data):
  src/lib/utils.ts
  src/lib/cardGenerator.ts
  src/lib/bingoChecker.ts
  src/lib/wordDetector.ts
  src/lib/shareUtils.ts

Layer 4 — Hooks (imports types + libs):
  src/hooks/useLocalStorage.ts
  src/hooks/useSpeechRecognition.ts
  src/hooks/useBingoDetection.ts
  src/hooks/useGame.ts

Layer 5 — UI Primitives (imports types + utils):
  src/components/ui/Button.tsx
  src/components/ui/Card.tsx
  src/components/ui/Toast.tsx

Layer 6 — Leaf Components (imports types + primitives):
  src/components/BingoSquare.tsx
  src/components/BingoCard.tsx
  src/components/TranscriptPanel.tsx
  src/components/GameControls.tsx

Layer 7 — Screen Components (imports all lower layers):
  src/components/LandingPage.tsx
  src/components/CategorySelect.tsx
  src/components/WinScreen.tsx
  src/components/GameBoard.tsx

Layer 8 — App Root:
  src/context/GameContext.tsx
  src/App.tsx
  src/main.tsx
  src/index.css
```

---

## File Summary

| Source | Count | Examples |
|--------|-------|---------|
| From architecture doc (copy) | 8 | types/index.ts, cardGenerator.ts, bingoChecker.ts, wordDetector.ts, useSpeechRecognition.ts, BingoSquare.tsx, TranscriptPanel.tsx, categories.ts |
| Written fresh | ~25 | useGame.ts, GameBoard.tsx, WinScreen.tsx, LandingPage.tsx, CategorySelect.tsx, shareUtils.ts, etc. |
| Config files | ~8 | package.json, tsconfig.json, vite.config.ts, tailwind.config.js, etc. |
| **Total** | **~41** | |

---

## Complete File Tree

```
/workspaces/agentic-workshop/
├── .gitignore                              NEW
├── index.html                              NEW
├── package.json                            NEW
├── tsconfig.json                           NEW
├── tsconfig.node.json                      NEW
├── vite.config.ts                          NEW (from arch doc)
├── tailwind.config.js                      NEW (from arch doc)
├── postcss.config.js                       NEW
├── public/
│   └── favicon.svg                         NEW
└── src/
    ├── main.tsx                            NEW
    ├── App.tsx                             NEW (from arch doc)
    ├── index.css                           NEW
    ├── types/
    │   └── index.ts                        NEW (from arch doc)
    ├── data/
    │   └── categories.ts                   NEW (from arch doc)
    ├── lib/
    │   ├── utils.ts                        NEW
    │   ├── cardGenerator.ts                NEW (from arch doc)
    │   ├── bingoChecker.ts                 NEW (from arch doc)
    │   ├── wordDetector.ts                 NEW (from arch doc)
    │   └── shareUtils.ts                   NEW
    ├── hooks/
    │   ├── useLocalStorage.ts              NEW
    │   ├── useSpeechRecognition.ts         NEW (from arch doc)
    │   ├── useBingoDetection.ts            NEW
    │   └── useGame.ts                      NEW
    ├── context/
    │   └── GameContext.tsx                  NEW (optional)
    └── components/
        ├── LandingPage.tsx                 NEW
        ├── CategorySelect.tsx              NEW
        ├── GameBoard.tsx                   NEW
        ├── BingoCard.tsx                   NEW
        ├── BingoSquare.tsx                 NEW (from arch doc)
        ├── TranscriptPanel.tsx             NEW (from arch doc)
        ├── WinScreen.tsx                   NEW
        ├── GameControls.tsx                NEW
        └── ui/
            ├── Button.tsx                  NEW
            ├── Card.tsx                    NEW
            └── Toast.tsx                   NEW
```

---

## Key Design Decision

Use prop-passing from `App.tsx` (matching the architecture doc) rather than React Context for MVP. The `useGame` hook lives in `App.tsx` and its methods are passed down. This keeps state ownership clear and avoids context complexity.

---

## Known Implementation Challenges

1. **GameBoard state ownership**: `App.tsx` passes `setGame` into `GameBoard`, which does immutable card updates inline. Alternative: `useGame` hook owns all mutations and passes functions down. Plan uses `useGame` for cleaner separation.

2. **Speech callback stale closures**: `startListening(onResult)` captures `game.card` at call time. If the card changes, the old callback has stale data. Fix: read card from a ref inside the callback (`cardRef.current`).

3. **Web Speech API types**: Not in TypeScript's DOM lib. Architecture doc uses `(window as any)`. May add `src/types/speech.d.ts` for full type safety.

4. **canvas-confetti imports**: With `"type": "module"` and strict TS, needs `@types/canvas-confetti` (included in devDeps).
