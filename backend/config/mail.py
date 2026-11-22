from __future__ import annotations

from swiftpy.helpers.helper import env, env_bool

CONFIG = {
    "default": env("MAIL_MAILER", "smtp"),
    "from": {
        "address": env("MAIL_FROM_ADDRESS", "noreply@example.com"),
        "name": env("MAIL_FROM_NAME", "SwiftPY"),
    },
    "mailers": {
        "smtp": {
            "transport": "smtp",
            "host": env("MAIL_HOST", "127.0.0.1"),
            "port": int(env("MAIL_PORT", "587") or "587"),
            "username": env("MAIL_USERNAME") or None,
            "password": env("MAIL_PASSWORD") or None,
            "encryption": env("MAIL_ENCRYPTION", "starttls"),
            "timeout": float(env("MAIL_TIMEOUT", "30.0") or "30.0"),
            "validate_certs": env_bool("MAIL_VALIDATE_CERTS", True),
        },
        "resend": {
            "transport": "resend",
            "api_key": env("RESEND_API_KEY", ""),
        },
        "sendgrid": {
            "transport": "sendgrid",
            "api_key": env("SENDGRID_API_KEY", ""),
        },
        "mailgun": {
            "transport": "mailgun",
            "api_key": env("MAILGUN_API_KEY", ""),
            "domain": env("MAILGUN_DOMAIN", ""),
        },
        "sendmail": {
            "transport": "sendmail",
            "path": "/usr/sbin/sendmail",
        },
        "console": {
            "transport": "console",
        },
        "fake": {
            "transport": "fake",
        },
    },
}
