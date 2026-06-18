from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.middleware.auth import require_auth
from api.services.code_service import code_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/code", tags=["code"])


class GenerateRequest(BaseModel):
    prompt: str
    language: str = "python"


class CodeRequest(BaseModel):
    code: str
    language: str = "python"


class ConvertRequest(BaseModel):
    code: str
    source_language: str = "python"
    target_language: str = "javascript"


@router.post("/generate")
async def generate_code(
    body: GenerateRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Code generation requested by %s", user_id)
    try:
        result = await code_service.generate_code(body.prompt, body.language)
        return {
            "code": result["generated_code"],
            "language": body.language,
            "explanation": f"Generated {body.language} code for: {body.prompt}",
        }
    except Exception as e:
        logger.error("Code generation failed: %s", e)
        return {
            "code": f"# Error generating code: {str(e)[:200]}",
            "language": body.language,
            "explanation": "Code generation failed.",
        }


@router.post("/debug")
async def debug_code(
    body: CodeRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Code debug requested by %s", user_id)
    try:
        result = await code_service.debug_code(body.code, body.language)
        return {
            "bugs": [],
            "fixed_code": result["fixed_code"],
            "explanations": ["Code has been reviewed and fixed."],
        }
    except Exception as e:
        logger.error("Code debug failed: %s", e)
        return {
            "bugs": [f"Debug failed: {str(e)[:200]}"],
            "fixed_code": body.code,
            "explanations": ["Debug service unavailable."],
        }


@router.post("/explain")
async def explain_code(
    body: CodeRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Code explanation requested by %s", user_id)
    try:
        result = await code_service.explain_code(body.code, body.language)
        return {
            "explanation": result["explanation"],
            "complexity": "N/A",
            "suggestions": [],
        }
    except Exception as e:
        logger.error("Code explanation failed: %s", e)
        return {
            "explanation": f"Could not explain the code. The AI service is currently unavailable. Details: {str(e)[:200]}",
            "complexity": "N/A",
            "suggestions": [],
        }


@router.post("/convert")
async def convert_code(
    body: ConvertRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    logger.info("Code conversion requested by %s", user_id)
    try:
        result = await code_service.convert_code(body.code, body.source_language, body.target_language)
        return {
            "converted_code": result["converted_code"],
            "source_language": body.source_language,
            "target_language": body.target_language,
        }
    except Exception as e:
        logger.error("Code conversion failed: %s", e)
        return {
            "converted_code": f"// Error converting code: {str(e)[:200]}",
            "source_language": body.source_language,
            "target_language": body.target_language,
        }
