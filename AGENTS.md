# AGENTS.md

## Project

`gamehubdashboard` is a single-page **Game Hub Dashboard** built with Vite + React 18 + TypeScript. There is one service (the Vite app); there is no backend or database.

Standard commands are documented in `README.md` (`npm run dev`, `npm run build`, `npm run lint`, `npm test`).

## Cursor Cloud specific instructions

- Single service only: the Vite dev server. Start it with `npm run dev`; it listens on `http://localhost:5173` (configured with `server.host: true` in `vite.config.ts`, so it also binds externally).
- Dependencies are installed by the startup update script (`npm install`). No env vars, secrets, or external services are required.
- Lint uses ESLint flat config (`eslint.config.js`, ESLint 9). Tests use Vitest with jsdom (`vite.config.ts` `test` block, setup in `src/test/setup.ts`). `npm run build` runs `tsc -b` first, so type errors fail the build.
- Pure dashboard logic lives in `src/stats.ts` (unit-tested in `src/stats.test.ts`); UI behavior is tested in `src/App.test.tsx`. State is in-memory only (no persistence), so a page refresh resets the library to `src/data.ts` seed data.
