from __future__ import annotations

import logging
from typing import Any, Optional

from core.config import settings
from core.llm.base import BaseLLMProvider
from core.llm.openai_provider import OpenAIProvider
from core.llm.anthropic_provider import AnthropicProvider

logger = logging.getLogger(__name__)


class CodeService:
    def __init__(self) -> None:
        self.openai_provider = OpenAIProvider() if settings.OPENAI_API_KEY else None
        self.anthropic_provider = AnthropicProvider() if settings.ANTHROPIC_API_KEY else None

    def _get_provider(self) -> BaseLLMProvider:
        if self.anthropic_provider:
            return self.anthropic_provider
        if self.openai_provider:
            return self.openai_provider
        raise RuntimeError("No LLM provider configured")

    async def generate_code(
        self, prompt: str, language: str = "python", context: Optional[str] = None
    ) -> dict[str, Any]:
        system_prompt = f"You are a senior {language} developer. Generate production-quality code."
        full_prompt = f"Context:\n{context}\n\nPrompt:\n{prompt}" if context else prompt
        provider = self._get_provider()
        result = await provider.generate(system_prompt=system_prompt, prompt=full_prompt)
        return {"generated_code": result, "language": language}

    async def debug_code(
        self, code: str, language: str = "python"
    ) -> dict[str, Any]:
        system_prompt = f"You are a senior {language} debugger. Find and fix bugs."
        result = await self._get_provider().generate(
            system_prompt=system_prompt,
            prompt=f"Debug this {language} code:\n\n{code}",
        )
        return {"bugs": [], "fixed_code": result, "language": language}

    async def explain_code(self, code: str, language: str = "python") -> dict[str, Any]:
        result = await self._get_provider().generate(
            system_prompt="You are a code interpreter. Given code, return ONLY the exact output that would be printed to the console when the code runs. Do not include any explanations, labels, or formatting.",
            prompt=f"What is the output of this {language} code?\n\n{code}",
        )
        return {"explanation": result, "language": language}

    async def convert_code(
        self, code: str, source_language: str, target_language: str
    ) -> dict[str, Any]:
        result = await self._get_provider().generate(
            system_prompt=f"Convert code from {source_language} to {target_language} accurately.",
            prompt=f"Convert this {source_language} code to {target_language}:\n\n{code}",
        )
        return {
            "converted_code": result,
            "source_language": source_language,
            "target_language": target_language,
        }


code_service = CodeService()
