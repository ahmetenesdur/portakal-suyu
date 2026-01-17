/**
 * Tests for Social Links Constants
 * Validates SOCIAL_LINKS configuration
 */

import { describe, expect, it } from "vitest";

import { SOCIAL_LINKS } from "@/constants/socials";

describe("SOCIAL_LINKS (constants/socials.ts)", () => {
	it("should have at least one social link", () => {
		expect(SOCIAL_LINKS.length).toBeGreaterThan(0);
	});

	it("should have required properties for each link", () => {
		for (const link of SOCIAL_LINKS) {
			expect(link).toHaveProperty("name");
			expect(link).toHaveProperty("icon");
			expect(link).toHaveProperty("url");
			expect(link).toHaveProperty("color");
		}
	});

	it("should have valid URLs", () => {
		for (const link of SOCIAL_LINKS) {
			expect(link.url).toMatch(/^https?:\/\//);
		}
	});

	it("should have valid icon format (simple-icons)", () => {
		for (const link of SOCIAL_LINKS) {
			expect(link.icon).toMatch(/^simple-icons:[a-z]+$/);
		}
	});

	it("should have non-empty names", () => {
		for (const link of SOCIAL_LINKS) {
			expect(link.name.length).toBeGreaterThan(0);
		}
	});

	it("should have Tailwind color classes", () => {
		for (const link of SOCIAL_LINKS) {
			expect(link.color).toMatch(/text-/);
		}
	});

	it("should have unique names", () => {
		const names = SOCIAL_LINKS.map((link) => link.name);
		const uniqueNames = new Set(names);
		expect(uniqueNames.size).toBe(names.length);
	});

	it("should have unique URLs", () => {
		const urls = SOCIAL_LINKS.map((link) => link.url);
		const uniqueUrls = new Set(urls);
		expect(uniqueUrls.size).toBe(urls.length);
	});
});
