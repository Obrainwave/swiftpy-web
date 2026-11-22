from __future__ import annotations

from swiftpy import NotFoundError
from swiftpy.auth import auth
from app.repositories.admin.doc_group_repository import DocGroupRepository
from app.repositories.admin.doc_repository import DocRepository
from app.repositories.admin.doc_version_repository import DocVersionRepository


class DocVersionService:
    """DocVersionService service."""

    def __init__(self) -> None:
        self.version = DocVersionRepository()
        self.group = DocGroupRepository()
        self.doc = DocRepository()
        
    async def get_doc_version(self, version_id: int) -> dict[str, any]:
        """Get the doc version."""
        version = await self.version.get_doc_version(version_id)
        
        if not version:
            raise NotFoundError("DocVersion not found")
        
        return version
    
    async def get_doc_versions(self) -> dict[str, any]:
        """Get the doc version."""
        versions = await self.version.get_doc_versions()
        
        return versions
    
    async def create_doc_version(self, data: dict[str, any]) -> dict[str, any]:
        """Create a new doc version."""
        
        data["created_by"] = auth().user().id
        version = await self.version.create_doc_version(data)
        
        return version
    
    async def update_doc_version(self, version_id: int, data: dict[str, any]) -> dict[str, any]:
        """Update an existing doc version."""
        version = await self.version.get_doc_version(version_id)
        if not version:
            raise NotFoundError("DocVersion not found")

        version = await self.version.update_doc_version(version_id, data)
        
        return version
    
    async def delete_doc_version(self, version_id: int) -> bool:
        """Delete an existing doc version."""
        result = await self.version.delete_doc_version(version_id)
        
        return result
