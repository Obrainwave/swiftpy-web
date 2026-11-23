from __future__ import annotations

from swiftpy.database.migrations import Blueprint, Migration, Schema


class CreateReleasesTable(Migration):
    async def up(self) -> None:
        def define(table: Blueprint) -> None:
            table.id()
            table.big_integer("doc_version_id").unsigned().index()
            table.big_integer("author_id").unsigned().index()
            table.text("content")
            table.datetime("released_at").nullable()
            table.enum("status", ["draft", "published", "archived"]).default("draft")
            table.timestamps()
            
            table.foreign_key(
                column="doc_version_id",
                references="id",
                on="doc_versions",
                on_delete="CASCADE",
            )
            table.foreign_key(
                column="author_id",
                references="id",
                on="users",
                on_delete="CASCADE",
            )

        await Schema.create("releases", define)

    async def down(self) -> None:
        await Schema.drop_if_exists("releases")
