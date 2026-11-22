from __future__ import annotations

from typing import Any

from swiftpy.validation.form_request import FormRequest


class LoginRequest(FormRequest):
    """LoginRequest validation request."""

    def rules(self) -> dict[str, Any]:
        """Define validation rules for the incoming request."""
        return {
            "email": "required|email",
            "password": "required|string",
        }
        
class RefreshRequest(FormRequest):

    def rules(self) -> dict[str, Any]:
        """Define validation rules for the incoming request."""
        return {
            "refresh_token": "required|str",
        }
