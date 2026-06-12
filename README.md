# OpenBuilder

**Build Anything with AI**

OpenBuilder is an open-source AI-powered application builder that combines LLMs, code generation, image generation, and document intelligence into a unified platform.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                 │
├─────────────────────────────────────────────────────┤
│   AI Chat  │  Code Gen  │  Image Gen  │  Builder    │
├─────────────────────────────────────────────────────┤
│              API Gateway (FastAPI + Node.js)         │
├─────────────────────────────────────────────────────┤
│    AI/LLM Services    │    RAG Pipeline              │
│    (OpenAI, Claude)   │    (Vector Search)           │
├─────────────────────────────────────────────────────┤
│  PostgreSQL  │  Redis  │  MongoDB  │  S3/Minio       │
└─────────────────────────────────────────────────────┘
```

- **Frontend**: Next.js (React, TypeScript, Tailwind CSS)
- **Backend**: FastAPI (Python) + Node.js microservices
- **AI**: LLM integration (OpenAI, Anthropic), RAG pipeline, image generation
- **Database**: PostgreSQL (primary), Redis (caching), MongoDB (documents)

## Quick Start

```bash
docker-compose up
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

## Features

- **AI Chat** – Conversational interface powered by LLMs
- **Code Generation** – Generate code in multiple languages from natural language prompts
- **Image Generation** – Create images using Stable Diffusion / DALL-E
- **Document Intelligence** – Analyse, summarise, and query documents (PDF, DOCX, etc.)
- **AI Builder Studio** – Visual drag-and-drop builder for AI workflows
- **Knowledge Base** – Upload documents and query them via RAG
- **AI Marketplace** – Discover and share AI agents, templates, and tools

## Project Structure

```
openbuilder/
├── frontend/            # Next.js application
│   ├── app/            # App router pages
│   ├── components/     # Shared UI components
│   └── lib/            # Utility functions and API client
├── backend/
│   ├── api/            # FastAPI application
│   ├── services/       # Business logic / microservices
│   └── workers/        # Background task workers (Celery)
├── ai/
│   ├── llm/            # LLM integration layer
│   ├── rag/            # Retrieval-Augmented Generation pipeline
│   └── agents/         # AI agent definitions
├── docker-compose.yml
├── .env.example
└── README.md
```

## Tech Stack

| Category       | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js, React, TypeScript, Tailwind CSS        |
| Backend        | FastAPI, Node.js, Express, Python               |
| AI/ML          | OpenAI API, Anthropic API, LangChain, ChromaDB  |
| Image Gen      | Stable Diffusion, DALL-E, ComfyUI               |
| Database       | PostgreSQL, Redis, MongoDB                      |
| Infrastructure | Docker, Docker Compose, S3/Minio                |
| Auth           | JWT, OAuth2                                     |

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
