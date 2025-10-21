import { renderToStringAsync } from "preact-render-to-string";
import { AppRoutes } from "./routes";

// Simple SSR App component without the problematic providers
function SSRApp({
	Component,
}: Readonly<{ Component: preact.ComponentType<any> }>) {
	return <Component />;
}

export async function render_app(
	url: string,
	{
		cookies: _cookies,
		retrying = false,
	}: {
		cookies: string;
		retrying?: boolean;
	}
) {
	try {
		// Find matching route
		const currentRoute = AppRoutes.find((route) => route.pathName === url);
		const notFoundRoute = AppRoutes.find(
			(route) => route.pathName === "/404"
		);

		const ComponentToRender = currentRoute
			? currentRoute.dynamicComponent
			: notFoundRoute?.dynamicComponent ||
				(() => <div>404 Not Found</div>);

		// Render the app to string with async support for Suspense
		const html = await renderToStringAsync(
			<SSRApp Component={ComponentToRender} />
		);

		// In production, CSS is automatically injected by Vite into the HTML template
		// In development, Vite handles CSS injection through HMR
		// So we don't need to manually add CSS links here
		return {
			html,
			head: "",
		};
	} catch (error) {
		const err = error as Error;

		if (retrying) {
			// If we've already retried, throw the error to avoid infinite loops
			throw err;
		}

		return render_app(url, {
			cookies: _cookies,
			retrying: false,
		});
	}
}
