# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Meeting Bingo** — A browser-based bingo game that auto-detects corporate buzzwords via live audio transcription (Web Speech API). Players pick a buzzword category, get a randomized 5x5 card, and squares fill automatically when keywords are spoken during meetings. Single-player MVP, zero-cost infrastructure, all processing client-side.

The app is in the design/planning phase. Detailed specs live in `docs/`:
- `docs/research/meeting-bingo-prd.md` — Full PRD with user stories, data models, UI specs
- `docs/research/meeting-bingo-architecture.md` — Architecture plan with pre-written code for ~8 core files
- `docs/research/meeting-bingo-uxr.md` — UX research, personas, journey maps
- `docs/implementation/meeting-bingo-implementation-plan.md` — Phased build plan with file creation order and dependency layers

## Tech Stack

React 18 + TypeScript, Vite, Tailwind CSS, canvas-confetti, localStorage for persistence, Vercel for deploy. Package manager: **pnpm**.

## Development Commands

```bash
pnpm dev          # Start Vite dev server (port 3000)
pnpm build        # TypeScript check + Vite build
pnpm preview      # Preview production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # ESLint
vercel --prod     # Deploy to Vercel
varlock           # Regenerate env.d.ts from .env.schema
```

## App Architecture

Screen flow: Landing → Category Selection → Game Board → Win Screen

Key source directories (planned, per architecture doc):
- `src/types/` — Shared TypeScript interfaces (CategoryId, BingoSquare, GameState, etc.)
- `src/data/categories.ts` — 3 buzzword packs (Agile, Corporate, Tech), 40+ words each
- `src/lib/` — Pure logic: `cardGenerator.ts` (Fisher-Yates shuffle, 5x5 grid), `bingoChecker.ts` (row/col/diagonal win detection), `wordDetector.ts` (regex + alias matching), `shareUtils.ts`
- `src/hooks/` — `useGame.ts` (central state), `useSpeechRecognition.ts` (Web Speech API wrapper with continuous mode + auto-restart), `useBingoDetection.ts`, `useLocalStorage.ts`
- `src/components/` — Screen components (LandingPage, CategorySelect, GameBoard, WinScreen) + leaf components (BingoCard, BingoSquare, TranscriptPanel, GameControls) + `ui/` primitives

State management: Prop-passing from `App.tsx` via `useGame` hook (no React Context for MVP). Game state persisted to localStorage.

## Environment Setup

- **Environment schema**: `.env.schema` uses [@env-spec](https://varlock.dev/env-spec) to declare environment variables
- **Type generation**: Running `varlock` generates `env.d.ts` from `.env.schema`, providing TypeScript types for `process.env` and `import.meta.env`
- **Secrets**: `.env` contains actual values (e.g., `LINEAR_API_KEY`) and is untracked by git

## CLI Tools

- **varlock** — Environment variable validation and TypeScript type generation from `.env.schema`
- **lin** (`@linear/cli`) — Linear CLI. `lin new` (create issues), `lin checkout` (checkout branches for started issues)
- **vercel** — Vercel CLI for deployment and preview
- **pnpm** — Package manager

## External Integrations

- **Linear** — Project management via `LINEAR_API_KEY`
