# Orbit Tracker (SatViz) 🛰️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node >= 18](https://img.shields.io/badge/node-%3E%3D18-green)](package.json)

A modern React + Vite + TypeScript frontend for visualizing Earth and live satellite orbits in 3D. Uses React Three Fiber/Three.js for rendering, TanStack Query for data fetching, and TailwindCSS + shadcn/ui for the UI.


## ✨ Features

- Interactive 3D Earth with stars and lighting
- Satellite markers with per-category colors and subtle glow
- Mission Control sidebar: search, categories, list, and detail view
- Smooth camera controls and performant instancing for many satellites
- Clean state management with Zustand
- E2E and unit testing setup (Playwright + Vitest)


## 🧰 Tech Stack

- React 18, Vite, TypeScript
- Three.js, React Three Fiber, @react-three/drei
- TanStack Query (React Query)
- TailwindCSS, shadcn/ui
- Zustand
- React Router
- Vitest, Playwright, Testing Library


## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- pnpm (recommended) or npm/yarn

### Install
```bash
pnpm install
# or
npm install
```

### Environment
Create a `.env.local` (values are examples):
```bash
cp .env.example .env.local  # if present
```
```env
VITE_API_BASE=http://localhost:8000/api
VITE_WS_BASE=ws://localhost:8000/ws
```

Optional textures for higher visual fidelity: see TEXTURE_SOURCES.md and place files under `public/textures/`.

### Run
```bash
pnpm dev
# or
npm run dev
```
App runs at http://localhost:5173

### Build & Preview
```bash
pnpm build
pnpm preview
# or
npm run build && npm run preview
```


## 📜 Scripts
- `dev` – start Vite dev server
- `build` – type check + production build
- `preview` – preview production build
- `lint` – ESLint
- `format` – Prettier write
- `test` – unit/component tests (Vitest)
- `test:e2e` – Playwright end-to-end tests


## 📁 Project Structure
<small>(high-level)</small>

<pre>
src/
  features/
  shared/
  app/
  styles/
</pre>

- 3D scene: `src/features/globe/components/`
- Satellites UI: `src/features/satellites/`
- Mission Control layout: `src/app/layout/`
- Global styles and Tailwind theme: `src/styles/globals.css`


## 🔧 Configuration
- Tailwind config: `tailwind.config.js`
- shadcn/ui config: `components.json`
- Query Client: `src/shared/api/queryClient.ts`
- Stores: `src/shared/store/*`, `src/store/*`


## 🧪 Testing
```bash
pnpm test        # unit/component tests
pnpm test:e2e    # Playwright e2e
```
Playwright config: `playwright.config.ts`


## 📚 Docs & Notes
- Earth rendering details: `EARTH_IMPLEMENTATION.md`
- Texture guidance: `TEXTURE_SOURCES.md`
- React Query setup: `REACT_QUERY_SETUP.md`
- Migration notes: `MIGRATION_NOTES.md`


## 🤝 Contributing
Contributions are welcome! Please open an issue or PR. Follow conventional commit messages if possible and add tests for changes.


## 📄 License
MIT © Contributors. See [LICENSE](LICENSE).
