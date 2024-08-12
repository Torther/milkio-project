import type { JwtPayload } from "jsonwebtoken";
import { defineApi, defineApiTest, reject } from "milkio";
import { useDrizzle } from "../../uses/drizzle";
import { useJwt } from "../../uses/jwt";
/**
 * ## 用户查询接口
 *
 * ### 接口描述
 * 用于查询用户的信息，通过提供用户ID，获取用户的用户名，昵称，邮箱，链接等信息。
 * 若未指定用户ID，则查询当前登录用户的信息。
 *
 * ### 请求URL
 * ```POST /api/user```
 *
 * ### 请求参数
 * | 参数名 | 类型 | 是否必填 | 描述 |
 * | --- | --- | --- | --- |
 * | uid | number | 否 | 用户ID |
 *
 * ### 请求头
 * | 参数名 | 类型 | 是否必填 | 描述 |
 * | --- | --- | --- | --- |
 * | Authorization | string | 否 | 访问令牌 |
 *
 * ### 响应内容
 * | 参数名 | 类型 | 描述 |
 * | --- | --- | --- |
 * | username | string | 用户名 |
 * | screenName | string | 昵称 |
 * | email | string | 邮箱 |
 * | url | string | 链接 |
 * | logged | boolean | 上次登录时间 |
 * | activated | boolean | 上次活动时间 |
 *
 * ### 可能的错误
 * | 错误码 | 描述 |
 * | --- | --- |
 * | NOT_FOUND | 用户不存在 |
 *
 */
export const api = defineApi({
	meta: {
		allowWithoutLogin: true,
	},
	async action(
		params: {
			uid?: number;
		},
		context,
	) {
		if (params.uid !== undefined) {
			const user = await (await useDrizzle()).query.userTable.findFirst({
				where: (table, query) => query.eq(table.uid, params.uid as number),
			});
			if (!user) throw reject("NOT_FOUND", undefined);
			return {
				username: user.username,
				screenName: user.screenName,
				email: user.email,
				url: user.url,
				logged: user.logged,
				activated: user.activated,
			};
		}
		const accessToken = context.headers.get("Authorization");
		if (accessToken) {
			const payload = (await useJwt()).verify(accessToken) as JwtPayload;
			const user = await (await useDrizzle()).query.userTable.findFirst({
				where: (table, query) => query.eq(table.uid, payload.uid as number),
			});
			if (!user) throw reject("NOT_FOUND", undefined);
			return {
				username: user.username,
				screenName: user.screenName,
				email: user.email,
				url: user.url,
				logged: user.logged,
				activated: user.activated,
			};
		}
		throw reject("NOT_FOUND", undefined);
	},
});

export const test = defineApiTest(api, [
	{
		name: "UID查询",
		handler: async (test) => {
			const result = await test.client.execute({
				params: {
					uid: 1,
				},
			});
			console.log(result);
			if (!result.success) throw test.reject();
		},
	},
	{
		name: "UID不存在",
		handler: async (test) => {
			const result = await test.client.execute({
				params: {
					uid: 0,
				},
			});
			console.log(result);
			if (result.success) throw test.reject();
		},
	},
	{
		name: "自我查询",
		handler: async (test) => {
			const accessToken = (await useJwt()).getAccessToken({ uid: 1 });
			const result = await test.client.execute({
				params: {},
				headers: {
					Authorization: accessToken,
				},
			});
			console.log(result);
			if (!result.success) throw test.reject();
		},
	},
	{
		name: "空查询",
		handler: async (test) => {
			const result = await test.client.execute({
				params: {},
			});
			console.log(result);
			if (result.success) throw test.reject();
		},
	},
]);
