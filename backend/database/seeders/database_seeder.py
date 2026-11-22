from __future__ import annotations

from swiftpy.database.seeder import Seeder

from database.seeders.admin_seeder import AdminSeeder


class DatabaseSeeder(Seeder):
    """
    Root database seeder.
    Run via `swiftpy db:seed`. Call additional seeders using `await self.call(...)`.
    """

    async def run(self) -> None:
        # Example:
        # await self.call(UserSeeder)
        await self.call(AdminSeeder)
        # pass
