import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: false,
	platform: "node",
	target: "es2022",
	bundle: true,
	splitting: false,
	treeshake: true,
	external: ["vite"],
	// Explicitly exclude test files from bundle
	ignoreWatch: ["**/*.test.ts", "**/*.spec.ts"],
	esbuildOptions(options) {
		options.packages = "bundle";
		// Convert CommonJS to ESM and handle require() calls
		options.banner = {
			js: `
                import { createRequire } from 'module';
                import { fileURLToPath } from 'url';
                import { dirname } from 'path';
                const require = createRequire(import.meta.url);
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = dirname(__filename);
			`.trim(),
		};
	},
});
