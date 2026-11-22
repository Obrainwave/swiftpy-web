from __future__ import annotations

from swiftpy import NotFoundError
from swiftpy.auth import auth
from app.repositories.admin.doc_repository import DocRepository
from app.repositories.admin.doc_group_repository import DocGroupRepository


class DocService:
    """DocService service."""

    def __init__(self) -> None:
            self.repo = DocRepository()
            self.group = DocGroupRepository()
        
    async def get_doc(self, doc_id: int) -> dict[str, any]:
        """Get the doc."""
        doc = await self.repo.get_doc(doc_id)
        
        return doc
    
    async def get_docs(self) -> dict[str, any]:
        """Get all docs."""
        docs = await self.repo.get_docs()
        
        return docs
    
    async def create_doc(self, data: dict[str, any]) -> dict[str, any]:
        """Create a new doc content."""
        group = await self.group.get_doc_group(data["doc_group_id"]) 
        
        data["created_by"] = auth().user().id   
        data["doc_version_id"] = group.doc_version_id
      
        group = await self.repo.create_doc(data)
        
        return group
    
    async def update_doc(self, doc_id: int, data: dict[str, any]) -> dict[str, any]:
        """Update an existing doc content."""
        doc = await self.repo.get_doc(doc_id)
        if not doc:
            raise NotFoundError("Documentation content not found")
        
        group = await self.group.get_doc_group(data.doc_group_id) 
        
        data['doc_version_id'] = group.doc_version_id
       
        doc = await self.repo.update_doc(doc_id, data)
        
        return doc
    
    async def delete_doc(self, doc_id: int) -> bool:
        """Delete an existing doc content."""
        result = await self.repo.delete_doc(doc_id)
        
        return result
