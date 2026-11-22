from __future__ import annotations

from swiftpy.helpers.helper import env

CONFIG = {
    "default": env("CACHE_DRIVER", "redis"),
    "prefix": env("CACHE_PREFIX", "swiftpy_cache:"),
    "default_ttl": int(env("CACHE_DEFAULT_TTL", "3600") or "3600"),
    "stores": {
        "memory": {
            "driver": "memory",
            "prefix": env("CACHE_PREFIX", "swiftpy_cache:"),
            "ttl": int(env("CACHE_DEFAULT_TTL", "3600") or "3600"),
        },
        "redis": {
            "driver": "redis",
            "host": env("REDIS_HOST", "127.0.0.1"),
            "port": int(env("REDIS_PORT", "6379") or "6379"),
            "password": env("REDIS_PASSWORD") or None,
            "database": int(env("REDIS_CACHE_DB", "0") or "0"),
            "prefix": env("CACHE_PREFIX", "swiftpy_cache:"),
            "ttl": int(env("CACHE_DEFAULT_TTL", "3600") or "3600"),
        },
    },
}
