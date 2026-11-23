from __future__ import annotations

from swiftpy.validation.form_request import FormRequest


def _without_multipart_uploads(
    form: FormRequest, rules: dict[str, str], *fields: str
) -> dict[str, str]:
    # Multipart files are read separately with Request.file() by the controller.
    if form.request is not None:
        content_type = form.request.headers.get("content-type", "")
        if content_type.split(";", 1)[0].strip().lower() == "multipart/form-data":
            return {field: rule for field, rule in rules.items() if field not in fields}
    return rules


class BlogCategoryCreateRequest(FormRequest):
    """Validate a new blog category."""

    def rules(self) -> dict[str, str]:
        return _without_multipart_uploads(self, {
            "name": "required|bail|str|max:255|unique:blog_categories,name",
            "slug": "required|bail|str|max:255|unique:blog_categories,slug",
            "description": "nullable|str",
            "parent_id": "nullable|bail|int|min:1|exists:blog_categories,id",
            "sort_order": "int|min:0",
            "image": "nullable|str|max:255",
            "is_active": "bool",
        }, "image")


class BlogCategoryUpdateRequest(FormRequest):
    """Validate a full update; the database enforces name and slug uniqueness."""

    def rules(self) -> dict[str, str]:
        return _without_multipart_uploads(self, {
            "name": "required|str|max:255",
            "slug": "required|str|max:255",
            "description": "nullable|str",
            "parent_id": "nullable|bail|int|min:1|exists:blog_categories,id",
            "sort_order": "int|min:0",
            "image": "nullable|str|max:255",
            "is_active": "bool",
        }, "image")


class BlogPostCreateRequest(FormRequest):
    """Validate a new blog post."""

    def rules(self) -> dict[str, str]:
        return _without_multipart_uploads(self, {
            "title": "required|bail|str|max:255|unique:blog_posts,title",
            "slug": "required|bail|str|max:255|unique:blog_posts,slug",
            "blog_category_id": "required|bail|int|min:1|exists:blog_categories,id",
            "author_id": "required|bail|int|min:1|exists:users,id",
            "excerpt": "required|str|max:255",
            "content": "required|str",
            "sort_order": "int|min:0",
            "tags": "nullable|str|max:255",
            "canonical_url": "nullable|url|max:255",
            "meta_title": "nullable|str|max:255",
            "meta_description": "nullable|str",
            "thumbnail": "required|str|max:255",
            "image": "nullable|str|max:255",
            "status": "str|in:draft,published,archived",
        }, "thumbnail", "image")


class BlogPostUpdateRequest(FormRequest):
    """Validate a full update; the database enforces title and slug uniqueness."""

    def rules(self) -> dict[str, str]:
        return _without_multipart_uploads(self, {
            "title": "required|str|max:255",
            "slug": "required|str|max:255",
            "blog_category_id": "required|bail|int|min:1|exists:blog_categories,id",
            "author_id": "required|bail|int|min:1|exists:users,id",
            "excerpt": "required|str|max:255",
            "content": "required|str",
            "sort_order": "int|min:0",
            "tags": "nullable|str|max:255",
            "canonical_url": "nullable|url|max:255",
            "meta_title": "nullable|str|max:255",
            "meta_description": "nullable|str",
            "thumbnail": "str|min:1|max:255",
            "image": "nullable|str|max:255",
            "status": "str|in:draft,published,archived",
        }, "thumbnail", "image")


class BlogCommentCreateRequest(FormRequest):
    """Validate a new blog comment."""

    def rules(self) -> dict[str, str]:
        return {
            "blog_post_id": "required|bail|int|min:1|exists:blog_posts,id",
            "user_id": "required|bail|int|min:1|exists:users,id",
            "comment": "required|str",
            "status": "bool",
        }


class BlogCommentUpdateRequest(FormRequest):
    """Validate a full blog comment update."""

    def rules(self) -> dict[str, str]:
        return {
            "blog_post_id": "required|bail|int|min:1|exists:blog_posts,id",
            "user_id": "required|bail|int|min:1|exists:users,id",
            "comment": "required|str",
            "status": "bool",
        }
