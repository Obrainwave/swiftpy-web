from __future__ import annotations

import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from pathlib import PurePosixPath
from typing import Any

from swiftpy.filesystem import Storage, UploadedFile

logger = logging.getLogger(__name__)


async def delete_replaced_blog_images(
    previous: dict[str, str | None],
    current: dict[str, Any],
    directory: str,
) -> None:
    """Delete replaced files owned by this blog upload directory."""
    retained = {value for value in current.values() if isinstance(value, str)}
    paths: set[str] = set()
    for field, old_path in previous.items():
        replacement = current.get(field)
        if (
            not old_path
            or not isinstance(replacement, str)
            or not replacement
            or old_path in retained
        ):
            continue
        if (
            not old_path.startswith(f"{directory}/")
            or "\\" in old_path
            or str(PurePosixPath(old_path)) != old_path
            or ".." in PurePosixPath(old_path).parts
        ):
            logger.warning("Skipping non-blog storage path during image replacement: %s", old_path)
            continue
        paths.add(old_path)

    failed: list[str] = []
    for path in sorted(paths):
        try:
            disk = Storage.disk("public")
            if not await disk.delete(path) and await disk.exists(path):
                logger.error("Could not delete replaced blog image %s", path)
                failed.append(path)
        except Exception:
            logger.exception("Could not delete replaced blog image %s", path)
            failed.append(path)
    if failed:
        raise RuntimeError("Blog update succeeded, but a replaced image could not be deleted.")


@asynccontextmanager
async def store_blog_images(
    data: dict[str, Any],
    uploads: dict[str, tuple[UploadedFile, str]],
) -> AsyncGenerator[dict[str, Any], None]:
    """Store validated uploads and remove newly stored files if the operation fails."""
    payload = dict(data)
    stored_paths: list[str] = []
    completed = False
    try:
        for upload, _ in uploads.values():
            await upload.validate(
                {
                    "max_size": "2MB",
                    "extensions": ["jpg", "jpeg", "png", "webp"],
                    "magic_bytes": True,
                }
            )
        for field, (upload, directory) in uploads.items():
            path = await upload.store(directory, disk="public")
            stored_paths.append(path)
            payload[field] = path
        yield payload
        completed = True
    finally:
        if not completed:
            for path in reversed(stored_paths):
                try:
                    if not await Storage.disk("public").delete(path):
                        logger.warning("Could not remove failed blog upload %s", path)
                except Exception:
                    logger.exception("Could not remove failed blog upload %s", path)
