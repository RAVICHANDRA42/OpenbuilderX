# AGENTS.md — AI Agent Guide for OpenBuilder

This document helps AI coding agents understand the OpenBuilder project so they can contribute effectively.

## Project Overview

OpenBuilder is a monorepo containing:

- **`frontend/`** — Next.js 14+ app with App Router, TypeScript, Tailwind CSS
- **`backend/`** — FastAPI (Python) primary API + Node.js microservices
- **`ai/`** — LLM, RAG, and agent logic in Python
- **Infrastructure** — Docker Compose for local dev, PostgreSQL/Redis/MongoDB

## Code Conventions

### General
- Use **TypeScript** for all frontend code, **Python** for backend/ai code
- Follow existing patterns in the codebase; do not introduce new libraries without checking `package.json` or `requirements.txt`
- Prefer functional components and hooks in React; avoid class components
- Use async/await throughout; avoid raw callbacks or `.then()` chains

### Frontend (Next.js)
- Place pages in `frontend/app/` following Next.js App Router conventions
- Shared components go in `frontend/components/`
- API client helpers in `frontend/lib/`
- Use Tailwind CSS for styling; avoid separate CSS files unless unavoidable
- Use `use client` directive only when components need client-side interactivity

### Backend (Python / FastAPI)
- Routes go in `backend/api/routes/` with modular routers
- Business logic in `backend/services/`
- Background tasks in `backend/workers/` (Celery)
- Use Pydantic models for request/response validation
- Type hints are required for all function signatures

### AI Layer
- LLM integrations in `ai/llm/providers/` — one file per provider
- RAG pipeline in `ai/rag/` using LangChain + ChromaDB
- Agent definitions in `ai/agents/` — each agent is a self-contained module

## Commands

```bash
# Frontend
cd frontend && npm install    # Install dependencies
cd frontend && npm run dev    # Start dev server (port 3000)
cd frontend && npm run build  # Production build
cd frontend && npm run lint   # Lint & format check

# Backend
cd backend && pip install -r requirements.txt  # Install Python deps
cd backend && uvicorn api.main:app --reload    # Start API (port 8000)

# Full stack
docker-compose up            # Start everything
docker-compose up --build    # Rebuild and start
```

## How to Contribute as an AI Agent

1. **Understand the context** — Read the relevant files first; check imports and neighbouring modules to match style.
2. **Follow conventions** — Match existing patterns for naming, typing, and architecture.
3. **Ask before adding dependencies** — Check `package.json` / `requirements.txt` first; if a library isn't present, ask before installing.
4. **Security** — Never log secrets, hardcode keys, or commit `.env` files. Use environment variables.
5. **Keep it simple** — Prefer small, focused changes. One commit per logical change.
6. **Test** — Run `npm run lint` / `ruff` after changes. Look for existing tests before writing new ones.
