# 🇹🇼 2024 Taiwan Election Tracker 🗳️

This project provides comprehensive polling data and insights into the 2024 Taiwan Presidential Election. It aggregates real-time polling data from various research institutions in Taiwan and visualizes it through interactive charts and tables. Additionally, it offers expert analysis and explainers on key election issues and candidates.

> **Note:** 🛑 This project is archived and no longer receives live updates. Data and content are for historical reference only.

## ✨ Features

- 📈 **Interactive Polling Chart:** Visualize polling trends over time for the major political parties (DPP, KMT, TPP) and undecided voters. Users can select which polling sources to include in the visualization.
- 📊 **Detailed Poll Table:** View a comprehensive table of all collected polling data, including institution, date, sample size, and percentages for each party and undecided voters.
- 💻 **Modern UI:** A clean and modern user interface designed with Tailwind CSS, featuring custom typography, cards, checkboxes, and buttons for a smooth user experience.

## 🧮 Polling Algorithm

This project utilizes a custom **Demographic Structural Model (DSM)** (`src/lib/utils/taiwanPollingAlgorithm.ts`) to process raw polling data through three mathematical correction layers:

1. **Methodology Weighting**: Corrects traditional "Landline Bias" by scaling weights based on polling methods (Landline, SMS, Mobile) alongside recency decay (14-day halflife) and logarithmic sample scaling.
2. **Structural Regression**: Uses the 2022 Taipei Mayoral election as a proxy to normalize historical floors and mitigate the "Spiral of Silence".
3. **Undecided Allocation**: Probabilistically distributes undecided voters utilizing momentum bonuses and consolidation deltas.

## 🛠️ Technologies Used

- 🥟 **Bun:** Ultra-fast all-in-one JavaScript runtime and package manager.
- ⚡ **SvelteKit 2 & Svelte 5:** The bleeding-edge reactive UI framework (using Runes mode).
- 🎨 **Tailwind CSS v4:** Utility-first styling with the new CSS-variable-based `@theme` engine.
- 🚀 **Vite 6:** Next-generation frontend tooling.
- 📊 **ECharts:** A powerful, interactive charting and visualization library for the browser.
- 🟦 **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- 🧹 **ESLint 9 (Flat Config) & Prettier:** For modern code linting and formatting.

## 🗂️ Project Structure

- `src/routes`: Contains SvelteKit routes. `+page.svelte` is the main application page, and `+layout.svelte` defines the global layout.
- `src/lib/components`: Reusable Svelte UI components (`Chart.svelte`, `PollTable.svelte`, etc.).
- `src/lib/composables.ts`: Contains composable functions like `useChart()` and ECharts configuration.
- `src/lib/utils/`: Core math logic and utility functions, mainly `taiwanPollingAlgorithm.ts`.
- `src/app.css`: Global styles, Neo-Brutalist design system, and Tailwind CSS v4 `@theme` configuration.
- `static/p3.json`: The JSON file containing the raw polling data.
- `svelte.config.js`: SvelteKit configuration.
- `vite.config.ts`: Vite configuration for the project.
- `eslint.config.js`: ESLint configuration for code quality.
- `.prettierrc`: Prettier configuration for code formatting.

## 🚀 Development

To get started with the project locally:

1. 🧑‍💻 **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/2024-taiwan-election-tracker.git
   cd 2024-taiwan-election-tracker
   ```

2. 📦 **Install dependencies:**

   ```bash
   bun install
   ```

3. 🏃 **Start the development server:**

   ```bash
   bun run dev
   # or to open in a new browser tab automatically:
   bun run dev --open
   ```

   The application will be accessible at `http://localhost:5173` (or a different port if 5173 is in use).

## 🏗️ Building

To create a production version of your app:

```bash
bun run build
```

This will generate a build directory with the optimized production assets.

## 👀 Previewing the Production Build

You can preview the production build locally:

```bash
bun run preview
```

## 🧹 Linting and Formatting

To ensure code quality and consistency:

- ✨ **Format code:**

  ```bash
  bun run format
  ```

- 🔍 **Lint code:**

  ```bash
  bun run lint
  ```

## 🤝 Extending and Contributing

- 🗳️ **Adding New Poll Data:** Update the static/p3.json file with new polling data. Ensure the data adheres to the PollData type structure defined in `src/lib/utils/taiwanPollingAlgorithm.ts`.
- 🎨 **Modifying UI/UX:** Changes to the visual appearance (Neo-Brutalist theme variables) can be made in src/app.css or directly within the Svelte components.

✨ **Adding New Features:** New components, utilities, or API integrations can be added following the existing project structure.

## 📄 License

This project is open-source and available under the MIT License.
