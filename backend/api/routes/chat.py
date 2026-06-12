from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from openai import AsyncOpenAI
from pydantic import BaseModel

from api.middleware.auth import require_auth
from core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])

fake_conversations: dict[str, dict[str, Any]] = {}
fake_messages: dict[str, list[dict[str, Any]]] = {}

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)


async def generate_reply(conv_id: str) -> str:
    messages = fake_messages.get(conv_id, [])
    openai_messages = [{"role": "system", "content": "You are OpenBuilder AI, a helpful assistant that can help with coding, content creation, document analysis, image generation, and building AI workflows. Be concise and helpful."}]
    for msg in messages:
        openai_messages.append({"role": msg["role"], "content": msg["content"]})

    try:
        response = await client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=openai_messages,
            max_tokens=1024,
            temperature=0.7,
        )
        return response.choices[0].message.content or "I'm not sure how to respond to that."
    except Exception as e:
        logger.error("OpenAI API call failed: %s", e)
        return f"I'm having trouble connecting to the AI. Please try again later. (Error: {str(e)[:100]})"


class CreateConversationRequest(BaseModel):
    title: str = "New Conversation"


class SendMessageRequest(BaseModel):
    content: str


@router.get("/conversations")
async def list_conversations(user_id: str = Depends(require_auth)) -> list[dict[str, Any]]:
    user_convs = [
        conv for conv in fake_conversations.values() if conv["user_id"] == user_id
    ]
    return sorted(user_convs, key=lambda c: c["updated_at"], reverse=True)


@router.post("/conversations")
async def create_conversation(
    body: CreateConversationRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    conv_id = str(uuid4())
    now = datetime.now(timezone.utc).isoformat()
    fake_conversations[conv_id] = {
        "id": conv_id,
        "title": body.title,
        "user_id": user_id,
        "created_at": now,
        "updated_at": now,
    }
    fake_messages[conv_id] = []
    logger.info("Conversation created: %s by %s", conv_id, user_id)
    return fake_conversations[conv_id]


@router.get("/conversations/{conv_id}")
async def get_conversation(
    conv_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    conv = fake_conversations.get(conv_id)
    if not conv or conv["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return conv


@router.delete("/conversations/{conv_id}")
async def delete_conversation(
    conv_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, str]:
    conv = fake_conversations.get(conv_id)
    if not conv or conv["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    del fake_conversations[conv_id]
    fake_messages.pop(conv_id, None)
    return {"message": "Conversation deleted"}


@router.post("/conversations/{conv_id}/messages")
async def send_message(
    conv_id: str,
    body: SendMessageRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    if conv_id not in fake_conversations or fake_conversations[conv_id]["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    user_msg = {
        "id": str(uuid4()),
        "conversation_id": conv_id,
        "role": "user",
        "content": body.content,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    fake_messages.setdefault(conv_id, []).append(user_msg)
    fake_conversations[conv_id]["updated_at"] = user_msg["created_at"]

    reply_content = await generate_reply(conv_id)
    reply = {
        "id": str(uuid4()),
        "conversation_id": conv_id,
        "role": "assistant",
        "content": reply_content,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    fake_messages[conv_id].append(reply)
    return {"reply": reply["content"]}


@router.get("/conversations/{conv_id}/messages")
async def get_messages(
    conv_id: str,
    user_id: str = Depends(require_auth),
) -> list[dict[str, Any]]:
    if conv_id not in fake_conversations or fake_conversations[conv_id]["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return fake_messages.get(conv_id, [])
