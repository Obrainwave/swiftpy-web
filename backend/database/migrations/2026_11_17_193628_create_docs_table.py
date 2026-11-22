from __future__ import annotations

from swiftpy.database.migrations import Blueprint, Migration, Schema


class CreateDocsTable(Migration):
    async def up(self) -> None:
        def define(table: Blueprint) -> None:
            table.id()
            table.string("title", length=255).unique()
            table.string("slug", length=255).unique()
            table.big_integer("doc_version_id").unsigned()
            table.big_integer("doc_group_id").unsigned()
            table.text("content")
            table.boolean("is_active").default(True)
            table.big_integer("created_by").unsigned().nullable()
            table.timestamps(tz=True)

            table.foreign_key(
                column="doc_version_id",
                references="id",
                on="doc_versions",
                on_delete="CASCADE",
            )
            table.foreign_key(
                column="doc_group_id",
                references="id",
                on="doc_groups",
                on_delete="CASCADE",
            )
            table.foreign_key(
                column="created_by",
                references="id",
                on="users",
                on_delete="SET NULL",
            )
            table.index(
                ["title", "doc_version_id", "doc_group_id", "is_active", "created_at"],
                name="idx_docs_active_created",
            )

        await Schema.create("docs", define)

    async def down(self) -> None:
        await Schema.drop_if_exists("docs")
