import { sql } from "drizzle-orm";
import { char, datetime, index, int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const contentsTable = mysqlTable(
	"contents",
	{
		cid: int("cid", { unsigned: true }).autoincrement().primaryKey().notNull(),
		title: varchar("title", { length: 200 }),
		slug: varchar("slug", { length: 200 }),
		created: datetime("created").default(sql`CURRENT_TIMESTAMP`),
		modified: datetime("modified").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
		text: text("text"),
		order: int("order", { unsigned: true }),
		authorId: int("authorId", { unsigned: true }),
		template: varchar("template", { length: 32 }),
		type: varchar("type", { length: 16 }),
		status: varchar("status", { length: 16 }),
		password: varchar("password", { length: 32 }),
		commentsNum: int("commentsNum", { unsigned: true }),
		allowComment: char("allowComment", { length: 1 }),
		allowPing: char("allowPing", { length: 1 }),
		allowFeed: char("allowFeed", { length: 1 }),
	},
	(table) => {
		return {
			slugX: index("slugX").on(table.slug),
			createdX: index("createdX").on(table.created),
			modifiedX: index("modifiedX").on(table.modified),
		};
	},
);
