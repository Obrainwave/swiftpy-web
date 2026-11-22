from __future__ import annotations

from swiftpy.helpers.helper import env

CONFIG = {
    "default": env("DB_CONNECTION", "postgresql"),
    "connections": {
        "postgresql": {
            "host": env("DB_HOST", "127.0.0.1"),
            "port": int(env("DB_PORT", "5432") or "5432"),
            "database": env("DB_DATABASE", "backend"),
            "user": env("DB_USERNAME", "postgres"),
            "password": env("DB_PASSWORD", "secret"),
            "ssl": env("DB_SSL", "disable"),
            "ssl_ca_file": env("DB_SSL_CA_FILE") or None,
        },
    },
    "pool": {
        "min_size": int(env("DB_POOL_MIN_SIZE", "5") or "5"),
        "max_size": int(env("DB_POOL_MAX_SIZE", "20") or "20"),
        "max_queries": int(env("DB_POOL_MAX_QUERIES", "50000") or "50000"),
        "max_inactive_connection_lifetime": float(
            env("DB_POOL_MAX_INACTIVE_LIFETIME", "300.0") or "300.0"
        ),
        "command_timeout": float(env("DB_COMMAND_TIMEOUT", "60.0") or "60.0"),
    },
    "timeouts": {
        "connect": float(env("DB_CONNECT_TIMEOUT", "10.0") or "10.0"),
        "statement": float(env("DB_STATEMENT_TIMEOUT", "30.0") or "30.0"),
        "transaction": float(env("DB_TRANSACTION_TIMEOUT", "60.0") or "60.0"),
    },
}
