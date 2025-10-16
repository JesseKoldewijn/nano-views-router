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
		noExternal: ["preact-render-to-string"],
		// Recover from failed imports in SSR in-case they only work in the browser
		external: ["@preact/signals"],
		target: "node",
	},
});

export default config;
