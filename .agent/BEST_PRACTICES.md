# CareerDesk — Engineering Best Practices
*(Give this file to your AI coding assistant as a standing instruction set before it writes any code.)*

## General Principles
- Every new endpoint, component, or agent must be added incrementally and testable in isolation — no giant one-shot commits.
- Never hardcode API keys, model names, or URLs — always read from environment variables via config, never `os.getenv()` scattered through business logic.
- Fail loudly in logs, fail gracefully to the user. A broken job-API call should show "couldn't load jobs right now" in that one panel — never crash the whole dashboard.
- Every external API call (LLM, job boards, LanguageTool) must have: a timeout, a try/except, and a fallback/error response shape — never let an unhandled exception bubble to a 500.

## Backend (FastAPI / Python)

### Structure
- Follow the `backend/app/{api,services,agents,models,core}` structure — routes stay thin (parse request → call service/agent → return response). Business logic lives in `services/` or `agents/`, never in route handlers.
- All request/response bodies defined as Pydantic models in `models/schemas.py` — no raw dicts in/out of endpoints.
- Config loaded once via `pydantic-settings` in `config.py`, imported wherever needed — never re-read env vars ad hoc.

### CrewAI-specific
- Every agent task must specify **strict output format** (JSON schema in the task description) and the calling code must validate/parse it with Pydantic — treat LLM output as untrusted input.
- Keep agents single-responsibility. Don't build one mega-agent that does parsing + scoring + gap analysis + writing — that's harder to debug and burns more tokens per call.
- Cache LLM results by content hash (see caching strategy in implementation plan) before calling the LLM — check cache first, always.
- Log every agent call's token usage during development so you can see which agent is expensive before you scale up.

### Data & Files
- Never trust uploaded file extensions alone — validate actual file content/mimetype before parsing.
- Enforce `MAX_RESUME_FILE_SIZE_MB` from env — reject oversized uploads before they hit the parser.
- Don't persist uploaded resumes to disk longer than needed for Phase 1 (no auth = no safe long-term storage yet) — process in-memory or delete after analysis.

### API Design
- Use plural nouns and versioning-ready paths: `/api/resume/analyze`, not `/analyzeResume`.
- Return consistent error shape across all endpoints: `{ "error": { "code": "...", "message": "..." } }`.
- Use proper HTTP status codes (400 for bad input, 422 for validation, 502/503 for upstream API failure) — not 200 with an error field buried inside.

### Testing
- Every service function (`resume_parser`, `ats_checks`, job clients) gets at least one unit test with a real sample file/fixture — not just happy-path mocks.
- Mock external APIs (LLM, job boards) in tests — tests should never make real network calls or cost real tokens.

## Frontend (React / Vite)

### Structure
- Functional components + hooks only, no class components.
- One component = one responsibility. `DashboardGrid` composes panels; it doesn't contain panel logic itself.
- Data-fetching logic lives in custom hooks (`useResumeAnalysis`, `useJobSearch`), not inline in components — keeps components focused on rendering.

### State & Data Fetching
- Each dashboard panel manages its own loading/error/data state independently — one slow or failed panel must never block the others from rendering.
- Use a single `api/client.js` (axios instance with base URL from `VITE_API_BASE_URL`) — no hardcoded URLs in components.
- Never call `.env` values directly in components — read them once in the client/config layer.

### Styling & UX
- Every async panel needs three visual states: loading, error (with a retry button), and success — never leave a panel blank on failure.
- Don't block the entire page on one panel's data — render the dashboard shell immediately, stream in panel data as it arrives.

### Code Quality
- ESLint + Prettier configured from day one — don't let formatting drift accumulate.
- PropTypes or JSDoc typing on shared components at minimum (TypeScript is a nice upgrade later, not required for Phase 1 given your timeline).

## Security & Secrets (both sides)
- `.env` files are gitignored — only `.env.sample` files are committed, with placeholder values.
- No API key, even a free-tier one, ever appears in frontend code — job-board and LLM calls happen server-side only, frontend never talks to Adzuna/OpenRouter/Groq directly.
- CORS on the backend restricted to the known frontend origin (`CORS_ALLOWED_ORIGINS`), not wildcard `*`, even in development.

## Git & Workflow
- Commit messages describe the "why," not just "what" (e.g. "Add ATS score caching to avoid re-running agent on identical resume" not "update code").
- Feature branches per milestone (see implementation plan milestones) — don't work directly on `main`.
- Add a `README.md` setup section as you go, not at the end — future-you will not remember the setup steps otherwise.
