// Type declarations for global test utilities
import type { VitestUtils } from "vitest";

declare global {
	var vi: VitestUtils;
}

// Polyfill for root package
declare module "nano-views-router";
