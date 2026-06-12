from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from api.middleware.auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    hash_password,
    verify_password,
)
from database import database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str
    token: str


@router.post("/register")
async def register(body: RegisterRequest) -> dict[str, Any]:
    existing = await database.fetch_one(
        "SELECT email FROM users WHERE email = :email",
        {"email": body.email},
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    hashed = hash_password(body.password)
    await database.execute(
        "INSERT INTO users (email, name, password) VALUES (:email, :name, :password)",
        {"email": body.email, "name": body.name, "password": hashed},
    )
    logger.info("User registered: %s", body.email)
    return {"message": "User registered successfully", "email": body.email}


@router.post("/login")
async def login(body: LoginRequest) -> dict[str, Any]:
    user = await database.fetch_one(
        "SELECT * FROM users WHERE email = :email",
        {"email": body.email},
    )
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    access_token = create_access_token(body.email)
    refresh_token = create_refresh_token(body.email)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/logout")
async def logout(user_id: str = Depends(get_current_user)) -> dict[str, str]:
    logger.info("User logged out: %s", user_id)
    return {"message": "Logged out successfully"}


@router.post("/refresh")
async def refresh_token(body: RefreshTokenRequest) -> dict[str, Any]:
    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    new_access = create_access_token(payload["sub"])
    return {"access_token": new_access, "token_type": "bearer"}


@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user)) -> dict[str, Any]:
    user = await database.fetch_one(
        "SELECT email, name FROM users WHERE email = :email",
        {"email": user_id},
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return {"email": user["email"], "name": user["name"]}


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest) -> dict[str, str]:
    user = await database.fetch_one(
        "SELECT email FROM users WHERE email = :email",
        {"email": body.email},
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found",
        )
    logger.info("Password reset requested for: %s", body.email)
    return {"message": "Password reset email sent"}


@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest) -> dict[str, str]:
    user = await database.fetch_one(
        "SELECT email FROM users WHERE email = :email",
        {"email": body.email},
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    await database.execute(
        "UPDATE users SET password = :password WHERE email = :email",
        {"email": body.email, "password": hash_password(body.new_password)},
    )
    logger.info("Password reset for: %s", body.email)
    return {"message": "Password reset successfully"}
