from __future__ import annotations

from datetime import datetime
from typing import ClassVar

from swiftpy.database.orm import Model, BelongsTo


class BlogComment(Model):
    """BlogComment model."""

    __table__ = "blog_comments"
    __guarded__ = ["id", "created_at", "updated_at"]

    id: int
    blog_post_id: int
    user_id: int
    comment: str
    status: bool
    created_at: datetime
    updated_at: datetime
    
    blog_post = BelongsTo("BlogPost", foreign_key="blog_post_id")
    user = BelongsTo("User", foreign_key="user_id")
