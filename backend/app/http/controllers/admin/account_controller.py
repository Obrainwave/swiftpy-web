from __future__ import annotations

from swiftpy.auth import auth
from swiftpy.http.request import Request
from swiftpy.http.response import Response

from app.services.admin.account_service import AccountService
from app.helpers.helpers import success


class AccountController:

    def __init__(self):
        self.service = AccountService()

    async def profile(self, request: Request) -> Response:
        admin = auth().user()
        
        return success("Admin profile fetched successfully", admin)
