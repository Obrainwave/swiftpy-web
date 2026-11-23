from __future__ import annotations

from typing import Any

from swiftpy import NotFoundError

from app.models.blog_comment import BlogComment


class BlogCommentRepository:
    """BlogCommentRepository data access repository."""

    def __init__(self) -> None:
        self.model = BlogComment()

    async def get_blog_comment(self, comment_id: int) -> BlogComment | None:
        return await (
            self.model.with_("blog_post", "user").where("id", comment_id).first()
        )

    async def get_blog_comments(self) -> list[BlogComment]:
        return await self.model.with_("blog_post", "user").order_by("created_at").get()

    async def create_blog_comment(self, data: dict[str, Any]) -> BlogComment:
        return await self.model.create(data)

    async def update_blog_comment(
        self, comment_id: int, data: dict[str, Any]
    ) -> BlogComment:
        comment = await self.model.where("id", comment_id).first()
        if not comment:
            raise NotFoundError("Blog comment not found")

        comment.fill(**data)
        await comment.save()
        return comment

    async def delete_blog_comment(self, comment_id: int) -> bool:
        comment = await self.model.where("id", comment_id).first()
        if not comment:
            raise NotFoundError("Blog comment not found")

        await comment.delete()
        return True
