import bcrypt from "bcryptjs";
import { defineApi, defineApiTest, reject } from "milkio";
import { useDrizzle } from "../../uses/drizzle";
import { useJwt } from "../../uses/jwt";

/**
 * ## 用户登录接口
 *
 * ### 接口描述
 * 用于用户登录，通过提供用户名和密码，获取访问令牌和刷新令牌。
 *
 * ### 请求URL
 * ```POST /api/user/login```
 *
 * ### 请求参数
 * | 参数名 | 类型 | 是否必填 | 描述 |
 * | --- | --- | --- | --- |
 * | email | string | 否* | 用户邮箱 |
 * | username | string | 否* | 用户名 |
 * | password | string | 是 | 用户密码 |
 *
 * ### 响应内容
 *
 * #### 成功响应
 * | 参数名 | 类型 | 描述 |
 * | --- | --- | --- |
 * | executeId | string | 执行ID，用于追踪请求 |
 * | success | boolean | 是否成功 |
 * | data | object | 返回数据 |
 * | data.accessToken | string | 访问令牌 |
 * | data.refreshToken | string | 刷新令牌 |
 *
 * ### 可能的错误
 * | 错误码 | 描述 |
 * | --- | --- |
 * | BUSINESS_FAIL | 用户名或密码错误 |
 */
export const api = defineApi({
	meta: {
		allowWithoutLogin: true,
	},
	async action(
		params: {
			email?: string;
			username?: string;
			password: string;
		},
		context,
	) {
		// 检查是否提供了用户名或邮箱
		if (!params.username && !params.email) {
			throw reject("BUSINESS_FAIL", "用户名或密码错误");
		}

		// 查询用户信息
		const user = await (await useDrizzle()).query.userTable.findFirst({
			where: (table, query) => (params.username ? query.eq(table.username, params.username as string) : query.eq(table.email, params.email as string)),
		});

		// 验证用户是否存在及密码是否正确
		if (!user || !bcrypt.compareSync(params.password, user.password as string)) {
			throw reject("BUSINESS_FAIL", "用户名或密码错误");
		}

		// 返回令牌
		return {
			accessToken: (await useJwt()).getAccessToken({ uid: user.uid }),
			refreshToken: (await useJwt()).getRefreshToken({ uid: user.uid }),
		};
	},
});

export const test = defineApiTest(api, [
	{
		name: "用户名登录",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Milkio",
					password: "123456",
				},
			});
			if (!success) throw test.reject();
		},
	},
	{
		name: "邮箱登录",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					email: "i@mol.ink",
					password: "123456",
				},
			});
			if (!success) throw test.reject();
		},
	},
	{
		name: "同时提供用户名和邮箱",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Milkio",
					email: "i@mol.ink",
					password: "123456",
				},
			});
			if (!success) throw test.reject();
		},
	},
	{
		name: "未提供用户名和邮箱",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					password: "123456",
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "无效用户名或邮箱",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "oikliM",
					password: "123456",
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "无效密码",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "Milkio",
					password: "654321",
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "非法输入",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "' OR 1=1 --",
					password: "123456",
				},
			});
			if (success) throw test.reject();
		},
	},
	{
		name: "空字符串输入",
		handler: async (test) => {
			const { success } = await test.client.execute({
				params: {
					username: "",
					password: "",
				},
			});
			if (success) throw test.reject();
		},
	},
]);
