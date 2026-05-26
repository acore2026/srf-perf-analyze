# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React application. Runtime source lives in `src/`: `src/main.tsx` mounts the app, `src/SRFCalculator.tsx` contains the main UI logic, and `src/styles.css` holds global Tailwind/CSS styles. Static HTML entry configuration is in `index.html`. Build and deployment configuration files are at the repository root, including `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `Dockerfile`, and `nginx.conf`.

Generated files are not committed. Keep `node_modules/` and `dist/` local only.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server on all interfaces.
- `npm run typecheck`: run TypeScript checks without emitting files.
- `npm run build`: run TypeScript checks and create a production build in `dist/`.
- `npm run preview`: serve the production build locally for verification.
- `docker build -t srf-perf-analyze .`: build the nginx-backed production image.

There is currently no `npm test` script. Add one before relying on automated test checks.

## Coding Style & Naming Conventions

Use modern ES modules and React functional components in TypeScript. Match the existing TSX style: two-space indentation, double quotes in JSX attributes, and concise component-local helpers where practical. Name React components in `PascalCase`, for example `SRFCalculator`, and name ordinary functions and variables in `camelCase`.

Prefer keeping reusable UI logic in `src/` rather than adding root-level scripts. Tailwind utility classes are acceptable for layout and styling; keep global CSS in `src/styles.css`.

## Testing Guidelines

No test framework is configured yet. For future tests, prefer Vitest with React Testing Library because it fits Vite projects cleanly. Place tests near the component they cover, using names such as `src/SRFCalculator.test.tsx`. Cover calculation behavior and key user interactions before changing SRF-related logic.

Until tests exist, run `npm run build` before submitting changes.

## Commit & Pull Request Guidelines

The current history only contains `first commit`, so there is no established project-specific convention. Use short, imperative commit messages such as `Add SRF input validation` or `Update Docker nginx config`.

Pull requests should include a brief summary, the reason for the change, verification steps run, and screenshots for UI changes. Link related issues when available. Keep PRs focused; avoid mixing formatting-only changes with behavior changes.

## Security & Configuration Tips

Do not commit secrets or environment files. `.env` and `.env.*` are ignored. If environment configuration is added later, document required variables in `README.md` without including real credentials.
