from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pydantic import BaseModel

from api.middleware.auth import require_auth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/documents", tags=["documents"])

fake_documents: dict[str, dict[str, Any]] = {}


class AskDocumentRequest(BaseModel):
    question: str


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    description: str = Form(""),
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    doc_id = str(uuid4())
    doc = {
        "id": doc_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "size": 0,
        "description": description,
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    fake_documents[doc_id] = doc
    logger.info("Document uploaded: %s by %s", file.filename, user_id)
    return doc


@router.get("")
async def list_documents(user_id: str = Depends(require_auth)) -> list[dict[str, Any]]:
    return [doc for doc in fake_documents.values() if doc["user_id"] == user_id]


@router.get("/{doc_id}")
async def get_document(
    doc_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    doc = fake_documents.get(doc_id)
    if not doc or doc["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc


@router.delete("/{doc_id}")
async def delete_document(
    doc_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, str]:
    doc = fake_documents.get(doc_id)
    if not doc or doc["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    del fake_documents[doc_id]
    return {"message": "Document deleted"}


@router.post("/{doc_id}/analyze")
async def analyze_document(
    doc_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    doc = fake_documents.get(doc_id)
    if not doc or doc["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return {
        "document_id": doc_id,
        "summary": "Placeholder document analysis.",
        "key_points": ["Point 1", "Point 2"],
        "sentiment": "neutral",
    }


@router.post("/{doc_id}/ask")
async def ask_document(
    doc_id: str,
    body: AskDocumentRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    doc = fake_documents.get(doc_id)
    if not doc or doc["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return {
        "document_id": doc_id,
        "question": body.question,
        "answer": f"Placeholder answer based on document '{doc['filename']}'.",
        "confidence": 0.95,
    }
