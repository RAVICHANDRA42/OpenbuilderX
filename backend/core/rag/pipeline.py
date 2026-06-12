from __future__ import annotations

import logging
from typing import Any, List, Optional

from core.config import settings

logger = logging.getLogger(__name__)


class RAGPipeline:
    def __init__(self) -> None:
        self.chunk_size = 1000
        self.chunk_overlap = 200

    def chunk_document(self, text: str) -> list[str]:
        chunks: list[str] = []
        start = 0
        while start < len(text):
            end = min(start + self.chunk_size, len(text))
            if end < len(text):
                last_period = text.rfind(".", start, end)
                if last_period > start:
                    end = last_period + 1
            chunks.append(text[start:end].strip())
            start = end - self.chunk_overlap
        logger.info("Document split into %d chunks", len(chunks))
        return chunks

    async def generate_embeddings(self, texts: list[str]) -> list[list[float]]:
        try:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer("all-MiniLM-L6-v2")
            embeddings = model.encode(texts, show_progress_bar=False)
            return embeddings.tolist()
        except ImportError:
            logger.warning("sentence-transformers not available, using mock embeddings")
            return [[0.0] * 384 for _ in texts]

    async def retrieve(
        self,
        query: str,
        documents: list[dict[str, Any]],
        top_k: int = 5,
    ) -> list[dict[str, Any]]:
        query_embedding = (await self.generate_embeddings([query]))[0]
        scored: list[tuple[float, dict[str, Any]]] = []
        for doc in documents:
            doc_embedding = doc.get("embedding")
            if doc_embedding:
                score = self._cosine_similarity(query_embedding, doc_embedding)
                scored.append((score, doc))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [
            {"content": doc["content"], "score": score, "metadata": doc.get("metadata", {})}
            for score, doc in scored[:top_k]
        ]

    def _cosine_similarity(self, a: list[float], b: list[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x * x for x in a) ** 0.5
        norm_b = sum(y * y for y in b) ** 0.5
        if not norm_a or not norm_b:
            return 0.0
        return dot / (norm_a * norm_b)


rag_pipeline = RAGPipeline()
