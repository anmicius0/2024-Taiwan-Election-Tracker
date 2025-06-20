# AI Coding Guidelines

## Tech Stack & Conventions

- **Framework**: Svelte 5 (Runes mode), SvelteKit 2, Vite 6
- **Styling**: Tailwind CSS 4 (`@theme`), CSS Variables for theming
- **Visualization**: ECharts 5
- **Language**: TypeScript

## Svelte 5 Patterns

- **State**: Use `$state(val)` instead of top-level `let val`.
- **Props**: Use `let { prop } = $props()` instead of `export let prop`.
- **Derivations**: Use `$derived(expr)` instead of `$: label = expr`.
- **Effects**: Use `$effect(() => { ... })` for side effects.
- **Events**: Use standard HTML attributes (e.g., `onclick`) instead of `on:click`.

## Architecture & Data Flow

- **Data Source**: `static/p3.json` (Polling records: institution, method, sample, dpp, kmt, tpp, date)
- **Loading Strategy**:
  - `src/routes/+page.ts` fetches `/p3.json` and returns `{ polls }`.
  - `src/routes/+page.svelte` receives data via `let { data } = $props()`.
- **Business Logic**:
  - `src/lib/utils/taiwanPollingAlgorithm.ts` contains the core weighting algorithm.
  - Important Types: `PollData` (raw), `WeightedPoll` (processed), `PredictionResult`.
- **Components**: Located in `src/lib/components/`. Keep them pure when possible.

## Styling System (Tailwind 4)

- **Configuration**: Defined in `src/app.css` using the `@theme` block.
- **Party Colors**: Use CSS variables or utility classes mapped to them:
  - DPP (Green): `var(--color-dpp)` / `#00ff62`
  - KMT (Blue): `var(--color-kmt)` / `#2884ff`
  - TPP (Cyan): `var(--color-tpp)` / `#00e5ff`
- **Visual Theme**: Glassmorphism. Use `backdrop-blur-*`, semi-transparent backgrounds (`bg-white/10`), and thin borders (`border-white/10`).
- **Dynamic Backgrounds**: Refer to `.liquid-bg` and blob animations in `src/app.css`.

## Development Workflow

- **Lint/Format**: `npm run lint` && `npm run format` (Prettier + ESLint).
- **Type Check**: `npm run check` (Svelte-check).
- **Debugging**: `p3.json` structure matches the `PollData` interface. If charts break, check date parsing in `taiwanPollingAlgorithm.ts`.

## Key Files

- `src/lib/utils/taiwanPollingAlgorithm.ts`: Main weighting logic.
- `src/lib/components/Chart.svelte`: ECharts wrapper.
- `src/app.css`: Global styles, Tailwind configuration, and animations.</content>
  <parameter name="filePath">/Users/allen/Projects/2024-Taiwan-Election-Tracker/.github/copilot-instructions.md
