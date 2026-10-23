# social-trend reviewer notes

## Architecture

The repository contains a root React 19 + TypeScript Vite application, configured in `vite.config.ts` and built through the root `package.json`. It also includes separate Node/Express experiments: `demo-app/` is a structured scaffold with routes, controllers, services, middleware, and tests, while `server/` and `resend-test/` are standalone package directories. These packages have independent manifests and should not be assumed to share the root application’s build or runtime.

## Conventions

- Root frontend code uses ES modules, TypeScript, Vite, and React; the root build runs `tsc -b && vite build` (`package.json`).
- Vite configuration uses `defineConfig` and plugin registration in `vite.config.ts`; avoid adding ad hoc bundler setup elsewhere.
- `demo-app` follows layered Express organization: route definitions delegate to controllers, controllers delegate business logic to services (`demo-app/README.md`, `src/controllers/itemController.js`).
- Express application construction is centralized in `demo-app/src/app.js` via exported `createApp`; startup/listening belongs in `src/index.js`.
- Middleware is registered in pipeline order in `demo-app/src/app.js`: JSON parsing, request logging, rate limiting, `/api` routes, then `notFound` and `errorHandler`.
- Configuration is loaded through `dotenv/config` and exposed from `demo-app/src/config/index.js`; consumers should use the `config` object rather than reading environment variables directly.
- Controllers use object namespaces with concise method names (`list`, `get`, `create`, `update`, `remove`) and return JSON responses directly (`demo-app/src/controllers/itemController.js`).
- Missing resources consistently return `404` with `{ error: 'Item not found' }`; successful creation returns `201`, and deletion returns `204` with `.end()` (`demo-app/src/controllers/itemController.js`).
- Root TypeScript configuration is split into referenced app and Node projects (`tsconfig.json`); preserve that project-reference structure when adding TypeScript files.

## Intentional non-standard choices

- This is not a single unified Node workspace: `demo-app`, `server`, and `resend-test` each have their own `package.json` and dependency lifecycle. Changes should target the relevant package rather than assuming root scripts manage all subprojects.
- The Express scaffold uses plain JavaScript despite the root application being TypeScript (`demo-app/src/**/*.js`).
- The root README is largely the stock React/Vite template; it does not describe the additional server packages.

## Watch out for

- Do not place API middleware after `notFound`/`errorHandler`; their ordering in `demo-app/src/app.js` is functional.
- New Express errors must reach the four-argument error middleware in `demo-app/src/middleware/errorHandler.js`; avoid swallowing failures or sending multiple responses.
- Avoid exposing sensitive internal error details through the current `{ error: err.message }` response unless that behavior is explicitly intended (`demo-app/src/middleware/errorHandler.js`).
- Keep API paths under `/api` when extending the scaffold; the route mount is centralized in `demo-app/src/app.js`.
- Do not assume `npm test` at the repository root covers server code: the root has no test script, while `demo-app` defines its own test command and `resend-test` currently has a placeholder failing test script.