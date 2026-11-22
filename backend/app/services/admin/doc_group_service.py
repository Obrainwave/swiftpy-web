from __future__ import annotations

from swiftpy import NotFoundError, ValidationError
from swiftpy.auth import auth
from swiftpy.filesystem import UploadedFile

from app.repositories.admin.doc_group_repository import DocGroupRepository


class DocGroupService:
    """DocGroupService service."""

    def __init__(self) -> None:
            self.repo = DocGroupRepository()
        
    async def get_doc_group(self, group_id: int) -> dict[str, any]:
        """Get the doc group."""
        group = await self.repo.get_doc_group(group_id)
        
        return group
    
    async def get_doc_groups(self) -> dict[str, any]:
        """Get the doc groups."""
        groups = await self.repo.get_doc_groups()
        
        return groups
    
    async def create_doc_group(self, data: dict[str, any], image: UploadedFile | None = None) -> dict[str, any]:
        """Create a new doc group."""
        
        if image is not None:
            await image.validate(
            {
                "max_size": "2MB",
                "extensions": ["jpg", "jpeg", "png", "webp"],
            }
        )
            image_path = await image.store("uploads/doc_groups", disk="public")
            
        data['created_by'] = auth().user().id
        data['image'] = image_path if image is not None else None

        group = await self.repo.create_doc_group(data)
        
        return group

    async def update_doc_group(self, group_id: int, data: dict[str, any], image: UploadedFile | None = None) -> dict[str, any]:
        """Update an existing doc group."""
        
        group = await self.repo.get_doc_group(group_id)
        if not group:
            raise NotFoundError("Documentation group not found")
        
        if image is not None:
            await image.validate(
            {
                "max_size": "2MB",
                "extensions": ["jpg", "jpeg", "png", "webp"],
            }
        )
            image_path = await image.store("uploads/doc_groups", disk="public")
            data['image'] = image_path

        group = await self.repo.update_doc_group(group_id, data)
        
        return group
    
    async def delete_doc_group(self, group_id: int) -> bool:
        """Delete an existing doc group."""
        result = await self.repo.delete_doc_group(group_id)
        
        return result
