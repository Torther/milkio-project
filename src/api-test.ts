import { $ } from "bun";
// import { createClient } from "milkio-project-client";
import { createClient } from "client";
import { type Table, getTableName, sql } from "drizzle-orm";
import { useDrizzle } from "./uses/drizzle";

export default {
	client: () => createClient({ baseUrl: "http://localhost:9000/", memoryStorage: true }),
	async onBootstrap() {
		// ..
	},
	async onBefore() {
		const drizzle = await useDrizzle();
		const schema = await import("../generated/database-schema");
		// 寻找出所有的表
		const tables: Array<string> = [];
		for (const key in schema) "getSQL" in schema[key] && tables.push(getTableName(schema[key] as unknown as Table));
		// 将这些表全部删除
		for (const table of tables) await drizzle.execute(sql.raw(`DROP TABLE IF EXISTS ${table};`));
		// 使用 drizzle-kit 重新创建这些表
		await $`bun x drizzle-kit push`;

		// 创建默认用户
		await drizzle.insert(schema.userTable).values({ username: "Milkio", password: "$2a$10$lnYiSorgOGUHGmbUkR1Wp.93u6SGZFWB38ORJKOwwAOXjllQZ.lKq", email: "i@mol.ink", url: "https://mol.ink", screenName: "Milkio" }).execute();

		return {
			// The content returned here will be mixed into the test object
		};
	},
};
