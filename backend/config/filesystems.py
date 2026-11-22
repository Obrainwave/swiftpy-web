from __future__ import annotations

from swiftpy.helpers.helper import env

CONFIG = {
    "default": env("FILESYSTEM_DISK", "local"),
    "signing_key": env("FILESYSTEM_SIGNING_KEY") or None,
    "disks": {
        "local": {
            "driver": "local",
            "root": env("STORAGE_LOCAL_ROOT", "storage/app/private"),
            "visibility": "private",
        },
        "public": {
            "driver": "local",
            "root": env("STORAGE_PUBLIC_ROOT", "storage/app/public"),
            "url": env("STORAGE_PUBLIC_URL", "/storage"),
            "visibility": "public",
        },
        "s3": {
            "driver": "s3",
            "key": env("AWS_ACCESS_KEY_ID", ""),
            "secret": env("AWS_SECRET_ACCESS_KEY", ""),
            "region": env("AWS_DEFAULT_REGION", "us-east-1"),
            "bucket": env("AWS_BUCKET", ""),
            "endpoint": env("AWS_ENDPOINT") or None,
            "visibility": "private",
        },
    },
}
