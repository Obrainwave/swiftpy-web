from __future__ import annotations

from swiftpy.helpers.helper import env

CONFIG = {
    "default": env("QUEUE_DRIVER", "redis"),
    "connections": {
        "redis": {
            "driver": "redis",
            "host": env("REDIS_HOST", "127.0.0.1"),
            "port": int(env("REDIS_PORT", "6379") or "6379"),
            "password": env("REDIS_PASSWORD") or None,
            "database": int(env("REDIS_QUEUE_DB", "1") or "1"),
            "queue": env("QUEUE_NAME", "default"),
            "prefix": env("QUEUE_PREFIX", "swiftpy_queue:"),
        },
    },
}
