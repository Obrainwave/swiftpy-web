from __future__ import annotations

from datetime import datetime

from swiftpy.database.orm import Model, BelongsTo, HasMany


class BlogPost(Model):
    """BlogPost model."""

    __table__ = "blog_posts"
    __guarded__ = ["id", "created_at", "updated_at"]

    id: int
    title: str
    slug: str
    blog_category_id: int
    author_id: int
    excerpt: str
    content: str
    sort_order: int
    tags: str | None
    canonical_url: str | None
    meta_title: str | None
    meta_description: str | None
    thumbnail: str | None
    image: str | None
    status: bool
    created_at: datetime
    updated_at: datetime
    
    author = BelongsTo("User", foreign_key="author_id")
    category = BelongsTo("BlogCategory", foreign_key="blog_category_id")
    comments = HasMany("BlogComment", foreign_key="blog_post_id")
