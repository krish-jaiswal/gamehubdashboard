# gamehubdashboard

A modern **Game Hub Dashboard** for tracking your game library, playtime, ratings, and status. Built with React, TypeScript, and Vite.

## Tech stack

- [Vite](https://vite.dev/) — dev server & build tool
- [React 18](https://react.dev/) + TypeScript
- [Vitest](https://vitest.dev/) + Testing Library — unit/component tests
- [ESLint](https://eslint.org/) (flat config) — linting

## Prerequisites

- Node.js 18+ (developed against Node 22)
- npm (bundled with Node)

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:5173
```

## Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start the Vite dev server (HMR)              |
| `npm run build`    | Type-check and build for production (`dist`) |
| `npm run preview`  | Preview the production build locally         |
| `npm run lint`     | Run ESLint                                   |
| `npm test`         | Run the test suite once (Vitest)             |
| `npm run test:watch` | Run tests in watch mode                    |

## Features

- Library overview stats: total games, hours played, average rating, now playing
- Add games with title, genre, platform, hours, rating, and status
- Remove games from the library
- Responsive, dark-themed UI
