#!/usr/bin/env bun
import { $ } from "bun";
import { exit } from "node:process";

// 使用推送模式运行 Drizzle Kit
await $`bun x drizzle-kit push`;

exit(0);
