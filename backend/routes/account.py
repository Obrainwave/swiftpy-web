from __future__ import annotations

from swiftpy.auth import JWTGuard, auth
from swiftpy.http.request import Request
from swiftpy.http.response import Response
from swiftpy.http.router import Router
from app.helpers.helpers import success

router = Router(prefix="/v1/account", middleware=[JWTGuard])


@router.post("/logout")
async def logout(request: Request) -> Response:
    # Revokes all active access & refresh tokens issued before now for the current user
    await auth().logout_all()
    return success("Successfully logged out", None)


@router.get("/profile")
async def profile() -> Response:
    user = auth().user()

    return success("Profile fetched successfully", user)
    
