import { lazy } from "preact/compat";
import { routes, type RouteBase } from "./views.gen";

export const AppRoutes = [
	...routes,
	{
		pathName: "/static",
		importPath: "",
		dynamicComponent: lazy(() =>
			import("./hardcoded_views").then((mod) => ({
				default: mod.StaticPage,
			}))
		),
	},
] satisfies RouteBase[];
