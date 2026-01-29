/**
 * Fuzzy Matching Utilities
 */

/** Turkish character mapping */
const TURKISH_CHAR_MAP: Record<string, string> = {
	ş: "s",
	Ş: "s",
	ğ: "g",
	Ğ: "g",
	ü: "u",
	Ü: "u",
	ö: "o",
	Ö: "o",
	ç: "c",
	Ç: "c",
	ı: "i",
	İ: "i",
};

/**
 * Normalizes Turkish characters to ASCII equivalents
 */
export function normalizeTurkish(text: string): string {
	return text
		.split("")
		.map((char) => TURKISH_CHAR_MAP[char] || char)
		.join("");
}

/**
 * Calculates the Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
	// Handle edge cases
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;
	if (a === b) return 0;

	// Create matrix
	const matrix: number[][] = [];

	// Initialize first column
	for (let i = 0; i <= a.length; i++) {
		matrix[i] = [i];
	}

	// Initialize first row
	for (let j = 0; j <= b.length; j++) {
		matrix[0][j] = j;
	}

	// Fill in the rest of the matrix
	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1, // deletion
				matrix[i][j - 1] + 1, // insertion
				matrix[i - 1][j - 1] + cost // substitution
			);
		}
	}

	return matrix[a.length][b.length];
}

/**
 * Calculates similarity ratio between two strings (0 to 1)
 */
export function calculateSimilarity(source: string, target: string): number {
	if (source === target) return 1;
	if (source.length === 0 || target.length === 0) return 0;

	const distance = levenshteinDistance(source, target);
	const maxLength = Math.max(source.length, target.length);

	return 1 - distance / maxLength;
}

/**
 * Checks if a word ends with repeated characters
 */
export function hasRepeatedEnding(text: string): boolean {
	if (text.length < 3) return false;
	const lastChar = text[text.length - 1];
	const secondLast = text[text.length - 2];
	const thirdLast = text[text.length - 3];
	return lastChar === secondLast && secondLast === thirdLast;
}

/**
 * Removes repeated trailing characters
 */
export function removeRepeatedEnding(text: string): string {
	if (text.length < 2) return text;

	let result = text;
	while (result.length >= 2 && result[result.length - 1] === result[result.length - 2]) {
		result = result.slice(0, -1);
	}
	return result;
}

/**
 * Configuration for fuzzy matching thresholds
 */
export interface FuzzyMatchConfig {
	// Maximum Levenshtein distance for short words (≤4 chars)
	shortWordMaxDistance: number;
	shortWordLength: number;
	// Minimum similarity for medium words (5-7 chars)
	mediumWordMinSimilarity: number;
	mediumWordMaxLength: number;
	// Minimum similarity for long words (≥8 chars)
	longWordMinSimilarity: number;
	// Whether to normalize Turkish characters before matching
	normalizeTurkish: boolean;
	// Whether to remove repeated trailing characters
	removeRepeatedChars: boolean;
}

/**
 * Default fuzzy match configuration
 */
export const DEFAULT_FUZZY_CONFIG: FuzzyMatchConfig = {
	shortWordMaxDistance: 0, // Exact match only for short words
	shortWordLength: 3, // Words <= 3 chars are "short"
	mediumWordMinSimilarity: 0.82, // Stricter for 4-7 chars
	mediumWordMaxLength: 7,
	longWordMinSimilarity: 0.8, // Stricter for >= 8 chars
	normalizeTurkish: true,
	removeRepeatedChars: true,
};

/**
 * Checks if source matches target with fuzzy matching
 */
export function fuzzyMatch(
	source: string,
	target: string,
	config: FuzzyMatchConfig = DEFAULT_FUZZY_CONFIG
): number | null {
	// Normalize both strings
	let normalizedSource = source.toLowerCase().trim();
	let normalizedTarget = target.toLowerCase().trim();

	// Apply Turkish normalization if enabled
	if (config.normalizeTurkish) {
		normalizedSource = normalizeTurkish(normalizedSource);
		normalizedTarget = normalizeTurkish(normalizedTarget);
	}

	// Remove repeated characters if enabled
	if (config.removeRepeatedChars) {
		normalizedSource = removeRepeatedEnding(normalizedSource);
	}

	// Exact match after normalization
	if (normalizedSource === normalizedTarget) {
		return 1;
	}

	// Don't fuzzy match if lengths are too different (more than 2x)
	const lengthRatio =
		Math.max(normalizedSource.length, normalizedTarget.length) /
		Math.min(normalizedSource.length, normalizedTarget.length);
	if (lengthRatio > 2) {
		return null;
	}

	// Calculate similarity
	const similarity = calculateSimilarity(normalizedSource, normalizedTarget);
	const distance = levenshteinDistance(normalizedSource, normalizedTarget);
	const targetLength = normalizedTarget.length;

	// Apply different thresholds based on word length
	if (targetLength <= config.shortWordLength) {
		// Short words: use distance threshold
		if (distance <= config.shortWordMaxDistance) {
			return similarity;
		}
	} else if (targetLength <= config.mediumWordMaxLength) {
		// Medium words: use similarity threshold
		if (similarity >= config.mediumWordMinSimilarity) {
			return similarity;
		}
	} else {
		// Long words: use lower similarity threshold
		if (similarity >= config.longWordMinSimilarity) {
			return similarity;
		}
	}

	return null;
}

/**
 * Result of finding the best fuzzy match
 */
export interface FuzzyMatchResult {
	trigger: string;
	similarity: number;
}

/**
 * Finds the best matching trigger from a list using fuzzy matching
 * Returns the best match with its similarity score, or null if no match
 */
export function findBestFuzzyMatch(
	input: string,
	triggers: readonly string[],
	config: FuzzyMatchConfig = DEFAULT_FUZZY_CONFIG
): FuzzyMatchResult | null {
	let bestMatch: FuzzyMatchResult | null = null;

	for (const trigger of triggers) {
		const similarity = fuzzyMatch(input, trigger, config);
		if (similarity !== null) {
			if (bestMatch === null || similarity > bestMatch.similarity) {
				bestMatch = { trigger, similarity };
			}
		}
	}

	return bestMatch;
}
