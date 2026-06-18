from __future__ import annotations

import logging

from databases import Database

from core.config import settings

logger = logging.getLogger(__name__)

database = Database(settings.DATABASE_URL)


async def init_db() -> None:
    await database.connect()
    await database.execute("""
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("Database tables initialized")


async def close_db() -> None:
    await database.disconnect()
