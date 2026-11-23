from __future__ import annotations

from typing import Any

from swiftpy import Request, Response, verify_password_async
from swiftpy import auth
from app.repositories.user_repository import UserRepository
from swiftpy.auth import (
    auth,
    AuthenticationError,
    JWTError,
    JWTIssuer,
    TokenBlacklist,
    require_jwt,
)


class AuthService:
    """Handles credential verification and JWT pair issuance."""

    def __init__(self, users: UserRepository, jwt: JWTIssuer) -> None:
        self.users = users
        self.jwt = jwt

    async def login(self, email: str, password: str) -> dict[str, Any]:
        normalized_email = email.strip().lower()
        user = await self.users.find_by_email(normalized_email)
        
        if not user:
            raise AuthenticationError("Incorrect email or password provided")

        stored_hash = user.password if user is not None else ""
        password_ok = await verify_password_async(password, stored_hash)

        if not password_ok:
            raise AuthenticationError("Invalid email or password.")

        tokens = self.jwt.issue_token_pair(
            subject=user.id,
            claims={
                "email": user.email,
                "is_admin": user.is_admin,
            },
            refresh_claims={
                "email": user.email,
                "is_admin": user.is_admin,
            },
        )
        return {
            **tokens,
            "user": user.to_dict(),  # omits "password" via User.__hidden__
        }

    async def refresh(self, refresh_token: str) -> dict[str, Any]:
        try:
            # user = auth().user()

            # user = await self.users.find_by_id(user.id())
            # if user is None:
            #     raise AuthenticationError("Invalid refresh token.")

            # current_claims = {
            #     "email": user.email,
            #     "is_admin": user.is_admin,
            # }
            # tokens = await self.jwt.refresh_token_pair(
            #     refresh_token,
            #     claims=current_claims,
            #     refresh_claims=current_claims,
            #     rotate=True,
            # )
            tokens = await JWTIssuer.refresh_token_pair(refresh_token=refresh_token, rotate=True)
    # return json_response(tokens)

            return {
                **tokens,
                # "user": user.to_dict(),
            }
        except JWTError as exc:
            raise AuthenticationError("Invalid or expired refresh token.") from exc
        
