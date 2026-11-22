from __future__ import annotations

from datetime import datetime

from swiftpy.database.orm import BelongsTo, HasMany, Model
from app.models.doc import Doc


class DocGroup(Model):
    """DocGroup model."""
    __table__ = "doc_groups"
    __guarded__ = ["id", "created_at", "updated_at"]

    id: int
    name: str
    slug: str
    doc_version_id: int
    parent_id: int | None
    description: str | None
    sort_order: int
    image: str | None
    example_link: str | None
    is_active: bool
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    author = BelongsTo("User", foreign_key="created_by")
    version = BelongsTo("DocVersion", foreign_key="doc_version_id")
    docs = HasMany(Doc, foreign_key="doc_group_id")
