from __future__ import annotations

from datetime import datetime

from swiftpy.database.orm import BelongsTo, Model


class Release(Model):
    """Release model."""

    __table__ = "releases"
    __guarded__ = ["id", "created_at", "updated_at"]

    id: int
    doc_version_id: int
    author_id: int
    content: str
    released_at: datetime | None
    status: str
    created_at: datetime
    updated_at: datetime
    
    version = BelongsTo("DocVersion", foreign_key="doc_version_id")
    author = BelongsTo("User", foreign_key="author_id")
