import { SUPPORTED_FRAMEWORKS } from "../../config/frameworks";
import type { SupportedFramework } from "../../types/frameworks";
import type { Route } from "../../types/route";

const getFrameworkImport = (framework: SupportedFramework) => {
	if (framework === SUPPORTED_FRAMEWORKS.PREACT) {
		return `import { lazy } from 'preact/compat';\n`;
	}
	return "";
};

const getDynamicImport = (
	framework: SupportedFramework,
	importPath: string
) => {
	if (framework === SUPPORTED_FRAMEWORKS.PREACT) {
		return `lazy(() => import("${importPath}"))`;
	}
	return `() => import("${importPath}")`;
};

export const writeDefinitionsToString = async (
	routes: Omit<Route, "dynamicComponent">[],
	framework: SupportedFramework
) => {
	let output = "import type { Route } from 'nano-views-router';\n\n";
	output += getFrameworkImport(framework);

	output += "export const routes = [\n";

	routes.forEach((route) => {
		output += `{ pathName: "${route.pathName}", importPath: "${route.importPath}", dynamicComponent: ${getDynamicImport(framework, route.importPath)} },\n`;
	});
	output += "] as const satisfies Route[];\n";

	return output;
};
