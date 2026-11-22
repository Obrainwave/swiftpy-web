from __future__ import annotations

from datetime import datetime
from swiftpy.database.orm import BelongsTo, HasMany, Model


class DocVersion(Model):
    """DocVersion model."""

    __table__ = "doc_versions"
    __guarded__ = ["id", "created_at", "updated_at"]

    id: int
    version: str
    slug: str
    description: str | None
    sort_order: int
    is_active: bool
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    author = BelongsTo("User", foreign_key="created_by")
    groups = HasMany("DocGroup", foreign_key="doc_version_id")

    