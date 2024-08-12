import { createMilkioApp } from "milkio";
import { ensureLoginedMiddleware } from "./src/middlewares/ensure-logined-middleware";

export const milkio = createMilkioApp({
	middlewares: () => [ensureLoginedMiddleware()],
});
