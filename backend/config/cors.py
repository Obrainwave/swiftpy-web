from __future__ import annotations

from swiftpy.helpers.helper import env, env_bool

CONFIG = {
    "allowed_origins": [
        origin.strip()
        for origin in str(env("CORS_ALLOWED_ORIGINS", "") or "").split(",")
        if origin.strip()
    ],
    "allowed_methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    "allowed_headers": ["Content-Type", "Authorization", "X-Request-ID"],
    "expose_headers": ["X-Request-ID"],
    "allow_credentials": env_bool("CORS_ALLOW_CREDENTIALS", False),
    "max_age": int(env("CORS_MAX_AGE", "600") or "600"),
}
