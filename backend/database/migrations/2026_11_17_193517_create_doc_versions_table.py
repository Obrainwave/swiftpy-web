from __future__ import annotations

from swiftpy.database.migrations import Blueprint, Migration, Schema


class CreateDocVersionsTable(Migration):
    async def up(self) -> None:
        def define(table: Blueprint) -> None:
            table.id()
            table.string("version", length=50).unique()
            table.string("slug", length=50).unique()
            table.text("description").nullable()
            table.boolean("is_active").default(True)
            table.big_integer("created_by").unsigned().nullable
            table.timestamps(tz=True)
            
            table.foreign_key(
                column="created_by",
                references="id",
                on="users",
                on_delete="SET NULL",
            )
            table.index(["is_active", "created_at"], name="idx_doc_versions_active_created")

        await Schema.create("doc_versions", define)

    async def down(self) -> None:
        await Schema.drop_if_exists("doc_versions")
