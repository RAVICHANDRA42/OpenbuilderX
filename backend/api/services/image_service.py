from __future__ import annotations

import asyncio
import logging
from typing import Any, Optional
from uuid import uuid4

from core.image.generator import image_generator

logger = logging.getLogger(__name__)


class ImageService:
    def __init__(self) -> None:
        self.history: list[dict[str, Any]] = []

    async def generate(
        self,
        prompt: str,
        style: str = "realistic",
        size: str = "512x512",
        user_id: Optional[str] = None,
    ) -> dict[str, Any]:
        logger.info("Generating image: %s", prompt[:50])
        result = await asyncio.to_thread(
            image_generator.generate,
            prompt=prompt,
            style=style,
            size=size,
        )
        result["id"] = str(uuid4())
        result["user_id"] = user_id
        self.history.append(result)
        return result

    async def edit(
        self,
        image_data: bytes,
        prompt: str,
        user_id: Optional[str] = None,
    ) -> dict[str, Any]:
        logger.info("Editing image: %s", prompt[:50])
        result = await asyncio.to_thread(
            image_generator.edit,
            image_data=image_data,
            prompt=prompt,
        )
        result["user_id"] = user_id
        return result

    async def remove_background(
        self,
        image_data: bytes,
        user_id: Optional[str] = None,
    ) -> dict[str, Any]:
        logger.info("Removing background")
        result = await asyncio.to_thread(
            image_generator.remove_background,
            image_data=image_data,
        )
        result["user_id"] = user_id
        return result

    async def style_transfer(
        self,
        content_image: bytes,
        style_image: bytes,
        user_id: Optional[str] = None,
    ) -> dict[str, Any]:
        logger.info("Applying style transfer")
        result = await asyncio.to_thread(
            image_generator.style_transfer,
            content_image=content_image,
            style_image=style_image,
        )
        result["user_id"] = user_id
        return result

    def get_history(self, user_id: Optional[str] = None) -> list[dict[str, Any]]:
        if user_id:
            return [h for h in self.history if h.get("user_id") == user_id]
        return self.history


image_service = ImageService()
