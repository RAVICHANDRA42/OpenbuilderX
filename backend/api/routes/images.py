from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form
from pydantic import BaseModel

from api.middleware.auth import get_optional_user
from api.services.image_service import image_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/images", tags=["images"])


class GenerateImageRequest(BaseModel):
    prompt: str
    style: str = "realistic"
    size: str = "1024x1024"


@router.post("/generate")
async def generate_image(
    body: GenerateImageRequest,
    user_id: Optional[str] = Depends(get_optional_user),
) -> dict[str, Any]:
    logger.info("Image generation requested: %s", body.prompt[:50])
    actual_id = user_id or "anonymous"
    result = await image_service.generate(
        prompt=body.prompt,
        style=body.style,
        size=body.size,
        user_id=actual_id,
    )
    result["created_at"] = datetime.now(timezone.utc).isoformat()
    return result


@router.post("/edit")
async def edit_image(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    user_id: Optional[str] = Depends(get_optional_user),
) -> dict[str, Any]:
    logger.info("Image edit requested")
    data = await image.read()
    return await image_service.edit(data, prompt, user_id or "anonymous")


@router.post("/remove-bg")
async def remove_background(
    image: UploadFile = File(...),
    user_id: Optional[str] = Depends(get_optional_user),
) -> dict[str, Any]:
    logger.info("Background removal requested")
    data = await image.read()
    return await image_service.remove_background(data, user_id or "anonymous")


@router.post("/style-transfer")
async def style_transfer(
    content_image: UploadFile = File(...),
    style_image: UploadFile = File(...),
    user_id: Optional[str] = Depends(get_optional_user),
) -> dict[str, Any]:
    logger.info("Style transfer requested")
    content_data = await content_image.read()
    style_data = await style_image.read()
    return await image_service.style_transfer(content_data, style_data, user_id or "anonymous")


@router.get("/history")
async def get_history(
    user_id: Optional[str] = Depends(get_optional_user),
) -> list[dict[str, Any]]:
    return image_service.get_history(user_id or "anonymous")
