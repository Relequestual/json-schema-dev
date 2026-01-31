AGENTS.md

Purpose

- Guidance for automated/code-writing agents working in this repository.
- Includes: build/lint/test commands (single-test runs), code style, testing/DB notes, and AI/Copilot rules.

1. Quick Commands (pnpm is primary)

- Install dependencies:
  pnpm install

- Development
  pnpm run dev # wrangler dev (Cloudflare worker + dev server)
  pnpm run dev:nuxt # nuxt dev (browser)
  pnpm run preview # nuxt preview after build

- Build & Deploy
  pnpm run build
  pnpm run deploy:prod # ENVIRONMENT=production nuxt build && wrangler deploy
  pnpm run deploy:preview

- Database
  pnpm run db:migrate
  pnpm run db:migrate:prod
  pnpm run db:setup

- Lint / Format / Typecheck
  pnpm run lint
  pnpm run lint:fix
  pnpm run format
  pnpm run format:check
  pnpm run typecheck
  pnpm run check
  pnpm run check:fix

- Tests (Vitest + Cloudflare workers helpers)
  pnpm run test # vitest run (headless)
  pnpm run test:watch
  pnpm run test:ui
  pnpm run test:coverage

- Run a single test file (recommended)
  pnpm run test -- tests/d1.test.ts
  pnpm run test -- tests/share-api.test.ts

- Run a single test by name
  pnpm run test -- -t "should create a new shared URL successfully"

Notes

- Use pnpm only. The project is configured for pnpm in package.json and the project docs.
- Tests use Cloudflare helpers: `cloudflare:test`, `@cloudflare/vitest-pool-workers`.

2. Repository facts agents should know

- Stack: Nuxt 4 + Vue 3 + Pinia + XState, targeting Cloudflare Workers (nitro preset `cloudflare-module`).
- TypeScript-first: prefer strong types and run `pnpm run typecheck` when changing types or shared interfaces.
- Vue style: Composition API via `<script setup>`; avoid Options API.
- Legacy: `previous/` contains the old Vue 2 app for reference. Do not modify it unless explicitly requested.
- Tests live in `tests/` and rely on D1 and worker test helpers. DB migrations and test setup files are present.

3. Testing & DB guidance

- D1 (Cloudflare database) tests require migrations. `tests/apply-migrations.ts` is present to help setup.
- Use `env` from `cloudflare:test` for D1 access and `SELF.fetch` for worker endpoint integration tests.
- Keep DB tests deterministic and small; use ephemeral D1 instances provided by the test helpers.
- For manual testing of DB features, run `pnpm run db:migrate` to apply local migrations before running tests.

4. Code style & conventions (practical rules for agents)
   Formatting

- Use Prettier (project includes Prettier). Run `pnpm run format` before committing; CI runs `pnpm run format:check`.
- Do not introduce formatting rules that conflict with Prettier defaults without updating repo config and getting approval.

Linting

- Run `pnpm run lint` regularly. Use `pnpm run lint:fix` to apply automatic fixes when safe.
- ESLint uses a flat config (Nuxt). Follow reported rules; ask if a rule needs to be changed.

TypeScript / Types

- Prefer explicit types on exported functions, API DTOs, and return values (e.g., `ShareRequest`, `ShareResponse`).
- Use `unknown` for external/unvalidated input; narrow it immediately via validators or type guards.
- Avoid `any`. If `any` is necessary, add a short inline comment explaining why and a TODO to tighten types.
- Keep `tsconfig.json` strict where feasible. Run `pnpm run typecheck` after type changes.

Imports

- Import order: external packages → internal shared modules → local files → styles/assets.
- Prefer named imports for clarity. Use relative imports for nearby files; use aliases only if configured and consistent.

Naming

- Variables & functions: camelCase.
- Types & interfaces: PascalCase (e.g., `ShareRequest`). Do not add `I` prefixes unless the codebase already uses them.
- Files: kebab-case for utilities/composables (e.g., `payload-chunking.ts`), PascalCase for Vue components (e.g., `EditorPanel.vue`).
- Composables: prefix with `use` (e.g., `useValidation`).

Vue / Nuxt specifics

- Use `<script setup>` and the Composition API exclusively for new components.
- Keep components focused and small; composables should be single-purpose and testable.
- Prefer declarative over imperative patterns where possible.

Error handling

- Validate inputs at API boundaries and return clear HTTP 4xx for client errors.
- Error responses expected by tests include a JSON with `statusMessage` for user-facing messages.
- Sanitize internal errors; do not return stack traces or internal metadata to clients.
- Use typed error wrappers or small factories for API responses (e.g., `createApiError(status, message)`).

Async / concurrency

- Use async/await across the codebase.
- Catch errors at boundary layers (API routes or top-level composable callers) and translate to meaningful messages.
- Use Promise.all for independent concurrent work; avoid parallelism when DB transactions or ordering matter.

Security & data handling

- Never log secrets, API keys, or large payloads to public logs.
- Content hashing/deduplication must be deterministic. Use deterministic JSON serialization when hashing.
- When persisting user-provided content, prefer explicit normalization and size checks to avoid DB issues.

5. Tests: patterns & best practices

- One test file per feature area (examples: `share-api.test.ts`, `api-endpoints.test.ts`, `d1.test.ts`).
- Use small, deterministic fixtures. Avoid randomness in identifiers in tests unless seeded and stable.
- For endpoint tests use `SELF.fetch(url, options)` to emulate worker requests.
- For DB tests prefer ephemeral DB instances via test helpers; apply migrations during test setup.
- Keep tests fast and avoid network dependencies outside the test pool.

6. AI / Copilot rules (from .github/copilot-instructions.md)

- ALWAYS check `PLANNING.md` and `current-tasks.md` before starting significant work—these are the source of truth.
- Preserve planning and status documents; do not remove or rewrite planning material without explicit confirmation.
- When uncertain, say "I'm not sure" and provide official docs or references rather than guessing.
- Use pnpm and the node version stated by project docs (Volta / .nvmrc guidance in repo).
- TypeScript-first and Composition API-first: prefer typed solutions and Composition API patterns.
- Maintain backward compatibility for public shared URLs when migrating or implementing features.

7. Cursor & Copilot rules presence

- Cursor rules: no `.cursor/` directory or `.cursorrules` file found in the repository root.
- Copilot rules found: `.github/copilot-instructions.md` exists and its key bullets are included in this document. Agents must follow those guidelines.

8. Commit / PR etiquette for agents

- Do NOT create commits unless explicitly instructed by a human.
- If asked to commit: make one focused commit with a concise message that explains the "why".
- Do NOT amend unrelated commits or force-push to protected branches.
- Run linters and tests locally before creating a PR. Include verification steps in PR description.

9. Suggested verification steps after edits

- Local quick check:
  pnpm run format
  pnpm run lint
  pnpm run test -- tests/share-api.test.ts
- For DB changes:
  pnpm run db:migrate
  pnpm run test -- tests/d1.test.ts

10. Escalation & contact rules

- If a change affects `PLANNING.md`, `current-tasks.md`, or public URL semantics, stop and ask for review.
- If build or test commands behave differently than documented, consult official docs (Nuxt/Wrangler/Vitest) and report the discrepancy.

Appendix: Where to look

- package.json (root) — scripts and primary commands
- tests/README.md — D1 test guidance and single-test examples
- .github/copilot-instructions.md — project-specific AI agent rules and workflow preferences

End of file
