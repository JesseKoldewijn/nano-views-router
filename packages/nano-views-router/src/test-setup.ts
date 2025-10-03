// Global test setup for Vitest
import { beforeEach, afterEach, vi } from "vitest";

// Global setup that runs before each test
beforeEach(() => {
	// Clear all mocks before each test
	vi.clearAllMocks();
});

// Global cleanup that runs after each test
afterEach(() => {
	// Reset all mocks after each test
	vi.resetAllMocks();
});

// Make vi available globally for easier mocking
(globalThis as any).vi = vi;
