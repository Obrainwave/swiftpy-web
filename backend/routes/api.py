from __future__ import annotations

from swiftpy.http.request import Request
from swiftpy.http.response import Response, json_response
from swiftpy.http.router import RouteGroup, Router

from app.http.requests.auth_request import LoginRequest, RefreshRequest
from app.services.auth_service import AuthService
from app.helpers.helpers import success

router = Router(prefix="/v1/api")


@router.get("/health")
async def health_check(request: Request) -> Response:
    """Health check endpoint for container orchestrators and monitoring."""
    return json_response({"status": "ok", "app": "SwiftPY"})


@router.group("/auth")
def register_auth_routes(group: RouteGroup) -> None:
    @group.post("/login")
    async def login(payload: LoginRequest, service: AuthService) -> Response:
        data = await service.login(payload.email, payload.password)

        return success("Successfully logged in", data)

    @group.post("/refresh")
    async def refresh(payload: RefreshRequest, service: AuthService) -> Response:
        data = await service.refresh(payload.refresh_token)

        return success("Successfully refreshed tokens", data)
