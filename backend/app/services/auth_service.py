from __future__ import annotations

from typing import Any

from swiftpy import Request, Response, verify_password_async
from app.repositories.user_repository import UserRepository
from swiftpy.auth import AuthenticationError, JWTIssuer, TokenBlacklist, require_jwt


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
        )
        return {
            **tokens,
            "user": user.to_dict(),  # omits "password" via User.__hidden__
        }
        
    async def logout(self, request: Request) -> Response:
        payload = await require_jwt(request, issuer=self.jwt, token_type="access")
        jti = payload.get("jti")
        if jti is None:
            raise AuthenticationError("Invalid token: missing JTI claim.")
        # Add the JTI to the blacklist
        await TokenBlacklist.add(jti)
        return {"message": "Successfully logged out."}
