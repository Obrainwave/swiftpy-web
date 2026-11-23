from __future__ import annotations

from swiftpy import Request
from swiftpy.auth import JWTGuard
from swiftpy.http.exceptions import HttpException
from swiftpy.http.response import Response
from swiftpy.http.router import RouteGroup, Router

from app.services.admin.doc_version_service import DocVersionService
from app.services.admin.doc_group_service import DocGroupService
from app.http.handler.exceptions import ServerInternalException
from app.http.requests.admin.doc_request import (
    DocGroupCreateRequest,
    DocGroupUpdateRequest,
    DocCreateRequest,
    DocUpdateRequest,
    DocVersionCreateRequest,
    DocVersionUpdateRequest,
)
from app.services.admin.doc_service import DocService
from app.http.middleware.admin_middleware import AdminMiddleware
from app.http.controllers.admin.account_controller import AccountController
from app.http.controllers.admin.blog_controller import BlogController
from app.helpers.helpers import success

router = Router(prefix="/v1/admin", middleware=[JWTGuard, AdminMiddleware])


router.get("/account/profile", AccountController.profile)


@router.group("/blog")
def register_blog_routes(group: RouteGroup) -> None:
    category_body_limit = 3 * 1024 * 1024
    post_body_limit = 5 * 1024 * 1024

    group.get("/categories", BlogController.categories)
    group.get("/categories/{category_id}", BlogController.get_category)
    group.post(
        "/categories/create",
        BlogController.create_category,
        max_body_size=category_body_limit,
        max_content_length=category_body_limit,
    )
    group.put(
        "/categories/{category_id}/update",
        BlogController.update_category,
        max_body_size=category_body_limit,
        max_content_length=category_body_limit,
    )
    group.delete("/categories/{category_id}/delete", BlogController.delete_category)

    group.get("/posts", BlogController.posts)
    group.get("/posts/{post_id}", BlogController.get_post)
    group.post(
        "/posts/create",
        BlogController.create_post,
        max_body_size=post_body_limit,
        max_content_length=post_body_limit,
    )
    group.put(
        "/posts/{post_id}/update",
        BlogController.update_post,
        max_body_size=post_body_limit,
        max_content_length=post_body_limit,
    )
    group.delete("/posts/{post_id}/delete", BlogController.delete_post)

    group.get("/comments", BlogController.comments)
    group.get("/comments/{comment_id}", BlogController.get_comment)
    group.post("/comments/create", BlogController.create_comment)
    group.put("/comments/{comment_id}/update", BlogController.update_comment)
    group.delete("/comments/{comment_id}/delete", BlogController.delete_comment)


@router.group("/docs")
def register_docs_routes(group: RouteGroup) -> None:
    @group.get("/versions")
    async def versions(service: DocVersionService) -> Response:
        versions = await service.get_doc_versions()

        return success("Documentation versions fetched successfully", versions)

    @group.get("/versions/{version_id}")
    async def get_version(service: DocVersionService, version_id: int) -> Response:
        version = await service.get_doc_version(version_id)

        return success("Documentation version fetched successfully", version)

    @group.post("/versions/create")
    async def create_version(
        service: DocVersionService, form: DocVersionCreateRequest
    ) -> Response:
        try:
            version = await service.create_doc_version(form.validated())

            return success("Documentation version created successfully", version)

        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while creating the documentation version: {str(e)}"
            )

    @group.put("/versions/{version_id}/update")
    async def update_version(
        version_id: int, service: DocVersionService, form: DocVersionUpdateRequest
    ) -> Response:
        try:
            version = await service.update_doc_version(version_id, form.validated())

            return success("Documentation version updated successfully", version)

        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while updating the documentation version: {str(e)}"
            )

    @group.delete("/versions/{version_id}/delete")
    async def delete_version(version_id: int, service: DocVersionService) -> Response:
        try:
            result = await service.delete_doc_version(version_id)

            return success("Documentation version deleted successfully", result)

        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while deleting the documentation version: {str(e)}"
            )

    @group.get("/groups")
    async def groups(service: DocGroupService) -> Response:
        groups = await service.get_doc_groups()

        return success("Documentation groups fetched successfully", groups)

    @group.get("/groups/{group_id}")
    async def get_group(service: DocGroupService, group_id: int) -> Response:
        group = await service.get_doc_group(group_id)

        return success("Documentation group fetched successfully", group)

    @group.post("/groups/create")
    async def create_group(
        request: Request, service: DocGroupService, form: DocGroupCreateRequest
    ) -> Response:
        
        try:
            image = await request.file("image")
            group = await service.create_doc_group(form.validated(), image)

            return success("Documentation group created successfully", group)

        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while creating the documentation group: {str(e)}"
            )

    @group.put("/groups/{group_id}/update")
    async def update_group(
        request: Request,
        group_id: int, 
        service: DocGroupService, 
        form: DocGroupUpdateRequest
    ) -> Response:
        
        try:
            image = await request.file('image')
            group = await service.update_doc_group(group_id, form.validated(), image)

            return success("Documentation group updated successfully", group)

        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while updating the documentation group: {str(e)}"
            )

    @group.delete("/groups/{group_id}/delete")
    async def delete_group(group_id: int, service: DocGroupService) -> Response:
        try:
            group = await service.delete_doc_group(group_id)
            return success("Documentation group deleted successfully", group)
        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while deleting the documentation group: {str(e)}"
            )

    @group.get("/contents")
    async def get_docs(service: DocService) -> Response:
        docs = await service.get_docs()

        return success("Documentation docs fetched successfully", docs)
    
    @group.get("/contents/{doc_id}")
    async def get_doc(doc_id: int, service: DocService):
        doc = await service.get_doc(doc_id)
        
        return success("Documentation content fetched successfully", doc)

    @group.post("/contents/create")
    async def create_doc(service: DocService, form: DocCreateRequest) -> Response:
        try:
            doc = await service.create_doc(form.validated())

            return success("Documentation doc created successfully", doc)

        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while creating the documentation doc: {str(e)}"
            )

    @group.put("/contents/{doc_id}/update")
    async def update_doc(
        doc_id: int, service: DocService, form: DocUpdateRequest
    ) -> Response:
        try:
            doc = await service.update_doc(doc_id, form.validated())

            return success("Documentation doc updated successfully", doc)

        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while updating the documentation doc: {str(e)}"
            )
            
    @group.delete("/contents/{doc_id}/delete")
    async def delete_doc(doc_id: int, service: DocService) -> Response:
        try:
            result = await service.delete_doc(doc_id)

            return success("Documentation doc deleted successfully", result)

        except HttpException as e:
            raise ServerInternalException(
                f"An error occurred while deleting the documentation doc: {str(e)}"
            )
