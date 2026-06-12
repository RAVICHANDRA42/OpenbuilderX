from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4

logger = logging.getLogger(__name__)


class DocumentService:
    def __init__(self) -> None:
        self.documents: dict[str, dict[str, Any]] = {}

    async def upload(
        self,
        filename: str,
        content_type: Optional[str],
        size: int,
        user_id: str,
        description: str = "",
    ) -> dict[str, Any]:
        doc_id = str(uuid4())
        doc = {
            "id": doc_id,
            "filename": filename,
            "content_type": content_type,
            "size": size,
            "description": description,
            "user_id": user_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self.documents[doc_id] = doc
        logger.info("Document uploaded: %s by %s", filename, user_id)
        return doc

    def get_document(self, doc_id: str) -> Optional[dict[str, Any]]:
        return self.documents.get(doc_id)

    def list_documents(self, user_id: str) -> list[dict[str, Any]]:
        return [doc for doc in self.documents.values() if doc["user_id"] == user_id]

    def delete_document(self, doc_id: str) -> bool:
        return bool(self.documents.pop(doc_id, None))

    async def analyze(self, doc_id: str) -> dict[str, Any]:
        doc = self.documents.get(doc_id)
        if not doc:
            raise ValueError("Document not found")
        return {
            "document_id": doc_id,
            "summary": f"Analysis of '{doc['filename']}'",
            "key_points": ["Extracted key point 1", "Extracted key point 2"],
            "sentiment": "neutral",
        }

    async def ask(self, doc_id: str, question: str) -> dict[str, Any]:
        doc = self.documents.get(doc_id)
        if not doc:
            raise ValueError("Document not found")
        return {
            "document_id": doc_id,
            "question": question,
            "answer": f"Based on '{doc['filename']}': {question}",
            "confidence": 0.92,
        }


document_service = DocumentService()
