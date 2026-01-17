/**
 * Tests for Game Configuration Constants
 * Validates GAME_CONFIG values are reasonable and consistent
 */

import { describe, expect, it } from "vitest";

import { GAME_CONFIG } from "@/constants/game";

describe("GAME_CONFIG", () => {
	describe("GOAL", () => {
		it("should be a positive number", () => {
			expect(GAME_CONFIG.GOAL).toBeGreaterThan(0);
		});

		it("should be an integer", () => {
			expect(Number.isInteger(GAME_CONFIG.GOAL)).toBe(true);
		});

		it("should be a reasonable milestone value", () => {
			// Goal should be at least 100 for meaningful progress
			expect(GAME_CONFIG.GOAL).toBeGreaterThanOrEqual(100);
			// Goal should not be impossibly high
			expect(GAME_CONFIG.GOAL).toBeLessThanOrEqual(1000000);
		});
	});

	describe("ANIMATION", () => {
		it("should have positive SPILL_DURATION", () => {
			expect(GAME_CONFIG.ANIMATION.SPILL_DURATION).toBeGreaterThan(0);
		});

		it("should have positive WAVE_DURATION", () => {
			expect(GAME_CONFIG.ANIMATION.WAVE_DURATION).toBeGreaterThan(0);
		});

		it("should have positive GOD_RAYS_DURATION", () => {
			expect(GAME_CONFIG.ANIMATION.GOD_RAYS_DURATION).toBeGreaterThan(0);
		});

		it("should have positive SPARKLE_DURATION", () => {
			expect(GAME_CONFIG.ANIMATION.SPARKLE_DURATION).toBeGreaterThan(0);
		});

		it("should have reasonable animation durations (100ms - 10s)", () => {
			expect(GAME_CONFIG.ANIMATION.SPILL_DURATION).toBeGreaterThanOrEqual(100);
			expect(GAME_CONFIG.ANIMATION.SPILL_DURATION).toBeLessThanOrEqual(10000);

			expect(GAME_CONFIG.ANIMATION.GOD_RAYS_DURATION).toBeGreaterThanOrEqual(100);
			expect(GAME_CONFIG.ANIMATION.GOD_RAYS_DURATION).toBeLessThanOrEqual(10000);

			expect(GAME_CONFIG.ANIMATION.SPARKLE_DURATION).toBeGreaterThanOrEqual(100);
			expect(GAME_CONFIG.ANIMATION.SPARKLE_DURATION).toBeLessThanOrEqual(10000);
		});
	});

	describe("PARTICLES", () => {
		it("should have positive FLOATING_COUNT", () => {
			expect(GAME_CONFIG.PARTICLES.FLOATING_COUNT).toBeGreaterThan(0);
		});

		it("should have positive SPLASH_COUNT", () => {
			expect(GAME_CONFIG.PARTICLES.SPLASH_COUNT).toBeGreaterThan(0);
		});

		it("should have positive SPARKLE_COUNT", () => {
			expect(GAME_CONFIG.PARTICLES.SPARKLE_COUNT).toBeGreaterThan(0);
		});

		it("should have integer particle counts", () => {
			expect(Number.isInteger(GAME_CONFIG.PARTICLES.FLOATING_COUNT)).toBe(true);
			expect(Number.isInteger(GAME_CONFIG.PARTICLES.SPLASH_COUNT)).toBe(true);
			expect(Number.isInteger(GAME_CONFIG.PARTICLES.SPARKLE_COUNT)).toBe(true);
		});

		it("should have reasonable particle counts (1-100)", () => {
			expect(GAME_CONFIG.PARTICLES.FLOATING_COUNT).toBeLessThanOrEqual(100);
			expect(GAME_CONFIG.PARTICLES.SPLASH_COUNT).toBeLessThanOrEqual(100);
			expect(GAME_CONFIG.PARTICLES.SPARKLE_COUNT).toBeLessThanOrEqual(100);
		});
	});

	describe("REFRESH_INTERVALS", () => {
		it("should have positive LEADERBOARD interval", () => {
			expect(GAME_CONFIG.REFRESH_INTERVALS.LEADERBOARD).toBeGreaterThan(0);
		});

		it("should have reasonable LEADERBOARD refresh rate (1s - 60s)", () => {
			// Not too aggressive (spam prevention)
			expect(GAME_CONFIG.REFRESH_INTERVALS.LEADERBOARD).toBeGreaterThanOrEqual(1000);
			// Not too slow (stale data)
			expect(GAME_CONFIG.REFRESH_INTERVALS.LEADERBOARD).toBeLessThanOrEqual(60000);
		});
	});
});
