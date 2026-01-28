/**
 * Comprehensive tests for Kick Chat Trigger Detection System
 */

import { describe, expect, it } from "vitest";

import { detectTrigger, getRandomResponse, getReactionFaceIndex } from "@/lib/services/kick";

describe("detectTrigger", () => {
	describe("GREETING triggers", () => {
		it("should detect basic greetings", () => {
			expect(detectTrigger("merhaba")).toBe("greeting");
			expect(detectTrigger("selam")).toBe("greeting");
			expect(detectTrigger("sa")).toBe("greeting");
			expect(detectTrigger("hey")).toBe("greeting");
			expect(detectTrigger("hi")).toBe("greeting");
		});

		it("should detect greetings with punctuation", () => {
			expect(detectTrigger("Merhaba!")).toBe("greeting");
			expect(detectTrigger("Selam!!!")).toBe("greeting");
			expect(detectTrigger("Hey??")).toBe("greeting");
			expect(detectTrigger("Sa.")).toBe("greeting");
		});

		it("should detect greetings with extended letters", () => {
			expect(detectTrigger("selammmm")).toBe("greeting");
			expect(detectTrigger("heyyyy")).toBe("greeting");
			expect(detectTrigger("hiiii")).toBe("greeting");
			expect(detectTrigger("heyyy")).toBe("greeting");
			expect(detectTrigger("hiii")).toBe("greeting");
		});

		it("should detect greetings within longer messages", () => {
			expect(detectTrigger("Merhaba, iyi yayınlar!")).toBe("greeting");
			// "nasılsınız" is longer than "selam chat", so QUESTION takes priority
			expect(detectTrigger("Selam chat, nasılsınız?")).toBe("question");
			expect(detectTrigger("Herkese selam dostlar")).toBe("greeting");
		});

		it("should detect time-based greetings", () => {
			expect(detectTrigger("günaydın")).toBe("greeting");
			expect(detectTrigger("iyi akşamlar")).toBe("greeting");
			// Note: "iyi geceler" is now only in FAREWELL category
		});

		it("should detect stream-specific greetings", () => {
			expect(detectTrigger("iyi yayınlar")).toBe("greeting");
			expect(detectTrigger("hayırlı yayınlar")).toBe("greeting");
			// Note: "kolay gelsin" is in CHEER category for gaming context
			expect(detectTrigger("kolay gelsin")).toBe("cheer");
		});

		it("should detect religious greetings", () => {
			expect(detectTrigger("selamün aleyküm")).toBe("greeting");
			expect(detectTrigger("as")).toBe("greeting");
			expect(detectTrigger("sea")).toBe("greeting");
		});

		it("should detect arrival announcements", () => {
			expect(detectTrigger("geldim")).toBe("greeting");
			expect(detectTrigger("ben geldim")).toBe("greeting");
			expect(detectTrigger("buradayım")).toBe("greeting");
		});

		it("should match selamlar as greeting", () => {
			expect(detectTrigger("selamlar")).toBe("greeting");
		});
	});

	describe("FAREWELL triggers", () => {
		it("should detect basic farewells", () => {
			expect(detectTrigger("görüşürüz")).toBe("farewell");
			expect(detectTrigger("bb")).toBe("farewell");
			expect(detectTrigger("bye")).toBe("farewell");
			expect(detectTrigger("hoşçakal")).toBe("farewell");
		});

		it("should detect farewells with punctuation", () => {
			expect(detectTrigger("Bye bye!")).toBe("farewell");
			expect(detectTrigger("Görüşürüz...")).toBe("farewell");
			expect(detectTrigger("BB!!!")).toBe("farewell");
		});

		it("should detect night-specific farewells", () => {
			// "iyi geceler" is only in FAREWELL category now
			expect(detectTrigger("iyi geceler")).toBe("farewell");
			expect(detectTrigger("tatlı rüyalar")).toBe("farewell");
			expect(detectTrigger("hayırlı geceler")).toBe("farewell");
		});

		it("should detect departure announcements", () => {
			expect(detectTrigger("gidiyorum")).toBe("farewell");
			expect(detectTrigger("ben kaçar")).toBe("farewell");
			expect(detectTrigger("müsaadenizle")).toBe("farewell");
			expect(detectTrigger("eyvallah")).toBe("farewell");
		});

		it("should detect religious farewells", () => {
			// Apostrophe is now stripped, so the normalized version "allaha emanet" works
			expect(detectTrigger("allaha emanet")).toBe("farewell");
			expect(detectTrigger("allaha ismarladik")).toBe("farewell");
		});
	});

	describe("CHEER triggers", () => {
		it("should detect basic cheers", () => {
			expect(detectTrigger("helal")).toBe("cheer");
			expect(detectTrigger("bravo")).toBe("cheer");
			expect(detectTrigger("aferin")).toBe("cheer");
			expect(detectTrigger("süper")).toBe("cheer");
		});

		it("should detect cheers with punctuation", () => {
			expect(detectTrigger("Bravo!!!")).toBe("cheer");
			expect(detectTrigger("Helal olsun!")).toBe("cheer");
			expect(detectTrigger("Süper!!")).toBe("cheer");
		});

		it("should detect gaming terms", () => {
			expect(detectTrigger("gg")).toBe("cheer");
			expect(detectTrigger("wp")).toBe("cheer");
			expect(detectTrigger("nice")).toBe("cheer");
			expect(detectTrigger("pog")).toBe("cheer");
			expect(detectTrigger("pogchamp")).toBe("cheer");
			expect(detectTrigger("ggwp")).toBe("cheer");
			expect(detectTrigger("clutch")).toBe("cheer");
		});

		it("should detect Turkish gaming slang", () => {
			expect(detectTrigger("yargı")).toBe("cheer");
			expect(detectTrigger("şov")).toBe("cheer");
			expect(detectTrigger("aktı")).toBe("cheer");
			expect(detectTrigger("temiz")).toBe("cheer");
		});

		it("should detect quality praise", () => {
			expect(detectTrigger("harika")).toBe("cheer");
			expect(detectTrigger("muhteşem")).toBe("cheer");
			expect(detectTrigger("efsane")).toBe("cheer");
			expect(detectTrigger("mükemmel")).toBe("cheer");
		});

		it("should detect person praise", () => {
			expect(detectTrigger("kral")).toBe("cheer");
			expect(detectTrigger("kralsın")).toBe("cheer");
			expect(detectTrigger("adam")).toBe("cheer");
			expect(detectTrigger("reis")).toBe("cheer");
		});

		it("should detect excitement expressions", () => {
			// Note: "let's go" with apostrophe becomes "lets go" after normalization
			expect(detectTrigger("lets go")).toBe("cheer");
			expect(detectTrigger("hadi be")).toBe("cheer");
			expect(detectTrigger("ohaa")).toBe("cheer");
			expect(detectTrigger("wow")).toBe("cheer");
			expect(detectTrigger("ohaaa")).toBe("cheer");
		});
	});

	describe("QUESTION triggers", () => {
		it("should detect basic questions", () => {
			expect(detectTrigger("nasılsın")).toBe("question");
			expect(detectTrigger("naber")).toBe("question");
			expect(detectTrigger("ne haber")).toBe("question");
		});

		it("should detect questions with punctuation", () => {
			expect(detectTrigger("Nasılsın?")).toBe("question");
			expect(detectTrigger("Naber??")).toBe("question");
		});

		it("should detect how-are-you variations", () => {
			expect(detectTrigger("nasıl gidiyor")).toBe("question");
			expect(detectTrigger("keyifler nasıl")).toBe("question");
			expect(detectTrigger("durumlar nasıl")).toBe("question");
			expect(detectTrigger("iyi misin")).toBe("question");
		});

		it("should detect slang questions", () => {
			expect(detectTrigger("napıyon")).toBe("question");
			expect(detectTrigger("ne diyon")).toBe("question");
			expect(detectTrigger("ne yapıyorsun")).toBe("question");
		});
	});

	describe("Edge cases", () => {
		it("should be case insensitive", () => {
			expect(detectTrigger("MERHABA")).toBe("greeting");
			expect(detectTrigger("Selam")).toBe("greeting");
			expect(detectTrigger("GG")).toBe("cheer");
			expect(detectTrigger("NABER")).toBe("question");
		});

		it("should handle mixed case with Turkish characters", () => {
			expect(detectTrigger("günaydın")).toBe("greeting");
		});

		it("should handle emojis in messages", () => {
			expect(detectTrigger("Merhaba 🍊")).toBe("greeting");
			expect(detectTrigger("GG 🎉")).toBe("cheer");
		});

		it("should reject very long messages", () => {
			const longMessage = "a".repeat(150);
			expect(detectTrigger(longMessage)).toBe(null);
		});

		it("should reject messages with only emojis/special chars", () => {
			expect(detectTrigger("🍊🍊🍊")).toBe(null);
			expect(detectTrigger("!!!")).toBe(null);
			expect(detectTrigger("...")).toBe(null);
		});

		it("should handle whitespace correctly", () => {
			expect(detectTrigger("  merhaba  ")).toBe("greeting");
			expect(detectTrigger("selam   chat")).toBe("greeting");
		});

		it("should prefer longer/more specific matches", () => {
			expect(detectTrigger("iyi yayınlar")).toBe("greeting");
			expect(detectTrigger("helal olsun")).toBe("cheer");
		});

		it("should not trigger on unrelated messages", () => {
			expect(detectTrigger("hava çok sıcak bugün")).toBe(null);
			expect(detectTrigger("11111")).toBe(null);
		});

		it("should handle combined greeting + question", () => {
			expect(detectTrigger("selam, nasılsın")).not.toBe(null);
		});
	});

	describe("Real-world chat messages", () => {
		it("should handle typical Turkish stream chat messages", () => {
			// Matches are based on the longest trigger found
			expect(detectTrigger("sa chat")).toBe("greeting");
			// "selam portakal" (14 chars) is longer than "nasılsın" (8 chars), so GREETING wins
			expect(detectTrigger("selam portakal, nasılsın bugün?")).toBe("greeting");
			// "devam" is in CHEER
			expect(detectTrigger("yayın çok iyi gidiyor, devam!")).toBe("cheer");
			// "iyi geceler" (11 chars) in FAREWELL is the longest match
			expect(detectTrigger("ben kaçıyorum arkadaşlar, iyi geceler")).toBe("farewell");
		});

		it("should handle gaming context messages", () => {
			expect(detectTrigger("ggwp finalde")).toBe("cheer");
			expect(detectTrigger("nice shot!")).toBe("cheer");
			expect(detectTrigger("clutch yaptın be")).toBe("cheer");
		});
	});

	describe("Fuzzy matching - typo tolerance", () => {
		it("should detect greetings with common typos", () => {
			// Missing letter (closer match)
			expect(detectTrigger("meraba")).toBe("greeting");
			// Extra letter (English plural)
			expect(detectTrigger("selams")).toBe("greeting");
		});

		it("should detect greetings with Turkish char variations", () => {
			// Without Turkish characters
			expect(detectTrigger("gunaydin")).toBe("greeting");
			expect(detectTrigger("iyi aksamlar")).toBe("greeting");
		});

		it("should detect farewells with typos", () => {
			// Turkish char normalization
			expect(detectTrigger("gorusuruz")).toBe("farewell");
			// Typo variations
			expect(detectTrigger("hoscakal")).toBe("farewell");
		});

		it("should detect cheers with typos", () => {
			// Extra letters (already handled by exact match but good to verify)
			expect(detectTrigger("bravoo")).toBe("cheer");
			// Typo
			expect(detectTrigger("helall")).toBe("cheer");
		});

		it("should detect questions with typos", () => {
			// Turkish char normalization
			expect(detectTrigger("nasilsin")).toBe("question");
			// Common variations
			expect(detectTrigger("naberr")).toBe("question");
		});

		it("should NOT false positive on unrelated words", () => {
			expect(detectTrigger("masa")).toBe(null);
			expect(detectTrigger("koltuk")).toBe(null);
			expect(detectTrigger("pencere")).toBe(null);
			expect(detectTrigger("bilgisayar")).toBe(null);
			// "hava" should not trigger "hadi" or "harika" with strict thresholds
			expect(detectTrigger("hava çok sıcak bugün")).toBe(null);
		});

		it("should prefer exact match over fuzzy match", () => {
			// "selam" is an exact match, should not fuzzy match to something else
			expect(detectTrigger("selam")).toBe("greeting");
			// "hey" is an exact match
			expect(detectTrigger("hey")).toBe("greeting");
		});
	});
});

describe("getRandomResponse", () => {
	it("should return a greeting response with username", () => {
		const response = getRandomResponse("greeting", "TestUser");
		expect(response).toContain("TestUser");
		expect(response.length).toBeGreaterThan(0);
	});

	it("should return a farewell response with username", () => {
		const response = getRandomResponse("farewell", "TestUser");
		expect(response).toContain("TestUser");
	});

	it("should return a cheer response", () => {
		const response = getRandomResponse("cheer", "TestUser");
		// Most responses contain username, some don't (e.g., "Portakal power!")
		expect(response.length).toBeGreaterThan(0);
	});

	it("should return a question response with username", () => {
		const response = getRandomResponse("question", "TestUser");
		expect(response).toContain("TestUser");
	});
});

describe("getReactionFaceIndex", () => {
	it("should return a valid face index for greeting", () => {
		const faceIndex = getReactionFaceIndex("greeting");
		expect([1, 3, 4]).toContain(faceIndex);
	});

	it("should return a valid face index for farewell", () => {
		const faceIndex = getReactionFaceIndex("farewell");
		expect([3, 7]).toContain(faceIndex);
	});

	it("should return a valid face index for cheer", () => {
		const faceIndex = getReactionFaceIndex("cheer");
		expect([4]).toContain(faceIndex);
	});

	it("should return a valid face index for question", () => {
		const faceIndex = getReactionFaceIndex("question");
		expect([1, 2, 3]).toContain(faceIndex);
	});
});
