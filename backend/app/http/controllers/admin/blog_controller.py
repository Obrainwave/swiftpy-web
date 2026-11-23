from __future__ import annotations

from swiftpy.http.request import Request
from swiftpy.http.response import Response

from app.helpers.helpers import success
from app.http.requests.admin.blog_request import (
    BlogCategoryCreateRequest,
    BlogCategoryUpdateRequest,
    BlogCommentCreateRequest,
    BlogCommentUpdateRequest,
    BlogPostCreateRequest,
    BlogPostUpdateRequest,
)
from app.services.admin.blog_category_service import BlogCategoryService
from app.services.admin.blog_comment_service import BlogCommentService
from app.services.admin.blog_post_service import BlogPostService


class BlogController:
    """Admin endpoints for blog categories, posts, and comments."""

    async def categories(self, service: BlogCategoryService) -> Response:
        categories = await service.get_blog_categories()
        return success("Blog categories fetched successfully", categories)

    async def get_category(self, category_id: int, service: BlogCategoryService) -> Response:
        category = await service.get_blog_category(category_id)
        return success("Blog category fetched successfully", category)

    async def create_category(
        self, request: Request, form: BlogCategoryCreateRequest, service: BlogCategoryService
    ) -> Response:
        category = await service.create_blog_category(
            form.validated(), image=await request.file("image")
        )
        return success("Blog category created successfully", category)

    async def update_category(
        self,
        category_id: int,
        request: Request,
        form: BlogCategoryUpdateRequest,
        service: BlogCategoryService,
    ) -> Response:
        category = await service.update_blog_category(
            category_id, form.validated(), image=await request.file("image")
        )
        return success("Blog category updated successfully", category)

    async def delete_category(self, category_id: int, service: BlogCategoryService) -> Response:
        result = await service.delete_blog_category(category_id)
        return success("Blog category deleted successfully", result)

    async def posts(self, service: BlogPostService) -> Response:
        return success("Blog posts fetched successfully", await service.get_blog_posts())

    async def get_post(self, post_id: int, service: BlogPostService) -> Response:
        return success("Blog post fetched successfully", await service.get_blog_post(post_id))

    async def create_post(
        self, request: Request, form: BlogPostCreateRequest, service: BlogPostService
    ) -> Response:
        post = await service.create_blog_post(
            form.validated(),
            thumbnail=await request.file("thumbnail"),
            image=await request.file("image"),
        )
        return success("Blog post created successfully", post)

    async def update_post(
        self,
        post_id: int,
        request: Request,
        form: BlogPostUpdateRequest,
        service: BlogPostService,
    ) -> Response:
        post = await service.update_blog_post(
            post_id,
            form.validated(),
            thumbnail=await request.file("thumbnail"),
            image=await request.file("image"),
        )
        return success("Blog post updated successfully", post)

    async def delete_post(self, post_id: int, service: BlogPostService) -> Response:
        result = await service.delete_blog_post(post_id)
        return success("Blog post deleted successfully", result)

    async def comments(self, service: BlogCommentService) -> Response:
        comments = await service.get_blog_comments()
        return success("Blog comments fetched successfully", comments)

    async def get_comment(self, comment_id: int, service: BlogCommentService) -> Response:
        comment = await service.get_blog_comment(comment_id)
        return success("Blog comment fetched successfully", comment)

    async def create_comment(
        self, form: BlogCommentCreateRequest, service: BlogCommentService
    ) -> Response:
        comment = await service.create_blog_comment(form.validated())
        return success("Blog comment created successfully", comment)

    async def update_comment(
        self, comment_id: int, form: BlogCommentUpdateRequest, service: BlogCommentService
    ) -> Response:
        comment = await service.update_blog_comment(comment_id, form.validated())
        return success("Blog comment updated successfully", comment)

    async def delete_comment(self, comment_id: int, service: BlogCommentService) -> Response:
        result = await service.delete_blog_comment(comment_id)
        return success("Blog comment deleted successfully", result)
