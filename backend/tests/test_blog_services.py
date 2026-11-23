from __future__ import annotations

import unittest
from unittest.mock import AsyncMock

from swiftpy import NotFoundError

from app.models.blog_category import BlogCategory
from app.models.blog_comment import BlogComment
from app.models.blog_post import BlogPost
from app.repositories.admin.blog_category_repository import BlogCategoryRepository
from app.repositories.admin.blog_comment_repository import BlogCommentRepository
from app.repositories.admin.blog_post_repository import BlogPostRepository
from app.services.admin.blog_category_service import BlogCategoryService
from app.services.admin.blog_comment_service import BlogCommentService
from app.services.admin.blog_post_service import BlogPostService


class BlogServiceTests(unittest.IsolatedAsyncioTestCase):
    async def test_crud_and_not_found(self) -> None:
        cases = (
            (
                BlogCategoryService(),
                BlogCategoryRepository,
                BlogCategory(name="Guides", slug="guides"),
                "blog_category",
                "blog_categories",
                {"description": None, "is_active": False},
            ),
            (
                BlogPostService(),
                BlogPostRepository,
                BlogPost(title="Post", slug="post"),
                "blog_post",
                "blog_posts",
                {"status": "published", "image": None, "thumbnail": "existing.png"},
            ),
            (
                BlogCommentService(),
                BlogCommentRepository,
                BlogComment(comment="Comment", status=False),
                "blog_comment",
                "blog_comments",
                {"comment": "Updated", "status": False},
            ),
        )

        for service, repository_class, record, singular, plural, data in cases:
            with self.subTest(service=type(service).__name__):
                repo = AsyncMock(spec=repository_class)
                service.repo = repo
                get_one = getattr(repo, f"get_{singular}")
                get_many = getattr(repo, f"get_{plural}")
                create = getattr(repo, f"create_{singular}")
                update = getattr(repo, f"update_{singular}")
                delete = getattr(repo, f"delete_{singular}")
                get_one.return_value = record
                get_many.return_value = [record]
                create.return_value = record
                update.return_value = record
                delete.return_value = True

                self.assertEqual(await getattr(service, f"get_{plural}")(), [record])
                self.assertIs(await getattr(service, f"get_{singular}")(7), record)
                get_one.assert_awaited_once_with(7)
                self.assertIs(await getattr(service, f"create_{singular}")(data), record)
                self.assertIs(
                    await getattr(service, f"update_{singular}")(7, data), record
                )
                self.assertTrue(await getattr(service, f"delete_{singular}")(7))
                get_many.assert_awaited_once_with()
                create.assert_awaited_once_with(data)
                update.assert_awaited_once_with(7, data)
                delete.assert_awaited_once_with(7)

                get_one.return_value = None
                with self.assertRaises(NotFoundError):
                    await getattr(service, f"get_{singular}")(99)
                update.side_effect = NotFoundError("Not found")
                delete.side_effect = NotFoundError("Not found")
                with self.assertRaises(NotFoundError):
                    await getattr(service, f"update_{singular}")(99, data)
                with self.assertRaises(NotFoundError):
                    await getattr(service, f"delete_{singular}")(99)
