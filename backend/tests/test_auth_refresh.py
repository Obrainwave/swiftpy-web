from __future__ import annotations

from typing import Any

import pytest

from app.services.auth_service import AuthService


class FakeUser:
    id = 7
    email = "admin@example.test"
    is_admin = True

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "email": self.email,
            "is_admin": self.is_admin,
        }


class FakeUserRepository:
    async def find_by_id(self, user_id: int) -> FakeUser | None:
        return FakeUser() if user_id == 7 else None


class FakeJWTIssuer:
    def __init__(self) -> None:
        self.issued_claims: dict[str, Any] | None = None

    def decode_token(
        self,
        token: str,
        *,
        expected_type: str | None = None,
    ) -> dict[str, str]:
        assert token == "refresh-token"
        assert expected_type == "refresh"
        return {"sub": "7"}

    async def refresh_token_pair(
        self,
        refresh_token: str,
        *,
        claims: dict[str, Any],
        refresh_claims: dict[str, Any],
        rotate: bool,
    ) -> dict[str, str]:
        assert refresh_token == "refresh-token"
        assert claims["is_admin"] is True
        assert refresh_claims["is_admin"] is True
        assert rotate
        self.issued_claims = claims
        return {"access_token": "admin-access", "refresh_token": "rotated"}


@pytest.mark.asyncio
async def test_refresh_reissues_access_token_with_current_user_permissions() -> None:
    jwt = FakeJWTIssuer()
    service = AuthService(FakeUserRepository(), jwt)  # type: ignore[arg-type]

    result = await service.refresh("refresh-token")

    assert result["access_token"] == "admin-access"
    assert result["refresh_token"] == "rotated"
    assert result["user"]["is_admin"] is True
    assert jwt.issued_claims == {
        "email": "admin@example.test",
        "is_admin": True,
    }
