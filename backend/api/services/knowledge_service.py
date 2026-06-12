from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4

logger = logging.getLogger(__name__)


class KnowledgeService:
    def __init__(self) -> None:
        self.bases: dict[str, dict[str, Any]] = {}
        self.documents: dict[str, list[dict[str, Any]]] = {}

    def create_base(self, name: str, description: str, user_id: str) -> dict[str, Any]:
        kb_id = str(uuid4())
        now = datetime.now(timezone.utc).isoformat()
        kb = {
            "id": kb_id,
            "name": name,
            "description": description,
            "user_id": user_id,
            "document_count": 0,
            "created_at": now,
            "updated_at": now,
        }
        self.bases[kb_id] = kb
        self.documents[kb_id] = []
        logger.info("Knowledge base created: %s", kb_id)
        return kb

    def list_bases(self, user_id: str) -> list[dict[str, Any]]:
        return [kb for kb in self.bases.values() if kb["user_id"] == user_id]

    def get_base(self, kb_id: str) -> Optional[dict[str, Any]]:
        return self.bases.get(kb_id)

    def delete_base(self, kb_id: str) -> bool:
        if kb_id in self.bases:
            del self.bases[kb_id]
            self.documents.pop(kb_id, None)
            return True
        return False

    def add_document(self, kb_id: str, content: str, metadata: dict[str, Any] = None) -> Optional[dict[str, Any]]:
        kb = self.bases.get(kb_id)
        if not kb:
            return None
        doc = {
            "document_id": str(uuid4()),
            "knowledge_base_id": kb_id,
            "content": content,
            "metadata": metadata or {},
            "chunks": max(1, len(content) // 500),
        }
        self.documents.setdefault(kb_id, []).append(doc)
        kb["document_count"] += 1
        return doc

    def query(self, kb_id: str, query: str, top_k: int = 5) -> list[dict[str, Any]]:
        kb = self.bases.get(kb_id)
        if not kb:
            raise ValueError("Knowledge base not found")
        docs = self.documents.get(kb_id, [])
        return [
            {
                "content": doc["content"][:200],
                "score": 1.0 - (i * 0.1),
                "metadata": doc.get("metadata", {}),
            }
            for i, doc in enumerate(docs[:top_k])
        ]


knowledge_service = KnowledgeService()
