from __future__ import annotations

import unittest
from unittest.mock import patch

from swiftpy.validation.rules.exists import ExistsRule
from swiftpy.validation.rules.unique import UniqueRule
from swiftpy.validation.validator import validate

from app.http.requests.admin.blog_request import (
    BlogCategoryCreateRequest,
    BlogCategoryUpdateRequest,
    BlogCommentCreateRequest,
    BlogCommentUpdateRequest,
    BlogPostCreateRequest,
    BlogPostUpdateRequest,
)


async def existing_id(rule: ExistsRule, field: str, value: object, data: object) -> bool:
    return value == 1


async def unique_value(rule: UniqueRule, field: str, value: object, data: object) -> bool:
    return value != "duplicate"


class BlogRequestValidationTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        exists_patch = patch.object(ExistsRule, "validate", existing_id)
        unique_patch = patch.object(UniqueRule, "validate", unique_value)
        exists_patch.start()
        unique_patch.start()
        self.addCleanup(exists_patch.stop)
        self.addCleanup(unique_patch.stop)

    async def test_category_create_and_update(self) -> None:
        for request in (BlogCategoryCreateRequest, BlogCategoryUpdateRequest):
            with self.subTest(request=request.__name__):
                result = await validate(
                    {"name": "Tutorials", "slug": "tutorials", "parent_id": 1},
                    request().rules(),
                )
                self.assertTrue(result.is_valid, result.errors)
                result = await validate(
                    {"name": "x" * 256, "slug": "tutorials", "parent_id": 2},
                    request().rules(),
                )
                self.assertIn("name", result.errors)
                self.assertIn("parent_id", result.errors)

        result = await validate(
            {"name": "duplicate", "slug": "duplicate"},
            BlogCategoryCreateRequest().rules(),
        )
        self.assertIn("name", result.errors)
        self.assertIn("slug", result.errors)

    async def test_post_create_and_update(self) -> None:
        post = {
            "title": "Introduction",
            "slug": "introduction",
            "blog_category_id": 1,
            "author_id": 1,
            "excerpt": "Getting started",
            "content": "Post content",
            "thumbnail": "uploads/thumbnail.png",
            "status": "published",
        }
        for request in (BlogPostCreateRequest, BlogPostUpdateRequest):
            with self.subTest(request=request.__name__):
                result = await validate(post, request().rules())
                self.assertTrue(result.is_valid, result.errors)
                result = await validate(
                    {**post, "blog_category_id": 2, "status": "invalid"},
                    request().rules(),
                )
                self.assertIn("blog_category_id", result.errors)
                self.assertIn("status", result.errors)
                result = await validate(
                    {**post, "excerpt": "x" * 256, "thumbnail": ""},
                    request().rules(),
                )
                self.assertIn("excerpt", result.errors)
                self.assertIn("thumbnail", result.errors)

        result = await validate(
            {**post, "title": "duplicate", "slug": "duplicate"},
            BlogPostCreateRequest().rules(),
        )
        self.assertIn("title", result.errors)
        self.assertIn("slug", result.errors)

    async def test_comment_create_and_update(self) -> None:
        for request in (BlogCommentCreateRequest, BlogCommentUpdateRequest):
            with self.subTest(request=request.__name__):
                result = await validate(
                    {"blog_post_id": 1, "user_id": 1, "comment": "Helpful!"},
                    request().rules(),
                )
                self.assertTrue(result.is_valid, result.errors)
                result = await validate(
                    {"blog_post_id": 2, "user_id": 0, "comment": "", "status": None},
                    request().rules(),
                )
                self.assertEqual(
                    set(result.errors), {"blog_post_id", "user_id", "comment", "status"}
                )


if __name__ == "__main__":
    unittest.main()
