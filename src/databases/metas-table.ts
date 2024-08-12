import { index, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const metasTable = mysqlTable(
	"metas",
	{
		mid: int("mid", { unsigned: true }).autoincrement().primaryKey().notNull(),
		name: varchar("name", { length: 200 }),
		slug: varchar("slug", { length: 200 }),
		type: varchar("type", { length: 32 }),
		description: varchar("description", { length: 200 }),
		count: int("count", { unsigned: true }),
		order: int("order", { unsigned: true }),
	},
	(table) => {
		return {
			slugX: index("slugX").on(table.slug),
		};
	},
);
