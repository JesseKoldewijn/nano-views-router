import { getAllViewFiles } from "./logic/path";
import { buildFullGeneration } from "./logic/gen";

import type { SupportedFramework } from "./types/frameworks";

export const buildStartHandler = async (
	framework: SupportedFramework,
	_ctx: any
) => {
	const views = await getAllViewFiles();
	if (views.length === 0) return;

	await buildFullGeneration(framework);
};

export const sourceChangeHandler = async (
	framework: SupportedFramework,
	_ctx: any
) => {
	const fileId = _ctx.file;

	const isSrcFile = fileId.includes("src/");
	if (!isSrcFile) return;

	await buildFullGeneration(framework);
};
