from __future__ import annotations

import logging
import uuid
from io import BytesIO
from pathlib import Path
from typing import Any, Optional

import httpx
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

from core.config import settings

logger = logging.getLogger(__name__)


class ImageGenerator:
    def generate(
        self,
        prompt: str,
        style: str = "realistic",
        size: str = "512x512",
        negative_prompt: Optional[str] = None,
    ) -> dict[str, Any]:
        logger.info("Searching image: style=%s, prompt=%s", style, prompt[:60])

        search_query = f"{prompt} {style}" if style != "realistic" else prompt

        try:
            from ddgs import DDGS

            with DDGS() as ddgs:
                results = ddgs.images(query=search_query)
        except Exception as e:
            logger.warning("Image search failed: %s", e)
            results = []

        img = None
        if results:
            for r in results:
                image_url = r.get("image")
                if not image_url:
                    continue
                try:
                    resp = httpx.get(image_url, follow_redirects=True, timeout=15)
                    if resp.status_code == 200:
                        img = Image.open(BytesIO(resp.content)).convert("RGB")
                        logger.info("Downloaded image from: %s", image_url)
                        break
                except Exception as e:
                    logger.warning("Failed to download %s: %s", image_url, e)
                    continue

        if img is None:
            img = Image.new("RGB", (512, 512), (200, 200, 200))
            draw = ImageDraw.Draw(img)
            draw.text((50, 240), "No image found", fill=(100, 100, 100))

        url = self._save_image(img)
        return {
            "url": url,
            "prompt": prompt,
            "style": style,
            "width": img.width,
            "height": img.height,
        }

    def edit(
        self,
        image_data: bytes,
        prompt: str,
        mask_data: Optional[bytes] = None,
    ) -> dict[str, Any]:
        logger.info("Editing image (fallback): prompt=%s", prompt[:60])
        img = Image.open(BytesIO(image_data)).convert("RGB")
        url = self._save_image(img)
        return {"url": url, "prompt": prompt}

    def remove_background(self, image_data: bytes) -> dict[str, Any]:
        logger.info("Removing background")
        img = Image.open(BytesIO(image_data)).convert("RGBA")
        rgb = img.convert("RGB")
        gray = rgb.convert("L")

        edges = gray.filter(ImageFilter.FIND_EDGES)
        edges = edges.filter(ImageFilter.MaxFilter(5))
        edges = edges.filter(ImageFilter.GaussianBlur(2))

        mask = edges.point(lambda p: 255 if p > 30 else 0)
        mask = mask.filter(ImageFilter.MaxFilter(7))

        rgba = Image.merge("RGBA", (*rgb.split(), mask))
        url = self._save_image(rgba)
        return {"url": url, "format": "png"}

    def style_transfer(self, content_image: bytes, style_image: bytes) -> dict[str, Any]:
        logger.info("Applying style transfer (fallback)")
        content = Image.open(BytesIO(content_image)).convert("RGB")
        content = content.resize((512, 512))

        style = Image.open(BytesIO(style_image)).convert("RGB")
        style_small = style.resize((1, 1))
        avg_color = style_small.getpixel((0, 0))

        r_factor = avg_color[0] / 128
        g_factor = avg_color[1] / 128
        b_factor = avg_color[2] / 128

        r, g, b = content.split()
        r = r.point(lambda p: min(255, int(p * r_factor)))
        g = g.point(lambda p: min(255, int(p * g_factor)))
        b = b.point(lambda p: min(255, int(p * b_factor)))
        tinted = Image.merge("RGB", (r, g, b))

        enhancer = ImageEnhance.Contrast(tinted)
        tinted = enhancer.enhance(1.2)

        url = self._save_image(tinted)
        return {"url": url, "style": "transferred"}

    def _save_image(self, image: Image.Image) -> str:
        upload_dir = Path(settings.UPLOAD_DIR) / "images"
        upload_dir.mkdir(parents=True, exist_ok=True)
        filename = f"{uuid.uuid4().hex}.png"
        filepath = upload_dir / filename
        image.save(filepath, "PNG")
        return f"{settings.HOST_URL}/uploads/images/{filename}"


image_generator = ImageGenerator()
