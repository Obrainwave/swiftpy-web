from __future__ import annotations

from datetime import datetime
from typing import ClassVar

from swiftpy.database.orm import Model


class User(Model):
    """
    Default User ORM model representing application accounts.
    Maps to the `users` database table.
    """

    __table__ = "users"
    __primary_key__ = "id"
    __fillable__ = [
        "name",
        "email",
        "username",
        "phone",
        "password",
        "is_admin",
        "address",
        "country",
    ]
    __hidden__ = ["password"]

    id: int
    name: str
    email: str
    username: str
    phone: str
    password: str
    is_admin: bool
    address: str
    country: str
    created_at: datetime
    updated_at: datetime
