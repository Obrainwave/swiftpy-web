from __future__ import annotations

from swiftpy.http.request import Request
from swiftpy.http.response import Response, json_response


class ReleaseController:
    """
    HTTP Controller for handling request endpoints.

    Supports constructor dependency injection and direct route binding, e.g.:
    `router.get("/items", ReleaseController.index)`.
    """

    async def index(self, request: Request) -> Response:
        return json_response({"message": "Hello from ReleaseController"})
