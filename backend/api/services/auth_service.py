from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from core.config import settings

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self) -> None:
        self.pwd_context = pwd_context

    def hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def create_access_token(
        self, subject: str, expires_delta: Optional[timedelta] = None
    ) -> str:
        expire = datetime.now(timezone.utc) + (
            expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        payload = {"sub": subject, "exp": expire, "type": "access"}
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    def create_refresh_token(self, subject: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
        payload = {"sub": subject, "exp": expire, "type": "refresh"}
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    def decode_token(self, token: str) -> dict:
        try:
            return jwt.decode(
                token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
            )
        except JWTError as exc:
            logger.warning("Token decode failed: %s", exc)
            raise

    def verify_token_type(self, token: str, expected_type: str) -> dict:
        payload = self.decode_token(token)
        if payload.get("type") != expected_type:
            raise ValueError(f"Invalid token type: expected {expected_type}")
        return payload


auth_service = AuthService()
