// This is the main entry point for the Vite plugin to generate view route linking

import type { Plugin } from "vite";
import { buildStartHandler, sourceChangeHandler } from "./main";
import type { SupportedFramework } from "./types/frameworks";

export const supportedFrameworks = ["preact"] as const;

const plugin = (options: { framework: SupportedFramework }) => {
	const vitePlugin = {
		name: "vite-plugin-views-linker",
		handleHotUpdate(ctx) {
			sourceChangeHandler(options.framework, ctx);
		},
		buildStart(ctx) {
			buildStartHandler(options.framework, ctx);
		},
	} as const satisfies Plugin;

	return vitePlugin;
};

export const viteViewsLinkerPlugin = plugin;

export * from "./types/route";
export * from "./types/frameworks";
