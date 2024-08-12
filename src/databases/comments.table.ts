import { sql } from "drizzle-orm";
import { datetime, index, int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";
import { contentsTable } from "./contents-table";

export const commentsTable = mysqlTable(
	"comments",
	{
		coid: int("coid", { unsigned: true }).autoincrement().primaryKey().notNull(),
		cid: int("cid", { unsigned: true })
			.notNull()
			.references(() => contentsTable.cid),
		created: datetime("created").default(sql`CURRENT_TIMESTAMP`),
		author: varchar("author", { length: 200 }),
		authorId: int("authorId", { unsigned: true }),
		ownerId: int("ownerId", { unsigned: true }),
		mail: varchar("mail", { length: 200 }),
		url: varchar("url", { length: 200 }),
		ip: varchar("ip", { length: 64 }),
		agent: varchar("agent", { length: 200 }),
		text: text("text"),
		type: varchar("type", { length: 16 }),
		status: varchar("status", { length: 16 }),
		parent: int("parent"),
	},
	(table) => {
		return {
			cidX: index("cidX").on(table.cid),
		};
	},
);
