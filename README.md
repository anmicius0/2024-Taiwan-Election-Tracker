# 🇹🇼 2024 Taiwan Election Tracker 🗳️

This project provides comprehensive polling data and insights into the 2024 Taiwan Presidential Election. It aggregates real-time polling data from various research institutions in Taiwan and visualizes it through interactive charts and tables. Additionally, it offers expert analysis and explainers on key election issues and candidates.

> **Note:** 🛑 This project is archived and no longer receives live updates. Data and content are for historical reference only.

## ✨ Features

- 📈 **Interactive Polling Chart:** Visualize polling trends over time for the major political parties (DPP, KMT, TPP) and undecided voters. Users can select which polling sources to include in the visualization.
- 📊 **Detailed Poll Table:** View a comprehensive table of all collected polling data, including institution, date, sample size, and percentages for each party and undecided voters.
- 🧑‍💼 **Election Analysis & Explainers:** Access expert insights into major election issues, candidate platforms, global significance, and approaches to cross-Strait relations through an expandable FAQ section.
- 💻 **Modern UI:** A clean and modern user interface designed with Tailwind CSS, featuring custom typography, cards, checkboxes, and buttons for a smooth user experience.

## � Polling algorithm (simplified)

This project now uses a simplified, non-partisan polling aggregation algorithm in `src/lib/utils/taiwanPollingAlgorithm.ts`.

- Weights used: sample size (log scale) and recency only.
- No institution- or method-level partisan bias corrections are applied. This avoids unreliable adjustments for recently formed parties such as the TPP which lack historical bias data.

If you need the older bias-corrected version, it is available in earlier commits; reach out if you want it restored behind a feature flag.

## �🛠️ Technologies Used

- ⚡ **SvelteKit:** A powerful framework for building web applications with Svelte, providing server-side rendering, routing, and an optimized development experience.
- 🔥 **Svelte:** A reactive JavaScript framework that compiles your code into small, vanilla JavaScript bundles.
- 🎨 **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- 📊 **ECharts:** A powerful, interactive charting and visualization library for the browser.
- 🟦 **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- 🧹 **ESLint & Prettier:** For code linting and formatting, ensuring code quality and consistency.

## 🗂️ Project Structure

- `src/routes`: Contains SvelteKit routes. `+page.svelte` is the main application page, and `+layout.svelte` defines the global layout.
- `src/lib/components`: Reusable Svelte components like `Chart.svelte`, `PollTable.svelte`, and `Explainers.svelte`.
- `src/lib/composables`: Contains composable functions, such as `useChart.ts` for ECharts integration.
- `src/lib/utils`: Utility functions and type definitions, like `defaultSources.ts`, `getFilter.ts`, and `getData.ts`.
- `static/p3.json`: The JSON file containing the raw polling data.
- `tailwind.config.cjs`: Tailwind CSS configuration, including custom colors, fonts, and shadows.
- `svelte.config.js`: SvelteKit configuration.
- `vite.config.ts`: Vite configuration for the project, including Tailwind CSS and SvelteKit plugins.
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

   This project uses `npm` as its package manager and `engine-strict=true` is set in `.npmrc` to enforce Node.js version compatibility. Ensure you have a compatible Node.js version installed (check `package-lock.json` for specific ranges if encountering issues).

   ```bash
   npm install
   ```

3. 🏃 **Start the development server:**

   ```bash
   npm run dev
   # or to open in a new browser tab automatically:
   npm run dev -- --open
   ```

   The application will be accessible at `http://localhost:5173` (or a different port if 5173 is in use).

## 🏗️ Building

To create a production version of your app:

```bash
npm run build
```

This will generate a `build` directory with the optimized production assets.

## 👀 Previewing the Production Build

You can preview the production build locally:

```bash
npm run preview
```

## 🧹 Linting and Formatting

To ensure code quality and consistency:

- ✨ **Format code:**

  ```bash
  npm run format
  ```

- 🔍 **Lint code:**

  ```bash
  npm run lint
  ```

## 🤝 Extending and Contributing

- 🗳️ **Adding New Poll Data:** Update the `static/p3.json` file with new polling data. Ensure the data adheres to the `PollData` type structure defined in `src/lib/utils/getData.ts`.
- 🎨 **Modifying UI/UX:** Changes to the visual appearance can be made in `src/app.css` and `tailwind.config.cjs`, or directly within the Svelte components.
- ✨ **Adding New Features:** New components, utilities, or API integrations can be added following the existing project structure.

## 📄 License

This project is open-source and available under the MIT License.
