from __future__ import annotations

import logging
from typing import Optional

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self) -> None:
        self.dimension = 384
        self.model_name = "all-MiniLM-L6-v2"

    async def embed_text(self, text: str) -> list[float]:
        try:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer(self.model_name)
            return model.encode(text).tolist()
        except ImportError:
            logger.warning("sentence-transformers not available, returning mock embedding")
            return [0.0] * self.dimension

    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        try:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer(self.model_name)
            return model.encode(texts, show_progress_bar=False).tolist()
        except ImportError:
            logger.warning("sentence-transformers not available, returning mock embeddings")
            return [[0.0] * self.dimension for _ in texts]

    def cosine_similarity(self, a: list[float], b: list[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x * x for x in a) ** 0.5
        norm_b = sum(y * y for y in b) ** 0.5
        if not norm_a or not norm_b:
            return 0.0
        return dot / (norm_a * norm_b)


embedding_service = EmbeddingService()
