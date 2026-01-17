/**
 * Tests for Type Definitions and Type Guards
 * Ensures type structures are correctly defined
 */

import { describe, expect, it } from "vitest";

import type { Profile, ShopItem, UserStatus } from "@/types/game";
import type { ChatReaction, ChatReactionType, KickConnectionStatus } from "@/types/kick";
import type { LeaderboardMode } from "@/types/leaderboard";

describe("Kick Types (types/kick.ts)", () => {
	describe("ChatReactionType", () => {
		it("should accept valid reaction types", () => {
			const validTypes: ChatReactionType[] = ["greeting", "farewell", "cheer", "question"];
			expect(validTypes).toHaveLength(4);
		});

		it("should be usable in type assertions", () => {
			const reaction: ChatReactionType = "greeting";
			expect(reaction).toBe("greeting");
		});
	});

	describe("KickConnectionStatus", () => {
		it("should have all expected status values", () => {
			const statuses: KickConnectionStatus[] = [
				"disconnected",
				"connecting",
				"connected",
				"error",
			];
			expect(statuses).toHaveLength(4);
		});
	});

	describe("ChatReaction", () => {
		it("should have correct structure", () => {
			const reaction: ChatReaction = {
				id: "test-123",
				type: "greeting",
				username: "TestUser",
				response: "Merhaba TestUser!",
				timestamp: Date.now(),
			};

			expect(reaction.id).toBeDefined();
			expect(reaction.type).toBeDefined();
			expect(reaction.username).toBeDefined();
			expect(reaction.response).toBeDefined();
			expect(reaction.timestamp).toBeDefined();
		});
	});
});

describe("Game Types (types/game.ts)", () => {
	describe("Profile", () => {
		it("should have required fields", () => {
			const profile: Profile = {
				id: "user-123",
				username: "TestPlayer",
				avatar_url: null,
				role: "member",
				multiplier: 1.5,
				score: 1000,
				total_spent: 500,
				base_power: 1,
				active_buffs: [],
			};

			expect(profile.id).toBeDefined();
			expect(profile.multiplier).toBeGreaterThanOrEqual(1);
			expect(profile.score).toBeGreaterThanOrEqual(0);
		});

		it("should support optional total_clicks", () => {
			const profile: Profile = {
				id: "user-123",
				username: null,
				avatar_url: null,
				role: null,
				multiplier: 1,
				score: 0,
				total_spent: 0,
				base_power: 1,
				active_buffs: [],
				total_clicks: 500,
			};

			expect(profile.total_clicks).toBe(500);
		});

		it("should support active_buffs array", () => {
			const profile: Profile = {
				id: "user-123",
				username: "Player",
				avatar_url: null,
				role: "member",
				multiplier: 2,
				score: 100,
				total_spent: 0,
				base_power: 1,
				active_buffs: [
					{ id: "buff-1", expires_at: Date.now() + 3600000, multiplier: 2 },
					{ id: "buff-2", expires_at: Date.now() + 7200000 },
				],
			};

			expect(profile.active_buffs).toHaveLength(2);
			expect(profile.active_buffs[0].multiplier).toBe(2);
		});
	});

	describe("ShopItem", () => {
		it("should have valid item types", () => {
			const types: ShopItem["type"][] = ["upgrade", "face", "consumable"];
			expect(types).toHaveLength(3);
		});

		it("should have correct structure", () => {
			const item: ShopItem = {
				id: 1,
				name: "Power Boost",
				description: "Increases click power",
				price: 100,
				type: "upgrade",
				effect_value: 1.5,
				image_url: null,
			};

			expect(item.id).toBeGreaterThan(0);
			expect(item.price).toBeGreaterThanOrEqual(0);
			expect(item.effect_value).toBeGreaterThan(0);
		});

		it("should support optional fields", () => {
			const consumable: ShopItem = {
				id: 2,
				name: "Double XP",
				description: null,
				price: 500,
				type: "consumable",
				effect_value: 2,
				duration_minutes: 30,
				image_url: "/items/boost.png",
				tier: 2,
				required_item_id: 1,
			};

			expect(consumable.duration_minutes).toBe(30);
			expect(consumable.tier).toBe(2);
			expect(consumable.required_item_id).toBe(1);
		});
	});

	describe("UserStatus", () => {
		it("should have all expected status values", () => {
			const statuses: UserStatus[] = ["member", "guest", "visitor"];
			expect(statuses).toHaveLength(3);
		});
	});
});

describe("Leaderboard Types (types/leaderboard.ts)", () => {
	describe("LeaderboardMode", () => {
		it("should have all expected modes", () => {
			const modes: LeaderboardMode[] = ["daily", "weekly", "all"];
			expect(modes).toHaveLength(3);
		});

		it("should be usable in switch/case", () => {
			const getLabel = (mode: LeaderboardMode): string => {
				switch (mode) {
					case "daily":
						return "Günlük";
					case "weekly":
						return "Haftalık";
					case "all":
						return "Tüm Zamanlar";
				}
			};

			expect(getLabel("daily")).toBe("Günlük");
			expect(getLabel("weekly")).toBe("Haftalık");
			expect(getLabel("all")).toBe("Tüm Zamanlar");
		});
	});
});

describe("Input Validation Logic", () => {
	describe("Click count validation (from game.ts logic)", () => {
		// Recreate validation logic for testing
		const validateClickCount = (count: unknown): { valid: boolean; error?: string } => {
			if (typeof count !== "number" || !Number.isInteger(count)) {
				return { valid: false, error: "Invalid count format" };
			}
			if (count <= 0) {
				return { valid: false, error: "Count must be positive" };
			}
			if (count > 50) {
				return { valid: false, error: "Batch size limit exceeded" };
			}
			return { valid: true };
		};

		it("should accept valid click counts", () => {
			expect(validateClickCount(1).valid).toBe(true);
			expect(validateClickCount(25).valid).toBe(true);
			expect(validateClickCount(50).valid).toBe(true);
		});

		it("should reject zero", () => {
			const result = validateClickCount(0);
			expect(result.valid).toBe(false);
			expect(result.error).toBe("Count must be positive");
		});

		it("should reject negative numbers", () => {
			const result = validateClickCount(-5);
			expect(result.valid).toBe(false);
			expect(result.error).toBe("Count must be positive");
		});

		it("should reject counts over batch limit", () => {
			const result = validateClickCount(51);
			expect(result.valid).toBe(false);
			expect(result.error).toBe("Batch size limit exceeded");

			expect(validateClickCount(100).error).toBe("Batch size limit exceeded");
		});

		it("should reject non-integers", () => {
			expect(validateClickCount(3.14).error).toBe("Invalid count format");
			expect(validateClickCount(10.5).error).toBe("Invalid count format");
		});

		it("should reject non-numbers", () => {
			expect(validateClickCount("10").error).toBe("Invalid count format");
			expect(validateClickCount(null).error).toBe("Invalid count format");
			expect(validateClickCount(undefined).error).toBe("Invalid count format");
			expect(validateClickCount({}).error).toBe("Invalid count format");
		});
	});

	describe("Shop purchase error mapping (from shop.ts logic)", () => {
		// Recreate error mapping logic
		const mapPurchaseError = (error: string): string => {
			if (error === "Insufficient balance") return "Yetersiz Portakal Suyu";
			if (error === "Item already owned") return "Bu eşyaya zaten sahipsiniz";
			return error;
		};

		it("should map 'Insufficient balance' to Turkish", () => {
			expect(mapPurchaseError("Insufficient balance")).toBe("Yetersiz Portakal Suyu");
		});

		it("should map 'Item already owned' to Turkish", () => {
			expect(mapPurchaseError("Item already owned")).toBe("Bu eşyaya zaten sahipsiniz");
		});

		it("should pass through unknown errors unchanged", () => {
			expect(mapPurchaseError("Unknown error")).toBe("Unknown error");
			expect(mapPurchaseError("Server error")).toBe("Server error");
		});
	});

	describe("Auth error responses (from auth.ts logic)", () => {
		// Common auth error responses
		const authErrors = {
			unauthorized: { error: "Unauthorized" },
			discordNotLinked: { error: "Discord account not linked" },
			configError: { error: "Server configuration error" },
			reloginRequired: { action: "relogin", error: "Session upgrade required" },
		};

		it("should have error property in all error responses", () => {
			expect(authErrors.unauthorized.error).toBeDefined();
			expect(authErrors.discordNotLinked.error).toBeDefined();
			expect(authErrors.configError.error).toBeDefined();
			expect(authErrors.reloginRequired.error).toBeDefined();
		});

		it("should have action property for relogin requirement", () => {
			expect(authErrors.reloginRequired.action).toBe("relogin");
		});

		it("should have descriptive error messages", () => {
			expect(authErrors.unauthorized.error.length).toBeGreaterThan(0);
			expect(authErrors.discordNotLinked.error.length).toBeGreaterThan(0);
		});
	});
});
