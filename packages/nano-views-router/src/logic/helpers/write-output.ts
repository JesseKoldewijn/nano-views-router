import { SUPPORTED_FRAMEWORKS } from "../../config/frameworks";
import type { SupportedFramework } from "../../types/frameworks";
import type { Route } from "../../types/route";

const getFrameworkImport = (framework: SupportedFramework) => {
	if (framework === SUPPORTED_FRAMEWORKS.PREACT) {
		return `import { lazy, type JSX } from 'preact/compat';\n`;
	}
	return "";
};

const getDynamicImport = (
	framework: SupportedFramework,
	importPath: string
) => {
	if (framework === SUPPORTED_FRAMEWORKS.PREACT) {
		return `lazy(() => import("${importPath}").then(module => ({ default: module.default })))`;
	}
	return `() => import("${importPath}")`;
};

export const writeDefinitionsToString = async (
	routes: Omit<Route, "dynamicComponent">[],
	framework: SupportedFramework
) => {
	let output = "";
	output += getFrameworkImport(framework);

	output += "\n";

	output += "export interface RouteBase {\n";
	output += "  pathName: string;\n";
	output += "  importPath: string;\n";
	output +=
		"  dynamicComponent: (() => Promise<() => JSX.Element>) | (() => JSX.Element);\n";
	output += "}\n";
	output += "\n";

	output += "export const routes = [\n";

	routes.forEach((route) => {
		output += `{ pathName: "${route.pathName}", importPath: "${route.importPath}", dynamicComponent: ${getDynamicImport(framework, route.importPath)} },\n`;
	});
	output += "] as const;\n";
	output += "\n";
	output += `export type Route = (typeof routes)[number];\n`;

	return output;
};
