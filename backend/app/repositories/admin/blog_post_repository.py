from __future__ import annotations

from typing import Any

from swiftpy import NotFoundError

from app.models.blog_post import BlogPost


class BlogPostRepository:
    """BlogPostRepository data access repository."""

    def __init__(self) -> None:
        self.model = BlogPost()

    async def get_blog_post(self, post_id: int) -> BlogPost | None:
        return await (
            self.model.with_("author", "category", "comments")
            .where("id", post_id)
            .first()
        )

    async def get_blog_posts(self) -> list[BlogPost]:
        return await (
            self.model.with_("author", "category").order_by("sort_order").get()
        )

    async def create_blog_post(self, data: dict[str, Any]) -> BlogPost:
        return await self.model.create(data)

    async def update_blog_post(self, post_id: int, data: dict[str, Any]) -> BlogPost:
        post = await self.model.where("id", post_id).first()
        if not post:
            raise NotFoundError("Blog post not found")

        post.fill(**data)
        await post.save()
        return post

    async def delete_blog_post(self, post_id: int) -> bool:
        post = await self.model.where("id", post_id).first()
        if not post:
            raise NotFoundError("Blog post not found")

        await post.delete()
        return True
