# social-trend reviewer notes

## Architecture

The repository contains a Vite React 19 frontend at the root, written in TypeScript and built with `tsc -b && vite build` (`package.json`, `vite.config.ts`). It also includes separate Node/Express package areas: `demo-app/` is a structured scaffold with controllers, services, middleware, and tests, while `server/` and `resend-test/` have independent package manifests. These backend directories are not declared as workspaces or wired into the root scripts.

## Conventions

- Root frontend tooling uses Vite with the React plugin; keep configuration in `vite.config.ts` and preserve the separate TypeScript project references in `tsconfig.json`.
- The root frontend is ESM and TypeScript (`package.json`); backend packages that use ESM explicitly set `"type": "module"` (`demo-app/package.json`, `server/package.json`).
- The `demo-app` backend follows layered structure: routes delegate to controllers, controllers delegate to services, and cross-cutting behavior belongs in middleware (`demo-app/README.md`, `src/controllers/itemController.js`, `src/app.js`).
- Express app construction is separated from process startup: `createApp()` is exported from `demo-app/src/app.js`, while listening occurs in `demo-app/src/index.js`.
- Middleware ordering is intentional: JSON parsing, request logging, and rate limiting precede `/api` routes; `notFound` and then `errorHandler` are registered last (`demo-app/src/app.js`).
- Controllers use object exports with concise method names (`itemController.list`, `.get`, `.create`, `.update`, `.remove`) and return JSON responses directly (`demo-app/src/controllers/itemController.js`).
- Configuration is centralized through `dotenv/config` and environment fallbacks (`demo-app/src/config/index.js`); startup logging uses the shared logger (`demo-app/src/index.js`).
- HTTP failures use JSON `{ error: ... }` responses, with 404 handling in both resource controllers and the terminal not-found middleware (`demo-app/src/controllers/itemController.js`, `src/middleware/notFound.js`).

## Intentional non-standard choices

- This is not a single integrated application layout: `demo-app`, `server`, and `resend-test` have independent dependencies and scripts. Do not assume a root command builds, starts, or tests those packages (`package.json`, `server/package.json`, `resend-test/package.json`).
- Backend examples are JavaScript while the root UI is TypeScript; avoid requiring frontend TypeScript conventions inside `demo-app` (`demo-app/src/**/*.js`).
- The repository retains a largely stock React/Vite README and does not enable the React Compiler (`README.md`); absence of compiler configuration is not itself a defect.

## Watch out for

- Changes to Express middleware order can bypass request logging, rate limiting, 404 handling, or the error handler (`demo-app/src/app.js`).
- New routes should be mounted through `src/routes/index.js` under `/api`, rather than bypassing the app’s route boundary.
- Controllers should preserve status semantics: `201` for creation and `204` with no body for successful deletion (`demo-app/src/controllers/itemController.js`).
- Avoid exposing raw internal errors in production responses; the current scaffold returns `err.message` from `errorHandler.js`, so changes should consider whether that behavior is appropriate for the target environment.
- Do not add dependencies or scripts to the root assuming they apply to `server/` or `resend-test/`; each package has its own manifest.