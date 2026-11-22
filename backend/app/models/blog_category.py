from __future__ import annotations

from datetime import datetime
from typing import ClassVar

from swiftpy.database.orm import Model


class BlogCategory(Model):
    """BlogCategory model."""

    __table__ = "blog_categories"
    __fillable__: ClassVar[list[str]] = []

    id: int
    created_at: datetime
    updated_at: datetime
