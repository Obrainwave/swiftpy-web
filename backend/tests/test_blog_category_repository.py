from __future__ import annotations

import unittest
from unittest.mock import AsyncMock, MagicMock, patch

from swiftpy import NotFoundError
from swiftpy.database.orm.model import MassAssignmentError

from app.models.blog_category import BlogCategory
from app.repositories.admin.blog_category_repository import BlogCategoryRepository


class BlogCategoryRepositoryTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.repository = BlogCategoryRepository()
        self.model = MagicMock()
        self.repository.model = self.model
        self.query = self.model.with_.return_value
        self.query.where.return_value.first = AsyncMock()
        self.query.order_by.return_value.get = AsyncMock()
        self.model.where.return_value.first = AsyncMock()
        self.model.create = AsyncMock()

    async def test_get_and_list_load_expected_relations(self) -> None:
        category = BlogCategory(name="Guides", slug="guides")
        self.query.where.return_value.first.return_value = category
        self.query.order_by.return_value.get.return_value = [category]

        self.assertIs(await self.repository.get_blog_category(7), category)
        self.model.with_.assert_called_with("parent", "children", "posts")
        self.query.where.assert_called_once_with("id", 7)
        self.assertEqual(await self.repository.get_blog_categories(), [category])
        self.model.with_.assert_called_with("parent")
        self.query.order_by.assert_called_once_with("sort_order")

    async def test_create_passes_data_to_orm(self) -> None:
        data = {"name": "Guides", "slug": "guides"}
        category = BlogCategory(**data)
        self.model.create.return_value = category

        self.assertIs(await self.repository.create_blog_category(data), category)
        self.model.create.assert_awaited_once_with(data)

    async def test_update_changes_only_provided_fields_and_allows_clearing(self) -> None:
        category = BlogCategory(
            name="Guides", slug="guides", parent_id=2, is_active=True
        )
        self.model.where.return_value.first.return_value = category
        with patch.object(BlogCategory, "save", new_callable=AsyncMock) as save:
            result = await self.repository.update_blog_category(
                7, {"parent_id": None, "is_active": False}
            )

        self.assertIs(result, category)
        self.assertEqual(category.name, "Guides")
        self.assertIsNone(category.parent_id)
        self.assertFalse(category.is_active)
        save.assert_awaited_once()

    async def test_update_rejects_guarded_fields(self) -> None:
        category = BlogCategory(name="Guides", slug="guides")
        self.model.where.return_value.first.return_value = category
        with self.assertRaises(MassAssignmentError):
            await self.repository.update_blog_category(7, {"id": 8})

    async def test_delete_and_missing_records(self) -> None:
        category = BlogCategory(name="Guides", slug="guides")
        self.model.where.return_value.first.return_value = category
        with patch.object(BlogCategory, "delete", new_callable=AsyncMock) as delete:
            self.assertTrue(await self.repository.delete_blog_category(7))
            delete.assert_awaited_once()

        self.query.where.return_value.first.return_value = None
        self.model.where.return_value.first.return_value = None
        self.assertIsNone(await self.repository.get_blog_category(99))
        with self.assertRaises(NotFoundError):
            await self.repository.update_blog_category(99, {"name": "Missing"})
        with self.assertRaises(NotFoundError):
            await self.repository.delete_blog_category(99)
