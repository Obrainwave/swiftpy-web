from __future__ import annotations

from swiftpy.database.migrations import Blueprint, Migration, Schema


class CreateBlogCommentsTable(Migration):
    async def up(self) -> None:
        def define(table: Blueprint) -> None:
            table.id()
            table.integer("blog_post_id").unsigned().index()
            table.integer("user_id").unsigned().index()
            table.text("comment")
            table.boolean("status").default(False)
            table.timestamps(tz=True)
            
            table.foreign_key(
                column="blog_post_id",
                references="id",
                on="blog_posts",
                on_delete="CASCADE",
            )
            table.foreign_key(
                column="user_id",
                references="id",
                on="users",
                on_delete="CASCADE",
            )

        await Schema.create("blog_comments", define)

    async def down(self) -> None:
        await Schema.drop_if_exists("blog_comments")
