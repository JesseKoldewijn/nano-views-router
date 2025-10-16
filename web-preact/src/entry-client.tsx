import { hydrateRoot } from "preact/compat/client";
import App from "./app";
import { routes } from "./views.gen";
import { Suspense } from "preact/compat";
import "./styles/tailwind.css";

const currentPath = globalThis.window.location.pathname;

const currentView = routes
	.filter((route) => {
		return !route.pathName.match(/^\/(0-9){3}$/);
	})
	.find((route) => route.pathName === currentPath);

const errorPages = routes.find((route) => {
	return route.pathName.match(/^\/(0-9){3}$/);
});

const appDiv = document.getElementById("app");
if (!appDiv) console.error("App div not found");

const notFoundPage = routes.find((route) => route.pathName === "/404");

const dynamicComponent = (currentView
	? currentView.dynamicComponent
	: notFoundPage?.dynamicComponent ||
		errorPages?.dynamicComponent ||
		(() => <div>404 Not Found</div>)) as any as () => Promise<
	() => preact.JSX.Element
>;

if (appDiv) {
	hydrateRoot(
		appDiv,
		<Suspense fallback={null}>
			<App Component={dynamicComponent} />
		</Suspense>
	);
}

// Cleanup SSR-injected styles
const clientStyles = document.querySelectorAll("style[data-vite-dev-id]");
const ssrStyles = document.querySelectorAll("link[data-ssr-id='ssr-styles']");
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
