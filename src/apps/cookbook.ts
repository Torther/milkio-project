import { defineApi, reject } from "milkio";
import { join } from "node:path";
import { cwd } from "node:process";

export const api = defineApi({
	meta: {
		allowWithoutLogin: true,
	},
	async action(params: string, context) {
		const password = "Pa$$w0rd!";
		if (params !== password) throw reject("BUSINESS_FAIL", "Only with the correct parameters can Cookbook be accessed");
		return Bun.file(join(cwd(), "generated", "cookbook.json")).json();
	},
});
