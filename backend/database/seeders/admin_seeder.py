from __future__ import annotations

from swiftpy.database import Query, Seeder
from swiftpy import hash_password


class AdminSeeder(Seeder):
    """
    Database seeder for generating and seeding records.
    """

    async def run(self) -> None:
        await Query.table("users").upsert(
            [
                {
                    "name": "Super Admin",
                    "email": "super@swiftpy.net",
                    "password": hash_password("Secret123!"),
                    "username": "superadmin",
                    "phone": "08029022087",
                    "is_admin": True,
                }
            ],
            unique_by="email",
            update_columns=["name", "is_admin", "password", "username", "phone"],
        )
