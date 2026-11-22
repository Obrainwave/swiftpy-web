from typing import Any

from swiftpy import Response, json_response


def success(message: str | None = "Entity fetched successfully", data: Any = {}) -> Response:
    return json_response({
        "status": True,
        "message": message,
        "data": data
    })