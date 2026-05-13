# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Type-check + build (tsc && vite build)
npx tsc --noEmit  # Type-check only (no tests exist)
```

Package manager is **pnpm**. No linting config or test framework is set up.

## Architecture

Single-page React + TypeScript app (Vite). No backend, no routing.

### State management

All application state lives in `App.tsx` and is passed down as props. There is no global store. The key distinction:

- **`rootNote`** — the musical key (affects scales, intervals, key reference)
- **`chordRoot`** — the root of the chord shown on the fretboard (can differ from `rootNote` when clicking chords in the key reference or a progression)

Scales/modes and chords are **mutually exclusive** — selecting one clears the other. This logic lives in wrapped handlers (`handleScaleTypeChange`, `handleTriadTypeChange`, etc.) in `App.tsx`.

### The two source-of-truth files

Almost all music logic and data constants live in exactly two files:

- **`src/types/music.ts`** — all TypeScript types and interfaces
- **`src/utils/music.ts`** — all music computation functions, pattern arrays (scales, chords, modes, CAGED), chord progression data, and display utilities

When adding a new chord type, scale, or progression, both files need to be updated.

### ChordProgressions reset pattern

`ChordProgressions` manages its own local state (category, keyType, startingNumeral, selectedProgression). Resetting it from outside uses a `chordProgressionsResetKey` counter in `App.tsx` that is passed through `Controls` as the `key` prop on `<ChordProgressions>` — incrementing it causes React to unmount/remount the component, clearing all local state.

### `handleChordSelect` must stay memoized

`handleChordSelect` in `App.tsx` is wrapped in `useCallback` with an empty deps array. This is required because `ChordProgressions` has a `useEffect` that depends on `onChordSelect`. Without memoization, every re-render creates a new function reference, triggering the effect and overriding any chord selection made from the key reference panel.

### Note representation

Notes are stored internally as sharps only (`C#`, `D#`, etc.). The `getNoteDisplay()` utility renders them with enharmonic equivalents (`C#/Db`) for display. Never store or compare flat spellings.

### Fretboard rendering

`Fretboard.tsx` is purely presentational — it receives all state as props and derives what to display per-note using the utility functions from `utils/music.ts`. It supports two root concepts: `rootNote` (for scale/interval coloring) and `chordRoot` (for chord tone coloring), resolved internally as `effectiveChordRoot`.
