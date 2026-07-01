# GalingPH

A React + Vite web app built with TypeScript support, page-based routing, and shared theme/user contexts.

## Features

- React 19 + Vite development and build setup
- Hash-based routing with `react-router-dom`
- TypeScript build support using `tsc -b`
- ESLint linting configured for the app
- Pages in `src/pages/` for the main routes
- Shared state via `src/ThemeContext.jsx` and `src/UserContext.jsx`

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the site shown in the terminal, usually:

```text
http://localhost:5173
```

## Available scripts

- `npm run dev` - start the Vite development server
- `npm run build` - run TypeScript build and Vite production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint across the project

## Project structure

- `src/main.tsx` - app entry point
- `src/App.jsx` - main app component and route definitions
- `src/pages/` - route page components such as `Landing`, `Auth`, `Dashboard`, `Admin`, and more
- `src/ThemeContext.jsx` - theme provider context
- `src/UserContext.jsx` - user state provider context
- `public/` - static assets served by Vite
- `api/` - serverless / API route helpers

## Current routes

- `/` → `Landing`
- `/auth` → `Auth`
- `/onboarding` → `Onboarding`
- `/app` → `Dashboard`
- `/dashboard` → `Dashboard`
- `/admin` → `Admin`
- `/scanner` → `AiScanner`
- `/mobile` → `MobileApp`
- `/team` → `Team`

## Notes

- The app uses both `.jsx` and `.tsx` files, so keep the TypeScript config compatible with React and Vite.
- Route changes should be made in `src/App.jsx` when adding or updating pages.
- `npm run build` runs `tsc -b` before `vite build` to ensure the TypeScript project compiles.
