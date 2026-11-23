from __future__ import annotations

from typing import Any

from swiftpy import NotFoundError

from app.models.blog_comment import BlogComment
from app.repositories.admin.blog_comment_repository import BlogCommentRepository


class BlogCommentService:
    """BlogCommentService business logic service."""

    def __init__(self) -> None:
        self.repo = BlogCommentRepository()

    async def get_blog_comments(self) -> list[BlogComment]:
        return await self.repo.get_blog_comments()

    async def get_blog_comment(self, comment_id: int) -> BlogComment:
        comment = await self.repo.get_blog_comment(comment_id)
        if comment is None:
            raise NotFoundError("Blog comment not found")
        return comment

    async def create_blog_comment(self, data: dict[str, Any]) -> BlogComment:
        return await self.repo.create_blog_comment(data)

    async def update_blog_comment(
        self, comment_id: int, data: dict[str, Any]
    ) -> BlogComment:
        return await self.repo.update_blog_comment(comment_id, data)

    async def delete_blog_comment(self, comment_id: int) -> bool:
        return await self.repo.delete_blog_comment(comment_id)
