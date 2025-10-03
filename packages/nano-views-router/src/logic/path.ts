import { join } from "path";
import fg from "fast-glob";
import { inputConfig } from "../config/input";

/**
 * The function `getViewsDir` returns the directory path for views based on the input configuration.
 * @returns The function `getViewsDir` returns the joined path of the current working directory
 * (`process.cwd()`) and the base path specified in the `inputConfig.views` object.
 */
export const getViewsDir = () => {
	return join(process.cwd(), inputConfig.views.basePath);
};

/**
 * The function `isInsideViewsDir` checks if a given file path is inside the views directory.
 * @param {string} filePath - The `filePath` parameter is a string that represents the path of a file.
 * @returns The function `isInsideViewsDir` returns a boolean value indicating whether the provided
 * `filePath` is inside the views directory.
 */
export const isInsideViewsDir = (filePath: string) => {
	if (!filePath) return false;

	const viewsDir = getViewsDir();

	return filePath.startsWith(viewsDir);
};

/**
 * The function `getAllViewFiles` asynchronously retrieves all view files within a specified directory
 * using a glob pattern.
 * @returns An array of file paths that match the specified glob pattern in the views directory.
 */
export const getAllViewFiles = async () => {
	const viewsDir = getViewsDir();
	const globPattern = `**/**.{ts,tsx,js,jsx,vue,svelte}`;

	const filesPattern = join(viewsDir, globPattern);
	const matchesArray = await fg.glob(filesPattern);

	return matchesArray;
};
