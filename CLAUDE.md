# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brain Training game collection built with React 19, TypeScript, and Vite. Three cognitive training games with persistent high scores stored in localStorage. Deployed to GitHub Pages at `/brain-trainingen/` base path.

## Development Commands

```bash
# Install dependencies (run first)
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm build

# Preview production build locally
npm preview

# Deploy to GitHub Pages (builds, commits dist/, pushes to gh-pages branch)
npm run deploy
```

## Architecture

### Core Application Structure

**App.tsx** - Root component managing application state and view routing:
- View routing: `'menu' | 'colorWord' | 'numberHunt' | 'memoryMatch' | 'highScores'`
- Centralized score management using `useLocalStorage` hook
- Score storage key: `'brain-training-scores'`
- Score types: `colorWord` (higher is better), `numberHunt` & `memoryMatch` (lower time in ms is better, null if not played)
- Game result callback pattern: `handleGameOver(score, gameType)` updates high scores and returns to menu

### Game Components

Three independent game components in `/components`:

1. **ColorWordGame** - Stroop effect test (60s timer, score-based)
   - Uses `COLORS` array from constants.ts for Swedish color words
   - Displays word in conflicting color, user selects correct color of text
   - Visual feedback: red border shake animation on incorrect answer

2. **NumberHuntGame** - Sequential number clicking (time-based performance)
   - 5x5 grid, click numbers 1-25 in order
   - Tracks completion time in milliseconds

3. **MemoryMatchGame** - Memory card matching (time-based performance)
   - Emoji-based matching pairs
   - Tracks completion time in milliseconds

### Shared Utilities

**useLocalStorage.ts** - Custom hook for persistent state:
- Supports functional updates: `setValue(prev => ({ ...prev, key: value }))`
- Auto-syncs with localStorage on mount via useEffect
- Type-safe with generics

**types.ts** - Core type definitions:
- `GameType`: union of game identifiers
- `Scores`: high score object structure
- `ColorInfo`: color name + Tailwind class mapping

**constants.ts** - Game configuration:
- `COLORS`: Swedish color names with Tailwind classes
- `COLOR_WORD_GAME_DURATION`: 60 seconds
- `NUMBER_HUNT_GRID_SIZE`: 5x5 grid

## Styling Approach

- Tailwind CSS via CDN (inline styles in components)
- Custom animations defined with `<style jsx>` blocks (fadeIn, shake)
- Color system: Swedish color names with Tailwind utility classes
- Dark theme: slate-900 background, slate-800 cards, cyan-400 accents

## Deployment Configuration

- Vite base path: `/brain-trainingen/` (GitHub Pages subdirectory)
- Deploy script creates `.nojekyll` file in dist/ to bypass Jekyll processing
- Uses `git subtree push --prefix dist origin gh-pages` for deployment

## TypeScript Configuration

- Strict mode enabled with comprehensive linting rules
- Bundler module resolution for Vite compatibility
- Source files expected in `/src` but currently in root (tsconfig may need adjustment)
- React 19 JSX transform enabled

## Known Quirks

- Source files are in project root, not `/src` directory (tsconfig.json references `/src` but isn't enforced)
- No test framework configured
- Swedish language hardcoded in color names and UI text
- Yellow color requires special handling in styles due to Tailwind's `-400` variant
