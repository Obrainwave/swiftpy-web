from __future__ import annotations

from swiftpy.database.migrations import Blueprint, Migration, Schema


class AddSortOrderToDocVersionsTable(Migration):
    async def up(self) -> None:
        def define(table: Blueprint) -> None:
            table.integer("sort_order").default(0)

        await Schema.table("doc_versions", define)

        await Schema.table("doc_groups", define)
        
        await Schema.table("docs", define)
        
        

    async def down(self) -> None:
        def define(table: Blueprint) -> None:
            table.drop_column("sort_order")

        await Schema.table("doc_versions", define)
        
        await Schema.table("doc_groups", define)
        
        await Schema.table("docs", define)
