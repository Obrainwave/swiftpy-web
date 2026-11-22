from __future__ import annotations

from collections.abc import Mapping

from swiftpy.core.context import Context
from swiftpy.auth import auth
from swiftpy.core.exceptions import HttpException
from swiftpy.http.middleware import Handler, Middleware
from swiftpy.http.request import Request
from swiftpy.http.response import Response


class AdminMiddleware(Middleware):
    """
    Authorization ASGI middleware for administrative access control.

    Retrieves the authenticated user from task-isolated `Context` or `request.state`.
    Verifies that the user exists and carries boolean `is_admin is True`, raising
    HTTP 401 Unauthorized if unauthenticated, or HTTP 403 Forbidden if not an administrator.
    """

    async def handle(self, request: Request, next_handler: Handler) -> Response:
        if auth().check() is False:
            raise HttpException(
                status_code=401,
                message="Unauthenticated: Please authenticate first",
            )
            
        user = auth().user()
        
        if not user.is_admin:
            raise HttpException(
                status_code=403,
                message="Forbidden: Administrator access required",
            )

        return await next_handler(request)
