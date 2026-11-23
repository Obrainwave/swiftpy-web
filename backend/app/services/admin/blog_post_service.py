from __future__ import annotations

from typing import Any

from swiftpy import NotFoundError, ValidationError
from swiftpy.filesystem import UploadedFile

from app.models.blog_post import BlogPost
from app.repositories.admin.blog_post_repository import BlogPostRepository
from app.services.admin.blog_image_uploads import (
    delete_replaced_blog_images,
    store_blog_images,
)


class BlogPostService:
    """BlogPostService business logic service."""

    def __init__(self) -> None:
        self.repo = BlogPostRepository()

    async def get_blog_posts(self) -> list[BlogPost]:
        return await self.repo.get_blog_posts()

    async def get_blog_post(self, post_id: int) -> BlogPost:
        post = await self.repo.get_blog_post(post_id)
        if post is None:
            raise NotFoundError("Blog post not found")
        return post

    async def create_blog_post(
        self,
        data: dict[str, Any],
        thumbnail: UploadedFile | None = None,
        image: UploadedFile | None = None,
    ) -> BlogPost:
        if thumbnail is None and not data.get("thumbnail"):
            raise ValidationError({"thumbnail": ["The thumbnail field is required."]})

        uploads: dict[str, tuple[UploadedFile, str]] = {}
        if thumbnail is not None:
            uploads["thumbnail"] = (thumbnail, "uploads/blog_posts/thumbnails")
        if image is not None:
            uploads["image"] = (image, "uploads/blog_posts")
        async with store_blog_images(data, uploads) as payload:
            return await self.repo.create_blog_post(payload)

    async def update_blog_post(
        self,
        post_id: int,
        data: dict[str, Any],
        thumbnail: UploadedFile | None = None,
        image: UploadedFile | None = None,
    ) -> BlogPost:
        previous: dict[str, str | None] = {}
        if thumbnail is not None or image is not None or data.get("thumbnail") or data.get("image"):
            post = await self.get_blog_post(post_id)
            previous = {"thumbnail": post.thumbnail, "image": post.image}
        uploads: dict[str, tuple[UploadedFile, str]] = {}
        if thumbnail is not None:
            uploads["thumbnail"] = (thumbnail, "uploads/blog_posts/thumbnails")
        if image is not None:
            uploads["image"] = (image, "uploads/blog_posts")
        async with store_blog_images(data, uploads) as payload:
            post = await self.repo.update_blog_post(post_id, payload)
        if previous:
            current = {field: payload.get(field, value) for field, value in previous.items()}
            await delete_replaced_blog_images(previous, current, "uploads/blog_posts")
        return post

    async def delete_blog_post(self, post_id: int) -> bool:
        return await self.repo.delete_blog_post(post_id)
