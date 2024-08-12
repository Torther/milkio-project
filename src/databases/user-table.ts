import { sql } from "drizzle-orm";
import { datetime, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const userTable = mysqlTable("user", {
	uid: int("uid", { unsigned: true }).autoincrement().primaryKey().notNull(),
	username: varchar("username", { length: 32 }).unique().notNull(),
	password: varchar("password", { length: 64 }),
	email: varchar("email", { length: 200 }).unique().notNull(),
	url: varchar("url", { length: 200 }),
	screenName: varchar("screenName", { length: 32 }),
	created: datetime("created").default(sql`CURRENT_TIMESTAMP`),
	activated: datetime("activated"),
	logged: datetime("logged"),
	group: varchar("group", { length: 16 }),
	authCode: varchar("authCode", { length: 40 }),
});
