from __future__ import annotations

from typing import Any
from swiftpy import NotFoundError
from app.models.doc_version import DocVersion


class DocVersionRepository:
    """DocVersionRepository data access repository."""

    def __init__(self) -> None:
        self.model = DocVersion()

    async def get_doc_version(self, version_id: int) -> DocVersion | None:
        return await self.model.with_("groups").where("id", version_id).first()

    async def get_doc_versions(self) -> list[DocVersion]:
        return await self.model.with_("groups", "author").order_by("sort_order").get()

    async def create_doc_version(self, data: dict[str, Any]) -> DocVersion:
        return await self.model.create(data)

    async def update_doc_version(self, version_id: int, data: dict[str, Any]) -> DocVersion:
        
        version = await self.model.where("id", version_id).first()
        if not version:
            raise NotFoundError("Documentation version not found")

        version.version = data.version
        version.slug = data.slug
        version.description = data.description
        version.sort_order = data.sort_order if data.sort_order is not None else version.sort_order
        version.is_active = data.is_active
        await version.save()
        
        return version
    
    async def delete_doc_version(self, version_id: int) -> bool:
        version = await self.model.where("id", version_id).first()
        if not version:
            raise NotFoundError("Documentation version not found")

        await version.delete()
        return True
