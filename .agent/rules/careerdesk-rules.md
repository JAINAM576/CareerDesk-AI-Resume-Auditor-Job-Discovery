---
description: CareerDesk project context, tech stack, and architecture rules. Always apply.
alwaysApply: true
---

# CareerDesk — Project Rules

## What this project is
CareerDesk is a job-search dashboard: user uploads a resume + target role + location + job mode preference, and gets back an ATS/format score, a skill-gap analysis, and live job listings — using only free-tier APIs and open-source tooling.

## Tech stack (do not deviate without asking)
- **Backend:** FastAPI (Python) — single backend service. No Node.js, no second backend service.
- **AI orchestration:** CrewAI, called directly inside FastAPI (no separate agent microservice).
- **LLM providers:** OpenRouter and/or Groq free-tier models only. Never assume a paid model/key is available.
- **Frontend:** React + Vite.
- **Database:** SQLite via SQLAlchemy (Phase 1 — used for caching, not user accounts).
- **No auth in Phase 1.** Do not add login/signup flows unless explicitly asked.

## Repository structure (follow exactly)
```
backend/app/{api,services,agents,models,core}
frontend/src/{components,hooks,api}
```
Routes in `api/` stay thin — parse request, call a service or agent, return response. Business logic belongs in `services/` or `agents/`, never inline in route handlers.

## Non-negotiable rules

1. **Never hardcode secrets, model names, or URLs.** Always read from environment variables via the config module. Never scatter `os.getenv()` calls through business logic.
2. **Every external call needs a timeout, try/except, and a defined error response shape.** A failed job-API or LLM call must degrade gracefully — one broken panel must never crash the whole dashboard.
3. **CrewAI agent output must be strict JSON**, validated with Pydantic on the receiving end. Treat LLM output as untrusted input — never pass it straight to the frontend unparsed.
4. **Keep agents single-responsibility.** Don't merge parsing + scoring + gap-analysis into one agent — split by task, and use plain Python (not the LLM) for anything rule-based (e.g. checking if a "Skills" section exists).
5. **Cache before calling paid-adjacent resources.** Check the SQLite cache before hitting Adzuna or an LLM for a repeat query (same resume hash, same role+location).
6. **Frontend never calls external APIs directly.** All calls to Adzuna/OpenRouter/Groq/LanguageTool happen server-side only.
7. **CORS is restricted to the known frontend origin**, never wildcard, even in local dev.
8. **Every async dashboard panel has three states:** loading, error-with-retry, success. Never leave a panel blank on failure.
9. **`.env` is gitignored. Only `.env.sample` files with placeholder values are committed.**
10. **No file uploads persist to disk longer than needed for analysis** — no auth yet means no safe long-term storage of resumes.

## Style
- Python: PEP 8, docstrings on every function, no magic numbers (use named constants).
- React: functional components + hooks only. Data-fetching logic lives in custom hooks, not inline in components.
- Every new feature or endpoint should be small enough to test in isolation — no large one-shot changes across many files at once.
