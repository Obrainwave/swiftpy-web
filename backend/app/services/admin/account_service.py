from __future__ import annotations

from typing import Any

from app.repositories.admin.admin_repository import AdminRepository


class AccountService:
    """AccountService service."""

    def __init__(self) -> None:
        self.repository = AdminRepository()
        
    async def get_admin_profile(self, user_id: int) -> dict[str, Any]:
        """Fetch admin profile by user ID."""
        user = await self.repository.find_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        return user.to_dict()
