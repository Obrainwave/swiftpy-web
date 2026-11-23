from __future__ import annotations

from typing import Any

from swiftpy import NotFoundError

from app.models.blog_category import BlogCategory


class BlogCategoryRepository:
    """BlogCategoryRepository data access repository."""

    def __init__(self) -> None:
        self.model = BlogCategory()

    async def get_blog_category(self, category_id: int) -> BlogCategory | None:
        return await (
            self.model.with_("parent", "children", "posts")
            .where("id", category_id)
            .first()
        )

    async def get_blog_categories(self) -> list[BlogCategory]:
        return await self.model.with_("parent").order_by("sort_order").get()

    async def create_blog_category(self, data: dict[str, Any]) -> BlogCategory:
        return await self.model.create(data)

    async def update_blog_category(
        self, category_id: int, data: dict[str, Any]
    ) -> BlogCategory:
        category = await self.model.where("id", category_id).first()
        if not category:
            raise NotFoundError("Blog category not found")

        category.fill(**data)
        await category.save()
        return category

    async def delete_blog_category(self, category_id: int) -> bool:
        category = await self.model.where("id", category_id).first()
        if not category:
            raise NotFoundError("Blog category not found")

        await category.delete()
        return True
