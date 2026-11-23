from __future__ import annotations

import unittest
from unittest.mock import AsyncMock, MagicMock, patch

from swiftpy import NotFoundError
from swiftpy.database.orm.model import MassAssignmentError

from app.models.blog_comment import BlogComment
from app.models.blog_post import BlogPost
from app.repositories.admin.blog_comment_repository import BlogCommentRepository
from app.repositories.admin.blog_post_repository import BlogPostRepository


class BlogPostCommentRepositoryTests(unittest.IsolatedAsyncioTestCase):
    async def test_crud_and_missing_records(self) -> None:
        cases = (
            (
                BlogPostRepository(),
                BlogPost,
                "blog_post",
                "blog_posts",
                {"title": "Original", "slug": "original", "image": "old.png"},
                {"title": "Updated", "image": None},
                ("author", "category", "comments"),
                ("author", "category"),
                "sort_order",
            ),
            (
                BlogCommentRepository(),
                BlogComment,
                "blog_comment",
                "blog_comments",
                {"comment": "Original", "status": True},
                {"comment": "Updated", "status": False},
                ("blog_post", "user"),
                ("blog_post", "user"),
                "created_at",
            ),
        )

        for (
            repository,
            model_class,
            singular,
            plural,
            initial,
            changes,
            detail_relations,
            list_relations,
            order,
        ) in cases:
            with self.subTest(repository=type(repository).__name__):
                record = model_class(**initial)
                model = MagicMock()
                repository.model = model
                query = model.with_.return_value
                query.where.return_value.first = AsyncMock(return_value=record)
                query.order_by.return_value.get = AsyncMock(return_value=[record])
                model.where.return_value.first = AsyncMock(return_value=record)
                model.create = AsyncMock(return_value=record)

                self.assertIs(await getattr(repository, f"get_{singular}")(7), record)
                model.with_.assert_called_with(*detail_relations)
                query.where.assert_called_once_with("id", 7)
                self.assertEqual(await getattr(repository, f"get_{plural}")(), [record])
                model.with_.assert_called_with(*list_relations)
                query.order_by.assert_called_once_with(order)

                self.assertIs(
                    await getattr(repository, f"create_{singular}")(initial), record
                )
                model.create.assert_awaited_once_with(initial)

                with patch.object(model_class, "save", new_callable=AsyncMock) as save:
                    self.assertIs(
                        await getattr(repository, f"update_{singular}")(7, changes),
                        record,
                    )
                    save.assert_awaited_once()
                for field, value in changes.items():
                    self.assertEqual(getattr(record, field), value)
                with self.assertRaises(MassAssignmentError):
                    await getattr(repository, f"update_{singular}")(7, {"id": 8})

                with patch.object(
                    model_class, "delete", new_callable=AsyncMock
                ) as delete:
                    self.assertTrue(await getattr(repository, f"delete_{singular}")(7))
                    delete.assert_awaited_once()

                query.where.return_value.first.return_value = None
                model.where.return_value.first.return_value = None
                self.assertIsNone(await getattr(repository, f"get_{singular}")(99))
                with self.assertRaises(NotFoundError):
                    await getattr(repository, f"update_{singular}")(99, changes)
                with self.assertRaises(NotFoundError):
                    await getattr(repository, f"delete_{singular}")(99)
