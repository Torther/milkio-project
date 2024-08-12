import jwt, { type JwtPayload } from "jsonwebtoken";
import { defineUse } from "milkio";
import { env } from "node:process";

export const useJwt = defineUse(async () => {
	const secret = env.JWT_SECRET as string;
	const accessTokenExpires = env.JWT_ACCESS_TOKEN_EXPIRES || "1h";
	const refreshTokenExpires = env.JWT_REFRESH_TOKEN_EXPIRES || "7d";
	if (!secret) {
		throw new Error("JWT_SECRET is not defined in environment variables");
	}

	return {
		getSecret: () => secret,

		getAccessToken: (payload: JwtPayload) => {
			return jwt.sign(payload, secret, { expiresIn: accessTokenExpires });
		},

		getRefreshToken: (payload: JwtPayload) => {
			return jwt.sign({ ...payload, refresh: true }, secret, { expiresIn: refreshTokenExpires });
		},

		verify: (token: string): JwtPayload | string | null => {
			try {
				return jwt.verify(token, secret) as JwtPayload;
			} catch (error) {
				console.error("Token verification failed:", error);
				return null;
			}
		},
	};
});
