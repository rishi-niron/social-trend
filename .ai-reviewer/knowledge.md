# social-trend reviewer notes

## Architecture
This codebase is a simple application built with React, TypeScript, and Vite, designed to send emails via an Express backend. The frontend consists of a minimal React application, while the backend is encapsulated in the `server` directory, where email-sending functionality is implemented.

## Conventions
- **Project Structure**: The main application is in the root directory with the server code housed in `server/`. The frontend code is under `src/`, and configurations are managed at the root (e.g., `vite.config.ts`, `tsconfig.json`).
- **TypeScript Configuration**: TypeScript uses project references with two distinct configuration files (`tsconfig.app.json` and `tsconfig.node.json`) indicated in the `tsconfig.json`. Ensure both settings are aligned for seamless integration.
- **Naming Conventions**: File names are lowercase and separated by dashes (e.g., `App.tsx`, `index.js`), adhering to a clear and consistent naming convention.
- **API Endpoints**: The API endpoints are clear and RESTful; for instance, the email sending functionality is exposed via a POST `/api/send-email` route in `server/index.js`.
- **Linting Rules**: The bot should recognize Oxlint configurations detailed in `README.md`, particularly the emphasis on TypeScript type-aware lint rules.

## Intentional non-standard choices
- **Not Using the React Compiler**: The codebase explicitly chooses not to enable the React Compiler to enhance performance, as marked in `README.md`. This choice is to be respected during the review, as it deviates from typical React setups that might utilize newer features aggressively.
- **Mailtrap as the Default Sender**: The application defaults to `test@example.com` for outgoing emails if the MAIL_FROM variable isn’t provided. This is a purposeful fallback to avoid runtime failures.

## Watch out for
- **CORS Configurations**: Ensure the CORS middleware is appropriately configured. The current implementation uses `app.use(cors())`, which might allow all origins. The reviewer should check whether this should be narrowed down for production use.
- **Error Handling**: While the error handling in email sending is reasonable, confirm whether additional logging or monitoring is needed in production, especially in the payload validation phase.
- **Environment Variables**: Verify that all required environment variables are documented and correctly configured, as missing these can lead to failures in the email service (check `dotenv` usage).
- **Type Safety**: While TypeScript is in use, ensure that all asynchronous operations (like the `fetch` calls) are adequately type-checked, especially for response validation in `App.tsx`. 

This reviewer playbook should guide the AI bot in understanding the specific conventions, architecture, and intentional design decisions of the `social-trend` repository while flagging potential issues during code reviews.