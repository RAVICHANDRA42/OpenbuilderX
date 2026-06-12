from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, UploadFile, File, Form
from pydantic import BaseModel

from api.middleware.auth import require_auth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/images", tags=["images"])

fake_history: list[dict[str, Any]] = []


class GenerateImageRequest(BaseModel):
    prompt: str
    style: str = "realistic"
    size: str = "1024x1024"


@router.post("/generate")
async def generate_image(
    body: GenerateImageRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Image generation requested by %s: %s", user_id, body.prompt[:50])
    result = {
        "id": len(fake_history) + 1,
        "prompt": body.prompt,
        "style": body.style,
        "size": body.size,
        "url": f"https://placehold.co/1024x1024?text={body.prompt[:20]}",
        "created_at": "2025-01-01T00:00:00Z",
    }
    fake_history.append(result)
    return result


@router.post("/edit")
async def edit_image(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Image edit requested by %s", user_id)
    return {
        "url": "https://placehold.co/1024x1024?text=edited",
        "prompt": prompt,
    }


@router.post("/remove-bg")
async def remove_background(
    image: UploadFile = File(...),
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Background removal requested by %s", user_id)
    return {
        "url": "https://placehold.co/1024x1024?text=nobg",
        "format": "png",
    }


@router.post("/style-transfer")
async def style_transfer(
    content_image: UploadFile = File(...),
    style_image: UploadFile = File(...),
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Style transfer requested by %s", user_id)
    return {
        "url": "https://placehold.co/1024x1024?text=stylized",
        "style": "transferred",
    }


@router.get("/history")
async def get_history(
    user_id: str = Depends(require_auth),
) -> list[dict[str, Any]]:
    return fake_history
