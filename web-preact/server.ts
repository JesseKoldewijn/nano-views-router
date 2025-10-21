import fs from "node:fs/promises";
import { createServer } from "@hattip/adapter-node";
import { createRouter } from "@hattip/router";
import { createServer as createViteServer } from "vite";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
	? await fs.readFile("./dist/ssr/index.html", "utf-8")
	: "";

// Create HatTip router
const router = createRouter();

// Add Vite or respective production middlewares
let vite: any;
if (isProduction === false) {
	vite = await createViteServer({
		server: { middlewareMode: true },
		appType: "custom",
		base,
	});
} else {
	// In production, serve static files
	router.get("/assets/*", async (context) => {
		const url = new URL(context.request.url);
		const pathname = url.pathname;

		try {
			const filePath = `./dist/client${pathname}`;
			const file = await fs.readFile(filePath);
			const ext = pathname.split(".").pop();
			const contentType = getContentType(`.${ext}`);

			return new Response(new Uint8Array(file), {
				headers: {
					"Content-Type": contentType,
					"Cache-Control": "public, max-age=31536000, immutable",
				},
			});
		} catch {
			return new Response("Not Found", { status: 404 });
		}
	});
}

// Serve HTML
router.get("*", async (context) => {
	try {
		const url = new URL(context.request.url);
		const pathname = (url.pathname ?? "").replace(base, "/");

		let template: string;
		let render: any;
		let cssPath: string | null = null;

		if (isProduction === false) {
			// Always read fresh template in development
			template = await fs.readFile("./index.html", "utf-8");
			template = await vite.transformIndexHtml(pathname, template);
			render = (await vite.ssrLoadModule("/src/entry-server.tsx"))
				.render_app;
			cssPath = "/src/styles/tailwind.css";
		} else {
			template = templateHtml;
			// @ts-expect-error
			render = (await import("./dist/server/entry-server.js")).render_app;
		}

		const requestCookies = context.request.headers.get("cookie") || "";

		const rendered = await render(pathname, {
			cookies: requestCookies,
		});

		let headContent = cssPath
			? `<link data-ssr-id="ssr-styles" rel="stylesheet" href="${cssPath}">`
			: "";
		if (rendered.head) {
			headContent += rendered.head;
		}

		const themeCookie = requestCookies
			.split("; ")
			.find((row) => row.startsWith("theme="));
		const theme = themeCookie ? themeCookie.split("=")[1] : "dark";

		const html = template
			.replace("<!--app-head-->", headContent)
			.replace("<!--app-html-->", rendered.html ?? "")
			.replace("SSR_THEME", theme ?? "");

		return new Response(html, {
			status: 200,
			headers: {
				"Content-Type": "text/html",
				"Cache-Control":
					"public, s-maxage=1, max-age=172800, stale-while-revalidate=59",
			},
		});
	} catch (error: any) {
		if (vite) {
			vite.ssrFixStacktrace(error);
		}
		console.log(error.stack);
		return new Response(error.stack, { status: 500 });
	}
});

// Create server with middleware support for development
async function createHybridHandler() {
	const hattipHandler = router.buildHandler();

	if (!isProduction && vite) {
		// In development, we need to integrate Vite middleware with HatTip
		return async (req: any, res: any) => {
			const url = req.url;

			// Let Vite handle ALL module requests, assets, and special routes
			if (
				url.startsWith("/@") || // Vite internal routes
				url.includes("?") || // Query parameters (likely Vite HMR)
				url.includes("/src/") || // Source files
				url.includes("/node_modules/") || // Node modules
				url.endsWith(".js") || // JavaScript files
				url.endsWith(".mjs") || // ES modules
				url.endsWith(".ts") || // TypeScript files
				url.endsWith(".tsx") || // TSX files
				url.endsWith(".jsx") || // JSX files
				url.endsWith(".css") || // CSS files
				url.endsWith(".scss") || // SCSS files
				url.endsWith(".sass") || // Sass files
				url.endsWith(".less") || // Less files
				url.endsWith(".svg") || // SVG files
				url.endsWith(".png") || // Image files
				url.endsWith(".jpg") ||
				url.endsWith(".jpeg") ||
				url.endsWith(".gif") ||
				url.endsWith(".webp") ||
				url.endsWith(".ico") ||
				url.endsWith(".woff") || // Font files
				url.endsWith(".woff2") ||
				url.endsWith(".ttf") ||
				url.endsWith(".eot") ||
				url.includes("vite.svg") || // Vite assets
				url.includes("/assets/") // Asset directory
			) {
				vite.middlewares(req, res, () => {
					res.statusCode = 404;
					res.end("Not found");
				});
				return;
			}

			// Use HatTip only for HTML pages (routes without file extensions)
			try {
				const requestUrl = new URL(
					req.url,
					`http://${req.headers.host}`
				);
				const request = new Request(requestUrl, {
					method: req.method,
					headers: req.headers,
				});

				const context = {
					request,
					ip: req.ip || "127.0.0.1",
					platform: {},
					env: (variable: string) => process.env[variable],
					passThrough: () => {},
					waitUntil: () => {},
				};

				const response = await hattipHandler(context);

				res.statusCode = response.status;
				response.headers.forEach((value, key) => {
					res.setHeader(key, value);
				});

				const body = await response.text();
				res.end(body);
			} catch (error: any) {
				console.error("Handler error:", error);
				res.statusCode = 500;
				res.end("Internal Server Error");
			}
		};
	}

	return hattipHandler;
}

function getContentType(ext: string): string {
	const types: Record<string, string> = {
		".js": "application/javascript",
		".css": "text/css",
		".html": "text/html",
		".png": "image/png",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".svg": "image/svg+xml",
		".woff2": "font/woff2",
		".woff": "font/woff",
		".ttf": "font/ttf",
	};
	return types[ext] || "application/octet-stream";
}

// Start server
const handler = await createHybridHandler();

if (!isProduction && vite) {
	// Use Node.js HTTP server for development with Vite integration
	const http = await import("http");
	const server = http.createServer(handler as any);
	server.listen(port, () => {
		console.log(`Server started at http://localhost:${port}`);
	});
} else {
	// Use HatTip adapter for production
	const server = createServer(handler as any);
	server.listen(port, () => {
		console.log(`Server started at http://localhost:${port}`);
	});
}
