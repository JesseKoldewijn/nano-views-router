import type { VercelRequest, VercelResponse } from "@vercel/node";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Cache for template and render function
let templateHtml: string | null = null;
let render_app: any = null;

async function loadAssets() {
	if (templateHtml && render_app) {
		return { templateHtml, render_app };
	}

	// Get the directory of this file
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	// Try multiple possible paths
	const possibleHtmlPaths = [
		// SSR-specific copy (preferred)
		path.join(__dirname, "..", "dist", "ssr", "index.html"),
		path.join(process.cwd(), "dist", "ssr", "index.html"),
		// Fallback to client directory
		path.join(__dirname, "..", "dist", "client", "index.html"),
		path.join(process.cwd(), "dist", "client", "index.html"),
		path.join(__dirname, "..", "..", "dist", "client", "index.html"),
	];

	const possibleServerPaths = [
		path.join(__dirname, "..", "dist", "server", "entry-server.js"),
		path.join(process.cwd(), "dist", "server", "entry-server.js"),
		path.join(__dirname, "..", "..", "dist", "server", "entry-server.js"),
	];

	// Try to find and load HTML template
	let htmlLoaded = false;
	for (const htmlPath of possibleHtmlPaths) {
		try {
			templateHtml = await fs.readFile(htmlPath, "utf-8");
			htmlLoaded = true;
			break;
		} catch (error) {
			continue;
		}
	}

	if (!htmlLoaded) {
		const dirList = await fs.readdir(process.cwd()).catch(() => []);
		throw new Error(
			`Could not find index.html. Tried paths:\n${possibleHtmlPaths.join("\n")}\n\nCWD: ${process.cwd()}\nFiles in CWD: ${dirList.join(", ")}\n__dirname: ${__dirname}`
		);
	}

	// Try to find and load server module
	let serverLoaded = false;
	for (const serverPath of possibleServerPaths) {
		try {
			const serverModule = await import(serverPath);
			render_app = serverModule.render_app;
			serverLoaded = true;
			break;
		} catch (error) {
			continue;
		}
	}

	if (!serverLoaded) {
		throw new Error(
			`Could not find entry-server.js. Tried paths:\n${possibleServerPaths.join("\n")}`
		);
	}

	return { templateHtml, render_app };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const assets = await loadAssets();

		if (!assets.templateHtml || !assets.render_app) {
			throw new Error("Failed to load required assets");
		}

		const url = new URL(req.url || "/", `http://${req.headers.host}`);
		const pathname = url.pathname;

		// Get cookies from request
		const requestCookies = req.headers.cookie || "";

		// Render the app
		const rendered = await assets.render_app(pathname, {
			cookies: requestCookies,
		});

		// Extract theme from cookies
		const themeCookie = requestCookies
			.split("; ")
			.find((row: string) => row.startsWith("theme="));
		const theme = themeCookie ? themeCookie.split("=")[1] : "dark";

		// Replace placeholders in HTML
		let html = assets.templateHtml
			.replace("<!--app-head-->", rendered.head ?? "")
			.replace("<!--app-html-->", rendered.html ?? "");

		// Replace SSR_THEME - use regex to handle any variations
		html = html.replace(/SSR_THEME/g, theme);

		res.setHeader("Content-Type", "text/html");
		res.setHeader(
			"Cache-Control",
			"public, s-maxage=1, max-age=172800, stale-while-revalidate=59"
		);

		res.status(200).send(html);
	} catch (error: any) {
		console.error("SSR Error:", error);
		console.error("CWD:", process.cwd());
		res.status(500).send(`
			<!DOCTYPE html>
			<html>
				<head><title>Error</title></head>
				<body>
					<h1>500 - Server Error</h1>
					<pre>${error.stack || error.message}</pre>
					<pre>CWD: ${process.cwd()}</pre>
				</body>
			</html>
		`);
	}
}
