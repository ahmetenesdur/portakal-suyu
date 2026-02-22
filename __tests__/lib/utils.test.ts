/**
 * Tests for Utilities (lib/utils.ts)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getTurkeyDate, getTurkeyDateString, getTurkeyWeekStart } from "@/lib/utils/date";
import { cn } from "@/lib/utils/styles";

describe("cn (class name utility)", () => {
	it("should merge class names", () => {
		expect(cn("foo", "bar")).toBe("foo bar");
	});

	it("should handle conditional classes", () => {
		expect(cn("base", true && "active")).toBe("base active");
		expect(cn("base", false && "active")).toBe("base");
	});

	it("should merge Tailwind classes correctly", () => {
		expect(cn("px-2", "px-4")).toBe("px-4");
		expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
	});

	it("should handle undefined and null", () => {
		expect(cn("foo", undefined, "bar", null)).toBe("foo bar");
	});

	it("should handle empty inputs", () => {
		expect(cn()).toBe("");
	});
});

describe("getTurkeyDate", () => {
	it("should return a Date object", () => {
		const result = getTurkeyDate();
		expect(result).toBeInstanceOf(Date);
	});

	it("should return a valid date (not NaN)", () => {
		const result = getTurkeyDate();
		expect(isNaN(result.getTime())).toBe(false);
	});
});

describe("getTurkeyDateString", () => {
	it("should return a string in YYYY-MM-DD format", () => {
		const result = getTurkeyDateString();
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it("should return correct format with padded months and days", () => {
		const result = getTurkeyDateString();
		const [year, month, day] = result.split("-");

		expect(year.length).toBe(4);
		expect(month.length).toBe(2);
		expect(day.length).toBe(2);

		// Validate ranges
		expect(parseInt(month)).toBeGreaterThanOrEqual(1);
		expect(parseInt(month)).toBeLessThanOrEqual(12);
		expect(parseInt(day)).toBeGreaterThanOrEqual(1);
		expect(parseInt(day)).toBeLessThanOrEqual(31);
	});
});

describe("getTurkeyWeekStart", () => {
	it("should return a string in YYYY-MM-DD format", () => {
		const result = getTurkeyWeekStart();
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it("should return a Monday (day 1)", () => {
		const result = getTurkeyWeekStart();
		const [year, month, day] = result.split("-").map(Number);
		const date = new Date(year, month - 1, day);

		expect(date.getDay()).toBe(1); // Monday
	});

	it("should return a date not in the future", () => {
		const result = getTurkeyWeekStart();
		const weekStart = new Date(result);
		const today = new Date();

		expect(weekStart.getTime()).toBeLessThanOrEqual(today.getTime() + 86400000); // Allow 1 day margin for timezone
	});

	it("should return the same value when called multiple times in same week", () => {
		const result1 = getTurkeyWeekStart();
		const result2 = getTurkeyWeekStart();

		expect(result1).toBe(result2);
	});
});

describe("Date utilities with mocked dates", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should handle year boundary correctly", () => {
		// Set to January 1st, 2025 (Wednesday)
		vi.setSystemTime(new Date("2025-01-01T12:00:00+03:00"));

		const dateString = getTurkeyDateString();
		expect(dateString).toBe("2025-01-01");

		// Week start should be December 30, 2024 (Monday)
		const weekStart = getTurkeyWeekStart();
		expect(weekStart).toBe("2024-12-30");
	});

	it("should handle month boundary correctly", () => {
		// Set to February 1st, 2025 (Saturday)
		vi.setSystemTime(new Date("2025-02-01T12:00:00+03:00"));

		const dateString = getTurkeyDateString();
		expect(dateString).toBe("2025-02-01");

		// Week start should be January 27, 2025 (Monday)
		const weekStart = getTurkeyWeekStart();
		expect(weekStart).toBe("2025-01-27");
	});

	it("should handle Sunday correctly (week ends)", () => {
		// Set to Sunday, January 5, 2025
		vi.setSystemTime(new Date("2025-01-05T12:00:00+03:00"));

		// Week start should be December 30, 2024 (Monday before)
		const weekStart = getTurkeyWeekStart();
		expect(weekStart).toBe("2024-12-30");
	});

	it("should handle Monday correctly (week starts)", () => {
		// Set to Monday, January 6, 2025
		vi.setSystemTime(new Date("2025-01-06T12:00:00+03:00"));

		// Week start should be the same day
		const weekStart = getTurkeyWeekStart();
		expect(weekStart).toBe("2025-01-06");
	});
});
