import { envToNumber, envToString } from "milkio";
import { env } from "node:process";

export const configDrizzle = {
	dbHost: envToString(env.DB_HOST, "127.0.0.1"),
	dbPort: envToNumber(env.DB_PORT, 3306),
	dbUsername: envToString(env.DB_USERNAME, "milkio"),
	dbPassword: envToString(env.DB_PASSWORD, "milkio"),
	dbDatabase: envToString(env.DB_DATABASE, "milkio"),
};
