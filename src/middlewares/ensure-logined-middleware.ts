import { defineMiddleware, reject, useMeta } from "milkio";
import { useJwt } from "../uses/jwt";

export const ensureLoginedMiddleware = defineMiddleware({
	beforeExecute: async (context) => {
		const meta = await useMeta(context.path);
		const allowWithoutLogin = meta.allowWithoutLogin ?? false;
		const allowRefreshToken = meta.allowRefreshToken ?? false;

		// 如果不允许无登录访问，则继续执行 Token 检查
		if (!allowWithoutLogin) {
			const accessToken = context.headers.get("Authorization");
			const refreshToken = context.headers.get("X-Refresh-Token");

			// 检查是否存在 accessToken 或 refreshToken
			if (!accessToken && !refreshToken) {
				throw reject("DEVICE_NOT_LOGIN", undefined);
			}

			// 优先验证 accessToken
			if (accessToken) {
				const isValidAccessToken = (await useJwt()).verify(accessToken);
				if (isValidAccessToken) {
					// AccessToken 有效，继续请求
					return;
				}
			}

			// 如果 accessToken 无效或不存在，验证 refreshToken
			if (refreshToken) {
				const isValidRefreshToken = (await useJwt()).verify(refreshToken);
				if (isValidRefreshToken) {
					if (!allowRefreshToken) throw reject("REFRESH_TOKEN_NEEDED", undefined);
					return;
				}
			}

			// 如果两者都无效，则抛出无效 Token 错误
			throw reject("INVALID_TOKEN", undefined);
		}
	},
});
