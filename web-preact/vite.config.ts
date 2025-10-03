import { defineConfig } from "vite";
import { viteViewsLinkerPlugin } from "nano-views-router";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
	plugins: [
		tailwindcss(),
		viteViewsLinkerPlugin({
			framework: "preact",
		}),
	],
	build: {
		outDir: "dist",
	},
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});

export default config;
