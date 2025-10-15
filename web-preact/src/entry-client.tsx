import { Suspense } from "preact/compat";
import { hydrateRoot } from "preact/compat/client";
import App from "./app";
import { routes } from "./views.gen";
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

hydrateRoot(
	appDiv!,
	<Suspense fallback={null}>
		{currentView ? (
			<App Component={currentView.dynamicComponent} />
		) : (
			<App
				Component={
					notFoundPage?.dynamicComponent ||
					errorPages?.dynamicComponent ||
					(() => <div>404 Not Found</div>)
				}
			/>
		)}
	</Suspense>
);
