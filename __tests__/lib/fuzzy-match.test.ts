/**
 * Fuzzy Matching Tests
 */

import { describe, expect, it } from "vitest";

import {
	calculateSimilarity,
	DEFAULT_FUZZY_CONFIG,
	findBestFuzzyMatch,
	fuzzyMatch,
	hasRepeatedEnding,
	levenshteinDistance,
	normalizeTurkish,
	removeRepeatedEnding,
} from "@/lib/utils/fuzzy-match";

describe("Turkish Normalization", () => {
	it("should normalize lowercase Turkish characters", () => {
		expect(normalizeTurkish("şğıöçü")).toBe("sgiocu");
	});

	it("should normalize uppercase Turkish characters", () => {
		expect(normalizeTurkish("ŞĞİÖÇÜ")).toBe("sgiocu");
	});

	it("should handle mixed content", () => {
		expect(normalizeTurkish("Güle Güle")).toBe("Gule Gule");
		expect(normalizeTurkish("İstanbullu")).toBe("istanbullu");
	});

	it("should leave ASCII characters unchanged", () => {
		expect(normalizeTurkish("Hello World 123")).toBe("Hello World 123");
	});
});

describe("Repeated Character Handling", () => {
	it("should detect repeated endings", () => {
		expect(hasRepeatedEnding("selammmm")).toBe(true);
		expect(hasRepeatedEnding("okkk")).toBe(true);
		expect(hasRepeatedEnding("yes")).toBe(false);
		expect(hasRepeatedEnding("no")).toBe(false);
	});

	it("should remove repeated endings", () => {
		expect(removeRepeatedEnding("selammmm")).toBe("selam");
		expect(removeRepeatedEnding("okkk")).toBe("ok");
		expect(removeRepeatedEnding("yesss")).toBe("yes");
	});

	it("should not affect normal words", () => {
		expect(removeRepeatedEnding("selam")).toBe("selam");
		expect(removeRepeatedEnding("hello")).toBe("hello");
	});

	it("should handle edge cases", () => {
		expect(removeRepeatedEnding("aa")).toBe("a");
		expect(removeRepeatedEnding("a")).toBe("a");
		expect(removeRepeatedEnding("")).toBe("");
	});
});

describe("Levenshtein Distance", () => {
	it("should calculate correct distance", () => {
		expect(levenshteinDistance("kitten", "sitting")).toBe(3);
		expect(levenshteinDistance("sunday", "saturday")).toBe(3);
		expect(levenshteinDistance("selam", "selam")).toBe(0);
	});

	it("should handle empty strings", () => {
		expect(levenshteinDistance("", "abc")).toBe(3);
		expect(levenshteinDistance("abc", "")).toBe(3);
		expect(levenshteinDistance("", "")).toBe(0);
	});

	it("should be commutative for length", () => {
		const a = "hello";
		const b = "world";
		expect(levenshteinDistance(a, b)).toBe(levenshteinDistance(b, a));
	});
});

describe("Similarity Calculation", () => {
	it("should return 1.0 for exact matches", () => {
		expect(calculateSimilarity("test", "test")).toBe(1);
	});

	it("should return 0.0 for distinct strings", () => {
		expect(calculateSimilarity("abc", "xyz")).toBe(0);
	});

	it("should calculate similarity ratio correctly", () => {
		// "test" vs "tent" -> distance 1, max length 4 -> 1 - 1/4 = 0.75
		expect(calculateSimilarity("test", "tent")).toBe(0.75);
	});
});

describe("Fuzzy Matching Logic", () => {
	const config = DEFAULT_FUZZY_CONFIG;

	it("should match exact strings", () => {
		expect(fuzzyMatch("merhaba", "merhaba", config)).toBe(1);
	});

	it("should match normalized Turkish strings", () => {
		expect(fuzzyMatch("günaydın", "gunaydin", config)).toBe(1);
	});

	it("should match strings with repeated chars removed", () => {
		expect(fuzzyMatch("selammmm", "selam", config)).toBe(1);
	});

	it("should fail distinct strings", () => {
		expect(fuzzyMatch("hello", "world", config)).toBeNull();
	});

	it("should match based on word length thresholds", () => {
		// Short word (<=3) - Exact match required (distance 0)
		expect(fuzzyMatch("hi", "hi", config)).toBe(1);
		expect(fuzzyMatch("hi", "ho", config)).toBeNull(); // Distance 1, max 0

		// Medium word (4-7) - Similarity >= 0.82
		// "selam" vs "salam" -> distance 1, len 5 -> sim 0.8. 0.8 < 0.82 -> Match Fail
		expect(fuzzyMatch("salam", "selam", config)).toBeNull();

		// "meraba" vs "merhaba" -> distance 1, len 7 -> sim 0.857. 0.857 > 0.82 -> Match
		expect(fuzzyMatch("meraba", "merhaba", config)).toBeGreaterThan(0.82);

		// Long word (>=8) - Similarity >= 0.8
		// "gunaydinlar" (11) vs "gunaydinlar"
		expect(fuzzyMatch("gunaydinlar", "gunaydinlar", config)).toBe(1);
	});
});

describe("Find Best Match", () => {
	const triggers = ["merhaba", "selam", "günaydın", "nasılsın"];
	const config = DEFAULT_FUZZY_CONFIG;

	it("should find the best match from a list", () => {
		const result = findBestFuzzyMatch("meraba", triggers, config);
		expect(result?.trigger).toBe("merhaba");
	});

	it("should return null if no match meets threshold", () => {
		const result = findBestFuzzyMatch("completely_different", triggers, config);
		expect(result).toBeNull();
	});

	it("should prefer exact match over fuzzy", () => {
		const list = ["selam", "selams"];
		// input "selam" should match "selam" perfectly
		const result = findBestFuzzyMatch("selam", list, config);
		expect(result?.trigger).toBe("selam");
		expect(result?.similarity).toBe(1);
	});
});
