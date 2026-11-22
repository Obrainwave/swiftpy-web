from __future__ import annotations

from typing import Any

from swiftpy import NotFoundError

from app.models.doc_group import DocGroup


class DocGroupRepository:
    """DocGroupRepository data access repository."""

    def __init__(self) -> None:
        self.model = DocGroup()
        
    async def get_doc_group(self, group_id: int) -> DocGroup | None:
        return await self.model.with_('docs').where('id', group_id).first()
    
    async def get_doc_groups(self) -> list[DocGroup]:
        return await self.model.with_('author', 'docs').order_by('sort_order').get()
    
    async def create_doc_group(self, data: dict[str, Any]) -> DocGroup:
        return await self.model.create(data)

    async def update_doc_group(self, group_id: int, data: dict[str, Any]) -> DocGroup:
        
        group = await self.model.where("id", group_id).first()
        if not group:
            raise NotFoundError("Documentation group not found")
        
        if data.get('parent_id') is not None:
            parent_id = data.parent_id
        else:
            parent_id = group.parent_id

        group.name = data.name
        group.slug = data.slug
        group.doc_version_id = data.doc_version_id
        group.parent_id = parent_id
        group.description = data.description
        group.example_link = data.example_link
        group.image = data.image
        group.sort_order = data.get('sort_order') if data.sort_order is not None else group.sort_order
        group.is_active = data.is_active
        await group.save()
        
        return group
    
    async def delete_doc_group(self, group_id: int) -> bool:
        group = await self.model.where("id", group_id).first()
        if not group:
            raise NotFoundError("Documentation group not found")

        await group.delete()
        return True