from __future__ import annotations

import unittest
from unittest.mock import AsyncMock, patch

from swiftpy import Application, NotFoundError
from swiftpy.filesystem import UploadedFile
from swiftpy.testing.http_client import TestClient
from swiftpy.validation.rules.exists import ExistsRule
from swiftpy.validation.rules.unique import UniqueRule

from app.http.controllers.admin.blog_controller import BlogController
from app.services.admin.blog_category_service import BlogCategoryService
from app.services.admin.blog_comment_service import BlogCommentService
from app.services.admin.blog_post_service import BlogPostService


class BlogControllerTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        app = Application(config={}, auto_discover_providers=False)
        self.categories = AsyncMock(spec=BlogCategoryService)
        self.posts = AsyncMock(spec=BlogPostService)
        self.comments = AsyncMock(spec=BlogCommentService)
        app.container.instance(BlogCategoryService, self.categories)
        app.container.instance(BlogPostService, self.posts)
        app.container.instance(BlogCommentService, self.comments)

        for path, name, identifier in (
            ("categories", "category", "category_id"),
            ("posts", "post", "post_id"),
            ("comments", "comment", "comment_id"),
        ):
            app.get(f"/{path}", getattr(BlogController, path))
            app.get(f"/{path}/{{{identifier}}}", getattr(BlogController, f"get_{name}"))
            app.post(f"/{path}", getattr(BlogController, f"create_{name}"))
            app.put(f"/{path}/{{{identifier}}}", getattr(BlogController, f"update_{name}"))
            app.delete(f"/{path}/{{{identifier}}}", getattr(BlogController, f"delete_{name}"))
        self.client = TestClient(app)
        for rule in (ExistsRule, UniqueRule):
            mocked = patch.object(rule, "validate", new_callable=AsyncMock, return_value=True)
            mocked.start()
            self.addCleanup(mocked.stop)

    async def test_crud_dispatch_and_response(self) -> None:
        cases = (
            (
                "categories",
                "category",
                self.categories,
                {"name": "Guides", "slug": "guides"},
            ),
            (
                "posts",
                "post",
                self.posts,
                {
                    "title": "Article",
                    "slug": "article",
                    "blog_category_id": 1,
                    "author_id": 1,
                    "excerpt": "Summary",
                    "content": "Content",
                    "thumbnail": "existing.png",
                },
            ),
            (
                "comments",
                "comment",
                self.comments,
                {"blog_post_id": 1, "user_id": 1, "comment": "Hello"},
            ),
        )
        for path, name, service, payload in cases:
            with self.subTest(entity=name):
                list_service = getattr(service, f"get_blog_{path}")
                get_service = getattr(service, f"get_blog_{name}")
                create_service = getattr(service, f"create_blog_{name}")
                update_service = getattr(service, f"update_blog_{name}")
                delete_service = getattr(service, f"delete_blog_{name}")
                list_service.return_value = [{"id": 7}]
                get_service.return_value = {"id": 7}
                create_service.return_value = {"id": 7}
                update_service.return_value = {"id": 7}
                delete_service.return_value = True

                result = await self.client.get(f"/{path}")
                self.assertEqual(result.status_code, 200)
                self.assertEqual(result.json()["data"], [{"id": 7}])
                result = await self.client.get(f"/{path}/7")
                self.assertEqual(result.json()["data"], {"id": 7})
                get_service.assert_awaited_once_with(7)
                result = await self.client.post(f"/{path}", json=payload)
                self.assertEqual(result.status_code, 200, result.json())
                result = await self.client.put(f"/{path}/7", json=payload)
                self.assertEqual(result.status_code, 200, result.json())
                if name == "category":
                    create_service.assert_awaited_once_with(payload, image=None)
                    update_service.assert_awaited_once_with(7, payload, image=None)
                elif name == "post":
                    create_service.assert_awaited_once_with(payload, thumbnail=None, image=None)
                    update_service.assert_awaited_once_with(7, payload, thumbnail=None, image=None)
                else:
                    create_service.assert_awaited_once_with(payload)
                    update_service.assert_awaited_once_with(7, payload)
                result = await self.client.delete(f"/{path}/7")
                self.assertEqual(result.json()["data"], True)
                delete_service.assert_awaited_once_with(7)

                get_service.side_effect = NotFoundError("Not found")
                self.assertEqual((await self.client.get(f"/{path}/99")).status_code, 404)

    async def test_invalid_comment_does_not_reach_service(self) -> None:
        response = await self.client.post("/comments", json={"comment": ""})
        self.assertEqual(response.status_code, 422)
        self.comments.create_blog_comment.assert_not_awaited()

    async def test_multipart_uploads_are_passed_separately(self) -> None:
        post_fields = {
            "title": "Article",
            "slug": "article",
            "blog_category_id": "1",
            "author_id": "1",
            "excerpt": "Summary",
            "content": "Content",
        }
        cases = (
            ("categories", "category", self.categories, {"name": "Guides", "slug": "guides"}, ("image",)),
            ("posts", "post", self.posts, post_fields, ("thumbnail", "image")),
        )
        for path, name, service, fields, file_names in cases:
            parts: list[bytes] = []
            for field, value in fields.items():
                parts.append(
                    f'--test-boundary\r\nContent-Disposition: form-data; name="{field}"'
                    f"\r\n\r\n{value}\r\n".encode()
                )
            for field in file_names:
                parts.append(
                    f'--test-boundary\r\nContent-Disposition: form-data; name="{field}"; '
                    f'filename="{field}.png"\r\nContent-Type: image/png\r\n\r\n'.encode()
                    + b"\x89PNG\r\n\x1a\n"
                    + b"\r\n"
                )
            body = b"".join(parts) + b"--test-boundary--\r\n"
            for method, url, action in (
                (self.client.post, f"/{path}", "create"),
                (self.client.put, f"/{path}/7", "update"),
            ):
                with self.subTest(entity=name, action=action):
                    target = getattr(service, f"{action}_blog_{name}")
                    target.return_value = {"id": 7}
                    response = await method(
                        url,
                        data=body,
                        headers={"content-type": "multipart/form-data; boundary=test-boundary"},
                    )
                    self.assertEqual(response.status_code, 200, response.json())
                    args, kwargs = target.await_args
                    validated = args[-1]
                    for field in file_names:
                        self.assertNotIn(field, validated)
                        self.assertIsInstance(kwargs[field], UploadedFile)
