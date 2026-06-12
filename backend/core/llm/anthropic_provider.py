from __future__ import annotations

from typing import Any, AsyncGenerator

from anthropic import AsyncAnthropic

from core.config import settings
from core.llm.base import BaseLLMProvider


class AnthropicProvider(BaseLLMProvider):
    def __init__(self) -> None:
        self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = "claude-3-opus-20240229"

    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> str:
        response = await self.client.messages.create(
            model=self.model,
            system=system_prompt or "",
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.content[0].text if response.content else ""

    async def generate_stream(
        self,
        prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> AsyncGenerator[str, None]:
        async with self.client.messages.stream(
            model=self.model,
            system=system_prompt or "",
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens,
        ) as stream:
            async for text in stream.text_stream:
                yield text

    async def count_tokens(self, text: str) -> int:
        import tiktoken
        encoder = tiktoken.get_encoding("cl100k_base")
        return len(encoder.encode(text))
