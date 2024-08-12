import { int, mysqlTable, primaryKey, text, varchar } from "drizzle-orm/mysql-core";

export const optionsTable = mysqlTable(
	"options",
	{
		name: varchar("name", { length: 32 }).notNull(),
		user: int("user", { unsigned: true }).default(0).notNull(),
		value: text("value"),
	},
	(table) => {
		return {
			primaryKey: primaryKey({ columns: [table.name, table.user] }),
		};
	},
);
