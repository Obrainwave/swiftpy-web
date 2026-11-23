from __future__ import annotations

from datetime import datetime
from typing import ClassVar

from swiftpy.database.orm import BelongsTo, HasMany, Model


class BlogCategory(Model):
    """BlogCategory model."""

    __table__ = "blog_categories"
    __guarded__ = ["id", "created_at", "updated_at"]

    id: int
    parent_id: int | None
    name: str
    slug: str
    description: str
    sort_order: int
    image: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    children = HasMany("BlogCategory", foreign_key="parent_id")
    posts = HasMany("BlogPost", foreign_key="blog_category_id")
    parent = BelongsTo("BlogCategory", foreign_key="parent_id")
