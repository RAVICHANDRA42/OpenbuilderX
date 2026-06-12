from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from api.middleware.auth import require_auth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/marketplace", tags=["marketplace"])

fake_items: dict[str, dict[str, Any]] = {}


class PublishItemRequest(BaseModel):
    name: str
    description: str
    price: float = 0.0
    category: str = "general"
    content: dict[str, Any] = {}


@router.get("/items")
async def list_marketplace_items(
    category: str | None = None,
    search: str | None = None,
) -> list[dict[str, Any]]:
    items = list(fake_items.values())
    if category:
        items = [i for i in items if i.get("category") == category]
    if search:
        items = [i for i in items if search.lower() in i.get("name", "").lower()]
    return items


@router.get("/items/{item_id}")
async def get_marketplace_item(item_id: str) -> dict[str, Any]:
    item = fake_items.get(item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.post("/items")
async def publish_item(
    body: PublishItemRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    item_id = str(uuid4())
    fake_items[item_id] = {
        "id": item_id,
        "name": body.name,
        "description": body.description,
        "price": body.price,
        "category": body.category,
        "content": body.content,
        "author_id": user_id,
        "downloads": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    logger.info("Marketplace item published: %s by %s", body.name, user_id)
    return fake_items[item_id]


@router.post("/items/{item_id}/purchase")
async def purchase_item(
    item_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    item = fake_items.get(item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    item["downloads"] += 1
    return {
        "item_id": item_id,
        "download_url": f"https://marketplace.example.com/download/{item_id}",
        "purchased_at": datetime.now(timezone.utc).isoformat(),
    }
