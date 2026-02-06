import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ratings = sqliteTable("ratings", {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    rating: int("rating").notNull(),
    comment: text("comment"),
});