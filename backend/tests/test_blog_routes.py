from __future__ import annotations

import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

from swiftpy import Application
from swiftpy.auth import JWTGuard
from swiftpy.http.middleware import Handler
from swiftpy.http.request import Request
from swiftpy.http.response import Response
from swiftpy.testing.http_client import TestClient
from swiftpy.validation.rules.exists import ExistsRule
from swiftpy.validation.rules.unique import UniqueRule

from app.http.controllers.admin.blog_controller import BlogController
from app.http.middleware.admin_middleware import AdminMiddleware
from app.services.admin.blog_category_service import BlogCategoryService
from app.services.admin.blog_comment_service import BlogCommentService
from app.services.admin.blog_post_service import BlogPostService
from routes.admin import router


async def allow_request(
    middleware: object, request: Request, next_handler: Handler
) -> Response:
    return await next_handler(request)


class BlogRouteTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.app = Application(config={}, auto_discover_providers=False)
        self.app.include_router(router)
        self.client = TestClient(self.app)
        self.categories = AsyncMock(spec=BlogCategoryService)
        self.posts = AsyncMock(spec=BlogPostService)
        self.comments = AsyncMock(spec=BlogCommentService)
        self.app.container.instance(BlogCategoryService, self.categories)
        self.app.container.instance(BlogPostService, self.posts)
        self.app.container.instance(BlogCommentService, self.comments)

    def bypass_auth(self) -> None:
        for middleware in (JWTGuard, AdminMiddleware):
            mocked = patch.object(middleware, "handle", allow_request)
            mocked.start()
            self.addCleanup(mocked.stop)

    def mock_db_rules(self) -> None:
        for rule in (ExistsRule, UniqueRule):
            mocked = patch.object(rule, "validate", new_callable=AsyncMock, return_value=True)
            mocked.start()
            self.addCleanup(mocked.stop)

    async def test_registered_routes_and_middleware(self) -> None:
        for plural, singular in (
            ("categories", "category"),
            ("posts", "post"),
            ("comments", "comment"),
        ):
            base = f"/v1/admin/blog/{plural}"
            cases = (
                ("GET", base, plural),
                ("GET", f"{base}/7", f"get_{singular}"),
                ("POST", f"{base}/create", f"create_{singular}"),
                ("PUT", f"{base}/7/update", f"update_{singular}"),
                ("DELETE", f"{base}/7/delete", f"delete_{singular}"),
            )
            for method, path, handler_name in cases:
                with self.subTest(method=method, path=path):
                    route, _ = self.app.router.match(method, path)
                    self.assertIsNotNone(route)
                    assert route is not None
                    self.assertIs(route.handler, getattr(BlogController, handler_name))
                    self.assertIn(JWTGuard, route.middleware)
                    self.assertIn(AdminMiddleware, route.middleware)

    async def test_unauthenticated_requests_are_rejected(self) -> None:
        for resource in ("categories", "posts", "comments"):
            with self.subTest(resource=resource):
                response = await self.client.get(f"/v1/admin/blog/{resource}")
                self.assertEqual(response.status_code, 401)

    async def test_non_admin_is_forbidden(self) -> None:
        auth = MagicMock()
        auth.check.return_value = True
        auth.user.return_value = SimpleNamespace(is_admin=False)
        with (
            patch.object(JWTGuard, "handle", allow_request),
            patch("app.http.middleware.admin_middleware.auth", return_value=auth),
        ):
            response = await self.client.get("/v1/admin/blog/categories")
        self.assertEqual(response.status_code, 403)
        self.categories.get_blog_categories.assert_not_awaited()

    async def test_real_paths_dispatch_and_validate(self) -> None:
        self.bypass_auth()
        self.mock_db_rules()
        self.categories.get_blog_category.return_value = {"id": 7}
        self.posts.update_blog_post.return_value = {"id": 8}
        self.comments.create_blog_comment.return_value = {"id": 9}

        response = await self.client.get("/v1/admin/blog/categories/7")
        self.assertEqual(response.status_code, 200)
        self.categories.get_blog_category.assert_awaited_once_with(7)
        post = {
            "title": "Article",
            "slug": "article",
            "blog_category_id": 1,
            "author_id": 1,
            "excerpt": "Summary",
            "content": "Content",
        }
        response = await self.client.put("/v1/admin/blog/posts/8/update", json=post)
        self.assertEqual(response.status_code, 200, response.json())
        self.posts.update_blog_post.assert_awaited_once_with(
            8, post, thumbnail=None, image=None
        )
        response = await self.client.post(
            "/v1/admin/blog/comments/create",
            json={"blog_post_id": 1, "user_id": 1, "comment": "Hello"},
        )
        self.assertEqual(response.status_code, 200, response.json())
        self.comments.create_blog_comment.assert_awaited_once()
        response = await self.client.post(
            "/v1/admin/blog/comments/create", json={"comment": ""}
        )
        self.assertEqual(response.status_code, 422)
        self.assertEqual(self.comments.create_blog_comment.await_count, 1)

    async def test_post_route_accepts_two_maximum_sized_uploads(self) -> None:
        self.bypass_auth()
        self.mock_db_rules()
        self.posts.create_blog_post.return_value = {"id": 1}
        fields = {
            "title": "Article",
            "slug": "article",
            "blog_category_id": "1",
            "author_id": "1",
            "excerpt": "Summary",
            "content": "Content",
        }
        parts = [
            f'--test\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n'
            f"{value}\r\n".encode()
            for name, value in fields.items()
        ]
        image = b"\x89PNG\r\n\x1a\n" + b"\x00" * (2 * 1024 * 1024 - 8)
        for name in ("thumbnail", "image"):
            parts.append(
                f'--test\r\nContent-Disposition: form-data; name="{name}"; '
                f'filename="{name}.png"\r\nContent-Type: image/png\r\n\r\n'.encode()
                + image
                + b"\r\n"
            )
        response = await self.client.post(
            "/v1/admin/blog/posts/create",
            data=b"".join(parts) + b"--test--\r\n",
            headers={"content-type": "multipart/form-data; boundary=test"},
        )
        self.assertEqual(response.status_code, 200, response.json())
        self.assertEqual(self.posts.create_blog_post.await_count, 1)

    async def test_upload_route_rejects_body_over_its_limit(self) -> None:
        self.bypass_auth()
        body = (
            b'--test\r\nContent-Disposition: form-data; name="image"; '
            b'filename="image.png"\r\nContent-Type: image/png\r\n\r\n'
            + b"x" * (3 * 1024 * 1024)
            + b"\r\n--test--\r\n"
        )
        response = await self.client.post(
            "/v1/admin/blog/categories/create",
            data=body,
            headers={"content-type": "multipart/form-data; boundary=test"},
        )
        self.assertEqual(response.status_code, 413)
        self.categories.create_blog_category.assert_not_awaited()
