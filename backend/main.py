from __future__ import annotations

from app.http.handler.exceptions import register_exception_handlers
from routes.api import router as api_router
from routes.account import router as account_router
from routes.admin import router as admin_router
from swiftpy import (
    Application,
    Request,
    Response,
    json_response,
    CORS,
    CORSMiddleware,
    RequestId,
    SecurityHeaders,
)

app = Application().middleware([CORSMiddleware])
register_exception_handlers(app)
app.middleware([RequestId, SecurityHeaders, CORS])

app.include_router(api_router)
app.include_router(account_router)
app.include_router(admin_router)


@app.get("/")
async def home(request: Request) -> Response:
    return json_response(
        {
            "status": "ok",
            "message": "Hello from SwiftPY",
            "app": "SwiftPY",
            "name": request.query_params.get("name"),
        }
    )
