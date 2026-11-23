from __future__ import annotations

from typing import Any

from swiftpy import NotFoundError
from swiftpy.filesystem import UploadedFile

from app.models.blog_category import BlogCategory
from app.repositories.admin.blog_category_repository import BlogCategoryRepository
from app.services.admin.blog_image_uploads import (
    delete_replaced_blog_images,
    store_blog_images,
)


class BlogCategoryService:
    """BlogCategoryService business logic service."""

    def __init__(self) -> None:
        self.repo = BlogCategoryRepository()

    async def get_blog_categories(self) -> list[BlogCategory]:
        return await self.repo.get_blog_categories()

    async def get_blog_category(self, category_id: int) -> BlogCategory:
        category = await self.repo.get_blog_category(category_id)
        if category is None:
            raise NotFoundError("Blog category not found")
        return category

    async def create_blog_category(
        self, data: dict[str, Any], image: UploadedFile | None = None
    ) -> BlogCategory:
        uploads = (
            {"image": (image, "uploads/blog_categories")} if image is not None else {}
        )
        async with store_blog_images(data, uploads) as payload:
            return await self.repo.create_blog_category(payload)

    async def update_blog_category(
        self,
        category_id: int,
        data: dict[str, Any],
        image: UploadedFile | None = None,
    ) -> BlogCategory:
        previous: dict[str, str | None] = {}
        if image is not None or data.get("image"):
            category = await self.get_blog_category(category_id)
            previous["image"] = category.image
        uploads = (
            {"image": (image, "uploads/blog_categories")} if image is not None else {}
        )
        async with store_blog_images(data, uploads) as payload:
            category = await self.repo.update_blog_category(category_id, payload)
        if previous:
            current = {"image": payload.get("image", previous["image"])}
            await delete_replaced_blog_images(previous, current, "uploads/blog_categories")
        return category

    async def delete_blog_category(self, category_id: int) -> bool:
        return await self.repo.delete_blog_category(category_id)
