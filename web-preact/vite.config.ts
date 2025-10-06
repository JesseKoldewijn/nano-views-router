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
		outDir: "dist/client",
		rollupOptions: {
			input: {
				main: "./index.html",
			},
		},
	},
	resolve: {
		alias: {
			"@": "/src",
		},
	},
	ssr: {
		// For SSR builds
		noExternal: ["preact", "preact/compat", "preact-render-to-string"],
	},
});

export default config;
