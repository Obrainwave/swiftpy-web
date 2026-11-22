from __future__ import annotations

from swiftpy.helpers.helper import env, env_bool

CONFIG = {
    "defaults": {
        "guard": env("AUTH_GUARD", "jwt"),
    },
    "blacklist_enabled": env_bool("AUTH_BLACKLIST_ENABLED", True),
    "guards": {
        "jwt": {
            "secret": env("JWT_SECRET", ""),
            "algorithm": env("JWT_ALGORITHM", "HS256"),
            "access_token_ttl": int(env("JWT_ACCESS_TTL", "900") or "900"),
            "refresh_token_ttl": int(env("JWT_REFRESH_TTL", "604800") or "604800"),
            "leeway": int(env("JWT_LEEWAY", "0") or "0"),
            "issuer": env("JWT_ISSUER") or None,
            "audience": env("JWT_AUDIENCE") or None,
            "private_key": env("JWT_PRIVATE_KEY") or None,
            "public_key": env("JWT_PUBLIC_KEY") or None,
        },
        "api_key": {
            "table": env("AUTH_API_KEYS_TABLE", "api_keys"),
            "prefix_column": "prefix",
            "hash_column": "key_hash",
            "header": "X-API-Key",
            "pepper": env("AUTH_KEY_PEPPER", ""),
        },
    },
    "redis": {
        "host": env("REDIS_HOST", "127.0.0.1"),
        "port": int(env("REDIS_PORT", "6379") or "6379"),
        "password": env("REDIS_PASSWORD") or None,
        "database": int(env("REDIS_AUTH_DB", env("REDIS_CACHE_DB", "0")) or "0"),
    },
}
