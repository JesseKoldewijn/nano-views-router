import { defineConfig } from "vite";
import { viteViewsLinkerPlugin } from "nano-views-router";
import tailwindcss from "@tailwindcss/vite";
import preact from "@preact/preset-vite";

const config = defineConfig({
	plugins: [
		tailwindcss(),
		preact(),
		viteViewsLinkerPlugin({
			framework: "preact",
		}),
	],
	optimizeDeps: {
		include: ["nano-views-router"],
	},
	build: {
		outDir: "dist/client",
		rollupOptions: {
			input: {
				main: "./index.html",
			},
			output: {
				advancedChunks: {
					groups: [
						{
							name: "framework",
							test: (module) =>
								module.includes("node_modules") &&
								(module.includes("preact") ||
									module.includes("react")),
						},
					],
				},
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
		target: "node",
	},
});

export default config;
