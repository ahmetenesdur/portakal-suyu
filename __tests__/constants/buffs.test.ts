/**
 * Tests for Buff Configuration Constants
 * Validates BUFF_* values are consistent and properly configured
 */

import { describe, expect, it } from "vitest";

import { BUFF_DURATIONS, BUFF_ICONS, BUFF_THEMES } from "@/constants/buffs";

describe("Buff Constants (constants/buffs.ts)", () => {
	describe("BUFF_ICONS", () => {
		it("should have icon strings for all buff IDs", () => {
			const buffIds = Object.keys(BUFF_ICONS);
			expect(buffIds.length).toBeGreaterThan(0);

			for (const id of buffIds) {
				expect(typeof BUFF_ICONS[id]).toBe("string");
				expect(BUFF_ICONS[id].length).toBeGreaterThan(0);
			}
		});

		it("should have valid Lucide icon format", () => {
			for (const icon of Object.values(BUFF_ICONS)) {
				// Lucide icons typically have format "lucide:icon-name"
				expect(icon).toMatch(/^lucide:[a-z-]+$/);
			}
		});
	});

	describe("BUFF_THEMES", () => {
		it("should have theme objects for all buff IDs", () => {
			const buffIds = Object.keys(BUFF_THEMES);
			expect(buffIds.length).toBeGreaterThan(0);
		});

		it("should have required properties for each theme", () => {
			for (const theme of Object.values(BUFF_THEMES)) {
				expect(theme).toHaveProperty("text");
				expect(theme).toHaveProperty("bg");
				expect(theme).toHaveProperty("border");
			}
		});

		it("should have valid Tailwind class names", () => {
			for (const theme of Object.values(BUFF_THEMES)) {
				expect(theme.text).toMatch(/^text-/);
				expect(theme.bg).toMatch(/^bg-/);
				expect(theme.border).toMatch(/^border-/);
			}
		});
	});

	describe("BUFF_DURATIONS", () => {
		it("should have durations for all buff IDs", () => {
			const buffIds = Object.keys(BUFF_DURATIONS);
			expect(buffIds.length).toBeGreaterThan(0);
		});

		it("should have positive duration values", () => {
			for (const duration of Object.values(BUFF_DURATIONS)) {
				expect(duration).toBeGreaterThan(0);
			}
		});

		it("should have durations in milliseconds (reasonable range)", () => {
			for (const duration of Object.values(BUFF_DURATIONS)) {
				// At least 30 seconds
				expect(duration).toBeGreaterThanOrEqual(30 * 1000);
				// At most 1 hour
				expect(duration).toBeLessThanOrEqual(60 * 60 * 1000);
			}
		});

		it("should have integer duration values", () => {
			for (const duration of Object.values(BUFF_DURATIONS)) {
				expect(Number.isInteger(duration)).toBe(true);
			}
		});
	});

	describe("Cross-constant consistency", () => {
		it("should have matching IDs across BUFF_ICONS, BUFF_THEMES, and BUFF_DURATIONS", () => {
			const iconIds = Object.keys(BUFF_ICONS).sort();
			const themeIds = Object.keys(BUFF_THEMES).sort();
			const durationIds = Object.keys(BUFF_DURATIONS).sort();

			expect(iconIds).toEqual(themeIds);
			expect(themeIds).toEqual(durationIds);
		});

		it("should have at least 1 buff configured", () => {
			expect(Object.keys(BUFF_ICONS).length).toBeGreaterThanOrEqual(1);
		});
	});
});
