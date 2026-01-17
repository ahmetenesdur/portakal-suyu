/**
 * Tests for Constants Validation
 * Ensures configuration integrity for orange.ts and kick.ts
 */

import { describe, expect, it } from "vitest";

import {
	CHAT_CONFIG,
	CHAT_RESPONSES,
	CHAT_TRIGGERS,
	KICK_PUSHER_CONFIG,
	REACTION_FACES,
} from "@/constants/kick";
import { AVAILABLE_FACES, IDLE_ANIMATIONS, MOOD_FACES, MOODS } from "@/constants/orange";

describe("Orange Constants (constants/orange.ts)", () => {
	describe("AVAILABLE_FACES", () => {
		it("should contain faces 0-11", () => {
			expect(AVAILABLE_FACES).toHaveLength(12);
			for (let i = 0; i < 12; i++) {
				expect(AVAILABLE_FACES).toContain(i);
			}
		});
	});

	describe("MOODS", () => {
		it("should have at least one mood", () => {
			expect(MOODS.length).toBeGreaterThan(0);
		});

		it("should contain valid mood types", () => {
			const validMoods = ["CHILL", "ENERGY", "SILLY"];
			for (const mood of MOODS) {
				expect(validMoods).toContain(mood);
			}
		});
	});

	describe("MOOD_FACES", () => {
		it("should have entry for each mood", () => {
			for (const mood of MOODS) {
				expect(MOOD_FACES[mood]).toBeDefined();
				expect(Array.isArray(MOOD_FACES[mood])).toBe(true);
			}
		});

		it("should only contain valid face indices (0-11)", () => {
			for (const mood of MOODS) {
				for (const faceIndex of MOOD_FACES[mood]) {
					expect(faceIndex).toBeGreaterThanOrEqual(0);
					expect(faceIndex).toBeLessThanOrEqual(11);
				}
			}
		});

		it("should have at least one face per mood", () => {
			for (const mood of MOODS) {
				expect(MOOD_FACES[mood].length).toBeGreaterThan(0);
			}
		});
	});

	describe("IDLE_ANIMATIONS", () => {
		it("should have animation for each available face", () => {
			for (const faceIndex of AVAILABLE_FACES) {
				expect(IDLE_ANIMATIONS[faceIndex]).toBeDefined();
			}
		});

		it("should have animate property for each face", () => {
			for (const faceIndex of AVAILABLE_FACES) {
				expect(IDLE_ANIMATIONS[faceIndex].animate).toBeDefined();
			}
		});
	});
});

describe("Kick Constants (constants/kick.ts)", () => {
	describe("KICK_PUSHER_CONFIG", () => {
		it("should have all required config properties", () => {
			expect(KICK_PUSHER_CONFIG.APP_KEY).toBeDefined();
			expect(KICK_PUSHER_CONFIG.WS_URL).toBeDefined();
			expect(KICK_PUSHER_CONFIG.PROTOCOL_VERSION).toBeDefined();
		});

		it("should have valid WebSocket URL", () => {
			expect(KICK_PUSHER_CONFIG.WS_URL).toMatch(/^wss?:\/\//);
		});
	});

	describe("CHAT_CONFIG", () => {
		it("should have positive duration values", () => {
			expect(CHAT_CONFIG.REACTION_DURATION).toBeGreaterThan(0);
			expect(CHAT_CONFIG.USER_COOLDOWN).toBeGreaterThan(0);
			expect(CHAT_CONFIG.REACTION_COOLDOWN).toBeGreaterThan(0);
		});

		it("should have reasonable cooldown values (not too short)", () => {
			// At least 1 second for reaction cooldown to prevent spam
			expect(CHAT_CONFIG.REACTION_COOLDOWN).toBeGreaterThanOrEqual(1000);
		});
	});

	describe("CHAT_TRIGGERS", () => {
		const categories = ["GREETING", "FAREWELL", "CHEER", "QUESTION"] as const;

		it("should have all categories", () => {
			for (const category of categories) {
				expect(CHAT_TRIGGERS[category]).toBeDefined();
				expect(Array.isArray(CHAT_TRIGGERS[category])).toBe(true);
			}
		});

		it("should have non-empty arrays for each category", () => {
			for (const category of categories) {
				expect(CHAT_TRIGGERS[category].length).toBeGreaterThan(0);
			}
		});

		it("should have lowercase triggers only", () => {
			for (const category of categories) {
				for (const trigger of CHAT_TRIGGERS[category]) {
					expect(trigger).toBe(trigger.toLowerCase());
				}
			}
		});

		it("should have no duplicate triggers across all categories", () => {
			const allTriggers = [
				...CHAT_TRIGGERS.GREETING,
				...CHAT_TRIGGERS.FAREWELL,
				...CHAT_TRIGGERS.CHEER,
				...CHAT_TRIGGERS.QUESTION,
			];
			const uniqueTriggers = new Set(allTriggers);
			expect(uniqueTriggers.size).toBe(allTriggers.length);
		});
	});

	describe("CHAT_RESPONSES", () => {
		const categories = ["GREETING", "FAREWELL", "CHEER", "QUESTION"] as const;

		it("should have all categories", () => {
			for (const category of categories) {
				expect(CHAT_RESPONSES[category]).toBeDefined();
			}
		});

		it("should have at least one response per category", () => {
			for (const category of categories) {
				expect(CHAT_RESPONSES[category].length).toBeGreaterThan(0);
			}
		});

		it("should have {username} placeholder in most responses", () => {
			let totalResponses = 0;
			let responsesWithUsername = 0;

			for (const category of categories) {
				for (const response of CHAT_RESPONSES[category]) {
					totalResponses++;
					if (response.includes("{username}")) {
						responsesWithUsername++;
					}
				}
			}

			// At least 80% of responses should have username placeholder
			const percentage = (responsesWithUsername / totalResponses) * 100;
			expect(percentage).toBeGreaterThanOrEqual(80);
		});
	});

	describe("REACTION_FACES", () => {
		const categories = ["GREETING", "FAREWELL", "CHEER", "QUESTION"] as const;

		it("should have all categories", () => {
			for (const category of categories) {
				expect(REACTION_FACES[category]).toBeDefined();
			}
		});

		it("should only contain valid face indices (0-11)", () => {
			for (const category of categories) {
				for (const faceIndex of REACTION_FACES[category]) {
					expect(faceIndex).toBeGreaterThanOrEqual(0);
					expect(faceIndex).toBeLessThanOrEqual(11);
				}
			}
		});

		it("should have at least one face per category", () => {
			for (const category of categories) {
				expect(REACTION_FACES[category].length).toBeGreaterThan(0);
			}
		});
	});
});
