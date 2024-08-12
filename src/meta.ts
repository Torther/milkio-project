import type { MilkioMeta } from "milkio";

export type Meta = MilkioMeta & {
	/** 允许无登录访问 */
	allowWithoutLogin?: boolean;
	/** 允许使用 RefreshToken */
	allowRefreshToken?: boolean;
};
