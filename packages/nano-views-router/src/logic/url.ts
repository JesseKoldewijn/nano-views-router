/**
 * Removes the views directory prefix from a file path
 */
const removeViewsPrefix = (filePath: string): string => {
	// Handle path starting with /src/views (after cwd removal)
	if (filePath.startsWith("/src/views")) {
		return filePath.replace(/^\/src\/views/, "");
	}
	// Handle relative path src/views
	if (filePath.startsWith("src/views")) {
		return filePath.replace(/^src\/views/, "");
	}
	// Handle full absolute path with cwd
	if (filePath.includes(process.cwd())) {
		return filePath.replace(process.cwd(), "").replace(/^\/src\/views/, "");
	}
	// Return as-is if no prefix found
	return filePath;
};

/**
 * Handles path generation for index files
 */
const createIndexRoutePath = (
	pathWithoutViews: string,
	isPathname: boolean
): string => {
	// Remove /index suffix
	const dirPath = pathWithoutViews.slice(0, -"/index".length);
	const cleanPath = dirPath === "" ? "/" : dirPath;

	return isPathname
		? cleanPath
		: cleanPath === "/"
			? "/"
			: `.${cleanPath}/index`;
};

/**
 * Handles path generation for non-index files
 */
const createNonIndexRoutePath = (
	pathWithoutViews: string,
	isPathname: boolean
): string => {
	// Remove leading slash if present to avoid double slashes
	const cleanPath = pathWithoutViews.startsWith("/")
		? pathWithoutViews.slice(1)
		: pathWithoutViews;
	return isPathname ? `/${cleanPath}` : `./${cleanPath}`;
};

export const createRoutePath = (
	filePath: string,
	isPathname: boolean = false
) => {
	const withoutExtension = filePath.replace(/\.[^/.]+$/, "");
	const isIndex = withoutExtension.endsWith("/index");
	const pathWithoutViews = removeViewsPrefix(withoutExtension);

	return isIndex
		? createIndexRoutePath(pathWithoutViews, isPathname)
		: createNonIndexRoutePath(pathWithoutViews, isPathname);
};
