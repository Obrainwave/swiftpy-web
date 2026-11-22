from __future__ import annotations

from swiftpy.database.migrations import Blueprint, Migration, Schema


class CreateBlogCategoriesTable(Migration):
    async def up(self) -> None:
        def define(table: Blueprint) -> None:
            table.id()
            table.string("name", 255).unique()
            table.string("slug", 255).unique()
            table.text("description").nullable()
            table.integer("parent_id").unsigned().nullable()
            table.integer("sort_order").default(0)
            table.string("image", 255).nullable()
            table.boolean("is_active").default(True)
            table.timestamps()
            
            table.foreign_key(
                column="parent_id",
                references="id",
                on="blog_categories",
                on_delete="CASCADE",
            )
            
            table.index(
                ["name", "slug", "parent_id", "is_active", "created_at"],
                name="idx_blog_categories_active_created",
            )

        await Schema.create("blog_categories", define)

    async def down(self) -> None:
        await Schema.drop_if_exists("blog_categories")
