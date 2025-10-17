import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/client/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: false,
	platform: "neutral",
	target: "es2022",
	bundle: true,
	splitting: true,
	treeshake: true,
	external: ["vite", "module", "nano-views-router", "preact"],
	// Explicitly exclude test files from bundle
	ignoreWatch: ["**/*.test.ts", "**/*.spec.ts"],
	esbuildOptions(options) {
		options.packages = "bundle";
		options.banner = {
			// js: `
			//     import React from "react";
			// `.trim(),
		};
	},
});
