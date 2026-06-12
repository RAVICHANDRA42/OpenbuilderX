from __future__ import annotations

import logging
from typing import Any, Optional
from uuid import uuid4

from core.config import settings

logger = logging.getLogger(__name__)


class ImageService:
    def __init__(self) -> None:
        self.history: list[dict[str, Any]] = []

    async def generate(
        self,
        prompt: str,
        style: str = "realistic",
        size: str = "1024x1024",
        user_id: Optional[str] = None,
    ) -> dict[str, Any]:
        logger.info("Generating image: %s", prompt[:50])
        result = {
            "id": str(uuid4()),
            "prompt": prompt,
            "style": style,
            "size": size,
            "url": f"https://placehold.co/{size.replace('x', 'x')}?text={prompt[:20]}",
            "user_id": user_id,
        }
        self.history.append(result)
        return result

    async def edit(
        self, image_data: bytes, prompt: str, user_id: Optional[str] = None
    ) -> dict[str, Any]:
        logger.info("Editing image with prompt: %s", prompt[:50])
        return {
            "url": "https://placehold.co/1024x1024?text=edited",
            "prompt": prompt,
        }

    async def remove_background(
        self, image_data: bytes, user_id: Optional[str] = None
    ) -> dict[str, Any]:
        logger.info("Removing background from image")
        return {
            "url": "https://placehold.co/1024x1024?text=nobg",
            "format": "png",
        }

    async def style_transfer(
        self, content_image: bytes, style_image: bytes, user_id: Optional[str] = None
    ) -> dict[str, Any]:
        logger.info("Applying style transfer")
        return {
            "url": "https://placehold.co/1024x1024?text=stylized",
            "style": "transferred",
        }

    def get_history(self, user_id: Optional[str] = None) -> list[dict[str, Any]]:
        if user_id:
            return [h for h in self.history if h.get("user_id") == user_id]
        return self.history


image_service = ImageService()
