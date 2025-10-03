import { writeDefinitionsToString } from "./helpers/write-output";
import { getAllViewFiles } from "./path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { outputConfig } from "../config/output";
import { join } from "path";
import { createRoutePath } from "./url";
import type { SupportedFramework } from "../types/frameworks";

export const buildFullGeneration = async (framework: SupportedFramework) => {
	// Placeholder for full generation logic
	const views = await getAllViewFiles();

	const definitions = [];

	for (const view of views) {
		const relativeComponentPath = view
			.replace(process.cwd(), "")
			.replace(/\.[^/.]+$/, "");

		// Get the route path (e.g., ./404 or ./about/index)
		const routePath = createRoutePath(relativeComponentPath, false);

		// Convert route path to import path relative to src/
		// ./404 -> ./views/404
		// ./about/contact -> ./views/about/contact
		// / (root index) -> ./views/index
		let importPath: string;
		if (routePath === "/") {
			importPath = "./views/index";
		} else {
			// Remove leading ./ and prepend ./views/
			importPath = `./views${routePath.slice(1)}`;
		}

		definitions.push({
			pathName: createRoutePath(relativeComponentPath, true),
			importPath,
			filePath: view,
		});
	}

	const outputString = await writeDefinitionsToString(definitions, framework);

	const outFilePath = join(
		process.cwd(),
		outputConfig.views.outputDir,
		outputConfig.views.outputFileName
	);
	const dirExists = existsSync(
		join(process.cwd(), outputConfig.views.outputDir)
	);
	if (!dirExists) {
		mkdirSync(join(process.cwd(), outputConfig.views.outputDir), {
			recursive: true,
		});
	}

	writeFileSync(outFilePath, outputString);

	console.log("nano-views-router: full route generation complete");
};
