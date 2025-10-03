import { createRoutePath } from "./url";

describe("url utilities", () => {
	describe("createRoutePath", () => {
		it("should create a route path without parameters", () => {
			const path = createRoutePath("/home", true);
			expect(path).toBe("/home");
		});

		it("should create a route path with parameters", () => {
			const path = createRoutePath("/user/:id/profile", true);
			expect(path).toBe("/user/:id/profile");
		});

		it("should handle multiple parameters", () => {
			const path = createRoutePath("/product/:category/:id", true);
			expect(path).toBe("/product/:category/:id");
		});

		it("should handle mixed static and dynamic segments", () => {
			const path = createRoutePath("/blog/:year/:month/:slug", true);
			expect(path).toBe("/blog/:year/:month/:slug");
		});

		it("should create a file path without parameters", () => {
			const path = createRoutePath("/home.tsx", false);
			expect(path).toBe("./home");
		});

		it("should create a file path with parameters", () => {
			const path = createRoutePath("/user/:id/profile.tsx", false);
			expect(path).toBe("./user/:id/profile");
		});

		it("should handle multiple parameters in file path", () => {
			const path = createRoutePath(
				"/product/:category/:id/index.tsx",
				false
			);
			expect(path).toBe("./product/:category/:id/index");
		});

		it("should handle mixed static and dynamic segments in file path", () => {
			const path = createRoutePath(
				"/blog/:year/:month/:slug/index.tsx",
				false
			);
			expect(path).toBe("./blog/:year/:month/:slug/index");
		});
	});
});
