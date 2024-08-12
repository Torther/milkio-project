import { int, mysqlTable } from "drizzle-orm/mysql-core";

export const relationshipsTable = mysqlTable("relationships", {
	cid: int("cid", { unsigned: true }).primaryKey().notNull(),
	mid: int("mid", { unsigned: true }).primaryKey().notNull(),
});
