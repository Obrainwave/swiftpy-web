from __future__ import annotations

from typing import Any

from swiftpy.validation.form_request import FormRequest


class DocVersionCreateRequest(FormRequest):
    """DocVersionCreateRequest validation request."""

    def rules(self) -> dict[str, str]:
        return {
            "version": "required|str|unique:doc_versions,version|min:5",
            "slug": "nullable|str|unique:doc_versions,slug",
            "sort_order": "nullable|int|min:0",
            "description": "nullable|str",
            "is_active": "nullable|bool",
        }

    def messages(self) -> dict[str, str]:
        return {
            "version.min": "Version must be at least 5 characters long.",
            "version.unique": "A document version with this name already exists.",
            "slug.unique": "A document version with this slug already exists.",
        }
        

class DocVersionUpdateRequest(FormRequest):
    """DocVersionUpdateRequest validation request."""

    def rules(self) -> dict[str, str]:
        return {
            "version": "required|str|unique:doc_versions,version,ci|min:5",
            "slug": "nullable|unique:doc_versions,slug,ci|str",
            "sort_order": "nullable|int|min:0",
            "description": "nullable|str",
            "is_active": "nullable|bool",
        }

    def messages(self) -> dict[str, str]:
        return {
            "version.min": "Version must be at least 5 characters long.",
        }
        
        
class DocGroupCreateRequest(FormRequest):
    """DocGroupCreateRequest validation request."""

    def rules(self) -> dict[str, str]:
        return {
            "name": "required|str|unique:doc_groups,name|min:3",
            "doc_version_id": "required|int|exists:doc_versions,id",
            "parent_id": "nullable|int|exists:doc_groups,id",
            "description": "nullable|str",
            "slug": "nullable|str|unique:doc_groups,slug",
            "sort_order": "nullable|int|min:0",
            "example_link": "nullable|url",
            "is_active": "nullable|bool",
        }

    def messages(self) -> dict[str, str]:
        return {
            "name.min": "Name must be at least 3 characters long.",
            "name.unique": "A document group with this name already exists.",
            "slug.unique": "A document group with this slug already exists.",
        }
        
        
class DocGroupUpdateRequest(FormRequest):
    """DocGroupUpdateRequest validation request."""

    def rules(self) -> dict[str, str]:
        return {
            "name": "required|str|unique:doc_groups,name,ci|min:3",
            "doc_version_id": "required|int|exists:doc_versions,id",
            "parent_id": "nullable|int|exists:doc_groups,id",
            "description": "nullable|str",
            "slug": "nullable|unique:doc_groups,slug,ci|str",
            "sort_order": "nullable|int|min:0",
            "example_link": "nullable|url",
            "is_active": "nullable|bool",
        }

    def messages(self) -> dict[str, str]:
        return {
            "name.min": "Name must be at least 3 characters long.",
        }
        

class DocCreateRequest(FormRequest):
    """DocCreateRequest validation request."""

    def rules(self) -> dict[str, str]:
        return {
            "title": "required|str|unique:docs,title|min:5",
            "doc_group_id": "required|int|exists:doc_groups,id",
            "content": "required|str",
            "slug": "nullable|str|unique:docs,slug",
            "is_active": "nullable|bool",}

    def messages(self) -> dict[str, str]:
        return {
            "title.min": "Title must be at least 5 characters long.",
            "title.unique": "A document with this title already exists.",
            "slug.unique": "A document with this slug already exists.",
        }
        
        
class DocUpdateRequest(FormRequest):
    """DocUpdateRequest validation request."""

    def rules(self) -> dict[str, str]:
        return {
            "title": "required|str|unique:docs,title,ci|min:5",
            "doc_group_id": "required|int|exists:doc_groups,id",
            "content": "required|str",
            "slug": "nullable|unique:docs,title,ci|str",
            "is_active": "nullable|bool",}

    def messages(self) -> dict[str, str]:
        return {
            "title.min": "Title must be at least 5 characters long.",
        }
        
