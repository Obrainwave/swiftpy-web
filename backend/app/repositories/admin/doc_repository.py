from __future__ import annotations

from typing import Any

from swiftpy import NotFoundError

from app.models.doc import Doc


class DocRepository:
    """DocRepository data access repository."""

    def __init__(self) -> None:
        self.model = Doc()
        
    async def get_doc(self, doc_id: int) -> Doc | None:
        return await self.model.with_('group').where('id', doc_id).first()
    
    async def get_docs(self) -> list[Doc]:
        return await self.model.with_('author', 'version', 'group').order_by('sort_order').get()
    
    async def create_doc(self, data: dict[str, Any]) -> Doc:
        return await self.model.create(data)

    async def update_doc(self, doc_id: int, data: dict[str, Any]) -> Doc:
        doc = await self.model.where("id", doc_id).first()
        if not doc:
            raise NotFoundError("Documentation content not found")

        doc.title = data.title
        doc.slug = data.slug
        doc.doc_version_id = data.doc_version_id
        doc.doc_group_id = data.doc_group_id
        doc.content = data.content
        doc.is_active = data.is_active
        await doc.save()
        
        return doc
    
    async def delete_doc(self, doc_id: int) -> bool:
        doc = await self.model.where("id", doc_id).first()
        if not doc:
            raise NotFoundError("Documentation content not found")

        await doc.delete()
        return True