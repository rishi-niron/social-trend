# social-trend reviewer notes

## Architecture
The repository contains a Vite React/TypeScript frontend at the root, plus separate Node/Express package directories (`demo-app/`, `server/`, and `resend-test/`). The root app uses Vite with `@vitejs/plugin-react`; `demo-app` is a layered Express scaffold with routes, controllers, services, middleware, and utilities. Each package has its own `package.json`; there is no workspace configuration shown.

## Conventions
- Root frontend commands are defined in `/package.json`: `dev` runs Vite, `build` runs `tsc -b && vite build`, and `lint` runs `oxlint`.
- Vite configuration stays minimal and uses `defineConfig` with the React plugin in `/vite.config.ts`.
- TypeScript project references are split between `tsconfig.app.json` and `tsconfig.node.json`, referenced by `/tsconfig.json`.
- Node packages use ES modules (`"type": "module"`). Local imports include the `.js` extension, as in `demo-app/src/app.js` importing `./routes/index.js`.
- The Express scaffold separates responsibilities by directory, documented in `demo-app/README.md`: routes dispatch to controllers, controllers call services, and middleware handles cross-cutting concerns.
- `demo-app/src/app.js` exports `createApp()` rather than starting the server. Server startup belongs in `demo-app/src/index.js`, which loads configuration and calls `app.listen`.
- Middleware ordering is load-bearing: JSON parsing, request logging, rate limiting, `/api` routes, not-found handling, then the error handler (`demo-app/src/app.js`).
- Controllers expose grouped object methods and return JSON responses directly. Missing resources use `404`; creation uses `201`; successful deletion uses `204` with `.end()` (`demo-app/src/controllers/itemController.js`).
- Environment loading and defaults are centralized in `demo-app/src/config/index.js`; startup logging uses the utility logger (`demo-app/src/index.js`).
- Backend package scripts use Node’s native watch mode for development and native test runner support where configured (`demo-app/package.json`).

## Intentional non-standard choices
- The repository intentionally contains multiple standalone Node packages rather than one unified backend: `demo-app`, `server`, and `resend-test` each have independent manifests and dependency sets.
- `demo-app` is explicitly a scaffold/demo application (`demo-app/README.md`), so its in-memory/simple service structure and minimal configuration should not be treated as production completeness.
- The root README is the stock React + Vite template and may not describe the full multi-package repository.

## Watch out for
- Do not assume a root dependency or script applies to subpackages. Changes under `demo-app/`, `server/`, or `resend-test/` should use that directory’s manifest and module conventions.
- Preserve Express middleware order, especially keeping the error handler after routes and `notFound` (`demo-app/src/app.js`).
- Avoid putting business logic in controllers; they should delegate to services as shown in `demo-app/src/controllers/itemController.js`.
- Preserve `.js` extensions in ESM relative imports.
- Check HTTP semantics when changing handlers: resource misses return `404`, creates return `201`, and deletes return an empty `204` response.