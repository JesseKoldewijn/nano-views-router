import { Suspense } from "preact/compat";
import { createRoot } from "preact/compat/client";
import App from "./app";
import { routes } from "./views.gen";
import "./styles/tailwind.css";

console.log("Hello, World!");

const currentPath = window.location.pathname;
console.log("Current Path:", currentPath);

const currentView = routes
	.filter((route) => {
		return !route.pathName.match(/^\/(0-9){3}$/);
	})
	.find((route) => route.pathName === currentPath);

const errorPages = routes.filter((route) => {
	return route.pathName.match(/^\/(0-9){3}$/);
});

const appDiv = document.getElementById("app");
if (!appDiv) console.error("App div not found");

const root = createRoot(appDiv!);

const notFoundPage = routes.find((route) => route.pathName === "/404");

root.render(
	<Suspense fallback={<div>Loading...</div>}>
		{currentView ? (
			<App Component={currentView.dynamicComponent} />
		) : (
			<App
				Component={
					notFoundPage?.dynamicComponent ||
					errorPages[0]?.dynamicComponent ||
					(() => <div>404 Not Found</div>)
				}
			/>
		)}
	</Suspense>
);
