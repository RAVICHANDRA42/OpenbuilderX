from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.middleware.auth import require_auth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["users"])

fake_profiles: dict[str, dict[str, Any]] = {}


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


class UpdateSettingsRequest(BaseModel):
    settings: dict[str, Any]


@router.get("/profile")
async def get_profile(user_id: str = Depends(require_auth)) -> dict[str, Any]:
    profile = fake_profiles.get(user_id, {
        "user_id": user_id,
        "name": "User",
        "email": user_id,
        "avatar_url": None,
        "bio": "",
    })
    return profile


@router.put("/profile")
async def update_profile(
    body: UpdateProfileRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    profile = fake_profiles.setdefault(user_id, {
        "user_id": user_id,
        "name": "User",
        "email": user_id,
        "avatar_url": None,
        "bio": "",
    })
    if body.name is not None:
        profile["name"] = body.name
    if body.bio is not None:
        profile["bio"] = body.bio
    if body.avatar_url is not None:
        profile["avatar_url"] = body.avatar_url
    return profile


@router.get("/usage")
async def get_usage_stats(user_id: str = Depends(require_auth)) -> dict[str, Any]:
    return {
        "user_id": user_id,
        "api_calls_today": 42,
        "tokens_used_today": 15000,
        "images_generated_today": 5,
        "storage_used_mb": 12.3,
        "plan": "free",
    }


@router.put("/settings")
async def update_settings(
    body: UpdateSettingsRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Settings updated for user: %s", user_id)
    return {
        "user_id": user_id,
        "settings": body.settings,
        "message": "Settings updated",
    }
