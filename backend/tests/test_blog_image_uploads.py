from __future__ import annotations

import tempfile
import unittest
from unittest.mock import AsyncMock, patch

from swiftpy import NotFoundError, ValidationError
from swiftpy.filesystem import Storage, UploadedFile
from swiftpy.filesystem.exceptions import FileTooLargeError, FileValidationError
from swiftpy.http.request import Request
from swiftpy.validation.rules.exists import ExistsRule
from swiftpy.validation.rules.unique import UniqueRule
from swiftpy.validation.validator import validate

from app.http.requests.admin.blog_request import (
    BlogCategoryCreateRequest,
    BlogPostCreateRequest,
    BlogPostUpdateRequest,
)
from app.models.blog_category import BlogCategory
from app.models.blog_post import BlogPost
from app.services.admin.blog_category_service import BlogCategoryService
from app.services.admin.blog_post_service import BlogPostService


class BlogImageUploadTests(unittest.IsolatedAsyncioTestCase):
    def upload(self, content: bytes, filename: str = "image.png") -> UploadedFile:
        file = tempfile.SpooledTemporaryFile()
        file.write(content)
        self.addCleanup(file.close)
        return UploadedFile(file, filename, "image/png", len(content))

    def png(self) -> UploadedFile:
        return self.upload(b"\x89PNG\r\n\x1a\n" + b"\x00" * 24)

    async def test_category_create_and_update_with_image(self) -> None:
        service = BlogCategoryService()
        service.repo.create_blog_category = AsyncMock(return_value="created")
        service.repo.get_blog_category = AsyncMock(return_value=BlogCategory(image=None))
        service.repo.update_blog_category = AsyncMock(return_value="updated")
        data = {"name": "Guides", "slug": "guides"}
        with patch.object(
            UploadedFile, "store", new_callable=AsyncMock, return_value="stored.png"
        ) as store:
            self.assertEqual(await service.create_blog_category(data, self.png()), "created")
            self.assertEqual(
                await service.update_blog_category(7, data, self.png()), "updated"
            )
        self.assertEqual(data, {"name": "Guides", "slug": "guides"})
        service.repo.create_blog_category.assert_awaited_once_with(
            {**data, "image": "stored.png"}
        )
        service.repo.update_blog_category.assert_awaited_once_with(
            7, {**data, "image": "stored.png"}
        )
        self.assertEqual(store.await_count, 2)
        store.assert_awaited_with("uploads/blog_categories", disk="public")

    async def test_post_uploads_both_files_and_preserves_omitted_images(self) -> None:
        service = BlogPostService()
        service.repo.create_blog_post = AsyncMock(return_value="created")
        service.repo.get_blog_post = AsyncMock(return_value=BlogPost(image=None, thumbnail=None))
        service.repo.update_blog_post = AsyncMock(return_value="updated")
        with patch.object(
            UploadedFile,
            "store",
            new_callable=AsyncMock,
            side_effect=["thumbnail.png", "image.png"],
        ) as store:
            self.assertEqual(
                await service.create_blog_post(
                    {"title": "Post"}, thumbnail=self.png(), image=self.png()
                ),
                "created",
            )
        service.repo.create_blog_post.assert_awaited_once_with(
            {"title": "Post", "thumbnail": "thumbnail.png", "image": "image.png"}
        )
        self.assertEqual(store.await_count, 2)
        self.assertEqual(store.await_args_list[0].args, ("uploads/blog_posts/thumbnails",))
        self.assertEqual(store.await_args_list[1].args, ("uploads/blog_posts",))
        await service.update_blog_post(7, {"title": "Updated"})
        service.repo.update_blog_post.assert_awaited_once_with(7, {"title": "Updated"})
        with patch.object(
            UploadedFile, "store", new_callable=AsyncMock, return_value="new-image.png"
        ):
            await service.update_blog_post(7, {}, image=self.png())
        service.repo.update_blog_post.assert_awaited_with(7, {"image": "new-image.png"})

    async def test_invalid_images_and_missing_thumbnail_fail_before_persistence(self) -> None:
        service = BlogPostService()
        service.repo.create_blog_post = AsyncMock()
        with self.assertRaises(ValidationError):
            await service.create_blog_post({"title": "Post"})
        with patch.object(UploadedFile, "store", new_callable=AsyncMock) as store:
            with self.assertRaises(FileValidationError):
                await service.create_blog_post(
                    {"title": "Post"}, thumbnail=self.png(), image=self.upload(b"fake")
                )
            store.assert_not_awaited()
        service.repo.create_blog_post.assert_not_awaited()

    async def test_upload_size_limit(self) -> None:
        service = BlogCategoryService()
        service.repo.create_blog_category = AsyncMock(return_value="created")
        header = b"\x89PNG\r\n\x1a\n"
        with patch.object(UploadedFile, "store", new_callable=AsyncMock) as store:
            allowed = self.upload(header + b"\x00" * (2 * 1024 * 1024 - len(header)))
            await service.create_blog_category({}, allowed)
            store.assert_awaited_once()
            oversized = self.upload(header + b"\x00" * (2 * 1024 * 1024))
            with self.assertRaises(FileTooLargeError):
                await service.create_blog_category({}, oversized)
            self.assertEqual(store.await_count, 1)

    async def test_failed_update_removes_only_new_upload(self) -> None:
        service = BlogCategoryService()
        service.repo.get_blog_category = AsyncMock(
            return_value=BlogCategory(image="uploads/blog_categories/old.png")
        )
        service.repo.update_blog_category = AsyncMock(side_effect=NotFoundError("missing"))
        with (
            patch.object(
                UploadedFile, "store", new_callable=AsyncMock, return_value="new.png"
            ),
            patch("app.services.admin.blog_image_uploads.Storage.disk") as disk,
        ):
            disk.return_value.delete = AsyncMock(return_value=True)
            with self.assertRaises(NotFoundError):
                await service.update_blog_category(99, {}, self.png())
            disk.assert_called_once_with("public")
            disk.return_value.delete.assert_awaited_once_with("new.png")

    async def test_replacing_category_image_deletes_old_file_after_update(self) -> None:
        service = BlogCategoryService()
        old_path = "uploads/blog_categories/old.png"
        service.repo.get_blog_category = AsyncMock(return_value=BlogCategory(image=old_path))
        service.repo.update_blog_category = AsyncMock(return_value="updated")
        with (
            patch.object(
                UploadedFile, "store", new_callable=AsyncMock,
                return_value="uploads/blog_categories/new.png",
            ),
            patch("app.services.admin.blog_image_uploads.Storage.disk") as disk,
        ):
            async def delete(path: str) -> bool:
                service.repo.update_blog_category.assert_awaited_once()
                self.assertEqual(path, old_path)
                return True

            disk.return_value.delete = AsyncMock(side_effect=delete)
            self.assertEqual(await service.update_blog_category(7, {}, self.png()), "updated")
            disk.return_value.delete.assert_awaited_once_with(old_path)

    async def test_replacing_post_images_deletes_only_replaced_files(self) -> None:
        service = BlogPostService()
        old_thumb = "uploads/blog_posts/thumbnails/old.png"
        old_image = "uploads/blog_posts/old.png"
        service.repo.get_blog_post = AsyncMock(
            return_value=BlogPost(thumbnail=old_thumb, image=old_image)
        )
        service.repo.update_blog_post = AsyncMock(return_value="updated")
        with (
            patch.object(
                UploadedFile, "store", new_callable=AsyncMock,
                return_value="uploads/blog_posts/new.png",
            ),
            patch("app.services.admin.blog_image_uploads.Storage.disk") as disk,
        ):
            disk.return_value.delete = AsyncMock(return_value=True)
            await service.update_blog_post(7, {}, image=self.png())
            disk.return_value.delete.assert_awaited_once_with(old_image)
            disk.return_value.delete.reset_mock()
            await service.update_blog_post(7, {"thumbnail": "uploads/blog_posts/thumbnails/new.png"})
            disk.return_value.delete.assert_awaited_once_with(old_thumb)
            disk.return_value.delete.reset_mock()
            await service.update_blog_post(7, {"thumbnail": old_thumb})
            disk.return_value.delete.assert_not_awaited()

    async def test_post_keeps_a_file_still_used_by_another_image_field(self) -> None:
        service = BlogPostService()
        old = "uploads/blog_posts/shared.png"
        service.repo.get_blog_post = AsyncMock(
            return_value=BlogPost(thumbnail=old, image=old)
        )
        service.repo.update_blog_post = AsyncMock(return_value="updated")
        with patch("app.services.admin.blog_image_uploads.Storage.disk") as disk:
            await service.update_blog_post(7, {"image": "uploads/blog_posts/new.png"})
            disk.assert_not_called()

    async def test_cleanup_error_reports_saved_update_without_deleting_new_image(self) -> None:
        service = BlogCategoryService()
        old = "uploads/blog_categories/old.png"
        service.repo.get_blog_category = AsyncMock(return_value=BlogCategory(image=old))
        service.repo.update_blog_category = AsyncMock(return_value="updated")
        with (
            patch.object(
                UploadedFile, "store", new_callable=AsyncMock,
                return_value="uploads/blog_categories/new.png",
            ),
            patch("app.services.admin.blog_image_uploads.Storage.disk") as disk,
        ):
            disk.return_value.delete = AsyncMock(side_effect=OSError("disk failed"))
            with self.assertLogs("app.services.admin.blog_image_uploads", level="ERROR"):
                with self.assertRaisesRegex(RuntimeError, "update succeeded"):
                    await service.update_blog_category(7, {}, self.png())
            disk.return_value.delete.assert_awaited_once_with(old)

    async def test_external_image_is_not_deleted_from_public_disk(self) -> None:
        service = BlogCategoryService()
        service.repo.get_blog_category = AsyncMock(
            return_value=BlogCategory(image="https://example.com/image.png")
        )
        service.repo.update_blog_category = AsyncMock(return_value="updated")
        with patch("app.services.admin.blog_image_uploads.Storage.disk") as disk:
            with self.assertLogs("app.services.admin.blog_image_uploads", level="WARNING"):
                await service.update_blog_category(7, {"image": "uploads/blog_categories/new.png"})
            disk.assert_not_called()

    async def test_missing_old_file_does_not_fail_update(self) -> None:
        service = BlogCategoryService()
        service.repo.get_blog_category = AsyncMock(
            return_value=BlogCategory(image="uploads/blog_categories/missing.png")
        )
        service.repo.update_blog_category = AsyncMock(return_value="updated")
        with patch("app.services.admin.blog_image_uploads.Storage.disk") as disk:
            disk.return_value.delete = AsyncMock(return_value=False)
            disk.return_value.exists = AsyncMock(return_value=False)
            self.assertEqual(
                await service.update_blog_category(
                    7, {"image": "uploads/blog_categories/new.png"}
                ),
                "updated",
            )
            disk.return_value.exists.assert_awaited_once_with(
                "uploads/blog_categories/missing.png"
            )

    async def test_replacements_remove_real_stored_files(self) -> None:
        disk = Storage.disk("public")
        for kind, directory in (
            ("category", "uploads/blog_categories"),
            ("post", "uploads/blog_posts"),
        ):
            with self.subTest(kind=kind):
                old_path = await self.png().store(directory, disk="public")
                self.addAsyncCleanup(disk.delete, old_path)
                if kind == "category":
                    service = BlogCategoryService()
                    service.repo.get_blog_category = AsyncMock(
                        return_value=BlogCategory(image=old_path)
                    )
                else:
                    service = BlogPostService()
                    service.repo.get_blog_post = AsyncMock(
                        return_value=BlogPost(image=old_path, thumbnail=None)
                    )

                async def update(record_id: int, payload: dict) -> str:
                    self.assertTrue(await disk.exists(old_path))
                    self.addAsyncCleanup(disk.delete, payload["image"])
                    return payload["image"]

                if kind == "category":
                    service.repo.update_blog_category = AsyncMock(side_effect=update)
                    new_path = await service.update_blog_category(7, {}, image=self.png())
                else:
                    service.repo.update_blog_post = AsyncMock(side_effect=update)
                    new_path = await service.update_blog_post(7, {}, image=self.png())
                self.assertFalse(await disk.exists(old_path))
                self.assertTrue(await disk.exists(new_path))

    async def test_second_storage_failure_cleans_up_first_file(self) -> None:
        service = BlogPostService()
        service.repo.create_blog_post = AsyncMock()
        with (
            patch.object(
                UploadedFile,
                "store",
                new_callable=AsyncMock,
                side_effect=["thumbnail.png", OSError("storage failed")],
            ),
            patch("app.services.admin.blog_image_uploads.Storage.disk") as disk,
        ):
            disk.return_value.delete = AsyncMock(return_value=True)
            with self.assertRaisesRegex(OSError, "storage failed"):
                await service.create_blog_post({}, thumbnail=self.png(), image=self.png())
            disk.return_value.delete.assert_awaited_once_with("thumbnail.png")
        service.repo.create_blog_post.assert_not_awaited()

    async def test_multipart_files_are_read_separately_from_validated_fields(self) -> None:
        request = Request(
            {
                "method": "POST",
                "path": "/",
                "headers": [(b"content-type", b"multipart/form-data; boundary=test")],
            },
            None,
        )
        for request_class, fields in (
            (BlogCategoryCreateRequest, ("image",)),
            (BlogPostCreateRequest, ("thumbnail", "image")),
            (BlogPostUpdateRequest, ("thumbnail", "image")),
        ):
            with self.subTest(request=request_class.__name__):
                rules = request_class(request=request).rules()
                for field in fields:
                    self.assertNotIn(field, rules)

        _, rules, messages = BlogPostCreateRequest.prepare_validation(request=request)
        with (
            patch.object(ExistsRule, "validate", new_callable=AsyncMock, return_value=True),
            patch.object(UniqueRule, "validate", new_callable=AsyncMock, return_value=True),
        ):
            result = await validate(
                {
                    "title": "Post",
                    "slug": "post",
                    "blog_category_id": 1,
                    "author_id": 1,
                    "excerpt": "Summary",
                    "content": "Content",
                    "thumbnail": self.png(),
                    "image": self.png(),
                },
                rules,
                messages=messages,
            )
        self.assertTrue(result.is_valid, result.errors)
        self.assertNotIn("thumbnail", result.validated_data)
        self.assertNotIn("image", result.validated_data)

        result = await validate(
            {"thumbnail": ""},
            {"thumbnail": BlogPostUpdateRequest().rules()["thumbnail"]},
        )
        self.assertIn("thumbnail", result.errors)
