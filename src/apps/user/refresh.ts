import type { JwtPayload } from "jsonwebtoken";
import { defineApi, defineApiTest, reject } from "milkio";
import { useJwt } from "../../uses/jwt";
/**
 * ## 用户刷新令牌接口
 *
 * ### 接口描述
 * 用于刷新用户的访问令牌和刷新令牌，通过提供刷新令牌，获取新的访问令牌和刷新令牌。
 *
 * ### 请求URL
 * ```POST /api/user/refresh```
 *
 * ### 请求头
 * | 参数名 | 类型 | 是否必填 | 描述 |
 * | --- | --- | --- | --- |
 * | X-Refresh-Token | string | 是 | 刷新令牌 |
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
 * | REFRESH_TOKEN_NEEDED | 缺少刷新令牌 |
 * | INVALID_TOKEN | 无效的令牌 |
 */
export const api = defineApi({
	meta: {
		allowRefreshToken: true,
	},
	async action(params, context) {
		const refreshToken = context.headers.get("X-Refresh-Token");
		if (!refreshToken) throw reject("REFRESH_TOKEN_NEEDED", undefined);
		const payload = (await useJwt()).verify(refreshToken) as JwtPayload;
		if (payload.refresh !== true) throw reject("INVALID_TOKEN", undefined);
		return {
			accessToken: (await useJwt()).getAccessToken({ userId: payload.userId }),
			refreshToken: (await useJwt()).getRefreshToken({
				userId: payload.userId,
			}),
		};
	},
});

export const test = defineApiTest(api, [
	{
		name: "RefreshTokenSuccessTest",
		handler: async (test) => {
			const refreshToken = (await useJwt()).getRefreshToken({ userId: 1 });
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const result = await test.execute({
				params: {},
				headers: {
					"X-Refresh-Token": refreshToken,
				},
			});
			console.log(result);
			// 检查 API 调用是否成功
			if (!result.success) throw new Error("Test Failed!");

			// 验证返回的 accessToken 和 refreshToken
			const { accessToken, refreshToken: newRefreshToken } = result.data;

			// 验证 accessToken 是否有效
			let payload = (await useJwt()).verify(accessToken) as JwtPayload;
			if (payload.userId !== 1) throw new Error("Invalid accessToken payload!");

			payload = (await useJwt()).verify(newRefreshToken) as JwtPayload;
			console.log(payload);
			console.log(refreshToken, newRefreshToken);
			// 验证新的 refreshToken 是否不同
			if (refreshToken === newRefreshToken) throw new Error("refreshToken did not refresh!");
		},
	},
]);
