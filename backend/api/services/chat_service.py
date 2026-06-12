from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self) -> None:
        self.conversations: dict[str, dict[str, Any]] = {}
        self.messages: dict[str, list[dict[str, Any]]] = {}

    def create_conversation(self, user_id: str, title: str = "New Conversation") -> dict[str, Any]:
        conv_id = str(uuid4())
        now = datetime.now(timezone.utc).isoformat()
        conv = {
            "id": conv_id,
            "title": title,
            "user_id": user_id,
            "created_at": now,
            "updated_at": now,
        }
        self.conversations[conv_id] = conv
        self.messages[conv_id] = []
        logger.info("Conversation created: %s", conv_id)
        return conv

    def get_conversation(self, conv_id: str) -> Optional[dict[str, Any]]:
        return self.conversations.get(conv_id)

    def list_conversations(self, user_id: str) -> list[dict[str, Any]]:
        convs = [c for c in self.conversations.values() if c["user_id"] == user_id]
        return sorted(convs, key=lambda c: c["updated_at"], reverse=True)

    def delete_conversation(self, conv_id: str) -> bool:
        if conv_id in self.conversations:
            del self.conversations[conv_id]
            self.messages.pop(conv_id, None)
            return True
        return False

    def add_message(self, conv_id: str, role: str, content: str) -> Optional[dict[str, Any]]:
        if conv_id not in self.conversations:
            return None
        msg = {
            "id": str(uuid4()),
            "conversation_id": conv_id,
            "role": role,
            "content": content,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self.messages.setdefault(conv_id, []).append(msg)
        self.conversations[conv_id]["updated_at"] = msg["created_at"]
        return msg

    def get_messages(self, conv_id: str) -> list[dict[str, Any]]:
        return self.messages.get(conv_id, [])


chat_service = ChatService()
