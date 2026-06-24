from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from redis.asyncio import Redis

from api.routes import auth, builder, chat, code, documents, images, knowledge, marketplace, users
from core.config import settings
from database import database, init_db, close_db, db as mongo_db

logger = logging.getLogger(__name__)

redis_client: Redis | None = None


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, conversation_id: str) -> None:
        await websocket.accept()
        if conversation_id not in self.active_connections:
            self.active_connections[conversation_id] = []
        self.active_connections[conversation_id].append(websocket)

    def disconnect(self, websocket: WebSocket, conversation_id: str) -> None:
        self.active_connections[conversation_id].remove(websocket)
        if not self.active_connections[conversation_id]:
            del self.active_connections[conversation_id]

    async def send_message(self, message: str, conversation_id: str) -> None:
        for connection in self.active_connections.get(conversation_id, []):
            await connection.send_text(message)


manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    global redis_client
    logger.info("Starting OpenBuilder API...")
    try:
        await init_db()
        logger.info("Database connected.")
    except Exception as e:
        logger.warning("Database not available (running in degraded mode): %s", e)
    try:
        redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis_client.ping()
        logger.info("Redis connected.")
    except Exception as e:
        logger.warning("Redis not available (running in degraded mode): %s", e)
        redis_client = None
    yield
    logger.info("Shutting down OpenBuilder API...")
    try:
        await close_db()
    except Exception:
        pass
    if redis_client:
        await redis_client.close()
    logger.info("Shutdown complete.")


app = FastAPI(
    title="OpenBuilder API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(code.router, prefix="/api")
app.include_router(images.router, prefix="/api")
app.include_router(documents.router, prefix="/api")
app.include_router(builder.router, prefix="/api")
app.include_router(knowledge.router, prefix="/api")
app.include_router(marketplace.router, prefix="/api")
app.include_router(users.router, prefix="/api")

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/health")
async def health_check() -> dict[str, str]:
    db_ok = False
    redis_ok = False
    try:
        await database.fetch_one("SELECT 1")
        db_ok = True
    except Exception:
        pass
    try:
        if redis_client:
            await redis_client.ping()
            redis_ok = True
    except Exception:
        pass
    return {
        "status": "healthy" if (db_ok and redis_ok) else "degraded",
        "database": "connected" if db_ok else "disconnected",
        "redis": "connected" if redis_ok else "disconnected",
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected.")



