from __future__ import annotations

from datetime import datetime
from typing import ClassVar

from swiftpy.database.orm import BelongsTo, Model


class Doc(Model):
    """Doc model."""

    __table__ = "docs"
    __guarded__ = ["id", "created_at", "updated_at"]
    
    id: int
    doc_version_id: int
    doc_group_id: int
    title: str
    slug: str
    content: str
    is_active: bool
    created_by: int | None
    created_at: datetime
    updated_at: datetime
    
    author = BelongsTo("User", foreign_key="created_by")
    version = BelongsTo("DocVersion", foreign_key="doc_version_id")
    group = BelongsTo("DocGroup", foreign_key="doc_group_id")
    
    
