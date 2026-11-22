from __future__ import annotations

from swiftpy.helpers.helper import env, env_bool

CONFIG = {
    "enabled": env_bool("AI_ENABLED", True),
    "default": env("AI_DEFAULT_PROVIDER", "openai"),
    "providers": {
        "openai": {
            "api_key": env("OPENAI_API_KEY", ""),
            "model": env("OPENAI_MODEL", "gpt-4o"),
        },
        "anthropic": {
            "api_key": env("ANTHROPIC_API_KEY", ""),
            "model": env("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022"),
        },
    },
}
