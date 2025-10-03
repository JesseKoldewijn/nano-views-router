import type { supportedFrameworks } from "../config/frameworks";

export type SupportedFramework = (typeof supportedFrameworks)[number];
