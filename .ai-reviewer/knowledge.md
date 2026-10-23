# social-trend reviewer notes

## Architecture
The root project is a React 19 + TypeScript frontend built with Vite; `vite.config.ts` enables the React plugin, and the root `package.json` provides `dev`, `build`, `lint`, and `preview` scripts. The repository also contains separate Node/Express projects: `demo-app/` is a layered scaffold with routes, controllers, services, middleware, and tests, while `server/` and `resend-test/` are standalone dependency packages. These subprojects are not represented as a workspace and should be reviewed as independently runnable applications.

## Conventions
- Root frontend code follows Vite/TypeScript conventions; TypeScript compilation is part of `npm run build` through `tsc -b`, and linting uses Oxlint (`package.json`, `tsconfig.json`).
- Root configuration uses ESM imports and extensionless TypeScript imports, as shown in `vite.config.ts`.
- `demo-app` uses ESM JavaScript (`"type": "module"` in `demo-app/package.json`) and explicit `.js` import extensions, e.g. `demo-app/src/app.js`.
- `demo-app` separates responsibilities by directory: `app.js` composes middleware and routes, controllers handle HTTP responses, and services contain business logic (`demo-app/README.md`, `src/app.js`, `src/controllers/itemController.js`).
- Express middleware is ordered deliberately in `demo-app/src/app.js`: JSON parsing, request logging, rate limiting, `/api` routes, then `notFound`, then `errorHandler`. New error-handling middleware should remain after routes.
- Controllers use object namespaces with concise method names (`itemController.list`, `.get`, `.create`, `.update`, `.remove`) and return JSON errors with `{ error: ... }` (`demo-app/src/controllers/itemController.js`).
- Environment loading is centralized through `dotenv/config` in `demo-app/src/config/index.js`; application startup reads the resulting `config` rather than loading environment variables in `src/index.js`.
- The demo app uses semicolons, while the root Vite config follows the template’s semicolon-free style. Preserve the local style rather than normalizing the whole repository.

## Intentional non-standard choices
- This is not a single uniform application: `demo-app`, `server`, and `resend-test` each have their own `package.json` and dependency set. Do not assume root scripts or dependencies apply to those directories.
- `demo-app` is explicitly described as a scaffold (`demo-app/README.md`), so simple in-memory/service-style patterns and minimal configuration may be intentional rather than production completeness.
- The root README is largely the stock React + Vite template; it does not document the Express subprojects.

## Watch out for
- Do not add CommonJS syntax or omit `.js` extensions in `demo-app` imports; its package is ESM.
- Preserve Express middleware ordering. Moving `notFound` or `errorHandler` before `/api` routes will intercept valid requests (`demo-app/src/app.js`).
- Flag handlers that bypass the service layer or return inconsistent error/status formats; existing CRUD handlers consistently delegate to `itemService` and use 404 for missing items (`demo-app/src/controllers/itemController.js`).
- Review error responses for information leakage: `demo-app/src/middleware/errorHandler.js` sends `err.message` directly to clients, including for 500 errors.
- Changes to the frontend should not silently assume backend APIs live in the root app; backend code is split across separate projects with no visible shared configuration.