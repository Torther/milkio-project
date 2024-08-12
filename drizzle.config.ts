import type { Config } from "drizzle-kit";
import { env } from "node:process";

const drizzleConfig: Config = {
	schema: "./generated/database-schema.ts",
	out: "./drizzle",
	dialect: "mysql", // "postgresql" | "mysql"
	dbCredentials: {
		host: env.DB_HOST ?? "your-default-database-url",
		port: Number(env.DB_PORT) ?? 3306,
		user: env.DB_USERNAME ?? "your-default-username",
		password: env.DB_PASSWORD ?? "your-default-password",
		database: env.DB_DATABASE ?? "your-default-database",
	},
};

export default drizzleConfig;
