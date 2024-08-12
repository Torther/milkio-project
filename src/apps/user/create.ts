import bcrypt from "bcryptjs";
import { defineApi, defineApiTest, reject } from "milkio";
import type typia from "typia";
import { userTable } from "../../databases/user-table";
import { useDrizzle } from "../../uses/drizzle";
import { useJwt } from "../../uses/jwt";

/**
 * ## 用户创建接口
 *
 * ### 接口描述
 * 用于创建或注册新用户，通过提供用户名，密码，邮箱等信息，创建一个新的用户。
 *
 * ### 请求URL
 * ```POST /api/user/create```
 *
 * ### 请求参数
 * | 参数名 | 类型 | 是否必填 | 描述 |
 * | --- | --- | --- | --- |
 * | username | string | 是 | 用户名称，长度不超过32个字符 |
 * | password | string | 是 | 用户密码，长度不超过64个字符 |
 * | email | string | 是 | 用户邮箱，长度不超过200个字符，且必须符合邮箱格式 |
 * | url | string | 否 | 用户链接，长度不超过200个字符，且必须符合链接格式 |
 * | screenName | string | 否 | 用户昵称，长度不超过32个字符 |
 *
 * ### 响应内容
 *
 * #### 成功响应
 * | 参数名 | 类型 | 描述 |
 * | --- | --- | --- |
 * | executeId | string | 执行ID，用于追踪请求 |
 * | success | boolean | 是否成功 |
 * | data | undefiend | 返回数据 |
 *
 * ### 可能的错误
 * | 错误码 | 描述 |
 * | --- | --- |
 * | BUSINESS_FAIL | 用户名或邮箱已存在 |
 */
export const api = defineApi({
	meta: {},
	async action(
		params: {
			/** 用户名 */
			username: string & typia.tags.MinLength<3> & typia.tags.MaxLength<32>;
			/** 密码 */
			password: string & typia.tags.MinLength<5> & typia.tags.MaxLength<64>;
			/** 邮箱 */
			email: string & typia.tags.MaxLength<200> & typia.tags.Format<"email">;
			/** 网址 */
			url?: string & typia.tags.MaxLength<200> & typia.tags.Format<"url">;
			/** 昵称 */
			screenName?: string & typia.tags.MaxLength<32>;
		},
		context,
	) {
		const existingUsername = await (await useDrizzle()).query.userTable.findFirst({
			where: (table, query) => query.eq(table.username, params.username),
		});

		const existingEmail = await (await useDrizzle()).query.userTable.findFirst({
			where: (table, query) => query.eq(table.email, params.email),
		});

		if (existingUsername) throw reject("BUSINESS_FAIL", "用户名已存在");
		if (existingEmail) throw reject("BUSINESS_FAIL", "邮箱已存在");

		(await useDrizzle())
			.insert(userTable)
			.values({
				username: params.username,
				password: bcrypt.hashSync(params.password, 10),
				email: params.email,
				url: params.url || "",
				screenName: params.screenName || params.username,
			})
			.execute();
	},
});

export const test = defineApiTest(api, [
	{
		name: "成功注册",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Alice",
					password: "123456",
					email: "alice@example.com",
					url: "https://example.com",
					screenName: "Alice",
				},
				headers: {
					Authorization: (await useJwt()).getAccessToken({ uid: 1 }),
				},
			});
			if (!success) throw test.reject();
		},
	},
	{
		name: "用户名已存在",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Milkio",
					password: "123456",
					email: "milkio@example.com",
				},
				headers: {
					Authorization: (await useJwt()).getAccessToken({ uid: 1 }),
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "邮箱已存在",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Alice",
					password: "123456",
					email: "i@mol.ink",
				},
				headers: {
					Authorization: (await useJwt()).getAccessToken({ uid: 1 }),
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "用户名过短",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Al",
					password: "123456",
					email: "alice@example.com",
				},
				headers: {
					Authorization: (await useJwt()).getAccessToken({ uid: 1 }),
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "密码过短",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Alice",
					password: "123",
					email: "alice@example.com",
				},
				headers: {
					Authorization: (await useJwt()).getAccessToken({ uid: 1 }),
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "邮箱格式错误",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Alice",
					password: "123456",
					email: "alice#example[.]com",
				},
				headers: {
					Authorization: (await useJwt()).getAccessToken({ uid: 1 }),
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "网址格式错误",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Alice",
					password: "123456",
					email: "alice@example.com",
					url: "htp:/example",
				},
				headers: {
					Authorization: (await useJwt()).getAccessToken({ uid: 1 }),
				},
			});
			if (success) throw test.reject();
		},
	},
]);
