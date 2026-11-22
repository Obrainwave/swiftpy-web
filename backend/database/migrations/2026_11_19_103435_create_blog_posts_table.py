from __future__ import annotations

from swiftpy.database.migrations import Blueprint, Migration, Schema


class CreateBlogPostsTable(Migration):
    async def up(self) -> None:
        def define(table: Blueprint) -> None:
            table.id()
            table.string("title", 255).unique().index()
            table.string("slug", 255).unique().index()
            table.integer("blog_category_id").unsigned().index()
            table.integer("author_id").unsigned().index()
            table.string("excerpt", 255)
            table.text("content")
            table.integer("sort_order").default(0)
            table.string("tags").nullable().index()
            table.string("canonical_url", 255).nullable()
            table.string("meta_title", 255).nullable()
            table.text("meta_description").nullable()
            table.string("thumbnail", 255)
            table.string("image", 255).nullable()
            table.enum("status", ["draft", "published", "archived"]).default("draft")
            table.timestamps()

            table.foreign_key(
                column="blog_category_id",
                references="id",
                on="blog_categories",
                on_delete="CASCADE",
            )
            table.foreign_key(
                column="author_id",
                references="id",
                on="users",
                on_delete="CASCADE",
            )

        await Schema.create("blog_posts", define)

    async def down(self) -> None:
        await Schema.drop_if_exists("blog_posts")
