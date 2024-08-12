import { drizzle } from "drizzle-orm/mysql2";
import { defineUse } from "milkio";
import mysql from "mysql2/promise";
// @ts-ignore
import * as schema from "../../generated/database-schema";
import { configDrizzle } from "../config/drizzle";

export const useDrizzle = defineUse(async () => {
	const connection = await mysql.createConnection({
		host: configDrizzle.dbHost,
		port: configDrizzle.dbPort,
		user: configDrizzle.dbUsername,
		password: configDrizzle.dbPassword,
		database: configDrizzle.dbDatabase,
	});
	return drizzle(connection, { schema, mode: "default" });
});
