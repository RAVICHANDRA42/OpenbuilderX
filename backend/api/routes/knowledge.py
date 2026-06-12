from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from api.middleware.auth import require_auth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

fake_knowledge_bases: dict[str, dict[str, Any]] = {}


class CreateKnowledgeBaseRequest(BaseModel):
    name: str
    description: str = ""


class AddKnowledgeDocumentRequest(BaseModel):
    content: str
    metadata: dict[str, Any] = {}


class QueryKnowledgeBaseRequest(BaseModel):
    query: str
    top_k: int = 5


@router.post("/bases")
async def create_knowledge_base(
    body: CreateKnowledgeBaseRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    kb_id = str(uuid4())
    now = datetime.now(timezone.utc).isoformat()
    fake_knowledge_bases[kb_id] = {
        "id": kb_id,
        "name": body.name,
        "description": body.description,
        "user_id": user_id,
        "document_count": 0,
        "created_at": now,
        "updated_at": now,
    }
    logger.info("Knowledge base created: %s by %s", kb_id, user_id)
    return fake_knowledge_bases[kb_id]


@router.get("/bases")
async def list_knowledge_bases(user_id: str = Depends(require_auth)) -> list[dict[str, Any]]:
    return [kb for kb in fake_knowledge_bases.values() if kb["user_id"] == user_id]


@router.post("/bases/{kb_id}/documents")
async def add_knowledge_document(
    kb_id: str,
    body: AddKnowledgeDocumentRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    kb = fake_knowledge_bases.get(kb_id)
    if not kb or kb["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge base not found")
    kb["document_count"] += 1
    return {
        "document_id": str(uuid4()),
        "knowledge_base_id": kb_id,
        "content_preview": body.content[:100],
        "chunks": 5,
    }


@router.post("/bases/{kb_id}/query")
async def query_knowledge_base(
    kb_id: str,
    body: QueryKnowledgeBaseRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    kb = fake_knowledge_bases.get(kb_id)
    if not kb or kb["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge base not found")
    return {
        "query": body.query,
        "results": [
            {
                "content": f"Placeholder result {i} for: {body.query}",
                "score": 1.0 - (i * 0.1),
                "metadata": {"source": f"doc_{i}"},
            }
            for i in range(body.top_k)
        ],
    }


@router.delete("/bases/{kb_id}")
async def delete_knowledge_base(
    kb_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, str]:
    kb = fake_knowledge_bases.get(kb_id)
    if not kb or kb["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge base not found")
    del fake_knowledge_bases[kb_id]
    return {"message": "Knowledge base deleted"}
