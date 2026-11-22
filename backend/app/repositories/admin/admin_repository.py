from __future__ import annotations

from typing import Any

from app.models.user import User


class AdminRepository:
    """AdminRepository data access repository."""

    async def find_by_id(self, user_id: int) -> User | None:
        """Find a single user by primary key ID."""
        return await User.find(user_id)

