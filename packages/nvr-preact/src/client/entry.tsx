import type PreactCompat from "preact/compat";
import type PreactCompatClient from "preact/compat/client";
import type { JSX } from "preact/jsx-runtime";

interface RouteBase {
	pathName: string;
	importPath: string;
	dynamicComponent: () => Promise<() => preact.JSX.Element>;
}

export function createEntry<GenericRoute>(
	App: React.ComponentType<{
		Component: (args?: any) => JSX.Element;
	}>,
	routes: any,
	preactCompatRef: typeof PreactCompat,
	preactCompatClientRef: typeof PreactCompatClient
) {
	type Route = GenericRoute & RouteBase;
	const _routes = (routes ?? [
		{
			pathName: "/404",
			importPath: "",
			dynamicComponent: async () => {
				return async () => <div>404 Not Found</div>;
			},
		},
	]) as Route[];

	try {
		const currentPath = globalThis.window.location.pathname;

		const currentView = _routes
			.filter((route) => {
				return !route.pathName?.match(/^\/(0-9){3}$/);
			})
			.find((route) => route.pathName === currentPath);

		const errorPages = _routes.find((route) => {
			return route.pathName?.match(/^\/(0-9){3}$/);
		});

		const appDiv = document.getElementById("app");
		if (!appDiv) console.error("App div not found");

		const notFoundPage = _routes.find((route) => route.pathName === "/404");

		const dynamicComponent = (
			currentView
				? currentView.dynamicComponent
				: notFoundPage?.dynamicComponent ||
					errorPages?.dynamicComponent ||
					(() => <div>404 Not Found</div>)
		) as () => Promise<() => preact.JSX.Element>;

		if (appDiv) {
			preactCompatClientRef.hydrateRoot(
				appDiv,
				<preactCompatRef.Suspense fallback={null}>
					<App Component={dynamicComponent as any} />
				</preactCompatRef.Suspense>
			);
		}

		// Cleanup SSR-injected styles
		const clientStyles = document.querySelectorAll(
			"style[data-vite-dev-id]"
		);
		const ssrStyles = document.querySelectorAll(
			"link[data-ssr-id='ssr-styles']"
		);
		if (
			ssrStyles &&
			ssrStyles.length > 0 &&
			clientStyles &&
			clientStyles.length > 0
		) {
			for (const ssrStyle of ssrStyles) {
				ssrStyle.remove();
			}
		}
	} catch (error) {
		console.error("Error during hydration:", error);
	}
}
